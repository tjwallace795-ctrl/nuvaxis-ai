import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt, type AssistantProfile } from "@/lib/ai-assistant/config";
import { ASSISTANT_TOOLS, executeTool } from "@/lib/ai-assistant/tools";
import { getLeadCount } from "@/lib/server-lead-cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOL_LABELS: Record<string, string> = {
  search_web:        "Searching the web...",
  get_my_leads:      "Reading your leads...",
  send_email:        "Sending email...",
  research_market:   "Researching your market...",
  scan_social_trends:"Scanning social trends...",
};

/** Strip <script> tags and javascript:/data: URLs from a string. */
function sanitizeMessageContent(text: string): string {
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "");
}

/** Validate and sanitize the incoming messages array. */
function validateMessages(raw: unknown): Anthropic.MessageParam[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.length > 50) return null;

  for (const msg of raw) {
    if (typeof msg !== "object" || msg === null) return null;
    const { content } = msg as { content: unknown };
    if (typeof content === "string" && content.length > 10_000) return null;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (
          typeof block === "object" &&
          block !== null &&
          "text" in block &&
          typeof (block as { text: unknown }).text === "string" &&
          ((block as { text: string }).text).length > 10_000
        ) return null;
      }
    }
  }

  // Sanitize string content fields
  return (raw as Anthropic.MessageParam[]).map((msg) => {
    if (typeof msg.content === "string") {
      return { ...msg, content: sanitizeMessageContent(msg.content) };
    }
    if (Array.isArray(msg.content)) {
      return {
        ...msg,
        content: msg.content.map((block) => {
          if (block.type === "text") {
            return { ...block, text: sanitizeMessageContent(block.text) };
          }
          return block;
        }),
      };
    }
    return msg;
  });
}

export async function POST(req: Request) {
  let body: { messages: unknown; profile?: AssistantProfile };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validatedMessages = validateMessages(body.messages);
  if (!validatedMessages) {
    return Response.json(
      { error: "Invalid messages: must be an array of ≤50 messages, each ≤10,000 chars." },
      { status: 400 }
    );
  }

  const { messages, profile } = {
    messages: validatedMessages as Anthropic.MessageParam[],
    profile: body.profile,
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch { /* client disconnected */ }
      };

      try {
        const leadCount = getLeadCount();
        const systemPrompt = getSystemPrompt(profile, leadCount);
        const toolContext = { profile };

        let currentMessages: Anthropic.MessageParam[] = messages;
        const MAX_ITERATIONS = 8;

        for (let i = 0; i < MAX_ITERATIONS; i++) {
          // Use native streaming so tokens appear in real-time
          const claudeStream = client.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: systemPrompt,
            tools: ASSISTANT_TOOLS,
            tool_choice: { type: "auto" },
            messages: currentMessages,
          });

          // Forward each text token immediately as Claude generates it
          claudeStream.on("text", (text) => {
            send({ type: "text", content: text });
          });

          // Wait for the full message to inspect the stop reason
          const finalMessage = await claudeStream.finalMessage();

          // Clean end — text was already streamed above
          if (finalMessage.stop_reason === "end_turn") {
            break;
          }

          // Tool use — execute tools then loop for the follow-up answer
          if (finalMessage.stop_reason === "tool_use") {
            const toolBlocks = finalMessage.content.filter(
              (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
            );

            // Signal each tool starting
            for (const block of toolBlocks) {
              send({
                type: "tool_start",
                name: block.name,
                label: TOOL_LABELS[block.name] ?? `Using ${block.name}...`,
              });
            }

            // Execute tools in parallel
            const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
              toolBlocks.map(async (block) => {
                const result = await executeTool(
                  block.name,
                  block.input as Record<string, string>,
                  toolContext
                );
                send({ type: "tool_done", name: block.name });
                return {
                  type: "tool_result" as const,
                  tool_use_id: block.id,
                  content: result,
                };
              })
            );

            currentMessages = [
              ...currentMessages,
              { role: "assistant", content: finalMessage.content },
              { role: "user", content: toolResults },
            ];
            continue;
          }

          // Unexpected stop reason — break out
          break;
        }
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.error("Chat stream error:", detail);
        const isBilling = detail.includes("credit balance") || detail.includes("402");
        send({
          type: "error",
          message: isBilling
            ? "Nova is offline — your Anthropic API credits are depleted. Add credits at console.anthropic.com/settings/billing to restore access."
            : "Something went wrong. Please try again.",
        });
      } finally {
        send({ type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

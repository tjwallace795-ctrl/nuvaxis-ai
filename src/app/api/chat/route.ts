import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { services, formatPrice, formatDuration } from "@/data/services";

export const runtime = "nodejs";

const serviceMenu = services
  .map(
    (s) =>
      `- ${s.name} (${s.category}) · ${formatPrice(s)} · ${formatDuration(
        s.durationMin,
      )}\n  ${s.description}`,
  )
  .join("\n");

const SYSTEM_PROMPT = `You are the virtual concierge for Ashbraids, a luxury braiding and natural-hair studio run by stylist Ash.

Personality: warm, concise, confident. Answer in 1–3 short paragraphs or a tight bulleted list. Never invent prices or timing — quote from the menu below. If a question is outside hair, politely redirect.

Studio facts:
- Hours: open every day, 10:30 AM to 7:00 PM (last appointment starts by 7:00 PM).
- Booking: clients can self-serve at /book on this site, or on Booksy.
- Booksy profile: https://booksy.com/en-us/dl/show-business/724017
- Hair is typically included in braiding service prices. Extra length past bra-strap, extra density, or custom colors can add to the quote.
- Ash specializes in knotless, boho knotless, passion twists, and soft locs.

Full service menu (always reference by exact name):
${serviceMenu}

When recommending:
1. Ask 1 clarifying question only if needed (hair length, how long they want the style to last, maintenance level).
2. Suggest 2–3 concrete services from the menu with price + duration.
3. End with a direct invitation to book: "Tap Book to see open slots."`;

type ChatMessage = { role: "user" | "assistant"; content: string };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Chat is not configured. Set ANTHROPIC_API_KEY in your environment.",
      },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0,
  );
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "No messages provided" },
      { status: 400 },
    );
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error contacting Claude.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

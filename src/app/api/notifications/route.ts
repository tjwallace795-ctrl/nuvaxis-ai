import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { industry, type } = await req.json();

    const prompts: Record<string, string> = {
      lead: `Generate a realistic, specific new lead notification for a ${industry} professional.
Format: one short sentence (max 15 words) that sounds like an actual alert, e.g. "Sarah M. from Zillow inquiry — interested in 3-bed homes under $320K in Eastside."
Be specific with a realistic name, source, and property/service detail. Vary the names, sources, and details each time. No quotes, no prefix.`,

      content: `Generate a trending content idea notification for a ${industry} professional based on what's popular on social media right now in 2026.
Format: one short sentence (max 18 words) describing a specific trending topic or video style, e.g. "\"Rate drop reaction\" videos trending on TikTok — agents showing live client reactions to new rates."
Be specific and creative. No quotes around the full sentence. No prefix.`,
    };

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 80,
      messages: [{ role: "user", content: prompts[type] || prompts.lead }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text.trim() : "";

    return Response.json({ text });
  } catch (error) {
    console.error("Notifications API error:", error);
    return Response.json({ error: "Failed to generate" }, { status: 500 });
  }
}

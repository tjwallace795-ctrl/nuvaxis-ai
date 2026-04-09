import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { platform, handle, industry, niche, businessName } = await req.json();

    const platformGuide: Record<string, string> = {
      Instagram: "Reels (short-form video), carousels, Stories, and aesthetic photo posts.",
      TikTok:    "Short-form vertical video (7–60 sec), trending audio, text overlays, and duets.",
      YouTube:   "Long-form tutorials, Shorts (under 60 sec), vlogs, and how-to series.",
    };

    const formatHint = platformGuide[platform] ?? "short-form video and engaging posts.";

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 450,
      messages: [
        {
          role: "user",
          content: `You are Nova, an elite social media growth strategist for small businesses.

Business: "${businessName}" — a ${niche || industry} business.
Platform: ${platform} (handle: ${handle})
Primary content format on ${platform}: ${formatHint}

Give them a sharp, actionable content strategy. Cover exactly these 4 points (plain text, no markdown headers or bullets — just flowing paragraphs):

1. The 2 best content formats for a ${niche || industry} business on ${platform} right now and why they convert.
2. Best posting frequency and the single best time of day for ${platform}.
3. One specific trending content angle they should try THIS WEEK for their niche.
4. The #1 mistake ${niche || industry} businesses make on ${platform} and how to fix it.

Keep it energizing and direct. Max 200 words total.`,
        },
      ],
    });

    const review = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
    return Response.json({ review });
  } catch (error) {
    console.error("Social review error:", error);
    return Response.json(
      { review: "Unable to generate analysis right now. Please try again." },
      { status: 500 }
    );
  }
}

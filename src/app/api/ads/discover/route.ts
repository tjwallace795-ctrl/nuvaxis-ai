/**
 * Ad Campaign — Discovery Suggestions
 * Returns offer ideas, audience suggestions, and platform recommendation
 * based on the user's niche / business type.
 */

import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rate-limiter";
import { getClientIP } from "@/lib/clark-security";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const ip = getClientIP(req.headers as unknown as Headers);
  const { allowed } = rateLimit(ip, 30, 60_000);
  if (!allowed) return Response.json({ error: "Too many requests." }, { status: 429 });

  let body: { niche?: string; businessName?: string; location?: string };
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid body." }, { status: 400 }); }

  const { niche, businessName, location } = body;
  if (!niche) return Response.json({ error: "Niche is required." }, { status: 400 });

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: "You are a concise ad strategist. Return only valid JSON, no explanation.",
      messages: [{
        role: "user",
        content: `Generate ad campaign suggestions for:
Business: ${businessName || niche}
Niche: ${niche}
Location: ${location || "not specified"}

Return this exact JSON:
{
  "offerSuggestions": [
    "short specific offer (under 10 words)",
    "short specific offer (under 10 words)",
    "short specific offer (under 10 words)"
  ],
  "audienceSuggestions": [
    "specific audience description (under 12 words)",
    "specific audience description (under 12 words)",
    "specific audience description (under 12 words)"
  ],
  "platformRecommendation": {
    "platform": "Meta | TikTok | YouTube | Google | LinkedIn",
    "reason": "one sentence why this platform fits this niche best"
  },
  "hookIdeas": [
    "short punchy hook (under 8 words)",
    "short punchy hook (under 8 words)",
    "short punchy hook (under 8 words)"
  ]
}`,
      }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text).join("");

    let suggestions = null;
    try { suggestions = JSON.parse(text); } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) try { suggestions = JSON.parse(m[0]); } catch { /* fall through */ }
    }

    if (!suggestions) return Response.json({ error: "Could not generate suggestions." }, { status: 500 });
    return Response.json({ suggestions });
  } catch {
    return Response.json({ error: "Failed to generate suggestions." }, { status: 500 });
  }
}

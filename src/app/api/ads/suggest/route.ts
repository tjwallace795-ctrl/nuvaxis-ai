/**
 * Ad Campaign — Video Description Generator
 * Builds a detailed, specific description from the user's video briefing
 * combined with their business context. Strict to what's actually in the video.
 */

import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rate-limiter";
import { getClientIP } from "@/lib/clark-security";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const ip = getClientIP(req.headers as unknown as Headers);
  const { allowed } = rateLimit(ip, 20, 60_000);
  if (!allowed) return Response.json({ error: "Too many requests." }, { status: 429 });

  let body: {
    niche?: string;
    offer?: string;
    platform?: string;
    businessName?: string;
    // Structured video briefing fields
    videoHook?: string;
    videoContent?: string;
    videoCTA?: string;
    videoTone?: string;
    fileName?: string;
  };
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid body." }, { status: 400 }); }

  const { niche, offer, platform, businessName, videoHook, videoContent, videoCTA, videoTone, fileName } = body;
  if (!niche || !offer || !platform) return Response.json({ error: "Missing required fields." }, { status: 400 });

  const hasVideoDetails = videoHook || videoContent || videoCTA;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: "You are a precise ad creative director. Write a detailed video ad description that is STRICTLY based on the video details provided. Do not invent elements not mentioned. Be specific, not generic.",
      messages: [{
        role: "user",
        content: `Write a detailed video ad analysis/description for campaign use.

BUSINESS CONTEXT:
- Business: ${businessName || niche}
- Niche: ${niche}
- Offer: ${offer}
- Platform: ${platform}

VIDEO DETAILS (base the description STRICTLY on this):
${fileName ? `- File: ${fileName}` : ""}
${videoHook ? `- Opening hook (first 3 sec): ${videoHook}` : ""}
${videoContent ? `- Main video content: ${videoContent}` : ""}
${videoCTA ? `- Call to action: ${videoCTA}` : ""}
${videoTone ? `- Tone/style: ${videoTone}` : ""}
${!hasVideoDetails ? "- No video details provided — generate an ideal video concept for this business/offer/platform combination" : ""}

Write 4-6 sentences describing:
1. Exactly what happens in the opening 3 seconds based on what was described
2. How the video content connects to the ${niche} business offer
3. Whether the tone/pacing fits ${platform} best practices
4. The CTA and how it closes
5. Any audience alignment notes

Be strict — only describe what was actually provided. Do not add fictional elements.`,
      }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text).join("").trim();

    return Response.json({ description: text });
  } catch {
    return Response.json({ error: "Could not generate description." }, { status: 500 });
  }
}

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  RON — Lead Ad Architect · Campaign Generation API          ║
 * ║  QA checked by: Nova (Backend Developer & QA Tester)        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rate-limiter";
import { getClientIP } from "@/lib/clark-security";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  // Clark: rate limit
  const ip = getClientIP(req.headers as unknown as Headers);
  const { allowed } = rateLimit(ip, 10, 60_000);
  if (!allowed) {
    return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  let body: {
    niche?: string;
    offer?: string;
    targetAudience?: string;
    platform?: string;
    videoDescription?: string;
    businessName?: string;
    location?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { niche, offer, targetAudience, platform, videoDescription, businessName, location } = body;

  if (!niche || !offer || !targetAudience || !platform) {
    return Response.json(
      { error: "Missing required fields: niche, offer, targetAudience, platform." },
      { status: 400 }
    );
  }

  const systemPrompt = `You are a precision-engineered ad campaign architect. Your job is to generate high-performance, platform-compliant ad campaigns. Be specific, critical, and data-driven. Never use generic marketing fluff. If the offer seems weak, say so. IMPORTANT: Critically evaluate whether the video content actually matches the intended target audience. If someone describes entertainment content (e.g. gaming videos, influencer content, celebrity-style videos) but is targeting a different audience (e.g. homebuyers, business clients), flag this as a Mismatch and explain specifically what the problem is and how to fix it. Return only valid JSON — no markdown, no explanation.`;

  const userPrompt = `Generate a complete ad campaign architecture for:
Business: ${businessName || niche}
Location: ${location || "Not specified"}
Niche: ${niche}
Offer: ${offer}
Target Audience: ${targetAudience}
Platform: ${platform}
Video Asset: ${videoDescription || "No video provided — base analysis on niche and offer only. Note this in the creative audit."}

Return ONLY this exact JSON structure (no extra text):
{
  "strategicIntent": "string",
  "trendAlignment": "string (2-3 sentences on why this approach works right now)",
  "adStyle": "UGC Raw | Problem-Solution | The Breakdown | Social Proof Loop",
  "creativeAudit": {
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "threeSec": "string",
    "pacing": "string",
    "safeZones": "string"
  },
  "adCopies": [
    {
      "type": "Direct Hook",
      "hook": "string (opening 3 seconds)",
      "headline": "string",
      "primaryText": "string (2-3 sentences)",
      "cta": "string",
      "complianceStatus": "Green | Yellow | Red",
      "complianceNote": "string"
    },
    {
      "type": "Story Hook",
      "hook": "string (opening 3 seconds)",
      "headline": "string",
      "primaryText": "string (2-3 sentences)",
      "cta": "string",
      "complianceStatus": "Green | Yellow | Red",
      "complianceNote": "string"
    },
    {
      "type": "Question Hook",
      "hook": "string (opening 3 seconds)",
      "headline": "string",
      "primaryText": "string (2-3 sentences)",
      "cta": "string",
      "complianceStatus": "Green | Yellow | Red",
      "complianceNote": "string"
    }
  ],
  "technicalSetup": {
    "objective": "string",
    "audienceInterests": ["string", "string", "string", "string"],
    "placements": ["string", "string"],
    "adFormat": "string",
    "bidStrategy": "string"
  },
  "complianceScore": "Green | Yellow | Red",
  "complianceFlags": ["string"],
  "audienceAlignment": {
    "score": "Strong | Weak | Mismatch",
    "issue": "string — if Mismatch or Weak, explain specifically WHY the video content may attract the wrong audience (e.g. entertainment viewers instead of homebuyers). If Strong, write empty string.",
    "recommendation": "string — specific fix if Mismatch/Weak, otherwise empty string"
  },
  "budget": {
    "dailyBudgetMin": number,
    "dailyBudgetMax": number,
    "estimatedCPCMin": number,
    "estimatedCPCMax": number,
    "targetCPA": number,
    "weeklyConversionGoal": number,
    "learningPhaseNote": "string"
  }
}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Nova QA: 3-layer JSON parse
    let campaign: unknown = null;
    try {
      campaign = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { campaign = JSON.parse(match[0]); } catch { /* fall through */ }
      }
    }

    if (!campaign) {
      return Response.json({ error: "Ron couldn't generate a valid campaign. Please try again." }, { status: 500 });
    }

    return Response.json({ campaign });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[RON] Campaign generation failed:", detail);
    const isBilling = detail.includes("credit balance") || detail.includes("402");
    return Response.json(
      {
        error: isBilling
          ? "AI credits depleted. Add credits at console.anthropic.com to restore Ron."
          : "Campaign generation failed. Please try again.",
      },
      { status: 500 }
    );
  }
}

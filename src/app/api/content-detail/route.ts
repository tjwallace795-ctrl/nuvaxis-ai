import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { businessName, industry, niche, idea } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: `You are a social media growth strategist. Create a detailed, actionable content guide for:

BUSINESS: ${businessName}
INDUSTRY: ${industry}${niche ? `\nNICHE: ${niche}` : ""}
CONTENT IDEA: ${idea.label} — ${idea.sub}
PLATFORM: ${idea.platform}

Generate a complete guide as a JSON object with these fields:
- "title": catchy title for this guide (max 8 words)
- "tldr": one punchy sentence summary (max 15 words)
- "why": 2-3 sentences on WHY this content works for ${businessName} specifically right now
- "steps": array of 5-6 steps, each with "step" (short label) and "detail" (1-2 sentences of specific guidance)
- "hooks": array of 3 strong opening lines/hooks they can use verbatim
- "hashtags": array of 8-10 relevant hashtags (include the # symbol)
- "bestTime": best time to post this content (e.g. "Tuesday–Thursday, 7–9 PM")
- "script": a 30-second script or caption template they can use almost verbatim (3-5 sentences)
- "proTip": one insider tip most people in ${industry} miss (1-2 sentences)
- "expectedResult": what they can realistically expect in 7-14 days if they do this well (1 sentence)

Make everything SPECIFIC to ${businessName} — mention their industry, likely customers, and real tactics. Not generic advice.
Return ONLY valid JSON.`
      }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "{}";
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    let guide;
    try {
      guide = JSON.parse(cleaned);
    } catch {
      guide = null;
    }

    return Response.json({ guide });
  } catch (error) {
    console.error("Content detail error:", error);
    return Response.json({ guide: null }, { status: 500 });
  }
}

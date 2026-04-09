import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { lead, businessType, offer, market, senderName } = await req.json();

    if (!lead || !businessType) {
      return Response.json({ error: "Missing lead or business type." }, { status: 400 });
    }

    const platform = lead.outreachChannel ?? "direct message";
    const isDM = platform.toLowerCase().includes("dm") || platform.toLowerCase().includes("message") || platform.toLowerCase().includes("instagram") || platform.toLowerCase().includes("twitter") || platform.toLowerCase().includes("reddit");

    const prompt = `You are writing outreach messages on behalf of a ${businessType} who helps ${lead.leadType === "B2B" ? "business owners" : "people"} with: ${offer || `professional ${businessType} services`}. They are based in ${market}.

The lead is: ${lead.name}
Platform: ${lead.source}
What they said: "${lead.intentSignal}"
Their location: ${lead.location}
Why they need help: ${lead.whyTheyNeedYou}
Best outreach channel: ${platform}

Write TWO outreach messages. Return as JSON with exactly this shape:
{
  "email": {
    "subject": "Short compelling subject line (under 9 words)",
    "body": "Professional but warm email. 3-4 short paragraphs. Reference what they specifically said or need. End with a clear soft CTA (ask a question or offer a free consult). No hard sell. Sign off as '${senderName || "Your Name"}'. Under 200 words."
  },
  "dm": {
    "platform": "${isDM ? platform : "Direct Message"}",
    "message": "Casual, conversational direct message for ${platform}. 2-3 sentences max. Reference their specific situation. Friendly opener, brief value prop, soft question CTA. No formalities. Under 80 words."
  }
}

Return ONLY the JSON object. No markdown, no explanation.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    let draft = null;
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) draft = JSON.parse(match[0]);
    } catch {
      return Response.json({ error: "Failed to generate message." }, { status: 500 });
    }

    return Response.json(draft);
  } catch (error) {
    console.error("Draft API error:", error);
    return Response.json({ error: "Failed to generate outreach." }, { status: 500 });
  }
}

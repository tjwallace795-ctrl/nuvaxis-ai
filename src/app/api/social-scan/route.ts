import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface SerperResult {
  title: string;
  link: string;
  snippet?: string;
  date?: string;
}
interface SerperResponse {
  organic?: SerperResult[];
  answerBox?: { snippet?: string };
}

async function serperSearch(query: string): Promise<SerperResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ q: query, num: 5, tbs: "qdr:m" }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data: SerperResponse = await res.json();
    return data.organic ?? [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { businessName, industry, niche, location } = await req.json();

    // Run 3 searches in parallel: social presence, trending content, market health
    const [socialResults, trendingResults, marketResults] = await Promise.all([
      serperSearch(`"${businessName}" ${industry} social media Instagram TikTok YouTube presence 2026`),
      serperSearch(`${niche ?? industry} content ideas trending social media 2026`),
      serperSearch(`${niche ?? industry} market growth trends ${location ?? ""} 2026`),
    ]);

    const formatResults = (results: SerperResult[]) =>
      results.slice(0, 4).map((r, i) =>
        `${i + 1}. ${r.title}${r.date ? ` (${r.date})` : ""}\n${r.snippet ?? ""}\n${r.link}`
      ).join("\n\n");

    const scanContext = `
BUSINESS: ${businessName} | INDUSTRY: ${industry}${niche ? ` | NICHE: ${niche}` : ""}${location ? ` | LOCATION: ${location}` : ""}

--- SOCIAL MEDIA PRESENCE SCAN ---
${formatResults(socialResults) || "No social presence data found — assume they are early stage."}

--- TRENDING CONTENT IN THEIR SPACE ---
${formatResults(trendingResults) || "No trending data found."}

--- MARKET HEALTH DATA ---
${formatResults(marketResults) || "No market data found."}
`.trim();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `You are a social media strategist analyzing a business's online presence.

Based on this real-time scan data, generate exactly 4 tailored content ideas for ${businessName}.

${scanContext}

Respond with a JSON array of exactly 4 objects. Each object must have:
- "emoji": one relevant emoji
- "label": short punchy title (2-4 words)
- "sub": one sentence describing what to post (max 12 words)
- "why": one sentence explaining why this works for their specific business RIGHT NOW (max 18 words)
- "platform": best platform ("TikTok", "Instagram", "YouTube", "Google Business", or "All")
- "urgency": "🔥 Trending Now" | "⚡ Quick Win" | "📈 High Impact" | "🎯 Audience Builder"
- "hook": an opening line they could use (max 12 words)

Make every idea SPECIFIC to ${businessName} and their ${industry} business. Reference real things from the scan if possible.
Return ONLY valid JSON, no other text.`
      }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "[]";

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    let ideas;
    try {
      ideas = JSON.parse(cleaned);
    } catch {
      ideas = [];
    }

    // Market health summary from the scan
    const marketSummary = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 120,
      messages: [{
        role: "user",
        content: `Based on this market data for ${niche ?? industry}:
${formatResults(marketResults) || "No data."}

Give a ONE sentence market status for ${businessName}. Format: "[Growing/Stable/Slowing] — [one specific insight]". Max 20 words. No quotes.`
      }],
    });

    const marketStatus = marketSummary.content[0].type === "text"
      ? marketSummary.content[0].text.trim()
      : "Market data unavailable — check back shortly.";

    return Response.json({ ideas, marketStatus, scannedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Social scan error:", error);
    return Response.json({ ideas: [], marketStatus: "", scannedAt: new Date().toISOString() });
  }
}

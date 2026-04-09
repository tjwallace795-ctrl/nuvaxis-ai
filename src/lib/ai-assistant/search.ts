import type { SerperSearchResponse } from "./types";

/**
 * Search the web using Serper.dev — Google results at $1 per 1,000 queries.
 * Requires SERPER_API_KEY in environment variables.
 * Get a free key (2,500 searches free) at: https://serper.dev
 */
export async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    return [
      "Real-time search is not configured.",
      "To enable live market data, add SERPER_API_KEY to your .env.local file.",
      "Get 2,500 free searches at serper.dev",
      "",
      "Answering from training knowledge instead (data may not reflect current 2026 conditions).",
    ].join("\n");
  }

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ q: query, num: 6, tbs: "qdr:m" }), // tbs=qdr:m → past month
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return `Search returned status ${res.status}. Proceeding with training knowledge.`;
    }

    const data: SerperSearchResponse = await res.json();
    const parts: string[] = [];

    // Answer box — often has the direct answer (e.g. current mortgage rate)
    if (data.answerBox?.answer || data.answerBox?.snippet) {
      parts.push(
        `**Quick Answer:** ${data.answerBox.answer ?? data.answerBox.snippet}`
      );
    }

    // Organic results
    const results = data.organic ?? [];
    if (results.length === 0 && parts.length === 0) {
      return "No web results found for that query.";
    }

    results.forEach((r, i) => {
      const date = r.date ? ` (${r.date})` : "";
      parts.push(`${i + 1}. **${r.title}**${date}\n${r.snippet}\nSource: ${r.link}`);
    });

    return parts.join("\n\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return `Search failed: ${msg}. Answering from training knowledge.`;
  }
}

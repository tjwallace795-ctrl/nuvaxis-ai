import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface SerperVideoResult {
  title: string;
  link: string;
  snippet?: string;
  imageUrl?: string;
  duration?: string;
  source?: string;
  channel?: string;
  date?: string;
  views?: string;
}
interface SerperVideoResponse {
  videos?: SerperVideoResult[];
}

function parseRecency(dateStr?: string): number {
  if (!dateStr) return 0.3;
  const d = dateStr.toLowerCase();
  if (d.includes("hour") || d.includes("min")) return 1.0;
  if (d.includes("day")) {
    const n = parseInt(d) || 1;
    return Math.max(0, 1 - n / 30);
  }
  if (d.includes("week")) {
    const n = parseInt(d) || 1;
    return Math.max(0, 1 - (n * 7) / 30);
  }
  if (d.includes("month")) {
    const n = parseInt(d) || 1;
    return Math.max(0, 1 - n / 6);
  }
  return 0.2;
}

function computeTrendScore(opts: {
  position: number;
  dateStr?: string;
  nicheKeywordsMatched: number;
  totalKeywords: number;
}): number {
  const recency   = parseRecency(opts.dateStr) * 0.20;
  const velocity  = (1 - (opts.position - 1) / 8) * 0.25;
  const engagement = 0.5 * 0.20;
  const occupationMatch = (opts.nicheKeywordsMatched / Math.max(opts.totalKeywords, 1)) * 0.20;
  const nicheRelevance  = (opts.nicheKeywordsMatched > 0 ? 1 : 0) * 0.10;
  const platformNorm    = 0.5 * 0.05;
  const raw = recency + velocity + engagement + occupationMatch + nicheRelevance + platformNorm;
  return Math.min(99, Math.round(raw * 100));
}

function detectPlatform(link: string): string {
  if (link.includes("tiktok.com")) return "TikTok";
  if (link.includes("instagram.com")) return "Instagram";
  if (link.includes("youtube.com") || link.includes("youtu.be")) return "YouTube";
  if (link.includes("twitter.com") || link.includes("x.com")) return "Twitter";
  return "Web";
}

function parseViews(viewsStr?: string): number {
  if (!viewsStr) return 0;
  const s = viewsStr.toLowerCase().replace(/,/g, "");
  const bMatch = s.match(/([\d.]+)\s*b/);
  if (bMatch) return parseFloat(bMatch[1]) * 1_000_000_000;
  const mMatch = s.match(/([\d.]+)\s*m/);
  if (mMatch) return parseFloat(mMatch[1]) * 1_000_000;
  const kMatch = s.match(/([\d.]+)\s*k/);
  if (kMatch) return parseFloat(kMatch[1]) * 1_000;
  const numMatch = s.match(/([\d]+)/);
  if (numMatch) return parseInt(numMatch[1]);
  return 0;
}

// 16 different content angles → surfaces different channels each page
const QUERY_ANGLES: ((n: string, i: string) => string)[] = [
  (n, i) => `${n || i} tips tricks`,
  (_n, i) => `${i} expert advanced strategy`,
  (n, i) => `${n || i} beginner guide how to`,
  (_n, i) => `${i} small business entrepreneur`,
  (n, i) => `${n || i} trending viral`,
  (_n, i) => `${i} common mistakes avoid`,
  (n, i) => `${n || i} transformation results before after`,
  (_n, i) => `${i} day in the life behind scenes`,
  (n, i) => `${n || i} Q&A questions answers`,
  (_n, i) => `${i} local business owner`,
  (n, i) => `${n || i} rising creator growing`,
  (_n, i) => `${i} revenue income money`,
  (n, i) => `${n || i} challenge reaction trend`,
  (_n, i) => `${i} review honest opinion`,
  (n, i) => `${n || i} social media growth strategy`,
  (_n, i) => `${i} success story interview`,
];

// Secondary queries target different creator types than primary
const SECONDARY_ANGLES: ((n: string, i: string) => string)[] = [
  (_n, i) => `${i} new creator hidden gem`,
  (n, i) => `${n || i} viral video different creator`,
  (_n, i) => `${i} underrated niche community`,
  (n, i) => `${n || i} unique perspective take`,
  (_n, i) => `${i} micro creator authentic`,
  (n, i) => `${n || i} recent upload trending now`,
];

function buildQuery(industry: string, niche: string, platform: string, page: number): string {
  const angleFn = QUERY_ANGLES[page % QUERY_ANGLES.length];
  const base = angleFn(niche, industry);
  if (platform === "TikTok") return `${base} TikTok`;
  if (platform === "Instagram") return `${base} Instagram Reels`;
  if (platform === "YouTube") return `${base} YouTube`;
  return base;
}

function buildSecondaryQuery(industry: string, niche: string, platform: string, page: number): string {
  const angleFn = SECONDARY_ANGLES[page % SECONDARY_ANGLES.length];
  const base = angleFn(niche, industry);
  if (platform === "TikTok") return `${base} TikTok`;
  if (platform === "Instagram") return `${base} Instagram Reels`;
  if (platform === "YouTube") return `${base} YouTube`;
  return base;
}

async function fetchVideos(query: string): Promise<SerperVideoResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch("https://google.serper.dev/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ q: query, num: 10 }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data: SerperVideoResponse = await res.json();
    return data.videos ?? [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { industry, niche, platform = "All", page = 0 } = await req.json();

    const nicheWords = (niche || industry).toLowerCase().split(/\s+/);
    const query = buildQuery(industry, niche, platform, page);

    // Two searches in parallel — different angles for channel variety
    const secondaryQuery = buildSecondaryQuery(industry, niche, platform, page);
    const [primary, secondary] = await Promise.all([
      fetchVideos(query),
      fetchVideos(secondaryQuery),
    ]);

    // Merge, deduplicate by link
    const seen = new Set<string>();
    const merged: SerperVideoResult[] = [];
    for (const v of [...primary, ...secondary]) {
      if (!seen.has(v.link)) {
        seen.add(v.link);
        merged.push(v);
      }
    }

    // Filter: keep only videos with 20k+ views (unknown view count passes through)
    const MIN_VIEWS = 20_000;
    const viewFiltered = merged.filter(v => {
      const views = parseViews(v.views);
      return views === 0 || views >= MIN_VIEWS;
    });

    // Channel diversity: max 2 videos per channel so same person doesn't dominate
    const channelCount = new Map<string, number>();
    const diversified = viewFiltered.filter(v => {
      const ch = (v.channel || v.source || "unknown").toLowerCase().trim();
      const count = channelCount.get(ch) ?? 0;
      if (count >= 2) return false;
      channelCount.set(ch, count + 1);
      return true;
    });

    // Score and shape
    const videos = diversified.slice(0, 12).map((v, i) => {
      const snippet = (v.snippet ?? "").toLowerCase();
      const title   = (v.title ?? "").toLowerCase();
      const text    = snippet + " " + title;
      const matched = nicheWords.filter((w: string) => w.length > 3 && text.includes(w)).length;

      return {
        id:       `${page}-${i}-${v.link.slice(-8)}`,
        title:    v.title,
        link:     v.link,
        snippet:  v.snippet ?? "",
        imageUrl: v.imageUrl ?? "",
        duration: v.duration ?? "",
        channel:  v.channel ?? v.source ?? "Unknown",
        date:     v.date ?? "",
        views:    v.views ?? "",
        platform: detectPlatform(v.link),
        trendScore: computeTrendScore({
          position: i + 1,
          dateStr:  v.date,
          nicheKeywordsMatched: matched,
          totalKeywords: nicheWords.length,
        }),
      };
    });

    // AI insight — batch summary for this page of results
    let aiInsight = "";
    if (videos.length > 0) {
      const titles = videos.slice(0, 6).map(v => v.title).join(" | ");
      try {
        const msg = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 120,
          messages: [{
            role: "user",
            content: `You're a social media growth advisor for a ${niche || industry} business.
These are trending videos right now: "${titles}"
Write ONE punchy 1-sentence takeaway about what this trend means for a ${niche || industry} business and what they should post TODAY. Max 22 words. No quotes, no preamble.`,
          }],
        });
        aiInsight = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
      } catch {
        aiInsight = `These trending ${industry} videos signal strong audience demand — post similar content this week.`;
      }
    }

    return Response.json({ videos, aiInsight, nextPage: page + 1, hasMore: videos.length >= 6 });
  } catch (error) {
    console.error("Explore feed error:", error);
    return Response.json({ videos: [], aiInsight: "", nextPage: 0, hasMore: false }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

// ── Serper search helper ──────────────────────────────────────────────────────
async function serperSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return "";
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ q: query, num: 5 }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return "";
    const data = await res.json() as {
      knowledgeGraph?: { description?: string; attributes?: Record<string, string> };
      organic?: { title: string; snippet: string; link: string }[];
    };
    const parts: string[] = [];
    if (data.knowledgeGraph?.description) parts.push(data.knowledgeGraph.description);
    if (data.knowledgeGraph?.attributes) {
      parts.push(Object.entries(data.knowledgeGraph.attributes).map(([k, v]) => `${k}: ${v}`).join(" | "));
    }
    (data.organic ?? []).slice(0, 4).forEach(r => parts.push(`${r.title} — ${r.snippet}`));
    return parts.join("\n");
  } catch {
    return "";
  }
}

// ── Number parsing ────────────────────────────────────────────────────────────
function parseShortNum(str: string): number {
  const s = str.replace(/,/g, "").trim();
  const n = parseFloat(s);
  if (isNaN(n)) return 0;
  const suffix = s.slice(-1).toUpperCase();
  if (suffix === "K") return Math.round(n * 1_000);
  if (suffix === "M") return Math.round(n * 1_000_000);
  if (suffix === "B") return Math.round(n * 1_000_000_000);
  return Math.round(n);
}

function extractFollowers(text: string): number {
  const patterns = [
    /(\d[\d,.]*[KkMmBb]?)\s*Followers/i,
    /Followers[:\s·|]+(\d[\d,.]*[KkMmBb]?)/i,
    /(\d[\d,.]*[KkMmBb]?)\s*subscribers/i,
    /subscribers[:\s·|]+(\d[\d,.]*[KkMmBb]?)/i,
    /(\d[\d,.]*[KkMmBb]?)\s*fans/i,
    /(\d[\d,.]*[KkMmBb]?)\s*Likes\b.*?Followers/i,
  ];
  let best = 0;
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) {
      const val = parseShortNum(m[1]);
      if (val > best) best = val;
    }
  }
  return best;
}

function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ── Website page count ────────────────────────────────────────────────────────
function extractPageCount(text: string): number {
  const m = text.match(/About ([\d,]+) results/);
  return m ? parseInt(m[1].replace(/,/g, "")) : 0;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const { instagram, tiktok, youtube, website, businessName } = await request.json() as {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
    businessName?: string;
  };

  const igHandle  = (instagram ?? "").replace("@", "").trim();
  const ttHandle  = (tiktok ?? "").replace("@", "").trim();
  const ytHandle  = (youtube ?? "").replace("@", "").trim();
  const siteHost  = (website ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "").trim();

  // Run all searches in parallel
  const [igText, ttText, ytText, siteText] = await Promise.all([
    igHandle ? serperSearch(`site:instagram.com/${igHandle} followers`) : Promise.resolve(""),
    ttHandle ? serperSearch(`site:tiktok.com/@${ttHandle} followers`) : Promise.resolve(""),
    ytHandle ? serperSearch(`youtube.com/@${ytHandle} subscribers`) : Promise.resolve(""),
    siteHost ? serperSearch(`site:${siteHost}`) : Promise.resolve(""),
  ]);

  const platforms: { name: string; handle: string; followers: number; formatted: string }[] = [];

  if (igHandle) {
    const count = extractFollowers(igText);
    platforms.push({ name: "Instagram", handle: `@${igHandle}`, followers: count, formatted: count > 0 ? formatReach(count) : "—" });
  }
  if (ttHandle) {
    const count = extractFollowers(ttText);
    platforms.push({ name: "TikTok", handle: `@${ttHandle}`, followers: count, formatted: count > 0 ? formatReach(count) : "—" });
  }
  if (ytHandle) {
    const count = extractFollowers(ytText);
    platforms.push({ name: "YouTube", handle: `@${ytHandle}`, followers: count, formatted: count > 0 ? formatReach(count) : "—" });
  }

  const totalReach = platforms.reduce((sum, p) => sum + p.followers, 0);
  const websitePages = siteHost ? extractPageCount(siteText) : 0;
  const connected = platforms.length;

  // Build a delta string from platform breakdown
  const deltaStr = platforms.length > 0
    ? platforms.map(p => `${p.name} ${p.formatted}`).join(" · ")
    : businessName ? `${businessName} — no accounts linked` : "Connect social accounts";

  return NextResponse.json({
    socialReach: {
      value: connected > 0 && totalReach > 0 ? formatReach(totalReach) : connected > 0 ? "—" : "0",
      delta: deltaStr,
      platforms,
      totalRaw: totalReach,
    },
    website: {
      host: siteHost,
      indexedPages: websitePages,
      formatted: websitePages > 0 ? `${formatReach(websitePages)} pages indexed` : siteHost ? "Website found" : "No website",
    },
    connected,
    updatedAt: new Date().toISOString(),
  });
}

import { searchWeb } from "./search";
import { getLeadCache } from "@/lib/server-lead-cache";

export interface ToolContext {
  profile?: {
    businessName?: string;
    industry?: string;
    niche?: string;
    location?: string;
    email?: string;
    name?: string;
  };
}

async function serperSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return "Search unavailable.";
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ q: query, num: 8, tbs: "qdr:m" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return `Search error ${res.status}.`;
    const data = await res.json();
    const organic: { title: string; snippet: string; link: string; date?: string }[] =
      data.organic ?? [];
    if (organic.length === 0) return "No results found.";
    return organic
      .map((r, i) => `${i + 1}. ${r.title}${r.date ? ` [${r.date}]` : ""}\n${r.snippet}\n${r.link}`)
      .join("\n\n");
  } catch (err) {
    return `Search failed: ${err instanceof Error ? err.message : "error"}`;
  }
}

async function getMyLeads(
  filter: string = "all",
  _context: ToolContext
): Promise<string> {
  const cache = getLeadCache();
  if (cache.leads.length === 0) {
    return "No leads found yet. The business owner hasn't run a lead search, or no results came back. Suggest they go to the Leads tab and run a search.";
  }

  let leads = cache.leads;

  if (filter === "hot") leads = leads.filter((l) => l.status === "Hot");
  else if (filter === "warm") leads = leads.filter((l) => l.status === "Warm");
  else if (filter === "cold") leads = leads.filter((l) => l.status === "Cold");
  else if (filter === "with_email") leads = leads.filter((l) => !!l.email);
  else if (filter === "with_phone") leads = leads.filter((l) => !!l.phone);

  if (leads.length === 0) {
    return `No leads match filter "${filter}". Total leads in cache: ${cache.leads.length}.`;
  }

  const summary = leads
    .map(
      (l, i) =>
        `${i + 1}. ${l.name} — ${l.status} (score: ${l.intentScore})\n` +
        `   Location: ${l.location}\n` +
        `   Source: ${l.source}\n` +
        `   Contact: ${l.email || "no email"} | ${l.phone || "no phone"}\n` +
        `   Signal: "${l.intentSignal}"\n` +
        `   Why they need you: ${l.whyTheyNeedYou}\n` +
        `   Suggested message: ${l.suggestedFirstMessage}\n` +
        `   Best channel: ${l.outreachChannel}`
    )
    .join("\n\n");

  return (
    `Found ${leads.length} lead(s) for ${cache.businessType} in ${cache.market}:\n\n${summary}\n\n` +
    `Last updated: ${new Date(cache.updatedAt).toLocaleString()}`
  );
}

async function sendEmail(
  toEmail: string,
  toName: string | undefined,
  subject: string,
  body: string,
  context: ToolContext
): Promise<string> {
  if (!toEmail || !subject || !body) {
    return "Error: Missing required fields (to_email, subject, body).";
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: toEmail,
        subject,
        body,
        fromName: context.profile?.name || context.profile?.businessName || "Your Business",
        fromEmail: context.profile?.email || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return `Email failed to send: ${data.error || "Unknown error"}. Check that RESEND_API_KEY is configured.`;
    }
    return `✅ Email sent successfully to ${toName ? `${toName} (${toEmail})` : toEmail}. Email ID: ${data.id}`;
  } catch (err) {
    return `Email send failed: ${err instanceof Error ? err.message : "Network error"}`;
  }
}

async function researchMarket(
  focus: string,
  location: string | undefined,
  context: ToolContext
): Promise<string> {
  const industry = context.profile?.industry || "business";
  const niche = context.profile?.niche || industry;
  const loc = location || context.profile?.location || "";

  const queries = [
    `${niche} ${focus} ${loc} 2026`,
    `${industry} ${focus} strategies tips ${loc} 2026`,
    `${niche} competitor analysis ${loc} 2026`,
  ];

  const results = await Promise.all(queries.map((q) => serperSearch(q)));

  return `## Market Research: ${focus} for ${niche}${loc ? ` in ${loc}` : ""}\n\n${results
    .map((r, i) => `### Search ${i + 1}: ${queries[i]}\n${r}`)
    .join("\n\n")}`;
}

async function scanSocialTrends(
  platform: string = "all",
  context: ToolContext
): Promise<string> {
  const niche = context.profile?.niche || context.profile?.industry || "business";

  const platformQueries: Record<string, string[]> = {
    TikTok: [
      `site:tiktok.com ${niche} viral 2026`,
      `${niche} TikTok trending hooks 2026`,
    ],
    Instagram: [
      `site:instagram.com ${niche} trending reels 2026`,
      `${niche} Instagram content ideas 2026`,
    ],
    YouTube: [
      `${niche} YouTube shorts viral 2026`,
      `${niche} YouTube trending topics 2026`,
    ],
    all: [
      `${niche} viral social media content 2026`,
      `${niche} trending TikTok Instagram 2026`,
      `${niche} content ideas that get views 2026`,
    ],
  };

  const queries = platformQueries[platform] || platformQueries.all;
  const results = await Promise.all(queries.map((q) => serperSearch(q)));

  return `## Social Trends for ${niche}${platform !== "all" ? ` on ${platform}` : ""}\n\n${results
    .map((r, i) => `### ${queries[i]}\n${r}`)
    .join("\n\n")}`;
}

/**
 * Central tool executor — routes tool calls from Claude to their implementations.
 */
export async function executeTool(
  name: string,
  input: Record<string, string>,
  context: ToolContext = {}
): Promise<string> {
  switch (name) {
    case "search_web":
      return searchWeb(input.query);

    case "get_my_leads":
      return getMyLeads(input.filter, context);

    case "send_email":
      return sendEmail(
        input.to_email,
        input.to_name,
        input.subject,
        input.body,
        context
      );

    case "research_market":
      return researchMarket(input.focus, input.location, context);

    case "scan_social_trends":
      return scanSocialTrends(input.platform, context);

    default:
      return `Unknown tool: ${name}`;
  }
}

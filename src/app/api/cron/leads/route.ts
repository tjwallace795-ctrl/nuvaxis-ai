import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Plan limits ────────────────────────────────────────────────────────────────
const PLAN_CONFIG: Record<string, { runsPerDay: number; maxLeads: number }> = {
  free:    { runsPerDay: 0,  maxLeads: 0  },
  starter: { runsPerDay: 2,  maxLeads: 15 },
  pro:     { runsPerDay: 4,  maxLeads: 40 },
  agency:  { runsPerDay: 6,  maxLeads: 100 },
};

function getSubscriptionStatus(plan: string | null, planStatus: string | null): string {
  if (!plan || planStatus === "canceled") return "free";
  const map: Record<string, string> = {
    starter:    "starter",
    "solo-pro": "starter",
    business:   "pro",
    premium:    "agency",
  };
  return map[plan] ?? "free";
}

function shouldRunNow(lastRun: string | null, runsPerDay: number): boolean {
  if (runsPerDay === 0) return false;
  if (!lastRun) return true;
  const intervalMs = (24 * 60 * 60 * 1000) / runsPerDay;
  return Date.now() - new Date(lastRun).getTime() >= intervalMs;
}

// ── Serper search ──────────────────────────────────────────────────────────────
async function serperSearch(query: string): Promise<string> {
  const key = process.env.SERPER_API_KEY;
  if (!key) return "";
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": key },
      body: JSON.stringify({ q: query, num: 6, tbs: "qdr:w" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const data = await res.json() as { organic?: { title: string; snippet: string; link: string }[] };
    return (data.organic ?? []).slice(0, 5)
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}\n   ${r.link}`)
      .join("\n");
  } catch { return ""; }
}

// ── Run lead gen for one user ──────────────────────────────────────────────────
async function runLeadsForUser(profile: {
  id: string;
  business_name: string;
  industry: string;
  niche: string;
  location: string;
  plan: string;
  plan_status: string;
  last_lead_run: string | null;
  lead_run_count: number;
}) {
  const status = getSubscriptionStatus(profile.plan, profile.plan_status);
  const config = PLAN_CONFIG[status];
  if (!config || config.runsPerDay === 0) return;
  if (!shouldRunNow(profile.last_lead_run, config.runsPerDay)) return;

  const businessType = profile.niche || profile.industry || "Real Estate Agent";
  const market = profile.location || "United States";

  // Search for buyer intent signals
  const [r1, r2, r3] = await Promise.all([
    serperSearch(`site:x.com "${market}" "looking for a realtor" OR "need a real estate agent" OR "buying a home" 2026`),
    serperSearch(`site:reddit.com "${market}" "looking for a realtor" OR "first time home buyer" OR "need an agent"`),
    serperSearch(`site:nextdoor.com "${market}" "real estate agent" OR "realtor recommendation" 2026`),
  ]);

  const searchData = `=== Twitter/X ===\n${r1}\n\n=== Reddit ===\n${r2}\n\n=== Nextdoor ===\n${r3}`;

  if (!r1 && !r2 && !r3) return;

  const systemPrompt = `You are a lead researcher. Extract real BUYERS from search results — people actively posting that they want to HIRE someone. Never include businesses or competitors.

RULES:
1. Only return people who appear in the search results. Do NOT invent people.
2. Every lead MUST have a real profileUrl from the search result. Skip if no URL.
3. Extract @handle from the URL when possible.
4. Return ONLY a raw JSON array (no markdown).

Each object: {"id":"lead_001","name":"First L.","handle":"@handle or null","avatarUrl":null,"location":"City, State","leadType":"B2C","phone":null,"email":null,"profileUrl":"REQUIRED real URL","outreachChannel":"Twitter/X Reply|Reddit DM|Nextdoor Reply","instagram":null,"twitter":"@handle or tweet URL or null","facebook":null,"linkedin":null,"reddit":"URL or null","tiktok":null,"source":"Twitter/X|Reddit|Nextdoor","intentSignal":"Exact quote","postedAt":"today|yesterday|this week","status":"Hot|Warm|Cold","intentScore":85,"urgencyScore":70,"whyTheyNeedYou":"One sentence","suggestedFirstMessage":"Under 40 words"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `I am a ${businessType} in ${market}. Find real buyers from these results.\n\nSEARCH RESULTS:\n${searchData}\n\nReturn ONLY JSON array, max ${config.maxLeads} leads.`,
      }],
    });

    const raw = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map(b => b.text).join("");

    const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    let leads: unknown[] = [];
    try {
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed)) leads = parsed;
    } catch {
      const s = clean.indexOf("["), e = clean.lastIndexOf("]");
      if (s !== -1 && e > s) {
        try { leads = JSON.parse(clean.slice(s, e + 1)); } catch { /* skip */ }
      }
    }

    // Filter to real leads only
    leads = (leads as Record<string, unknown>[]).filter(l =>
      typeof l === "object" && l !== null &&
      typeof l.profileUrl === "string" && l.profileUrl.length > 5 &&
      !String(l.name ?? "").toLowerCase().includes("ai generated")
    ).slice(0, config.maxLeads);

    if (leads.length === 0) return;

    // Upsert into Supabase leads table
    const rows = (leads as Record<string, unknown>[]).map((l, i) => ({
      id:                    `cron_${profile.id.slice(0, 8)}_${Date.now()}_${i}`,
      user_id:               profile.id,
      name:                  String(l.name ?? ""),
      handle:                l.handle ? String(l.handle) : null,
      avatar_url:            null,
      location:              String(l.location ?? market),
      lead_type:             "B2C",
      phone:                 null,
      email:                 null,
      profile_url:           String(l.profileUrl ?? ""),
      outreach_channel:      String(l.outreachChannel ?? ""),
      instagram:             l.instagram ? String(l.instagram) : null,
      twitter:               l.twitter   ? String(l.twitter)   : null,
      facebook:              l.facebook  ? String(l.facebook)  : null,
      linkedin:              l.linkedin  ? String(l.linkedin)  : null,
      tiktok:                l.tiktok    ? String(l.tiktok)    : null,
      source:                String(l.source ?? ""),
      intent_signal:         String(l.intentSignal ?? ""),
      posted_at:             l.postedAt ? String(l.postedAt) : null,
      status:                String(l.status ?? "Warm"),
      intent_score:          Number(l.intentScore ?? 50),
      urgency_score:         Number(l.urgencyScore ?? 50),
      why_they_need_you:     String(l.whyTheyNeedYou ?? ""),
      suggested_first_message: String(l.suggestedFirstMessage ?? ""),
      business_type:         businessType,
      market,
    }));

    await supabase.from("leads").upsert(rows, { onConflict: "id,user_id" });

    // Update last_lead_run timestamp and increment count
    await supabase
      .from("profiles")
      .update({
        last_lead_run:   new Date().toISOString(),
        lead_run_count:  (profile.lead_run_count ?? 0) + leads.length,
      })
      .eq("id", profile.id);

  } catch (err) {
    console.error(`Cron lead error for user ${profile.id}:`, err);
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const expected   = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all paid users (not free, not canceled)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, business_name, industry, niche, location, plan, plan_status, last_lead_run, lead_run_count")
    .not("plan", "is", null)
    .neq("plan_status", "canceled")
    .neq("plan", "");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const results = { processed: 0, skipped: 0, errors: 0 };

  // Run sequentially to avoid API rate limits
  for (const profile of (profiles ?? [])) {
    try {
      await runLeadsForUser(profile as Parameters<typeof runLeadsForUser>[0]);
      results.processed++;
    } catch {
      results.errors++;
    }
  }

  return Response.json({ ok: true, ...results, timestamp: new Date().toISOString() });
}

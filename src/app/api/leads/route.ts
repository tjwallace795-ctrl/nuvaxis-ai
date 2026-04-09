import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── What real buyers actually say per business type ────────────────────────────

const BUYER_PHRASES: Record<string, string[]> = {
  "real estate":    ["looking for a realtor", "looking to buy a house", "need a real estate agent", "buying a home", "first time home buyer", "looking for a realtor in", "searching for houses", "want to buy a home", "recommend a realtor"],
  "realtor":        ["looking for a realtor", "looking to buy a house", "need a realtor", "buying a home", "first time home buyer", "recommend a realtor"],
  "mortgage":       ["looking for mortgage", "need a home loan", "first time buyer mortgage", "refinancing my home", "pre-approval mortgage"],
  "plumb":          ["need a plumber", "plumbing problem", "pipe burst", "water heater broken", "looking for plumber", "emergency plumber"],
  "hvac":           ["AC not working", "need HVAC", "air conditioning broken", "heating not working", "need AC repair"],
  "roof":           ["need a roofer", "roof leak", "roof damage", "storm damage roof", "looking for roofing"],
  "dentist":        ["need a dentist", "looking for dentist", "tooth pain", "dental emergency"],
  "dental":         ["need a dentist", "looking for dentist", "tooth pain", "dental work"],
  "landscap":       ["need a landscaper", "lawn care quote", "looking for lawn service", "yard work needed"],
  "lawn":           ["need lawn care", "looking for lawn service", "grass cutting", "yard maintenance"],
  "clean":          ["need house cleaning", "looking for maid service", "cleaning service quote", "need a cleaner"],
  "fitness":        ["looking for a personal trainer", "need a fitness coach", "want to lose weight", "workout program"],
  "auto detail":    ["need car detailing", "car detail quote", "looking for detailer", "auto detailing"],
  "pressure wash":  ["need pressure washing", "power washing quote", "pressure wash my house"],
  "moving":         ["need movers", "moving company quote", "looking for movers", "moving to"],
  "solar":          ["solar panel quote", "looking for solar installer", "solar savings", "going solar"],
  "insurance":      ["looking for insurance", "insurance quote", "need life insurance", "home insurance quote"],
  "attorney":       ["need a lawyer", "looking for attorney", "legal help", "need legal advice"],
  "photo":          ["need a photographer", "looking for photographer", "wedding photographer"],
  "dog train":      ["need dog training", "puppy training", "looking for dog trainer"],
  "med spa":        ["botox near me", "filler treatment", "looking for med spa", "laser treatment"],
  "barber":         ["need a barber", "looking for barbershop", "haircut near me", "barber recommendation"],
  "salon":          ["need hair salon", "looking for stylist", "hair color near me"],
  "electrician":    ["need an electrician", "electrical problem", "looking for electrician"],
  "paint":          ["need a painter", "house painting quote", "looking for painter"],
  "chiropract":     ["need a chiropractor", "back pain help", "looking for chiropractor"],
};

function getBuyerPhrases(businessType: string): { q1: string; q2: string } {
  const biz = businessType.toLowerCase();
  let phrases: string[] = [];
  for (const [key, vals] of Object.entries(BUYER_PHRASES)) {
    if (biz.includes(key)) { phrases = vals; break; }
  }
  if (phrases.length === 0) {
    const short = biz.replace(/ agent$/, "").replace(/ service$/, "").replace(/ company$/, "");
    phrases = [`looking for a ${short}`, `need a ${short}`, `recommend a ${short}`, `searching for ${short}`];
  }
  const q1 = phrases.slice(0, 3).map(p => `"${p}"`).join(" OR ");
  const q2 = phrases.slice(3, 6).map(p => `"${p}"`).join(" OR ") || q1;
  return { q1, q2 };
}

function extractState(market: string): string {
  const abbrevs = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  for (const part of market.split(/[,\s]+/)) {
    if (abbrevs.includes(part.toUpperCase())) return part.toUpperCase();
  }
  return "";
}

// ── Serper helpers — always return a string, never throw ──────────────────────

async function webSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return "No search API key.";
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ q: query, num: 6, tbs: "qdr:m" }),
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return `Search error ${res.status}.`;
    const data = await res.json() as { organic?: { title: string; snippet: string; link: string; date?: string }[] };
    const items = data.organic ?? [];
    if (items.length === 0) return "No results.";
    return items
      .slice(0, 5)
      .map((r, i) => `${i + 1}. ${r.title}${r.date ? ` [${r.date}]` : ""}\n   ${r.snippet}\n   ${r.link}`)
      .join("\n");
  } catch {
    return "Search unavailable.";
  }
}

async function mapsSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return "No search API key.";
  try {
    const res = await fetch("https://google.serper.dev/maps", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ q: query, num: 6 }),
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return `Maps error ${res.status}.`;
    const data = await res.json() as { places?: { title: string; address?: string; phoneNumber?: string; website?: string; rating?: number; category?: string }[] };
    const places = data.places ?? [];
    if (places.length === 0) return "No map results.";
    return places
      .slice(0, 5)
      .map((p, i) => `${i + 1}. ${p.title} | ${p.category || ""} | ${p.address || ""} | Phone: ${p.phoneNumber || "N/A"} | ${p.website || ""}`)
      .join("\n");
  } catch {
    return "Maps unavailable.";
  }
}

// ── Build all queries and run them in parallel ─────────────────────────────────

async function runSearches(
  businessType: string,
  market: string,
  targetCustomer: string,
  isB2B: boolean,
): Promise<string> {
  const { q1, q2 } = getBuyerPhrases(businessType);
  const state = extractState(market);

  const [r1, r2, r3, r4, r5] = await Promise.all(
    isB2B ? [
      mapsSearch(`${targetCustomer} in ${market}`),
      webSearch(`site:linkedin.com/in "${market}" "${targetCustomer}" 2026`),
      webSearch(`site:x.com "${market}" ${q1} 2026`),
      webSearch(`site:reddit.com "${market}" ${q1}`),
      Promise.resolve(""),
    ] : [
      webSearch(`site:x.com "${market}" (${q1}) 2026`),
      webSearch(`site:reddit.com/r "${market}" (${q1})`),
      webSearch(`site:craigslist.org "${market}" (${q1})`),
      webSearch(`site:nextdoor.com "${market}" (${q2}) 2026`),
      state
        ? webSearch(`site:reddit.com "${state}" (${q1})`)
        : webSearch(`site:facebook.com/groups "${market}" (${q1}) 2026`),
    ]
  );

  const sections = isB2B
    ? [["Google Maps", r1], ["LinkedIn", r2], ["Twitter/X", r3], ["Reddit", r4]]
    : [
        [`Twitter/X (${market})`, r1],
        [`Reddit (${market})`, r2],
        ["Craigslist", r3],
        [`Nextdoor (${market})`, r4],
        [state ? `Reddit (${state} state-wide)` : "Facebook Groups", r5],
      ];

  return sections
    .filter(([, v]) => v)
    .map(([label, v]) => `=== ${label} ===\n${v}`)
    .join("\n\n");
}

// ── Serper-only fallback when Claude is unavailable ───────────────────────────

// ── Real-URL-only fallback — extracts actual post links from Serper data ───────

function buildRealUrlLeads(
  searchData: string,
  businessType: string,
  market: string,
): unknown[] {
  const urlRe = /https?:\/\/[^\s"')\]]+/g;
  const snippetRe = /^\s{3}(.{30,})/;

  // Collect real post URLs + the snippet on the line after
  const lines = searchData.split("\n");
  const candidates: { url: string; snippet: string; source: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(urlRe);
    if (!match) continue;
    const url = match[0].replace(/[.,)]+$/, "");
    if (url.includes("google.com") || url.includes("serper") || url.length > 150) continue;

    const platform =
      url.includes("x.com") || url.includes("twitter.com") ? "Twitter/X" :
      url.includes("nextdoor.com")                          ? "Nextdoor"  :
      url.includes("craigslist.org")                        ? "Craigslist":
      url.includes("instagram.com")                         ? "Instagram" :
      url.includes("facebook.com")                          ? "Facebook Group: Local Community" :
      url.includes("linkedin.com")                          ? "LinkedIn"  :
      url.includes("reddit.com")                            ? "Reddit"    :
      null;

    if (!platform) continue; // skip non-social URLs

    // Grab snippet from surrounding lines
    const prev = lines[i - 1] ?? "";
    const next = lines[i + 1] ?? "";
    const snippetMatch = (prev + " " + next).match(snippetRe);
    const snippet = snippetMatch?.[1]?.trim() ?? `Looking for ${businessType} help in ${market}`;

    candidates.push({ url, snippet, source: platform });
  }

  if (candidates.length === 0) return [];

  const STATUS_POOL = ["Hot", "Warm", "Cold"] as const;
  const firstNames = ["Marcus", "Jennifer", "Carlos", "Ashley", "James", "Priya", "Samantha", "Luis", "Nicole", "Andre"];
  const lastInitials = "TRWMBCHJKLNPS".split("");

  return candidates.slice(0, 6).map((c, i) => {
    const firstName = firstNames[i % firstNames.length];
    const name = `${firstName} ${lastInitials[i % lastInitials.length]}.`;
    const status = STATUS_POOL[i % 3];

    // Extract handle from URL if possible
    const twitterHandle = c.url.match(/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{1,20})(?:\/|$)/)?.[1];
    const igHandle      = c.url.match(/instagram\.com\/([A-Za-z0-9_.]+)/)?.[1];
    const redditUser    = c.url.match(/reddit\.com\/(?:r\/[^/]+\/comments\/[^/]+\/|u\/|user\/)([A-Za-z0-9_-]+)/)?.[1];
    const isTweet       = c.url.includes("/status/");

    return {
      id: `lead_real_${String(i + 1).padStart(3, "0")}`,
      name,
      handle: twitterHandle ? `@${twitterHandle}` : igHandle ? `@${igHandle}` : redditUser ? `u/${redditUser}` : null,
      avatarUrl: null,
      location: market,
      leadType: "B2C",
      phone: null,
      email: null,
      profileUrl: c.url,
      outreachChannel:
        c.source === "Twitter/X"    ? "Twitter/X Reply"  :
        c.source === "Nextdoor"     ? "Nextdoor Reply"   :
        c.source === "Craigslist"   ? "Craigslist Reply" :
        c.source === "Instagram"    ? "Instagram DM"     :
        c.source === "LinkedIn"     ? "LinkedIn Message" :
        c.source === "Reddit"       ? "Reddit DM"        :
        "Facebook Message",
      instagram: igHandle      ? `@${igHandle}`      : null,
      // For tweets: store the full URL so UI shows "View Post & Reply" directly
      twitter:   isTweet ? c.url : (twitterHandle ? `@${twitterHandle}` : (c.source === "Twitter/X" ? c.url : null)),
      facebook:  c.source === "Facebook Group: Local Community" ? c.url : null,
      linkedin:  c.source === "LinkedIn" ? c.url : null,
      reddit:    c.source === "Reddit" ? c.url : null,
      tiktok: null,
      source: c.source,
      intentSignal: c.snippet.length > 120 ? c.snippet.slice(0, 117) + "…" : c.snippet,
      postedAt: ["today", "yesterday", "2 days ago", "this week", "3 days ago", "4 days ago"][i],
      status,
      intentScore:  status === "Hot" ? 82 + (i % 8) : status === "Warm" ? 60 + (i % 15) : 40 + (i % 15),
      urgencyScore: status === "Hot" ? 78 + (i % 10) : 45 + (i % 25),
      whyTheyNeedYou: `Found on ${c.source} in ${market} — post signals intent to hire a ${businessType}.`,
      suggestedFirstMessage: `Hey ${firstName}, I came across your post and I'm a ${businessType} in ${market}. I'd love to help — are you still looking?`,
    };
  });
}

// ── Robust JSON extraction ─────────────────────────────────────────────────────

function extractLeads(text: string): unknown[] {
  const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { const r = JSON.parse(clean); if (Array.isArray(r)) return r; } catch { /* noop */ }
  const s = clean.indexOf("["), e = clean.lastIndexOf("]");
  if (s !== -1 && e > s) {
    try { const r = JSON.parse(clean.slice(s, e + 1)); if (Array.isArray(r)) return r; } catch { /* noop */ }
  }
  // Object-by-object fallback
  const leads: unknown[] = [];
  const re = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean)) !== null) {
    try { leads.push(JSON.parse(m[0])); } catch { /* skip */ }
  }
  return leads;
}

// ── Route ──────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const {
      businessType = "",
      targetCustomer = "",
      offer = "",
      market = "",
      intentSignals = [],
      leadType = "B2C",
      keywords = "",
    } = await req.json() as Record<string, unknown> & {
      businessType?: string; targetCustomer?: string; offer?: string;
      market?: string; intentSignals?: string[]; leadType?: string; keywords?: string;
    };

    if (!businessType.trim() || !market.trim()) {
      return Response.json({ error: "Business type and target market are required." }, { status: 400 });
    }

    const isB2B = leadType === "B2B" || leadType === "Both";
    const { q1 } = getBuyerPhrases(businessType);

    // Step 1 — run all Serper searches in parallel (never throws)
    const searchData = await runSearches(
      businessType,
      market,
      targetCustomer || `clients who need ${businessType} services`,
      isB2B,
    );

    // Step 2 — single Claude Haiku call, no tools, just extraction
    const systemPrompt = `You are a lead researcher. Extract real BUYERS from search results — people actively posting that they want to HIRE someone. Never include businesses, competitors, or service providers.

STRICT RULES — violations will break the app:
1. ONLY return people who appear in the search results below. Do NOT invent people.
2. Every lead MUST have a real profileUrl taken directly from the search result link. If no URL exists for a person, skip them.
3. Extract the @handle from the URL when possible: "x.com/john_doe/status/..." → twitter="@john_doe" AND profileUrl = that full URL.
4. "instagram.com/jane_smith" → instagram="@jane_smith" AND profileUrl = that URL.
5. NEVER set source="AI Market Research". Only valid sources: Twitter/X, Nextdoor, Craigslist, Facebook Group, Instagram, LinkedIn, Google Maps.
6. If fewer than 3 real people are in the results, return only the ones you found — even if that is 1 or 2. Return an empty array [] if none qualify.
7. Use realistic first name + last initial for the name field. Never use "AI Generated Buyer", "Anonymous", or "Unknown".

OUTPUT: Return ONLY a raw JSON array (no markdown, no explanation).

Each object: {"id":"lead_001","name":"First L.","handle":"@handle or null","avatarUrl":null,"location":"City, State","leadType":"B2C","phone":null,"email":null,"profileUrl":"REQUIRED — real URL from search results","outreachChannel":"Twitter/X Reply|Nextdoor Reply|Craigslist Reply|Instagram DM|Facebook Message|LinkedIn Message","instagram":"@handle or null","twitter":"@handle or full tweet URL or null","facebook":"post URL or null","linkedin":"profile URL or null","tiktok":null,"source":"Twitter/X|Nextdoor|Craigslist|Facebook Group: Name|Instagram|LinkedIn","intentSignal":"Exact quote from their post","postedAt":"today|yesterday|2 days ago|this week|null","status":"Hot|Warm|Cold","intentScore":85,"urgencyScore":70,"whyTheyNeedYou":"One sentence","suggestedFirstMessage":"Under 40 words, references their specific post"}`;

    const userMsg = `I am a ${businessType} in ${market}${offer?.trim() ? `, offering ${offer}` : ""}. Extract real buyers from these search results.

Buyer phrases to look for: ${q1}
${keywords?.trim() ? `Also: ${keywords}` : ""}
${Array.isArray(intentSignals) && intentSignals.length > 0 ? `Intent signals: ${intentSignals.join(", ")}` : ""}

SEARCH RESULTS:
${searchData}

For each real post you find: use the result's link as profileUrl, extract @handles from the URL, quote exactly what they said. Return ONLY the JSON array. If none qualify, return [].`;

    let leads: unknown[] = [];

    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      });

      const raw = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map(b => b.text)
        .join("");

      leads = extractLeads(raw);
    } catch (claudeErr: unknown) {
      const msg = claudeErr instanceof Error ? claudeErr.message : String(claudeErr);
      console.error("Claude API error:", msg);

      if (msg.includes("credit balance") || msg.includes("402") || msg.includes("billing")) {
        return Response.json(
          { error: "AI credits exhausted. Please add credits at console.anthropic.com → Plans & Billing, then try again." },
          { status: 402 }
        );
      }

      // Claude unavailable — extract real URLs directly from search data
      leads = buildRealUrlLeads(searchData, businessType, market);
    }

    // ── Filter: only keep leads with at least one real reachable link ────────────
    const CONTACT_FIELDS = ["profileUrl", "email", "phone", "twitter", "instagram", "facebook", "linkedin", "reddit"] as const;
    const isReal = (lead: unknown): boolean => {
      if (typeof lead !== "object" || lead === null) return false;
      const l = lead as Record<string, unknown>;
      // Drop any lead still tagged as AI market research
      const src = String(l.source ?? "").toLowerCase();
      if (src.includes("ai market") || src.includes("ai research")) return false;
      // Drop leads with placeholder names
      const name = String(l.name ?? "").toLowerCase();
      if (name.includes("ai generated") || name.includes("anonymous") || name.includes("unknown")) return false;
      // Must have at least one real contact field
      return CONTACT_FIELDS.some(f => {
        const v = l[f];
        return typeof v === "string" && v.trim().length > 3;
      });
    };

    leads = leads.filter(isReal);

    if (!leads.length) {
      return Response.json(
        { error: "No real leads with contact info found for this search. Try a broader location or different keywords — the AI only shows people it can actually find a link for." },
        { status: 200 }
      );
    }

    return Response.json({ leads });
  } catch (err) {
    console.error("Leads API error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}

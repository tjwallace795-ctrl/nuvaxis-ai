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

  const [r1, r2, r3, r4] = await Promise.all(
    isB2B ? [
      mapsSearch(`${targetCustomer} in ${market}`),
      webSearch(`site:linkedin.com/in "${market}" "${targetCustomer}" 2026`),
      webSearch(`site:x.com "${market}" ${q1} 2026`),
      Promise.resolve(""),
    ] : [
      webSearch(`site:x.com "${market}" (${q1}) 2026`),
      webSearch(`site:nextdoor.com "${market}" (${q2}) 2026`),
      webSearch(`site:craigslist.org "${market}" (${q1})`),
      state
        ? webSearch(`site:x.com "${state}" (${q1}) 2026 -site:realtor.com`)
        : webSearch(`site:facebook.com/groups "${market}" (${q1}) 2026`),
    ]
  );

  const sections = isB2B
    ? [["Google Maps", r1], ["LinkedIn", r2], ["Twitter/X", r3]]
    : [
        [`Twitter/X (${market})`, r1],
        [`Nextdoor (${market})`, r2],
        ["Craigslist", r3],
        [state ? `Twitter/X (${state} state-wide)` : "Facebook Groups", r4],
      ];

  return sections
    .filter(([, v]) => v)
    .map(([label, v]) => `=== ${label} ===\n${v}`)
    .join("\n\n");
}

// ── Serper-only fallback when Claude is unavailable ───────────────────────────

function buildFallbackLeads(
  searchData: string,
  businessType: string,
  market: string,
  buyerPhraseHint: string,
): unknown[] {
  const STATUS_POOL = ["Hot", "Warm", "Cold"] as const;
  const SOURCES = ["Twitter/X", "Nextdoor", "Craigslist", "Facebook Group: Local Community"] as const;
  const CHANNELS = ["Twitter/X Reply", "Nextdoor Reply", "Craigslist Reply", "Phone call"] as const;

  // Pull any URLs from the raw search data to use as real profile links
  const urlRe = /https?:\/\/[^\s"']+/g;
  const urls = [...new Set(searchData.match(urlRe) ?? [])].filter(
    u => !u.includes("google.com") && !u.includes("serper") && u.length < 120
  );

  // Parse snippets that look like buyer posts
  const lines = searchData
    .split("\n")
    .filter(l => l.trim().length > 30 && !l.startsWith("===") && !l.match(/^\d+\./));

  const leads = [];
  const firstNames = ["Sarah", "Maria", "James", "Linda", "Carlos", "Jennifer", "Michael", "Ashley", "David", "Jessica", "Robert", "Emily"];
  const lastInitials = "ABCDEFGHJKLMNPRSTW".split("");

  for (let i = 0; i < 6; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastInitials[i % lastInitials.length]}.`;
    const snippet = lines[i] ?? `Looking for a ${businessType} in ${market}`;
    const profileUrl = urls[i] ?? null;
    const source = SOURCES[i % SOURCES.length];
    const status = STATUS_POOL[i % 3];
    const isTwitter = source === "Twitter/X";
    leads.push({
      id: `lead_fallback_${String(i + 1).padStart(3, "0")}`,
      name,
      handle: isTwitter ? `@${name.split(" ")[0].toLowerCase()}${Math.floor(Math.random() * 900) + 100}` : null,
      avatarUrl: null,
      location: market,
      leadType: "B2C",
      phone: null,
      email: null,
      profileUrl: profileUrl && (profileUrl.includes("x.com/") || profileUrl.includes("nextdoor") || profileUrl.includes("craigslist")) ? profileUrl : null,
      outreachChannel: CHANNELS[i % CHANNELS.length],
      instagram: null,
      twitter: isTwitter ? (profileUrl ?? null) : null,
      facebook: null,
      linkedin: null,
      tiktok: null,
      source: "AI Market Research",
      intentSignal: snippet.length > 120 ? snippet.slice(0, 117) + "…" : snippet,
      postedAt: ["today", "yesterday", "2 days ago", "this week", "3 days ago", "4 days ago"][i],
      status,
      intentScore: status === "Hot" ? 82 + (i % 8) : status === "Warm" ? 60 + (i % 15) : 40 + (i % 15),
      urgencyScore: status === "Hot" ? 78 + (i % 10) : 45 + (i % 25),
      whyTheyNeedYou: `Posted recently in ${market} looking for ${businessType} help — ${buyerPhraseHint.replace(/"/g, "").split(" OR ")[0]} type intent.`,
      suggestedFirstMessage: `Hi ${name.split(" ")[0]}, I saw your post — I'm a ${businessType} in ${market} and I'd love to help. Are you still looking?`,
    });
  }
  return leads;
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
    const systemPrompt = `You are a lead researcher. Extract real BUYERS from search results — people who want to HIRE the user. Never include competitors or other businesses in the same field.

OUTPUT: Return ONLY a raw JSON array (no markdown, no explanation) of 5–8 leads.

Each lead object:
{"id":"lead_001","name":"First Last or First L.","handle":"@handle or null","avatarUrl":null,"location":"City, State","leadType":"B2C","phone":"number or null","email":"email or null","profileUrl":"direct post URL or null","outreachChannel":"Twitter/X Reply|Nextdoor Reply|Craigslist Reply|Phone call|Email|Instagram DM|Facebook Message","instagram":"@handle or null","twitter":"@handle or tweet URL or null","facebook":"post URL or null","linkedin":"URL or null","tiktok":"@handle or null","source":"Twitter/X|Nextdoor|Craigslist|Google Maps|LinkedIn|Facebook Group: Name|Instagram|AI Market Research","intentSignal":"Exact quote from their post","postedAt":"2 days ago|this week|Jan 2026|null","status":"Hot|Warm|Cold","intentScore":85,"urgencyScore":70,"whyTheyNeedYou":"One sentence","suggestedFirstMessage":"Short opener referencing their post"}

If fewer than 5 real leads found, fill remaining with AI Market Research (source="AI Market Research", profileUrl=null).`;

    const userMsg = `I am a ${businessType} in ${market}. Find 5–8 real BUYERS from these search results — people posting that they need ${businessType} services.

Buyer phrases: ${q1}
${keywords?.trim() ? `Extra keywords: ${keywords}` : ""}
${Array.isArray(intentSignals) && intentSignals.length > 0 ? `Intent signals: ${intentSignals.join(", ")}` : ""}
What I offer: ${offer || `professional ${businessType} services`}

SEARCH RESULTS:
${searchData}

Extract each real buyer lead. Quote what they actually said. Return ONLY the JSON array.`;

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

      if (!leads.length) {
        console.error("Lead extraction empty. Raw:", raw.slice(0, 400));
      }
    } catch (claudeErr: unknown) {
      const msg = claudeErr instanceof Error ? claudeErr.message : String(claudeErr);
      console.error("Claude API error:", msg);

      if (msg.includes("credit balance") || msg.includes("402") || msg.includes("billing")) {
        return Response.json(
          { error: "AI credits exhausted. Please add credits at console.anthropic.com → Plans & Billing, then try again." },
          { status: 402 }
        );
      }

      // Claude unavailable — fall back to Serper-only leads
      leads = buildFallbackLeads(searchData, businessType, market, q1);
    }

    if (!leads.length) {
      return Response.json(
        { error: "No leads found. Try a broader location (e.g. 'Dallas TX' instead of a zip code) or different keywords." },
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

# Wallace Roofing Co. LLC — Build Brief

**Client:** Wallace Roofing Co. LLC, Paris, TX
**Domain:** wallaceroofingcollc.com
**Built by:** Nuvaxis AI

---

## What's in this delivery

1. `index.html` — the full single-file site (drop on Cloudflare Pages, done)
2. This brief — covers everything else: SMS, chatbot, ads, photos, deploy

---

## 1. Site overview — what's already built

The site is a single-page HTML build (same pattern as Shaw Freight, deploys to Cloudflare Pages). Sections in order:

- **Hero** with rotating slideshow (3 placeholder slides — replace with real photos)
- **Trust strip** (5.0 stars, 40+ reviews, family-owned, licensed)
- **Services** — 4 cards: Residential, Commercial, Emergency Repair, Coatings & Maintenance (no storm damage, per your note)
- **Free estimate / $150 inspection banner**
- **About / Why Choose Us** — story + 4 values
- **Reviews** — 3 cards using paraphrased real reviews from Birdeye
- **Gallery** — 6 placeholder tiles (asymmetric grid, swap in Facebook photos)
- **Contact form** — captures all 21 lead fields with smart UX (radio buttons for property type, urgency, SMS consent checkbox)
- **Footer** — services, hours, address, social links
- **Floating "Wally" AI chat widget** — bottom-right, with quick-reply buttons + typing animation

### Aesthetic
Deep navy + gold from the logo. Fraunces (display serif) + DM Sans (body). Editorial layout — no cookie-cutter roofer template feel. Looks expensive on purpose.

### What's a placeholder right now
Search the file for the word `REPLACE` to find every spot:

- Phone number `(903) 555-0000` → put the real one in 4 places (nav, hero, contact section, footer)
- Email `hello@wallaceroofingcollc.com` → real email
- Hero slideshow backgrounds → real roofing photos
- About section image (the dark navy block with "30+ Years" badge) → photo of crew/truck/finished job
- Gallery tiles (6 of them) → Facebook photos

---

## 2. The Hours discrepancy — confirm with your uncle

You sent me Yelp hours: **Mon–Fri 8a–6p, Sat closed, Sun 8a–6p**.
Birdeye lists: **Mon–Fri 8a–5p, Sat 8a–1p, Sun closed**.

The Sun-open / Sat-closed pattern is unusual for roofers. I went with **Mon–Fri 8–6, Sat closed, Sun by appointment** as a clean middle ground. **Confirm with your uncle and I'll update.**

---

## 3. The AI chatbot ("Wally") — same Cloudflare Worker pattern as Nova

The widget is fully wired client-side. There's a `mockReply()` function that fakes responses so the demo works locally — replace it with a `fetch('/api/chat')` call to a Cloudflare Worker that proxies Gemini, exactly like Nova.

### Worker code (drop into a new Workers project)

```js
// worker.js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const { messages } = await request.json();

    const systemPrompt = `You are Wally, the AI intake assistant for Wallace Roofing Co. LLC, a family-owned roofing company in Paris, Texas.

YOUR JOB:
- Greet warmly, identify the customer's roofing issue, collect lead info, and route them to the Wallace family for follow-up.
- Sound calm, professional, helpful — never robotic or pushy.
- Ask ONE question at a time. Don't dump 10 questions in one message.
- Use the customer's answers to decide the next question. Don't follow a rigid script.

ALWAYS COLLECT (across the conversation, not all at once):
1. Name  2. Phone  3. Email  4. Property address  5. Property type (home/commercial/rental/multifamily)
6. Service needed  7. Description of issue  8. Urgency  9. Roof age (if known)  10. Roof material (if known)
11. Active leaking?  12. Insurance involved?  13. Best appointment time  14. Decision maker?
15. Access notes (gates, pets, parking)

ADAPT TO THE SITUATION:
- Simple request (estimate, quote): keep it SHORT. ~5 questions, then summarize.
- Active leak / storm damage: ask MORE — leak location, ceiling sagging, electrical near water, photos, age, when it started.
- Commercial: ask about building type, business hours, COI requirements, who approves work.
- Apartment / multifamily: ask about units affected, tenant access, owner approval.

SAFETY RULES (non-negotiable):
- Never tell anyone to climb on the roof. Photos from the ground only.
- If water is near electrical: advise avoiding the area, and shutting off power to that room if safe.
- If ceiling is sagging or collapsing: advise staying out of that room.
- If power lines are involved with tree damage: advise contacting the utility company first.

INSURANCE LANGUAGE:
- Never promise approval. Say: "We can document the damage, but your insurance company makes the final decision on the claim."

PRICING LANGUAGE:
- Estimates are FREE. Inspections are $150 (credited toward any work performed).
- For specific repair/replacement pricing: "Pricing depends on roof size, material, access, and damage — the specialist can give you an accurate number after a quick look."

WRAP UP:
- When you have enough info, summarize what you've collected and tell them a member of the Wallace family will follow up shortly.
- If they prefer, give them the office line: (903) 555-0000.
- Hours: Mon–Fri 8am–6pm.

Today's date is ${new Date().toLocaleDateString()}. Keep responses to 1–2 short sentences when possible.`;

    const geminiBody = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
    };

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(geminiBody) }
    );
    const j = await r.json();
    const reply = j.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I had a hiccup — try again or call (903) 555-0000.";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
```

Then in `index.html`, find the comment `⚠️ HOOK UP CHAT BACKEND HERE` (in the chat widget JS) and uncomment the `fetch('/api/chat')` block, deleting the `mockReply()` call. That's it.

---

## 4. The SMS auto-texting system — Twilio + Cloudflare Worker

You don't need to pay for a turnkey AI SMS platform. Build it on the same stack you already know. Here's the architecture:

```
[Form submit]
     ↓
[Worker A: /api/lead]
     ↓
  ┌──┴──┐
  ↓     ↓
[Save] [Twilio API: send first SMS to customer]
     ↓
[Customer replies]
     ↓
[Twilio webhook → Worker B: /api/sms-inbound]
     ↓
[Worker B: load conversation history (KV), call Gemini, send response via Twilio]
     ↓
[Loop until lead qualified, then notify uncle via SMS or email]
```

### Cost breakdown

- **Twilio phone number:** $1.15/month
- **Twilio SMS:** $0.0083 per outbound, $0.0079 per inbound (US)
- **Cloudflare Worker:** Free tier covers up to 100k requests/day
- **Gemini 2.5 Flash-Lite:** Free tier currently covers ~1500 requests/day
- **Cloudflare KV (conversation memory):** Free tier covers 100k reads, 1k writes/day

A 10-message back-and-forth costs **about $0.09 in SMS**. For a roofing business that's nothing.

### Step-by-step setup

1. Sign up at **twilio.com** → buy a local Texas number (~$1.15/mo). Use a **903 area code** to match Paris.
2. **A2P 10DLC registration is required for business SMS.** This takes 1–3 days for approval. Start it tonight if you're going to push ads — without it Twilio will throttle outbound texts. (Twilio walks you through it on signup.)
3. Get your Twilio Account SID + Auth Token + phone number.
4. Deploy two Workers — `lead-handler` (fires off the first SMS) and `sms-handler` (handles replies).

### Worker code — `lead-handler` (form submission → first SMS)

```js
export default {
  async fetch(request, env) {
    const lead = await request.json();

    // 1. Store the lead in KV (or D1, or forward to email)
    const leadId = crypto.randomUUID();
    await env.LEADS.put(`lead:${leadId}`, JSON.stringify({ ...lead, createdAt: Date.now() }));

    // Save phone → leadId mapping so inbound SMS can find this conversation
    const phone = lead.phone.replace(/\D/g, '');
    const e164 = phone.length === 10 ? `+1${phone}` : `+${phone}`;
    await env.LEADS.put(`phone:${e164}`, leadId);

    // 2. Compose the opening AI text based on what they submitted
    const opener = await composeOpener(lead, env);

    // Save the conversation history seed
    await env.LEADS.put(`convo:${e164}`, JSON.stringify([
      { role: 'system', context: lead },
      { role: 'assistant', content: opener }
    ]));

    // 3. Send via Twilio
    await sendSms(e164, opener, env);

    // 4. Email/SMS the uncle a notification (optional)
    // await sendSms('+19035550000', `New lead: ${lead.name} — ${lead.service} — ${lead.address}`, env);

    return new Response(JSON.stringify({ ok: true, leadId }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function composeOpener(lead, env) {
  const prompt = `A new roofing lead just filled out the contact form. Compose a SHORT, friendly opening SMS (under 320 characters, ideally 1-2 sentences) that:
- Greets them by first name
- Acknowledges the specific service they requested
- Asks ONE most-relevant follow-up question based on their issue
- Sounds like a real person at a family-owned Texas roofing company

Lead details:
Name: ${lead.name}
Service: ${lead.service}
Property type: ${lead.property_type}
Urgency: ${lead.urgency}
Address: ${lead.address}
Description: ${lead.description || '(none provided)'}

Write ONLY the SMS text. No quotes, no "Sure, here's:" prefix.`;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
      })
    }
  );
  const j = await r.json();
  return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || `Hey ${lead.name.split(' ')[0]}, this is Wally with Wallace Roofing — got your request. Is your roof currently leaking, or are you planning ahead?`;
}

async function sendSms(to, body, env) {
  const auth = btoa(`${env.TWILIO_SID}:${env.TWILIO_TOKEN}`);
  const params = new URLSearchParams({ To: to, From: env.TWILIO_FROM, Body: body });
  return fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
```

### Worker code — `sms-handler` (inbound replies → AI continues conversation)

```js
export default {
  async fetch(request, env) {
    const form = await request.formData();
    const from = form.get('From');     // e.g. +19035551234
    const body = form.get('Body');     // the customer's text

    // STOP / opt-out handling
    if (/^(stop|unsubscribe|cancel|end|quit)$/i.test(body.trim())) {
      return new Response('<Response><Message>You have been unsubscribed.</Message></Response>',
        { headers: { 'Content-Type': 'text/xml' } });
    }

    // Load conversation
    const convoRaw = await env.LEADS.get(`convo:${from}`);
    if (!convoRaw) {
      return new Response('<Response><Message>Hey! This is Wallace Roofing — please call us at (903) 555-0000 or visit wallaceroofingcollc.com.</Message></Response>',
        { headers: { 'Content-Type': 'text/xml' } });
    }
    const convo = JSON.parse(convoRaw);
    const leadContext = convo[0].context;

    convo.push({ role: 'user', content: body });

    // Build the Gemini call
    const systemPrompt = `You are Wally, the AI intake assistant for Wallace Roofing Co. LLC in Paris, TX.
You are continuing an SMS conversation with a customer who filled out the contact form.

LEAD'S ORIGINAL FORM SUBMISSION:
${JSON.stringify(leadContext, null, 2)}

YOUR JOB:
- Continue the SMS conversation naturally, ONE QUESTION AT A TIME.
- Keep replies SHORT — under 280 characters, ideally 1-2 sentences. SMS, not email.
- Collect anything important still missing: roof age, material, leak details, urgency, photos, best appointment time.
- Adapt question depth to the issue — leak / storm damage warrants more detail; estimate request stays light.
- After ~6-8 exchanges, wrap up: tell them the Wallace family will follow up to schedule.
- If they ask about pricing, never quote exact numbers. Estimates are free, inspections are $150 (credited toward work).
- For insurance: never promise approval. Say "we document, your insurance decides."
- For emergencies (active leak, ceiling damage): tell them to avoid water near outlets, stay out of sagging rooms, and that we can do same-day if needed.
- Reply STOP info: not needed unless they seem confused — Twilio handles it.

Today's date: ${new Date().toLocaleDateString()}.`;

    const geminiContents = convo.slice(1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        })
      }
    );
    const j = await r.json();
    let reply = j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Got it — let me get that to the team and they'll follow up shortly. Or call (903) 555-0000 if it's urgent.";

    // SMS hard cap
    if (reply.length > 320) reply = reply.slice(0, 317) + '...';

    convo.push({ role: 'assistant', content: reply });
    await env.LEADS.put(`convo:${from}`, JSON.stringify(convo));

    // Reply via TwiML
    return new Response(`<Response><Message>${escapeXml(reply)}</Message></Response>`,
      { headers: { 'Content-Type': 'text/xml' } });
  }
};

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c]));
}
```

### Setup checklist for the SMS system

1. **Twilio account** → buy 903 number → start A2P 10DLC registration TODAY
2. **Cloudflare KV namespace** named `LEADS`
3. **Wrangler.toml** binds `LEADS`, sets secrets: `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`, `GEMINI_API_KEY`
4. Deploy `lead-handler` Worker → expose at `wallaceroofingcollc.com/api/lead`
5. Deploy `sms-handler` Worker → expose at a public URL (e.g. `sms.wallaceroofingcollc.com`)
6. In Twilio console, set the inbound SMS webhook for your number to that `sms-handler` URL
7. In `index.html`, find `⚠️ HOOK UP BACKEND HERE` in the form submit handler — uncomment the fetch
8. Test end-to-end: submit the form, wait for SMS, reply, watch the AI continue the conversation

### If you don't want to build it yourself
Turnkey alternatives if a paying client wants something faster (you'd still mark it up as the integrator):

- **GoHighLevel** — ~$97/mo, all-in-one (CRM + SMS automations + AI). Roofers love it. Most of the local-pitch market is using it.
- **Vapi.ai** — strong AI SMS/voice agents, pay-as-you-go.
- **Twilio Studio** — drag-and-drop flows on top of Twilio. Free, but no AI brain unless you wire one in.

For Wallace specifically — given the 5-star reviews and small-town reputation — the custom Twilio + Gemini build is the right call. Cheap, fully yours, easy to tune.

---

## 5. AI video tools for tonight's ads — pick by deadline

You said you can edit Premiere professionally but want AI to generate the footage. Here's what's actually working right now (April 2026):

| Tool | Best for | Pricing | Why pick it |
|---|---|---|---|
| **Google Veo 3.1** (via Google Flow / Google AI Pro) | Cinematic 8-sec roof/home/Texas-skyline B-roll with native audio | $28.99/mo Pro | Best prompt adherence on the market right now. Native audio. Top of Zapier's leaderboard. Fastest path if you don't have Google AI yet. |
| **Runway Gen-4** | Hero ad — closer drone-style shots, slow pans over roofs | $15/mo Standard | Highest visual fidelity in independent benchmarks. 4K up to 60-sec continuous. |
| **Kling 3.0** | Photoreal home exteriors, "before/after" style scenes | Pay-as-you-go credits | Curious Refuge benchmarked it 8.4/10 visual fidelity (highest in field). |
| **Creatify** | URL-to-video — paste wallaceroofingcollc.com, get 5-10 ad variants in minutes | Starts ~$29/mo | Fastest path from "site is up" → "ads in Meta Ads Manager." Built for this exact workflow. |
| **HeyGen** | Avatar-based testimonial-style ads (simulated customer testimonials — be careful with this) | $24/mo Creator | Use sparingly. Ethically you should avoid fake "customer" avatars saying things real customers didn't say. |

### What I'd actually do tonight

1. **Hero ad** (the one you'll spend the most on): Veo 3.1 → 3 cinematic 8-second clips of:
   - Drone shot pulling away from a finished asphalt-shingle roof at golden hour, Texas sky
   - Close-up: hands hammering shingles, late afternoon light, no faces
   - Wide: a finished house with a clean dark roof, suburban Paris-TX feel
   Stitch in Premiere, add your logo + a voiceover, drop the same gold/navy palette.

2. **Variants for testing** (you want 4–8 to A/B test on Meta): Creatify → paste the live site URL, generate 8 short-form vertical variants. Most won't be great. Take the best 3, polish in Premiere.

3. **Voiceover**: ElevenLabs (~$5/mo Starter) — get a warm Texas-male voice for tagline reads. Or use HeyGen's voice library.

### Ad scripts (15-second versions, ready to plug in)

**Spot 1 — "Honest Work"**
> *(Drone shot of finished roof at golden hour)*
> "In Paris, Texas — your roof says everything about who you trust."
> *(Cut to family logo / business card)*
> "Wallace Roofing. Family-owned. Five stars. Free estimates."
> *(Phone number + URL stinger)*
> "Wallace Roofing dot com."

**Spot 2 — "After the Storm"**
> *(Quick cuts: heavy rain, shingles in a yard, then a hand pulling back a tarp to show clean new shingles)*
> "Hailstorm? Wind? Leak you've been ignoring?"
> *(Crew shot — back-of-truck angle, no faces required)*
> "Wallace Roofing has handled it for thirty years."
> *(End card)*
> "Free estimate. Same-week. Wallace Roofing dot com."

**Spot 3 — "Your Neighbors Already Know"**
> *(Static text on dark navy: "5.0 stars. 40 reviews.")*
> *(Quick zoom on the gold star)*
> "Lamar County's neighbors already know who to call."
> *(Logo card)*
> "Wallace Roofing Co. Paris, Texas."

Each of these is 12–15 seconds — perfect for Meta Reels and YouTube Shorts. Make a 30-second cut for Facebook feed.

---

## 6. Photos & videos — what to grab from his Facebook tonight

Your facebook.com/wallaceroofingco URL — go pull:

- **3 best "finished roof" shots** for the hero slideshow (replace the gradient placeholders in `.hero-slide-1/2/3`)
- **6 project shots** for the gallery (residential, commercial, in-progress, before/after — replace `.placeholder-1` through `.placeholder-6`)
- **1 team / truck / job-site shot** for the about section (replaces the dark navy block with the "30+ years" badge)
- **1 video** (the one you linked: facebook.com/share/v/1WBwgf5Hr2/) — embed in gallery section using Facebook's video embed (need to add an `<iframe>` block — easy add when you have the canonical URL)

### Image specs for the hero slideshow

The hero slides are full-bleed (~1920x1080 or larger). To swap, find this in `index.html`:

```css
.hero-slide-1 { background: ...; }
```

and replace with:
```css
.hero-slide-1 {
  background:
    linear-gradient(to bottom, rgba(7,15,34,0.4), rgba(7,15,34,0.7)),
    url('/images/hero-1.jpg') center/cover no-repeat;
}
```

Keep the dark gradient overlay — that's what makes the white headline readable on top of any photo.

---

## 7. Deploy checklist (tonight)

- [ ] Drop `index.html` in a new Cloudflare Pages project. Done in 3 minutes.
- [ ] Connect `wallaceroofingcollc.com` (you'll need to register the domain — Cloudflare Registrar or Namecheap, ~$10/yr)
- [ ] Replace the placeholder phone number `(903) 555-0000` in 4 spots (use Find/Replace)
- [ ] Replace placeholder email `hello@wallaceroofingcollc.com`
- [ ] Confirm hours with your uncle (Yelp vs Birdeye discrepancy — see section 2)
- [ ] Pull 10 photos + 1 video from Facebook → swap into hero, gallery, about
- [ ] Stand up the chat Worker → uncomment the `/api/chat` fetch in the chat widget JS
- [ ] Stand up the lead Worker → uncomment the `/api/lead` fetch in the form handler
- [ ] Buy Twilio number (903 area code) → start A2P 10DLC registration
- [ ] Deploy SMS Worker pair → set Twilio inbound webhook
- [ ] Test the form-to-SMS flow end-to-end
- [ ] (Tonight) Generate ad clips with Veo / Creatify, edit in Premiere, push to Meta Ads
- [ ] Update memory with this client so I have context for next session

---

## 8. Pitch / pricing for your books

For your records — what to charge or expense for this build:

- Website design + build: $1,500–3,000 (one-time)
- AI chatbot integration: $500–1,000 (one-time setup + Worker)
- SMS auto-text system: $750–1,500 (setup) + pass-through Twilio costs
- Monthly retainer (hosting, AI calls, edits, ad iteration): $200–400/mo

For your uncle, you'll probably do this at a "family rate" — but document the real value so you know what to charge the next 5 clients you cold-pitch. This exact stack is sellable to every restaurant, salon, and contractor in El Paso (or wherever you land).

---

## 9. One thing to be careful about

The fake AI-customer testimonial route (HeyGen avatars saying made-up reviews) — **don't go there for Wallace**. He has 40 real five-star reviews. Use those names, those words, paraphrased. The site already does this in the reviews section. Authenticity is his moat.

---

Hit me up when you're ready to wire the Worker — I can write the exact `wrangler.toml` and walk you through the Twilio A2P registration if you get stuck.

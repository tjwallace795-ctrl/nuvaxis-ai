# Ashbraids

Luxury braiding studio website for Ash — knotless, boho, twists, locs, and natural-hair styling — with a built-in AI concierge.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and the **Anthropic Claude API** (`claude-sonnet-4-6`).

> **Port note:** dev and prod both run on **port 4000** so the site never conflicts with Nuvaxis AI on port 3000.

## One-click deploy (mobile-friendly)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftjwallace795-ctrl%2Fnuvaxis-ai&project-name=ashbraids&repository-name=ashbraids&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20that%20powers%20the%20AI%20concierge&envLink=https%3A%2F%2Fconsole.anthropic.com%2Fsettings%2Fkeys&demo-title=Ashbraids&demo-description=Luxury%20braiding%20studio%20website%20with%20AI%20concierge&root-directory=.)

Tap the button on your phone, sign in to Vercel (GitHub), pick the
`claude/ashbraids-stylist-website-4F87M` branch, paste your
`ANTHROPIC_API_KEY`, and Vercel gives you back a live URL like
`https://ashbraids-xxx.vercel.app` you can open right from Safari.

## Features

- **Home** — editorial hero, about, and signature styles
- **Services** — full category-grouped menu with pricing and duration
- **Book** — 7-day calendar, 30-minute slots from 10:30 AM to 7:00 PM, live-looking bookings and availability
- **AI concierge** — floating chat that answers service / style / booking questions using the real service menu as grounded context (prompt-cached for speed)

## Getting started

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open <http://localhost:4000>.

## Environment

| Variable             | Purpose                         |
| -------------------- | ------------------------------- |
| `ANTHROPIC_API_KEY`  | Powers the `/api/chat` route    |

If `ANTHROPIC_API_KEY` is missing, the chat UI still loads and shows a clear error — the rest of the site works offline.

## Project layout

```
src/
  app/
    page.tsx              # Home
    services/page.tsx     # Services catalog
    book/page.tsx         # Appointment calendar
    api/chat/route.ts     # Claude-powered concierge
  components/
    Navbar.tsx
    Footer.tsx
    BookingCalendar.tsx
    ChatWidget.tsx
  data/
    services.ts           # Service menu + helpers
```

## Booksy

The live booking source of truth remains the stylist's Booksy page:
<https://booksy.com/en-us/dl/show-business/724017>

The in-app calendar is a concept UI seeded with sample bookings so clients can preview availability before tapping through to Booksy (or a future real backend).

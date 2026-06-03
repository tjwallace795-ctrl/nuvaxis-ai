# Nuvaxis AI — Master Changes Tracker
**Last updated:** 2026-04-19
**Purpose:** Read this file before making ANY change to the database or code. It is the single source of truth for what exists and what has been added.

---

## EXISTING DATABASE SCHEMA (DO NOT ALTER)

### Table: `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, FK → auth.users |
| business_name | text | |
| name | text | |
| industry | text | |
| niche | text | |
| location | text | Human-readable: "Miami, FL" |
| email | text | |
| phone | text | |
| website | text | |
| bio | text | |
| social_instagram | text | @handle (no OAuth) |
| social_tiktok | text | @handle (no OAuth) |
| social_youtube | text | @handle or channel name |
| updated_at | timestamptz | |
| subscription_status | text | free/starter/pro/agency (added migration 1) |
| setup_complete | boolean | default false (added migration 1) |
| bot_name | text | default 'Nova' (added migration 1) |
| goal | text | (added migration 1) |
| plan | text | stripe plan id: starter/solo-pro/business/premium |
| plan_status | text | trialing/active/canceled |
| stripe_customer_id | text | |
| stripe_subscription_id | text | |

**Plan → subscription_status mapping (in /api/profile GET):**
- starter → "starter"
- solo-pro → "starter"
- business → "pro"
- premium → "agency"
- (none) → "free"

### Table: `leads`
| Column | Type | Notes |
|---|---|---|
| id | text | PK (combined with user_id) |
| user_id | uuid | FK → auth.users |
| name | text | |
| handle | text | |
| avatar_url | text | |
| location | text | |
| lead_type | text | B2C/B2B |
| phone | text | |
| email | text | |
| profile_url | text | |
| outreach_channel | text | |
| instagram/twitter/facebook/linkedin/tiktok | text | |
| source | text | |
| intent_signal | text | |
| posted_at | text | |
| status | text | Hot/Warm/Cold |
| intent_score | integer | |
| urgency_score | integer | |
| why_they_need_you | text | |
| suggested_first_message | text | |
| business_type | text | |
| market | text | |
| created_at | timestamptz | |

---

## EXISTING API ROUTES

| Route | Method | Purpose |
|---|---|---|
| /api/profile | GET/POST | Read/write user profile |
| /api/leads | POST | AI lead generation (Serper + Claude) |
| /api/leads/cache | GET/POST | Server-side lead cache for Nova |
| /api/leads/draft | POST | Generate outreach messages |
| /api/chat | POST | Nova AI chat |
| /api/dashboard/stats | POST | Social follower stats via Serper |
| /api/social-scan | POST | AI content ideas |
| /api/social-review | POST | Platform analysis |
| /api/ads/discover/generate/suggest | POST | Ad campaign tools |
| /api/checkout/session | POST | Stripe checkout |
| /api/checkout/webhook | POST | Stripe webhook |
| /api/email/send | POST | Email via Resend |
| /api/notifications | GET | Notification feed |
| /api/explore/feed | POST | Explore content |
| /api/content-detail | POST | Content details |
| /api/trending | POST | Trending content |
| /auth/callback | GET | Supabase OAuth callback |

---

## EXISTING ENV VARS (.env.local)

```
ANTHROPIC_API_KEY=sk-ant-...     ✅ set
SERPER_API_KEY=e82352a7...       ✅ set
RESEND_API_KEY=                  ❌ EMPTY — email sending broken
STRIPE_SECRET_KEY=sk_test_...   ✅ set
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... ✅ set
STRIPE_WEBHOOK_SECRET=whsec_... ✅ set
NEXT_PUBLIC_SUPABASE_URL=https://ytjlwcwxxvttxlqqgmwl.supabase.co ✅ set
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... ✅ set
SUPABASE_SERVICE_ROLE_KEY=eyJ... ✅ set
```

---

## CHANGES LOG

### Migration 001 (already applied)
**File:** `supabase/migrations/migration.sql`
Added to `profiles`: subscription_status, setup_complete, bot_name, goal

---

### Migration 002 — City Slots + Social Tokens
**File:** `supabase/migrations/002_city_slots_social_tokens.sql`
**Status:** PENDING — run in Supabase SQL Editor
**What it adds:**
- New table: `city_slots` (city caps, 30 realtors per city)
- New table: `social_tokens` (OAuth tokens per user per platform)
- New columns on `profiles`: city_slug, last_lead_run, lead_run_count
- New RPC function: `claim_city_slot()` (atomic slot claim)
- RLS policies for both new tables

---

### New API Routes Added

| Route | File | Purpose | Status |
|---|---|---|---|
| /api/city/check | src/app/api/city/check/route.ts | Check city slot availability | BUILT |
| /api/city/claim | src/app/api/city/claim/route.ts | Claim a city slot on signup | BUILT |
| /api/auth/facebook | src/app/api/auth/facebook/route.ts | Start Facebook/Instagram OAuth | BUILT |
| /api/auth/facebook/callback | src/app/api/auth/facebook/callback/route.ts | Facebook OAuth callback | BUILT |
| /api/auth/twitter | src/app/api/auth/twitter/route.ts | Start Twitter OAuth | BUILT |
| /api/auth/twitter/callback | src/app/api/auth/twitter/callback/route.ts | Twitter OAuth callback | BUILT |
| /api/auth/tiktok | src/app/api/auth/tiktok/route.ts | Start TikTok OAuth | BUILT |
| /api/auth/tiktok/callback | src/app/api/auth/tiktok/callback/route.ts | TikTok OAuth callback | BUILT |
| /api/cron/leads | src/app/api/cron/leads/route.ts | Background AI lead gen per user | BUILT |

---

### Modified Files

| File | Change | Status |
|---|---|---|
| src/app/setup/page.tsx | Added city availability badge + cap check on finish | BUILT |
| src/app/dashboard/page.tsx | Updated Connected Accounts section to real OAuth buttons | BUILT |
| .env.local | Added OAuth + cron env var placeholders | BUILT |
| vercel.json | Added cron job schedule | BUILT |

---

## NEW ENV VARS NEEDED (add to .env.local)

```
# App URL (required for OAuth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Facebook / Instagram OAuth
# Create at: https://developers.facebook.com → My Apps → Create App → Business
# Permissions needed: instagram_basic, instagram_manage_messages, pages_messaging, pages_read_engagement
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Twitter / X OAuth 2.0
# Create at: https://developer.twitter.com → Projects & Apps → New App
# Scopes needed: dm.read, dm.write, tweet.read, users.read, offline.access
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

# TikTok for Developers
# Create at: https://developers.tiktok.com → Manage Apps
# Scopes: user.info.basic, video.list
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=

# Cron job secret (make up any random string, same value in vercel.json)
CRON_SECRET=nuvaxis-cron-secret-2026
```

---

## PLAN LIMITS (for background cron)

| Plan | subscription_status | Auto runs/day | Max leads/run |
|---|---|---|---|
| Free | free | 0 (manual only) | 5 manual |
| Starter / Solo Pro | starter | 2 | 15 |
| Business | pro | 4 | 40 |
| Premium | agency | 6 | unlimited |

---

## CITY CAP RULES
- Max 30 realtors per city (configurable per city in city_slots table)
- City slug format: "miami-fl", "dallas-tx", "el-paso-tx"
- Slot is claimed atomically via claim_city_slot() RPC function on setup completion
- If city full → user sees waitlist message, cannot proceed
- Admin can override max_slots per city directly in Supabase dashboard

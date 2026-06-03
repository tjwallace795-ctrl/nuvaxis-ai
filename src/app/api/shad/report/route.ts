/**
 * POST /api/shad/report
 * Receives security events from S.H.A.D Edge Middleware and stores them
 * to Supabase so the S.H.A.D Control Center can display them.
 * Also optionally forwards to the local S.H.A.D daemon webhook.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Only reports from same origin or the local S.H.A.D daemon are accepted.
const ALLOWED_ORIGINS = [
  "https://nuvaxisai.com",
  "http://localhost:3000",
  "http://localhost:5282",   // S.H.A.D Control Center
];

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  // Internal middleware calls have no origin — allow them
  if (!origin) return true;
  return ALLOWED_ORIGINS.some((o) => origin.startsWith(o));
}

// ── Supabase client (service role — server-side only) ─────────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── Payload schema ────────────────────────────────────────────────────────────

interface ReportPayload {
  event_type: string;   // "breach" | "warning" | "info"
  title:      string;
  detail?:    string;
  ip?:        string;
  path?:      string;
  ua?:        string;
  ts?:        string;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: ReportPayload;
  try {
    body = (await req.json()) as ReportPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { event_type, title, detail, ip, path, ua, ts } = body;

  if (!event_type || !title) {
    return NextResponse.json({ error: "event_type and title required" }, { status: 400 });
  }

  const record = {
    event_type: event_type.slice(0, 20),
    title:      title.slice(0, 200),
    detail:     (detail ?? "").slice(0, 1000),
    site:       "nuvaxisai.com",
    ip:         (ip ?? "").slice(0, 45),
    path:       (path ?? "").slice(0, 500),
    ua:         (ua ?? "").slice(0, 300),
    created_at: ts ?? new Date().toISOString(),
  };

  // Persist to Supabase if configured
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("shad_events").insert(record).then(({ error }) => {
      if (error) console.error("[S.H.A.D] Supabase insert error:", error.message);
    });
  }

  // Forward to local S.H.A.D daemon webhook (if SHAD_WEBHOOK_URL is set)
  const webhook = process.env.SHAD_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method:  "POST",
      headers: { "content-type": "application/json" },
      body:    JSON.stringify(record),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

// Health check
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: "S.H.A.D report endpoint active" });
}

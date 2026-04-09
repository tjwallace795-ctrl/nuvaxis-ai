/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CLARK — Cybersecurity Engineer · Nuvaxis AI Security Layer ║
 * ║  Edge Middleware: rate limiting, threat detection, blocking  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Runs on every incoming request BEFORE it reaches any route.
 * Enforces per-route rate limits, blocks injection attempts,
 * rejects oversized payloads, and logs suspicious activity.
 *
 * NOTE: In-memory maps reset on server restart. For multi-instance
 * production deployments, swap to Upstash Redis for persistence.
 */

import { NextRequest, NextResponse } from "next/server";

// ── Per-route rate limit rules (requests per window) ──────────────────────────
const API_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  "/api/chat":           { requests: 20,  windowMs: 60_000 }, // 20/min — AI chat
  "/api/leads":          { requests: 10,  windowMs: 60_000 }, // 10/min — lead gen
  "/api/social-review":  { requests: 15,  windowMs: 60_000 }, // 15/min — social AI
  "/api/explore":        { requests: 40,  windowMs: 60_000 }, // 40/min — explore feed
  "/api/":               { requests: 60,  windowMs: 60_000 }, // 60/min  — all other APIs
};

// ── In-memory sliding window store ────────────────────────────────────────────
const RL_STORE = new Map<string, { count: number; resetAt: number }>();

// ── Known attack patterns blocked at the edge ─────────────────────────────────
const THREAT_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\.\.[/\\]/,               label: "path-traversal"   },
  { pattern: /<script[\s>]/i,           label: "xss-script-tag"   },
  { pattern: /union[\s+]select/i,       label: "sql-injection"    },
  { pattern: /\bexec\s*\(/i,            label: "cmd-injection"    },
  { pattern: /javascript\s*:/i,         label: "js-protocol"      },
  { pattern: /\beval\s*\(/i,            label: "eval-injection"   },
  { pattern: /\bon\w+\s*=/i,            label: "inline-event"     },
  { pattern: /\bpwd\b|\betc\/passwd\b/, label: "lfi-attempt"      },
];

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

function enforceRateLimit(ip: string, pathname: string): boolean {
  // Match most-specific rule first, then fall back to generic "/api/"
  const rule =
    Object.entries(API_LIMITS).find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + "/")) ??
    (pathname.startsWith("/api/")
      ? (["/api/", API_LIMITS["/api/"]] as [string, { requests: number; windowMs: number }])
      : null);

  if (!rule) return true;

  const [, { requests, windowMs }] = rule;
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = RL_STORE.get(key);

  if (!entry || now > entry.resetAt) {
    RL_STORE.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= requests) return false;
  entry.count++;
  return true;
}

// Clean the store every 5 minutes to prevent unbounded memory growth
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return;
  lastCleanup = now;
  for (const [key, val] of RL_STORE) {
    if (now > val.resetAt) RL_STORE.delete(key);
  }
}

export function middleware(req: NextRequest) {
  maybeCleanup();

  const { pathname, search } = req.nextUrl;
  const fullPath = pathname + search;
  const ip = getClientIP(req);

  // 1 ── Threat pattern scan on URL ─────────────────────────────────────────
  for (const { pattern, label } of THREAT_PATTERNS) {
    if (pattern.test(decodeURIComponent(fullPath))) {
      console.warn(`[CLARK] 🚨 THREAT BLOCKED | type=${label} | ip=${ip} | path=${fullPath}`);
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 2 ── Reject suspiciously large payloads early ────────────────────────────
  const contentLength = req.headers.get("content-length");
  if (contentLength) {
    const bytes = parseInt(contentLength, 10);
    if (!isNaN(bytes) && bytes > 2_000_000) { // 2 MB hard cap
      console.warn(`[CLARK] 🚨 OVERSIZED PAYLOAD | ip=${ip} | size=${bytes}B | path=${pathname}`);
      return new NextResponse("Payload Too Large", { status: 413 });
    }
  }

  // 3 ── Per-route rate limiting on API endpoints ────────────────────────────
  if (pathname.startsWith("/api/")) {
    if (!enforceRateLimit(ip, pathname)) {
      console.warn(`[CLARK] ⏱ RATE LIMITED | ip=${ip} | path=${pathname}`);
      return NextResponse.json(
        { error: "Too many requests — please slow down and try again in a moment." },
        {
          status: 429,
          headers: {
            "Retry-After":       "60",
            "X-RateLimit-Limit": String(
              Object.entries(API_LIMITS).find(([p]) => pathname.startsWith(p))?.[1].requests ?? 60
            ),
          },
        }
      );
    }
  }

  // 4 ── Block access to internal/dev paths in production ───────────────────
  if (
    process.env.NODE_ENV === "production" &&
    (pathname.startsWith("/_") && !pathname.startsWith("/_next/"))
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

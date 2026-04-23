/**
 * S.H.A.D Edge Middleware — nuvaxisai.com
 * Runs on every request at the Edge before any page or API handler.
 * Security layers: scanner blocking, injection detection, rate awareness, extra headers.
 */

import { NextRequest, NextResponse } from "next/server";

// ── Scanner / bot User-Agent blocklist ────────────────────────────────────────

const BLOCKED_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /dirbuster/i, /gobuster/i,
  /nuclei/i, /acunetix/i, /nessus/i, /openvas/i, /burpsuite/i, /zaproxy/i,
  /havij/i,  /w3af/i,   /metasploit/i,
];

// ── Injection signatures (fast path — Edge-safe, no regex flags issue) ────────

const INJECTION_SIGS = [
  "union select", "union+select", "1=1--", "' or '", "\" or \"",
  "<script", "javascript:", "onerror=", "onload=", "eval(",
  "../", "..\\", "/etc/passwd", "cmd.exe", "powershell",
  "{{", "}}", "${", "<%",
];

function hasInjection(value: string): boolean {
  const lower = value.toLowerCase();
  return INJECTION_SIGS.some((sig) => lower.includes(sig));
}

// ── Paths that bypass security scan (static assets, health checks) ────────────

function isBypassed(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/api/health" ||
    pathname === "/api/shad/report"       // reporting endpoint itself
  );
}

// ── Report a security event to S.H.A.D (fire-and-forget, non-blocking) ───────

function reportToShad(payload: {
  event_type: string;
  title: string;
  detail: string;
  ip: string;
  path: string;
  ua: string;
}): void {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://nuvaxisai.com";
  fetch(`${base}/api/shad/report`, {
    method:  "POST",
    headers: { "content-type": "application/json" },
    body:    JSON.stringify({ ...payload, ts: new Date().toISOString() }),
  }).catch(() => { /* fire-and-forget — never block the request */ });
}

// ── Main middleware ───────────────────────────────────────────────────────────

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (isBypassed(pathname)) return NextResponse.next();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "0.0.0.0";
  const ua = req.headers.get("user-agent") ?? "";

  // Layer 1 — Block scanners by User-Agent
  if (BLOCKED_UA_PATTERNS.some((re) => re.test(ua))) {
    reportToShad({
      event_type: "warning",
      title:      "Scanner detected and blocked",
      detail:     `UA: ${ua.slice(0, 120)}`,
      ip, path: pathname, ua,
    });
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Layer 2 — Scan URL path + query string for injection
  const fullUrl = pathname + (req.nextUrl.search ?? "");
  if (hasInjection(fullUrl)) {
    reportToShad({
      event_type: "breach",
      title:      "Injection attempt blocked in URL",
      detail:     `Path: ${fullUrl.slice(0, 200)}`,
      ip, path: pathname, ua,
    });
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Layer 3 — Security response headers (supplement Clark's static headers)
  const res = NextResponse.next();

  res.headers.set("x-shad-protected", "1");
  res.headers.set("x-content-type-options",  "nosniff");
  res.headers.set("x-permitted-cross-domain-policies", "none");
  res.headers.set("cross-origin-opener-policy", "same-origin");
  res.headers.set("cross-origin-embedder-policy", "require-corp");

  // Remove fingerprinting headers Vercel might add
  res.headers.delete("x-powered-by");
  res.headers.delete("server");

  // S.H.A.D auto-patch
  res.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};

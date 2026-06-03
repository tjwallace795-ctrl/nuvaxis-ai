/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  S.H.A.D — Security Hardened Autonomous Daemon                  ║
 * ║  Extended runtime security utilities for nuvaxisai.com          ║
 * ║  Builds on Clark's static protections with active monitoring.   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export { containsThreat, sanitizeString, getClientIP } from "./clark-security";

// ── Event reporting ───────────────────────────────────────────────────────────

type EventType = "breach" | "warning" | "fix" | "info";

interface ShadEvent {
  event_type: EventType;
  title:      string;
  detail?:    string;
  ip?:        string;
  path?:      string;
  ua?:        string;
}

/**
 * Report a security event to the S.H.A.D reporting endpoint.
 * Fire-and-forget — never throws, never blocks the caller.
 */
export async function reportEvent(event: ShadEvent): Promise<void> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
    await fetch(`${base}/api/shad/report`, {
      method:  "POST",
      headers: { "content-type": "application/json" },
      body:    JSON.stringify({ ...event, ts: new Date().toISOString() }),
    });
  } catch {
    // Silently ignore — security logging must never break the app
  }
}

export const shadBreach  = (title: string, detail?: string, extra?: Partial<ShadEvent>) =>
  reportEvent({ event_type: "breach",  title, detail, ...extra });

export const shadWarning = (title: string, detail?: string, extra?: Partial<ShadEvent>) =>
  reportEvent({ event_type: "warning", title, detail, ...extra });

export const shadInfo    = (title: string, detail?: string) =>
  reportEvent({ event_type: "info",    title, detail });

// ── Request inspection helpers ────────────────────────────────────────────────

/**
 * Scan a Next.js Request object for common attack vectors.
 * Returns { safe: true } or { safe: false, reason: string }.
 */
export async function inspectRequest(
  req: Request
): Promise<{ safe: boolean; reason?: string }> {
  const url = new URL(req.url);
  const fullPath = url.pathname + url.search;

  const SIGS = [
    "union select", "union+select", "1=1--", "' or '",
    "<script", "javascript:", "onerror=", "onload=", "eval(",
    "../", "/etc/passwd", "cmd.exe", "{{", "}}",
  ];
  const lower = fullPath.toLowerCase();
  for (const sig of SIGS) {
    if (lower.includes(sig)) return { safe: false, reason: `injection: ${sig}` };
  }

  // Check body on POST/PUT/PATCH (text only, max 50 KB)
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    try {
      const body = await req.clone().text();
      if (body.length < 51_200) {
        const bodyLower = body.toLowerCase();
        for (const sig of SIGS) {
          if (bodyLower.includes(sig)) return { safe: false, reason: `body injection: ${sig}` };
        }
      }
    } catch {
      // Body unreadable — pass through
    }
  }

  return { safe: true };
}

// ── Honeypot field guard ──────────────────────────────────────────────────────

/**
 * Returns true if a hidden honeypot field was filled in (bot detection).
 * Use in form API routes: if (isBot(formData)) return 400.
 */
export function isBot(data: Record<string, unknown>, honeypotField = "website"): boolean {
  const val = data[honeypotField];
  return typeof val === "string" && val.trim().length > 0;
}

// ── Response header helpers ───────────────────────────────────────────────────

/**
 * Apply S.H.A.D hardening headers to any Response.
 * Supplements the static headers already set by Clark in next.config.ts.
 */
export function hardenResponse(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("x-shad-protected",    "1");
  headers.set("x-content-type-options", "nosniff");
  headers.delete("x-powered-by");
  headers.delete("server");
  return new Response(res.body, {
    status:     res.status,
    statusText: res.statusText,
    headers,
  });
}

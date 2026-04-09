/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CLARK — Cybersecurity Engineer · Security Utilities        ║
 * ║  Input validation, threat detection, API key verification   ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ── Injection / attack pattern detection ─────────────────────────────────────

const INJECTION_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /<script[\s>]/i,             label: "xss-script"       },
  { pattern: /on\w+\s*=\s*["']/i,        label: "xss-event"        },
  { pattern: /javascript\s*:/i,           label: "js-protocol"      },
  { pattern: /union[\s\+]+select/i,       label: "sql-injection"    },
  { pattern: /;\s*drop\s+table/i,         label: "sql-drop"         },
  { pattern: /\bexec\s*\(/i,             label: "cmd-injection"    },
  { pattern: /\beval\s*\(/i,             label: "eval-injection"   },
  { pattern: /\.\.[/\\]/,               label: "path-traversal"   },
  { pattern: /\{\{.*\}\}/,              label: "template-injection"},
];

/**
 * Returns true if the string contains a known attack pattern.
 * Use on any user-supplied text before processing or storing.
 */
export function containsThreat(input: string): { threat: boolean; label?: string } {
  for (const { pattern, label } of INJECTION_PATTERNS) {
    if (pattern.test(input)) return { threat: true, label };
  }
  return { threat: false };
}

// ── String sanitization ───────────────────────────────────────────────────────

/**
 * Strip HTML tags, script/event handlers, and dangerous protocols from a string.
 * Returns a plain-text safe version.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .trim();
}

// ── Environment / API key validation ─────────────────────────────────────────

/**
 * Verify required server-side environment variables are present.
 * Call this at the top of API routes to fail fast with a clear error.
 */
export function assertEnvKeys(...keys: string[]): void {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `[CLARK] Missing required environment variable(s): ${missing.join(", ")}`
    );
  }
}

/**
 * Mask an API key for safe logging (shows first 8 and last 4 chars).
 * Example: "sk-ant-api03-abc...xyz"
 */
export function maskKey(key: string): string {
  if (key.length < 16) return "***";
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

// ── Request validation helpers ────────────────────────────────────────────────

/**
 * Extract and validate a client IP from Next.js request headers.
 * Returns "0.0.0.0" as a safe fallback if none is found.
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (isValidIP(first)) return first;
  }
  const realIP = headers.get("x-real-ip");
  if (realIP && isValidIP(realIP)) return realIP;
  return "0.0.0.0";
}

function isValidIP(ip: string): boolean {
  // IPv4
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return true;
  // IPv6 (simplified)
  if (/^[0-9a-fA-F:]+$/.test(ip) && ip.includes(":")) return true;
  return false;
}

/**
 * Check that the Content-Type is one of the allowed types.
 * Protects API routes from unexpected content type attacks.
 */
export function isAllowedContentType(
  contentType: string | null,
  allowed: string[] = ["application/json"]
): boolean {
  if (!contentType) return false;
  return allowed.some((type) => contentType.includes(type));
}

// ── Data boundary guard ───────────────────────────────────────────────────────

/**
 * Enforce hard limits on string/array fields in untrusted objects.
 * Returns false if any limit is exceeded.
 */
export function withinLimits(
  value: unknown,
  opts: { maxStringLength?: number; maxArrayLength?: number }
): boolean {
  if (typeof value === "string") {
    return !opts.maxStringLength || value.length <= opts.maxStringLength;
  }
  if (Array.isArray(value)) {
    if (opts.maxArrayLength && value.length > opts.maxArrayLength) return false;
    return value.every((item) => withinLimits(item, opts));
  }
  return true;
}

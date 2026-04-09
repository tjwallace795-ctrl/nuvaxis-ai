import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limiter";

/** Extract the real client IP from the request. */
function getIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first entry
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

/** Attach security headers to a response. */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

/** Build a 429 JSON response with security headers attached. */
function tooManyRequests(): NextResponse {
  const res = NextResponse.json(
    { error: "Too many requests. Please slow down." },
    { status: 429 }
  );
  return applySecurityHeaders(res);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getIP(request);

  // Only apply rate limiting to /api/* routes
  if (pathname.startsWith("/api/")) {
    let result: { allowed: boolean; remaining: number };

    if (pathname.startsWith("/api/chat")) {
      // 20 requests per IP per minute
      result = rateLimit(ip, 20, 60_000);
    } else if (pathname.startsWith("/api/leads/cache")) {
      if (request.method === "POST") {
        // 30 POST requests per IP per minute
        result = rateLimit(ip, 30, 60_000);
      } else {
        // GET on /api/leads/cache — use general limit
        result = rateLimit(ip, 60, 60_000);
      }
    } else if (pathname.startsWith("/api/leads")) {
      // 10 requests per IP per 5 minutes
      result = rateLimit(ip, 10, 5 * 60_000);
    } else if (pathname.startsWith("/api/email/send")) {
      // 5 requests per IP per hour
      result = rateLimit(ip, 5, 60 * 60_000);
    } else {
      // All other /api/* — 60 per IP per minute
      result = rateLimit(ip, 60, 60_000);
    }

    if (!result.allowed) {
      return tooManyRequests();
    }
  }

  // Pass the request through and apply security headers to the response
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
  ],
};

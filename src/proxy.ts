import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { rateLimit } from "@/lib/rate-limiter";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "media-src 'self' https:",
  "connect-src 'self' https://api.anthropic.com https://google.serper.dev https://api.resend.com https://ytjlwcwxxvttxlqqgmwl.supabase.co wss://ytjlwcwxxvttxlqqgmwl.supabase.co",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** Extract the real client IP from the request. */
function getIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

/** Attach security headers to a response. */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", CSP);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getIP(request);

  // ── Auth protection for /dashboard ────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return applySecurityHeaders(response);
  }

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
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};

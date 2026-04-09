/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CLARK — Cybersecurity Engineer · Security Headers Config   ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.200"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clark-enforced security headers
          { key: "Content-Security-Policy",           value: CSP },
          { key: "X-Content-Type-Options",            value: "nosniff" },
          { key: "X-Frame-Options",                   value: "DENY" },
          { key: "X-XSS-Protection",                  value: "1; mode=block" },
          { key: "Referrer-Policy",                   value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",                value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security",         value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy",        value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy",      value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy",      value: "unsafe-none" },
          { key: "X-DNS-Prefetch-Control",            value: "off" },
        ],
      },
      {
        // Relax COEP for the explore feed (loads external images)
        source: "/dashboard/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
};

export default nextConfig;

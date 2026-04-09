"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import {
  Check, Clock, Loader2, Shield, CreditCard,
  ArrowLeft, Sparkles,
} from "lucide-react";

// ── Plan metadata (mirrors pricing-section-4.tsx) ─────────────────────────────

const PLANS: Record<string, {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  buildFee: number;
  description: string;
  features: { label: string; soon?: boolean }[];
  popular?: boolean;
}> = {
  starter: {
    id: "starter",
    name: "Starter",
    subtitle: "Web Presence",
    price: 75,
    buildFee: 200,
    description: "A clean, professional website that actually shows up on Google — built in under 2 weeks.",
    features: [
      { label: "Up to 5-page website" },
      { label: "Mobile-friendly design" },
      { label: "Custom domain + hosting" },
      { label: "Google Maps + contact form" },
      { label: "Basic SEO setup" },
      { label: "2 content updates/month" },
      { label: "AI chatbot" },
      { label: "Order management" },
    ],
  },
  "solo-pro": {
    id: "solo-pro",
    name: "Solo Pro",
    subtitle: "",
    price: 149,
    buildFee: 350,
    popular: true,
    description: "Website + AI chatbot that handles inquiries 24/7 so you don't have to.",
    features: [
      { label: "Everything in Web Presence" },
      { label: "Up to 8 pages" },
      { label: "AI chatbot (answers FAQs + collects leads)" },
      { label: "Appointment / booking link" },
      { label: "Unlimited content updates" },
      { label: "Priority email support" },
      { label: "Order management system" },
      { label: "Lead generator", soon: true },
    ],
  },
  business: {
    id: "business",
    name: "Business",
    subtitle: "Business Revamp",
    price: 249,
    buildFee: 599,
    description: "Full website rebuild + chatbot + organized order flow. Like what we built for Love Pho 2.",
    features: [
      { label: "Up to 15-page custom website" },
      { label: "AI chatbot (orders, FAQs, reservations)" },
      { label: "Order management system" },
      { label: "Menu / service catalog page" },
      { label: "Google + Yelp review integration" },
      { label: "Local SEO + Google Business" },
      { label: "Monthly check-in call" },
      { label: "Lead generator", soon: true },
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    subtitle: "Growth Partner",
    price: 449,
    buildFee: 999,
    description: "For companies that want the full package — web, AI tools, and a dedicated partner in their corner.",
    features: [
      { label: "Everything in Business Revamp" },
      { label: "Unlimited pages" },
      { label: "Custom AI tool for your workflow" },
      { label: "Staff / team member portal" },
      { label: "Social media chatbot (FB + IG DMs)" },
      { label: "Bi-weekly strategy calls" },
      { label: "Priority same-day support" },
      { label: "Lead generator — early access", soon: true },
    ],
  },
};

// ── Nuvaxis logo SVG ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <a href="/" className="inline-flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="url(#cg1)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
        <circle cx="18" cy="18" r="5" fill="url(#cg2)" />
        <circle cx="28" cy="8" r="2.5" fill="#3b82f6" opacity="0.9" />
        <circle cx="8" cy="28" r="2.5" fill="#6366f1" opacity="0.9" />
        <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
        <line x1="18" y1="13" x2="26.5" y2="9.5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        <line x1="18" y1="23" x2="9.5" y2="26.5" stroke="#6366f1" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="cg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
        </defs>
      </svg>
      <span className="text-white font-semibold text-xl" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", letterSpacing: "-0.03em" }}>
        Nuvaxis <span className="text-blue-500">AI</span>
      </span>
    </a>
  );
}

// ── Inner component that uses useSearchParams ─────────────────────────────────

function CheckoutInner() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "starter";

  const plan = PLANS[planId] ?? PLANS.starter;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill email from query param if provided (e.g. after signup)
  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail) setEmail(decodeURIComponent(qEmail));
  }, [searchParams]);

  const handleCheckout = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, customerEmail: email }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicParallaxBg head="" text="" />
      </div>
      <div className="fixed inset-0 z-[1] bg-black/50 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <Logo />
        <Link href="/#pricing" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to pricing
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 lg:gap-10 items-start">

          {/* ── Left: Plan summary ── */}
          <div className="space-y-5">
            {/* Plan header */}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-white text-2xl font-semibold" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  {plan.name}
                </h2>
                {plan.subtitle && (
                  <span className="text-xs text-blue-400 font-medium bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    {plan.subtitle}
                  </span>
                )}
                {plan.popular && (
                  <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                    Most popular
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm leading-snug">{plan.description}</p>
            </div>

            {/* Pricing breakdown */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Monthly (after trial)</span>
                <span className="text-white font-semibold">${plan.price}<span className="text-white/40 text-xs font-normal">/mo</span></span>
              </div>
              <div className="border-t border-white/[0.07] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Due today
                  </span>
                  <span className="text-emerald-400 font-bold text-lg">$0.00</span>
                </div>
                <p className="text-white/25 text-xs mt-1">
                  7-day free trial — card saved, not charged until trial ends
                </p>
              </div>
            </div>

            {/* Trial badge */}
            <div className="flex items-start gap-3 p-3 bg-blue-500/[0.07] border border-blue-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">7-day free trial</p>
                <p className="text-white/40 text-xs mt-0.5 leading-snug">
                  Cancel anytime before day 7 and you won&apos;t be charged. No questions asked.
                </p>
              </div>
            </div>

            {/* Features list */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-3">What&apos;s included</p>
              <ul className="space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${f.soon ? "bg-yellow-500/10 border border-yellow-500/25" : "bg-blue-500/15 border border-blue-500/20"}`}>
                      {f.soon
                        ? <Clock className="w-2.5 h-2.5 text-yellow-400" />
                        : <Check className="w-2.5 h-2.5 text-blue-400" />
                      }
                    </span>
                    <span className="text-sm text-white/60">
                      {f.label}
                      {f.soon && (
                        <span className="ml-1.5 text-[10px] text-yellow-400/70 bg-yellow-500/10 border border-yellow-500/15 px-1.5 py-0.5 rounded-full">
                          Coming soon
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Payment form ── */}
          <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-6 backdrop-blur-xl shadow-2xl shadow-black/40 space-y-5">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                Start your free trial
              </h3>
              <p className="text-white/30 text-xs">
                Enter your email — Stripe will collect your card info securely on the next step.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCheckout(); }}
                placeholder="you@example.com"
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Preparing checkout…</>
                : <><CreditCard className="w-4 h-4" />Continue to payment — free for 7 days</>
              }
            </button>

            {/* Payment badges */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Apple Pay */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                  <svg viewBox="0 0 48 20" className="h-4 w-auto" fill="currentColor">
                    <text x="0" y="15" className="text-white" fontSize="14" fontWeight="600" fill="white" fontFamily="-apple-system, sans-serif"> Pay</text>
                  </svg>
                  <span className="text-white text-xs font-semibold" style={{ fontFamily: "-apple-system, sans-serif" }}>Apple Pay</span>
                </div>
                {/* Card */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                  <CreditCard className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-xs">Visa / MC / Amex</span>
                </div>
                {/* Google Pay */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                  <span className="text-white/60 text-xs font-medium">G Pay</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-white/20 text-xs">
                <Shield className="w-3 h-3" />
                Payments processed by Stripe — 256-bit SSL encrypted
              </div>
            </div>

            {/* Fine print */}
            <div className="border-t border-white/[0.07] pt-4 space-y-1.5 text-xs text-white/25 leading-relaxed">
              <p>By continuing you agree to our Terms of Service. Your card is saved but not charged until day 7. Cancel anytime in your account settings.</p>
            </div>

            {/* Already have account */}
            <p className="text-center text-white/25 text-xs">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
            </p>
          </div>

        </div>
      </main>

      {/* Bottom note */}
      <footer className="relative z-10 text-center pb-6 px-4">
        <p className="text-white/20 text-xs">
          El Paso clients get a free 30-min consultation before signing. Questions?{" "}
          <a href="/#contact" className="text-white/40 hover:text-white/60 transition-colors underline">Contact us</a>
        </p>
      </footer>
    </div>
  );
}

// ── Page wrapper with Suspense (required for useSearchParams) ─────────────────

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
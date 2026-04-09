"use client";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import { useRef } from "react";

// ── Plan data ──────────────────────────────────────────────────────────────────

const SOLO_PLANS = [
  {
    name: "Starter",
    planId: "starter",
    subtitle: "Web Presence",
    description:
      "A clean, professional website that actually shows up on Google — built in under 2 weeks.",
    price: 75,
    buildFee: 200,
    popular: false,
    buttonText: "Start free trial ↗",
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
  {
    name: "Solo Pro",
    planId: "solo-pro",
    subtitle: null,
    description:
      "Website + AI chatbot that handles inquiries 24/7 so you don't have to.",
    price: 149,
    buildFee: 350,
    popular: true,
    buttonText: "Start free trial ↗",
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
];

const BUSINESS_PLANS = [
  {
    name: "Business",
    planId: "business",
    subtitle: "Business Revamp",
    description:
      "Full website rebuild + chatbot + organized order flow. Like what we built for Love Pho 2.",
    price: 249,
    buildFee: 599,
    popular: false,
    buttonText: "Start free trial ↗",
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
  {
    name: "Premium",
    planId: "premium",
    subtitle: "Growth Partner",
    description:
      "For companies that want the full package — web, AI tools, and a dedicated partner in their corner.",
    price: 449,
    buildFee: 999,
    popular: false,
    buttonText: "Start free trial ↗",
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
];

const ADD_ONS = [
  {
    label: "Extra pages",
    price: "+$25/page one-time",
    note: "Add pages beyond your plan limit anytime.",
  },
  {
    label: "Logo design",
    price: "$150 one-time",
    note: "Simple, clean logo if you don't have one yet.",
  },
  {
    label: "Extra chatbot",
    price: "+$49/mo",
    note: "Second chatbot for a different location or use case.",
  },
  {
    label: "Rush build",
    price: "+$150 one-time",
    note: "Need it done in 5 days or less? Rush fee applies.",
  },
  {
    label: "Annual billing",
    price: "2 months free",
    note: "Pay upfront for the year, get 2 months at no charge.",
    highlight: true,
  },
  {
    label: "Lead generator",
    price: "Coming soon",
    note: "Salem Leads pipeline — add-on once the members portal launches.",
    soon: true,
  },
];

// ── Plan card ──────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: (typeof SOLO_PLANS)[0] }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border text-white overflow-hidden",
        plan.popular
          ? "border-blue-500/50 bg-gradient-to-b from-blue-950/60 to-neutral-900 shadow-[0_0_60px_-10px_rgba(37,99,235,0.45)]"
          : "border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950",
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      )}

      <div className="p-6 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              {plan.popular && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
            </div>
            {plan.subtitle && (
              <p className="text-xs text-blue-400 font-medium mt-0.5">{plan.subtitle}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-2 mb-4 leading-snug">{plan.description}</p>

        {/* Price */}
        <div className="mb-1">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-400 text-sm ml-1">/mo</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          + ${plan.buildFee.toLocaleString()} one-time build fee
        </p>
        <p className="text-xs text-emerald-400/80 font-medium mb-5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          7-day free trial — $0 today
        </p>

        {/* CTA */}
        <a
          href={`/checkout?plan=${plan.planId}`}
          className={cn(
            "block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all",
            plan.popular
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
              : "bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.12]",
          )}
        >
          {plan.buttonText}
        </a>
      </div>

      {/* Features */}
      <div className="px-6 pb-6 pt-2 border-t border-white/[0.07] flex-1">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-3 mt-3">
          What&apos;s included
        </p>
        <ul className="space-y-2.5">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                  f.soon
                    ? "bg-yellow-500/10 border border-yellow-500/30"
                    : "bg-blue-500/15 border border-blue-500/25",
                )}
              >
                {f.soon ? (
                  <Clock className="w-2.5 h-2.5 text-yellow-400" />
                ) : (
                  <Check className="w-2.5 h-2.5 text-blue-400" />
                )}
              </span>
              <span className="text-sm text-gray-300 leading-snug">
                {f.label}
                {f.soon && (
                  <span className="ml-1.5 text-[10px] font-semibold text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PricingSection4() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.35, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  return (
    <div className="mx-auto relative overflow-hidden" ref={pricingRef}>
      {/* Background sparkles */}
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]" />
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      {/* Blue glow */}
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #3131f5",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
          />
        </div>
      </TimelineContent>

      {/* ── Header ── */}
      <article className="text-center mb-10 pt-20 md:pt-32 max-w-2xl mx-auto space-y-3 relative z-50 px-4 sm:px-6">
        <TimelineContent
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-white">
            Nuvaxis AI — Services &amp; Pricing
          </h2>
        </TimelineContent>
        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-400 text-sm md:text-base"
        >
          Built for El Paso businesses. No fluff, no bloated retainers — just real work at fair prices.
        </TimelineContent>
      </article>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 pb-16">

        {/* ── Solo / Small Business ── */}
        <TimelineContent
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Solo operators &amp; small businesses
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {SOLO_PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </TimelineContent>

        {/* ── Restaurants / Retail / Growing ── */}
        <TimelineContent
          animationNum={3}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Restaurants, retail &amp; growing companies
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {BUSINESS_PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </TimelineContent>

        {/* ── Add-ons ── */}
        <TimelineContent
          animationNum={4}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Add-ons
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ADD_ONS.map((addon) => (
              <div
                key={addon.label}
                className={cn(
                  "rounded-xl border p-4 space-y-1",
                  addon.highlight
                    ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                    : addon.soon
                    ? "border-yellow-500/20 bg-yellow-500/[0.04]"
                    : "border-neutral-800 bg-neutral-900/60",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{addon.label}</p>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full border whitespace-nowrap",
                      addon.highlight
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                        : addon.soon
                        ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/25"
                        : "text-blue-300 bg-blue-500/10 border-blue-500/20",
                    )}
                  >
                    {addon.price}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-snug">{addon.note}</p>
              </div>
            ))}
          </div>
        </TimelineContent>

        {/* ── Footer notes ── */}
        <TimelineContent
          animationNum={5}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <div className="border-t border-white/[0.07] pt-6 space-y-2">
            {[
              "All plans include hosting, SSL, and maintenance. Build fees are waived on annual billing.",
              "Ad spend goes directly to your platform — Nuvaxis AI never touches your ad budget.",
              "Clients anywhere get a free 30-min consultation before signing.",
            ].map((note) => (
              <p key={note} className="text-xs text-gray-500 flex items-start gap-2">
                <span className="text-gray-600 mt-0.5 flex-shrink-0">—</span>
                {note}
              </p>
            ))}
          </div>
        </TimelineContent>

      </div>
    </div>
  );
}

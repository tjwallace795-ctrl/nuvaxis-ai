"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Sparkles,
  MapPin,
  Building2,
  RefreshCw,
  ChevronRight,
  Zap,
  Copy,
  Check,
  MessageSquare,
  Briefcase,
  AlertCircle,
  Users,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  User,
  Building,
  Clock,
} from "lucide-react";
import {
  leadStore,
  useLeadStore,
  LeadQuery,
  IndividualLead,
} from "@/lib/lead-store";

// ── Occupation map ─────────────────────────────────────────────────────────────

const OCCUPATIONS = [
  "Real Estate Agent", "Dental Office", "Roofer", "Med Spa", "AI Agency",
  "Fitness Coach", "Restaurant Owner", "Auto Detailing", "Plumber",
  "HVAC Technician", "Landscaper", "Electrician", "Attorney / Law Firm",
  "Chiropractor", "Insurance Agent", "Financial Advisor", "Wedding Photographer",
  "Interior Designer", "Moving Company", "Pressure Washing", "Solar Installer",
  "Mortgage Broker", "Dog Trainer", "Event Planner", "Cleaning Service",
];

interface OccupationPreset { targetCustomer: string; offer: string; intentSignals: string[] }

const OCCUPATION_PRESETS: Record<string, OccupationPreset> = {
  "Real Estate Agent":    { targetCustomer: "Home buyers and sellers in the area", offer: "Help buying, selling, and listing homes", intentSignals: ["Looking to buy a house", "Looking for a realtor", "First time home buyer", "Moving to the area", "Selling my home", "Need a realtor recommendation", "Ready to buy now"] },
  "Dental Office":        { targetCustomer: "Local patients needing dental or cosmetic work", offer: "General, cosmetic, and emergency dental services", intentSignals: ["Quote requests", "Appointment searches", "Emergency dental need", "Invisalign pricing"] },
  "Roofer":               { targetCustomer: "Homeowners needing roof repair or replacement", offer: "Roof repair, replacement, and storm damage restoration", intentSignals: ["Storm damage searches", "Quote requests", "Roof leak urgency", "Insurance claim help"] },
  "Med Spa":              { targetCustomer: "Adults seeking aesthetic treatments", offer: "Botox, fillers, laser treatments, and skin services", intentSignals: ["Pricing searches", "Before/after research", "Booking availability", "Consultation requests"] },
  "AI Agency":            { targetCustomer: "Small to mid-size business owners needing automation", offer: "AI chatbots, websites, and lead generation systems", intentSignals: ["Lead gen solutions", "CRM help", "Chatbot tools", "Website automation"] },
  "Fitness Coach":        { targetCustomer: "Adults 25–45 seeking transformation or weight loss", offer: "Online or in-person fitness coaching and programs", intentSignals: ["Program comparisons", "Coach pricing", "Transformation content", "Free trial searches"] },
  "Plumber":              { targetCustomer: "Homeowners with plumbing problems or renovations", offer: "Plumbing repair, installation, and emergency services", intentSignals: ["Emergency plumbing", "Quote requests", "Pipe burst urgency", "Water heater replacement"] },
  "HVAC Technician":      { targetCustomer: "Homeowners and businesses needing heating or cooling", offer: "HVAC repair, installation, and maintenance", intentSignals: ["AC not working", "Emergency HVAC", "New system quotes", "Energy bill concerns"] },
  "Landscaper":           { targetCustomer: "Homeowners wanting lawn care and landscaping", offer: "Lawn maintenance, landscaping design, and care", intentSignals: ["Lawn care quotes", "Seasonal cleanup", "Sod installation", "Landscaping design"] },
  "Insurance Agent":      { targetCustomer: "Families and businesses needing insurance coverage", offer: "Life, home, auto, and business insurance", intentSignals: ["Insurance quote requests", "Coverage comparisons", "Policy renewals", "Life event triggers"] },
  "Mortgage Broker":      { targetCustomer: "Home buyers and refinancers", offer: "Home loans, refinancing, and mortgage guidance", intentSignals: ["Pre-approval searches", "Rate comparisons", "First-time buyer questions", "Refinance inquiries"] },
  "Solar Installer":      { targetCustomer: "Homeowners interested in going solar", offer: "Solar panel installation and energy savings", intentSignals: ["Solar quote requests", "Energy bill concerns", "Tax credit questions", "Comparing solar companies"] },
  "Cleaning Service":     { targetCustomer: "Homeowners and businesses needing regular cleaning", offer: "Residential and commercial cleaning services", intentSignals: ["Cleaning quotes", "Move-out cleaning", "Weekly cleaning requests", "Office cleaning"] },
  "Moving Company":       { targetCustomer: "People moving locally or long-distance", offer: "Professional moving and packing services", intentSignals: ["Moving quotes", "Local movers needed", "Last-minute move", "Storage needs"] },
  "Wedding Photographer": { targetCustomer: "Engaged couples planning their wedding", offer: "Wedding and engagement photography", intentSignals: ["Photographer availability", "Package pricing", "Portfolio comparisons", "Engagement shoot"] },
};

// Pre-filled keyword suggestions per occupation — the exact phrases buyers post
const KEYWORD_PRESETS: Record<string, string> = {
  "Real Estate Agent":      `"looking to buy a house", "looking for a realtor", "need a realtor", "first time home buyer", "looking for a realtor in", "I'm looking to buy", "we're buying a home", "recommend a realtor"`,
  "Mortgage Broker":        `"looking for mortgage", "need home loan", "first time buyer mortgage", "refinancing my home", "pre-approval"`,
  "Plumber":                `"need a plumber", "pipe burst", "water heater broken", "plumbing emergency", "plumbing help"`,
  "HVAC Technician":        `"AC not working", "air conditioning broken", "heating not working", "need AC repair", "HVAC help"`,
  "Roofer":                 `"need a roofer", "roof leak", "roof damage", "storm damage", "roofing quote"`,
  "Hair Salon / Barber":    `"looking for a stylist", "need a haircut", "hair color near me", "barber recommendation", "new salon"`,
  "Fitness / Personal Training": `"looking for a personal trainer", "want to lose weight", "need a fitness coach", "workout program"`,
  "Dental Office":          `"need a dentist", "tooth pain", "dental emergency", "looking for dentist", "dental work"`,
  "Landscaping / Lawn Care":`"need a landscaper", "lawn care quote", "yard work", "grass cutting service", "landscaping"`,
  "Cleaning Service":       `"need house cleaning", "maid service", "cleaning service quote", "house cleaner", "deep cleaning"`,
  "Moving Company":         `"need movers", "moving company quote", "looking for movers", "moving to", "local movers"`,
  "Car Detailing":          `"need car detailing", "auto detail quote", "car cleaning", "mobile detailing"`,
  "Photography / Video":    `"need a photographer", "wedding photographer", "event photographer", "portrait session"`,
  "Solar Installer":        `"solar panel quote", "going solar", "solar installation", "solar savings"`,
  "Insurance Agent":        `"looking for insurance", "insurance quote", "life insurance", "home insurance quote"`,
};

const DEFAULT_INTENT_SIGNALS = [
  "Searching online", "Requesting quotes", "Comparing providers",
  "Asking for recommendations", "Showing urgency", "Ready to book",
  "Price shopping", "Emergency / urgent need",
];

// ── Status styling ─────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Hot:  { badge: "text-red-400 bg-red-400/10 border-red-400/20",    dot: "bg-red-400",    icon: "🔥" },
  Warm: { badge: "text-orange-400 bg-orange-400/10 border-orange-400/20", dot: "bg-orange-400", icon: "☀️" },
  Cold: { badge: "text-blue-400 bg-blue-400/10 border-blue-400/20", dot: "bg-blue-400",   icon: "❄️" },
};

// ── Platform icon label ────────────────────────────────────────────────────────

function PlatformBadge({ source }: { source: string }) {
  const s = source.toLowerCase();
  const color =
    s.includes("twitter") || s.includes("x.com") ? "text-sky-400/80 border-sky-400/20 bg-sky-400/5" :
    s.includes("instagram") ? "text-pink-400/80 border-pink-400/20 bg-pink-400/5" :
    s.includes("craigslist") ? "text-amber-400/70 border-amber-400/20 bg-amber-400/5" :
    s.includes("linkedin") ? "text-blue-400/70 border-blue-400/20 bg-blue-400/5" :
    s.includes("facebook") ? "text-indigo-400/70 border-indigo-400/20 bg-indigo-400/5" :
    s.includes("nextdoor") ? "text-emerald-400/70 border-emerald-400/20 bg-emerald-400/5" :
    s.includes("google maps") ? "text-green-400/70 border-green-400/20 bg-green-400/5" :
    "text-white/30 border-white/[0.08] bg-white/[0.03]";
  return (
    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${color}`}>
      {source}
    </span>
  );
}

// ── Copy button ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex-shrink-0 flex items-center gap-1 text-[10px] text-white/30 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.15] px-2 py-1 rounded-full transition-all"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/25 w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-[10px] text-white/30 font-mono w-6 text-right">{value}</span>
    </div>
  );
}

// ── Draft outreach panel ───────────────────────────────────────────────────────

interface DraftState {
  loading: boolean;
  email: { subject: string; body: string } | null;
  dm: { platform: string; message: string } | null;
  error: string;
  activeTab: "dm" | "email";
}

function DraftOutreachPanel({
  lead,
  businessType,
  offer,
  market,
}: {
  lead: IndividualLead;
  businessType: string;
  offer: string;
  market: string;
}) {
  const [draft, setDraft] = useState<DraftState>({
    loading: false, email: null, dm: null, error: "", activeTab: "dm",
  });

  const generate = async () => {
    setDraft(d => ({ ...d, loading: true, error: "" }));
    try {
      const res = await fetch("/api/leads/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, businessType, offer, market }),
      });
      const data = await res.json();
      if (data.error) { setDraft(d => ({ ...d, loading: false, error: data.error })); return; }
      setDraft(d => ({ ...d, loading: false, email: data.email, dm: data.dm }));
    } catch {
      setDraft(d => ({ ...d, loading: false, error: "Failed to generate. Try again." }));
    }
  };

  // Auto-generate on first mount
  useEffect(() => { generate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (draft.loading) {
    return (
      <div className="flex items-center justify-center py-6 gap-2 text-white/30 text-xs">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        Writing personalized messages…
      </div>
    );
  }

  if (draft.error) {
    return (
      <div className="flex items-center justify-between py-3 text-xs text-red-400/70">
        <span>{draft.error}</span>
        <button onClick={generate} className="text-white/40 hover:text-white/70 border border-white/[0.08] px-2 py-1 rounded-full text-[10px]">Retry</button>
      </div>
    );
  }

  if (!draft.email && !draft.dm) return null;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {draft.dm && (
          <button onClick={() => setDraft(d => ({ ...d, activeTab: "dm" }))}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${draft.activeTab === "dm" ? "text-blue-300 bg-blue-500/15 border-blue-500/30" : "text-white/30 border-white/[0.06] hover:text-white/60"}`}>
            💬 {draft.dm.platform || "DM"}
          </button>
        )}
        {draft.email && (
          <button onClick={() => setDraft(d => ({ ...d, activeTab: "email" }))}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${draft.activeTab === "email" ? "text-blue-300 bg-blue-500/15 border-blue-500/30" : "text-white/30 border-white/[0.06] hover:text-white/60"}`}>
            ✉️ Email
          </button>
        )}
        <button onClick={generate} title="Regenerate" className="ml-auto text-[10px] text-white/20 hover:text-white/50 border border-white/[0.05] px-2 py-1 rounded-full transition-all">
          <RefreshCw className="w-2.5 h-2.5 inline mr-1" />Regen
        </button>
      </div>

      {/* DM tab */}
      {draft.activeTab === "dm" && draft.dm && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">Send via {draft.dm.platform}</p>
            <CopyButton text={draft.dm.message} />
          </div>
          <p className="text-xs text-white/60 leading-relaxed bg-white/[0.03] border border-white/[0.05] rounded-lg p-3 whitespace-pre-wrap">
            {draft.dm.message}
          </p>
        </div>
      )}

      {/* Email tab */}
      {draft.activeTab === "email" && draft.email && (
        <div>
          <div className="mb-2">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-1">Subject</p>
            <div className="flex items-center gap-2">
              <p className="flex-1 text-xs text-white/70 font-medium">{draft.email.subject}</p>
              <CopyButton text={draft.email.subject} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">Body</p>
              <CopyButton text={`Subject: ${draft.email.subject}\n\n${draft.email.body}`} />
            </div>
            <p className="text-xs text-white/60 leading-relaxed bg-white/[0.03] border border-white/[0.05] rounded-lg p-3 whitespace-pre-wrap">
              {draft.email.body}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Individual person card ─────────────────────────────────────────────────────

function PersonCard({
  lead,
  index,
  businessType,
  offer,
  market,
}: {
  lead: IndividualLead;
  index: number;
  businessType: string;
  offer: string;
  market: string;
}) {
  const [showQuick, setShowQuick] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [imgError, setImgError] = useState(false);
  const tier = STATUS_STYLE[lead.status] ?? STATUS_STYLE.Cold;
  const initials = lead.name.replace(/^u\/|^@/, "").slice(0, 2).toUpperCase();

  // Deterministic generated avatar as fallback
  const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=72&background=1e3a5f&color=60a5fa&bold=true&format=svg`;
  const avatarSrc = lead.avatarUrl && !imgError ? lead.avatarUrl : generatedAvatar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
    >
      <div className="p-4">
        {/* Avatar + name + status */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img
              src={avatarSrc}
              alt={lead.name}
              onError={() => setImgError(true)}
              className="w-11 h-11 rounded-full object-cover border border-white/[0.1]"
            />
            {/* Platform dot */}
            <span className={`absolute -bottom-0.5 -right-0.5 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black/50 ${
              (lead.source.toLowerCase().includes("twitter") || lead.source.toLowerCase().includes("x.com")) ? "bg-sky-500" :
              lead.source.toLowerCase().includes("instagram") ? "bg-pink-600" :
              lead.source.toLowerCase().includes("linkedin") ? "bg-blue-600" :
              lead.source.toLowerCase().includes("facebook") ? "bg-indigo-600" :
              lead.source.toLowerCase().includes("nextdoor") ? "bg-emerald-600" :
              lead.source.toLowerCase().includes("craigslist") ? "bg-amber-600" :
              lead.source.toLowerCase().includes("google maps") ? "bg-green-600" :
              "bg-neutral-700"
            }`}>
              {(lead.source.toLowerCase().includes("twitter") || lead.source.toLowerCase().includes("x.com")) ? "𝕏" :
               lead.source.toLowerCase().includes("instagram") ? "ig" :
               lead.source.toLowerCase().includes("linkedin") ? "in" :
               lead.source.toLowerCase().includes("facebook") ? "f" :
               lead.source.toLowerCase().includes("nextdoor") ? "n" :
               lead.source.toLowerCase().includes("craigslist") ? "cl" : "·"}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-white text-sm font-semibold leading-tight truncate max-w-[150px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {lead.name}
              </p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${tier.badge}`}>
                {tier.icon} {lead.status}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white/30 text-[10px] flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />{lead.location}
              </span>
              <PlatformBadge source={lead.source} />
              {lead.postedAt && (
                <span className="text-white/20 text-[10px] flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />{lead.postedAt}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* What they said */}
        <div className="flex items-start gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg mb-3">
          <MessageSquare className="w-3 h-3 text-blue-400/60 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/55 leading-snug italic">{lead.intentSignal}</p>
        </div>

        {/* ── Reach Them Here ────────────────────────────────────── */}
        <div className="mb-3">
          <p className="text-[9px] text-white/25 uppercase tracking-widest font-semibold mb-2">Reach them here</p>
          <div className="flex flex-wrap gap-1.5">

            {/* Phone */}
            {lead.phone && (
              <a href={`tel:${lead.phone}`}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-emerald-300 bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/20 transition-all">
                <Phone className="w-3 h-3" />{lead.phone}
              </a>
            )}

            {/* Email */}
            {lead.email && (
              <a href={`mailto:${lead.email}`}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-blue-300 bg-blue-500/10 border-blue-500/25 hover:bg-blue-500/20 transition-all">
                <Mail className="w-3 h-3" />{lead.email}
              </a>
            )}

            {/* Twitter/X */}
            {lead.twitter && (
              <a href={lead.twitter.startsWith("http") ? lead.twitter : `https://x.com/${lead.twitter.replace(/^@/, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-sky-300 bg-sky-500/10 border-sky-500/25 hover:bg-sky-500/20 transition-all">
                <span className="font-bold text-[10px]">𝕏</span>
                {lead.twitter.startsWith("http") ? "View Post & Reply" : lead.twitter}
              </a>
            )}

            {/* Instagram DM */}
            {lead.instagram && (
              <a href={`https://ig.me/m/${lead.instagram.replace(/^@/, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-pink-300 bg-pink-500/10 border-pink-500/25 hover:bg-pink-500/20 transition-all">
                <span className="text-[10px]">📸</span>DM on Instagram
              </a>
            )}

            {/* Facebook */}
            {lead.facebook && (
              <a href={lead.facebook.startsWith("http") ? lead.facebook : `https://facebook.com/${lead.facebook}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-indigo-300 bg-indigo-500/10 border-indigo-500/25 hover:bg-indigo-500/20 transition-all">
                <span className="text-[10px]">👥</span>
                {lead.facebook.startsWith("http") ? "View Post & Message" : "Message on Facebook"}
              </a>
            )}

            {/* LinkedIn */}
            {lead.linkedin && (
              <a href={lead.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-blue-300 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15 transition-all">
                <span className="text-[10px]">💼</span>Connect on LinkedIn
              </a>
            )}

            {/* Reddit */}
            {lead.reddit && (
              <a href={lead.reddit} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-orange-300 bg-orange-500/10 border-orange-500/25 hover:bg-orange-500/20 transition-all">
                <span className="text-[10px]">🤝</span>View Post & Reply
              </a>
            )}

            {/* Direct post link — show when profileUrl exists and isn't already covered above */}
            {lead.profileUrl &&
              lead.profileUrl !== lead.twitter &&
              lead.profileUrl !== lead.facebook &&
              lead.profileUrl !== lead.reddit && (
              <a href={lead.profileUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-violet-300 bg-violet-500/10 border-violet-500/25 hover:bg-violet-500/20 transition-all">
                <ExternalLink className="w-3 h-3" />View Post & Reply
              </a>
            )}

            {/* Nothing available — show a hint */}
            {!lead.phone && !lead.email && !lead.twitter && !lead.instagram && !lead.facebook && !lead.linkedin && !lead.reddit && !lead.profileUrl && (
              <span className="text-[10px] text-white/20 italic">Contact info being enriched…</span>
            )}
          </div>
        </div>

        {/* Why they need you */}
        <p className="text-[11px] text-white/35 leading-snug mb-3">{lead.whyTheyNeedYou}</p>

        {/* Scores */}
        <div className="space-y-1.5 mb-3">
          <ScoreBar label="Intent"  value={lead.intentScore}  color={lead.status === "Hot" ? "bg-red-400" : lead.status === "Warm" ? "bg-orange-400" : "bg-blue-400"} />
          <ScoreBar label="Urgency" value={lead.urgencyScore} color="bg-orange-400/70" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => { setShowQuick(!showQuick); setShowDraft(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border transition-all ${showQuick ? "text-blue-300 bg-blue-500/15 border-blue-500/30" : "text-white/40 hover:text-white/70 bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]"}`}
          >
            <Sparkles className="w-3.5 h-3.5" />Message Script
          </button>
          <button
            onClick={() => { setShowDraft(!showDraft); setShowQuick(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border transition-all ${showDraft ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/30" : "text-white/40 hover:text-white/70 bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]"}`}
          >
            <Mail className="w-3.5 h-3.5" />Full Outreach Draft
          </button>
        </div>
      </div>

      {/* Message script panel */}
      <AnimatePresence>
        {showQuick && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">Send via {lead.outreachChannel}</p>
                <CopyButton text={lead.suggestedFirstMessage} />
              </div>
              <p className="text-xs text-white/60 leading-relaxed bg-white/[0.03] border border-white/[0.05] rounded-lg p-3">{lead.suggestedFirstMessage}</p>

              {/* Quick-open platform links */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {lead.twitter && (
                  <a href={lead.twitter.startsWith("http") ? lead.twitter : `https://x.com/${lead.twitter.replace(/^@/, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border text-sky-300 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/15 transition-all">
                    <span className="font-bold">𝕏</span>Open on X →
                  </a>
                )}
                {lead.instagram && (
                  <a href={`https://ig.me/m/${lead.instagram.replace(/^@/, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border text-pink-300 bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/15 transition-all">
                    📸 Open on Instagram →
                  </a>
                )}
                {lead.facebook && (
                  <a href={lead.facebook.startsWith("http") ? lead.facebook : `https://facebook.com/${lead.facebook}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border text-indigo-300 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/15 transition-all">
                    👥 Open on Facebook →
                  </a>
                )}
                {lead.profileUrl && !lead.twitter && !lead.facebook && (
                  <a href={lead.profileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border text-violet-300 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15 transition-all">
                    <ExternalLink className="w-2.5 h-2.5" />Open Post →
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}?subject=Quick question&body=${encodeURIComponent(lead.suggestedFirstMessage)}`}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border text-blue-300 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15 transition-all">
                    <Mail className="w-2.5 h-2.5" />Open Email →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full draft outreach panel */}
      <AnimatePresence>
        {showDraft && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/[0.05] pt-3">
              <DraftOutreachPanel lead={lead} businessType={businessType} offer={offer} market={market} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Occupation autocomplete ────────────────────────────────────────────────────

function OccupationInput({ value, onChange, onSelect }: { value: string; onChange: (v: string) => void; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const matches = OCCUPATIONS.filter(o => !value || o.toLowerCase().includes(value.toLowerCase())).slice(0, 7);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none z-10" />
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="e.g. Real Estate Agent, Roofer, AI Agency"
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-white text-[16px] md:text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 transition-colors"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      />
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
      <AnimatePresence>
        {open && matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 top-full mt-1 left-0 right-0 bg-neutral-950 border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl"
          >
            {matches.map(occ => (
              <button
                key={occ}
                onMouseDown={() => { onSelect(occ); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {occ}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Intent signal chips ────────────────────────────────────────────────────────

function SignalPicker({ selected, occupationSignals, onChange }: { selected: string[]; occupationSignals: string[]; onChange: (v: string[]) => void }) {
  const all = Array.from(new Set([...occupationSignals, ...DEFAULT_INTENT_SIGNALS]));
  const toggle = (s: string) => onChange(selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s]);
  return (
    <div className="flex flex-wrap gap-2">
      {all.map(sig => {
        const on = selected.includes(sig);
        return (
          <button key={sig} type="button" onClick={() => toggle(sig)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${on ? "text-blue-300 bg-blue-500/15 border-blue-500/30" : "text-white/30 bg-white/[0.03] border-white/[0.06] hover:text-white/60 hover:border-white/[0.12]"}`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {on && <Check className="inline w-2.5 h-2.5 mr-1" />}{sig}
          </button>
        );
      })}
    </div>
  );
}

// ── Lead type toggle ───────────────────────────────────────────────────────────

function LeadTypeToggle({ value, onChange }: { value: "B2C" | "B2B" | "Both"; onChange: (v: "B2C" | "B2B" | "Both") => void }) {
  const opts: { v: "B2C" | "B2B" | "Both"; label: string; Icon: typeof User }[] = [
    { v: "B2C", label: "Consumers",  Icon: User },
    { v: "B2B", label: "Businesses", Icon: Building },
    { v: "Both", label: "Both",      Icon: Users },
  ];
  return (
    <div className="flex rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
      {opts.map(({ v, label, Icon }) => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${value === v ? "bg-blue-600/25 text-blue-300" : "text-white/30 hover:text-white/60"}`}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <Icon className="w-3.5 h-3.5" />{label}
        </button>
      ))}
    </div>
  );
}

// ── Loading messages (per agent) ──────────────────────────────────────────────

const LOADING_MSGS = [
  "Scanning Twitter/X for buyers posting right now...",
  "Searching Nextdoor for local service requests...",
  "Checking Craigslist and Facebook public posts...",
  "Finding direct post links and contact info...",
  "Scoring leads by intent and urgency...",
  "Preparing personalized outreach messages...",
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function LeadGeneratorSection({
  onLeadsFound,
  compact,
}: {
  onLeadsFound?: () => void;
  compact?: boolean;
}) {
  const store = useLeadStore();

  const [businessType, setBusinessType] = useState(store.lastSearch?.businessType ?? "");
  const [targetCustomer, setTargetCustomer] = useState(store.lastSearch?.targetCustomer ?? "");
  const [offer, setOffer]                   = useState(store.lastSearch?.offer ?? "");
  const [market, setMarket]                 = useState(store.lastSearch?.market ?? "");
  const [intentSignals, setIntentSignals]   = useState<string[]>(store.lastSearch?.intentSignals ?? []);
  const [leadType, setLeadType]             = useState<"B2C" | "B2B" | "Both">(store.lastSearch?.leadType ?? "B2C");
  const [keywords, setKeywords]             = useState(store.lastSearch?.keywords ?? "");
  const [occupationSignals, setOccupationSignals] = useState<string[]>([]);

  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!store.loading) return;
    const id = setInterval(() => setLoadingStep(s => (s + 1) % LOADING_MSGS.length), 2200);
    return () => clearInterval(id);
  }, [store.loading]);

  useEffect(() => { leadStore.clearNewLeadCount(); }, []);

  const applyPreset = (occ: string) => {
    const p = OCCUPATION_PRESETS[occ];
    if (!p) return;
    if (!targetCustomer) setTargetCustomer(p.targetCustomer);
    if (!offer) setOffer(p.offer);
    setIntentSignals(p.intentSignals);
    setOccupationSignals(p.intentSignals);
    if (!keywords && KEYWORD_PRESETS[occ]) setKeywords(KEYWORD_PRESETS[occ]);
  };

  const handleOccSelect = (occ: string) => { setBusinessType(occ); applyPreset(occ); };

  const canSearch = businessType.trim() && market.trim();

  const search = useCallback(() => {
    if (!canSearch || store.loading) return;
    setLoadingStep(0);
    const q: LeadQuery = {
      businessType,
      targetCustomer: targetCustomer || `Clients who need ${businessType} services`,
      offer: offer || `Professional ${businessType} services`,
      market,
      intentSignals: intentSignals.length ? intentSignals : ["Searching online", "Requesting quotes"],
      leadType,
      keywords,
    };
    leadStore.search(q, onLeadsFound);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSearch, store.loading, businessType, targetCustomer, offer, market, intentSignals, leadType, keywords, onLeadsFound]);

  const leads   = store.leads;
  const loading = store.loading;
  const error   = store.error;
  const ran     = store.lastRun !== null || leads.length > 0;
  const hotCount  = leads.filter(l => l.status === "Hot").length;
  const warmCount = leads.filter(l => l.status === "Warm").length;

  return (
    <section id="lead-generator" className={`relative overflow-hidden ${compact ? "py-4 px-4" : "py-16 md:py-24 px-4 sm:px-6"}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #1d4ed820 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-5xl mx-auto relative z-10">

        {!compact && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3" />Live Lead Discovery
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Find{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">real people</span>{" "}
              ready to hire you
            </h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Our AI searches Twitter/X, Nextdoor, Craigslist, Facebook, Instagram, and LinkedIn for real buyers posting right now — with direct post links and contact info.
            </p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 md:p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5">Your business type</label>
              <OccupationInput value={businessType} onChange={setBusinessType} onSelect={handleOccSelect} />
            </div>
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5">Target market / location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input type="text" value={market} onChange={e => setMarket(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
                  placeholder="e.g. El Paso TX, Dallas, Greater Phoenix"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-[16px] md:text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 transition-colors"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5">Who is your ideal client?</label>
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input type="text" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)}
                placeholder="e.g. Home buyers and sellers, Local homeowners, Restaurant owners"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-[16px] md:text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1 pl-1">Describe real people you want to find — not other businesses in your field.</p>
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5">What do you sell or help with?</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input type="text" value={offer} onChange={e => setOffer(e.target.value)}
                placeholder="e.g. Help buying &amp; selling homes, AI chatbots + lead gen, Roof repair and replacement"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-[16px] md:text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5">
              Keywords <span className="normal-case text-white/15 font-normal">— What does buying include?</span>
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder='e.g. "looking to buy", "budget $500k", "need ASAP", "first-time buyer"'
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-[16px] md:text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1 pl-1">Words or phrases your ideal buyers would say or search — helps the AI find real posts faster.</p>
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">What does buying intent look like?</label>
            <SignalPicker selected={intentSignals} occupationSignals={occupationSignals} onChange={setIntentSignals} />
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Lead type</label>
            <LeadTypeToggle value={leadType} onChange={setLeadType} />
          </div>

          {store.lastRun && !loading && (
            <div className="flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/70 text-[11px]">
                Updated {store.lastRun.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · auto-refreshing every 10 min
              </span>
            </div>
          )}

          {/* Action row: main search button + refresh icon */}
          <div className="flex gap-2">
            <button onClick={search} disabled={loading || !canSearch}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white font-semibold px-6 py-3.5 rounded-xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
              {loading ? "Searching in background…" : "Find Real People"}
            </button>

            {/* Manual refresh — re-runs last search immediately */}
            {store.lastSearch && (
              <button
                onClick={() => store.lastSearch && leadStore.search(store.lastSearch, onLeadsFound)}
                disabled={loading}
                title="Refresh now"
                className="flex items-center justify-center w-13 h-13 px-4 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 border border-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all text-white/50 hover:text-white/80"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 gap-5">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/40" />
                <div className="absolute inset-[6px] rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.p key={loadingStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                    className="text-white/50 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {LOADING_MSGS[loadingStep]}
                  </motion.p>
                </AnimatePresence>
                <p className="text-white/20 text-xs mt-1">
                  {store.lastSearch ? `Looking for ${store.lastSearch.targetCustomer} in ${store.lastSearch.market}…` : "Scanning…"}
                </p>
                <p className="text-blue-400/40 text-[11px] mt-2">You can navigate away — search continues in the background</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {leads.length > 0 && !loading && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {leads.length} people found in <span className="text-blue-400">{store.lastSearch?.market ?? market}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {hotCount > 0 && <span className="text-red-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />{hotCount} Hot</span>}
                    {warmCount > 0 && <span className="text-orange-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />{warmCount} Warm</span>}
                    {store.lastRun && (
                      <span className="text-white/20 text-[10px] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        auto-refreshing every 10 min
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Refresh same search */}
                  <button
                    onClick={() => store.lastSearch && leadStore.search(store.lastSearch, onLeadsFound)}
                    disabled={loading}
                    title="Refresh leads now"
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] px-3 py-1.5 rounded-full transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                  {/* New search = scroll up to form (no-op button resets nothing, form is always visible) */}
                  <button
                    onClick={() => { const el = document.getElementById("lead-generator"); el?.scrollIntoView({ behavior: "smooth" }); }}
                    className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] px-3 py-1.5 rounded-full transition-all"
                  >
                    Run Search
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leads.map((lead, i) => (
                  <PersonCard
                    key={lead.id ?? i}
                    lead={lead}
                    index={i}
                    businessType={businessType}
                    offer={offer}
                    market={market}
                  />
                ))}
              </div>

              {!compact && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-violet-600/10 border border-blue-500/20"
                >
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Want unlimited lead searches + auto outreach?</p>
                    <p className="text-white/40 text-xs mt-0.5">Members get 24/7 lead discovery, saved contacts, and automated outreach sequences.</p>
                  </div>
                  <a href="#pricing" className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Get Full Access<ChevronRight className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pre-search empty state */}
        {!ran && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400/60" />
            </div>
            <div>
              <p className="text-white/40 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Enter your details to find people ready to hire you</p>
              <p className="text-white/20 text-xs max-w-sm mx-auto">The AI scans Reddit, Facebook groups, Nextdoor, and LinkedIn for individuals actively asking for your service in your area</p>
            </div>
          </div>
        )}

        {/* Post-search empty (ran but 0 leads returned — shows error from API or retry prompt) */}
        {ran && !loading && !error && leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white/20" />
            </div>
            <div>
              <p className="text-white/40 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>No leads returned for this search</p>
              <p className="text-white/20 text-xs max-w-sm mx-auto">Try adjusting your business type, market, or target customer — then click Find Real People again</p>
            </div>
            <button
              onClick={search}
              disabled={!canSearch}
              className="flex items-center gap-2 text-xs text-blue-400/70 hover:text-blue-400 border border-blue-500/20 hover:border-blue-500/40 px-4 py-2 rounded-full transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />Retry Search
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

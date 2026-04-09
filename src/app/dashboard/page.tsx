"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import { ContentIdeaModal } from "@/components/ui/content-idea-modal";
import LeadGeneratorSection from "@/components/lead-generator-section";
import { ExplorePage } from "@/components/explore-page";
import { leadStore, useLeadStore } from "@/lib/lead-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Sparkles,
  BarChart3,
  Target,
  Lightbulb,
  Share2,
  ArrowUpRight,
  Zap,
  UserPlus,
  Play,
  X,
  Clock,
  Flame,
  RefreshCw,
  Activity,
  User,
  Building2,
  CreditCard,
  Shield,
  Check,
  Pencil,
  MapPin,
  Phone,
  Mail,
  Globe,
  Crown,
  AlertCircle,
  Compass,
  VolumeX,
  ExternalLink,
  Search,
  Camera,
  Loader2,
  Link2,
  Link2Off,
} from "lucide-react";

type ActiveView = "dashboard" | "ai" | "leads" | "explore" | "settings";

interface Notification {
  id: string;
  type: "lead" | "content";
  text: string;
  time: Date;
  read: boolean;
}

interface TrendingVideo {
  title: string;
  link: string;
  snippet: string;
  imageUrl: string;
  duration: string;
  channel: string;
  date: string;
}

interface ScannedIdea {
  emoji: string;
  label: string;
  sub: string;
  why: string;
  platform: string;
  urgency: string;
  hook: string;
}

interface ProfileState {
  name: string;
  businessName: string;
  industry: string;
  niche: string;
  location: string;
  initials: string;
  email: string;
  phone: string;
  website: string;
  bio: string;
  socialAccounts: { instagram: string; tiktok: string; youtube: string };
}

const DEFAULT_PROFILE: ProfileState = {
  name: "Mr. Wallace",
  businessName: "Wallace Real Estate Group",
  industry: "Real Estate",
  niche: "Residential Real Estate Agent",
  location: "El Paso, TX",
  initials: "W",
  email: "wallace@wallacerealestate.com",
  phone: "+1 (915) 555-0182",
  website: "wallacerealestate.com",
  bio: "Helping El Paso families find their perfect home since 2018.",
  socialAccounts: { instagram: "", tiktok: "", youtube: "" },
};

// Business type presets — each sets industry + niche + bio template
const BUSINESS_PRESETS = [
  { label: "Real Estate Agent",         industry: "Real Estate",          niche: "Residential Real Estate Agent",      emoji: "🏡" },
  { label: "Restaurant / Food Business",industry: "Food & Restaurant",     niche: "Local Restaurant Owner",             emoji: "🍜" },
  { label: "Car Detailing",             industry: "Automotive",            niche: "Mobile Car Detailing Service",       emoji: "🚗" },
  { label: "Welding / Fabrication",     industry: "Welding & Fabrication", niche: "Custom Metal Fabrication Shop",      emoji: "⚙️" },
  { label: "Hair Salon / Barber",       industry: "Beauty & Hair",         niche: "Hair Salon & Styling",               emoji: "✂️" },
  { label: "Fitness / Personal Training",industry: "Health & Fitness",      niche: "Personal Trainer & Fitness Coach",   emoji: "💪" },
  { label: "E-commerce / Retail",       industry: "E-commerce",            niche: "Online Retail Store",                emoji: "🛍️" },
  { label: "Photography / Video",       industry: "Photography & Media",   niche: "Photography & Videography Services", emoji: "📸" },
  { label: "Landscaping / Lawn Care",   industry: "Landscaping",           niche: "Residential Lawn & Landscaping",     emoji: "🌿" },
  { label: "Plumbing / HVAC",           industry: "Home Services",         niche: "Plumbing & HVAC Services",           emoji: "🔧" },
];

function businessConfirmMessage(industry: string, niche: string): string {
  const biz = niche || industry || "your business";
  return `Confirmed — I'm now trained on ${biz}. I'll produce content ideas, trending post formats, and video concepts specific to ${biz}. I'll also analyze your market, track what competitors in your niche are posting, and surface targeted leads — all built around ${biz}.`;
}

const SOCIAL_PLATFORMS = [
  { key: "instagram", name: "Instagram", color: "text-pink-400",  bg: "bg-pink-500/[0.1]",   border: "border-pink-500/30",  Icon: Camera, placeholder: "@your_handle"  },
  { key: "tiktok",    name: "TikTok",    color: "text-white",     bg: "bg-white/[0.07]",     border: "border-white/[0.18]", Icon: Flame,  placeholder: "@your_handle"  },
  { key: "youtube",   name: "YouTube",   color: "text-red-400",   bg: "bg-red-500/[0.1]",    border: "border-red-500/30",   Icon: Play,   placeholder: "@channel_name" },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 22) return "Good evening";
  return "Working late";
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const stats = [
  { label: "Social Reach",  value: "12.4K", delta: "+18% this month",    icon: BarChart3, color: "blue"    },
  { label: "AI Sessions",   value: "47",    delta: "sessions this month", icon: Sparkles,  color: "violet"  },
  { label: "Active Leads",  value: "23",    delta: "+5 this week",        icon: Target,    color: "emerald" },
];

const marketingTips = [
  {
    emoji: "🎥",
    title: "Post a video walkthrough today",
    body: "Listings with short-form video tours get 3× more inquiries than static photos. Even a phone video stands out.",
    tag: "High Impact",
    tagStyle: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    emoji: "📱",
    title: "Text your cold leads",
    body: "SMS has a 98% open rate vs 20% for email. Reach back out to any lead inactive for 30+ days.",
    tag: "Quick Win",
    tagStyle: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    emoji: "📍",
    title: "Refresh your Google Business Profile",
    body: "Add 3 fresh listing photos this week — it directly lifts your local search ranking.",
    tag: "SEO",
    tagStyle: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  },
];

// Social ideas are now AI-generated dynamically via useSocialScan hook

const iconStyle: Record<string, string> = {
  blue:    "bg-blue-500/10   border-blue-500/15   text-blue-400",
  violet:  "bg-violet-500/10 border-violet-500/15 text-violet-400",
  emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400",
};
const glowStyle: Record<string, string> = {
  blue:    "from-blue-500/8",
  violet:  "from-violet-500/8",
  emerald: "from-emerald-500/8",
};

// ── Social scan hook ──────────────────────────────────────────────────────────
function useSocialScan(profile: ProfileState) {
  const [ideas, setIdeas] = useState<ScannedIdea[]>([]);
  const [marketStatus, setMarketStatus] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<Date | null>(null);

  const scan = useCallback(async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/social-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: profile.businessName,
          industry: profile.industry,
          niche: profile.niche,
          location: profile.location,
        }),
      });
      const data = await res.json();
      if (data.ideas?.length) setIdeas(data.ideas);
      if (data.marketStatus) setMarketStatus(data.marketStatus);
      setLastScanned(new Date());
    } catch {
      // silently fail — keeps previous data
    } finally {
      setScanning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.businessName, profile.industry, profile.niche, profile.location]);

  useEffect(() => {
    setIdeas([]); // clear stale ideas when profile changes
    setMarketStatus("");
    scan();
    const interval = setInterval(scan, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [scan]);

  return { ideas, marketStatus, scanning, lastScanned, rescan: scan };
}

// ── Social Content Ideas component ────────────────────────────────────────────
function SocialContentIdeas({ profile }: { profile: ProfileState }) {
  const { ideas, marketStatus, scanning, lastScanned, rescan } = useSocialScan(profile);
  const [selectedIdea, setSelectedIdea] = useState<ScannedIdea | null>(null);

  const marketColor = marketStatus.toLowerCase().includes("growing")
    ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/[0.06]"
    : marketStatus.toLowerCase().includes("slowing")
    ? "text-red-400 border-red-400/20 bg-red-400/[0.06]"
    : "text-yellow-400 border-yellow-400/20 bg-yellow-400/[0.06]";

  const fallbackIdeas: ScannedIdea[] = [
    { emoji: "🎬", label: "Day in the Life",  sub: "Show a real day in your business behind the scenes", why: "", platform: "TikTok",    urgency: "📈 High Impact",    hook: "You won't believe what my day looks like..." },
    { emoji: "📊", label: "Market Update",    sub: "Share what's happening in your local market right now", why: "", platform: "Instagram", urgency: "⚡ Quick Win",     hook: "Here's the market truth nobody's talking about..." },
    { emoji: "🏆", label: "Client Win",       sub: "Spotlight a customer success story",  why: "", platform: "All",       urgency: "🎯 Audience Builder",hook: "This client's result surprised even me..." },
    { emoji: "💡", label: "Myth Buster",      sub: "Debunk a common misconception in your niche", why: "", platform: "YouTube",  urgency: "🔥 Trending Now",   hook: "Stop believing this myth about..." },
  ];

  const displayIdeas = ideas.length > 0 ? ideas : fallbackIdeas;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="bg-white/[0.04] border border-white/[0.07] rounded-xl md:rounded-2xl p-4 md:p-5"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl bg-pink-400/10 border border-pink-400/15 flex items-center justify-center flex-shrink-0">
            <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-pink-400" />
          </div>
          <h2 className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>Social Content Ideas</h2>
          <div className="ml-auto flex items-center gap-2">
            {lastScanned && (
              <span className="text-[10px] text-white/15 hidden sm:block" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Scanned {timeAgo(lastScanned)}
              </span>
            )}
            <button
              onClick={rescan}
              disabled={scanning}
              className="p-1 text-white/20 hover:text-pink-400 transition-colors rounded-lg hover:bg-white/[0.04]"
              title="Refresh scan"
            >
              <RefreshCw className={`w-3 h-3 ${scanning ? "animate-spin text-pink-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Market status banner */}
        {marketStatus && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs mb-3 ${marketColor}`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <Activity className="w-3 h-3 flex-shrink-0" />
            <span className="leading-snug">{marketStatus}</span>
          </motion.div>
        )}

        {/* AI scan note */}
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="w-3 h-3 text-blue-400/60" />
          <p className="text-white/20 text-[10px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {scanning
              ? `Scanning ${profile.businessName}'s social presence...`
              : `AI-scanned for ${profile.businessName} · Tap any idea for your full guide`}
          </p>
        </div>

        {/* Ideas grid */}
        <div className="grid grid-cols-2 gap-2">
          {(scanning && ideas.length === 0 ? Array(4).fill(null) : displayIdeas).map((idea, i) => (
            idea === null ? (
              // Skeleton
              <div key={i} className="flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse">
                <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex-shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-2.5 bg-white/[0.06] rounded-full w-3/4" />
                  <div className="h-2 bg-white/[0.04] rounded-full w-full" />
                </div>
              </div>
            ) : (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.36 + i * 0.05 }}
                onClick={() => setSelectedIdea(idea as ScannedIdea)}
                className="flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/[0.04] hover:border-pink-400/25 hover:bg-white/[0.05] rounded-xl cursor-pointer group transition-all text-left"
              >
                <span className="text-lg flex-shrink-0">{(idea as ScannedIdea).emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <p className="text-white/80 text-xs font-semibold group-hover:text-pink-300 transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {(idea as ScannedIdea).label}
                    </p>
                    {(idea as ScannedIdea).platform && (
                      <span className="text-[8px] text-white/20 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded-full leading-none flex-shrink-0">
                        {(idea as ScannedIdea).platform}
                      </span>
                    )}
                  </div>
                  <p className="text-white/25 text-[10px] leading-snug line-clamp-2">{(idea as ScannedIdea).sub}</p>
                  {(idea as ScannedIdea).urgency && (
                    <p className="text-[9px] text-pink-400/60 mt-1">{(idea as ScannedIdea).urgency}</p>
                  )}
                </div>
                <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-pink-400/60 flex-shrink-0 mt-0.5 transition-colors" />
              </motion.button>
            )
          ))}
        </div>
      </motion.div>

      {/* Detail modal */}
      <ContentIdeaModal
        idea={selectedIdea}
        businessName={profile.businessName}
        industry={profile.industry}
        niche={profile.niche}
        onClose={() => setSelectedIdea(null)}
      />
    </>
  );
}

// ── Sidebar logo ───────────────────────────────────────────────────────────────
function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="16" stroke="url(#sRing)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
      <circle cx="18" cy="18" r="5"  fill="url(#sCore)" />
      <circle cx="28" cy="8"  r="2.5" fill="#3b82f6" opacity="0.9" />
      <circle cx="8"  cy="28" r="2.5" fill="#6366f1" opacity="0.9" />
      <circle cx="7"  cy="10" r="1.8" fill="#60a5fa" opacity="0.6" />
      <circle cx="29" cy="27" r="1.8" fill="#818cf8" opacity="0.6" />
      <line x1="18" y1="13" x2="26.5" y2="9.5"  stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <line x1="18" y1="23" x2="9.5"  y2="26.5" stroke="#6366f1" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
      <defs>
        <linearGradient id="sRing" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <radialGradient id="sCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Notification panel ─────────────────────────────────────────────────────────
function NotificationPanel({
  notifications,
  onClose,
  onMarkAllRead,
  onDismiss,
}: {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full right-0 mt-2 w-[360px] bg-neutral-950/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-white/60" />
          <span className="text-white text-sm font-semibold">Notifications</span>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-medium">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-white/30 hover:text-blue-400 transition-colors"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-white/20">
            <Bell className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 px-4 py-3.5 group hover:bg-white/[0.03] transition-colors ${!n.read ? "bg-blue-500/[0.04]" : ""}`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  n.type === "lead"
                    ? "bg-emerald-500/15 border border-emerald-500/20"
                    : "bg-pink-500/15 border border-pink-500/20"
                }`}>
                  {n.type === "lead"
                    ? <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                    : <Lightbulb className="w-3.5 h-3.5 text-pink-400" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                      n.type === "lead"
                        ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                        : "text-pink-400 bg-pink-400/10 border-pink-400/20"
                    }`}>
                      {n.type === "lead" ? "New Lead" : "Content Idea"}
                    </span>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">{n.text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-2.5 h-2.5 text-white/20" />
                    <p className="text-white/20 text-[10px]">{timeAgo(n.time)}</p>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="text-white/0 group-hover:text-white/25 hover:!text-white/60 transition-colors flex-shrink-0 mt-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.01]">
        <p className="text-[10px] text-white/15 text-center">
          AI generates leads & content alerts every 5–12 hours
        </p>
      </div>
    </motion.div>
  );
}

// ── YouTube ID helper ─────────────────────────────────────────────────────────
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const shorts = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shorts) return shorts[1];
    }
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
  } catch { /* noop */ }
  return null;
}

// ── TrendingVideoModal ────────────────────────────────────────────────────────
function TrendingVideoModal({ video, onClose }: { video: TrendingVideo; onClose: () => void }) {
  const ytId = extractYouTubeId(video.link);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-50"
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.96 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="
          fixed z-50 bg-neutral-950 border border-white/[0.09] overflow-hidden shadow-2xl
          bottom-0 left-0 right-0 rounded-t-[28px]
          md:bottom-auto md:left-1/2 md:top-1/2
          md:-translate-x-1/2 md:-translate-y-1/2
          md:w-[480px] md:rounded-3xl
        "
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Video */}
        {ytId ? (
          <div className="w-full aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&color=white`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-neutral-900">
            {video.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/20 rounded-2xl px-5 py-3 transition-all"
              >
                <Play className="w-4 h-4 text-white fill-white" />
                <span className="text-white text-sm font-semibold">Watch video</span>
              </a>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex-shrink-0" />
            <span className="text-white/50 text-xs">{video.channel}</span>
            {video.date && <span className="text-white/25 text-xs">· {video.date}</span>}
          </div>
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.04] hover:border-white/[0.14] transition-all text-xs font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {ytId ? "Open in YouTube" : "Watch video"}
          </a>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/60 backdrop-blur border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </>
  );
}

// ── TrendingVideoCard ─────────────────────────────────────────────────────────
function TrendingVideoCard({
  video,
  index,
  onOpen,
}: {
  video: TrendingVideo;
  index: number;
  onOpen: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const cardRef  = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ytId     = extractYouTubeId(video.link);

  useEffect(() => {
    if (!ytId) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.65) {
          timerRef.current = setTimeout(() => setPlaying(true), 400);
        } else {
          if (timerRef.current) clearTimeout(timerRef.current);
          setPlaying(false);
        }
      },
      { threshold: [0.0, 0.65] }
    );
    const el = cardRef.current;
    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ytId]);

  return (
    <motion.div
      ref={cardRef}
      onClick={onOpen}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.44 + index * 0.04 }}
      className="flex-shrink-0 w-52 group cursor-pointer"
    >
      <div className="relative rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-white/[0.18] transition-all duration-300 bg-neutral-900"
        style={{ boxShadow: playing ? "0 0 0 1px rgba(239,68,68,0.2), 0 4px 20px rgba(239,68,68,0.08)" : undefined }}
      >
        {/* Media */}
        <div className="relative h-28 overflow-hidden bg-neutral-900">
          {ytId && playing ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&rel=0&showinfo=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                allow="autoplay; encrypted-media"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              {/* Muted badge — clickable to open modal with sound */}
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => { e.stopPropagation(); onOpen(); }}
                className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/75 backdrop-blur text-white/80 text-[9px] font-semibold px-1.5 py-1 rounded-full border border-white/15 hover:bg-black hover:text-white transition-all z-10"
              >
                <VolumeX className="w-2.5 h-2.5" />
                Tap to unmute
              </motion.button>
            </>
          ) : (
            <>
              {video.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <Play className="w-8 h-8 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/25">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
              </div>
              {video.duration && (
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  {video.duration}
                </div>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-white/85 text-[11px] font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {video.title}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex-shrink-0" />
            <p className="text-white/30 text-[10px] truncate">{video.channel}</p>
            {video.date && (
              <>
                <span className="text-white/15 text-[10px]">·</span>
                <p className="text-white/20 text-[10px] flex-shrink-0">{video.date}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Trending videos section ────────────────────────────────────────────────────
function TrendingVideos({ industry }: { industry: string }) {
  const [videos, setVideos]         = useState<TrendingVideo[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeVideo, setActiveVideo] = useState<TrendingVideo | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry }),
      });
      const data = await res.json();
      if (data.videos?.length) setVideos(data.videos);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [industry]);

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5.5 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchVideos]);

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {activeVideo && (
          <TrendingVideoModal
            key={activeVideo.link}
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="bg-white/[0.04] border border-white/[0.07] rounded-xl md:rounded-2xl p-4 md:p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0">
            <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-400" />
          </div>
          <h2 className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Trending in {industry}
          </h2>
          <span className="ml-auto text-[10px] text-white/20 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Refreshes every 5–6h
          </span>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-52 rounded-xl bg-white/[0.03] border border-white/[0.05] overflow-hidden animate-pulse">
                <div className="h-28 bg-white/[0.04]" />
                <div className="p-3 space-y-2">
                  <div className="h-2.5 bg-white/[0.06] rounded-full w-3/4" />
                  <div className="h-2 bg-white/[0.04] rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-6 text-white/20 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Add SERPER_API_KEY to enable trending videos
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {videos.map((v, i) => (
              <TrendingVideoCard
                key={i}
                video={v}
                index={i}
                onOpen={() => setActiveVideo(v)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}

// ── Settings page ─────────────────────────────────────────────────────────────
function SettingsPage({
  profile,
  onSave,
}: {
  profile: ProfileState;
  onSave: (updated: ProfileState) => void;
}) {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [businessSearch, setBusinessSearch] = useState("");
  const [bizConfirm, setBizConfirm] = useState<string>(() =>
    profile.industry ? businessConfirmMessage(profile.industry, profile.niche) : ""
  );
  const [connectedAccounts, setConnectedAccounts] = useState({
    instagram: !!profile.socialAccounts?.instagram,
    tiktok:    !!profile.socialAccounts?.tiktok,
    youtube:   !!profile.socialAccounts?.youtube,
  });
  const [socialReviews, setSocialReviews]     = useState<Record<string, string>>({});
  const [reviewLoading, setReviewLoading]     = useState<Record<string, boolean>>({});

  // Local editable form — seeded from live profile
  const [form, setForm] = useState({
    firstName: profile.name.split(" ")[0] ?? "",
    lastName: profile.name.split(" ").slice(1).join(" ") ?? "",
    email: profile.email,
    phone: profile.phone,
    businessName: profile.businessName,
    industry: profile.industry,
    niche: profile.niche,
    location: profile.location,
    website: profile.website,
    bio: profile.bio,
    instagramHandle: profile.socialAccounts?.instagram ?? "",
    tiktokHandle:    profile.socialAccounts?.tiktok    ?? "",
    youtubeHandle:   profile.socialAccounts?.youtube   ?? "",
  });

  // Filtered presets for the search box — excludes legacy "Custom / Other"
  const filteredPresets = BUSINESS_PRESETS
    .filter(p => p.label !== "Custom / Other")
    .filter(p =>
      !businessSearch.trim() ||
      p.label.toLowerCase().includes(businessSearch.toLowerCase()) ||
      p.industry.toLowerCase().includes(businessSearch.toLowerCase())
    );

  const fetchSocialReview = async (platform: string, handle: string) => {
    setReviewLoading(prev => ({ ...prev, [platform]: true }));
    try {
      const res = await fetch("/api/social-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          handle,
          industry: form.industry,
          niche: form.niche,
          businessName: form.businessName,
        }),
      });
      const data = await res.json();
      setSocialReviews(prev => ({ ...prev, [platform]: data.review ?? "" }));
    } catch {
      setSocialReviews(prev => ({ ...prev, [platform]: "Unable to generate analysis. Please try again." }));
    }
    setReviewLoading(prev => ({ ...prev, [platform]: false }));
  };

  const handleChange = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const applyPreset = (presetLabel: string) => {
    const preset = BUSINESS_PRESETS.find((p) => p.label === presetLabel);
    if (!preset) return;
    setSelectedPreset(presetLabel);
    if (preset.industry) handleChange("industry", preset.industry);
    if (preset.niche)    handleChange("niche",    preset.niche);
    setBizConfirm(businessConfirmMessage(preset.industry || presetLabel, preset.niche || presetLabel));
  };

  const handleSave = () => {
    const updated: ProfileState = {
      ...profile,
      name:         `${form.firstName} ${form.lastName}`.trim(),
      email:        form.email,
      phone:        form.phone,
      businessName: form.businessName,
      industry:     form.industry,
      niche:        form.niche,
      location:     form.location,
      website:      form.website,
      bio:          form.bio,
      initials:     (form.firstName[0] ?? "?").toUpperCase(),
      socialAccounts: {
        instagram: form.instagramHandle,
        tiktok:    form.tiktokHandle,
        youtube:   form.youtubeHandle,
      },
    };
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { id: "profile",  icon: User,       label: "Profile"         },
    { id: "business", icon: Building2,  label: "Business"        },
    { id: "billing",  icon: CreditCard, label: "Billing & Plans" },
    { id: "security", icon: Shield,     label: "Security"        },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      color: "border-white/[0.08]",
      badge: null,
      features: ["1 AI Assistant", "100 AI sessions/mo", "Basic market reports", "Email support"],
    },
    {
      name: "Pro",
      price: "$79",
      period: "/mo",
      color: "border-blue-500/40",
      badge: "Current Plan",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      features: ["Unlimited AI sessions", "Real-time social scan", "Trending video feed", "Lead notifications", "Priority support"],
      current: true,
    },
    {
      name: "Agency",
      price: "$199",
      period: "/mo",
      color: "border-violet-500/30",
      badge: "Best Value",
      badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      features: ["Everything in Pro", "Up to 10 team members", "White-label dashboard", "Custom AI training", "Dedicated manager"],
    },
  ];

  const F = "var(--font-space-grotesk)";

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 md:px-6 py-5 max-w-[900px] mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: F }}>Settings</h1>
          <p className="text-white/30 text-sm mt-1" style={{ fontFamily: F }}>Manage your account, business, and subscription.</p>
        </motion.div>

        <div className="flex gap-5">

          {/* Section nav */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="hidden md:flex flex-col gap-0.5 w-44 flex-shrink-0"
          >
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left border ${
                    active
                      ? "bg-blue-600/15 text-blue-400 border-blue-500/20"
                      : "text-white/35 hover:text-white/70 hover:bg-white/[0.04] border-transparent"
                  }`}
                  style={{ fontFamily: F }}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </motion.div>

          {/* Mobile section tabs */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-1 mb-4 w-full" style={{ scrollbarWidth: "none" }}>
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex-shrink-0 ${
                    active ? "bg-blue-600/15 text-blue-400 border-blue-500/20" : "text-white/35 border-white/[0.06]"
                  }`}
                  style={{ fontFamily: F }}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="flex-1 min-w-0 space-y-4"
          >

            {/* ── PROFILE ── */}
            {activeSection === "profile" && (
              <>
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-5">
                    <User className="w-4 h-4 text-blue-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Personal Info</h2>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/[0.06]">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      W
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Profile Photo</p>
                      <p className="text-white/30 text-xs mb-2">JPG, PNG or GIF. Max 2MB.</p>
                      <button className="text-xs text-blue-400 border border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                        <Pencil className="w-3 h-3" /> Change photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "First Name",    field: "firstName", icon: User  },
                      { label: "Last Name",     field: "lastName",  icon: User  },
                      { label: "Email Address", field: "email",     icon: Mail,  full: true },
                      { label: "Phone Number",  field: "phone",     icon: Phone },
                    ].map(({ label, field, icon: Icon, full }) => (
                      <div key={field} className={full ? "col-span-2" : ""}>
                        <label className="block text-[11px] text-white/30 font-medium mb-1.5 uppercase tracking-wide" style={{ fontFamily: F }}>{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                          <input
                            type="text"
                            value={form[field as keyof typeof form]}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
                            style={{ fontFamily: F }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                    style={{ fontFamily: F }}
                  >
                    {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                  </button>
                </div>
              </>
            )}

            {/* ── BUSINESS ── */}
            {activeSection === "business" && (
              <>
                {/* Business type preset picker */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>What type of business are you?</h2>
                  </div>
                  <p className="text-white/30 text-xs mb-4 leading-relaxed" style={{ fontFamily: F }}>
                    Select your business type and the AI will instantly retrain itself — updating your dashboard, social scans, marketing tips, and Nova&apos;s answers to match your industry.
                  </p>
                  {/* Search / filter */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                    <input
                      type="text"
                      value={businessSearch}
                      onChange={(e) => setBusinessSearch(e.target.value)}
                      placeholder="Search or type your occupation..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-white/20"
                      style={{ fontFamily: F }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* Custom occupation tile — stays visible once set */}
                    {selectedPreset === "__custom__" && form.industry && (
                      <div
                        className="col-span-2 sm:col-span-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-emerald-500/[0.12] border-emerald-500/40 text-emerald-300"
                        style={{ fontFamily: F }}
                      >
                        <span className="text-base flex-shrink-0">✏️</span>
                        <span className="text-xs font-semibold leading-tight truncate">{form.industry}</span>
                        <Check className="w-3 h-3 ml-auto flex-shrink-0 flex-shrink-0" />
                      </div>
                    )}

                    {filteredPresets.map((preset) => {
                      const isSelected = selectedPreset === preset.label ||
                        (!selectedPreset && preset.industry === form.industry && preset.niche === form.niche);
                      return (
                        <button
                          key={preset.label}
                          onClick={() => applyPreset(preset.label)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                              : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:border-white/[0.15] hover:text-white/80 hover:bg-white/[0.05]"
                          }`}
                          style={{ fontFamily: F }}
                        >
                          <span className="text-base flex-shrink-0">{preset.emoji}</span>
                          <span className="text-xs font-medium leading-tight">{preset.label}</span>
                          {isSelected && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                        </button>
                      );
                    })}

                    {/* Add custom occupation when search doesn't match any preset */}
                    {businessSearch.trim() && !filteredPresets.some(
                      p => p.label.toLowerCase() === businessSearch.toLowerCase()
                    ) && (
                      <button
                        onClick={() => {
                          const term = businessSearch.trim();
                          handleChange("industry", term);
                          handleChange("niche", term);
                          setSelectedPreset("__custom__");
                          setBusinessSearch("");
                          setBizConfirm(businessConfirmMessage(term, term));
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-blue-500/40 text-blue-300/70 hover:border-blue-500/70 hover:text-blue-300 hover:bg-blue-500/[0.08] text-left transition-all col-span-2 sm:col-span-1"
                        style={{ fontFamily: F }}
                      >
                        <span className="text-base flex-shrink-0">✏️</span>
                        <span className="text-xs font-medium leading-tight">Use &quot;{businessSearch}&quot;</span>
                      </button>
                    )}
                  </div>

                  {/* Nova AI confirmation bubble — updates on every business type change */}
                  <AnimatePresence mode="wait">
                    {bizConfirm && (
                      <motion.div
                        key={bizConfirm}
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 flex items-start gap-3 p-4 bg-blue-500/[0.07] border border-blue-500/20 rounded-xl"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-400 text-[10px] font-bold mb-1.5 uppercase tracking-wide" style={{ fontFamily: F }}>Nova AI</p>
                          <p className="text-white/65 text-xs leading-relaxed" style={{ fontFamily: F }}>{bizConfirm}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Building2 className="w-4 h-4 text-violet-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Business Details</h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Business Name",     field: "businessName", icon: Building2 },
                      { label: "Industry",          field: "industry",     icon: TrendingUp },
                      { label: "Niche / Specialty", field: "niche",        icon: Target },
                      { label: "Location",          field: "location",     icon: MapPin },
                      { label: "Website",           field: "website",      icon: Globe },
                    ].map(({ label, field, icon: Icon }) => (
                      <div key={field}>
                        <label className="block text-[11px] text-white/30 font-medium mb-1.5 uppercase tracking-wide" style={{ fontFamily: F }}>{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                          <input
                            type="text"
                            value={form[field as keyof typeof form]}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                            style={{ fontFamily: F }}
                          />
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block text-[11px] text-white/30 font-medium mb-1.5 uppercase tracking-wide" style={{ fontFamily: F }}>Bio / Description</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        rows={3}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all resize-none"
                        style={{ fontFamily: F }}
                      />
                    </div>
                  </div>

                  {/* AI context note */}
                  <div className="flex items-start gap-2.5 mt-4 p-3 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-300/70 text-[11px] leading-relaxed" style={{ fontFamily: F }}>
                      This info is used by Nova AI, social scans, and market reports to personalize everything to your business.
                    </p>
                  </div>
                </div>

                {/* ── CONNECTED SOCIAL ACCOUNTS ── */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Connected Social Accounts</h2>
                  </div>
                  <p className="text-white/30 text-xs mb-5 leading-relaxed" style={{ fontFamily: F }}>
                    Add your handles and Nova AI will analyze each platform — giving you a personalized content strategy, what to post, and what&apos;s working in your niche right now.
                  </p>

                  <div className="space-y-3">
                    {SOCIAL_PLATFORMS.map(({ key, name, color, bg, border, Icon, placeholder }) => {
                      const handleKey = `${key}Handle` as "instagramHandle" | "tiktokHandle" | "youtubeHandle";
                      const isConnected = connectedAccounts[key as keyof typeof connectedAccounts];
                      const hasReview   = !!socialReviews[key];
                      const isLoading   = !!reviewLoading[key];
                      const handleVal   = form[handleKey];

                      return (
                        <div
                          key={key}
                          className={`rounded-2xl border transition-all overflow-hidden ${isConnected ? border : "border-white/[0.07]"}`}
                          style={isConnected ? { boxShadow: `0 0 20px rgba(${key === "instagram" ? "236,72,153" : key === "tiktok" ? "255,255,255" : "239,68,68"},0.06)` } : {}}
                        >
                          {/* Platform header row */}
                          <div className="flex items-center gap-3 px-4 py-3.5">
                            <div className={`w-8 h-8 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <span className={`text-sm font-bold ${isConnected ? color : "text-white/50"}`} style={{ fontFamily: F }}>{name}</span>
                            {isConnected && (
                              <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/[0.1] border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium" style={{ fontFamily: F }}>
                                <Link2 className="w-2.5 h-2.5" /> Connected
                              </span>
                            )}
                          </div>

                          {/* Handle input + connect/disconnect */}
                          <div className="px-4 pb-4 space-y-2.5">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={handleVal}
                                onChange={(e) => handleChange(handleKey, e.target.value)}
                                placeholder={placeholder}
                                disabled={isConnected}
                                className={`flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none transition-all ${
                                  isConnected
                                    ? "text-white/35 cursor-not-allowed"
                                    : "text-white focus:border-blue-500/40 focus:bg-white/[0.06]"
                                }`}
                                style={{ fontFamily: F }}
                              />
                              <button
                                onClick={() => {
                                  if (isConnected) {
                                    setConnectedAccounts(prev => ({ ...prev, [key]: false }));
                                    setSocialReviews(prev => { const n = { ...prev }; delete n[key]; return n; });
                                  } else if (handleVal.trim()) {
                                    setConnectedAccounts(prev => ({ ...prev, [key]: true }));
                                  }
                                }}
                                disabled={!isConnected && !handleVal.trim()}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed ${
                                  isConnected
                                    ? "border border-white/[0.1] text-white/30 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/[0.06]"
                                    : "bg-blue-600 hover:bg-blue-500 text-white"
                                }`}
                                style={{ fontFamily: F }}
                              >
                                {isConnected
                                  ? <><Link2Off className="w-3 h-3" /> Disconnect</>
                                  : <><Link2 className="w-3 h-3" /> Connect</>
                                }
                              </button>
                            </div>

                            {/* AI Analyze button — only shown when connected */}
                            {isConnected && (
                              <button
                                onClick={() => fetchSocialReview(key, handleVal)}
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                  hasReview
                                    ? "border-white/[0.07] text-white/30 hover:text-white/60 hover:border-white/[0.14]"
                                    : `${bg} ${border} ${color} hover:opacity-80`
                                }`}
                                style={{ fontFamily: F }}
                              >
                                {isLoading ? (
                                  <><Loader2 className="w-3.5 h-3.5 animate-spin" />Analyzing {name}...</>
                                ) : hasReview ? (
                                  <><RefreshCw className="w-3.5 h-3.5" />Refresh AI Analysis</>
                                ) : (
                                  <><Sparkles className="w-3.5 h-3.5" />Get AI Content Strategy</>
                                )}
                              </button>
                            )}

                            {/* AI review panel */}
                            {hasReview && !isLoading && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl ${bg} border ${border}`}
                              >
                                <div className="flex items-center gap-1.5 mb-2.5">
                                  <Sparkles className={`w-3 h-3 ${color}`} />
                                  <span className={`text-[10px] font-bold uppercase tracking-wide ${color}`} style={{ fontFamily: F }}>
                                    Nova AI · {name} Strategy
                                  </span>
                                </div>
                                <p className="text-white/65 text-xs leading-relaxed whitespace-pre-line" style={{ fontFamily: F }}>
                                  {socialReviews[key]}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                    style={{ fontFamily: F }}
                  >
                    {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                  </button>
                </div>
              </>
            )}

            {/* ── BILLING ── */}
            {activeSection === "billing" && (
              <div className="space-y-4">

                {/* Current plan summary */}
                <div className="bg-blue-500/[0.07] border border-blue-500/25 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold text-sm" style={{ fontFamily: F }}>Pro Plan</span>
                    </div>
                    <span className="text-blue-400 text-xs border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 rounded-full" style={{ fontFamily: F }}>Active</span>
                  </div>
                  <p className="text-white/35 text-xs mb-3" style={{ fontFamily: F }}>Next billing date: May 8, 2026</p>
                  <div className="flex items-end gap-1">
                    <span className="text-white text-3xl font-bold" style={{ fontFamily: F }}>$79</span>
                    <span className="text-white/30 text-sm mb-1">/month</span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Payment Method</h2>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold tracking-widest">VISA</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium" style={{ fontFamily: F }}>Visa ending in 4242</p>
                        <p className="text-white/25 text-[10px]">Expires 08/27</p>
                      </div>
                    </div>
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ fontFamily: F }}>
                      Update
                    </button>
                  </div>
                  <button className="mt-3 w-full py-2.5 border border-dashed border-white/[0.1] hover:border-white/[0.2] rounded-xl text-white/30 hover:text-white/60 text-xs transition-all flex items-center justify-center gap-2" style={{ fontFamily: F }}>
                    <CreditCard className="w-3.5 h-3.5" /> Add payment method
                  </button>
                </div>

                {/* Plans */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Plans</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {plans.map((plan) => (
                      <div
                        key={plan.name}
                        className={`relative p-4 rounded-2xl border transition-all ${plan.color} ${plan.current ? "bg-blue-500/[0.05]" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}
                      >
                        {plan.badge && (
                          <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${plan.badgeColor}`} style={{ fontFamily: F }}>
                            {plan.badge}
                          </span>
                        )}
                        <p className="text-white font-bold text-sm mb-1 mt-1" style={{ fontFamily: F }}>{plan.name}</p>
                        <div className="flex items-end gap-0.5 mb-3">
                          <span className="text-white text-2xl font-bold" style={{ fontFamily: F }}>{plan.price}</span>
                          <span className="text-white/30 text-xs mb-1">{plan.period}</span>
                        </div>
                        <ul className="space-y-1.5 mb-4">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-white/50 text-[11px]" style={{ fontFamily: F }}>
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                            plan.current
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/20 cursor-default"
                              : "bg-white/[0.06] hover:bg-white/[0.1] text-white/70 border border-white/[0.08]"
                          }`}
                          style={{ fontFamily: F }}
                          disabled={plan.current}
                        >
                          {plan.current ? "Current Plan" : `Switch to ${plan.name}`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing history */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <h2 className="text-white text-sm font-semibold mb-4" style={{ fontFamily: F }}>Billing History</h2>
                  <div className="space-y-2">
                    {[
                      { date: "Apr 8, 2026",  amount: "$79.00", status: "Paid" },
                      { date: "Mar 8, 2026",  amount: "$79.00", status: "Paid" },
                      { date: "Feb 8, 2026",  amount: "$79.00", status: "Paid" },
                    ].map((inv, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                        <div>
                          <p className="text-white/70 text-xs font-medium" style={{ fontFamily: F }}>{inv.date}</p>
                          <p className="text-white/25 text-[10px]">Pro Plan · Monthly</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 text-xs font-medium" style={{ fontFamily: F }}>{inv.status}</span>
                          <span className="text-white/60 text-xs font-semibold" style={{ fontFamily: F }}>{inv.amount}</span>
                          <button className="text-[10px] text-white/20 hover:text-blue-400 transition-colors" style={{ fontFamily: F }}>PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeSection === "security" && (
              <div className="space-y-4">
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Password</h2>
                  </div>
                  <div className="space-y-3">
                    {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                      <div key={label}>
                        <label className="block text-[11px] text-white/30 font-medium mb-1.5 uppercase tracking-wide" style={{ fontFamily: F }}>{label}</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                          style={{ fontFamily: F }}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 px-5 py-2.5 bg-emerald-600/80 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors" style={{ fontFamily: F }}>
                    Update Password
                  </button>
                </div>

                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <h2 className="text-white text-sm font-semibold" style={{ fontFamily: F }}>Two-Factor Authentication</h2>
                    </div>
                    <span className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full">Off</span>
                  </div>
                  <p className="text-white/30 text-xs leading-relaxed mb-4" style={{ fontFamily: F }}>
                    Add an extra layer of security to your account. We&apos;ll ask for a code whenever you sign in from a new device.
                  </p>
                  <button className="px-5 py-2.5 bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors" style={{ fontFamily: F }}>
                    Enable 2FA
                  </button>
                </div>

                <div className="bg-red-500/[0.05] border border-red-500/20 rounded-2xl p-5">
                  <h2 className="text-red-400 text-sm font-semibold mb-2" style={{ fontFamily: F }}>Danger Zone</h2>
                  <p className="text-white/30 text-xs mb-4 leading-relaxed" style={{ fontFamily: F }}>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="px-5 py-2.5 border border-red-500/30 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium rounded-xl transition-colors" style={{ fontFamily: F }}>
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard content view ─────────────────────────────────────────────────────
function DashboardContent({ profile, onGoToLeads }: { profile: ProfileState; onGoToLeads: () => void }) {
  const leadState = useLeadStore();

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 md:px-6 py-4 md:py-5 space-y-3 md:space-y-5 max-w-[1400px] mx-auto">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-white/35 text-xs md:text-sm mb-0.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {getGreeting()},
            </p>
            <h1 className="text-white text-xl md:text-[2rem] font-bold leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {profile.name}
              </span>{" "}
              👋
            </h1>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium hidden sm:inline" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {profile.industry}
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="grid grid-cols-3 gap-2 md:gap-4"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden bg-white/[0.04] border border-white/[0.07] rounded-xl md:rounded-2xl p-3 md:p-5 group hover:border-white/[0.13] transition-all duration-300 cursor-default"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${glowStyle[s.color]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <p className="text-white/40 text-[9px] md:text-[11px] font-medium tracking-widest uppercase hidden md:block" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {s.label}
                    </p>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border flex items-center justify-center ${iconStyle[s.color]}`}>
                      <Icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </div>
                  </div>
                  <p className="text-white text-lg md:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {s.value}
                  </p>
                  <p className="text-white/35 text-[9px] leading-tight mt-0.5 md:hidden">{s.label}</p>
                  <div className="hidden md:flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    <p className="text-emerald-400 text-xs">{s.delta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Recent Leads widget */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-white/[0.04] border border-white/[0.07] rounded-xl md:rounded-2xl p-4 md:p-5"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl bg-emerald-400/10 border border-emerald-400/15 flex items-center justify-center flex-shrink-0">
              <Target className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" />
            </div>
            <h2 className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>Recent Leads</h2>
            {leadState.leads.length > 0 && (
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full">
                {leadState.leads.length} found
              </span>
            )}
            {leadState.loading && (
              <span className="flex items-center gap-1 text-[10px] text-blue-400/70 ml-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                Searching…
              </span>
            )}
            <button
              onClick={onGoToLeads}
              className="ml-auto text-[10px] text-white/30 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.15] px-2.5 py-1 rounded-full transition-all"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {leadState.leads.length > 0 ? "View All" : "Run Search"}
            </button>
          </div>

          {leadState.leads.length > 0 ? (
            <div className="space-y-2">
              {leadState.leads.slice(0, 3).map((lead, i) => (
                <div
                  key={i}
                  onClick={onGoToLeads}
                  className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-white/[0.09] transition-colors cursor-pointer"
                >
                  <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    lead.status === "Hot" ? "bg-red-400" : lead.status === "Warm" ? "bg-orange-400" : "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-xs font-semibold truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {lead.name}
                    </p>
                    <p className="text-white/30 text-[11px] truncate">{lead.intentSignal}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                    lead.status === "Hot" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                    lead.status === "Warm" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                    "text-blue-400 bg-blue-400/10 border-blue-400/20"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
              {leadState.lastRun && (
                <p className="text-white/20 text-[10px] pt-1 text-center">
                  Last updated {leadState.lastRun.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · auto-refreshes every 10 min
                </p>
              )}
            </div>
          ) : leadState.loading ? (
            <div className="flex items-center justify-center py-6 gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border border-blue-500/40" />
                <div className="absolute inset-[4px] rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-3 h-3 text-blue-400" />
                </div>
              </div>
              <p className="text-white/40 text-sm">AI researching leads in the background…</p>
            </div>
          ) : (
            <div className="flex items-center gap-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-white/20" />
              </div>
              <div>
                <p className="text-white/40 text-xs font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>No leads searched yet</p>
                <p className="text-white/20 text-[11px]">Run a search and results appear here automatically</p>
              </div>
              <button
                onClick={onGoToLeads}
                className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Go <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-3 md:gap-4">

          <div className="space-y-3 md:space-y-4">

            {/* Marketing Tips */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl md:rounded-2xl p-4 md:p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl bg-yellow-400/10 border border-yellow-400/15 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-400" />
                </div>
                <h2 className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>Marketing Tips</h2>
                <span className="ml-auto text-[10px] text-white/20 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full whitespace-nowrap" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {profile.industry}
                </span>
              </div>
              <div className="space-y-2">
                {marketingTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-white/[0.09] transition-colors cursor-pointer group">
                    <span className="text-base flex-shrink-0 mt-0.5">{tip.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white/90 text-xs font-semibold truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>{tip.title}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 border ${tip.tagStyle}`}>{tip.tag}</span>
                      </div>
                      <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{tip.body}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white/40 flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Content Ideas — AI-scanned, dynamic */}
            <SocialContentIdeas profile={profile} />
          </div>

          {/* Right — AI Chat */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 }}
            style={{ maxHeight: "calc(100vh - 230px)" }}
            className="hidden lg:flex flex-col"
          >
            <div className="flex flex-col bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl overflow-hidden h-full">
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.06] bg-white/[0.02] flex-shrink-0">
                <div className="relative flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>Nova</p>
                  <p className="text-white/25 text-[10px] mt-0.5">AI Assistant · Online</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/15 px-2 py-1 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse inline-block" />
                  Live
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <AnimatedAIChat assistantName="Nova" profile={profile} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trending Videos */}
        <TrendingVideos industry={profile.industry} key={profile.industry} />

      </div>
    </div>
  );
}

const PROFILE_KEY = "nuvaxis_profile";

// ── Page root ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const leadState = useLeadStore();

  // Load persisted profile and leads on mount
  useEffect(() => {
    // 1. Seed immediately from localStorage (fast)
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as ProfileState;
          setProfile(saved);
        }
      }
    } catch { /* non-critical */ }

    // 2. Fetch from Supabase (authoritative, per-user)
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          // Map from DB column names to ProfileState shape
          const loaded: ProfileState = {
            name: p.name || DEFAULT_PROFILE.name,
            businessName: p.business_name || DEFAULT_PROFILE.businessName,
            industry: p.industry || DEFAULT_PROFILE.industry,
            niche: p.niche || DEFAULT_PROFILE.niche,
            location: p.location || DEFAULT_PROFILE.location,
            initials: (p.name || DEFAULT_PROFILE.name)[0]?.toUpperCase() ?? "U",
            email: p.email || DEFAULT_PROFILE.email,
            phone: p.phone || DEFAULT_PROFILE.phone,
            website: p.website || DEFAULT_PROFILE.website,
            bio: p.bio || DEFAULT_PROFILE.bio,
            socialAccounts: {
              instagram: p.social_instagram || "",
              tiktok: p.social_tiktok || "",
              youtube: p.social_youtube || "",
            },
          };
          // Only override if user has actually set data (non-empty name means customized)
          if (p.name || p.business_name) {
            setProfile(loaded);
            try {
              localStorage.setItem(PROFILE_KEY, JSON.stringify(loaded));
            } catch { /* non-critical */ }
          }
        }
      })
      .catch(() => { /* non-critical — localStorage fallback is active */ });

    leadStore.loadFromStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  const handleProfileSave = useCallback((updated: ProfileState) => {
    setProfile(updated);
    // Persist to localStorage (fast cache)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      }
    } catch { /* non-critical */ }
    // Persist to Supabase (durable, per-user)
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => { /* non-critical */ });
    // Clear notifications so they regenerate for the new industry
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Clear new-lead badge when user opens the Leads tab
  useEffect(() => {
    if (activeView === "leads") {
      leadStore.clearNewLeadCount();
    }
  }, [activeView]);

  const generateNotification = useCallback(async (type: "lead" | "content") => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: profile.industry, type }),
      });
      const data = await res.json();
      if (data.text) {
        const newNotif: Notification = {
          id: `${Date.now()}-${Math.random()}`,
          type,
          text: data.text,
          time: new Date(),
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
      }
    } catch {
      // silently fail
    }
  }, []);

  // Generate initial notifications on mount
  useEffect(() => {
    const init = async () => {
      await generateNotification("lead");
      await generateNotification("content");
      await generateNotification("lead");
    };
    init();
  }, [generateNotification]);

  // Auto-generate new lead every 5–12 hours (randomized)
  useEffect(() => {
    const scheduleNextLead = () => {
      const ms = (5 + Math.random() * 7) * 60 * 60 * 1000;
      return setTimeout(async () => {
        await generateNotification("lead");
        scheduleNextLead();
      }, ms);
    };
    const t = scheduleNextLead();
    return () => clearTimeout(t);
  }, [generateNotification]);

  // Auto-generate content idea every 5–12 hours (offset from leads)
  useEffect(() => {
    const scheduleNextContent = () => {
      const ms = (5 + Math.random() * 7) * 60 * 60 * 1000;
      return setTimeout(async () => {
        await generateNotification("content");
        scheduleNextContent();
      }, ms);
    };
    // Offset by 2.5h so they don't stack
    const init = setTimeout(() => {
      const t = scheduleNextContent();
      return () => clearTimeout(t);
    }, 2.5 * 60 * 60 * 1000);
    return () => clearTimeout(init);
  }, [generateNotification]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismissNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard",      view: "dashboard" as ActiveView, badge: null  },
    { icon: Sparkles,        label: "AI Assistant",   view: "ai" as ActiveView,        badge: null  },
    { icon: Target,          label: "Lead Generator", view: "leads" as ActiveView,     badge: null  },
    { icon: Compass,         label: "Explore",        view: "explore" as ActiveView,   badge: "New" },
    { icon: Settings,        label: "Settings",       view: "settings" as ActiveView,  badge: null  },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-black overflow-hidden">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="hidden md:flex w-60 flex-shrink-0 bg-neutral-950 border-r border-white/[0.06] flex-col z-20"
      >
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <SidebarLogo />
            <span className="text-white font-semibold text-base" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Nuvaxis <span className="text-blue-500">AI</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.view === activeView;
            return (
              <button
                key={item.label}
                onClick={() => item.view && setActiveView(item.view)}
                disabled={!item.view}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border-blue-500/20"
                    : item.view
                    ? "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border-transparent"
                    : "text-white/20 cursor-default border-transparent"
                }`}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.view === "leads" && leadState.newLeadCount > 0 && activeView !== "leads" ? (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {leadState.newLeadCount > 9 ? "9+" : leadState.newLeadCount}
                  </span>
                ) : item.badge === "New" ? (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                ) : item.badge ? (
                  <span className="text-[10px] bg-white/[0.05] text-white/20 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && <ChevronRight size={13} className="text-blue-400" />}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition border border-white/[0.04] group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {profile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>{profile.name}</p>
              <p className="text-white/25 text-[11px] truncate">{profile.industry} · Pro</p>
            </div>
            <LogOut size={13} className="text-white/15 group-hover:text-white/50 transition-colors flex-shrink-0" />
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-80">
          <CosmicParallaxBg head="" text=" , , " loop={true} />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/10 to-black/55 pointer-events-none" />

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/[0.06] bg-black/25 backdrop-blur-sm flex-shrink-0"
        >
          <div>
            <h1 className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {activeView === "dashboard" ? "Dashboard" : activeView === "ai" ? "AI Assistant" : activeView === "leads" ? "Lead Generator" : activeView === "explore" ? "Explore" : "Settings"}
            </h1>
            <p className="text-white/25 text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {activeView === "dashboard" ? `${profile.industry} · ${profile.name}` : activeView === "ai" ? "Nova · Powered by Claude" : activeView === "leads" ? "AI-powered prospect finder" : activeView === "explore" ? `Trending · ${profile.niche || profile.industry}` : "Account & Subscription"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Bell with notification panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications((p) => !p);
                  if (!showNotifications) markAllRead();
                }}
                className="relative p-2 text-white/25 hover:text-white/70 transition-colors rounded-xl hover:bg-white/[0.04]"
              >
                <Bell size={16} />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <NotificationPanel
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onMarkAllRead={markAllRead}
                    onDismiss={dismissNotification}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="text-xs text-white/25 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Pro Plan
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="p-2 text-white/25 hover:text-red-400 transition-colors rounded-xl hover:bg-white/[0.04]"
            >
              <LogOut size={16} />
            </button>
          </div>
        </motion.div>

        {/* Content — pb-nav-safe on mobile reserves space above the bottom nav */}
        <div className="flex-1 relative z-10 overflow-hidden pb-nav-safe md:pb-0">
          <AnimatePresence mode="wait">
            {activeView === "dashboard" ? (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="h-full">
                <DashboardContent profile={profile} onGoToLeads={() => setActiveView("leads")} />
              </motion.div>
            ) : activeView === "ai" ? (
              <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="h-full">
                <AnimatedAIChat assistantName="Nova" profile={profile} />
              </motion.div>
            ) : activeView === "leads" ? (
              <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="h-full overflow-y-auto">
                <LeadGeneratorSection onLeadsFound={() => generateNotification("lead")} />
              </motion.div>
            ) : activeView === "explore" ? (
              <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="h-full">
                <ExplorePage profile={profile} />
              </motion.div>
            ) : (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="h-full">
                <SettingsPage profile={profile} onSave={handleProfileSave} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/95 backdrop-blur-xl border-t border-white/[0.06] flex items-stretch pb-safe">
        {[
          { icon: LayoutDashboard, label: "Home",    view: "dashboard" as ActiveView },
          { icon: Sparkles,        label: "AI Chat", view: "ai" as ActiveView },
          { icon: Compass,         label: "Explore", view: "explore" as ActiveView },
          { icon: Target,          label: "Leads",   view: "leads" as ActiveView },
          { icon: Settings,        label: "Settings",view: "settings" as ActiveView },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => setActiveView(item.view)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                isActive ? "text-blue-400" : "text-white/30"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-b-full" />
              )}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {item.view === "leads" && leadState.newLeadCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {leadState.newLeadCount > 9 ? "9+" : leadState.newLeadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

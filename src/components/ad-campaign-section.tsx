"use client";

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  RON — Lead Ad Architect · Campaign Builder UI             ║
 * ║  QA checked by: Nova (Backend Developer & QA Tester)        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Film, LayoutGrid, DollarSign,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Upload, AlertTriangle, CheckCircle2, XCircle,
  Copy, Check, Loader2, Megaphone, Zap,
  ExternalLink, RefreshCw, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdCopy {
  type: string;
  hook: string;
  headline: string;
  primaryText: string;
  cta: string;
  complianceStatus: "Green" | "Yellow" | "Red";
  complianceNote: string;
}

interface Campaign {
  strategicIntent: string;
  trendAlignment: string;
  adStyle: string;
  creativeAudit: {
    strengths: string[];
    weaknesses: string[];
    threeSec: string;
    pacing: string;
    safeZones: string;
  };
  adCopies: AdCopy[];
  technicalSetup: {
    objective: string;
    audienceInterests: string[];
    placements: string[];
    adFormat: string;
    bidStrategy: string;
  };
  complianceScore: "Green" | "Yellow" | "Red";
  complianceFlags: string[];
  audienceAlignment: {
    score: "Strong" | "Weak" | "Mismatch";
    issue: string;
    recommendation: string;
  };
  budget: {
    dailyBudgetMin: number;
    dailyBudgetMax: number;
    estimatedCPCMin: number;
    estimatedCPCMax: number;
    targetCPA: number;
    weeklyConversionGoal: number;
    learningPhaseNote: string;
  };
}

interface DiscoveryData {
  niche: string;
  offer: string;
  targetAudience: string;
  platform: string;
}

interface AdCampaignSectionProps {
  profile?: {
    businessName?: string;
    industry?: string;
    niche?: string;
    location?: string;
    botName?: string;
  };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "Meta",     label: "Meta Ads",     sub: "Facebook + Instagram", color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/25",   emoji: "📘" },
  { id: "TikTok",   label: "TikTok Ads",   sub: "Short-form video",     color: "text-white",      bg: "bg-white/[0.07]",  border: "border-white/20",      emoji: "🎵" },
  { id: "YouTube",  label: "YouTube Ads",  sub: "Pre-roll & bumper",    color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/25",    emoji: "▶️" },
  { id: "Google",   label: "Google Ads",   sub: "Search & display",     color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/25", emoji: "🔍" },
  { id: "LinkedIn", label: "LinkedIn Ads", sub: "B2B prospecting",      color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/25",    emoji: "💼" },
];

const STEPS = [
  { id: 1, icon: Search,      label: "Discovery",    sub: "Niche · Offer · Audience · Platform" },
  { id: 2, icon: Film,        label: "Creative",     sub: "Video asset & analysis" },
  { id: 3, icon: LayoutGrid,  label: "Architecture", sub: "Copy · Compliance · Strategy" },
  { id: 4, icon: DollarSign,  label: "Financials",   sub: "Budget · CPA · Deployment" },
];

const STYLE_COLORS: Record<string, string> = {
  "UGC Raw":           "text-pink-400 bg-pink-500/10 border-pink-500/20",
  "Problem-Solution":  "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "The Breakdown":     "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Social Proof Loop": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const COMPLIANCE_COLOR: Record<string, string> = {
  Green:  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Red:    "text-red-400 bg-red-500/10 border-red-500/20",
};

const PLATFORM_URLS: Record<string, string> = {
  Meta:     "https://business.facebook.com/adsmanager",
  TikTok:   "https://ads.tiktok.com",
  YouTube:  "https://ads.google.com",
  Google:   "https://ads.google.com",
  LinkedIn: "https://business.linkedin.com/marketing-solutions",
};

// ── Helper ────────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── Suggestion chip ───────────────────────────────────────────────────────────

function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all text-left"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      <span className="text-blue-400/60 text-[10px]">+</span> {text}
    </button>
  );
}

interface DiscoverySuggestions {
  offerSuggestions: string[];
  audienceSuggestions: string[];
  platformRecommendation: { platform: string; reason: string };
  hookIdeas: string[];
}

// ── Step 1: Discovery ─────────────────────────────────────────────────────────

function DiscoveryStep({
  data, onChange, onNext, profile,
}: {
  data: DiscoveryData;
  onChange: (d: DiscoveryData) => void;
  onNext: () => void;
  profile?: AdCampaignSectionProps["profile"];
}) {
  const canProceed = data.niche.trim() && data.offer.trim() && data.targetAudience.trim() && data.platform;
  const [suggestions, setSuggestions] = useState<DiscoverySuggestions | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (data.niche.trim().length < 4) { setSuggestions(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoadingSuggestions(true);
      fetch("/api/ads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: data.niche, businessName: profile?.businessName, location: profile?.location }),
      })
        .then((r) => r.json())
        .then((res) => { if (res.suggestions) setSuggestions(res.suggestions); })
        .catch(() => {})
        .finally(() => setLoadingSuggestions(false));
    }, 700);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.niche]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">

        {/* Niche */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-white text-xs font-medium uppercase tracking-wider">Business / Niche</label>
            {loadingSuggestions && (
              <span className="flex items-center gap-1.5 text-[11px] text-blue-400/60">
                <Loader2 className="w-3 h-3 animate-spin" /> Getting suggestions...
              </span>
            )}
          </div>
          <input
            value={data.niche}
            onChange={(e) => onChange({ ...data, niche: e.target.value })}
            placeholder={profile?.niche || "e.g. Residential Real Estate Agent"}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          />
        </div>

        {/* Offer */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-white text-xs font-medium uppercase tracking-wider">Your Offer</label>
          <input
            value={data.offer}
            onChange={(e) => onChange({ ...data, offer: e.target.value })}
            placeholder="e.g. Free home valuation in 48 hours"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          />
          {suggestions?.offerSuggestions?.length ? (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {suggestions.offerSuggestions.map((s) => (
                <SuggestionChip key={s} text={s} onClick={() => onChange({ ...data, offer: s })} />
              ))}
            </div>
          ) : null}
        </div>

        {/* Target Audience */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-white text-xs font-medium uppercase tracking-wider">Target Audience</label>
          <input
            value={data.targetAudience}
            onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
            placeholder="e.g. First-time homebuyers aged 25–40 in El Paso, TX"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          />
          {suggestions?.audienceSuggestions?.length ? (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {suggestions.audienceSuggestions.map((s) => (
                <SuggestionChip key={s} text={s} onClick={() => onChange({ ...data, targetAudience: s })} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-xs font-medium uppercase tracking-wider">Ad Platform</label>
          {suggestions?.platformRecommendation && (
            <span className="text-[11px] text-blue-400 hidden sm:block">
              Recommended: <span className="font-medium">{suggestions.platformRecommendation.platform}</span>
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PLATFORMS.map((p) => {
            const isRecommended = suggestions?.platformRecommendation?.platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChange({ ...data, platform: p.id })}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all",
                  data.platform === p.id
                    ? `${p.bg} ${p.border} ${p.color}`
                    : "bg-white/[0.03] border-white/[0.07] text-white/60 hover:bg-white/[0.06] hover:text-white"
                )}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {isRecommended && (
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">★</span>
                )}
                <span className="text-lg">{p.emoji}</span>
                <span>{p.label}</span>
                <span className="text-[10px] opacity-70">{p.sub}</span>
              </button>
            );
          })}
        </div>
        {suggestions?.platformRecommendation && (
          <p className="text-white/70 text-[11px] leading-relaxed">
            <span className="text-white font-medium">★ Why {suggestions.platformRecommendation.platform}:</span>{" "}
            {suggestions.platformRecommendation.reason}
          </p>
        )}
      </div>

      {/* Hook ideas */}
      {suggestions?.hookIdeas?.length ? (
        <div className="space-y-2">
          <label className="text-white text-xs font-medium uppercase tracking-wider">Hook Ideas (for your video)</label>
          <div className="flex flex-wrap gap-2">
            {suggestions.hookIdeas.map((h) => (
              <span key={h} className="px-3 py-1.5 text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full">
                &ldquo;{h}&rdquo;
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
            canProceed
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-white/[0.05] text-white/20 cursor-not-allowed"
          )}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 2: Creative Gate ─────────────────────────────────────────────────────

const VIDEO_TONES = ["Professional", "Casual / Friendly", "Energetic / Hype", "Educational", "Emotional / Story-driven"];

function CreativeGate({
  description, onDescriptionChange, onNext, onSkip, onBack, discovery,
}: {
  description: string;
  onDescriptionChange: (v: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  discovery: DiscoveryData & { businessName?: string };
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [hook, setHook] = useState("");
  const [content, setContent] = useState("");
  const [cta, setCta] = useState("");
  const [tone, setTone] = useState("");

  const hasVideoUploaded = !!fileName;
  const hasBriefing = hook.trim() || content.trim() || cta.trim();
  const canGenerate = hasBriefing || hasVideoUploaded;
  const canProceed = !!description;

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / 1_000_000).toFixed(1)} MB`);
    onDescriptionChange("");
    setGenerated(false);
  };

  const generateDescription = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ads/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: discovery.niche,
          offer: discovery.offer,
          platform: discovery.platform,
          businessName: discovery.businessName,
          videoHook: hook,
          videoContent: content,
          videoCTA: cta,
          videoTone: tone,
          fileName: fileName,
        }),
      });
      const data = await res.json();
      if (data.description) {
        onDescriptionChange(data.description);
        setGenerated(true);
      }
    } catch { /* silently fail */ }
    finally { setGenerating(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 p-7 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
          dragOver ? "border-blue-500/60 bg-blue-500/[0.08]" : fileName ? "border-emerald-500/40 bg-emerald-500/[0.05]" : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.03]"
        )}
      >
        <input ref={fileRef} type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {fileName ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Film className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>{fileName}</p>
              <p className="text-white/60 text-xs">{fileSize} · Click to change</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
              <Upload className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Upload your video ad</p>
            <p className="text-white/40 text-xs">MP4, MOV, AVI · Drag &amp; drop or click</p>
          </>
        )}
      </div>

      {/* Video briefing form */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-white/[0.07]" />
          <p className="text-white/60 text-[11px] uppercase tracking-widest font-medium px-2">Tell us about your video</p>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>

        <div className="space-y-3">
          {/* Hook */}
          <div className="space-y-1.5">
            <label className="text-white text-xs font-medium flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-400" /> Opening Hook — What happens in the first 3 seconds?
            </label>
            <input
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder={`e.g. "I walk through an El Paso home while asking 'still renting?'"`}
              className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 transition-all"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            />
          </div>

          {/* Main content */}
          <div className="space-y-1.5">
            <label className="text-white text-xs font-medium flex items-center gap-1.5">
              <Film className="w-3 h-3 text-blue-400" /> What does the video show / demonstrate?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="e.g. Tour of a recently sold home, pointing out features, showing the offer — free valuation within 48 hours"
              className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 resize-none transition-all"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            />
          </div>

          {/* CTA */}
          <div className="space-y-1.5">
            <label className="text-white text-xs font-medium flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-emerald-400" /> Call to Action at the end
            </label>
            <input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder={`e.g. "DM me 'HOME' to get your free valuation today"`}
              className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 transition-all"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            />
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-white text-xs font-medium">Tone / Style</label>
            <div className="flex flex-wrap gap-2">
              {VIDEO_TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(tone === t ? "" : t)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs border transition-all",
                    tone === t
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                      : "bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white"
                  )}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        {canGenerate && !generated && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={generateDescription}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-violet-600/80 hover:bg-violet-600 text-white border border-violet-500/30 transition-all disabled:opacity-60"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your video + business...</> : <><Zap className="w-4 h-4" /> Generate Video Analysis</>}
          </motion.button>
        )}
      </div>

      {/* Generated description */}
      <AnimatePresence>
        {description && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Video Analysis — Edit if needed
              </label>
              <button onClick={() => { onDescriptionChange(""); setGenerated(false); }}
                className="text-white/40 hover:text-white/70 text-[11px] transition-colors">
                Clear
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={5}
              className="w-full bg-white/[0.05] border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/40 resize-none transition-all"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={onSkip} className="text-white/50 hover:text-white text-sm transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Skip — estimate only
          </button>
        </div>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
            canProceed ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-white/[0.05] text-white/20 cursor-not-allowed"
          )}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Build Campaign <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 3: Architecture ──────────────────────────────────────────────────────

function ArchitectureStep({ campaign, platform, onNext, onRegen, onBack }: {
  campaign: Campaign;
  platform: string;
  onNext: () => void;
  onRegen: () => void;
  onBack: () => void;
}) {
  const [openCopy, setOpenCopy] = useState<number | null>(0);
  const [mismatchAcknowledged, setMismatchAcknowledged] = useState(false);

  const hasMismatch = campaign.audienceAlignment?.score === "Mismatch" || campaign.audienceAlignment?.score === "Weak";
  const showMismatchBlock = hasMismatch && !mismatchAcknowledged;

  const compColor = COMPLIANCE_COLOR[campaign.complianceScore] ?? COMPLIANCE_COLOR.Yellow;
  const styleColor = STYLE_COLORS[campaign.adStyle] ?? "text-blue-400 bg-blue-500/10 border-blue-500/20";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", styleColor)}>
          {campaign.adStyle}
        </span>
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1", compColor)}>
          {campaign.complianceScore === "Green" ? <CheckCircle2 className="w-3 h-3" /> : campaign.complianceScore === "Red" ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          Compliance: {campaign.complianceScore}
        </span>
        <button onClick={onRegen} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-lg transition-all">
          <RefreshCw className="w-3 h-3" /> Regenerate
        </button>
      </div>

      {/* Audience mismatch warning */}
      <AnimatePresence>
        {showMismatchBlock && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-4 bg-red-500/[0.08] border border-red-500/25 rounded-xl space-y-3"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-red-400 text-sm font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Audience Mismatch Detected
                </p>
                <p className="text-red-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {campaign.audienceAlignment.issue}
                </p>
                <p className="text-white text-xs leading-relaxed pt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  <span className="font-medium">Recommendation: </span>
                  {campaign.audienceAlignment.recommendation}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <ChevronLeft className="w-4 h-4" /> Go back &amp; change video
              </button>
              <button
                onClick={() => setMismatchAcknowledged(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/[0.1] hover:border-white/20 transition-all"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Proceed anyway
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategic intent + trend */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-1">
          <p className="text-white text-[10px] uppercase tracking-wider font-medium">Strategic Intent</p>
          <p className="text-white text-sm leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk)" }}>{campaign.strategicIntent}</p>
        </div>
        <div className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-1">
          <p className="text-white text-[10px] uppercase tracking-wider font-medium">Trend Alignment</p>
          <p className="text-white text-sm leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk)" }}>{campaign.trendAlignment}</p>
        </div>
      </div>

      {/* Creative audit */}
      <div className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-3">
        <p className="text-white text-[10px] uppercase tracking-wider font-medium">Creative Audit</p>
        <div className="grid md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <p className="text-blue-400 font-medium">⚡ 3-Second Rule</p>
            <p className="text-white leading-relaxed">{campaign.creativeAudit.threeSec}</p>
          </div>
          <div className="space-y-1">
            <p className="text-violet-400 font-medium">📐 Pacing</p>
            <p className="text-white leading-relaxed">{campaign.creativeAudit.pacing}</p>
          </div>
          <div className="space-y-1">
            <p className="text-amber-400 font-medium">🛡 Safe Zones</p>
            <p className="text-white leading-relaxed">{campaign.creativeAudit.safeZones}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
          <div>
            <p className="text-emerald-400 text-[10px] font-medium uppercase mb-1">Strengths</p>
            {campaign.creativeAudit.strengths.map((s, i) => (
              <p key={i} className="text-white text-xs flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">✓</span>{s}</p>
            ))}
          </div>
          <div>
            <p className="text-red-400 text-[10px] font-medium uppercase mb-1">Weaknesses</p>
            {campaign.creativeAudit.weaknesses.map((w, i) => (
              <p key={i} className="text-white text-xs flex items-start gap-1.5"><span className="text-red-400 mt-0.5">!</span>{w}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Ad copies */}
      <div className="space-y-2">
        <p className="text-white text-[10px] uppercase tracking-wider font-medium">Ad Copy — 3 Variations</p>
        {campaign.adCopies.map((copy, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenCopy(openCopy === i ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
            >
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded border",
                i === 0 ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                : i === 1 ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-pink-400 bg-pink-500/10 border-pink-500/20"
              )}>
                {copy.type.toUpperCase()}
              </span>
              <span className="text-white text-sm font-medium flex-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{copy.headline}</span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", COMPLIANCE_COLOR[copy.complianceStatus])}>
                {copy.complianceStatus}
              </span>
              {openCopy === i ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
            </button>

            <AnimatePresence>
              {openCopy === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="text-white text-[10px] uppercase tracking-wider">Opening Hook (First 3 seconds)</p>
                        <p className="text-white text-sm font-medium italic" style={{ fontFamily: "var(--font-space-grotesk)" }}>&ldquo;{copy.hook}&rdquo;</p>
                      </div>
                      <CopyButton text={copy.hook} />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="text-white text-[10px] uppercase tracking-wider">Primary Text</p>
                        <p className="text-white text-sm leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk)" }}>{copy.primaryText}</p>
                      </div>
                      <CopyButton text={copy.primaryText} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-[10px] uppercase tracking-wider mb-0.5">CTA</p>
                        <span className="text-blue-400 text-sm font-semibold">{copy.cta}</span>
                      </div>
                      {copy.complianceNote && (
                        <p className="text-white/60 text-[11px] max-w-[60%] text-right leading-relaxed">{copy.complianceNote}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Technical setup */}
      <div className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-3">
        <p className="text-white text-[10px] uppercase tracking-wider font-medium">Technical Setup — {platform}</p>
        <div className="grid md:grid-cols-2 gap-3 text-xs">
          <div><p className="text-white/70 mb-1">Objective</p><p className="text-white">{campaign.technicalSetup.objective}</p></div>
          <div><p className="text-white/70 mb-1">Ad Format</p><p className="text-white">{campaign.technicalSetup.adFormat}</p></div>
          <div><p className="text-white/70 mb-1">Placements</p><p className="text-white">{campaign.technicalSetup.placements.join(", ")}</p></div>
          <div><p className="text-white/70 mb-1">Bid Strategy</p><p className="text-white">{campaign.technicalSetup.bidStrategy}</p></div>
        </div>
        <div>
          <p className="text-white/70 text-xs mb-1.5">Audience Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {campaign.technicalSetup.audienceInterests.map((interest, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] bg-white/[0.05] border border-white/[0.1] rounded-full text-white">{interest}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance flags */}
      {campaign.complianceFlags.length > 0 && (
        <div className="p-3 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl space-y-1.5">
          <p className="text-amber-400 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Compliance Flags</p>
          {campaign.complianceFlags.map((flag, i) => (
            <p key={i} className="text-amber-400 text-xs">• {flag}</p>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          View Financials &amp; Deploy <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 4: Financials ────────────────────────────────────────────────────────

function FinancialsStep({ campaign, platform, onRestart, onBack }: {
  campaign: Campaign;
  platform: string;
  onRestart: () => void;
  onBack: () => void;
}) {
  const { budget } = campaign;
  const launchUrl = PLATFORM_URLS[platform] ?? "#";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* Spend warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-400 text-xs leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <span className="font-semibold">SPEND NOTICE:</span> You are responsible for direct billing from {platform}. Nuvaxis AI does not collect or manage your ad spend. All budget figures are Market Benchmark Estimates.
        </p>
      </div>

      {/* Budget table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.09]">
        <table className="w-full text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <thead>
            <tr className="bg-white/[0.04] border-b border-white/[0.07]">
              <th className="text-left px-4 py-3 text-white text-[10px] uppercase tracking-wider font-medium">Metric</th>
              <th className="text-left px-4 py-3 text-white text-[10px] uppercase tracking-wider font-medium">Estimated Range</th>
              <th className="text-left px-4 py-3 text-white text-[10px] uppercase tracking-wider font-medium hidden md:table-cell">Strategy Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-white font-medium">Daily Budget</td>
              <td className="px-4 py-3 text-white font-bold">${budget.dailyBudgetMin} – ${budget.dailyBudgetMax}</td>
              <td className="px-4 py-3 text-white/70 text-xs hidden md:table-cell">To exit the Learning Phase</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-white font-medium">Estimated CPC</td>
              <td className="px-4 py-3 text-white font-bold">${budget.estimatedCPCMin.toFixed(2)} – ${budget.estimatedCPCMax.toFixed(2)}</td>
              <td className="px-4 py-3 text-white/70 text-xs hidden md:table-cell">Based on niche benchmarks</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-white font-medium">Target CPA Goal</td>
              <td className="px-4 py-3 text-white font-bold">${budget.targetCPA.toFixed(2)}</td>
              <td className="px-4 py-3 text-white/70 text-xs hidden md:table-cell">Required for offer profitability</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-white font-medium">Weekly Conv. Goal</td>
              <td className="px-4 py-3 text-white font-bold">{budget.weeklyConversionGoal} events/wk</td>
              <td className="px-4 py-3 text-white/70 text-xs hidden md:table-cell">Needed to exit Learning Phase</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Learning phase note */}
      <div className="p-4 bg-blue-500/[0.06] border border-blue-500/20 rounded-xl">
        <p className="text-blue-400 text-xs font-medium mb-1 uppercase tracking-wider">Learning Phase Rule</p>
        <p className="text-blue-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk)" }}>{budget.learningPhaseNote}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <a
          href={launchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Launch on {platform} <ExternalLink className="w-4 h-4" />
        </a>
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-white border border-white/[0.1] hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <ChevronLeft className="w-4 h-4" /> Back to Campaign
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.07] transition-all"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <RefreshCw className="w-4 h-4" /> New Campaign
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AdCampaignSection({ profile }: AdCampaignSectionProps) {
  const botName = profile?.botName || "Nova";
  const [step, setStep] = useState(1);
  const [discovery, setDiscovery] = useState<DiscoveryData>({
    niche:          profile?.niche || profile?.industry || "",
    offer:          "",
    targetAudience: "",
    platform:       "",
  });
  const [videoDescription, setVideoDescription] = useState("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generate = async (skipVideo = false) => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...discovery,
          videoDescription: skipVideo ? "" : videoDescription,
          businessName: profile?.businessName,
          location: profile?.location,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.campaign) throw new Error(data.error || "Generation failed.");
      setCampaign(data.campaign);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const restart = () => {
    setStep(1);
    setDiscovery({ niche: profile?.niche || profile?.industry || "", offer: "", targetAudience: "", platform: "" });
    setVideoDescription("");
    setCampaign(null);
    setError("");
  };

  return (
    <div className="h-full overflow-y-auto px-3 md:px-6 py-4 md:py-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h1 className="text-white text-base font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Ad Campaign Builder
            </h1>
            <p className="text-white/60 text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {botName} · Ad Campaign Builder
            </p>
          </div>
        </div>

        {/* Progress stepper */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const isActive   = step === s.id;
            const isComplete = step > s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1 min-w-0">
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-2 rounded-xl flex-shrink-0 transition-all",
                  isActive   ? "bg-blue-600/20 border border-blue-500/30" :
                  isComplete ? "bg-emerald-500/10 border border-emerald-500/20" :
                               "bg-white/[0.03] border border-white/[0.06]"
                )}>
                  {isComplete
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    : <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-blue-400" : "text-white/40")} />
                  }
                  <span className={cn(
                    "text-[11px] font-medium hidden sm:block",
                    isActive ? "text-blue-400" : isComplete ? "text-emerald-400" : "text-white/50"
                  )} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-px mx-1", isComplete ? "bg-emerald-500/30" : "bg-white/[0.06]")} />
                )}
              </div>
            );
          })}
        </div>

        {/* Selection summary bar — steps 2, 3, 4 */}
        <AnimatePresence>
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1 min-w-0 text-xs">
                {discovery.niche && (
                  <span className="text-white font-medium truncate">{discovery.niche}</span>
                )}
                {discovery.offer && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-white truncate">{discovery.offer}</span>
                  </>
                )}
                {discovery.platform && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-blue-400 font-semibold">{discovery.platform}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white border border-white/[0.1] hover:border-white/25 px-3 py-1.5 rounded-lg transition-all"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  ✏ Edit
                </button>
                <button
                  onClick={restart}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 border border-white/[0.07] hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <RefreshCw className="w-3 h-3" /> Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 md:p-6">
          <div className="mb-5 relative">
            <p className="text-white text-base font-bold tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              STATE {step} — {STEPS[step - 1]?.label.toUpperCase()}
            </p>
            <p className="text-white text-sm mt-0.5">{STEPS[step - 1]?.sub}</p>
            {error && (
              <div className="absolute top-0 right-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <div className="text-center">
                  <p className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {botName} is architecting your campaign...
                  </p>
                  <p className="text-white/60 text-xs mt-1">Running compliance scan · Generating 3 copy variations</p>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <DiscoveryStep
                key="s1"
                data={discovery}
                onChange={setDiscovery}
                onNext={() => setStep(2)}
                profile={profile}
              />
            ) : step === 2 ? (
              <CreativeGate
                key="s2"
                description={videoDescription}
                onDescriptionChange={setVideoDescription}
                onNext={() => generate(false)}
                onSkip={() => generate(true)}
                onBack={() => setStep(1)}
                discovery={{ ...discovery, businessName: profile?.businessName }}
              />
            ) : step === 3 && campaign ? (
              <ArchitectureStep
                key="s3"
                campaign={campaign}
                platform={discovery.platform}
                onNext={() => setStep(4)}
                onRegen={() => generate(false)}
                onBack={() => { setVideoDescription(""); setStep(2); }}
              />
            ) : step === 4 && campaign ? (
              <FinancialsStep
                key="s4"
                campaign={campaign}
                platform={discovery.platform}
                onRestart={restart}
                onBack={() => setStep(3)}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

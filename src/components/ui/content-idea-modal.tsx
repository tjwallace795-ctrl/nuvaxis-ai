"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  Hash,
  Zap,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

interface ContentIdea {
  emoji: string;
  label: string;
  sub: string;
  why: string;
  platform: string;
  urgency: string;
  hook: string;
}

interface ContentGuide {
  title: string;
  tldr: string;
  why: string;
  steps: { step: string; detail: string }[];
  hooks: string[];
  hashtags: string[];
  bestTime: string;
  script: string;
  proTip: string;
  expectedResult: string;
}

interface ContentIdeaModalProps {
  idea: ContentIdea | null;
  businessName: string;
  industry: string;
  niche?: string;
  onClose: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-[10px] text-white/30 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06]"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const platformColor: Record<string, string> = {
  TikTok:   "text-pink-400   bg-pink-400/10   border-pink-400/20",
  Instagram:"text-violet-400 bg-violet-400/10 border-violet-400/20",
  YouTube:  "text-red-400    bg-red-400/10    border-red-400/20",
  "Google Business": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  All:      "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export function ContentIdeaModal({ idea, businessName, industry, niche, onClose }: ContentIdeaModalProps) {
  const [guide, setGuide] = useState<ContentGuide | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idea) return;
    setGuide(null);
    setLoading(true);

    fetch("/api/content-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, industry, niche, idea }),
    })
      .then(r => r.json())
      .then(data => setGuide(data.guide))
      .catch(() => setGuide(null))
      .finally(() => setLoading(false));
  }, [idea, businessName, industry, niche]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {idea && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[520px] z-50 flex flex-col bg-neutral-950 border-l border-white/[0.08] shadow-2xl overflow-hidden"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-xl">
                    {idea.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-white font-bold text-base leading-tight">{idea.label}</h2>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${platformColor[idea.platform] ?? platformColor.All}`}>
                        {idea.platform}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs">{idea.sub}</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Urgency + hook */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/50">{idea.urgency}</span>
                {idea.hook && (
                  <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/15 rounded-lg px-2.5 py-1 min-w-0">
                    <Zap className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="text-blue-300 text-[11px] truncate">Hook: &ldquo;{idea.hook}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {loading && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span>Generating your guide for <span className="text-white/70">{businessName}</span>...</span>
                  </div>
                  {[80, 60, 90, 50, 70].map((w, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <div className="h-2.5 bg-white/[0.06] rounded-full" style={{ width: `${w}%` }} />
                      <div className="h-2 bg-white/[0.04] rounded-full w-full" />
                      <div className="h-2 bg-white/[0.04] rounded-full" style={{ width: `${w - 15}%` }} />
                    </div>
                  ))}
                </div>
              )}

              {!loading && guide && (
                <>
                  {/* TLDR */}
                  <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-blue-400 text-[11px] font-semibold uppercase tracking-wide">Bottom Line</span>
                    </div>
                    <p className="text-white/85 text-sm leading-relaxed">{guide.tldr}</p>
                  </div>

                  {/* Why it works */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <h3 className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">Why This Works for {businessName}</h3>
                    </div>
                    <p className="text-white/55 text-xs leading-relaxed">{guide.why}</p>
                  </div>

                  {/* Step-by-step */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                      <h3 className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">How To Do It</h3>
                    </div>
                    <div className="space-y-2">
                      {guide.steps?.map((s, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                          <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-violet-400 text-[9px] font-bold">{i + 1}</span>
                          </div>
                          <div>
                            <p className="text-white/85 text-xs font-semibold mb-0.5">{s.step}</p>
                            <p className="text-white/40 text-xs leading-relaxed">{s.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caption/Script */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <h3 className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">Script / Caption Template</h3>
                      </div>
                      <CopyButton text={guide.script} />
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-white/75 text-xs leading-relaxed whitespace-pre-wrap">{guide.script}</p>
                    </div>
                  </div>

                  {/* Hook options */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <h3 className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">Opening Hooks</h3>
                    </div>
                    <div className="space-y-2">
                      {guide.hooks?.map((h, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 p-2.5 bg-white/[0.03] border border-white/[0.05] rounded-xl group hover:border-pink-400/20 transition-colors">
                          <p className="text-white/70 text-xs italic flex-1">&ldquo;{h}&rdquo;</p>
                          <CopyButton text={h} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-blue-400" />
                        <h3 className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">Hashtags</h3>
                      </div>
                      <CopyButton text={guide.hashtags?.join(" ") ?? ""} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.hashtags?.map((tag, i) => (
                        <span key={i} className="text-[11px] text-blue-400/80 bg-blue-500/[0.08] border border-blue-500/15 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Best time + Pro tip */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Clock className="w-3 h-3 text-white/30" />
                        <span className="text-white/30 text-[10px] font-semibold uppercase">Best Time</span>
                      </div>
                      <p className="text-white/70 text-xs">{guide.bestTime}</p>
                    </div>
                    <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Target className="w-3 h-3 text-white/30" />
                        <span className="text-white/30 text-[10px] font-semibold uppercase">Goal</span>
                      </div>
                      <p className="text-white/70 text-xs">{guide.expectedResult}</p>
                    </div>
                  </div>

                  {/* Pro tip */}
                  <div className="bg-yellow-400/[0.06] border border-yellow-400/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-yellow-400 text-[11px] font-semibold uppercase tracking-wide">Pro Tip</span>
                    </div>
                    <p className="text-white/65 text-xs leading-relaxed">{guide.proTip}</p>
                  </div>
                </>
              )}

              {!loading && !guide && (
                <div className="flex flex-col items-center justify-center h-32 text-white/20 text-sm">
                  <p>Failed to generate guide.</p>
                  <p className="text-xs mt-1">Check your API key and try again.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

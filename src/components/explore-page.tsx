"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, TrendingUp, Play, ExternalLink, Sparkles,
  RefreshCw, Flame, X, MonitorPlay, Camera, VolumeX, Globe,
} from "lucide-react";

// ── types ──────────────────────────────────────────────────────────────────────

interface ExploreVideo {
  id: string; title: string; link: string; snippet: string;
  imageUrl: string; duration: string; channel: string;
  date: string; platform: string; trendScore: number; views?: string;
}
interface FeedPage { videos: ExploreVideo[]; aiInsight: string; nextPage: number; hasMore: boolean; }
interface ProfileState { industry: string; niche: string; businessName: string; }

// ── config ─────────────────────────────────────────────────────────────────────

const COLUMNS: { platform: string; label: string }[] = [
  { platform: "YouTube",   label: "YouTube"   },
  { platform: "TikTok",    label: "TikTok"    },
  { platform: "Instagram", label: "Instagram" },
  { platform: "All",       label: "Trending"  },
];

const PCFG: Record<string, {
  color: string; bg: string; border: string; glowRgb: string; gradFrom: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = {
  YouTube:   { color: "text-red-400",    bg: "bg-red-500/[0.12]",    border: "border-red-500/25",    glowRgb: "220,38,38",   gradFrom: "from-red-950/70",    Icon: MonitorPlay },
  TikTok:    { color: "text-pink-400",   bg: "bg-pink-500/[0.12]",   border: "border-pink-500/25",   glowRgb: "236,72,153",  gradFrom: "from-pink-950/70",   Icon: Flame       },
  Instagram: { color: "text-violet-400", bg: "bg-violet-500/[0.12]", border: "border-violet-500/25", glowRgb: "139,92,246",  gradFrom: "from-violet-950/70", Icon: Camera      },
  All:       { color: "text-blue-400",   bg: "bg-blue-500/[0.12]",   border: "border-blue-500/25",   glowRgb: "59,130,246",  gradFrom: "from-blue-950/70",   Icon: TrendingUp  },
  Web:       { color: "text-blue-400",   bg: "bg-blue-500/[0.12]",   border: "border-blue-500/25",   glowRgb: "59,130,246",  gradFrom: "from-blue-950/70",   Icon: Globe       },
};

function pcfg(platform: string) { return PCFG[platform] ?? PCFG.Web; }

function scoreHex(score: number) {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#60a5fa";
  return "#a78bfa";
}

function simHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function simEngagement(id: string) {
  const h = simHash(id);
  return { likes: 1200 + (h % 98800), comments: 40 + ((h >>> 8) % 4960) };
}
function formatK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function fireEmoji(score: number): string {
  if (score >= 80) return "🔥🔥🔥";
  if (score >= 65) return "🔥🔥";
  if (score >= 50) return "🔥";
  return "";
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v"); if (v) return v;
      const s = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/); if (s) return s[1];
    }
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
  } catch { /* noop */ }
  return null;
}

// ── useAutoPlay ────────────────────────────────────────────────────────────────

function useAutoPlay(ytId: string | null, ref: React.RefObject<HTMLDivElement | null>) {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!ytId) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.6) {
        timer.current = setTimeout(() => setPlaying(true), 400);
      } else {
        if (timer.current) clearTimeout(timer.current);
        setPlaying(false);
      }
    }, { threshold: [0, 0.6] });
    const el = ref.current; if (el) obs.observe(el);
    return () => { obs.disconnect(); if (timer.current) clearTimeout(timer.current); };
  }, [ytId, ref]);
  return playing;
}

// ── VideoModal ─────────────────────────────────────────────────────────────────

function VideoModal({ video, onClose }: { video: ExploreVideo; onClose: () => void }) {
  const ytId = extractYouTubeId(video.link);
  const p    = pcfg(video.platform);
  const Icon = p.Icon;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed z-50 bg-neutral-950 overflow-hidden
          bottom-0 left-0 right-0 rounded-t-[28px] max-h-[92dvh]
          md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:w-[480px] md:rounded-3xl md:max-h-[88vh]"
        style={{ border: `1px solid rgba(${p.glowRgb},0.2)`, boxShadow: `0 0 60px rgba(${p.glowRgb},0.12), 0 24px 80px rgba(0,0,0,0.7)` }}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {ytId ? (
          <div className="w-full aspect-video bg-black">
            <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full border-0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-black">
            {video.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover opacity-50" />
            )}
            {!video.imageUrl && <div className={`w-full h-full bg-gradient-to-br ${p.gradFrom} to-neutral-950`} />}
            <div className="absolute inset-0 flex items-center justify-center">
              <a href={video.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl px-5 py-3 transition-all">
                <div className={`w-10 h-10 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center`}>
                  <Play className={`w-5 h-5 ${p.color} fill-current ml-0.5`} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Watch on {video.platform}</p>
                  <p className="text-white/40 text-xs">Opens in new tab</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30" />
              </a>
            </div>
          </div>
        )}

        <div className="p-5 space-y-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.color} ${p.bg} ${p.border}`}>
              <Icon className="w-3 h-3" />{video.platform}
            </span>
            <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden ml-2">
              <div className="h-full rounded-full" style={{ width: `${video.trendScore}%`, background: `linear-gradient(90deg, ${scoreHex(video.trendScore)}55, ${scoreHex(video.trendScore)})` }} />
            </div>
            <span className="text-[10px] font-bold text-white/40">{video.trendScore}</span>
          </div>
          <h3 className="text-white font-bold text-[15px] leading-snug">{video.title}</h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-[9px] font-bold text-white/50 flex-shrink-0">
              {(video.channel || "?").charAt(0).toUpperCase()}
            </div>
            <span className="text-white/50 text-xs">{video.channel}</span>
            {video.date && <span className="text-white/25 text-xs">· {video.date}</span>}
          </div>
          {video.snippet && <p className="text-white/35 text-xs leading-relaxed line-clamp-3">{video.snippet}</p>}
          <a href={video.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/[0.16] hover:bg-white/[0.04] transition-all text-xs font-medium">
            <ExternalLink className="w-3.5 h-3.5" />
            {ytId ? "Open in YouTube" : `Open on ${video.platform}`}
          </a>
        </div>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </>
  );
}

// ── ColumnCard ─────────────────────────────────────────────────────────────────

function ColumnCard({ video, index, onClick }: {
  video: ExploreVideo; index: number; onClick: () => void;
}) {
  const p       = pcfg(video.platform);
  const Icon    = p.Icon;
  const ytId    = extractYouTubeId(video.link);
  const ref     = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);
  const playing = useAutoPlay(ytId, ref);
  const hex     = scoreHex(video.trendScore);
  const fire    = fireEmoji(video.trendScore);
  const { likes, comments } = simEngagement(video.id);

  // HD thumbnail: YouTube → maxresdefault, fallback to hqdefault
  const hdSrc = ytId
    ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    : video.imageUrl;

  // Stronger clarity filter for non-YouTube thumbnails (TikTok/Instagram)
  const imgFilter = ytId ? undefined : "saturate(1.35) contrast(1.2) brightness(1.05)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="relative group cursor-pointer rounded-xl overflow-hidden border border-white/[0.07] bg-black/55 backdrop-blur-sm"
      whileHover={{ scale: 1.015, borderColor: `rgba(${p.glowRgb},0.3)`, boxShadow: `0 4px 24px rgba(${p.glowRgb},0.15)` }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, delay: (index % 6) * 0.045 }}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-neutral-900">
        {ytId && playing ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full border-0 pointer-events-none"
              allow="autoplay; encrypted-media"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur text-white/70 text-[8px] font-semibold px-1.5 py-0.5 rounded-full border border-white/10 z-10">
              <VolumeX className="w-2 h-2" /> Muted
            </motion.div>
          </>
        ) : (
          <>
            {hdSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={hdSrc}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ filter: imgFilter, imageRendering: "auto" }}
                loading="lazy"
                decoding="async"
                onError={() => {
                  if (imgRef.current && ytId && imgRef.current.src.includes("maxresdefault")) {
                    imgRef.current.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                  }
                }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${p.gradFrom} to-neutral-950 flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${p.color} opacity-15`} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center"
                style={{ boxShadow: `0 0 16px rgba(${p.glowRgb},0.3)` }}>
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
            </div>
            {/* Fire badge — top-left (only when not playing) */}
            {fire && (
              <div className="absolute top-1.5 left-1.5 text-[11px] leading-none z-10 drop-shadow-md select-none">
                {fire}
              </div>
            )}
          </>
        )}

        {/* Platform badge — top-right always */}
        <div className={`absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[8px] font-bold backdrop-blur-sm z-10 ${p.color} ${p.bg} ${p.border}`}>
          <Icon className="w-2 h-2" />{video.platform}
        </div>

        {/* Duration */}
        {video.duration && !playing && (
          <div className="absolute bottom-[52px] right-1.5 bg-black/75 text-white text-[8px] px-1.5 py-0.5 rounded font-mono backdrop-blur z-10">
            {video.duration}
          </div>
        )}

        {/* Title + channel + engagement overlay */}
        <div className="absolute inset-x-0 bottom-0 px-2.5 py-2 z-10">
          <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2 drop-shadow">{video.title}</p>
          <div className="flex items-center justify-between mt-1 gap-1">
            <p className="text-white/45 text-[8px] truncate">{video.channel}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {video.views ? (
                <span className="flex items-center gap-0.5 text-[8px] text-white/65 font-semibold">
                  <span className="text-[9px]">👁️</span>{video.views.replace(/\s*views?\s*/i, "")}
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-0.5 text-[8px] text-white/55 font-medium">
                    <span className="text-[9px]">❤️</span>{formatK(likes)}
                  </span>
                  <span className="flex items-center gap-0.5 text-[8px] text-white/55 font-medium">
                    <span className="text-[9px]">💬</span>{formatK(comments)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trend bar */}
      <div className="h-[2px] w-full bg-white/[0.04]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${video.trendScore}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full"
          style={{ background: `linear-gradient(90deg, transparent, ${hex})` }}
        />
      </div>
    </motion.div>
  );
}

// ── FeedColumn ─────────────────────────────────────────────────────────────────

function FeedColumn({ platform, label, profile, onCardClick, aiInsight }: {
  platform: string; label: string;
  profile: ProfileState;
  onCardClick: (v: ExploreVideo) => void;
  aiInsight?: string;
}) {
  const [videos, setVideos]           = useState<ExploreVideo[]>([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [insight, setInsight]         = useState(aiInsight ?? "");
  const scrollRef  = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const pageRef    = useRef(0);   // mirrors page but stable in scroll closure
  const cycleRef   = useRef(0);   // bumped each cycle so IDs stay unique
  const seenLinks  = useRef(new Set<string>());
  const p    = pcfg(platform);
  const Icon = p.Icon;

  const fetch_ = useCallback(async (replace = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (replace) setLoading(true); else setLoadingMore(true);
    try {
      const res  = await fetch("/api/explore/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: profile.industry, niche: profile.niche, platform, page: pageRef.current }),
      });
      const data: FeedPage = await res.json();

      // Deduplicate by link so cycling doesn't repeat cards
      const fresh = data.videos
        .filter(v => !seenLinks.current.has(v.link))
        .map(v => { seenLinks.current.add(v.link); return { ...v, id: `c${cycleRef.current}-${v.id}` }; });

      setVideos(prev => replace ? fresh : [...prev, ...fresh]);
      if (replace && data.aiInsight) setInsight(data.aiInsight);

      if (data.hasMore) {
        pageRef.current = data.nextPage;
      } else {
        // Cycle back — bump counter so next batch has unique IDs
        cycleRef.current += 1;
        pageRef.current = 0;
      }
    } catch { /* noop */ }
    finally { setLoading(false); setLoadingMore(false); loadingRef.current = false; }
  }, [profile.industry, profile.niche, platform]);

  // Initial load
  useEffect(() => {
    seenLinks.current.clear();
    cycleRef.current = 0;
    pageRef.current  = 0;
    setVideos([]);
    setInsight("");
    fetch_(true);
  }, [fetch_]);

  // Doom scroll: fire 400px before the bottom of each column
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!loadingRef.current && el.scrollTop + el.clientHeight >= el.scrollHeight - 400) {
        fetch_(false);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [fetch_]);

  return (
    <div className="flex flex-col h-full border-r border-white/[0.06] last:border-r-0 min-w-0">

      {/* Column header */}
      <div className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 border-b ${p.border} backdrop-blur-sm`}
        style={{ background: "rgba(0,0,0,0.45)" }}>
        <div className={`w-6 h-6 rounded-lg ${p.bg} border ${p.border} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3 h-3 ${p.color}`} />
        </div>
        <span className={`text-xs font-bold ${p.color}`}>{label}</span>
        {insight && (
          <div className="hidden 2xl:flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] max-w-[180px]">
            <Sparkles className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
            <span className="text-white/35 text-[8px] truncate">{insight}</span>
          </div>
        )}
        <button onClick={() => fetch_(true)} disabled={loading}
          className="ml-auto text-white/20 hover:text-white/60 transition-colors disabled:opacity-30">
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Scrollable cards */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2 space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-white/[0.05] animate-pulse">
              <div className="w-full aspect-video bg-white/[0.04]" />
              <div className="h-[2px] bg-white/[0.03]" />
            </div>
          ))
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-white/15 text-xs gap-2">
            <Icon className={`w-6 h-6 ${p.color} opacity-20`} />
            No content found
          </div>
        ) : (
          <>
            {videos.map((v, i) => (
              <ColumnCard key={v.id} video={v} index={i} onClick={() => onCardClick(v)} />
            ))}
            {loadingMore && (
              <div className="flex justify-center py-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw className={`w-3 h-3 ${p.color} opacity-40`} />
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── ExplorePage ────────────────────────────────────────────────────────────────

export function ExplorePage({ profile }: { profile: ProfileState }) {
  const [activeVideo, setActiveVideo] = useState<ExploreVideo | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: "var(--font-space-grotesk)" }}>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal key={activeVideo.id} video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(12px)" }}>
        <Compass className="w-4 h-4 text-blue-400" />
        <div>
          <span className="text-white text-sm font-bold">Explore</span>
          <span className="text-white/30 text-xs ml-2">
            Trending for <span className="text-white/50">{profile.niche || profile.industry}</span>
          </span>
        </div>
      </div>

      {/* 4-column grid — each column independently scrollable */}
      {/* Mobile: 1 col → sm: 2 col → lg: 4 col */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
        {COLUMNS.map(({ platform, label }) => (
          <FeedColumn
            key={platform}
            platform={platform}
            label={label}
            profile={profile}
            onCardClick={setActiveVideo}
          />
        ))}
      </div>
    </div>
  );
}

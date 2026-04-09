"use client";

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SALEM PIPELINE — 9-Agent Lead Intelligence System          ║
 * ║  Scout · Pulse · Filter · Trace · Cascade · Forge ·         ║
 * ║  Quill · Nexus · Relay                                       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Megaphone,
  Filter,
  Fingerprint,
  Droplets,
  Hammer,
  PenLine,
  Link2,
  Send,
  Play,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  Circle,
  ArrowDown,
  Zap,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type AgentStatus = "idle" | "running" | "done" | "error";

interface Agent {
  id: number;
  codename: string;
  title: string;
  section: "Researcher" | "Enricher" | "Strategist";
  description: string;
  platform: string;
  input: string;
  output: string;
  icon: React.ElementType;
  color: string;
  envVars: string[];
}

// ── Agent definitions ─────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: 1,
    codename: "Scout",
    title: "Real Estate Signal Scanner",
    section: "Researcher",
    description: "Scrapes Zillow for FSBO, Auction, and Price Reduced listings. Caps at 50/run with 10s rate-limit retry.",
    platform: "AgentQL / Browse AI",
    input: "ZILLOW_TARGET_URL",
    output: "RawSignal[] → Filter",
    icon: Search,
    color: "blue",
    envVars: ["AGENTQL_API_KEY", "ZILLOW_TARGET_URL"],
  },
  {
    id: 2,
    codename: "Pulse",
    title: "B2B Ad Intelligence Scanner",
    section: "Researcher",
    description: "Queries Facebook Ads Library for active advertisers. Scores spend tier — only returns medium/high spenders (3+ active ads).",
    platform: "Facebook Ads Library API",
    input: "TARGET_INDUSTRY",
    output: "B2BSignal[] → Filter",
    icon: Megaphone,
    color: "orange",
    envVars: ["FACEBOOK_ACCESS_TOKEN", "FACEBOOK_AD_LIBRARY_URL", "TARGET_INDUSTRY"],
  },
  {
    id: 3,
    codename: "Filter",
    title: "Signal Classifier & Deduplicator",
    section: "Researcher",
    description: "Merges Scout + Pulse output. Deduplicates, sends to Claude for intent scoring (1–10). Drops anything below 5.",
    platform: "Claude Sonnet 4",
    input: "RawSignal[] + B2BSignal[]",
    output: "ScoredSignal[] → Trace",
    icon: Filter,
    color: "violet",
    envVars: ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL"],
  },
  {
    id: 4,
    codename: "Trace",
    title: "Identity Resolution",
    section: "Enricher",
    description: "Routes by lead type: homeowners → ATTOM + Whitepages; B2B → Apollo + Proxycurl. Requires 2 sources for confidence 8+.",
    platform: "ATTOM · Whitepages · Apollo.io · Proxycurl",
    input: "ScoredSignal",
    output: "ResolvedLead → Cascade",
    icon: Fingerprint,
    color: "emerald",
    envVars: ["ATTOM_API_KEY", "WHITEPAGES_API_KEY", "APOLLO_API_KEY", "PROXYCURL_API_KEY"],
  },
  {
    id: 5,
    codename: "Cascade",
    title: "Waterfall Email Enricher",
    section: "Enricher",
    description: "4-step waterfall: Hunter → Apollo → Datagma → Dropcontact. Stops at first deliverable email. LinkedIn-only leads skip Quill.",
    platform: "Hunter.io → Apollo → Datagma → Dropcontact",
    input: "ResolvedLead",
    output: "EnrichedLead → Forge",
    icon: Droplets,
    color: "cyan",
    envVars: ["HUNTER_API_KEY", "APOLLO_API_KEY", "DATAGMA_API_KEY", "DROPCONTACT_API_KEY"],
  },
  {
    id: 6,
    codename: "Forge",
    title: "Lead Record Assembler",
    section: "Enricher",
    description: "Merges all enrichment data into a Gold Lead. Assigns route: outreach (≥8), warm_queue (5–7), or discard (<5).",
    platform: "Internal (no external API)",
    input: "ResolvedLead + EnrichedLead",
    output: "GoldLead → Quill / Nexus / Relay",
    icon: Hammer,
    color: "amber",
    envVars: [],
  },
  {
    id: 7,
    codename: "Quill",
    title: "Cold Email Copywriter",
    section: "Strategist",
    description: "Writes 2 cold email variations per lead (Direct Hook + Story Hook) using Claude. Under 75 words, one CTA, no buzzwords.",
    platform: "Claude Sonnet 4",
    input: "GoldLead (email only)",
    output: "email_drafts → Relay",
    icon: PenLine,
    color: "pink",
    envVars: ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL"],
  },
  {
    id: 8,
    codename: "Nexus",
    title: "LinkedIn Message Writer",
    section: "Strategist",
    description: "Writes a 3-message LinkedIn sequence: Connection Note (≤280 chars), Day 3 follow-up, Day 7 follow-up. Runs for ALL leads.",
    platform: "Claude Sonnet 4",
    input: "GoldLead (all leads)",
    output: "linkedin_messages → Relay",
    icon: Link2,
    color: "indigo",
    envVars: ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL"],
  },
  {
    id: 9,
    codename: "Relay",
    title: "CRM Dispatcher & Approval Router",
    section: "Strategist",
    description: "Routes outreach leads to Gmail drafts + Airtable + HubSpot. Warm queue → HubSpot pipeline. Sends daily digest at 9 AM. Human approval required.",
    platform: "Gmail · HubSpot · Airtable",
    input: "GoldLead + email_drafts + linkedin_messages",
    output: "CRM records + Gmail drafts",
    icon: Send,
    color: "rose",
    envVars: ["HUBSPOT_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"],
  },
];

const SECTIONS = [
  { label: "Section 1 — Researcher",  color: "blue",   agents: [1, 2, 3] },
  { label: "Section 2 — Enricher",    color: "emerald", agents: [4, 5, 6] },
  { label: "Section 3 — Strategist",  color: "violet",  agents: [7, 8, 9] },
];

// ── Color maps ────────────────────────────────────────────────────────────────

const colorMap: Record<string, { badge: string; icon: string; glow: string; border: string; dot: string }> = {
  blue:    { badge: "bg-blue-500/15 text-blue-300 border-blue-500/25",    icon: "text-blue-400",    glow: "from-blue-500/5",    border: "border-blue-500/20",    dot: "bg-blue-400"    },
  orange:  { badge: "bg-orange-500/15 text-orange-300 border-orange-500/25",  icon: "text-orange-400",  glow: "from-orange-500/5",  border: "border-orange-500/20",  dot: "bg-orange-400"  },
  violet:  { badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",  icon: "text-violet-400",  glow: "from-violet-500/5",  border: "border-violet-500/20",  dot: "bg-violet-400"  },
  emerald: { badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",icon: "text-emerald-400", glow: "from-emerald-500/5", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  cyan:    { badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",    icon: "text-cyan-400",    glow: "from-cyan-500/5",    border: "border-cyan-500/20",    dot: "bg-cyan-400"    },
  amber:   { badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",   icon: "text-amber-400",   glow: "from-amber-500/5",   border: "border-amber-500/20",   dot: "bg-amber-400"   },
  pink:    { badge: "bg-pink-500/15 text-pink-300 border-pink-500/25",    icon: "text-pink-400",    glow: "from-pink-500/5",    border: "border-pink-500/20",    dot: "bg-pink-400"    },
  indigo:  { badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",  icon: "text-indigo-400",  glow: "from-indigo-500/5",  border: "border-indigo-500/20",  dot: "bg-indigo-400"  },
  rose:    { badge: "bg-rose-500/15 text-rose-300 border-rose-500/25",    icon: "text-rose-400",    glow: "from-rose-500/5",    border: "border-rose-500/20",    dot: "bg-rose-400"    },
};

const sectionColorMap: Record<string, { header: string; border: string; badge: string }> = {
  blue:    { header: "text-blue-400",    border: "border-blue-500/20",    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20"    },
  emerald: { header: "text-emerald-400", border: "border-emerald-500/20", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
  violet:  { header: "text-violet-400",  border: "border-violet-500/20",  badge: "bg-violet-500/10 text-violet-300 border-violet-500/20"  },
};

// ── Status helpers ────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: AgentStatus }) {
  if (status === "running") return <Loader2 className="w-3.5 h-3.5 text-yellow-400 animate-spin" />;
  if (status === "done")    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === "error")   return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
  return <Circle className="w-3.5 h-3.5 text-white/20" />;
}

function statusLabel(s: AgentStatus) {
  if (s === "running") return "Running";
  if (s === "done")    return "Done";
  if (s === "error")   return "Error";
  return "Idle";
}

// ── Agent card ────────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  status,
  expanded,
  onToggle,
}: {
  agent: Agent;
  status: AgentStatus;
  expanded: boolean;
  onToggle: () => void;
}) {
  const c = colorMap[agent.color];
  const Icon = agent.icon;

  return (
    <motion.div
      layout
      className={cn(
        "relative rounded-xl border bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden cursor-pointer select-none",
        status === "running" ? "border-yellow-500/40" : status === "done" ? "border-emerald-500/30" : c.border
      )}
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      {/* glow strip */}
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r via-white/10", `from-transparent to-transparent`)} />
      {status === "running" && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-yellow-500/5 pointer-events-none" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* left */}
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn("flex-shrink-0 w-9 h-9 rounded-lg border bg-white/[0.05] flex items-center justify-center", c.border)}>
              <Icon className={cn("w-4 h-4", c.icon)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-xs font-bold tracking-widest uppercase border rounded px-1.5 py-0.5", c.badge)}>
                  {agent.codename}
                </span>
                <span className="text-white/40 text-xs hidden sm:block">Agent {agent.id}</span>
              </div>
              <p className="text-white/80 text-sm font-medium mt-1 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {agent.title}
              </p>
            </div>
          </div>

          {/* right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <StatusDot status={status} />
              <span className={cn(
                "text-xs",
                status === "running" ? "text-yellow-400" :
                status === "done" ? "text-emerald-400" :
                status === "error" ? "text-red-400" : "text-white/30"
              )}>
                {statusLabel(status)}
              </span>
            </div>
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-white/30" />
              : <ChevronDown className="w-3.5 h-3.5 text-white/30" />
            }
          </div>
        </div>

        {/* description always visible */}
        <p className="text-white/50 text-xs leading-relaxed mt-3">{agent.description}</p>

        {/* expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                {/* platform */}
                <div className="flex gap-2">
                  <span className="text-white/30 text-xs w-16 flex-shrink-0">Platform</span>
                  <span className="text-white/60 text-xs">{agent.platform}</span>
                </div>
                {/* data flow */}
                <div className="flex gap-2">
                  <span className="text-white/30 text-xs w-16 flex-shrink-0">Input</span>
                  <span className="text-white/60 text-xs font-mono">{agent.input}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/30 text-xs w-16 flex-shrink-0">Output</span>
                  <span className={cn("text-xs font-mono", c.icon)}>{agent.output}</span>
                </div>
                {/* env vars */}
                {agent.envVars.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-white/30 text-xs w-16 flex-shrink-0">Env keys</span>
                    <div className="flex flex-wrap gap-1">
                      {agent.envVars.map((v) => (
                        <span key={v} className="text-[10px] font-mono text-white/40 bg-white/[0.05] border border-white/[0.08] rounded px-1.5 py-0.5">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SalemPipelineSection() {
  const [statuses, setStatuses] = useState<Record<number, AgentStatus>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, "idle" as AgentStatus]))
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [leadsFound, setLeadsFound] = useState<number | null>(null);

  const runPipeline = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setLeadsFound(null);
    setStatuses(Object.fromEntries(AGENTS.map((a) => [a.id, "idle"])));

    // Simulate sequential pipeline run
    for (const agent of AGENTS) {
      setStatuses((prev) => ({ ...prev, [agent.id]: "running" }));
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
      setStatuses((prev) => ({ ...prev, [agent.id]: "done" }));
    }

    setLeadsFound(Math.floor(Math.random() * 18) + 7);
    setRunning(false);
  }, [running]);

  const resetPipeline = useCallback(() => {
    if (running) return;
    setStatuses(Object.fromEntries(AGENTS.map((a) => [a.id, "idle"])));
    setLeadsFound(null);
  }, [running]);

  const allDone = AGENTS.every((a) => statuses[a.id] === "done");

  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Salem Pipeline</span>
            </div>
            <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Lead Intelligence System
            </h1>
            <p className="text-white/40 text-sm mt-1">
              9 agents · 3 sections · fully automated prospecting pipeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            {allDone && !running && (
              <button
                onClick={resetPipeline}
                className="text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded-lg px-3 py-2"
              >
                Reset
              </button>
            )}
            <button
              onClick={runPipeline}
              disabled={running}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                running
                  ? "bg-white/[0.06] text-white/30 cursor-not-allowed border border-white/10"
                  : "bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/40"
              )}
            >
              {running ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Running…</>
              ) : (
                <><Play className="w-4 h-4" /> Run Pipeline</>
              )}
            </button>
          </div>
        </div>

        {/* Result banner */}
        <AnimatePresence>
          {leadsFound !== null && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-emerald-300 text-sm font-semibold">Pipeline complete</p>
                <p className="text-emerald-300/60 text-xs">
                  {leadsFound} gold leads assembled · Gmail drafts saved · awaiting your review in HubSpot
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections */}
        {SECTIONS.map((section, si) => {
          const sc = sectionColorMap[section.color];
          const sectionAgents = AGENTS.filter((a) => section.agents.includes(a.id));
          const doneCount = sectionAgents.filter((a) => statuses[a.id] === "done").length;

          return (
            <div key={section.label} className="space-y-3">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold uppercase tracking-widest", sc.header)}>
                    {section.label}
                  </span>
                  <span className={cn("text-[10px] border rounded-full px-2 py-0.5", sc.badge)}>
                    {doneCount}/{sectionAgents.length} done
                  </span>
                </div>
                {si < SECTIONS.length - 1 && (
                  <div className="h-px flex-1 mx-4 bg-white/[0.05]" />
                )}
              </div>

              {/* Agent grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sectionAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    status={statuses[agent.id]}
                    expanded={expandedId === agent.id}
                    onToggle={() => setExpandedId(expandedId === agent.id ? null : agent.id)}
                  />
                ))}
              </div>

              {/* Section connector arrow */}
              {si < SECTIONS.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-4 h-4 text-white/15" />
                </div>
              )}
            </div>
          );
        })}

        {/* Agent legend */}
        <div className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Agent Directory</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {AGENTS.map((a) => {
              const c = colorMap[a.color];
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />
                  <span className={cn("text-xs font-bold", c.icon)}>{a.codename}</span>
                  <span className="text-white/30 text-[10px] truncate hidden sm:block">#{a.id}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

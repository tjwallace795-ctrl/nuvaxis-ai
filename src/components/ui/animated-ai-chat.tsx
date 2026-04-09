"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Paperclip, XIcon, LoaderIcon, Command,
  TrendingUp, ArrowUp, Search, FileText, Zap,
  Mail, Users, BarChart2, Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ToolEvent {
  name: string;
  label: string;
  done: boolean;
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

export interface ChatProfile {
  businessName?: string;
  name?: string;
  industry?: string;
  niche?: string;
  location?: string;
  email?: string;
  website?: string;
  bio?: string;
  socialAccounts?: { instagram?: string; tiktok?: string; youtube?: string };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const ta = textareaRef.current;
      if (!ta) return;
      if (reset) { ta.style.height = `${minHeight}px`; return; }
      ta.style.height = `${minHeight}px`;
      ta.style.height = `${Math.max(minHeight, Math.min(ta.scrollHeight, maxHeight ?? Infinity))}px`;
    },
    [minHeight, maxHeight]
  );
  useEffect(() => { if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`; }, [minHeight]);
  return { textareaRef, adjustHeight };
}

// ── Nova logo ─────────────────────────────────────────────────────────────────

function NovaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 3L35.5 12V28L20 37L4.5 28V12L20 3Z" stroke="url(#hexGrad)" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M20 10L29 15V25L20 30L11 25V15L20 10Z" stroke="url(#hexGrad)" strokeWidth="1" fill="url(#hexFill)" opacity="0.8" />
      <circle cx="20" cy="20" r="3" fill="white" opacity="0.95" />
      <line x1="20" y1="10" x2="20" y2="17" stroke="#60a5fa" strokeWidth="1" opacity="0.7" />
      <line x1="29" y1="15" x2="23" y2="18.5" stroke="#60a5fa" strokeWidth="1" opacity="0.7" />
      <line x1="29" y1="25" x2="23" y2="21.5" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
      <line x1="20" y1="30" x2="20" y2="23" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
      <line x1="11" y1="25" x2="17" y2="21.5" stroke="#60a5fa" strokeWidth="1" opacity="0.7" />
      <line x1="11" y1="15" x2="17" y2="18.5" stroke="#60a5fa" strokeWidth="1" opacity="0.7" />
      <circle cx="20" cy="10" r="1.5" fill="#60a5fa" opacity="0.9" />
      <circle cx="29" cy="15" r="1.5" fill="#3b82f6" opacity="0.9" />
      <circle cx="29" cy="25" r="1.5" fill="#6366f1" opacity="0.9" />
      <circle cx="20" cy="30" r="1.5" fill="#818cf8" opacity="0.9" />
      <circle cx="11" cy="25" r="1.5" fill="#6366f1" opacity="0.9" />
      <circle cx="11" cy="15" r="1.5" fill="#3b82f6" opacity="0.9" />
      <defs>
        <linearGradient id="hexGrad" x1="4" y1="3" x2="36" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <radialGradient id="hexFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Tool status pill ──────────────────────────────────────────────────────────

const TOOL_ICONS: Record<string, React.ReactNode> = {
  search_web:         <Globe className="w-3 h-3" />,
  get_my_leads:       <Users className="w-3 h-3" />,
  send_email:         <Mail className="w-3 h-3" />,
  research_market:    <BarChart2 className="w-3 h-3" />,
  scan_social_trends: <TrendingUp className="w-3 h-3" />,
};

function ToolPill({ tool }: { tool: ToolEvent }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
        tool.done
          ? "bg-green-500/10 border-green-500/20 text-green-400"
          : "bg-blue-500/10 border-blue-500/20 text-blue-400"
      )}
    >
      {tool.done ? (
        <span className="text-green-400">✓</span>
      ) : (
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
          <LoaderIcon className="w-3 h-3" />
        </motion.span>
      )}
      {TOOL_ICONS[tool.name] ?? <Zap className="w-3 h-3" />}
      <span>{tool.label.replace("...", "")}</span>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface AnimatedAIChatProps {
  assistantName?: string;
  profile?: ChatProfile;
}

const CHAT_HISTORY_KEY = "nuvaxis_chat_history";
const CHAT_HISTORY_MAX = 50;

export function AnimatedAIChat({ assistantName = "Nova", profile }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [activeTools, setActiveTools] = useState<ToolEvent[]>([]);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 24, maxHeight: 200 });
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const niche = profile?.niche || profile?.industry || "your business";

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(CHAT_HISTORY_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Message[];
          if (Array.isArray(saved) && saved.length > 0) {
            setMessages(saved);
          }
        }
      }
    } catch { /* non-critical */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist messages to localStorage whenever they change (cap at 50)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const toSave = messages.slice(-CHAT_HISTORY_MAX);
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
      }
    } catch { /* non-critical */ }
  }, [messages]);

  const commandSuggestions: CommandSuggestion[] = [
    { icon: <Search className="w-4 h-4" />,    label: "Search Web",      description: "Look up anything in real-time",              prefix: "/search" },
    { icon: <TrendingUp className="w-4 h-4" />, label: "Social Trends",   description: `What's trending in ${niche}`,               prefix: "/trends" },
    { icon: <Users className="w-4 h-4" />,      label: "My Leads",        description: "Analyze and plan lead outreach",             prefix: "/leads" },
    { icon: <Mail className="w-4 h-4" />,       label: "Email Campaign",  description: "Draft emails to my leads",                   prefix: "/email" },
    { icon: <BarChart2 className="w-4 h-4" />,  label: "Market Research", description: `Deep dive on the ${niche} market`,          prefix: "/market" },
    { icon: <FileText className="w-4 h-4" />,   label: "Write Content",   description: "Captions, scripts, emails, copy",            prefix: "/write" },
  ];

  const commandStarters: Record<string, string> = {
    "/search":  "Search the web and tell me the latest on: ",
    "/trends":  `What's trending right now on social media for ${niche}? Give me viral hooks and content ideas I can post today.`,
    "/leads":   "Pull up my leads and tell me who I should reach out to first and how.",
    "/email":   "Pull up my leads with emails and draft personalized outreach emails for each of them.",
    "/market":  `Research the current market for ${niche} — pricing trends, competitor strategies, and the biggest opportunities right now.`,
    "/write":   "Write the following for me: ",
  };

  const quickPrompts = [
    { icon: <Users className="w-3.5 h-3.5" />,      label: "Who should I reach out to?",         msg: "Pull up my leads and tell me who to contact first and what to say." },
    { icon: <TrendingUp className="w-3.5 h-3.5" />, label: "What should I post today?",           msg: `Scan social trends for ${niche} and give me 3 content ideas with hooks I can post today.` },
    { icon: <Mail className="w-3.5 h-3.5" />,       label: "Email my leads",                      msg: "Pull my leads that have email addresses and draft personalized outreach emails for each." },
    { icon: <BarChart2 className="w-3.5 h-3.5" />,  label: "Research my market",                  msg: `Research the latest trends, pricing, and opportunities in the ${niche} market.` },
  ];

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const idx = commandSuggestions.findIndex((c) => c.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else {
      setShowCommandPalette(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = document.querySelector("[data-command-button]");
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(e.target as Node) && !btn?.contains(e.target as Node))
        setShowCommandPalette(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, streamingText, activeTools]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setValue("");
    adjustHeight(true);
    setIsLoading(true);
    setStreamingText("");
    setActiveTools([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          profile,
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "text") {
              accumulated += event.content;
              setStreamingText(accumulated);
            } else if (event.type === "tool_start") {
              setActiveTools((prev) => [
                ...prev.filter((t) => t.name !== event.name),
                { name: event.name, label: event.label, done: false },
              ]);
            } else if (event.type === "tool_done") {
              setActiveTools((prev) =>
                prev.map((t) => (t.name === event.name ? { ...t, done: true } : t))
              );
            } else if (event.type === "done") {
              // Commit accumulated text as assistant message
              if (accumulated.trim()) {
                setMessages((prev) => [...prev, { role: "assistant", content: accumulated.trim() }]);
              }
              setStreamingText("");
              setActiveTools([]);
            } else if (event.type === "error") {
              setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${event.message}` }]);
            }
          } catch { /* malformed line — skip */ }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
      setStreamingText("");
      setActiveTools([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion((p) => Math.min(p + 1, commandSuggestions.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion((p) => Math.max(p - 1, 0)); }
      else if (e.key === "Tab" || e.key === "Enter") { e.preventDefault(); if (activeSuggestion >= 0) selectCommand(activeSuggestion); }
      else if (e.key === "Escape") { e.preventDefault(); setShowCommandPalette(false); }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(value);
    }
  };

  const selectCommand = (index: number) => {
    const starter = commandStarters[commandSuggestions[index].prefix] ?? "";
    // If the starter is a full question (no trailing space), send it directly
    if (!starter.endsWith(" ") && !starter.endsWith(": ")) {
      setValue("");
      setShowCommandPalette(false);
      sendMessage(starter);
    } else {
      setValue(starter);
      setShowCommandPalette(false);
      setTimeout(() => adjustHeight(), 10);
    }
  };

  /** Strip dangerous tags and URLs from an HTML string before setting innerHTML. */
  const sanitizeHtml = (html: string): string =>
    html
      // Remove <script>, <iframe>, <object>, <embed> tags (with their content)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
      .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
      .replace(/<embed\b[^>]*\/?>/gi, "")
      // Strip javascript: and data: from href/src attributes
      .replace(/(href|src)\s*=\s*["']?\s*(javascript|data)\s*:/gi, "$1=\"\"");

  const renderContent = (text: string) =>
    text.split("\n").map((line, i, arr) => {
      const raw = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>');
      const html = sanitizeHtml(raw);
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
          {i < arr.length - 1 && <br />}
        </span>
      );
    });

  const showStreaming = isLoading || streamingText || activeTools.length > 0;

  return (
    <div className="flex flex-col w-full h-full bg-transparent relative">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6 space-y-4">

        {/* Empty state */}
        {messages.length === 0 && !showStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="mb-6">
              <NovaLogo size={56} />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {profile?.businessName ? `Ready to grow ${profile.businessName}` : "What can I help with?"}
            </h2>
            <p className="text-[#8e8ea0] text-sm max-w-xs leading-relaxed mb-8">
              {profile?.niche
                ? `I'm ${assistantName} — your AI for ${profile.niche}. I can access your leads, research your market, scan trends, and send emails.`
                : `I'm ${assistantName} — your AI. Ask me anything.`}
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 w-full max-w-md">
              {quickPrompts.map((p, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => sendMessage(p.msg)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/[0.08] rounded-xl text-sm text-[#ececec] transition-all text-left"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <span className="text-blue-400 flex-shrink-0">{p.icon}</span>
                  {p.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conversation */}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className={cn("flex gap-3 max-w-3xl", msg.role === "user" ? "ml-auto justify-end" : "mr-auto")}
          >
            {msg.role === "assistant" && <div className="flex-shrink-0 mt-0.5"><NovaLogo size={28} /></div>}
            <div
              className={cn(
                "text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-white/[0.08] backdrop-blur-sm text-[#ececec] px-4 py-3 rounded-3xl max-w-[75%] border border-white/[0.06]"
                  : "text-[#ececec] px-1 py-1 max-w-[90%]"
              )}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {renderContent(msg.content)}
            </div>
          </motion.div>
        ))}

        {/* Live streaming area */}
        <AnimatePresence>
          {showStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 mr-auto max-w-3xl"
            >
              <div className="flex-shrink-0 mt-0.5"><NovaLogo size={28} /></div>
              <div className="flex flex-col gap-2 max-w-[90%]">

                {/* Tool pills */}
                {activeTools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <AnimatePresence>
                      {activeTools.map((tool) => (
                        <ToolPill key={tool.name} tool={tool} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Streaming text */}
                {streamingText ? (
                  <div className="text-sm text-[#ececec] leading-relaxed px-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {renderContent(streamingText)}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-0.5 h-3.5 bg-blue-400 ml-0.5 align-middle"
                    />
                  </div>
                ) : activeTools.length === 0 ? (
                  // Generic thinking pulse when no tools and no text yet
                  <div className="flex items-center gap-2 px-1 py-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </motion.div>
                    <span className="text-sm text-[#8e8ea0]" style={{ fontFamily: "var(--font-space-grotesk)" }}>Thinking...</span>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 md:px-4 pb-4 md:pb-6 pt-2">
        <div className="max-w-3xl mx-auto">

          {/* Attachments */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div className="flex gap-2 flex-wrap mb-2 px-1" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs bg-white/[0.06] border border-white/[0.1] py-1 px-2.5 rounded-lg text-[#8e8ea0]">
                    <span>{file}</span>
                    <button onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))} className="hover:text-white"><XIcon className="w-3 h-3" /></button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Command palette */}
          <div className="relative">
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                  ref={commandPaletteRef}
                  className="absolute left-0 right-0 bottom-full mb-2 bg-black/90 backdrop-blur-xl rounded-xl z-50 shadow-xl border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                >
                  {commandSuggestions.map((s, i) => (
                    <div
                      key={s.prefix}
                      onClick={() => selectCommand(i)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors border-b border-white/[0.04] last:border-0",
                        activeSuggestion === i ? "bg-white/10 text-white" : "text-[#8e8ea0] hover:bg-white/[0.05] hover:text-[#ececec]"
                      )}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      <div className="text-blue-400">{s.icon}</div>
                      <div>
                        <div className="font-medium text-white/80">{s.label}</div>
                        <div className="text-[11px] text-white/30">{s.description}</div>
                      </div>
                      <div className="text-white/20 ml-auto font-mono text-xs">{s.prefix}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input box */}
            <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/[0.1] shadow-lg">
              <div className="px-5 pt-4 pb-2">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${assistantName}...`}
                  rows={1}
                  className="w-full bg-transparent border-none outline-none resize-none text-[#ececec] text-[16px] md:text-sm placeholder:text-[#8e8ea0] leading-relaxed"
                  style={{ fontFamily: "var(--font-space-grotesk)", overflow: "hidden", minHeight: "24px", maxHeight: "200px" }}
                />
              </div>

              <div className="px-3 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setAttachments((p) => [...p, `file-${Math.floor(Math.random() * 999)}.pdf`])}
                    className="p-2 text-[#8e8ea0] hover:text-[#ececec] hover:bg-white/[0.06] rounded-xl transition-all"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    data-command-button
                    onClick={(e) => { e.stopPropagation(); setShowCommandPalette((p) => !p); }}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      showCommandPalette ? "bg-blue-600/20 text-blue-400" : "text-[#8e8ea0] hover:text-[#ececec] hover:bg-white/[0.06]"
                    )}
                  >
                    <Command className="w-4 h-4" />
                  </button>
                </div>

                <motion.button
                  type="button"
                  onClick={() => sendMessage(value)}
                  whileTap={{ scale: 0.92 }}
                  disabled={isLoading || !value.trim()}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    value.trim() && !isLoading ? "bg-white hover:bg-white/90 text-black" : "bg-white/10 text-white/20 cursor-not-allowed"
                  )}
                >
                  {isLoading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            <p className="text-center text-[#8e8ea0] text-xs mt-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {assistantName} has access to your leads, market data, and can send emails on your behalf.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

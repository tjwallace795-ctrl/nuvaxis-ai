"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi love — I'm Ash's virtual concierge. Tell me your hair length, how long you want the style to last, or just a vibe you're going for, and I'll point you to the right service.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== GREETING),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "" },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-cream shadow-soft transition hover:scale-105"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-espresso/10">
          <div className="flex items-center justify-between bg-espresso px-4 py-3 text-cream">
            <div>
              <div className="font-display text-lg leading-tight">
                Ashbraids concierge
              </div>
              <div className="text-[11px] uppercase tracking-widest opacity-70">
                Powered by AI
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-80">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-sand/40 p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-espresso text-cream"
                      : "bg-cream text-espresso ring-1 ring-espresso/5"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-cream px-3 py-2 text-sm ring-1 ring-espresso/5">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-espresso/50 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-espresso/50 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-espresso/50" />
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-rose/20 px-3 py-2 text-xs text-cocoa">
                {error}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex gap-2 border-t border-espresso/10 bg-cream p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about styles, pricing, timing…"
              className="flex-1 rounded-full border border-espresso/15 bg-cream px-4 py-2 text-sm outline-none focus:border-caramel"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-espresso px-4 py-2 text-sm text-cream disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

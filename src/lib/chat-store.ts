/**
 * Module-level singleton chat store.
 * Lives outside the React component tree so the fetch + SSE loop survives
 * navigation away from the AI screen.
 */

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

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ToolEvent {
  name: string;
  label: string;
  done: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  streamingText: string;
  activeTools: ToolEvent[];
}

type Listener = () => void;

const CHAT_HISTORY_KEY = "nuvaxis_chat_history";
const CHAT_HISTORY_MAX = 50;

const EMPTY_STATE: ChatState = {
  messages: [],
  isLoading: false,
  streamingText: "",
  activeTools: [],
};

class ChatStore {
  private state: ChatState = { ...EMPTY_STATE };
  private listeners = new Set<Listener>();
  private storageLoaded = false;

  /** useSyncExternalStore — subscribe */
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** useSyncExternalStore — client snapshot */
  getSnapshot = (): ChatState => this.state;

  /** useSyncExternalStore — server snapshot (no localStorage) */
  getServerSnapshot = (): ChatState => EMPTY_STATE;

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private set(partial: Partial<ChatState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  /** Call once on client mount to hydrate from localStorage. */
  loadFromStorage() {
    if (this.storageLoaded) return;
    this.storageLoaded = true;
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Message[];
      if (Array.isArray(saved) && saved.length > 0) {
        this.set({ messages: saved });
      }
    } catch { /* non-critical */ }
  }

  private saveToStorage(messages: Message[]) {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(
        CHAT_HISTORY_KEY,
        JSON.stringify(messages.slice(-CHAT_HISTORY_MAX))
      );
    } catch { /* non-critical */ }
  }

  /** Send a message. Runs entirely outside React lifecycle. */
  async send(text: string, profile?: ChatProfile) {
    if (!text.trim() || this.state.isLoading) return;

    // Ask for notification permission (non-blocking, first time only)
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    const userMsg: Message = { role: "user", content: text.trim() };
    const history = [...this.state.messages, userMsg];
    this.set({ messages: history, isLoading: true, streamingText: "", activeTools: [] });
    this.saveToStorage(history);

    let accumulated = "";

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
              this.set({ streamingText: accumulated });

            } else if (event.type === "tool_start") {
              this.set({
                activeTools: [
                  ...this.state.activeTools.filter((t) => t.name !== event.name),
                  { name: event.name, label: event.label, done: false },
                ],
              });

            } else if (event.type === "tool_done") {
              this.set({
                activeTools: this.state.activeTools.map((t) =>
                  t.name === event.name ? { ...t, done: true } : t
                ),
              });

            } else if (event.type === "done") {
              const finalMessages = accumulated.trim()
                ? [...history, { role: "assistant" as const, content: accumulated.trim() }]
                : history;
              this.set({
                messages: finalMessages,
                streamingText: "",
                activeTools: [],
                isLoading: false,
              });
              this.saveToStorage(finalMessages);

              // Fire a browser notification if the user has navigated away
              if (
                accumulated.trim() &&
                typeof window !== "undefined" &&
                "Notification" in window &&
                Notification.permission === "granted" &&
                document.visibilityState === "hidden"
              ) {
                const firstLine = accumulated
                  .trim()
                  .split("\n")[0]
                  .replace(/\*\*/g, "")
                  .slice(0, 100);
                new Notification("Nova finished", {
                  body: firstLine,
                  icon: "/favicon.ico",
                });
              }
              return;

            } else if (event.type === "error") {
              const finalMessages = [
                ...history,
                { role: "assistant" as const, content: `⚠️ ${event.message}` },
              ];
              this.set({
                messages: finalMessages,
                streamingText: "",
                activeTools: [],
                isLoading: false,
              });
              this.saveToStorage(finalMessages);
              return;
            }
          } catch { /* malformed SSE line — skip */ }
        }
      }
    } catch {
      const finalMessages = [
        ...history,
        { role: "assistant" as const, content: "Connection error. Please try again." },
      ];
      this.set({ messages: finalMessages, streamingText: "", activeTools: [] });
      this.saveToStorage(finalMessages);
    } finally {
      // Ensure isLoading is always cleared even on unexpected exits
      if (this.state.isLoading) {
        this.set({ isLoading: false });
      }
    }
  }
}

export const chatStore = new ChatStore();

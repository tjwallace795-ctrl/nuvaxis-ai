/**
 * LeadStore — module-level singleton that survives React unmounts.
 * The fetch lives here so navigating away from the Leads tab never cancels it.
 */
import { useSyncExternalStore } from "react";

// ── Domain types ───────────────────────────────────────────────────────────────

export type LeadStatus = "Hot" | "Warm" | "Cold";

export interface IndividualLead {
  id: string;
  // Identity
  name: string;
  handle: string | null;
  avatarUrl: string | null;   // Profile picture URL (null → show initials)
  location: string;
  leadType: "B2C" | "B2B";
  // Primary contact
  phone: string | null;
  email: string | null;
  profileUrl: string | null;  // Link to their post or profile
  outreachChannel: string;
  // Social profiles
  instagram: string | null;   // "@handle" or full URL
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  reddit: string | null;
  tiktok: string | null;
  // Where & what
  source: string;
  intentSignal: string;
  postedAt: string | null;
  // Scoring
  status: LeadStatus;
  intentScore: number;
  urgencyScore: number;
  // Outreach
  whyTheyNeedYou: string;
  suggestedFirstMessage: string;
}

export interface LeadQuery {
  businessType: string;
  targetCustomer: string;
  offer: string;
  market: string;
  intentSignals: string[];
  leadType: "B2C" | "B2B" | "Both";
  keywords: string; // e.g. "looking to buy, need ASAP, budget $500k"
}

export interface LeadState {
  leads: IndividualLead[];
  loading: boolean;
  error: string;
  lastSearch: LeadQuery | null;
  lastRun: Date | null;
  newLeadCount: number;
}

type Listener = () => void;

const DEFAULT_STATE: LeadState = {
  leads: [],
  loading: false,
  error: "",
  lastSearch: null,
  lastRun: null,
  newLeadCount: 0,
};

let state: LeadState = { ...DEFAULT_STATE };
const listeners = new Set<Listener>();
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function emit() { listeners.forEach((l) => l()); }
function setState(patch: Partial<LeadState>) { state = { ...state, ...patch }; emit(); }

const LEADS_KEY = "nuvaxis_leads";

function saveLeadsToStorage(leads: IndividualLead[], lastSearch: LeadQuery | null) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LEADS_KEY, JSON.stringify({ leads, lastSearch }));
    }
  } catch { /* non-critical */ }
}

export const leadStore = {
  subscribe(cb: Listener) { listeners.add(cb); return () => listeners.delete(cb); },
  getSnapshot(): LeadState { return state; },

  async search(query: LeadQuery, onComplete?: (leads: IndividualLead[]) => void) {
    if (!query.businessType.trim() || !query.market.trim()) return;
    setState({ loading: true, error: "", leads: [], lastSearch: query });
    if (refreshTimer) clearTimeout(refreshTimer);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const data = await res.json();
      if (data.error) { setState({ loading: false, error: data.error }); return; }
      const leads: IndividualLead[] = data.leads ?? [];
      setState({ loading: false, leads, lastRun: new Date(), newLeadCount: state.newLeadCount + leads.length, error: "" });

      // Persist leads to localStorage
      saveLeadsToStorage(leads, query);

      onComplete?.(leads);

      // Sync to server-side cache so Nova (AI assistant) can access the leads
      fetch("/api/leads/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads,
          businessType: query.businessType,
          market: query.market,
        }),
      }).catch(() => { /* non-critical */ });

      leadStore.scheduleRefresh(onComplete);
    } catch (e) {
      setState({ loading: false, error: e instanceof Error ? e.message : "Network error" });
    }
  },

  scheduleRefresh(onComplete?: (leads: IndividualLead[]) => void) {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      const s = state.lastSearch;
      if (s) leadStore.search(s, onComplete);
    }, 10 * 60 * 1000);
  },

  clearNewLeadCount() { setState({ newLeadCount: 0 }); },

  loadFromStorage() {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(LEADS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { leads: IndividualLead[]; lastSearch: LeadQuery | null };
      if (!parsed.leads?.length) return;
      setState({ leads: parsed.leads, lastSearch: parsed.lastSearch, lastRun: new Date() });
      // Rehydrate server-side cache so Nova can see the leads immediately
      const q = parsed.lastSearch;
      fetch("/api/leads/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: parsed.leads,
          businessType: q?.businessType ?? "",
          market: q?.market ?? "",
        }),
      }).catch(() => { /* non-critical */ });
    } catch { /* non-critical */ }
  },

  reset() {
    if (refreshTimer) clearTimeout(refreshTimer);
    state = { ...DEFAULT_STATE };
    emit();
  },
};

export function useLeadStore(): LeadState {
  return useSyncExternalStore(leadStore.subscribe, leadStore.getSnapshot, leadStore.getSnapshot);
}

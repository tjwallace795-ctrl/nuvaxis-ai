/**
 * Server-side lead cache — module-level singleton that persists across API requests
 * in the same Node.js process. Updated whenever leads are generated; read by the AI assistant.
 */

export interface CachedLead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string;
  leadType: "B2C" | "B2B";
  source: string;
  status: "Hot" | "Warm" | "Cold";
  intentScore: number;
  urgencyScore: number;
  intentSignal: string;
  whyTheyNeedYou: string;
  suggestedFirstMessage: string;
  outreachChannel: string;
  profileUrl: string | null;
  instagram: string | null;
  twitter: string | null;
}

interface LeadCacheEntry {
  leads: CachedLead[];
  updatedAt: number;
  businessType: string;
  market: string;
}

// Global singleton — survives across requests
const cache: LeadCacheEntry = {
  leads: [],
  updatedAt: 0,
  businessType: "",
  market: "",
};

export function setLeadCache(leads: CachedLead[], businessType: string, market: string) {
  cache.leads = leads;
  cache.updatedAt = Date.now();
  cache.businessType = businessType;
  cache.market = market;
}

export function getLeadCache(): LeadCacheEntry {
  return cache;
}

export function getLeadCount(): number {
  return cache.leads.length;
}

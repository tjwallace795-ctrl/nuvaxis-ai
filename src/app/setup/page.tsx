"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import { ArrowRight, Loader2, Zap, Building2, Target, Briefcase, Globe, Share2, MapPin, CheckCircle2 } from "lucide-react";

const INDUSTRIES = [
  "Real Estate", "E-Commerce", "Restaurant / Food", "Fitness & Wellness",
  "Healthcare", "Legal", "Finance", "Marketing Agency", "Coaching / Consulting",
  "Beauty & Salon", "Automotive", "Construction", "Tech / SaaS", "Retail",
  "Non-Profit", "Education", "Other",
];

const GOALS = [
  "Generate more leads", "Grow on social media", "Automate my marketing",
  "Send emails to customers", "Understand my market", "Build my brand online",
  "All of the above",
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Required fields
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");

  // Optional fields
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [botName, setBotName] = useState("Nova");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  // Check if user is logged in
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  const steps = [
    { id: "intro",    label: "Welcome" },
    { id: "required", label: "Your Info" },
    { id: "optional", label: "Details" },
    { id: "bot",      label: "Your AI" },
    { id: "done",     label: "Launch" },
  ];

  async function handleFinish() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          industry: industry || "Business",
          niche: industry || "Business",
          location,
          website,
          botName: botName || "Nova",
          goal: goal === "Other" ? customGoal : goal,
          setupComplete: true,
          socialAccounts: { instagram, tiktok, youtube },
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  const canProceedStep1 = name.trim().length > 0 && businessName.trim().length > 0 && (goal !== "" && (goal !== "Other" || customGoal.trim().length > 0));

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicParallaxBg head="" text="" />
      </div>
      <div className="fixed inset-0 z-[1] bg-black/40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg py-12">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-blue-500" : i < step ? "w-4 bg-blue-500/50" : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0 — Welcome */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                <Zap className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  Welcome to Nuvaxis AI
                </h1>
                <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
                  Let&apos;s set up your AI workspace in 2 minutes. Your personal growth agent will be ready to start working for your business immediately.
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all"
              >
                Let&apos;s go <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-white/20 text-xs">Only 3 required fields · Takes under 2 minutes</p>
            </motion.div>
          )}

          {/* STEP 1 — Required Info */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">Tell us about yourself</h2>
                    <p className="text-white/30 text-xs">These 3 fields power everything Nova does for you</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      Your Name <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Johnson"
                      autoFocus
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      Business Name <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Marcus Realty Group"
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      What are you trying to accomplish? <span className="text-blue-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {GOALS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGoal(g)}
                          className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all border ${
                            goal === g
                              ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                              : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/20"
                          }`}
                        >
                          <Target className="w-3 h-3 inline mr-1.5 opacity-70" />
                          {g}
                        </button>
                      ))}
                    </div>
                    {goal === "Other" && (
                      <textarea
                        value={customGoal} onChange={(e) => setCustomGoal(e.target.value)}
                        placeholder="Describe what you're trying to accomplish..."
                        rows={2}
                        className="mt-2 w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Optional Details */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">A little more detail</h2>
                    <p className="text-white/30 text-xs">Optional — skip anything that doesn&apos;t apply</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Industry / Occupation</label>
                    <select
                      value={industry} onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      <option value="" className="bg-[#010818]">Select your industry…</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#010818]">{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      <MapPin className="w-3 h-3 inline mr-1 opacity-60" />Location
                    </label>
                    <input
                      type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Miami, FL"
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      <Globe className="w-3 h-3 inline mr-1 opacity-60" />Website
                    </label>
                    <input
                      type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                      placeholder="yourbusiness.com"
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      <Share2 className="w-3 h-3 inline mr-1 opacity-60" />Social Accounts
                    </label>
                    <div className="space-y-2">
                      {[
                        { label: "@Instagram", value: instagram, set: setInstagram, placeholder: "yourhandle" },
                        { label: "@TikTok", value: tiktok, set: setTiktok, placeholder: "yourhandle" },
                        { label: "YouTube", value: youtube, set: setYoutube, placeholder: "channel name or URL" },
                      ].map(({ label, value, set, placeholder }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-white/30 text-xs w-20 flex-shrink-0">{label}</span>
                          <input
                            type="text" value={value} onChange={(e) => set(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 text-sm transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Name your bot */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">Meet your AI agent</h2>
                    <p className="text-white/30 text-xs">Give your AI a name — or keep the default</p>
                  </div>
                </div>

                {/* Live bot preview */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-300 text-xs font-semibold mb-1">{botName || "Nova"}</p>
                      <div className="bg-white/[0.05] rounded-xl rounded-tl-none px-4 py-3">
                        <p className="text-white/80 text-sm leading-relaxed">
                          Hey {name || "there"}! 👋 I&apos;m <strong>{botName || "Nova"}</strong>, your AI growth agent for{" "}
                          <strong>{businessName || "your business"}</strong>. I can research your market, find leads, scan social trends, and send emails — all on your behalf. What do you want to tackle first?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">AI Agent Name</label>
                  <input
                    type="text" value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Nova"
                    maxLength={20}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <p className="text-white/20 text-xs mt-1.5">Default is Nova — you can change it anytime in Settings</p>
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-4 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 text-sm transition-all">
                    Back
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-900/30"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Launching…</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" />Launch My Workspace</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

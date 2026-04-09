"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Zap, MapPin } from "lucide-react";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer-section";

const features = [
  { icon: Target, title: "Hyper-Local Targeting", desc: "We surface customers who are actively searching for your service in your area — not random traffic." },
  { icon: Zap, title: "AI Working 24/7", desc: "Our AI scans social signals, search intent, and local data around the clock to surface hot leads." },
  { icon: Users, title: "B2C & B2B Ready", desc: "Whether you target local homeowners or local businesses, our system adapts to your customer type." },
  { icon: MapPin, title: "Local & Nationwide", desc: "Start local in El Paso or expand nationwide. The system scales with your ambitions." },
];

const steps = [
  { num: "01", title: "Define Your Ideal Customer", desc: "We learn who you want to reach — their location, intent signals, and what problem you solve for them." },
  { num: "02", title: "AI Builds Your Lead Pipeline", desc: "Our AI scans platforms and local signals to identify people who need your service right now." },
  { num: "03", title: "You Receive Qualified Leads", desc: "Hot leads delivered to your dashboard with contact info, intent scores, and suggested outreach messages." },
];

const leads = [
  { name: "Sarah M.", signal: "Looking for auto detailing", score: 92, status: "Hot", channel: "Instagram" },
  { name: "Carlos R.", signal: "Searching for web design help", score: 85, status: "Hot", channel: "Google" },
  { name: "Mike T.", signal: "Asked for restaurant recs", score: 71, status: "Warm", channel: "TikTok" },
  { name: "Ana L.", signal: "Mentioned needing a new site", score: 68, status: "Warm", channel: "Facebook" },
];

export default function LeadGenerationPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #a1620040 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Lead Generation</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-5 leading-tight">
              New customers.<br />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">On autopilot.</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              AI working in the background 24/7 to find and surface your next customers — locally and beyond. Stop chasing leads and let them come to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/#contact" className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-7 py-3.5 rounded-full transition-all">
                Get a Free Demo <ArrowRight size={17} />
              </a>
              <a href="/#pricing" className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-full transition-colors">
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Lead Dashboard Mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-yellow-900/20">
              {/* Header */}
              <div className="bg-neutral-900 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <p className="text-white font-semibold text-sm">Lead Dashboard</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">AI Running</span>
                </div>
              </div>
              {/* Stats */}
              <div className="bg-neutral-950 grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
                {[{ val: "24", label: "New Today" }, { val: "87", label: "This Week" }, { val: "94%", label: "Accuracy" }].map((s, i) => (
                  <div key={i} className="py-3 text-center">
                    <p className="text-white font-bold text-lg">{s.val}</p>
                    <p className="text-gray-500 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Lead cards */}
              <div className="bg-neutral-950 divide-y divide-white/5">
                {leads.map((lead, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500/40 to-orange-500/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {lead.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{lead.name}</p>
                      <p className="text-gray-500 text-xs truncate">{lead.signal}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lead.status === "Hot" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>{lead.status}</span>
                      <span className="text-white font-bold text-sm">{lead.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How we find your customers</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">Real people who are actively looking for what you offer.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                    <p className="text-gray-400 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The process</h2>
          </motion.div>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start bg-neutral-900/40 border border-white/8 rounded-2xl p-5">
                <span className="text-yellow-400 font-bold text-lg flex-shrink-0">{s.num}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/10 border border-yellow-500/20 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Start getting leads today</h2>
            <p className="text-gray-400 mb-7 text-sm">We'll run a free lead scan for your business to show you what's out there.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-full transition-all">
              Get My Free Lead Scan <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
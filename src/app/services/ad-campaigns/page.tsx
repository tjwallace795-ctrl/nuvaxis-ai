"use client";

import { motion } from "framer-motion";
import { ArrowRight, Megaphone, DollarSign, BarChart2, Target } from "lucide-react";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer-section";

const features = [
  { icon: Target, title: "Laser-Targeted Ads", desc: "We target your exact customer — by age, location, interest, and behavior — so no budget is wasted." },
  { icon: DollarSign, title: "Maximum ROI", desc: "Every campaign is optimized for conversions, not just clicks. We track what actually makes you money." },
  { icon: Megaphone, title: "All Major Platforms", desc: "Facebook, Instagram, TikTok, and YouTube — we run ads wherever your customers scroll." },
  { icon: BarChart2, title: "Full Reporting", desc: "Weekly performance reports with plain-English summaries. No confusing dashboards, just results." },
];

const steps = [
  { num: "01", title: "Strategy & Setup", desc: "We research your market, build your audiences, and create ad creatives tailored to your brand." },
  { num: "02", title: "Launch & Test", desc: "We run A/B tests on copy, visuals, and audiences to quickly find what performs best." },
  { num: "03", title: "Scale What Works", desc: "Once we find winners, we scale budget into them and cut what doesn't work — maximizing your ROI." },
];

const platforms = [
  { name: "Facebook", spend: "$420", leads: "38", cpl: "$11.05", color: "from-blue-600/20 to-blue-900/5", border: "border-blue-500/20", textColor: "text-blue-400" },
  { name: "Instagram", spend: "$380", leads: "44", cpl: "$8.63", color: "from-pink-500/20 to-pink-900/5", border: "border-pink-500/20", textColor: "text-pink-400" },
  { name: "TikTok", spend: "$290", leads: "61", cpl: "$4.75", color: "from-red-500/20 to-red-900/5", border: "border-red-500/20", textColor: "text-red-400" },
];

const bars = [65, 80, 55, 90, 72, 88, 95];

export default function AdCampaignsPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #c2410c40 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Ad Campaign Management</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-5 leading-tight">
              Your brand<br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">in front of everyone.</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              We build and manage Facebook, Instagram, TikTok, and YouTube ad campaigns that drive real results — not vanity metrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/#contact" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-full transition-all">
                Get a Free Demo <ArrowRight size={17} />
              </a>
              <a href="/#pricing" className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-full transition-colors">
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Ad Dashboard Mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-orange-900/20">
              {/* Header */}
              <div className="bg-neutral-900 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <p className="text-white font-semibold text-sm">Campaign Overview</p>
                <span className="text-gray-400 text-xs">Last 30 days</span>
              </div>
              {/* Chart */}
              <div className="bg-neutral-950 px-4 pt-4 pb-2">
                <div className="flex items-end gap-1.5 h-20">
                  {bars.map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                      className="flex-1 bg-gradient-to-t from-orange-600/80 to-orange-400/40 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-gray-600 text-xs mt-1.5">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
                </div>
              </div>
              {/* Summary stats */}
              <div className="bg-neutral-900/60 px-4 py-3 grid grid-cols-3 gap-2 border-t border-white/5 border-b border-white/5">
                {[{ val: "$1,090", label: "Total Spend" }, { val: "143", label: "Total Leads" }, { val: "$7.62", label: "Avg. CPL" }].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-white font-bold text-sm">{s.val}</p>
                    <p className="text-gray-500 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Platform breakdown */}
              <div className="bg-neutral-950 divide-y divide-white/5">
                {platforms.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center justify-between px-4 py-2.5">
                    <span className={`text-sm font-medium ${p.textColor}`}>{p.name}</span>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>{p.spend} spent</span>
                      <span className="text-white font-medium">{p.leads} leads</span>
                      <span className="text-green-400">{p.cpl}/lead</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Why our ads perform</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">We don't just run ads. We build systems that consistently generate revenue.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-orange-400" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How we run your campaigns</h2>
          </motion.div>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start bg-neutral-900/40 border border-white/8 rounded-2xl p-5">
                <span className="text-orange-400 font-bold text-lg flex-shrink-0">{s.num}</span>
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
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-900/10 border border-orange-500/20 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to run ads that actually convert?</h2>
            <p className="text-gray-400 mb-7 text-sm">We'll audit your current ad presence for free and show you what's being left on the table.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all">
              Get My Free Audit <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
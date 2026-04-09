"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Video, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer-section";

const features = [
  { icon: Sparkles, title: "AI-Generated Content", desc: "We use AI to ideate, script, and produce content strategies tailored to your brand every month." },
  { icon: Video, title: "TikTok, Instagram & YouTube", desc: "Short-form video content built for the platforms where your customers spend their time." },
  { icon: TrendingUp, title: "Trend-Based Strategy", desc: "We track what's trending in your niche and plug your business into viral moments." },
  { icon: Users, title: "Real Audience Growth", desc: "Not bots. Real followers who become real customers — locally and nationwide." },
];

const steps = [
  { num: "01", title: "Brand & Audience Audit", desc: "We review your current presence, competitors, and identify what content will resonate most with your target customer." },
  { num: "02", title: "Monthly Content Plan", desc: "We deliver a custom content calendar — scripts, captions, hashtags, and posting schedule included." },
  { num: "03", title: "You Post, We Optimize", desc: "We track performance and refine the strategy monthly to keep your growth compounding." },
];

const posts = [
  { platform: "TikTok", views: "24.6K", likes: "3.2K", color: "from-pink-500/20 to-pink-900/5", border: "border-pink-500/20", label: "@yourbusiness" },
  { platform: "Instagram", views: "8.1K", likes: "1.4K", color: "from-purple-500/20 to-purple-900/5", border: "border-purple-500/20", label: "@yourbusiness" },
  { platform: "YouTube", views: "41K", likes: "5.8K", color: "from-red-500/20 to-red-900/5", border: "border-red-500/20", label: "YourBusiness" },
];

export default function SocialMediaContentPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #be185d40 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <span className="text-pink-400 text-sm font-semibold uppercase tracking-widest">Social Media Content</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-5 leading-tight">
              Go viral.<br />
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">Grow your audience.</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              AI-generated content strategy for TikTok, Instagram, and YouTube Shorts. We build your presence on the platforms where your customers actually are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/#contact" className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-7 py-3.5 rounded-full transition-all">
                Get a Free Demo <ArrowRight size={17} />
              </a>
              <a href="/#pricing" className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-full transition-colors">
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Social Mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full max-w-sm mx-auto space-y-3">
            {posts.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
                className={`bg-gradient-to-br ${post.color} border ${post.border} rounded-2xl p-4 flex items-center gap-4`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${post.color} border ${post.border} flex items-center justify-center flex-shrink-0`}>
                  <Video size={22} className="text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{post.platform}</span>
                    <span className="text-gray-400 text-xs">{post.label}</span>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-white font-bold text-sm">{post.views}</p>
                      <p className="text-gray-500 text-xs">views</p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{post.likes}</p>
                      <p className="text-gray-500 text-xs">likes</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs">+{(i + 1) * 14}%</span>
                </div>
              </motion.div>
            ))}
            {/* Total reach */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Monthly Reach</p>
              <p className="text-white font-bold text-2xl">73.7K</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-green-400 text-xs">+38% this month</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What's included</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">A complete social media engine built for your business.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-pink-400" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How it works</h2>
          </motion.div>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start bg-neutral-900/40 border border-white/8 rounded-2xl p-5">
                <span className="text-pink-400 font-bold text-lg flex-shrink-0">{s.num}</span>
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
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/10 border border-pink-500/20 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to grow your audience?</h2>
            <p className="text-gray-400 mb-7 text-sm">We'll build your first month's content plan for free — no commitment.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-full transition-all">
              Start Growing <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
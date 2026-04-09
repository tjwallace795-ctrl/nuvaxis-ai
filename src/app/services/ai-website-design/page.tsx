"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Globe, Zap, Palette, BarChart2 } from "lucide-react";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer-section";

const features = [
  { icon: Zap, title: "Launches in 7 Days", desc: "From discovery call to live site — fast. No waiting months for a developer." },
  { icon: Palette, title: "Custom Branding", desc: "Every pixel matched to your brand. Colors, fonts, imagery — all tailored to you." },
  { icon: Globe, title: "SEO-Ready from Day One", desc: "Built with search engines in mind so local customers find you first." },
  { icon: BarChart2, title: "Conversion-Optimized", desc: "Every section is designed to turn visitors into leads, bookings, or orders." },
];

const steps = [
  { num: "01", title: "Discovery Call", desc: "We learn your business, goals, and competitors in a free 30-min session." },
  { num: "02", title: "Design & Build", desc: "We design and develop your site using AI-powered tools in as little as 7 days." },
  { num: "03", title: "Review & Launch", desc: "You review the site, we refine it, then we go live. Simple." },
];

export default function AIWebsiteDesignPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #1d4ed840 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">AI Website Design</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-5 leading-tight">
              Websites that work<br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">as hard as you do</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              We build blazing-fast, AI-powered websites tailored for local businesses. Modern design, mobile-first, and built to convert visitors into paying customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/#contact" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-full transition-all">
                Get a Free Demo <ArrowRight size={17} />
              </a>
              <a href="/#pricing" className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-full transition-colors">
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Browser Mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full max-w-lg">
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-900/20">
              {/* Browser Chrome */}
              <div className="bg-neutral-900 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-neutral-800 rounded-full px-3 py-1 text-gray-500 text-xs text-center">yoursite.com</div>
              </div>
              {/* Fake Website Content */}
              <div className="bg-gradient-to-b from-neutral-950 to-black p-6 space-y-4">
                {/* Nav bar */}
                <div className="flex items-center justify-between">
                  <div className="w-20 h-4 bg-blue-600/60 rounded-full" />
                  <div className="flex gap-3">
                    <div className="w-10 h-2.5 bg-white/20 rounded-full" />
                    <div className="w-10 h-2.5 bg-white/20 rounded-full" />
                    <div className="w-14 h-2.5 bg-blue-500/50 rounded-full" />
                  </div>
                </div>
                {/* Hero area */}
                <div className="text-center py-6 space-y-3">
                  <div className="w-48 h-5 bg-white/70 rounded-full mx-auto" />
                  <div className="w-64 h-3 bg-white/30 rounded-full mx-auto" />
                  <div className="w-56 h-3 bg-white/20 rounded-full mx-auto" />
                  <div className="flex gap-3 justify-center mt-3">
                    <div className="w-24 h-8 bg-blue-600/80 rounded-full" />
                    <div className="w-24 h-8 border border-white/30 rounded-full" />
                  </div>
                </div>
                {/* Cards row */}
                <div className="grid grid-cols-3 gap-3">
                  {["from-blue-500/20 to-blue-900/10", "from-purple-500/20 to-purple-900/10", "from-green-500/20 to-green-900/10"].map((grad, i) => (
                    <div key={i} className={`bg-gradient-to-b ${grad} border border-white/10 rounded-xl p-3 space-y-2`}>
                      <div className="w-6 h-6 rounded-lg bg-white/20" />
                      <div className="w-full h-2 bg-white/30 rounded" />
                      <div className="w-3/4 h-2 bg-white/15 rounded" />
                    </div>
                  ))}
                </div>
                {/* Stats row */}
                <div className="flex justify-between px-2">
                  {["4.9★", "200+", "7 Days"].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-white/80 text-sm font-bold">{stat}</div>
                      <div className="w-12 h-1.5 bg-white/10 rounded mt-1 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What you get</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">Every website we build comes with these built-in advantages.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-blue-400" />
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
                <span className="text-blue-500 font-bold text-lg flex-shrink-0">{s.num}</span>
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
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Ready for a website that converts?</h2>
            <p className="text-gray-400 mb-7 text-sm">We build a free sample page for your business before you pay a dime.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all">
              Get My Free Demo <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
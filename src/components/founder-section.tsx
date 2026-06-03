"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Globe, Bot, Megaphone, TrendingUp } from "lucide-react";

const specialties = [
  { icon: Globe, label: "AI Website Design", desc: "Modern sites that convert visitors into customers" },
  { icon: Bot, label: "AI Chatbots & Automation", desc: "24/7 assistants that answer, book, and sell" },
  { icon: Megaphone, label: "Ad Campaign Management", desc: "Facebook, Instagram, TikTok & YouTube ads" },
  { icon: TrendingUp, label: "Digital Growth Strategy", desc: "SEO, content, and lead generation systems" },
];

export default function FounderSection() {
  return (
    <section id="about" className="relative py-20 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              {/* Gradient glow behind photo */}
              <div
                className="absolute -inset-6 rounded-full opacity-40 blur-2xl"
                style={{
                  background:
                    "conic-gradient(from 0deg, #38bdf8, #3b82f6, #a855f7, #d946ef, #38bdf8)",
                }}
              />
              {/* Gradient ring */}
              <div
                className="absolute -inset-1.5 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #38bdf8, #3b82f6, #a855f7, #d946ef, #38bdf8)",
                }}
              />
              <Image
                src="/tiquan-wallace.jpg"
                alt="Tiquan Wallace — Founder of Nuvaxis AI"
                width={340}
                height={340}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-[#0d0620]"
              />
            </div>
          </motion.div>

          {/* What I do */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
              Meet the Founder
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-2">
              Tiquan Wallace
            </h2>
            <p className="text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold mb-6">
              Founder &amp; Lead AI Engineer, Nuvaxis AI
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
              I help local businesses compete at the highest level with
              AI-powered websites, smart chatbots, and automated growth systems.
              Every project is built hands-on, tailored to your business, and
              designed to win you customers while you focus on what you do best.
            </p>

            {/* Specialties */}
            <div className="grid sm:grid-cols-2 gap-4 mb-9">
              {specialties.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:border-purple-400/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/25 to-purple-500/25 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                    <item.icon size={17} className="text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">
                      {item.label}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all text-white font-semibold px-7 py-3.5 rounded-full text-sm md:text-base shadow-lg shadow-purple-900/40"
            >
              Work With Me
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

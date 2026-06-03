"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Purple glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7c3aed50 0%, #3b82f620 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 pt-24 md:pt-20">

        {/* Founder intro — circle photo + what I do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-4 md:gap-5 mb-8 md:mb-10"
        >
          {/* Circular headshot with gradient ring */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute -inset-1 rounded-full opacity-80"
              style={{
                background: "conic-gradient(from 0deg, #38bdf8, #3b82f6, #a855f7, #d946ef, #38bdf8)",
              }}
            />
            <Image
              src="/tiquan-wallace.jpg"
              alt="Tiquan Wallace — Founder of Nuvaxis AI"
              width={96}
              height={96}
              priority
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-[#0d0620]"
            />
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0d0620]" />
          </div>

          {/* What I do */}
          <div className="text-left">
            <p className="text-white font-semibold text-base md:text-lg leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Tiquan Wallace
            </p>
            <p className="text-purple-400 text-xs md:text-sm font-medium mb-1">
              Founder, Nuvaxis AI
            </p>
            <p className="text-gray-300 text-xs md:text-sm max-w-[280px] md:max-w-xs leading-snug">
              I build AI websites, chatbots &amp; automation that win customers for local businesses.
            </p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-4 md:mb-6"
        >
          Your Business,{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Powered by AI
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white text-sm md:text-xl max-w-2xl mx-auto mb-7 md:mb-10 leading-relaxed"
        >
          Custom AI websites, 24/7 chatbots, online ordering, and ad campaigns
          — everything your business needs to compete at the highest level,
          built and managed for you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base shadow-lg shadow-purple-900/40"
          >
            Contact Us Now
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#pricing"
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors text-white font-medium px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base"
          >
            See Pricing
          </a>
        </motion.div>

      </div>

      {/* Bottom fade — blends into the cosmic bg below */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </section>
  );
}

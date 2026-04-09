"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Blue glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #1d4ed860 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />


      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-4 md:mb-6"
        >
          We Build{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          Businesses
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto mb-7 md:mb-10 leading-relaxed"
        >
          Nuvaxis AI helps local businesses compete at the highest level with
          cutting-edge AI websites, smart automation, and digital growth tools
          built for 2026 and beyond.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/signup"
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base shadow-lg shadow-blue-900/40"
          >
            Get Started Free
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors text-white font-medium px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base"
          >
            How It Works
          </a>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${color} border-2 border-black`}
                  />
                )
              )}
            </div>
            <span>Trusted by local businesses</span>
          </div>
          <span className="hidden sm:block text-gray-700">|</span>
          <span>Launch in as little as 7 days</span>
          <span className="hidden sm:block text-gray-700">|</span>
          <span>No tech knowledge required</span>
        </motion.div>
      </div>

      {/* Bottom fade — blends into the cosmic bg below */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </section>
  );
}

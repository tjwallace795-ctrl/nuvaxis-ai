"use client";

import { motion } from "framer-motion";
import { Sparkles } from "@/components/ui/sparkles";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Sparkles background */}
      <Sparkles
        density={600}
        speed={0.8}
        color="#FFFFFF"
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(60%_60%,white,transparent_85%)]"
      />

      {/* Blue glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #1d4ed860 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8"
        >
          <Zap size={13} className="text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">
            AI-Powered Digital Agency — El Paso, TX
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
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
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
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
            href="#pricing"
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold px-8 py-4 rounded-full text-base shadow-lg shadow-blue-900/40"
          >
            See Our Plans
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors text-white font-medium px-8 py-4 rounded-full text-base"
          >
            How It Works
          </a>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

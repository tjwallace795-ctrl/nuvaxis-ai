"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Globe, Bot, Megaphone, TrendingUp } from "lucide-react";

const specialties = [
  { icon: Globe, label: "AI-Integrated Websites", desc: "High-converting sites built with AI at the core" },
  { icon: Megaphone, label: "Ad Campaigns", desc: "Targeted campaigns that generate qualified leads" },
  { icon: Bot, label: "AI Chatbots", desc: "24/7 assistants that answer, book, and sell" },
  { icon: TrendingUp, label: "Lead Generation", desc: "Systems that turn clicks into paying clients" },
];

export default function FounderSection() {
  return (
    <section id="about" className="relative py-20 md:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/tiquan-wallace.jpg"
            alt="Tiquan Wallace, Founder of Nuvaxis AI"
            width={340}
            height={340}
            className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover shadow-2xl shadow-black/50"
          />
        </motion.div>

        {/* Name + what I do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-[0.2em]">
            Meet the Founder
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-2">
            Tiquan Wallace
          </h2>
          <p className="text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold mb-6">
            Founder &amp; Lead AI Engineer, Nuvaxis AI
          </p>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            I build websites with AI integration and run ad campaigns that
            generate real leads for my clients. Every project is built hands-on,
            tailored to your business, and designed to win you customers while
            you focus on what you do best.
          </p>

          {/* Specialties */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
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
                  <p className="text-slate-400 text-xs mt-1 leading-snug">
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
    </section>
  );
}

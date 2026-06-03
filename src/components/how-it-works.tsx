"use client";

import { motion } from "framer-motion";
import { MessageSquare, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Free Discovery Call",
    description:
      "We sit down with you (in person or virtually), learn about your business, your goals, and what's holding you back. No pressure, no tech jargon.",
    color: "text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/10",
  },
  {
    number: "02",
    icon: Rocket,
    title: "We Build & Launch",
    description:
      "Our team will have your website up and running in 3 days. You review, we refine, and we launch fast.",
    color: "text-purple-400",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Grow & Scale",
    description:
      "With your new digital presence live, we help you grow through AI automation, social content, and ad campaigns that bring real results.",
    color: "text-green-400",
    border: "border-green-500/30",
    glow: "shadow-green-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-36 px-4 sm:px-6 relative">
      {/* Subtle divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-28"
        >
          <span className="text-blue-500 text-sm md:text-base font-semibold uppercase tracking-widest">
            The Process
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-5">
            Simple. Fast. Powerful.
          </h2>
          <p className="text-white/70 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Getting started with Nuvaxis AI is easier than you think. Three
            steps to transform your business.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-[16.66%] right-[16.66%] h-[2px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-green-500/40" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-14">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div
                    className={`relative w-24 h-24 rounded-full bg-neutral-900 border-2 ${step.border} shadow-2xl flex items-center justify-center mb-8 z-10`}
                  >
                    <Icon size={38} className={step.color} />
                    <span
                      className={`absolute -top-3 -right-3 text-sm font-bold ${step.color} bg-black border-2 ${step.border} rounded-full w-9 h-9 flex items-center justify-center`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-2xl md:text-3xl mb-3 md:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

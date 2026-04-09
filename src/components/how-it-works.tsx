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
      "Our team will have your website up and running in 3 days. You review, we refine, and we launch — fast.",
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
    <section id="how-it-works" className="py-16 md:py-28 px-4 sm:px-6 relative">
      {/* Subtle divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">
            The Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
            Simple. Fast. Powerful.
          </h2>
          <p className="text-white text-sm md:text-lg max-w-xl mx-auto">
            Getting started with Nuvaxis AI is easier than you think. Three
            steps to transform your business.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-10 gap-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div
                    className={`relative w-16 h-16 rounded-full bg-neutral-900 border ${step.border} shadow-xl ${step.glow} flex items-center justify-center mb-6 z-10`}
                  >
                    <Icon size={24} className={step.color} />
                    <span
                      className={`absolute -top-2 -right-2 text-xs font-bold ${step.color} bg-black border ${step.border} rounded-full w-6 h-6 flex items-center justify-center`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg md:text-2xl mb-2 md:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
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

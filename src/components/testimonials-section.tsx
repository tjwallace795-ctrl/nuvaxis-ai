"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria G.",
    business: "Love Pho 2 — El Paso, TX",
    avatar: "MG",
    color: "bg-green-600",
    quote:
      "Nuvaxis AI completely transformed our online presence. We went from zero online orders to customers ordering every single day. The AI chat widget alone has saved us hours answering the same questions.",
    stars: 5,
  },
  {
    name: "Carlos R.",
    business: "CR Auto Detail — El Paso, TX",
    avatar: "CR",
    color: "bg-blue-600",
    quote:
      "I was skeptical at first but the results speak for themselves. Our new website looks better than any competitor in the area and we started getting leads within the first week of launch.",
    stars: 5,
  },
  {
    name: "Jasmine T.",
    business: "Glow Beauty Studio — El Paso, TX",
    avatar: "JT",
    color: "bg-purple-600",
    quote:
      "The social media content strategy alone was worth every penny. They helped us create a TikTok presence that brought in 20+ new clients in the first month. Incredible ROI.",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #1d4ed820 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">
            Real Results
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
            Businesses that leveled up
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              with Nuvaxis AI
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-neutral-900/60 border border-white/8 rounded-2xl p-4 md:p-6 flex flex-col gap-3 md:gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

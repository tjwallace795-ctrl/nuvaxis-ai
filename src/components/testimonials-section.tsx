"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria G.",
    business: "Love Pho 2",
    location: "El Paso, TX",
    avatar: "MG",
    gradient: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-500/30",
    quote:
      "Nuvaxis AI completely transformed our online presence. We went from zero online orders to customers ordering every single day. The AI chat widget alone has saved us hours answering the same questions.",
    result: "+340% online orders",
    stars: 5,
  },
  {
    name: "Carlos R.",
    business: "CR Auto Detail",
    location: "El Paso, TX",
    avatar: "CR",
    gradient: "from-blue-500 to-indigo-600",
    ring: "ring-blue-500/30",
    quote:
      "I was skeptical at first but the results speak for themselves. Our new website looks better than any competitor in the area and we started getting leads within the first week of launch.",
    result: "Leads in week 1",
    stars: 5,
  },
  {
    name: "Jasmine T.",
    business: "Glow Beauty Studio",
    location: "El Paso, TX",
    avatar: "JT",
    gradient: "from-violet-500 to-purple-600",
    ring: "ring-violet-500/30",
    quote:
      "The social media content strategy alone was worth every penny. They helped us create a TikTok presence that brought in 20+ new clients in the first month. Incredible ROI.",
    result: "20+ new clients / mo",
    stars: 5,
  },
];

const stats = [
  { value: "150+", label: "Businesses served" },
  { value: "4.9★", label: "Average rating" },
  { value: "3×", label: "Avg. revenue growth" },
  { value: "< 7 days", label: "Avg. time to launch" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, #1d4ed812 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Star size={11} className="fill-blue-400" /> Real Results
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4 leading-tight">
            Businesses that leveled up
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              with Nuvaxis AI
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Real businesses in El Paso seeing real growth — faster websites, more leads, and content that converts.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-14 md:mb-20">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.13 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Gradient top border accent */}
              <div className={`h-px w-full bg-gradient-to-r ${t.gradient} opacity-60`} />

              <div className="flex flex-col gap-4 p-6 flex-1">
                {/* Stars + quote icon row */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <Quote size={20} className="text-white/10" />
                </div>

                {/* Quote text */}
                <p className="text-gray-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Result chip */}
                <div className={`self-start px-3 py-1 rounded-full bg-gradient-to-r ${t.gradient} bg-opacity-10 text-xs font-semibold text-white/90`}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  ✦ {t.result}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.06]" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ${t.ring}`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {t.business} · {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{ background: "rgba(10,10,20,0.6)" }}
            >
              <span className="text-2xl md:text-3xl font-bold text-white mb-1">{s.value}</span>
              <span className="text-gray-500 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

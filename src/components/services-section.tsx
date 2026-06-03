"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Bot,
  ShoppingCart,
  TrendingUp,
  Megaphone,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "AI Website Design",
    description:
      "Custom, blazing-fast websites built with AI-powered tools. Modern design that converts visitors into paying customers.",
    color: "from-blue-900/80 to-blue-950/60",
    border: "border-blue-500/40",
    iconBg: "bg-blue-500/20 border-blue-500/40",
    iconColor: "text-blue-300",
    glow: "shadow-[0_0_40px_-8px_rgba(59,130,246,0.4)]",
    href: "/services/ai-website-design",
  },
  {
    icon: Bot,
    title: "Nova AI Chat Widget",
    description:
      "24/7 AI assistant that answers customer questions, takes reservations, and drives sales — even while you sleep.",
    color: "from-purple-900/80 to-purple-950/60",
    border: "border-purple-500/40",
    iconBg: "bg-purple-500/20 border-purple-500/40",
    iconColor: "text-purple-300",
    glow: "shadow-[0_0_40px_-8px_rgba(168,85,247,0.4)]",
    href: "/services/nova-ai-chat",
  },
  {
    icon: ShoppingCart,
    title: "Online Ordering Systems",
    description:
      "Seamlessly integrated online ordering for restaurants and retail. Delivery, pickup, and dine-in all in one place.",
    color: "from-emerald-900/80 to-emerald-950/60",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-500/20 border-emerald-500/40",
    iconColor: "text-emerald-300",
    glow: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.4)]",
    href: "/services/online-ordering",
  },
  {
    icon: TrendingUp,
    title: "Social Media Content",
    description:
      "AI-generated content strategy for TikTok, Instagram, and YouTube Shorts. Go viral, grow your audience, win.",
    color: "from-pink-900/80 to-pink-950/60",
    border: "border-pink-500/40",
    iconBg: "bg-pink-500/20 border-pink-500/40",
    iconColor: "text-pink-300",
    glow: "shadow-[0_0_40px_-8px_rgba(236,72,153,0.4)]",
    href: "/services/social-media-content",
  },
  {
    icon: Megaphone,
    title: "Ad Campaign Management",
    description:
      "Facebook, Instagram, TikTok, and YouTube ads built and managed for maximum ROI. Your brand in front of everyone.",
    color: "from-orange-900/80 to-orange-950/60",
    border: "border-orange-500/40",
    iconBg: "bg-orange-500/20 border-orange-500/40",
    iconColor: "text-orange-300",
    glow: "shadow-[0_0_40px_-8px_rgba(249,115,22,0.4)]",
    href: "/services/ad-campaigns",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
            Everything your business needs{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              to dominate online
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            From your first website to full AI automation — Nuvaxis AI delivers
            the complete digital stack for modern businesses.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.a
                key={service.title}
                href={service.href}
                variants={cardVariants}
                className={`group relative bg-gradient-to-b ${service.color} border ${service.border} ${service.glow} rounded-2xl p-4 md:p-6 hover:scale-[1.02] hover:brightness-110 transition-all duration-300 cursor-pointer block`}
              >
                <div
                  className={`w-11 h-11 rounded-xl border ${service.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon size={20} className={service.iconColor} />
                </div>
                <h3 className="text-white font-semibold text-base md:text-lg mb-1 md:mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {service.description}
                </p>
                <span className={`mt-3 inline-block text-xs font-medium ${service.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more →
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

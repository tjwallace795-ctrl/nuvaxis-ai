"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Bot,
  ShoppingCart,
  TrendingUp,
  Users,
  Megaphone,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "AI Website Design",
    description:
      "Custom, blazing-fast websites built with AI-powered tools. Modern design that converts visitors into paying customers.",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Bot,
    title: "Nova AI Chat Widget",
    description:
      "24/7 AI assistant that answers customer questions, takes reservations, and drives sales — even while you sleep.",
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: ShoppingCart,
    title: "Online Ordering Systems",
    description:
      "Seamlessly integrated online ordering for restaurants and retail. Delivery, pickup, and dine-in all in one place.",
    color: "from-green-500/20 to-green-600/5",
    border: "border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: TrendingUp,
    title: "Social Media Content",
    description:
      "AI-generated content strategy for TikTok, Instagram, and YouTube Shorts. Go viral, grow your audience, win.",
    color: "from-pink-500/20 to-pink-600/5",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Users,
    title: "Lead Generation",
    description:
      "AI working in the background 24/7 to find and surface your next customers — locally and beyond.",
    color: "from-yellow-500/20 to-yellow-600/5",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: Megaphone,
    title: "Ad Campaign Management",
    description:
      "Facebook, Instagram, TikTok, and YouTube ads built and managed for maximum ROI. Your brand in front of everyone.",
    color: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="bg-black py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Everything your business needs
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              to dominate online
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
              <motion.div
                key={service.title}
                variants={cardVariants}
                className={`group relative bg-gradient-to-b ${service.color} border ${service.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 cursor-default`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-neutral-900 border ${service.border} flex items-center justify-center mb-4`}
                >
                  <Icon size={20} className={service.iconColor} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

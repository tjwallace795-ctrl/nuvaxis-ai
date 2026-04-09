"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Clock, MessageCircle, TrendingUp } from "lucide-react";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer-section";

const features = [
  { icon: Clock, title: "24/7 Availability", desc: "Your AI never sleeps. It answers questions, books appointments, and closes sales at 3am." },
  { icon: MessageCircle, title: "Trained on Your Business", desc: "We train Nova on your menu, services, FAQs, and policies so every answer is accurate." },
  { icon: Bot, title: "Handles Reservations & Orders", desc: "Nova can take reservations, direct customers to your ordering system, and capture leads." },
  { icon: TrendingUp, title: "Grows Your Revenue", desc: "More answered questions = more conversions. Nova turns curious visitors into customers." },
];

const steps = [
  { num: "01", title: "We Train Nova on Your Business", desc: "You share your menus, services, and FAQs. We configure Nova to sound like you." },
  { num: "02", title: "Embedded on Your Site", desc: "A small snippet of code adds Nova to your website. Seamless, beautiful widget." },
  { num: "03", title: "Nova Goes to Work", desc: "From the moment it's live, Nova handles customer questions 24/7 — no extra effort from you." },
];

const chatMessages = [
  { from: "user", text: "Do you have vegan options?" },
  { from: "nova", text: "Yes! We have several vegan dishes including our Garden Bowl and Avocado Wrap. Would you like to see the full menu?" },
  { from: "user", text: "What are your hours?" },
  { from: "nova", text: "We're open Mon–Sat 10am–9pm and Sun 11am–7pm. Want me to book a table for you?" },
  { from: "user", text: "Yes please, Saturday at 7pm for 2" },
  { from: "nova", text: "Done! I've reserved a table for 2 this Saturday at 7pm. You'll get a confirmation text shortly." },
];

export default function NovaAIChatPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #6d28d940 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Nova AI Chat Widget</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-5 leading-tight">
              Your best employee<br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">never clocks out</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Nova AI answers customer questions, books appointments, handles reservations, and drives sales 24/7 — all on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/#contact" className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-7 py-3.5 rounded-full transition-all">
                Get a Free Demo <ArrowRight size={17} />
              </a>
              <a href="/#pricing" className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-full transition-colors">
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Chat Mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full max-w-sm mx-auto">
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-900/20">
              {/* Chat header */}
              <div className="bg-gradient-to-r from-purple-900/80 to-purple-800/60 px-4 py-4 flex items-center gap-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Nova AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-green-400 text-xs">Online 24/7</span>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div className="bg-neutral-950 p-4 space-y-3 max-h-80 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.from === "user"
                        ? "bg-purple-600 text-white rounded-br-sm"
                        : "bg-neutral-800 text-gray-200 rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Input */}
              <div className="bg-neutral-900 px-3 py-3 border-t border-white/10 flex items-center gap-2">
                <div className="flex-1 bg-neutral-800 rounded-full px-3 py-2 text-gray-500 text-xs">Ask Nova anything...</div>
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={13} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What Nova does for you</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">Nova handles the conversations so you can focus on running your business.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                    <p className="text-gray-400 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Getting Nova live is simple</h2>
          </motion.div>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start bg-neutral-900/40 border border-white/8 rounded-2xl p-5">
                <span className="text-purple-400 font-bold text-lg flex-shrink-0">{s.num}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/10 border border-purple-500/20 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Let Nova handle your customer questions</h2>
            <p className="text-gray-400 mb-7 text-sm">Get a live demo of Nova on your actual website — free.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all">
              Try Nova Free <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
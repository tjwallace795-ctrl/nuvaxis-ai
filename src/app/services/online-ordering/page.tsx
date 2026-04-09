"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, CreditCard, Smartphone, RefreshCw } from "lucide-react";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer-section";

const features = [
  { icon: Smartphone, title: "Order From Any Device", desc: "Customers order from their phone, tablet, or desktop without downloading any app." },
  { icon: CreditCard, title: "Secure Payments Built In", desc: "Stripe-powered checkout. Cards, Apple Pay, Google Pay — all accepted out of the box." },
  { icon: ShoppingCart, title: "Delivery, Pickup & Dine-In", desc: "One system handles all three order types. Set hours, cutoff times, and zones your way." },
  { icon: RefreshCw, title: "Real-Time Order Management", desc: "Orders ping your tablet or phone instantly. Accept, modify, or decline with one tap." },
];

const steps = [
  { num: "01", title: "We Build Your Menu", desc: "Upload your menu or hand us a PDF — we set up every item, modifier, and price in the system." },
  { num: "02", title: "Payments Connected", desc: "We connect your Stripe account (or create one) so money goes directly to you." },
  { num: "03", title: "Go Live", desc: "The ordering system is embedded in your site. Customers order. You get paid." },
];

const menuItems = [
  { name: "Signature Pho", desc: "Beef broth, rice noodles, fresh herbs", price: "$14.99", tag: "Popular" },
  { name: "Spring Rolls (4pc)", desc: "Shrimp, pork, vermicelli, lettuce", price: "$8.99", tag: null },
  { name: "Boba Milk Tea", desc: "Taro, Thai tea, or classic black", price: "$5.99", tag: "New" },
];

export default function OnlineOrderingPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #16803c40 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Online Ordering Systems</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-5 leading-tight">
              Orders in.<br />
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Money in the bank.</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Stop losing orders to third-party apps that take 30% commissions. We build your own branded online ordering system — delivery, pickup, and dine-in all in one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/#contact" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3.5 rounded-full transition-all">
                Get a Free Demo <ArrowRight size={17} />
              </a>
              <a href="/#pricing" className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-full transition-colors">
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Order Mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full max-w-sm mx-auto">
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-green-900/20">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-900/80 to-green-800/60 px-4 py-4 flex items-center justify-between border-b border-white/10">
                <div>
                  <p className="text-white font-bold text-sm">Love Pho 2</p>
                  <p className="text-green-300 text-xs">Order Online · Pickup or Delivery</p>
                </div>
                <div className="bg-green-600/30 border border-green-500/40 rounded-full px-3 py-1 text-green-300 text-xs">Open Now</div>
              </div>
              {/* Menu items */}
              <div className="bg-neutral-950 divide-y divide-white/5">
                {menuItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        {item.tag && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${item.tag === "Popular" ? "bg-orange-500/20 text-orange-300" : "bg-blue-500/20 text-blue-300"}`}>{item.tag}</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-green-400 text-sm font-semibold">{item.price}</span>
                      <div className="w-6 h-6 rounded-full bg-green-600/30 border border-green-500/40 flex items-center justify-center text-green-300 text-sm">+</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Cart bar */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="bg-green-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={15} className="text-white" />
                  <span className="text-white text-sm font-medium">2 items</span>
                </div>
                <span className="text-white text-sm font-bold">View Cart — $23.98</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Built for your business</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">Zero commissions. 100% yours. Everything your customers need to order.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-green-600/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-green-400" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How we set it up</h2>
          </motion.div>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start bg-neutral-900/40 border border-white/8 rounded-2xl p-5">
                <span className="text-green-400 font-bold text-lg flex-shrink-0">{s.num}</span>
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
          <div className="bg-gradient-to-br from-green-600/20 to-green-900/10 border border-green-500/20 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Stop giving away 30% to DoorDash</h2>
            <p className="text-gray-400 mb-7 text-sm">Own your orders. Keep your money. We'll show you how.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full transition-all">
              Get Started Free <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
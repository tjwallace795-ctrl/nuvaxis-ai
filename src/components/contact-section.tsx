"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-black py-28 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Ready to grow your business
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              with AI?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Fill out the form below and we will reach out within 24 hours to
            schedule your free demo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Email Us</p>
                <p className="text-gray-400 text-sm">hello@nuvaxisai.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Call or Text</p>
                <p className="text-gray-400 text-sm">(915) 000-0000</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Based In</p>
                <p className="text-gray-400 text-sm">El Paso, TX — Serving Nationwide</p>
              </div>
            </div>

            {/* Highlight box */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/20">
              <p className="text-white font-semibold mb-1">Free Demo Included</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                We will build a sample page for your business before you ever
                pay a dime. See the results first, then decide.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center text-center py-12">
                <div>
                  <div className="w-14 h-14 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">We will be in touch within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Business Name</label>
                    <input
                      type="text"
                      value={form.business}
                      onChange={(e) => setForm({ ...form, business: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="My Business"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Tell Us About Your Business</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="Tell us what you need..."
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-4 rounded-xl"
                >
                  Send Message
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

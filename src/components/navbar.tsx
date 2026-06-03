"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          {/* Animated Abstract AI Mark */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
            {/* Rotating outer ring arc */}
            <motion.g
              style={{ transformOrigin: "18px 18px" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="18" cy="18" r="16" stroke="url(#ringGradNav)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
            </motion.g>
            {/* Pulsing inner core */}
            <motion.g
              style={{ transformOrigin: "18px 18px" }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="18" cy="18" r="5" fill="url(#coreGradNav)" />
            </motion.g>
            {/* Node top-right */}
            <motion.circle cx="28" cy="8" r="2.5" fill="#3b82f6"
              animate={{ opacity: [0.9, 0.3, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            />
            {/* Node bottom-left */}
            <motion.circle cx="8" cy="28" r="2.5" fill="#6366f1"
              animate={{ opacity: [0.9, 0.3, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Node top-left */}
            <motion.circle cx="7" cy="10" r="1.8" fill="#60a5fa"
              animate={{ opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            {/* Node bottom-right */}
            <motion.circle cx="29" cy="27" r="1.8" fill="#818cf8"
              animate={{ opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
            {/* Connector lines */}
            <line x1="18" y1="13" x2="26.5" y2="9.5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="18" y1="23" x2="9.5" y2="26.5" stroke="#6366f1" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="13" y1="16" x2="8" y2="11" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            <line x1="23" y1="20" x2="28.5" y2="26" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            {/* Center dot */}
            <motion.circle cx="18" cy="18" r="2" fill="white"
              animate={{ opacity: [0.95, 0.5, 0.95] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="ringGradNav" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <radialGradient id="coreGradNav" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </radialGradient>
            </defs>
          </svg>
          <span className="text-white font-semibold text-xl" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.03em" }}>
            Nuvaxis <span className="text-blue-500">AI</span>
          </span>
        </a>

        {/* Desktop: Pricing + Contact CTA */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/#pricing"
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Pricing
          </a>
          <a
            href="/#contact"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Contact Us Now
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 border-t border-white/10 px-6 py-6 flex flex-col gap-4"
        >
          <a
            href="/#pricing"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-white text-base font-medium"
          >
            Pricing
          </a>
          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-full text-center"
          >
            Contact Us Now
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

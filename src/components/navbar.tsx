"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

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
          {/* Abstract AI Mark */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer ring arc */}
            <circle cx="18" cy="18" r="16" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
            {/* Inner core */}
            <circle cx="18" cy="18" r="5" fill="url(#coreGrad)" />
            {/* Node top-right */}
            <circle cx="28" cy="8" r="2.5" fill="#3b82f6" opacity="0.9" />
            {/* Node bottom-left */}
            <circle cx="8" cy="28" r="2.5" fill="#6366f1" opacity="0.9" />
            {/* Node top-left */}
            <circle cx="7" cy="10" r="1.8" fill="#60a5fa" opacity="0.6" />
            {/* Node bottom-right */}
            <circle cx="29" cy="27" r="1.8" fill="#818cf8" opacity="0.6" />
            {/* Connector lines */}
            <line x1="18" y1="13" x2="26.5" y2="9.5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="18" y1="23" x2="9.5" y2="26.5" stroke="#6366f1" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="13" y1="16" x2="8" y2="11" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            <line x1="23" y1="20" x2="28.5" y2="26" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            {/* Center cross-dot */}
            <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </radialGradient>
            </defs>
          </svg>
          <span className="text-white font-semibold text-xl" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.03em" }}>
            Nuvaxis <span className="text-blue-500">AI</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#contact"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Get a Free Demo
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
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white text-base font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-blue-600 text-white text-sm font-medium px-5 py-3 rounded-full text-center"
          >
            Get a Free Demo
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

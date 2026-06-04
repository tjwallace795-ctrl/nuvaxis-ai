"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import NuvaxisLogo from "@/components/nuvaxis-logo";

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
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/">
          <NuvaxisLogo markHeight={26} textSize="text-xl" />
        </a>

        {/* Desktop: Pricing + Contact CTA */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/#pricing"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            Pricing
          </a>
          <a
            href="/#contact"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-purple-900/40"
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
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold px-5 py-3 rounded-full text-center"
          >
            Contact Us Now
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

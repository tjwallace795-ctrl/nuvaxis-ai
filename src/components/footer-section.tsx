import Link from "next/link";
import NuvaxisLogo from "@/components/nuvaxis-logo";

export default function FooterSection() {
  return (
    <footer className="border-t border-white/8 py-10 px-6 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <NuvaxisLogo markHeight={22} textSize="text-lg" />

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-600 text-sm">
          © 2026 Nuvaxis AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

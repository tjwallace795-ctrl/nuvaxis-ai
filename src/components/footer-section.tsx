export default function FooterSection() {
  return (
    <footer className="bg-black border-t border-white/8 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Nuvaxis <span className="text-blue-500">AI</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <p className="text-gray-600 text-sm">
          © 2026 Nuvaxis AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

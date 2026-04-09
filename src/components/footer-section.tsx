export default function FooterSection() {
  return (
    <footer className="border-t border-white/8 py-10 px-6 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" stroke="url(#ringGradF)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
            <circle cx="18" cy="18" r="5" fill="url(#coreGradF)" />
            <circle cx="28" cy="8" r="2.5" fill="#3b82f6" opacity="0.9" />
            <circle cx="8" cy="28" r="2.5" fill="#6366f1" opacity="0.9" />
            <circle cx="7" cy="10" r="1.8" fill="#60a5fa" opacity="0.6" />
            <circle cx="29" cy="27" r="1.8" fill="#818cf8" opacity="0.6" />
            <line x1="18" y1="13" x2="26.5" y2="9.5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="18" y1="23" x2="9.5" y2="26.5" stroke="#6366f1" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="13" y1="16" x2="8" y2="11" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            <line x1="23" y1="20" x2="28.5" y2="26" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
            <defs>
              <linearGradient id="ringGradF" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <radialGradient id="coreGradF" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </radialGradient>
            </defs>
          </svg>
          <span className="text-white font-semibold text-lg tracking-tight">
            Nuvaxis <span className="text-blue-500">AI</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
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

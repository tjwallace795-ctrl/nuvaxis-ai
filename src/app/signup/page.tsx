"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (authError) { setError(authError.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicParallaxBg head="" text="" />
      </div>
      <div className="fixed inset-0 z-[1] bg-black/30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 mb-4">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="url(#sg1)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
              <circle cx="18" cy="18" r="5" fill="url(#sg2)" />
              <circle cx="28" cy="8" r="2.5" fill="#3b82f6" opacity="0.9" />
              <circle cx="8" cy="28" r="2.5" fill="#6366f1" opacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
              <line x1="18" y1="13" x2="26.5" y2="9.5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              <line x1="18" y1="23" x2="9.5" y2="26.5" stroke="#6366f1" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="sg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <radialGradient id="sg2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#3b82f6" />
                </radialGradient>
              </defs>
            </svg>
            <span className="text-white font-semibold text-2xl" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", letterSpacing: "-0.03em" }}>
              Nuvaxis <span className="text-blue-500">AI</span>
            </span>
          </a>
          <p className="text-white/40 text-sm">Create your AI workspace</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
          {success ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-semibold text-xl">Check your email</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                We sent a confirmation link to{" "}
                <span className="text-white/70 font-medium">{email}</span>.{" "}
                Click it to activate your account and set up your workspace.
              </p>
              <Link href="/login" className="inline-block mt-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
                <input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
                <input
                  id="password" type="password" autoComplete="new-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/60 mb-1.5">Confirm Password</label>
                <input
                  id="confirmPassword" type="password" autoComplete="new-password" required
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</> : "Create Account"}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-white/30 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

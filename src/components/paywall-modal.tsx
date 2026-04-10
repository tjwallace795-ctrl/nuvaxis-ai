"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, X, CheckCircle2, Zap, ChevronRight,
  Target, Megaphone, TrendingUp,
} from "lucide-react";

interface PaywallModalProps {
  open: boolean;
  featureName: string;
  featureDescription: string;
  onClose: () => void;
  onUpgrade: () => void;
  onChatFree: () => void;
}

const PRO_FEATURES = [
  { icon: Target,    text: "AI Lead Generator — find qualified prospects" },
  { icon: Megaphone, text: "Ad Campaign Builder — full campaign architecture" },
  { icon: TrendingUp,text: "Real-time social scanning & trending content" },
  { icon: Zap,       text: "Unlimited AI sessions across all tools" },
];

const F = "var(--font-space-grotesk)";

export function PaywallModal({ open, featureName, featureDescription, onClose, onUpgrade, onChatFree }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full sm:max-w-md bg-neutral-950 border-0 sm:border border-white/[0.09] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600" />

              <div className="p-6">
                {/* Close */}
                <div className="flex justify-end mb-1">
                  <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Lock icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/[0.08] flex items-center justify-center">
                    <Lock className="w-7 h-7 text-blue-400" />
                  </div>
                </div>

                {/* Headline */}
                <div className="text-center mb-5">
                  <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: F }}>
                    {featureName} requires a plan
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: F }}>
                    {featureDescription}
                  </p>
                </div>

                {/* What's included */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 mb-5">
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium mb-3" style={{ fontFamily: F }}>
                    What you get with a subscription
                  </p>
                  <div className="space-y-2.5">
                    {PRO_FEATURES.map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-white text-xs" style={{ fontFamily: F }}>{text}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing hint */}
                <div className="text-center mb-5">
                  <span className="text-white/30 text-xs" style={{ fontFamily: F }}>Starting at </span>
                  <span className="text-white font-bold text-sm" style={{ fontFamily: F }}>$29/mo</span>
                  <span className="text-white/30 text-xs" style={{ fontFamily: F }}> · Cancel anytime</span>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5">
                  <button
                    onClick={onUpgrade}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition-all shadow-lg shadow-blue-500/20"
                    style={{ fontFamily: F }}
                  >
                    <Zap className="w-4 h-4" /> View Plans & Upgrade <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button
                    onClick={onChatFree}
                    className="w-full py-3 rounded-2xl text-sm font-medium text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                    style={{ fontFamily: F }}
                  >
                    Chat with AI for free instead
                  </button>
                </div>

                <p className="text-center text-white/25 text-[11px] mt-4" style={{ fontFamily: F }}>
                  Free accounts always keep AI chat access
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

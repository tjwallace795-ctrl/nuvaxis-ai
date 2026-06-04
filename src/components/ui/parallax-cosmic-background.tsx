"use client";

import React, { useState, useEffect } from "react";

/**
 * Nuvaxis AI site background. Digital-serenity style: deep slate/black
 * gradient, animated grid lines that draw themselves in, pulsing detail
 * dots, floating particles, and click ripples. Keeps the old
 * CosmicParallaxBg export name so every page picks this up automatically.
 */
interface CosmicParallaxBgProps {
  head: string;
  text: string;
  loop?: boolean;
  className?: string;
}

const pageStyles = `
  @keyframes nvx-grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
  @keyframes nvx-pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
  @keyframes nvx-float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
  @keyframes nvx-ripple { 0% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(14); } }
  .nvx-grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: nvx-grid-draw 2s ease-out forwards; }
  .nvx-detail-dot { fill: #cbd5e1; opacity: 0; animation: nvx-pulse-glow 3s ease-in-out infinite; }
  .nvx-floating { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: nvx-float 4s ease-in-out infinite; }
  .nvx-corner { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.15); }
  .nvx-ripple { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; pointer-events: none; animation: nvx-ripple 1s ease-out forwards; z-index: 9999; }
`;

const floatingElements = [
  { top: "25%", left: "15%", delay: "0.5s" },
  { top: "60%", left: "85%", delay: "1s" },
  { top: "40%", left: "10%", delay: "1.5s" },
  { top: "75%", left: "90%", delay: "2s" },
  { top: "15%", left: "70%", delay: "2.5s" },
  { top: "85%", left: "30%", delay: "3s" },
];

const CosmicParallaxBg = (_props: CosmicParallaxBgProps) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)),
        1000
      );
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <style>{pageStyles}</style>
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800">
        {/* Grid + animated lines + detail dots */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="nvxGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nvxGrid)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="nvx-grid-line" style={{ animationDelay: "0.5s" }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="nvx-grid-line" style={{ animationDelay: "1s" }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="nvx-grid-line" style={{ animationDelay: "1.5s" }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="nvx-grid-line" style={{ animationDelay: "2s" }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="nvx-grid-line" style={{ animationDelay: "2.5s", opacity: 0.05 }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="nvx-grid-line" style={{ animationDelay: "3s", opacity: 0.05 }} />
          <circle cx="20%" cy="20%" r="2" className="nvx-detail-dot" style={{ animationDelay: "3s" }} />
          <circle cx="80%" cy="20%" r="2" className="nvx-detail-dot" style={{ animationDelay: "3.2s" }} />
          <circle cx="20%" cy="80%" r="2" className="nvx-detail-dot" style={{ animationDelay: "3.4s" }} />
          <circle cx="80%" cy="80%" r="2" className="nvx-detail-dot" style={{ animationDelay: "3.6s" }} />
          <circle cx="50%" cy="50%" r="1.5" className="nvx-detail-dot" style={{ animationDelay: "4s" }} />
        </svg>

        {/* Corner elements */}
        <div className="nvx-corner top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8">
          <div className="absolute top-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
        </div>
        <div className="nvx-corner top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8">
          <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
        </div>
        <div className="nvx-corner bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
        </div>
        <div className="nvx-corner bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
        </div>

        {/* Floating particles */}
        {floatingElements.map((el, i) => (
          <div
            key={i}
            className="nvx-floating"
            style={{ top: el.top, left: el.left, animationDelay: el.delay }}
          />
        ))}
      </div>

      {/* Click ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="nvx-ripple"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
        />
      ))}
    </>
  );
};

export { CosmicParallaxBg };

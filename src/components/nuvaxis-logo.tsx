"use client";

/**
 * Official Nuvaxis AI logo — matches the business card:
 * infinity mark (blue ring + purple ring, white core dot)
 * with serif-italic "Nuvaxis" and gradient "AI" wordmark.
 */
export default function NuvaxisLogo({
  markHeight = 30,
  textSize = "text-xl",
  showText = true,
}: {
  markHeight?: number;
  textSize?: string;
  showText?: boolean;
}) {
  const markWidth = Math.round(markHeight * (64 / 36));

  return (
    <span className="flex items-center gap-2.5">
      {/* Infinity mark */}
      <svg
        width={markWidth}
        height={markHeight}
        viewBox="0 0 64 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="nvxLeft" x1="6" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="nvxRight" x1="32" y1="30" x2="58" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="nvxAI" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Left ring (blue) */}
        <circle cx="20" cy="18" r="12" stroke="url(#nvxLeft)" strokeWidth="6.5" />
        {/* Right ring (purple) */}
        <circle cx="44" cy="18" r="12" stroke="url(#nvxRight)" strokeWidth="6.5" />
        {/* Core dot where the rings meet */}
        <circle cx="32" cy="18" r="5.5" fill="#0d0620" />
        <circle cx="32" cy="18" r="3.5" fill="white" />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span className={`${textSize} leading-none flex items-baseline gap-1`}>
          <span
            className="text-white italic font-medium"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Nuvaxis
          </span>
          <span
            className="font-bold not-italic bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            AI
          </span>
        </span>
      )}
    </span>
  );
}

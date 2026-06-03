"use client";

/**
 * Nuvaxis AI brand background — matches the business card:
 * deep indigo/purple gradient, subtle grid lines, and a soft
 * purple glow. Keeps the old CosmicParallaxBg export name so
 * every page that imported it picks this up automatically.
 */
interface CosmicParallaxBgProps {
  head: string;
  text: string;
  loop?: boolean;
  className?: string;
}

const CosmicParallaxBg = (_props: CosmicParallaxBgProps) => {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% -10%, #2a1454 0%, #1a0b38 35%, #0d0620 70%, #080414 100%)",
      }}
    >
      {/* Subtle grid — like the card */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168, 130, 255, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 130, 255, 0.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 100% 90% at 50% 30%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 90% at 50% 30%, black 30%, transparent 85%)",
        }}
      />

      {/* Central purple glow */}
      <div
        className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124, 58, 237, 0.28) 0%, rgba(88, 28, 135, 0.12) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Secondary blue accent glow, bottom-left */}
      <div
        className="absolute left-[10%] bottom-[5%] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59, 130, 246, 0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Vignette to keep edges dark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 50%, transparent 55%, rgba(5, 2, 12, 0.55) 100%)",
        }}
      />
    </div>
  );
};

export { CosmicParallaxBg };

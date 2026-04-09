"use client";

import React, { useEffect, useState } from 'react';

interface CosmicParallaxBgProps {
  head: string;
  text: string;
  loop?: boolean;
  className?: string;
}

const CosmicParallaxBg: React.FC<CosmicParallaxBgProps> = ({
  head,
  text,
  loop = true,
  className = '',
}) => {
  const [smallStars, setSmallStars] = useState<string>('');
  const [mediumStars, setMediumStars] = useState<string>('');
  const [bigStars, setBigStars] = useState<string>('');

  const textParts = text.split(',').map(part => part.trim());

  const generateStarBoxShadow = (count: number, tinted = false): string => {
    const shadows = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      // Occasionally tint bright stars blue or white-blue for realism
      if (tinted && Math.random() > 0.7) {
        const hue = Math.random() > 0.5 ? '#bfd4ff' : '#d4e8ff';
        shadows.push(`${x}px ${y}px ${hue}`);
      } else {
        shadows.push(`${x}px ${y}px #FFF`);
      }
    }
    return shadows.join(', ');
  };

  useEffect(() => {
    setSmallStars(generateStarBoxShadow(900));
    setMediumStars(generateStarBoxShadow(300, true));
    setBigStars(generateStarBoxShadow(120, true));
    document.documentElement.style.setProperty(
      '--animation-iteration',
      loop ? 'infinite' : '1'
    );
  }, [loop]);

  return (
    <div className={`cosmic-parallax-container ${className}`}>
      {/* Star layers */}
      <div id="stars" style={{ boxShadow: smallStars }} className="cosmic-stars" />
      <div id="stars2" style={{ boxShadow: mediumStars }} className="cosmic-stars-medium" />
      <div id="stars3" style={{ boxShadow: bigStars }} className="cosmic-stars-large" />

      {/* Nebula wisps */}
      <div className="nebula-wisp nebula-wisp-1" />
      <div className="nebula-wisp nebula-wisp-2" />
      <div className="nebula-wisp nebula-wisp-3" />

      {/* Aurora bands */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />

      {/* Earth body */}
      <div id="earth" />

      {/* Atmospheric ring (thin glowing edge of the planet) */}
      <div id="atmosphere-ring" />

      {/* City lights scattered on the earth surface */}
      <div id="city-lights" />

      {/* Horizon atmospheric glow layers */}
      <div id="horizon">
        <div className="horizon-inner-glow" />
        <div className="horizon-mid-glow" />
        <div className="horizon-edge-line" />
      </div>

      {/* Distant mountain silhouettes above the horizon */}
      <div id="terrain-silhouette" />

      {/* Title / subtitle hidden when used as background */}
      <div id="title">{head.toUpperCase()}</div>
      <div id="subtitle">
        {textParts.map((part, index) => (
          <React.Fragment key={index}>
            <span className={`subtitle-part-${index + 1}`}>{part.toUpperCase()}</span>
            {index < textParts.length - 1 && ' '}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export { CosmicParallaxBg };
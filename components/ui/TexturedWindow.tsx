"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { soundEngine } from '@/lib/SoundEngine';

export const TexturedWindow = ({ isMobile, inkColor }: { isMobile: boolean, inkColor: string }) => {
  const [windowHovered, setWindowHovered] = useState(false);

  return (
    <g 
      transform={isMobile ? "translate(140, 950) scale(2.2)" : "translate(850, 100) scale(2.2)"}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setWindowHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setWindowHovered(false);
      }}
      onFocus={() => setWindowHovered(true)}
      onBlur={() => setWindowHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.init();
        soundEngine.playGlassChime();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          soundEngine.init();
          soundEngine.playGlassChime();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Ring window chime"
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <rect x="0" y="0" width="180" height="160" fill="#fdfbf7" stroke={inkColor} strokeWidth="1.5" />
      <motion.rect 
        x="5" y="5" width="170" height="150" 
        animate={{ fill: windowHovered ? '#e8ecef' : 'rgba(0,0,0,0.02)' }}
        transition={{ duration: 0.5 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: windowHovered ? 1 : 0, y: windowHovered ? 0 : 10 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: 'none' }}
        clipPath="url(#window-clip)"
      >
        {/* Anime Sketch Character Drawing inside window */}
        <g stroke={inkColor} strokeWidth="0.8" fill="none" opacity="0.85">
          {/* Face and Hair */}
          <path d="M 65 100 Q 80 120 95 100" /> {/* Chin */}
          <path d="M 55 60 Q 80 40 105 60 Q 115 80 110 110 Q 100 140 90 150" /> {/* Hair Right */}
          <path d="M 55 60 Q 45 80 50 110 Q 60 140 70 150" /> {/* Hair Left */}
          <path d="M 55 60 Q 70 80 75 75 Q 85 95 90 75 Q 100 85 105 60" /> {/* Bangs */}
          
          {/* Eyes & Features */}
          <path d="M 65 85 Q 70 82 75 85" strokeWidth="1" /> {/* L Eye closed */}
          <path d="M 85 85 Q 90 82 95 85" strokeWidth="1" /> {/* R Eye closed */}
          <path d="M 80 92 Q 80 94 82 92" strokeWidth="0.5" /> {/* Nose/Mouth */}

          {/* Shoulders and Dress */}
          <path d="M 70 110 Q 55 120 40 160 L 35 240" /> {/* L Shoulder */}
          <path d="M 90 110 Q 105 120 120 160 L 125 240" /> {/* R Shoulder */}
          
          {/* Scarf / Collar */}
          <path d="M 60 115 Q 80 130 100 115" />
          <path d="M 70 120 Q 80 140 85 125" />
          <path d="M 90 120 Q 80 140 75 125" />

          {/* Dress folds */}
          <path d="M 50 160 Q 60 200 50 240" />
          <path d="M 110 160 Q 100 200 110 240" />
          <path d="M 80 140 L 80 240" strokeWidth="0.4" />
          
          {/* Companion creature on shoulder */}
          <path d="M 105 130 C 105 110, 125 110, 125 130 C 130 145, 100 145, 105 130 Z" />
          <path d="M 108 115 L 110 105 L 114 113" strokeWidth="0.5" /> {/* Ear */}
          <path d="M 122 115 L 120 105 L 116 113" strokeWidth="0.5" /> {/* Ear */}
          <circle cx="112" cy="120" r="1" fill={inkColor} />
          <circle cx="118" cy="120" r="1" fill={inkColor} />

          {/* Sketchy shading/hatching */}
          <path d="M 45 140 L 55 145 M 42 150 L 52 155 M 40 160 L 50 165" strokeWidth="0.4" />
          <path d="M 115 140 L 105 145 M 118 150 L 108 155 M 120 160 L 110 165" strokeWidth="0.4" />
          <path d="M 55 70 L 60 65 M 60 75 L 65 70 M 95 70 L 90 65 M 90 75 L 85 70" strokeWidth="0.4" />
        </g>
      </motion.g>
      <path d="M90 5 L90 155 M5 80 L175 80" stroke={inkColor} strokeWidth="1.5" />
      <path d="M0 160 L-10 170 M180 160 L190 165" stroke={inkColor} strokeWidth="0.6" />
    </g>
  );
};

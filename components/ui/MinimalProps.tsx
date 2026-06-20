"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { TexturedInteractiveDoor } from './TexturedInteractiveDoor';
import { useWindowSize } from '@/hooks/useWindowSize';

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const windowAudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (windowAudioCtx) {
      audioCtx = new windowAudioCtx();
    }
  }
  return audioCtx;
};

const playKnock = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const playSingleKnock = (time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.15);
    };

    playSingleKnock(t);
    playSingleKnock(t + 0.15);
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

const playGlassChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.5);
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export const PortfolioSketchScene = ({ className }: { className?: string }) => {
  const [sceneHovered, setSceneHovered] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);
  const [windowHovered, setWindowHovered] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 768;

  const inkColor = "#1a1a1a";
  const paperColor = "#fdfbf7";

  return (
    <motion.svg
      className={className}
      viewBox={isMobile ? "-400 -200 1400 2400" : "-500 -200 2000 1000"}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      onMouseEnter={() => setSceneHovered(true)}
      onMouseLeave={() => setSceneHovered(false)}
      animate={ sceneHovered ? { y: [-2, 2] } : { y: 0 } }
      transition={ sceneHovered ? { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } : { duration: 0.5, ease: "easeOut" } }
      style={{ overflow: 'visible' }}
    >
      <rect x="-1500" y="-1000" width="4000" height="3000" fill={paperColor} />

      <g>
        {/* Layer 1: Modular Environment Backgrounds */}
        <rect x="-1500" y="-1000" width="4000" height="5000" fill="url(#wall-pattern)" opacity="0.8" />
        <rect x="-1500" y="550" width="4000" height="800" fill="url(#ground-pattern)" opacity="0.9" />
        {/* Fill the dirt below the single ground tile on mobile so it doesn't show bricks */}
        <rect x="-1500" y="1350" width="4000" height="3000" fill="#f0ece6" opacity="0.85" />

        {/* Layer 2: Independent Modular Props */}
        <image href="/images/cat.png" x={isMobile ? "100" : "280"} y={isMobile ? "520" : "470"} width="180" height="180" preserveAspectRatio="xMidYMid meet" opacity="0.9" />
        <image href="/images/planter.png" x={isMobile ? "125" : "1050"} y={isMobile ? "1300" : "400"} width="350" height="280" preserveAspectRatio="xMidYMid meet" opacity="0.9" />

        {/* Layer 2: Interactive Door & Window */}
        <TexturedInteractiveDoor 
          inkColor={inkColor} 
          doorHovered={doorHovered} 
          setDoorHovered={setDoorHovered} 
          playKnock={playKnock} 
          isMobile={isMobile}
        />

        {/* Right Window */}
        <g 
          transform={isMobile ? "translate(140, 950) scale(2.2)" : "translate(850, 100) scale(2.2)"}
          onMouseEnter={() => { setWindowHovered(true); playGlassChime(); }}
          onMouseLeave={() => setWindowHovered(false)}
          style={{ cursor: 'pointer' }}
        >
          <defs>
            <clipPath id="window-clip">
              <rect x="5" y="5" width="170" height="150" />
            </clipPath>
            <pattern id="wall-pattern" patternUnits="userSpaceOnUse" width="800" height="800">
              <image href="/images/wall_bg.png" width="800" height="800" preserveAspectRatio="none" />
            </pattern>
            <pattern id="ground-pattern" patternUnits="userSpaceOnUse" width="800" height="800" patternTransform="translate(0, 150)">
              <image href="/images/ground_bg.png" width="800" height="800" preserveAspectRatio="none" />
            </pattern>
          </defs>
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

        {/* Layer 3: Transparent Stylized Tree on the Left */}
        <image href="/images/tree_layer.png" x={isMobile ? "-1000" : "-1300"} y="-1000" width="1750" height="2100" preserveAspectRatio="xMidYMid meet" opacity="0.95" />

        {/* Layer 4: Interactive Hanging Mouse */}
        <motion.g whileHover={{ rotate: [0, 8, -6, 3, 0] }} transition={{ duration: 2, ease: "easeInOut" }} style={{ transformOrigin: isMobile ? "230px -160px" : "-70px -160px", cursor: "pointer" }}>
          <path d={isMobile ? "M230 -160 C 240 150, 230 400, 240 580" : "M-70 -160 C -60 150, -70 400, -60 580"} fill="none" stroke={inkColor} strokeWidth="1" />
          <rect x={isMobile ? "220" : "-80"} y="580" width="40" height="60" rx="20" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
          <path d={isMobile ? "M230 580 L230 605" : "M-70 580 L-70 605"} stroke={inkColor} strokeWidth="1" />
        </motion.g>
      </g>
    </motion.svg>
  );
};

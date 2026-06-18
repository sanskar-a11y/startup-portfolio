"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";

// Audio Synth Helpers
const playKnock = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
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

    // Double knock
    playSingleKnock(t);
    playSingleKnock(t + 0.15);
  } catch (e) {
    console.error(e);
  }
};

const playGlassChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Glassy sine wave
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
    console.error(e);
  }
};

export const DetailedSketchTree = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 250 400"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 1.2,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    >
      {/* Detailed Trunk with bark texture lines */}
      <path d="M120 400 Q110 300 120 180 M110 400 Q112 330 100 220 M130 400 Q125 330 135 250" />
      <path d="M115 350 L115 320 M125 380 L125 340 M118 280 L118 250" strokeWidth="0.8" opacity="0.5" />

      <motion.g
        animate={{ rotate: [-0.5, 1, -0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 200px" }}
      >
        {/* Branch structure */}
        <path d="M118 230 Q160 200 190 170 M122 260 Q170 240 210 200" />
        <path d="M115 220 Q70 190 40 150 M110 240 Q60 230 30 200" />
        <path d="M120 180 Q130 130 150 100 M120 180 Q100 120 80 90 M120 180 L115 100" />

        {/* Minimalist but detailed canopy (multiple organic blobs) */}
        <path d="M190 160 C 230 160, 240 90, 190 80 C 180 40, 130 20, 100 40 C 60 10, 10 40, 20 90 C -10 120, 20 180, 60 160 C 90 190, 160 190, 190 160 Z" fill="#faf7f2" fillOpacity="0.9" />
        <path d="M180 140 C 210 140, 210 80, 180 70 C 170 40, 130 30, 100 45 C 70 20, 30 40, 40 80 C 10 100, 30 150, 60 140 C 90 160, 150 160, 180 140 Z" fill="#ffffff" fillOpacity="0.4" />

        {/* Hanging rope & Mouse */}
        <motion.g
          whileHover={{ rotate: [0, 8, -6, 3, 0] }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "190px 170px", cursor: "pointer" }}
        >
          {/* Rope tied around branch */}
          <path d="M185 168 Q190 172 195 168 M190 170 Q192 250 190 320" strokeWidth="1" />
          
          {/* Detailed Mouse */}
          <g transform="translate(190, 320)" fill="#faf7f2">
            <path d="M-12,0 C-15,-15 15,-15 12,0 L15,22 C15,35 -15,35 -15,22 Z" />
            <path d="M-15,10 Q0,12 15,10" />
            <path d="M0,10 L0,-2" />
            <path d="M-3,0 L3,0 M-3,2 L3,2" strokeWidth="1.5" />
            {/* Wire tail */}
            <path d="M0,35 Q-10,50 10,60" fill="none" strokeWidth="1" />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  );
};

export const DetailedInteractiveHouse = ({ className }: { className?: string }) => {
  const [doorHovered, setDoorHovered] = useState(false);
  const [leftWindowHovered, setLeftWindowHovered] = useState(false);
  const [rightWindowHovered, setRightWindowHovered] = useState(false);

  return (
    <svg
      className={className}
      viewBox="0 0 500 400"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 1.2,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        filter: "drop-shadow(0px 15px 30px rgba(0,0,0,0.08))"
      }}
    >
      <defs>
        {/* Minimalist Brick/Line Texture */}
        <pattern id="minimal-brick" width="40" height="15" patternUnits="userSpaceOnUse">
          <path d="M0 15 L40 15 M20 15 L20 20 M0 0 L0 5" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.15" />
        </pattern>
        {/* Blueprint shadow */}
        <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.2" />
        </pattern>
      </defs>

      {/* House Base */}
      <rect x="50" y="100" width="400" height="280" fill="url(#minimal-brick)" />
      
      {/* Ground/Grass Sketch */}
      <path d="M-50 380 L550 380" strokeWidth="2" />
      <path d="M0 385 Q 50 387 100 385 T 200 388 T 300 384 T 400 387 T 500 385" strokeWidth="0.8" opacity="0.5" />
      <path d="M20 380 L15 370 M30 380 L35 375 M480 380 L485 370" strokeWidth="0.8" opacity="0.6" />

      {/* Detailed Roof */}
      <path d="M30 100 L470 100 L450 60 L50 60 Z" fill="#ffffff" strokeWidth="1.5" />
      <path d="M40 60 L460 60 L440 20 L60 20 Z" fill="url(#hatch)" />
      {/* Roof Shingle hints */}
      <path d="M70 40 L90 40 M120 40 L140 40 M300 40 L320 40" strokeWidth="0.8" opacity="0.5" />

      {/* Interactive Left Window */}
      <g 
        transform="translate(90, 150)"
        onMouseEnter={() => { setLeftWindowHovered(true); playGlassChime(); }}
        onMouseLeave={() => setLeftWindowHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="0" y="0" width="80" height="130" fill="#ffffff" />
        {/* Glass tint changes to bluish on hover */}
        <motion.rect 
          x="5" y="5" width="70" height="120" 
          animate={{ fill: leftWindowHovered ? 'rgba(173, 216, 230, 0.4)' : 'rgba(255, 255, 255, 0)' }}
          transition={{ duration: 0.3 }}
        />
        <path d="M40 5 L40 125 M5 65 L75 65 M5 40 L75 40 M5 90 L75 90" strokeWidth="1" />
        <path d="M-10 130 L90 130 L90 138 L-10 138 Z" fill="#ffffff" />
        {/* Curtains hint */}
        <path d="M5 5 Q 20 30 5 60 M75 5 Q 60 30 75 60" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Interactive Right Window */}
      <g 
        transform="translate(330, 150)"
        onMouseEnter={() => { setRightWindowHovered(true); playGlassChime(); }}
        onMouseLeave={() => setRightWindowHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="0" y="0" width="80" height="130" fill="#ffffff" />
        {/* Glass tint changes to bluish on hover */}
        <motion.rect 
          x="5" y="5" width="70" height="120" 
          animate={{ fill: rightWindowHovered ? 'rgba(173, 216, 230, 0.4)' : 'rgba(255, 255, 255, 0)' }}
          transition={{ duration: 0.3 }}
        />
        <path d="M40 5 L40 125 M5 65 L75 65 M5 40 L75 40 M5 90 L75 90" strokeWidth="1" />
        <path d="M-10 130 L90 130 L90 138 L-10 138 Z" fill="#ffffff" />
        <path d="M5 5 Q 20 30 5 60 M75 5 Q 60 30 75 60" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Interactive Grand Door */}
      <g 
        transform="translate(210, 160)"
        onMouseEnter={() => { setDoorHovered(true); playKnock(); }}
        onMouseLeave={() => setDoorHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        {/* Door frame arch */}
        <path d="M0 220 L0 30 C 0 -15, 80 -15, 80 30 L80 220 Z" fill="#ffffff" strokeWidth="1.5" />
        
        {/* Inner Door Shadow/Fill changes to darker on hover */}
        <motion.path 
          d="M5 220 L5 30 C 5 -5, 75 -5, 75 30 L75 220 Z"
          animate={{ fill: doorHovered ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.02)' }}
          transition={{ duration: 0.2 }}
        />

        {/* Detailed Panels */}
        <rect x="10" y="40" width="26" height="170" fill="none" strokeWidth="0.8" />
        <rect x="15" y="50" width="16" height="40" fill="none" strokeWidth="0.5" />
        <rect x="15" y="100" width="16" height="40" fill="none" strokeWidth="0.5" />
        <rect x="15" y="150" width="16" height="40" fill="none" strokeWidth="0.5" />

        <rect x="44" y="40" width="26" height="170" fill="none" strokeWidth="0.8" />
        <rect x="49" y="50" width="16" height="40" fill="none" strokeWidth="0.5" />
        <rect x="49" y="100" width="16" height="40" fill="none" strokeWidth="0.5" />
        <rect x="49" y="150" width="16" height="40" fill="none" strokeWidth="0.5" />

        <path d="M40 220 L40 30" strokeWidth="1" />

        {/* Premium Hardware/Handles */}
        <circle cx="32" cy="130" r="3" fill="#1a1a1a" />
        <circle cx="48" cy="130" r="3" fill="#1a1a1a" />
        <path d="M32 133 L32 145 M48 133 L48 145" strokeWidth="1.5" />

        {/* Step */}
        <path d="M-15 220 L95 220 L95 228 L-15 228 Z" fill="#ffffff" />
      </g>
    </svg>
  );
};

"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { TexturedInteractiveDoor } from './TexturedInteractiveDoor';

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

  const inkColor = "#1a1a1a";
  const paperColor = "transparent";

  return (
    <motion.svg
      className={className}
      viewBox="-300 -100 1600 800"
      width="100%"
      height="100%"
      onMouseEnter={() => setSceneHovered(true)}
      onMouseLeave={() => setSceneHovered(false)}
      animate={ sceneHovered ? { y: [-5, 5] } : { y: 0 } }
      transition={ sceneHovered ? { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } : { duration: 0.5, ease: "easeOut" } }
    >
      <rect x="-300" y="-100" width="1600" height="800" fill={paperColor} />

      <g>
        {/* Layer 1: Base Environment (Brick wall, cat, path, flower box) */}
        <image href="/images/base_layer.png" x="-300" y="-100" width="1600" height="800" preserveAspectRatio="xMidYMid slice" opacity="0.9" />

        {/* Layer 2: Interactive Door & Window */}
        <TexturedInteractiveDoor 
          inkColor={inkColor} 
          doorHovered={doorHovered} 
          setDoorHovered={setDoorHovered} 
          playKnock={playKnock} 
        />

        {/* Right Window */}
        <g 
          transform="translate(680, 260)"
          onMouseEnter={() => { setWindowHovered(true); playGlassChime(); }}
          onMouseLeave={() => setWindowHovered(false)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="0" y="0" width="180" height="160" fill="#f5f0e6" stroke={inkColor} strokeWidth="1.5" />
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
          >
            <path d="M60 150 C 60 90, 120 90, 120 150 Z" fill={inkColor} opacity="0.8" />
            <circle cx="90" cy="75" r="20" fill={inkColor} opacity="0.8" />
          </motion.g>
          <path d="M90 5 L90 155 M5 80 L175 80" stroke={inkColor} strokeWidth="1.5" />
          <path d="M0 160 L-10 170 M180 160 L190 165" stroke={inkColor} strokeWidth="0.6" />
        </g>

        {/* Layer 3: Transparent Stylized Tree on the Left */}
        <image href="/images/tree_layer.png" x="-250" y="50" width="500" height="600" preserveAspectRatio="xMidYMid meet" opacity="0.95" />

        {/* Layer 4: Interactive Hanging Mouse */}
        <motion.g whileHover={{ rotate: [0, 8, -6, 3, 0] }} transition={{ duration: 2, ease: "easeInOut" }} style={{ transformOrigin: "180px 250px", cursor: "pointer" }}>
          <path d="M180 250 C 190 320, 180 380, 190 450" fill="none" stroke={inkColor} strokeWidth="1" />
          <rect x="170" y="450" width="40" height="60" rx="20" fill="#ffffff" stroke={inkColor} strokeWidth="1" />
          <path d="M190 450 L190 475" stroke={inkColor} strokeWidth="1" />
        </motion.g>
      </g>
    </motion.svg>
  );
};

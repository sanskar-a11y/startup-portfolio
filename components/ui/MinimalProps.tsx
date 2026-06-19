"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { TexturedTree } from './TexturedTree';
import { TexturedArchitecture } from './TexturedArchitecture';
import { TexturedInteractiveDoor } from './TexturedInteractiveDoor';

// Shared AudioContext to handle browser autoplay policies
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

  // Original Color Palette
  const inkColor = "#1a1a1a";
  const paperColor = "transparent";
  const shadowColor = "rgba(0,0,0,0.05)";

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
      <defs>
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.1" />
        </filter>

        <linearGradient id="door-watercolor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#faedcd"/>
          <stop offset="50%" stopColor="#d4a373"/>
          <stop offset="100%" stopColor="#ccd5ae"/>
        </linearGradient>

        <linearGradient id="door-sketch" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.02)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.05)"/>
        </linearGradient>

        <pattern id="manga-brick" width="100" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 L100 20 M50 20 L50 40 M0 0 L0 20 M100 0 L100 20" stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.15"/>
        </pattern>

        {/* Hyper-realistic Graphite Pencil Texture Filter */}
        <filter id="pencil" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        </filter>
      </defs>

      <rect x="-300" y="-100" width="1600" height="800" fill={paperColor} />

      {/* Main Container with Pencil Filter */}
      <g filter="url(#pencil)">
        <TexturedArchitecture 
          inkColor={inkColor} 
          windowHovered={windowHovered} 
          setWindowHovered={setWindowHovered} 
          playGlassChime={playGlassChime} 
        />

        <TexturedTree 
          inkColor={inkColor} 
          shadowColor={shadowColor} 
        />

        <TexturedInteractiveDoor 
          inkColor={inkColor} 
          doorHovered={doorHovered} 
          setDoorHovered={setDoorHovered} 
          playKnock={playKnock} 
        />
      </g>

    </motion.svg>
  );
};

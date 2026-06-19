"use client";
import React from 'react';
import { motion } from "framer-motion";

const RANDOMS = [0.12, 0.85, 0.43, 0.91, 0.23, 0.54, 0.76, 0.31, 0.88, 0.67, 0.19, 0.58, 0.94, 0.35, 0.71, 0.05, 0.49, 0.82, 0.27, 0.63, 0.08, 0.52, 0.96, 0.39, 0.74, 0.15, 0.60, 0.98, 0.41, 0.78, 0.21, 0.65, 0.02, 0.46, 0.80, 0.25, 0.69, 0.11, 0.56, 0.90, 0.33, 0.77, 0.17, 0.61, 0.04, 0.48, 0.84, 0.29, 0.73, 0.14];
const seedRandom = (seed: number) => {
  return RANDOMS[Math.abs(seed) % RANDOMS.length];
};

export const TexturedArchitecture = ({ 
  inkColor, 
  windowHovered,
  setWindowHovered,
  playGlassChime 
}: { 
  inkColor: string;
  windowHovered: boolean;
  setWindowHovered: (v: boolean) => void;
  playGlassChime: () => void;
}) => {
  return (
    <>
      {/* --- BACKGROUND CLOUDS --- */}
      <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.4">
        {/* Distant Clouds Left */}
        <path d="M-250 50 Q-230 30 -200 40 Q-180 20 -150 40 Q-120 30 -100 50" />
        <path d="M-180 60 Q-160 40 -130 50 Q-110 40 -90 60" />
        {/* Distant Clouds Right */}
        <path d="M900 60 Q930 40 960 50 Q980 30 1020 50 Q1050 40 1080 60" />
        <path d="M1100 80 Q1120 60 1150 70 Q1180 60 1200 80" />
        {/* Birds */}
        <path d="M-100 20 Q-95 10 -90 20 Q-85 10 -80 20" strokeWidth="0.8" />
        <path d="M-110 30 Q-105 25 -100 30 Q-95 25 -90 30" strokeWidth="0.5" />
        <path d="M1000 30 Q1005 20 1010 30 Q1015 20 1020 30" strokeWidth="0.8" />
      </g>

      {/* --- EXTENDED BUILDING STRUCTURE --- */}
      <rect x="-300" y="200" width="1600" height="400" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
      <rect x="-300" y="200" width="1600" height="400" fill="url(#manga-brick)" />
      
      {/* Detailed Roof Shingles (Avoiding tree area completely) */}
      <g>
        <path d="M-300 200 L1300 200 L1300 215 L-300 215 Z" fill="#f5f0e6" stroke={inkColor} strokeWidth="1" />
        {Array.from({ length: 15 }).map((_, i) => (
          <path key={`shingle-l-${i}`} d={`M${-300 + i * 20} 200 Q${-290 + i * 20} 220 ${-280 + i * 20} 200`} fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.6"/>
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <path key={`shingle-r-${i}`} d={`M${500 + i * 20} 200 Q${510 + i * 20} 220 ${520 + i * 20} 200`} fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.6"/>
        ))}
      </g>

      {/* Cracked Brickwork & Plaster Details (Avoiding Tree left side) */}
      <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.7">
        <path d="M-200 300 L-190 310 L-195 320 L-180 325" />
        <path d="M-50 400 L-40 405 L-45 420" />
        <path d="M900 250 Q920 280 910 300 Q890 310 880 290 Q870 260 900 250" fill="#f5f0e6" strokeWidth="0.8" />
        <path d="M900 250 L910 240 M910 300 L915 310 M880 290 L870 295" />
      </g>

      {/* Climbing Vines (Left Wall - carefully bounded so they don't hit the tree) */}
      <g stroke={inkColor} strokeWidth="0.8" fill="none">
        <path d="M-150 550 Q-140 480 -160 400 Q-180 320 -150 250" />
        <path d="M-160 400 Q-130 380 -110 350" />
        {Array.from({ length: 20 }).map((_, i) => (
          <path key={`vine-leaf-${i}`} d={`M${-150 + Math.sin(i)*10} ${500 - i*12} Q${-160 + Math.cos(i)*15} ${490 - i*12} ${-150 + Math.sin(i)*10} ${480 - i*12}`} strokeWidth="0.5" fill="#ffffff" />
        ))}
      </g>

      {/* Climbing Vines (Right Wall) */}
      <g stroke={inkColor} strokeWidth="0.8" fill="none">
        <path d="M1050 550 Q1060 480 1040 400 Q1020 320 1050 250" />
        <path d="M1040 400 Q1070 380 1090 350" />
        {Array.from({ length: 20 }).map((_, i) => (
          <path key={`vine-leaf-r-${i}`} d={`M${1050 + Math.sin(i)*10} ${500 - i*12} Q${1060 + Math.cos(i)*15} ${490 - i*12} ${1050 + Math.sin(i)*10} ${480 - i*12}`} strokeWidth="0.5" fill="#ffffff" />
        ))}
      </g>

      {/* --- EXTENDED GROUND & GRASS DETAILS --- */}
      <path d="M-300 550 L1300 550" stroke={inkColor} strokeWidth="1" />
      
      {/* Ground texturing (pebbles and dirt) */}
      <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.6">
        {Array.from({ length: 40 }).map((_, i) => (
          <circle key={`pebble-${i}`} cx={-250 + seedRandom(i) * 1500} cy={560 + seedRandom(i + 100) * 40} r={seedRandom(i + 200) * 2 + 1} />
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <path key={`dirt-${i}`} d={`M${-250 + seedRandom(i + 300) * 1500} ${570 + seedRandom(i + 400) * 30} h${seedRandom(i + 500) * 10 + 5}`} />
        ))}
      </g>

      {/* Grass patches */}
      <g stroke={inkColor} strokeWidth="0.6" fill="none">
        {Array.from({ length: 25 }).map((_, i) => {
          const x = -200 + seedRandom(i + 600) * 1400;
          return (
            <g key={`grass-${i}`} transform={`translate(${x}, 550)`}>
              <path d="M0 0 Q-5 -10 -10 -20 M0 0 Q0 -15 2 -25 M0 0 Q5 -10 10 -15" />
            </g>
          );
        })}
      </g>

      {/* Extended Stone Path with Distressed Details */}
      <g>
        <path d="M500 600 C 500 570, 510 550, 530 550 L 630 550 C 650 550, 660 570, 660 600" fill="#f5f0e6" stroke={inkColor} strokeWidth="1" />
        {/* Weeds in path */}
        <path d="M520 550 Q515 540 510 545 M640 550 Q645 540 650 545" stroke={inkColor} strokeWidth="0.8" fill="none" />
        <path d="M508 580 Q500 575 495 585 M655 580 Q665 575 670 585" stroke={inkColor} strokeWidth="0.8" fill="none" />
        {/* Path Textures (Stones, Pitting) */}
        <path d="M520 590 Q 540 580 560 590" stroke={inkColor} strokeWidth="0.6" fill="none" />
        <path d="M580 585 Q 600 575 620 580" stroke={inkColor} strokeWidth="0.6" fill="none" />
        <path d="M540 565 Q 560 555 580 565" stroke={inkColor} strokeWidth="0.6" fill="none" />
      </g>

      {/* --- RIGHT WINDOW & PLANTER --- */}
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
        {/* Window Sill Cracks */}
        <path d="M0 160 L-10 170 M180 160 L190 165" stroke={inkColor} strokeWidth="0.6" />
      </g>

      {/* Planter Box */}
      <g transform="translate(650, 460)">
        <path d="M 30 60 L 20 30 L 35 40 L 45 20 L 55 40 L 70 30 L 60 60 Z" fill="#ffffff" stroke={inkColor} strokeWidth="0.8" />
        <path d="M 80 60 L 70 40 L 80 45 L 85 25 L 90 45 L 100 40 L 90 60 Z" fill="#ffffff" stroke={inkColor} strokeWidth="0.8" />
        <path d="M 140 60 C 120 60, 120 45, 140 30 C 150 15, 170 30, 150 45 C 170 45, 180 60, 140 60 Z" fill="#ffffff" stroke={inkColor} strokeWidth="0.8" />
        <circle cx="150" cy="32" r="2" fill={inkColor} />
        <path d="M 135 35 L 145 40" stroke={inkColor} strokeWidth="0.8" />
        <path d="M 190 60 L 190 20 C 190 -5, 220 -5, 220 20 L 220 60" fill="#ffffff" stroke={inkColor} strokeWidth="0.8" />

        <rect x="0" y="60" width="240" height="50" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
        <path d="M 0 75 L 240 75 M 0 90 L 240 90 M 0 105 L 240 105" stroke={inkColor} strokeWidth="0.5" opacity="0.3" />
        {/* Wood Knots */}
        <circle cx="40" cy="82" r="4" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.5" />
        <path d="M30 82 Q40 65 50 82" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.5" />
        <circle cx="180" cy="98" r="3" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.5" />
        <path d="M170 98 Q180 85 190 98" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.5" />
        <path d="M20 70 Q100 65 220 72" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.4" />
        <path d="M10 100 Q120 105 230 95" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.4" />
      </g>
    </>
  );
};

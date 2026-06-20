"use client";
import React from 'react';
import { motion } from "framer-motion";

export const TexturedInteractiveDoor = ({ 
  inkColor, 
  doorHovered,
  setDoorHovered,
  playKnock 
}: { 
  inkColor: string;
  doorHovered: boolean;
  setDoorHovered: (v: boolean) => void;
  playKnock: () => void;
}) => {
  return (
    <>
      <g transform="translate(580, 180)" filter="url(#soft-shadow)">
        {/* Left Chain Links */}
        <path d="M-62-36c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M-62-28c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M-62-20c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M-62-12c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M-62-4c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0" fill="none" stroke={inkColor} strokeWidth="0.8" />
        <path d="M-60-40v6 M-60-32v6 M-60-24v6 M-60-16v6 M-60-8v6 M-60 0v-4" stroke={inkColor} strokeWidth="0.8" />
        
        {/* Right Chain Links */}
        <path d="M58-36c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M58-28c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M58-20c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M58-12c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0 M58-4c0-2.2 4-2.2 4 0c0 2.2-4 2.2-4 0" fill="none" stroke={inkColor} strokeWidth="0.8" />
        <path d="M60-40v6 M60-32v6 M60-24v6 M60-16v6 M60-8v6 M60 0v-4" stroke={inkColor} strokeWidth="0.8" />

        <rect x="-110" y="0" width="220" height="50" rx="5" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
        
        {/* Detailed Manga Wood Grain for Sign */}
        <path d="M-105 8 Q-80 5 -50 12 T10 10 T60 8 T105 12 M-108 16 Q-70 14 -30 18 T30 15 T80 18 T108 14 M-100 38 Q-60 40 -20 36 T40 38 T90 35 M-105 45 Q-70 42 -40 45 T10 42 T60 46 T105 43" fill="none" stroke={inkColor} strokeWidth="0.4" opacity="0.6" />
        <path d="M-85 10 Q-80 14 -85 18 Q-90 14 -85 10 M75 32 Q80 36 75 40 Q70 36 75 32" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.6" />
        <path d="M-100 12 L-95 12 M-90 8 L-85 8 M-60 14 L-50 14 M30 12 L40 12 M80 16 L90 16" stroke={inkColor} strokeWidth="0.4" opacity="0.5" />

        <text x="0" y="35" fontFamily="'Inter', sans-serif" fontSize="28" fontWeight="bold" textAnchor="middle" fill={inkColor} letterSpacing="4">PORTFOLIO</text>
      </g>

      <g 
        transform="translate(500, 240)"
        onMouseEnter={() => { setDoorHovered(true); playKnock(); }}
        onMouseLeave={() => setDoorHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        <motion.rect 
          x="0" y="0" width="160" height="310" 
          fill="url(#door-watercolor)" 
          stroke={inkColor} strokeWidth="1.5"
          animate={{ scale: doorHovered ? 1.02 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Watercolor texture overly */}
        <rect x="0" y="0" width="160" height="310" fill="url(#door-sketch)" style={{ mixBlendMode: 'multiply' }} />

        {/* --- DOOR DETAILS START --- */}
        
        {/* Panels */}
        <rect x="10" y="10" width="60" height="130" fill="none" stroke={inkColor} strokeWidth="1" />
        <rect x="15" y="15" width="50" height="120" fill="none" stroke={inkColor} strokeWidth="0.6" />
        <rect x="10" y="150" width="60" height="150" fill="none" stroke={inkColor} strokeWidth="1" />
        <rect x="15" y="155" width="50" height="140" fill="none" stroke={inkColor} strokeWidth="0.6" />
        
        <rect x="90" y="10" width="60" height="130" fill="none" stroke={inkColor} strokeWidth="1" />
        <rect x="95" y="15" width="50" height="120" fill="none" stroke={inkColor} strokeWidth="0.6" />
        <rect x="90" y="150" width="60" height="150" fill="none" stroke={inkColor} strokeWidth="1" />
        <rect x="95" y="155" width="50" height="140" fill="none" stroke={inkColor} strokeWidth="0.6" />

        {/* Wrought Iron Door Hinges (Ornate) */}
        <path d="M 5 20 L 30 20 C 35 15, 35 25, 30 20 Z" fill="none" stroke={inkColor} strokeWidth="1" />
        <path d="M 5 290 L 30 290 C 35 285, 35 295, 30 290 Z" fill="none" stroke={inkColor} strokeWidth="1" />
        
        <path d="M 155 20 L 130 20 C 125 15, 125 25, 130 20 Z" fill="none" stroke={inkColor} strokeWidth="1" />
        <path d="M 155 290 L 130 290 C 125 285, 125 295, 130 290 Z" fill="none" stroke={inkColor} strokeWidth="1" />

        {/* Wrought Iron Lantern (Disney Atmosphere) */}
        <g transform="translate(180, 80)">
          {/* Lantern Bracket */}
          <path d="M 0 0 C 20 -10, 30 10, 40 0" stroke={inkColor} strokeWidth="1" fill="none" />
          <path d="M 5 5 C 15 15, 25 15, 35 5" stroke={inkColor} strokeWidth="0.5" fill="none" />
          
          {/* Chain */}
          <path d="M 35 0 L 35 20" stroke={inkColor} strokeWidth="1" />
          
          {/* Lantern Body */}
          <path d="M 25 20 L 45 20 L 50 50 L 20 50 Z" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
          <path d="M 20 50 L 50 50 L 40 60 L 30 60 Z" fill="none" stroke={inkColor} strokeWidth="1" />
          <path d="M 28 20 L 35 10 L 42 20 Z" fill="none" stroke={inkColor} strokeWidth="1" />
          
          {/* Glowing Light inside */}
          <circle cx="35" cy="38" r="6" fill="#fdfbf7" stroke={inkColor} strokeWidth="0.5" />
          <path d="M 35 25 L 35 50 M 27 35 L 43 35" stroke={inkColor} strokeWidth="0.5" />
          
          {/* Magical Sparkles around lantern */}
          <motion.circle r={1.5} cx="10" cy="40" fill={inkColor} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0], y: -20 }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle r={1} cx="55" cy="20" fill={inkColor} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0], y: -15 }} transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle r={2} cx="45" cy="65" fill={inkColor} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0], y: -25 }} transition={{ duration: 3.5, delay: 2, repeat: Infinity, ease: "easeInOut" }} />
        </g>

        {/* Panel 3D Corners */}
        <path d="M10 10 L15 15 M70 10 L65 15 M10 140 L15 135 M70 140 L65 135" stroke={inkColor} strokeWidth="0.6" />
        <path d="M10 150 L15 155 M70 150 L65 155 M10 300 L15 295 M70 300 L65 295" stroke={inkColor} strokeWidth="0.6" />
        <path d="M90 10 L95 15 M150 10 L145 15 M90 140 L95 135 M150 140 L145 135" stroke={inkColor} strokeWidth="0.6" />
        <path d="M90 150 L95 155 M150 150 L145 155 M90 300 L95 295 M150 300 L145 295" stroke={inkColor} strokeWidth="0.6" />

        {/* Wood Grain: Stiles & Rails (Frame) */}
        <path d="M4 0 L4 310 M7 20 L7 290 M74 0 L74 310 M77 10 L77 300" stroke={inkColor} strokeWidth="0.3" opacity="0.6" strokeDasharray="10 4 20 4" />
        <path d="M84 0 L84 310 M87 20 L87 290 M154 0 L154 310 M157 10 L157 300" stroke={inkColor} strokeWidth="0.3" opacity="0.6" strokeDasharray="15 5 25 5" />
        <path d="M10 5 L70 5 M10 8 L70 8 M90 5 L150 5 M90 8 L150 8" stroke={inkColor} strokeWidth="0.3" opacity="0.6" strokeDasharray="10 3 5 3" />
        <path d="M10 144 L70 144 M10 147 L70 147 M90 144 L150 144 M90 147 L150 147" stroke={inkColor} strokeWidth="0.3" opacity="0.6" strokeDasharray="8 4 12 4" />
        <path d="M10 304 L70 304 M10 307 L70 307 M90 304 L150 304 M90 307 L150 307" stroke={inkColor} strokeWidth="0.3" opacity="0.6" strokeDasharray="15 3 5 3" />

        {/* Wood Grain: Inner Panels */}
        <path d="M25 25 Q35 50 25 90 M55 30 Q45 60 55 110 M35 40 Q45 75 35 120" fill="none" stroke={inkColor} strokeWidth="0.4" opacity="0.7" />
        <path d="M40 85 Q35 90 40 95 Q45 90 40 85 M40 80 Q30 90 40 100 Q50 90 40 80" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.8" />
        
        <path d="M25 170 Q35 200 25 250 M55 180 Q45 220 55 270 M35 190 Q45 230 35 280" fill="none" stroke={inkColor} strokeWidth="0.4" opacity="0.7" />
        <path d="M45 235 Q40 240 45 245 Q50 240 45 235 M45 230 Q35 240 45 250 Q55 240 45 230" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.8" />

        <path d="M105 30 Q115 60 105 100 M135 20 Q125 50 135 90 M120 40 Q130 80 120 120" fill="none" stroke={inkColor} strokeWidth="0.4" opacity="0.7" />
        <path d="M115 75 Q110 80 115 85 Q120 80 115 75 M115 70 Q105 80 115 90 Q125 80 115 70" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.8" />

        <path d="M105 180 Q115 210 105 260 M135 170 Q125 200 135 250 M120 190 Q130 240 120 280" fill="none" stroke={inkColor} strokeWidth="0.4" opacity="0.7" />
        <path d="M125 225 Q120 230 125 235 Q130 230 125 225 M125 220 Q115 230 125 240 Q135 230 125 220" fill="none" stroke={inkColor} strokeWidth="0.5" opacity="0.8" />

        {/* Details & Scratches */}
        <path d="M20 60 L25 58 M130 110 L135 112 M40 260 L45 255 M110 200 L115 202 M60 210 L65 205 M140 60 L145 65" stroke={inkColor} strokeWidth="0.6" />
        
        {/* Door Handles */}
        <circle cx="68" cy="145" r="5" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
        <path d="M68 150 C62 155 62 165 68 170" fill="none" stroke={inkColor} strokeWidth="1" />
        <circle cx="92" cy="145" r="5" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
        <path d="M92 150 C98 155 98 165 92 170" fill="none" stroke={inkColor} strokeWidth="1" />

        {/* Central Split */}
        <path d="M80 0 L80 310" stroke={inkColor} strokeWidth="1.5" />
        <path d="M78 0 L78 310 M82 0 L82 310" stroke={inkColor} strokeWidth="0.3" opacity="0.4" />

        {/* --- DOOR DETAILS END --- */}
        
        {/* Anime Sketch Character Drawing on the door */}
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
          
          {/* Companion creature (like a mini-Totoro) on shoulder */}
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
      </g>
    </>
  );
};

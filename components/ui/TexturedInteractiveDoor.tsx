"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";

import { soundEngine } from '@/lib/SoundEngine';

export const TexturedInteractiveDoor = ({ 
  inkColor, 
  isMobile 
}: { 
  inkColor: string;
  isMobile?: boolean;
}) => {
  const [doorHovered, setDoorHovered] = useState(false);
  return (
    <>
      <g transform={isMobile ? "translate(140, 50) scale(2.2)" : "translate(400, 50) scale(2.2)"}>
        {/* Sign Group */}
        <g transform="translate(128, -60)">
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
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') {
              setDoorHovered(true);
              soundEngine.init();
              soundEngine.playKnock();
            }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') {
              setDoorHovered(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              soundEngine.init();
              soundEngine.playKnock();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Knock on door"
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          {/* Solid background to block bricks */}
          <rect x="0" y="0" width="160" height="310" fill="#fdfbf7" />
          
          <motion.rect 
            x="0" y="0" width="160" height="310" 
            fill="transparent" 
            stroke={inkColor} strokeWidth="1.5"
            style={{ transformOrigin: "center" }}
            animate={{ scale: doorHovered ? 1.02 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

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
      </g>
    </g>
  </>
  );
};

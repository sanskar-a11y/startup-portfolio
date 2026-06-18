"use client";

import { motion } from "framer-motion";

export const PremiumTreeLeft = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 300"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 1.5,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.05))"
      }}
    >
      {/* Elegant Trunk */}
      <path d="M100 300 Q95 200 100 120 M90 300 Q92 230 85 150 M110 300 Q105 230 105 170" />

      {/* Swaying canopy/branches */}
      <motion.g
        animate={{ rotate: [-0.5, 1, -0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 150px" }}
      >
        {/* Branch structure */}
        <path d="M98 170 Q60 150 40 130 M88 200 Q50 190 30 160" />
        <path d="M100 160 Q140 140 160 110 M102 180 Q150 170 180 150" />
        <path d="M100 120 Q90 90 70 70 M100 120 Q120 80 140 60 M100 120 L105 65" />

        {/* Delicate, layered canopy outlines */}
        <path d="M40 120 C 10 120, 10 70, 40 60 C 50 30, 90 20, 110 30 C 140 10, 180 30, 170 70 C 190 90, 170 130, 140 120 C 120 140, 70 140, 40 120 Z" fill="#faf7f2" fillOpacity="0.8" />
        <path d="M50 100 C 30 100, 30 60, 50 50 C 60 25, 90 20, 110 25 C 130 10, 160 25, 150 55 C 170 70, 150 100, 130 95 C 110 110, 70 110, 50 100 Z" fill="#ffffff" fillOpacity="0.5" />
        
        {/* Subtle leaf details */}
        <path d="M60 50 Q70 40 80 55 M130 40 Q140 30 150 45 M150 80 Q160 70 170 85 M50 80 Q60 70 70 85" strokeWidth="1" />
      </motion.g>
    </svg>
  );
};

export const PremiumTreeRight = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 300"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 1.5,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.05))"
      }}
    >
      {/* Elegant Trunk */}
      <path d="M100 300 Q105 200 100 120 M110 300 Q108 230 115 150 M90 300 Q95 230 95 170" />

      {/* Swaying canopy/branches */}
      <motion.g
        animate={{ rotate: [0.5, -1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 150px" }}
      >
        {/* Branch structure */}
        <path d="M102 170 Q140 150 160 130 M112 200 Q150 190 170 160" />
        <path d="M100 160 Q60 140 40 110 M98 180 Q50 170 20 150" />
        <path d="M100 120 Q110 90 130 70 M100 120 Q80 80 60 60 M100 120 L95 65" />

        {/* Canopy outlines */}
        <path d="M160 120 C 190 120, 190 70, 160 60 C 150 30, 110 20, 90 30 C 60 10, 20 30, 30 70 C 10 90, 30 130, 60 120 C 80 140, 130 140, 160 120 Z" fill="#faf7f2" fillOpacity="0.8" />
        <path d="M150 100 C 170 100, 170 60, 150 50 C 140 25, 110 20, 90 25 C 70 10, 40 25, 50 55 C 30 70, 50 100, 70 95 C 90 110, 130 110, 150 100 Z" fill="#ffffff" fillOpacity="0.5" />

        {/* Rope with mouse hanging from branch */}
        <motion.g
          whileHover={{ rotate: [0, 8, -6, 3, 0] }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 120px", cursor: "pointer" }}
        >
          {/* Rope */}
          <path d="M60 120 Q62 170 60 220" strokeWidth="1" />
          
          {/* Mouse */}
          <g transform="translate(60, 220)" fill="#ffffff">
            <path d="M-10,0 C-12,-12 12,-12 10,0 L12,18 C12,30 -12,30 -12,18 Z" />
            <path d="M-12,8 Q0,10 12,8" />
            <path d="M0,8 L0,-2" />
            <path d="M-2,0 L2,0 M-2,2 L2,2" />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  );
};

export const PremiumHouseFacade = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 1.5,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        filter: "drop-shadow(0px 15px 30px rgba(0,0,0,0.08))"
      }}
    >
      <defs>
        {/* Subtle Brick Pattern */}
        <pattern id="brick" width="20" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 5 L20 5 M10 5 L10 10 M0 0 L0 5" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.2" />
        </pattern>
        {/* Glass reflection */}
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Main House Block */}
      <rect x="60" y="80" width="280" height="220" fill="url(#brick)" />
      
      {/* Foundation Line */}
      <path d="M20 300 L380 300" strokeWidth="2" />
      <path d="M40 295 L360 295" strokeWidth="1" opacity="0.5" />

      {/* Roof / Cornice */}
      <path d="M50 80 L350 80 L340 60 L60 60 Z" fill="#ffffff" strokeWidth="2" />
      <path d="M55 60 L345 60 L335 40 L65 40 Z" fill="#faf7f2" />
      
      {/* Left Window */}
      <g transform="translate(90, 120)">
        {/* Frame */}
        <rect x="0" y="0" width="60" height="100" fill="#ffffff" />
        {/* Inner Frame */}
        <rect x="5" y="5" width="50" height="90" fill="url(#glass)" />
        {/* Mullions */}
        <path d="M25 5 L25 95 M5 50 L55 50 M5 30 L55 30 M5 70 L55 70" />
        {/* Ledge */}
        <path d="M-5 100 L65 100 L65 105 L-5 105 Z" fill="#ffffff" />
        {/* Arch over window */}
        <path d="M0 0 C 15 -15, 45 -15, 60 0" strokeWidth="1" />
      </g>

      {/* Right Window */}
      <g transform="translate(250, 120)">
        <rect x="0" y="0" width="60" height="100" fill="#ffffff" />
        <rect x="5" y="5" width="50" height="90" fill="url(#glass)" />
        <path d="M25 5 L25 95 M5 50 L55 50 M5 30 L55 30 M5 70 L55 70" />
        <path d="M-5 100 L65 100 L65 105 L-5 105 Z" fill="#ffffff" />
        <path d="M0 0 C 15 -15, 45 -15, 60 0" strokeWidth="1" />
      </g>

      {/* Grand Entrance (Door) */}
      <g transform="translate(170, 130)">
        {/* Door frame */}
        <path d="M0 170 L0 20 C 0 -10, 60 -10, 60 20 L60 170 Z" fill="#ffffff" strokeWidth="2" />
        
        {/* Left Door Panel */}
        <rect x="5" y="25" width="24" height="140" fill="url(#glass)" />
        <path d="M12 35 L22 35 M12 45 L22 45 M12 55 L22 55" strokeWidth="1" />
        {/* Right Door Panel */}
        <rect x="31" y="25" width="24" height="140" fill="url(#glass)" />
        <path d="M38 35 L48 35 M38 45 L48 45 M38 55 L48 55" strokeWidth="1" />

        {/* Intricate Handles */}
        <circle cx="23" cy="95" r="3" fill="#1a1a1a" />
        <circle cx="37" cy="95" r="3" fill="#1a1a1a" />
        <path d="M23 98 L23 115 M37 98 L37 115" strokeWidth="2" />

        {/* Steps leading up */}
        <path d="M-10 170 L70 170 M-20 180 L80 180 M-30 190 L90 190" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

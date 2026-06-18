"use client";

import { motion } from "framer-motion";

export const MinimalTree = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 250"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 2,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    >
      {/* Trunk scribbles */}
      <path d="M100 250 Q95 150 100 70 M90 250 Q92 180 85 100 M110 250 Q105 180 105 120" />

      {/* Swaying canopy/branches */}
      <motion.g
        animate={{ rotate: [-1, 2, -1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 100px" }}
      >
        {/* Branch outlines */}
        <path d="M98 120 Q60 100 40 80 M88 150 Q50 140 30 110" />
        <path d="M100 110 Q140 90 160 60 M102 130 Q150 120 180 100" />
        <path d="M100 70 Q90 40 70 20 M100 70 Q120 30 140 10 M100 70 L105 15" />

        {/* Scribbly leaves/blobs outline */}
        <path
          d="M20 90 Q10 70 30 50 Q50 30 70 40 Q80 10 110 10 Q140 10 150 30 Q180 30 180 60 Q180 90 160 100 Q170 120 140 130 Q110 140 100 130 Q80 140 50 130 Q20 120 20 90"
        />
        <path
          d="M30 85 Q20 65 40 45 Q60 25 80 35 Q90 5 120 5 Q150 5 160 25 Q190 25 190 55 Q190 85 170 95 Q180 115 150 125 Q120 135 110 125 Q90 135 60 125 Q30 115 30 85"
        />

        {/* Rope with mouse */}
        <motion.g
          whileHover={{ rotate: [0, 15, -10, 5, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ transformOrigin: "140px 90px", cursor: "pointer" }}
        >
          {/* Rope */}
          <path d="M140 90 Q142 135 140 180" />

          {/* Mouse */}
          <g transform="translate(140, 180)">
            {/* Mouse body */}
            <path d="M-8,0 C-10,-10 10,-10 8,0 L10,15 C10,25 -10,25 -10,15 Z" />
            {/* Buttons & Scroll wheel divider */}
            <path d="M-10,5 Q0,7 10,5" />
            <path d="M0,5 L0,-2" />
            {/* Scroll wheel */}
            <path d="M-2,0 L2,0 M-2,2 L2,2" />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  );
};

export const MinimalGate = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      style={{
        stroke: "#1a1a1a",
        strokeWidth: 2,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    >
      {/* Pillars */}
      <path d="M40 200 L40 60 M60 200 L60 60 M40 60 Q50 50 60 60" />
      <path d="M140 200 L140 60 M160 200 L160 60 M140 60 Q150 50 160 60" />

      {/* Arch over the gate */}
      <path d="M60 70 Q100 40 140 70 M60 80 Q100 50 140 80" />

      {/* Left Gate Door */}
      <path d="M60 180 L95 180 L95 95 L60 95" />
      <path d="M67 180 L67 95 M74 180 L74 95 M81 180 L81 95 M88 180 L88 95" />

      {/* Right Gate Door */}
      <path d="M140 180 L105 180 L105 95 L140 95" />
      <path d="M133 180 L133 95 M126 180 L126 95 M119 180 L119 95 M112 180 L112 95" />

      {/* Gate Handles/Locks */}
      <path d="M90 140 Q95 140 95 145" />
      <path d="M110 140 Q105 140 105 145" />

      {/* Scribble ground */}
      <path d="M20 200 Q100 198 180 200 M10 195 Q100 193 190 196" />
    </svg>
  );
};

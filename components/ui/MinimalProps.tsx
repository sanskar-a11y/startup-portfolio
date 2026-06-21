"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { TexturedInteractiveDoor } from './TexturedInteractiveDoor';
import { TexturedWindow } from './TexturedWindow';
import { useWindowSize } from '@/hooks/useWindowSize';

const SketchSVG = ({ isMobile, className, sceneHovered, setSceneHovered }: any) => {
  const inkColor = "#1a1a1a";
  const paperColor = "#fdfbf7";

  return (
    <svg
      className={className}
      viewBox={isMobile ? "-400 -200 1400 2400" : "-500 -200 2000 1000"}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setSceneHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setSceneHovered(false);
      }}
      style={{ overflow: 'visible' }}
    >
      <title>Interactive sketched architecture with an entryway</title>
      
      <defs>
        <pattern id={`wall-pattern-${isMobile ? 'm' : 'd'}`} patternUnits="userSpaceOnUse" width="800" height="800">
          <image href="/images/wall_bg.png" width="800" height="800" preserveAspectRatio="none" role="presentation" aria-hidden="true" />
        </pattern>
        <pattern id={`ground-pattern-${isMobile ? 'm' : 'd'}`} patternUnits="userSpaceOnUse" width="800" height="800" patternTransform="translate(0, 150)">
          <image href="/images/ground_bg.png" width="800" height="800" preserveAspectRatio="none" role="presentation" aria-hidden="true" />
        </pattern>
        <clipPath id={`window-clip-${isMobile ? 'm' : 'd'}`}>
          <rect x="5" y="5" width="170" height="150" />
        </clipPath>
      </defs>

      {/* Static Backgrounds */}
      <rect x="-1500" y="-1000" width="4000" height="3000" fill={paperColor} />
      <rect x="-1500" y="-1000" width="4000" height="5000" fill={`url(#wall-pattern-${isMobile ? 'm' : 'd'})`} opacity="0.8" />
      <rect x="-1500" y="550" width="4000" height="800" fill={`url(#ground-pattern-${isMobile ? 'm' : 'd'})`} opacity="0.9" />
      <rect x="-1500" y="1350" width="4000" height="3000" fill="#f0ece6" opacity="0.85" />

      {/* Animated Scene Elements */}
      <motion.g 
        animate={ sceneHovered ? { y: [-2, 2] } : { y: 0 } }
        transition={ sceneHovered ? { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } : { duration: 0.5, ease: "easeOut" } }
      >
        {/* Layer 2: Independent Modular Props */}
        <image href="/images/cat.png" x={isMobile ? "100" : "280"} y={isMobile ? "520" : "470"} width="180" height="180" preserveAspectRatio="xMidYMid meet" opacity="0.9" role="presentation" aria-hidden="true" />
        <image href="/images/planter.png" x={isMobile ? "125" : "1050"} y={isMobile ? "1300" : "400"} width="350" height="280" preserveAspectRatio="xMidYMid meet" opacity="0.9" role="presentation" aria-hidden="true" />

        {/* Interactive Door */}
        <TexturedInteractiveDoor 
          inkColor={inkColor} 
          isMobile={isMobile}
        />

        {/* Interactive Window */}
        <TexturedWindow isMobile={isMobile} inkColor={inkColor} />

        {/* Layer 3: Transparent Stylized Tree on the Left */}
        <image href="/images/tree_layer.png" x={isMobile ? "-1000" : "-1300"} y="-1000" width="1750" height="2100" preserveAspectRatio="xMidYMid meet" opacity="0.95" role="presentation" aria-hidden="true" />

        {/* Layer 4: Interactive Hanging Mouse */}
        <motion.g whileHover={{ rotate: [0, 8, -6, 3, 0] }} transition={{ duration: 2, ease: "easeInOut" }} style={{ transformOrigin: isMobile ? "230px -160px" : "-70px -160px", cursor: "pointer" }}>
          <path d={isMobile ? "M230 -160 C 240 150, 230 400, 240 580" : "M-70 -160 C -60 150, -70 400, -60 580"} fill="none" stroke={inkColor} strokeWidth="1" />
          <rect x={isMobile ? "220" : "-80"} y="580" width="40" height="60" rx="20" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
          <path d={isMobile ? "M230 580 L230 605" : "M-70 580 L-70 605"} stroke={inkColor} strokeWidth="1" />
        </motion.g>
      </motion.g>
    </svg>
  );
};

export const PortfolioSketchScene = ({ className = "" }: { className?: string }) => {
  const [sceneHovered, setSceneHovered] = useState(false);
  
  return (
    <>
      <SketchSVG 
        isMobile={true} 
        className={`${className} mobile-only`} 
        sceneHovered={sceneHovered} 
        setSceneHovered={setSceneHovered} 
      />
      <SketchSVG 
        isMobile={false} 
        className={`${className} desktop-only`} 
        sceneHovered={sceneHovered} 
        setSceneHovered={setSceneHovered} 
      />
    </>
  );
};

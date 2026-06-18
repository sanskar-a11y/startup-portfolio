import React from 'react';
import { motion } from 'framer-motion';

// Common sketch styling: rough lines, wobbly strokes
const strokeColor = '#1a1a1a';
const strokeWidth = '2';

const svgContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariant = {
  hidden: { pathLength: 0, fillOpacity: 0 },
  visible: { 
    pathLength: 1, 
    fillOpacity: 1,
    transition: { 
      pathLength: { type: "spring" as const, duration: 1.5, bounce: 0 },
      fillOpacity: { delay: 0.2, duration: 0.8 } 
    }
  }
};

const itemVariantSlow = {
  hidden: { pathLength: 0, fillOpacity: 0 },
  visible: { 
    pathLength: 1, 
    fillOpacity: 1,
    transition: { 
      pathLength: { type: "spring" as const, duration: 2.5, bounce: 0 },
      fillOpacity: { delay: 0.5, duration: 1 } 
    }
  }
};

const textVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1 } 
  }
};

const brickFacadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.1, transition: { duration: 2 } }
};

const absoluteTopLeftZNegative1: React.CSSProperties = { position: 'absolute', top: 0, left: 0, zIndex: -1 };
const absoluteTop100Left0Z0: React.CSSProperties = { position: 'absolute', top: '-100px', left: 0, zIndex: 0 };
const giantTreeStyle: React.CSSProperties = { position: 'absolute', left: '-5%', bottom: '-5%', width: '75%', height: '120%', zIndex: 10 };
const stonePathStyle: React.CSSProperties = { position: 'absolute', bottom: '-20px', left: 0, zIndex: 1 };
const hangingSignContainerStyle: React.CSSProperties = { position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 15, textAlign: 'center' };
const rightWindowStyle: React.CSSProperties = { position: 'absolute', right: '5%', top: '30%', width: '30%', height: 'auto', zIndex: 5 };
const catAndMailboxStyle: React.CSSProperties = { position: 'absolute', right: '20%', bottom: '10%', width: '20%', height: 'auto', zIndex: 12 };
const gardenBedStyle: React.CSSProperties = { position: 'absolute', right: '5%', bottom: '2%', width: '40%', height: 'auto', zIndex: 11 };

export const BrickFacade = () => (
  <motion.svg 
    variants={brickFacadeVariants}
    width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="landing-brick-facade" style={absoluteTopLeftZNegative1}>
    <pattern id="brick" width="60" height="30" patternUnits="userSpaceOnUse">
      <path d="M0,15 L60,15 M30,15 L30,30 M60,0 L60,15" fill="none" stroke={strokeColor} strokeWidth="1" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#brick)" />
  </motion.svg>
);

export const RoofStructure = () => (
  <motion.svg variants={svgContainer} width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" style={absoluteTop100Left0Z0} xmlns="http://www.w3.org/2000/svg">
    <motion.path variants={itemVariant} d="M0,150 L500,20 L1000,150" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />
    {/* Chimney */}
    <motion.rect variants={itemVariant} x="700" y="50" width="40" height="80" fill="none" stroke={strokeColor} strokeWidth="2" />
    {/* Roof Shingles Hatching */}
    <motion.path variants={itemVariant} d="M50,130 L450,20 M100,130 L450,30 M550,30 L900,130 M550,20 L950,130" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.3" />
  </motion.svg>
);

export const GiantTree = () => (
  <motion.svg variants={svgContainer} viewBox="0 0 400 800" style={giantTreeStyle} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    {/* Trunk */}
    <motion.path variants={itemVariantSlow} d="M150,800 Q140,500 180,300 Q190,400 220,800 Z" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    {/* Bark hatching */}
    <motion.path variants={itemVariant} d="M160,700 Q165,600 175,500 M170,750 Q180,650 185,450 M190,780 Q195,600 190,350" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="10 5" opacity="0.5" />
    {/* Massive Canopy */}
    <motion.path variants={itemVariantSlow} d="M50,300 C-50,200 50,-50 200,0 C350,-50 450,200 350,300 C400,450 250,450 200,400 C150,450 0,450 50,300 Z" fill="#fff" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
    {/* Leaves hatching */}
    <motion.path variants={itemVariant} d="M100,200 Q150,150 200,250 M250,100 Q300,150 250,250 M150,100 Q200,50 250,150" fill="none" stroke={strokeColor} strokeWidth="1.5" />
    
    {/* Hanging Computer Mouse */}
    <motion.path variants={itemVariant} d="M280,280 C280,350 300,400 300,450" fill="none" stroke={strokeColor} strokeWidth="1.5" />
    <motion.rect variants={itemVariant} x="285" y="450" width="30" height="45" rx="15" ry="15" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.line variants={itemVariant} x1="285" y1="465" x2="315" y2="465" stroke={strokeColor} strokeWidth="2" />
    <motion.line variants={itemVariant} x1="300" y1="450" x2="300" y2="465" stroke={strokeColor} strokeWidth="2" />
    <motion.circle variants={itemVariant} cx="300" cy="458" r="3" fill={strokeColor} />
  </motion.svg>
);

export const StonePath = () => (
  <motion.svg variants={svgContainer} width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" style={stonePathStyle} xmlns="http://www.w3.org/2000/svg">
    <motion.path variants={itemVariant} d="M400,0 C350,100 200,200 100,200 M600,0 C650,100 800,200 900,200" fill="none" stroke={strokeColor} strokeWidth="2" />
    {/* Stepping Stones */}
    <motion.ellipse variants={itemVariant} cx="480" cy="40" rx="30" ry="10" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.ellipse variants={itemVariant} cx="520" cy="80" rx="40" ry="12" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.ellipse variants={itemVariant} cx="490" cy="130" rx="50" ry="15" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.ellipse variants={itemVariant} cx="540" cy="180" rx="60" ry="18" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.ellipse variants={itemVariant} cx="470" cy="170" rx="35" ry="12" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    {/* Fallen Leaves */}
    <motion.path variants={itemVariant} d="M450,150 Q455,145 460,150 Q455,155 450,150 Z" fill="#fff" stroke={strokeColor} strokeWidth="1" />
    <motion.path variants={itemVariant} d="M560,120 Q565,115 570,120 Q565,125 560,120 Z" fill="#fff" stroke={strokeColor} strokeWidth="1" />
  </motion.svg>
);

export const HangingSign = () => (
  <div style={hangingSignContainerStyle}>
    <motion.svg variants={svgContainer} width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
      {/* Chains */}
      <motion.line variants={itemVariant} x1="40" y1="0" x2="40" y2="30" stroke={strokeColor} strokeWidth="2" />
      <motion.line variants={itemVariant} x1="160" y1="0" x2="160" y2="30" stroke={strokeColor} strokeWidth="2" />
      {/* Wooden Board */}
      <motion.path variants={itemVariant} d="M10,30 L190,32 L188,70 L12,68 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
      {/* Wood grain */}
      <motion.path variants={itemVariant} d="M20,40 Q80,45 180,38 M15,50 Q100,55 185,50 M20,60 Q90,62 180,58" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
      <motion.text variants={textVariant} x="100" y="56" fontFamily="Courier New, monospace" fontSize="18" fontWeight="bold" textAnchor="middle" fill={strokeColor}>PORTFOLIO</motion.text>
    </motion.svg>
  </div>
);

export const RightWindow = () => (
  <motion.svg variants={svgContainer} viewBox="0 0 300 400" style={rightWindowStyle} xmlns="http://www.w3.org/2000/svg">
    {/* Window Frame */}
    <motion.rect variants={itemVariant} x="50" y="50" width="200" height="250" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    {/* Crossbars */}
    <motion.line variants={itemVariant} x1="150" y1="50" x2="150" y2="300" stroke={strokeColor} strokeWidth="2" />
    <motion.line variants={itemVariant} x1="50" y1="175" x2="250" y2="175" stroke={strokeColor} strokeWidth="2" />
    
    {/* Window Shadows / Hatching (interior life) */}
    <motion.path variants={itemVariant} d="M60,60 L140,165 M70,60 L140,150 M80,60 L140,135 M160,60 L240,165 M170,60 L240,150 M60,185 L140,290 M160,185 L240,290" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.6" strokeLinecap="round" />

    {/* Flower Box */}
    <motion.rect variants={itemVariant} x="40" y="300" width="220" height="40" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    {/* Succulents & Plants */}
    <motion.path variants={itemVariant} d="M60,300 C50,280 70,270 80,290 Z M100,300 C90,260 130,250 120,300 Z M150,300 C140,270 170,260 180,300 Z M200,300 C190,280 230,260 220,300 Z M230,300 C240,270 250,280 240,300 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
  </motion.svg>
);

export const CatAndMailbox = () => (
  <motion.svg variants={svgContainer} viewBox="0 0 200 200" style={catAndMailboxStyle} xmlns="http://www.w3.org/2000/svg">
    {/* Mailbox Post */}
    <motion.line variants={itemVariant} x1="150" y1="100" x2="150" y2="200" stroke={strokeColor} strokeWidth="4" />
    {/* Mailbox Body */}
    <motion.path variants={itemVariant} d="M120,100 C120,70 180,70 180,100 L180,120 L120,120 Z" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    <motion.rect variants={itemVariant} x="110" y="120" width="80" height="10" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    {/* Flag */}
    <motion.line variants={itemVariant} x1="170" y1="100" x2="170" y2="70" stroke={strokeColor} strokeWidth="2" />
    <motion.rect variants={itemVariant} x="170" y="70" width="15" height="10" fill={strokeColor} />

    {/* Sleeping Cat on Mailbox */}
    <motion.path variants={itemVariant} d="M130,100 C130,80 160,80 160,100 C160,100 170,90 170,100 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    {/* Cat Ears */}
    <motion.polygon variants={itemVariant} points="160,90 165,85 168,92" fill="#fff" stroke={strokeColor} strokeWidth="1.5" />
    <motion.polygon variants={itemVariant} points="168,92 173,85 175,95" fill="#fff" stroke={strokeColor} strokeWidth="1.5" />

    {/* Watering Can on the ground */}
    <motion.path variants={itemVariant} d="M100,180 C90,180 90,160 100,160 L120,160 C130,160 130,180 120,180 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.path variants={itemVariant} d="M125,170 L140,160" fill="none" stroke={strokeColor} strokeWidth="2" />
  </motion.svg>
);

export const GardenBed = () => (
  <motion.svg variants={svgContainer} viewBox="0 0 300 100" style={gardenBedStyle} xmlns="http://www.w3.org/2000/svg">
    {/* Grass tufts */}
    <motion.path variants={itemVariant} d="M50,80 Q45,50 60,80 M55,80 Q55,40 65,80 M60,80 Q65,60 70,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <motion.path variants={itemVariant} d="M150,80 Q145,60 160,80 M155,80 Q155,50 165,80 M160,80 Q165,70 170,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <motion.path variants={itemVariant} d="M250,80 Q245,50 260,80 M255,80 Q255,40 265,80 M260,80 Q265,60 270,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <motion.path variants={itemVariant} d="M100,80 Q95,60 110,80 M105,80 Q105,40 115,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <motion.path variants={itemVariant} d="M200,80 Q195,50 210,80 M205,80 Q205,60 215,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    {/* Ground lines */}
    <motion.line variants={itemVariant} x1="10" y1="85" x2="290" y2="85" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    
    {/* Tiny Duck */}
    <motion.path variants={itemVariant} d="M220,80 C210,80 210,70 220,70 C225,70 225,65 230,65 C235,65 235,70 230,70 C240,70 240,80 230,80 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <motion.path variants={itemVariant} d="M230,67 L235,67" fill="none" stroke={strokeColor} strokeWidth="2" />
  </motion.svg>
);

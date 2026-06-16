import React from 'react';

// Common sketch styling: rough lines, wobbly strokes
const strokeColor = '#1a1a1a';
const strokeWidth = '2';

export const BrickFacade = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="landing-brick-facade" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.1, zIndex: -1 }}>
    <pattern id="brick" width="60" height="30" patternUnits="userSpaceOnUse">
      <path d="M0,15 L60,15 M30,15 L30,30 M60,0 L60,15" fill="none" stroke={strokeColor} strokeWidth="1" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#brick)" />
  </svg>
);

export const RoofStructure = () => (
  <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ position: 'absolute', top: '-100px', left: 0, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
    <path d="M0,150 L500,20 L1000,150" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />
    {/* Chimney */}
    <rect x="700" y="50" width="40" height="80" fill="none" stroke={strokeColor} strokeWidth="2" />
    {/* Roof Shingles Hatching */}
    <path d="M50,130 L450,20 M100,130 L450,30 M550,30 L900,130 M550,20 L950,130" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.3" />
  </svg>
);

export const GiantTree = () => (
  <svg viewBox="0 0 400 800" style={{ position: 'absolute', left: '-5%', bottom: '-5%', width: '75%', height: '120%', zIndex: 10 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    {/* Trunk */}
    <path d="M150,800 Q140,500 180,300 Q190,400 220,800 Z" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    {/* Bark hatching */}
    <path d="M160,700 Q165,600 175,500 M170,750 Q180,650 185,450 M190,780 Q195,600 190,350" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="10 5" opacity="0.5" />
    {/* Massive Canopy */}
    <path d="M50,300 C-50,200 50,-50 200,0 C350,-50 450,200 350,300 C400,450 250,450 200,400 C150,450 0,450 50,300 Z" fill="#fff" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
    {/* Leaves hatching */}
    <path d="M100,200 Q150,150 200,250 M250,100 Q300,150 250,250 M150,100 Q200,50 250,150" fill="none" stroke={strokeColor} strokeWidth="1.5" />
    
    {/* Hanging Swing */}
    <line x1="280" y1="280" x2="280" y2="550" stroke={strokeColor} strokeWidth="1.5" />
    <line x1="320" y1="280" x2="320" y2="550" stroke={strokeColor} strokeWidth="1.5" />
    <rect x="270" y="550" width="60" height="10" fill="#fff" stroke={strokeColor} strokeWidth="2" />
  </svg>
);

export const StonePath = () => (
  <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ position: 'absolute', bottom: '-20px', left: 0, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
    <path d="M400,0 C350,100 200,200 100,200 M600,0 C650,100 800,200 900,200" fill="none" stroke={strokeColor} strokeWidth="2" />
    {/* Stepping Stones */}
    <ellipse cx="480" cy="40" rx="30" ry="10" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <ellipse cx="520" cy="80" rx="40" ry="12" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <ellipse cx="490" cy="130" rx="50" ry="15" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <ellipse cx="540" cy="180" rx="60" ry="18" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <ellipse cx="470" cy="170" rx="35" ry="12" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    {/* Fallen Leaves */}
    <path d="M450,150 Q455,145 460,150 Q455,155 450,150 Z" fill="#fff" stroke={strokeColor} strokeWidth="1" />
    <path d="M560,120 Q565,115 570,120 Q565,125 560,120 Z" fill="#fff" stroke={strokeColor} strokeWidth="1" />
  </svg>
);

export const HangingSign = () => (
  <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 15, textAlign: 'center' }}>
    <svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
      {/* Chains */}
      <line x1="40" y1="0" x2="40" y2="30" stroke={strokeColor} strokeWidth="2" />
      <line x1="160" y1="0" x2="160" y2="30" stroke={strokeColor} strokeWidth="2" />
      {/* Wooden Board */}
      <path d="M10,30 L190,32 L188,70 L12,68 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
      {/* Wood grain */}
      <path d="M20,40 Q80,45 180,38 M15,50 Q100,55 185,50 M20,60 Q90,62 180,58" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
      <text x="100" y="56" fontFamily="Courier New, monospace" fontSize="18" fontWeight="bold" textAnchor="middle" fill={strokeColor}>PORTFOLIO</text>
    </svg>
  </div>
);

export const RightWindow = () => (
  <svg viewBox="0 0 300 400" style={{ position: 'absolute', right: '5%', top: '30%', width: '30%', height: 'auto', zIndex: 5 }} xmlns="http://www.w3.org/2000/svg">
    {/* Window Frame */}
    <rect x="50" y="50" width="200" height="250" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    {/* Crossbars */}
    <line x1="150" y1="50" x2="150" y2="300" stroke={strokeColor} strokeWidth="2" />
    <line x1="50" y1="175" x2="250" y2="175" stroke={strokeColor} strokeWidth="2" />
    
    {/* Window Shadows / Hatching (interior life) */}
    <path d="M60,60 L140,165 M70,60 L140,150 M80,60 L140,135 M160,60 L240,165 M170,60 L240,150 M60,185 L140,290 M160,185 L240,290" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.6" strokeLinecap="round" />

    {/* Flower Box */}
    <rect x="40" y="300" width="220" height="40" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    {/* Succulents & Plants */}
    <path d="M60,300 C50,280 70,270 80,290 Z M100,300 C90,260 130,250 120,300 Z M150,300 C140,270 170,260 180,300 Z M200,300 C190,280 230,260 220,300 Z M230,300 C240,270 250,280 240,300 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
  </svg>
);

export const CatAndMailbox = () => (
  <svg viewBox="0 0 200 200" style={{ position: 'absolute', right: '20%', bottom: '10%', width: '20%', height: 'auto', zIndex: 12 }} xmlns="http://www.w3.org/2000/svg">
    {/* Mailbox Post */}
    <line x1="150" y1="100" x2="150" y2="200" stroke={strokeColor} strokeWidth="4" />
    {/* Mailbox Body */}
    <path d="M120,100 C120,70 180,70 180,100 L180,120 L120,120 Z" fill="#fff" stroke={strokeColor} strokeWidth="3" />
    <rect x="110" y="120" width="80" height="10" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    {/* Flag */}
    <line x1="170" y1="100" x2="170" y2="70" stroke={strokeColor} strokeWidth="2" />
    <rect x="170" y="70" width="15" height="10" fill={strokeColor} />

    {/* Sleeping Cat on Mailbox */}
    <path d="M130,100 C130,80 160,80 160,100 C160,100 170,90 170,100 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    {/* Cat Ears */}
    <polygon points="160,90 165,85 168,92" fill="#fff" stroke={strokeColor} strokeWidth="1.5" />
    <polygon points="168,92 173,85 175,95" fill="#fff" stroke={strokeColor} strokeWidth="1.5" />

    {/* Watering Can on the ground */}
    <path d="M100,180 C90,180 90,160 100,160 L120,160 C130,160 130,180 120,180 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <path d="M125,170 L140,160" fill="none" stroke={strokeColor} strokeWidth="2" />
  </svg>
);

export const GardenBed = () => (
  <svg viewBox="0 0 300 100" style={{ position: 'absolute', right: '5%', bottom: '2%', width: '40%', height: 'auto', zIndex: 11 }} xmlns="http://www.w3.org/2000/svg">
    {/* Grass tufts */}
    <path d="M50,80 Q45,50 60,80 M55,80 Q55,40 65,80 M60,80 Q65,60 70,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M150,80 Q145,60 160,80 M155,80 Q155,50 165,80 M160,80 Q165,70 170,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M250,80 Q245,50 260,80 M255,80 Q255,40 265,80 M260,80 Q265,60 270,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M100,80 Q95,60 110,80 M105,80 Q105,40 115,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M200,80 Q195,50 210,80 M205,80 Q205,60 215,80" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    {/* Ground lines */}
    <line x1="10" y1="85" x2="290" y2="85" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    
    {/* Tiny Duck */}
    <path d="M220,80 C210,80 210,70 220,70 C225,70 225,65 230,65 C235,65 235,70 230,70 C240,70 240,80 230,80 Z" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <path d="M230,67 L235,67" fill="none" stroke={strokeColor} strokeWidth="2" />
  </svg>
);

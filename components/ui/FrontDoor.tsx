"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useUIStore } from '../../store/uiStore';
import { 
  BrickFacade, RoofStructure, GiantTree, StonePath, 
  HangingSign, RightWindow, CatAndMailbox, GardenBed 
} from './LandingProps';

const stickers = [
  'JS', 'TS', 'React', 'Node', 'CSS', 'HTML', 'WebGL', 
  'Three.js', 'GSAP', 'Next.js', 'Vite', 'Git', 'Figma', 'UI/UX', 'Startup'
];

export function FrontDoor() {
  const [doorState, setDoorState] = useState<'ready' | 'doors-open' | 'opened'>('ready');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // When component mounts, lock scroll if necessary
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleDoorClick = () => {
    if (doorState !== 'ready') return;
    
    // Step 1: Swing doors open
    setDoorState('doors-open');
    
    // Step 2: Zoom and split house apart
    setTimeout(() => {
      setDoorState('opened');
    }, 800);
    
    // Step 3: Remove component / mark as entered
    setTimeout(() => {
      // For now we just let it stay in the DOM with visibility hidden or pointer-events none
      // because the CSS handles the final state. But we could also unmount it via a global store.
    }, 2000);
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAudioEnabled(!audioEnabled);
  };

  // Build the class list based on state
  let classNames = "house-landing ready";
  if (doorState === 'doors-open') {
    classNames = "house-landing doors-open";
  } else if (doorState === 'opened') {
    classNames = "house-landing doors-open zooming opened";
  }

  // If it's completely opened, we could hide it entirely to free up DOM,
  // but the CSS handles `pointer-events: none` and moves elements off screen.
  
  // Pre-calculate sticker positions so they don't jump on re-render
  const leftStickers = useMemo(() => stickers.slice(0, 7).map((text, i) => ({
    text,
    top: 30 + Math.random() * 50 + '%',
    left: 20 + Math.random() * 60 + '%',
    rotate: (Math.random() - 0.5) * 40 + 'deg',
    scale: 0.8 + Math.random() * 0.4
  })), []);

  const rightStickers = useMemo(() => stickers.slice(7).map((text, i) => ({
    text,
    top: 30 + Math.random() * 50 + '%',
    left: 20 + Math.random() * 60 + '%',
    rotate: (Math.random() - 0.5) * 40 + 'deg',
    scale: 0.8 + Math.random() * 0.4
  })), []);

  return (
    <div 
      className={classNames} 
      id="house-landing" 
      aria-label="Enter Portfolio"
      onClick={handleDoorClick}
    >
      {/* LEFT HALF */}
      <div className="house-half house-half--left">
        {/* Full-spanning elements clipped to left half */}
        <div style={{ position: 'absolute', width: '200%', height: '100%', left: 0, clipPath: 'inset(0 50% 0 0)' }}>
          <BrickFacade />
          <RoofStructure />
          <StonePath />
          <HangingSign />
        </div>
        
        {/* Left Side Specific Elements (Tree, Mailbox) */}
        <GiantTree />
        <CatAndMailbox />
        
        <div className="house-door house-door--left">
          {leftStickers.map((st, i) => (
            <div key={i} style={{
              position: 'absolute', top: st.top, left: st.left, 
              transform: `rotate(${st.rotate}) scale(${st.scale})`,
              border: '2px solid #1a1a1a', background: '#fff', 
              padding: '2px 6px', fontWeight: 'bold', fontSize: '0.8rem',
              fontFamily: 'monospace', zIndex: 20,
              boxShadow: '1px 1px 0 rgba(0,0,0,0.1)'
            }}>
              {st.text}
            </div>
          ))}
        </div>
      </div>
      
      {/* RIGHT HALF */}
      <div className="house-half house-half--right">
        {/* Full-spanning elements clipped to right half */}
        <div style={{ position: 'absolute', width: '200%', height: '100%', left: '-100%', clipPath: 'inset(0 0 0 50%)' }}>
          <BrickFacade />
          <RoofStructure />
          <StonePath />
          <HangingSign />
        </div>

        {/* Right Side Specific Elements (Window, Garden) */}
        <RightWindow />
        <GardenBed />

        <div className="house-door house-door--right">
          {rightStickers.map((st, i) => (
            <div key={i} style={{
              position: 'absolute', top: st.top, left: st.left, 
              transform: `rotate(${st.rotate}) scale(${st.scale})`,
              border: '2px solid #1a1a1a', background: '#fff', 
              padding: '2px 6px', fontWeight: 'bold', fontSize: '0.8rem',
              fontFamily: 'monospace', zIndex: 20,
              boxShadow: '1px 1px 0 rgba(0,0,0,0.1)'
            }}>
              {st.text}
            </div>
          ))}
        </div>
      </div>
      <div className="house-overlay" id="house-overlay">
        <div className="house-enter-text" id="house-enter-text">
          EXPLORER<br/>
          <span style={{fontSize: '1rem', fontWeight: 'normal'}}>
            Click a door to enter. Audio is currently 
            <button 
              onClick={toggleAudio}
              style={{
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                textDecoration: 'underline',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                color: 'inherit',
                padding: '0 5px'
              }}
            >
              [{audioEnabled ? '🔊 ON' : '🔈 OFF'}]
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

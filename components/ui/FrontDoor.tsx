"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { MinimalTree, MinimalGate } from './MinimalProps';

export function FrontDoor({ children }: { children: React.ReactNode }) {
  const [isEntered, setIsEntered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const setHasEntered = useUIStore(state => state.setHasEntered);

  const fadeInWhite = useUIStore(state => state.fadeInWhite);
  const fadeOutWhite = useUIStore(state => state.fadeOutWhite);

  const playFlashSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const t = ctx.currentTime;
      
      // 1. White Noise burst
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      // Filter the noise to make it sound like a deep "whoosh"
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(2000, t);
      noiseFilter.frequency.exponentialRampToValueAtTime(100, t + 1.5);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, t);
      noiseGain.gain.linearRampToValueAtTime(1, t + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      // 2. Deep impact synth
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 1);
      
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, t);
      oscGain.gain.linearRampToValueAtTime(1, t + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      
      // Play
      noise.start(t);
      noise.stop(t + 2);
      osc.start(t);
      osc.stop(t + 2);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleClick = () => {
    // 1. Play the synthesized flash sound
    playFlashSound();

    // 2. Instantly trigger the bright white flash
    fadeInWhite();
    
    // 3. Wait for the flash to cover the screen
    setTimeout(() => {
      setIsEntered(true);
      setHasEntered(true);
      
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }
      
      // 4. Slowly fade out the white flash to reveal the corridor
      setTimeout(() => {
        fadeOutWhite();
      }, 300);
    }, 200);
  };

  return (
    <>
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            key="door-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999, // ensures it sits above everything
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5', // light background for the drawing
              cursor: 'pointer'
            }}
            exit={{ 
              backgroundColor: '#ffffff',
              opacity: 0 
            }}
            transition={{ 
              backgroundColor: { duration: 0.1 }, // flash to pure white
              opacity: { delay: 0.1, duration: 1.5, ease: "easeOut" } // then slow fade out
            }}
            onClick={handleClick}
          >
            <motion.div 
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '2rem',
                width: '100%',
                maxWidth: '800px',
                height: '300px'
              }}
              animate={{ filter: isHovered ? 'brightness(0.6)' : 'brightness(1)' }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              <div style={{ flex: 1, height: '100%' }}>
                <MinimalTree />
              </div>
              <div style={{ flex: 1, height: '100%', pointerEvents: 'none' }}>
                <MinimalGate />
              </div>
              <div style={{ flex: 1, height: '100%' }}>
                <MinimalTree />
              </div>
            </motion.div>
            
            <motion.p 
              animate={{ filter: isHovered ? 'brightness(0.6)' : 'brightness(1)' }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: '3rem',
                color: '#1a1a1a',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.1em',
                fontWeight: 600,
                opacity: 0.8
              }}
            >
              CLICK TO ENTER
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

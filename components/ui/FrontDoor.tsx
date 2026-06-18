"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { PremiumTreeLeft, PremiumTreeRight, PremiumHouseFacade } from './MinimalProps';

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
      
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
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
      
      noise.start(t);
      noise.stop(t + 2);
      osc.start(t);
      osc.stop(t + 2);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleClick = () => {
    playFlashSound();
    fadeInWhite();
    
    setTimeout(() => {
      setIsEntered(true);
      setHasEntered(true);
      
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }
      
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
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#faf7f2', // Soft, museum gallery beige
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            exit={{ 
              backgroundColor: '#ffffff',
              opacity: 0 
            }}
            transition={{ 
              backgroundColor: { duration: 0.1 },
              opacity: { delay: 0.1, duration: 1.5, ease: "easeOut" }
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {/* Subtle background glow effect */}
            <motion.div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(250,247,242,0) 70%)',
                zIndex: 0,
              }}
              animate={{ opacity: isHovered ? 1 : 0.4 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div 
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '1rem',
                width: '100%',
                maxWidth: '1200px',
                height: '400px',
                zIndex: 1
              }}
              animate={{ 
                scale: isHovered ? 1.02 : 1,
                filter: isHovered ? 'drop-shadow(0px 30px 40px rgba(0,0,0,0.12)) brightness(1.05)' : 'drop-shadow(0px 10px 20px rgba(0,0,0,0.05)) brightness(1)'
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div style={{ flex: 1, height: '80%', maxWidth: '250px' }}>
                <PremiumTreeLeft />
              </div>
              
              <div style={{ flex: 2, height: '100%', maxWidth: '500px', pointerEvents: 'none' }}>
                <PremiumHouseFacade />
              </div>
              
              <div style={{ flex: 1, height: '80%', maxWidth: '250px' }}>
                <PremiumTreeRight />
              </div>
            </motion.div>
            
            <motion.div
              style={{
                marginTop: '4rem',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <motion.p 
                animate={{ 
                  color: isHovered ? '#1a1a1a' : '#8c7b6b',
                  letterSpacing: isHovered ? '0.25em' : '0.15em'
                }}
                transition={{ duration: 0.5 }}
                style={{
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '1.2rem',
                  textTransform: 'uppercase'
                }}
              >
                TOMASZ SZMAJDA
              </motion.p>
              <motion.p 
                animate={{ 
                  opacity: isHovered ? 1 : 0.5,
                  y: isHovered ? 0 : 5
                }}
                transition={{ duration: 0.5 }}
                style={{
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.8rem',
                  letterSpacing: '0.3em',
                  color: '#6c6356'
                }}
              >
                Click to Enter
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

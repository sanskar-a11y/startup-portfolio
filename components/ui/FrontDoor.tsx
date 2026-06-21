import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { PortfolioSketchScene } from './MinimalProps';
import { soundEngine } from '@/lib/SoundEngine';

export function FrontDoor({ children }: { children: React.ReactNode }) {
  const [isEntered, setIsEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const setHasEntered = useUIStore(state => state.setHasEntered);

  const fadeInWhite = useUIStore(state => state.fadeInWhite);
  const fadeOutWhite = useUIStore(state => state.fadeOutWhite);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleClick = () => {
    if (isEntering) return;
    setIsEntering(true);
    
    soundEngine.init();
    soundEngine.playFlashSound();
    fadeInWhite();
    
    const t1 = setTimeout(() => {
      setIsEntered(true);
      setHasEntered(true);
      
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }
      
      const t2 = setTimeout(() => {
        fadeOutWhite();
        timeoutRefs.current = timeoutRefs.current.filter(t => t !== t2);
      }, 300);
      timeoutRefs.current.push(t2);
      timeoutRefs.current = timeoutRefs.current.filter(t => t !== t1);
    }, 200);
    
    timeoutRefs.current.push(t1);
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
              backgroundColor: '#faf7f2', // Soft sketching paper color
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
          >
            {/* Ambient Background Gradient for the 'Full' feel */}
            <motion.div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100dvh',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(250,247,242,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            />

            {/* Main Interactive Container */}
            <motion.div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '65dvh',
                zIndex: 1,
                cursor: 'pointer'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              onClick={handleClick}
              tabIndex={0}
              role="button"
              aria-label="Enter Portfolio"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }}
            >
              <PortfolioSketchScene />
            </motion.div>
            
            {/* Elegant Typography */}
            <motion.div
              style={{
                marginTop: '1.5rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                pointerEvents: 'none',
                // Contrast & Legibility Adjustments
                backgroundColor: 'rgba(250, 247, 242, 0.85)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                padding: '1.25rem 2.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)'
              }}
            >
              <motion.p 
                style={{
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '1.2rem',
                  letterSpacing: '0.25em',
                  color: '#1a1a1a',
                  textTransform: 'uppercase'
                }}
              >
                PORTFOLIO
              </motion.p>
              <motion.p 
                style={{
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.8rem',
                  letterSpacing: '0.3em',
                  color: '#6c6356'
                }}
              >
                Click House to Enter
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* inert prevents tabbing into the hidden content before the door is clicked */}
      <div inert={!isEntered ? true : undefined} style={{ display: 'contents' }}>
        {children}
      </div>
    </>
  );
}

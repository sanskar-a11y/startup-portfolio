"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useUIStore } from '../../store/uiStore';

export function Overlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const overlayVisible = useUIStore((state) => state.overlayVisible);
  const whiteOverlayVisible = useUIStore((state) => state.whiteOverlayVisible);

  useGSAP(() => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: overlayVisible ? 1 : 0,
        duration: 0.3,
        ease: 'power2.inOut',
        overwrite: true
      });
    }
  }, [overlayVisible]);

  useGSAP(() => {
    if (whiteOverlayRef.current) {
      gsap.to(whiteOverlayRef.current, {
        opacity: whiteOverlayVisible ? 1 : 0,
        duration: 0.8,
        ease: 'power2.inOut',
        overwrite: true
      });
    }
  }, [whiteOverlayVisible]);

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100dvh',
          backgroundColor: '#1a1a1a',
          opacity: 0,
          zIndex: 9999,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
      <div
        ref={whiteOverlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100dvh',
          backgroundColor: '#ffffff',
          opacity: 0,
          zIndex: 10000,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
    </>
  );
}

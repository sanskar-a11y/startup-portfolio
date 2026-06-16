'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import LandingPage from './LandingPage';
import Experience from '../experience/Experience';

export default function SystemOrchestrator() {
  const currentState = useLandingStore((state) => state.currentState);
  const isCorridorActive = currentState === 'completed';

  return (
    <>
      {/* 
        The LandingPage is rendered until the transition completes.
        Once completed, it completely unmounts. 
      */}
      {!isCorridorActive && <LandingPage />}

      {/* 
        The Experience (Corridor) only mounts and takes control
        after the landing transition has completely finished.
      */}
      {isCorridorActive && <Experience />}
    </>
  );
}

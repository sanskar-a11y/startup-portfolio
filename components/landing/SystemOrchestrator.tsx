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
        The Experience (Corridor) now mounts immediately.
        The external FrontDoor handles the landing transition.
      */}
      <Experience />
    </>
  );
}

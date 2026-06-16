'use client';

import React from 'react';
import Illustration from './Illustration';
import IsolatedDoors from './IsolatedDoors';

export default function LandingPage() {
  return (
    <div 
      id="landing-page-container" 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        backgroundColor: '#fdfdfc'
      }}
    >
      <Illustration />
      <IsolatedDoors />
    </div>
  );
}

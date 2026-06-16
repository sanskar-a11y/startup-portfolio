import React from 'react';

export default function Illustration() {
  return (
    <div className="landing-illustration" style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#faf7f2',
      zIndex: -1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '800px',
        height: '800px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(250,247,242,0) 70%)',
        zIndex: 0
      }}></div>

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
        zIndex: 0,
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
      }}></div>

      {/* Typography */}
      <div style={{
        position: 'absolute',
        top: '25%',
        textAlign: 'center',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 300,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
          background: 'linear-gradient(to right, #3a3530, #6c6356)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: 0.9
        }}>
          Tomasz Szmajda
        </h1>
        <p style={{
          fontSize: '1.2rem',
          fontWeight: 400,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#8c7b6b',
          marginTop: '1rem',
          opacity: 0.9
        }}>
          Creative Developer
        </p>
      </div>
      
      {/* Subtle Floating Particles / Stars (CSS) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.4 }}>
        <g opacity="0.6">
          <circle cx="20%" cy="30%" r="1.5" fill="#d4c5b0">
            <animate attributeName="opacity" values="0.1;0.8;0.1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="80%" cy="40%" r="1.5" fill="#d4c5b0">
            <animate attributeName="opacity" values="0.1;0.8;0.1" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="70%" cy="80%" r="1.5" fill="#d4c5b0">
            <animate attributeName="opacity" values="0.1;0.8;0.1" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="30%" cy="70%" r="2" fill="#d4c5b0">
            <animate attributeName="opacity" values="0.1;0.8;0.1" dur="6s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

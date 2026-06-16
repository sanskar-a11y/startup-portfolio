import React from 'react';

export default function Illustration() {
  return (
    <div className="landing-illustration" style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#fdfdfc',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMax slice" style={{ filter: 'grayscale(1) contrast(1.2)' }}>
        <defs>
          <pattern id="pencil-texture" patternUnits="userSpaceOnUse" width="100" height="100">
            <rect width="100" height="100" fill="#fff"/>
            <path d="M0,50 Q25,45 50,50 T100,50" fill="none" stroke="#ddd" strokeWidth="0.5" />
            <path d="M0,20 Q25,25 50,20 T100,20" fill="none" stroke="#ddd" strokeWidth="0.5" />
            <path d="M0,80 Q25,85 50,80 T100,80" fill="none" stroke="#ddd" strokeWidth="0.5" />
          </pattern>
          <filter id="rough-edges">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#pencil-texture)" />

        {/* Ground / Pathway */}
        <path d="M 0,750 Q 500,700 1000,750 L 1000,800 L 0,800 Z" fill="#eee" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
        <path d="M 350,800 L 450,650 L 550,650 L 650,800 Z" fill="#e0e0e0" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>

        {/* Tree */}
        <g transform="translate(150, 650)">
          {/* Trunk */}
          <path d="M -10,0 C -15,-50 -5,-100 -10,-150 L 10,-150 C 5,-100 15,-50 10,0 Z" fill="#aaa" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          {/* Branches */}
          <path d="M -5,-100 C -30,-130 -50,-150 -60,-170" fill="none" stroke="#333" strokeWidth="3" filter="url(#rough-edges)"/>
          <path d="M 5,-120 C 30,-140 50,-160 70,-170" fill="none" stroke="#333" strokeWidth="3" filter="url(#rough-edges)"/>
          {/* Leaves */}
          <circle cx="-30" cy="-180" r="50" fill="#ddd" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <circle cx="40" cy="-190" r="60" fill="#ddd" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <circle cx="0" cy="-220" r="70" fill="#ddd" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
        </g>

        {/* House / Studio Facade */}
        <g transform="translate(500, 650)">
          {/* Main Building Box */}
          <rect x="-150" y="-300" width="300" height="300" fill="#fcfcfc" stroke="#333" strokeWidth="3" filter="url(#rough-edges)" />
          
          {/* Roof */}
          <path d="M -170,-300 L 0,-450 L 170,-300 Z" fill="#eee" stroke="#333" strokeWidth="3" filter="url(#rough-edges)"/>
          
          {/* Window */}
          <rect x="-120" y="-200" width="60" height="80" fill="#e8e8e8" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <line x1="-90" y1="-200" x2="-90" y2="-120" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <line x1="-120" y1="-160" x2="-60" y2="-160" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          
          {/* Flower Box */}
          <rect x="-125" y="-120" width="70" height="20" fill="#ccc" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <path d="M -110,-120 Q -115,-130 -100,-130 Q -95,-120 -90,-130 Q -80,-120 -80,-120" fill="none" stroke="#333" strokeWidth="2"/>

          {/* Right Window */}
          <rect x="60" y="-200" width="60" height="80" fill="#e8e8e8" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <line x1="90" y1="-200" x2="90" y2="-120" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>
          <line x1="60" y1="-160" x2="120" y2="-160" stroke="#333" strokeWidth="2" filter="url(#rough-edges)"/>

          {/* Empty Space for the 3D Doors */}
          {/* We leave x=-45 to 45, y=-150 to 0 blank (or draw a frame around it) */}
          <rect x="-48" y="-153" width="96" height="153" fill="#111" stroke="#333" strokeWidth="3" filter="url(#rough-edges)"/>
          <path d="M -48,-153 C 0,-170 48,-153 48,-153" fill="none" stroke="#333" strokeWidth="3" filter="url(#rough-edges)"/>
        </g>
      </svg>
    </div>
  );
}

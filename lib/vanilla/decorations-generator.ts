import * as THREE from 'three';

export interface DecorationTemplate {
  id: string;
  category: 'quote' | 'sticky' | 'sketch' | 'blueprint' | 'achievement' | 'sign' | 'doodle';
  width: number;
  height: number;
  material: THREE.Material;
  geometry: THREE.BufferGeometry;
}

// PRNG for consistent variations
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function drawMessyBorder(ctx: CanvasRenderingContext2D, width: number, height: number, inset: number, seed: number) {
  ctx.beginPath();
  let x = inset, y = inset;
  ctx.moveTo(x, y);
  
  const steps = 4;
  for(let i=0; i<steps; i++) {
    x += (width - inset * 2) / steps;
    ctx.lineTo(x + (pseudoRandom(seed++) - 0.5) * 5, y + (pseudoRandom(seed++) - 0.5) * 5);
  }
  for(let i=0; i<steps; i++) {
    y += (height - inset * 2) / steps;
    ctx.lineTo(x + (pseudoRandom(seed++) - 0.5) * 5, y + (pseudoRandom(seed++) - 0.5) * 5);
  }
  for(let i=0; i<steps; i++) {
    x -= (width - inset * 2) / steps;
    ctx.lineTo(x + (pseudoRandom(seed++) - 0.5) * 5, y + (pseudoRandom(seed++) - 0.5) * 5);
  }
  for(let i=0; i<steps; i++) {
    y -= (height - inset * 2) / steps;
    ctx.lineTo(x + (pseudoRandom(seed++) - 0.5) * 5, y + (pseudoRandom(seed++) - 0.5) * 5);
  }
  ctx.closePath();
  ctx.stroke();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function createTexture(renderParams: any, seed: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const { category, text } = renderParams;

  // Background
  if (category === 'blueprint') {
    ctx.fillStyle = '#2c5282';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#4299e1';
    ctx.lineWidth = 2;
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
  } else if (category === 'sticky') {
    const colors = ['#fef3c7', '#fce7f3', '#e0f2fe', '#dcfce3'];
    ctx.fillStyle = colors[Math.floor(pseudoRandom(seed) * colors.length)];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Border / Shadows
  if (category === 'quote' || category === 'achievement') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.floor(pseudoRandom(seed + 1) * 3) + 3;
    drawMessyBorder(ctx, canvas.width, canvas.height, 20, seed + 2);
    // Double border for frame
    ctx.lineWidth = 1;
    drawMessyBorder(ctx, canvas.width, canvas.height, 35, seed + 3);
  } else if (category === 'sticky') {
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    drawMessyBorder(ctx, canvas.width, canvas.height, 5, seed + 2);
  }

  // Draw Content
  if (text) {
    if (category === 'blueprint') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(text.toUpperCase(), 40, 80);
      
      // Draw random blueprint lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, 150); ctx.lineTo(400, 150);
      ctx.lineTo(400, 400); ctx.lineTo(250, 400);
      ctx.stroke();
    } else if (category === 'sticky') {
      ctx.fillStyle = '#1f2937';
      const fonts = ['"Comic Sans MS", cursive', 'Impact, sans-serif', '"Courier New", monospace'];
      ctx.font = `bold 48px ${fonts[Math.floor(pseudoRandom(seed+4)*fonts.length)]}`;
      ctx.textAlign = 'center';
      wrapText(ctx, text, 256, 200, 400, 60);
    } else if (category === 'sign') {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 72px Impact, sans-serif';
      ctx.textAlign = 'center';
      wrapText(ctx, text.toUpperCase(), 256, 256, 450, 80);
    } else if (category === 'achievement') {
      ctx.fillStyle = '#b8860b'; // gold
      ctx.font = 'bold 64px serif';
      ctx.textAlign = 'center';
      wrapText(ctx, "🏆", 256, 180, 400, 80);
      ctx.fillStyle = '#000000';
      ctx.font = 'italic 48px serif';
      wrapText(ctx, text, 256, 280, 400, 60);
    } else {
      // Default quotes
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 54px "Courier New", monospace';
      ctx.textAlign = 'center';
      wrapText(ctx, text, 256, 200, 400, 70);
    }
  }

  // Doodles / Sketches
  if (category === 'sketch' || category === 'doodle') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    let cx = 256, cy = 256;
    ctx.moveTo(cx + pseudoRandom(seed)*100 - 50, cy + pseudoRandom(seed+1)*100 - 50);
    for(let i=0; i<15; i++) {
      ctx.quadraticCurveTo(
        cx + pseudoRandom(seed+i+2)*300 - 150, 
        cy + pseudoRandom(seed+i+3)*300 - 150,
        cx + pseudoRandom(seed+i+4)*200 - 100, 
        cy + pseudoRandom(seed+i+5)*200 - 100
      );
    }
    ctx.stroke();
    if (text) {
      ctx.fillStyle = '#000000';
      ctx.font = 'italic 32px cursive';
      ctx.fillText(text, cx, 450);
    }
  }

  // Wear level overlay
  const wear = pseudoRandom(seed + 10);
  if (wear > 0.5) {
    ctx.fillStyle = `rgba(0,0,0,${wear * 0.1})`;
    for(let i=0; i<50; i++) {
      ctx.beginPath();
      ctx.arc(pseudoRandom(seed+20+i)*512, pseudoRandom(seed+70+i)*512, pseudoRandom(seed+120+i)*10, 0, Math.PI*2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

// 50 Curated Archetypes
const archetypes = [
  // Quotes (Entrance / Inspirational)
  { id: 'q1', category: 'quote', text: "everything's gonna be alright", width: 2, height: 2 },
  { id: 'q2', category: 'quote', text: "build first, doubt later", width: 2.5, height: 1.5 },
  { id: 'q3', category: 'quote', text: "done beats perfect", width: 1.8, height: 1.8 },
  { id: 'q4', category: 'quote', text: "one more version", width: 2, height: 1.5 },
  { id: 'q5', category: 'quote', text: "ship it", width: 1.5, height: 1.5 },
  { id: 'q6', category: 'quote', text: "move fast", width: 2, height: 2 },
  { id: 'q7', category: 'quote', text: "stay curious", width: 1.5, height: 2 },
  { id: 'q8', category: 'quote', text: "fail forward", width: 2.2, height: 1.8 },

  // Sticky Notes (Mid / WIP)
  { id: 'st1', category: 'sticky', text: "fix bug", width: 0.6, height: 0.6 },
  { id: 'st2', category: 'sticky', text: "call client", width: 0.6, height: 0.6 },
  { id: 'st3', category: 'sticky', text: "new idea!!", width: 0.6, height: 0.6 },
  { id: 'st4', category: 'sticky', text: "launch day", width: 0.6, height: 0.6 },
  { id: 'st5', category: 'sticky', text: "meeting at 3", width: 0.6, height: 0.6 },
  { id: 'st6', category: 'sticky', text: "coffee first", width: 0.6, height: 0.6 },
  { id: 'st7', category: 'sticky', text: "refactor", width: 0.6, height: 0.6 },
  { id: 'st8', category: 'sticky', text: "?!?", width: 0.6, height: 0.6 },
  { id: 'st9', category: 'sticky', text: "TODO", width: 0.6, height: 0.6 },
  { id: 'st10', category: 'sticky', text: "deploy", width: 0.6, height: 0.6 },

  // Sketches & Doodles (Mid / WIP)
  { id: 'sk1', category: 'sketch', text: "v1 concept", width: 1.5, height: 1.5 },
  { id: 'sk2', category: 'sketch', text: "user flow", width: 2, height: 1.5 },
  { id: 'sk3', category: 'sketch', text: "wireframes", width: 2.5, height: 2 },
  { id: 'd1', category: 'doodle', text: "rocket", width: 1, height: 1 },
  { id: 'd2', category: 'doodle', text: "brainstorm", width: 1.2, height: 1.2 },
  { id: 'd3', category: 'doodle', text: "coffee cup", width: 1, height: 1 },
  { id: 'd4', category: 'doodle', text: "star", width: 0.8, height: 0.8 },

  // Blueprints (Mid/Deep)
  { id: 'bp1', category: 'blueprint', text: "schema A", width: 3, height: 2 },
  { id: 'bp2', category: 'blueprint', text: "layout 2.0", width: 2.5, height: 2.5 },
  { id: 'bp3', category: 'blueprint', text: "core tech", width: 3, height: 2 },
  { id: 'bp4', category: 'blueprint', text: "API map", width: 2, height: 3 },
  { id: 'bp5', category: 'blueprint', text: "database", width: 2.5, height: 2 },

  // Achievements (Deep)
  { id: 'a1', category: 'achievement', text: "100 Users!", width: 2, height: 2.5 },
  { id: 'a2', category: 'achievement', text: "First Client", width: 2, height: 2.5 },
  { id: 'a3', category: 'achievement', text: "v1.0 Launch", width: 2, height: 2.5 },
  { id: 'a4', category: 'achievement', text: "Award 2024", width: 2.5, height: 3 },
  { id: 'a5', category: 'achievement', text: "Seed Round", width: 2, height: 2.5 },

  // Directional Signs (Entrance/Mid)
  { id: 'sn1', category: 'sign', text: "THE STUDIO ->", width: 3, height: 1 },
  { id: 'sn2', category: 'sign', text: "<- GALLERY", width: 3, height: 1 },
  { id: 'sn3', category: 'sign', text: "PROJECTS", width: 2.5, height: 1 },
  { id: 'sn4', category: 'sign', text: "LAB", width: 2, height: 1 },
  { id: 'sn5', category: 'sign', text: "EXIT ->", width: 2, height: 1 }
];

let generatedTemplates: DecorationTemplate[] | null = null;

export function getDecorationTemplates(): DecorationTemplate[] {
  if (generatedTemplates) return generatedTemplates;
  
  generatedTemplates = archetypes.map((arch, i) => {
    // Generate the texture with procedural variations (wear, strokes, colors)
    const tex = createTexture(arch, i * 100);
    const mat = new THREE.MeshLambertMaterial({ 
      map: tex, 
      transparent: true,
      side: THREE.FrontSide
    });
    const geo = new THREE.PlaneGeometry(arch.width, arch.height);
    return {
      id: arch.id,
      category: arch.category as any,
      width: arch.width,
      height: arch.height,
      material: mat,
      geometry: geo
    };
  });

  return generatedTemplates;
}

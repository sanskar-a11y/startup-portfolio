import * as THREE from 'three';

// Shared materials
const solidMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2, transparent: true, opacity: 0.15 });

export interface PropMesh {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  isEdges?: boolean;
}

export interface PropTemplate {
  id: string;
  category: string;
  type: 'portfolio' | 'architectural' | 'rare';
  meshes: PropMesh[];
  width: number;
  height: number;
  depth: number;
  ySnap: 'floor' | 'wall' | 'table';
  material?: THREE.Material;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ------------------------------------------------------------------
// 2D Canvas Storytelling Generative Texture (for Portfolio Props)
// ------------------------------------------------------------------
function createPortfolioTexture(seed: number, subCategory: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = subCategory === 'sticky' ? '#fef3c7' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  
  // Messy Border
  if (subCategory !== 'sticky') {
    ctx.beginPath();
    ctx.rect(10 + pseudoRandom(seed)*5, 10 + pseudoRandom(seed+1)*5, 490, 490);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(15 + pseudoRandom(seed+2)*5, 15 + pseudoRandom(seed+3)*5, 480, 480);
    ctx.stroke();
  }

  // Content
  if (subCategory === 'wireframe') {
    ctx.strokeRect(50, 50, 412, 300); // browser window
    ctx.strokeRect(50, 50, 412, 40); // header
    for(let i=0; i<3; i++) {
      ctx.strokeRect(80 + i*120, 120, 100, 100); // grid items
    }
  } else if (subCategory === 'roadmap') {
    ctx.beginPath();
    ctx.moveTo(50, 256);
    for(let i=0; i<5; i++) {
      ctx.lineTo(50 + i*100, 256 + (pseudoRandom(seed+i)-0.5)*100);
      ctx.arc(50 + i*100, 256 + (pseudoRandom(seed+i)-0.5)*100, 10, 0, Math.PI*2);
    }
    ctx.stroke();
  } else if (subCategory === 'achievement') {
    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 80px serif';
    ctx.fillText("🏆", 200, 256);
  } else if (subCategory === 'blueprint') {
    ctx.fillStyle = '#2c5282';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#4299e1';
    ctx.lineWidth = 2;
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 100, 312, 312);
  } else {
    // text lines for concept art / idea wall
    ctx.fillStyle = '#000';
    for(let i=0; i<5; i++) {
      ctx.fillRect(50, 100 + i*60, 200 + pseudoRandom(seed+i)*200, 10);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ------------------------------------------------------------------
// Prop Factory
// ------------------------------------------------------------------

function createBoxProp(w: number, h: number, d: number): PropMesh[] {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  return [
    { geometry: geo, position: [0, 0, 0] },
    { geometry: edges, position: [0, 0, 0], isEdges: true }
  ];
}

function createTable(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const topGeo = new THREE.BoxGeometry(2, 0.1, 1);
  meshes.push({ geometry: topGeo, position: [0, 1, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(topGeo), position: [0, 1, 0], isEdges: true });
  
  const legGeo = new THREE.BoxGeometry(0.1, 1, 0.1);
  const legEdges = new THREE.EdgesGeometry(legGeo);
  const legPositions = [
    [-0.9, 0.5, -0.4], [0.9, 0.5, -0.4],
    [-0.9, 0.5, 0.4], [0.9, 0.5, 0.4]
  ];
  legPositions.forEach(pos => {
    meshes.push({ geometry: legGeo, position: pos as [number, number, number] });
    meshes.push({ geometry: legEdges, position: pos as [number, number, number], isEdges: true });
  });
  return meshes;
}

function createPlant(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const potGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.6, 8);
  meshes.push({ geometry: potGeo, position: [0, 0.3, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(potGeo), position: [0, 0.3, 0], isEdges: true });
  
  // Sketchy plant leaves using intersecting planes
  const leafGeo = new THREE.PlaneGeometry(0.8, 1.2);
  const leafEdges = new THREE.EdgesGeometry(leafGeo);
  for(let i=0; i<3; i++) {
    const rot = [0, (Math.PI/3)*i, Math.PI/8] as [number, number, number];
    meshes.push({ geometry: leafGeo, position: [0, 1.0, 0], rotation: rot });
    meshes.push({ geometry: leafEdges, position: [0, 1.0, 0], rotation: rot, isEdges: true });
  }
  return meshes;
}

function createCoatStand(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 8);
  meshes.push({ geometry: poleGeo, position: [0, 1.0, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(poleGeo), position: [0, 1.0, 0], isEdges: true });
  
  const baseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 8);
  meshes.push({ geometry: baseGeo, position: [0, 0.025, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(baseGeo), position: [0, 0.025, 0], isEdges: true });
  
  const hookGeo = new THREE.BoxGeometry(0.4, 0.05, 0.05);
  meshes.push({ geometry: hookGeo, position: [0.1, 1.8, 0], rotation: [0,0,Math.PI/4] });
  meshes.push({ geometry: hookGeo, position: [-0.1, 1.6, 0], rotation: [0,0,-Math.PI/4] });
  return meshes;
}

function createCoffeeMug(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const mugGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12);
  meshes.push({ geometry: mugGeo, position: [0, 0.1, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(mugGeo), position: [0, 0.1, 0], isEdges: true });
  
  const handleGeo = new THREE.BoxGeometry(0.05, 0.1, 0.05);
  meshes.push({ geometry: handleGeo, position: [0.12, 0.1, 0] });
  return meshes;
}

function createLamp(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const baseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 12);
  meshes.push({ geometry: baseGeo, position: [0, 0.025, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(baseGeo), position: [0, 0.025, 0], isEdges: true });

  const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
  meshes.push({ geometry: poleGeo, position: [0, 0.3, 0], rotation: [0,0,Math.PI/8] });
  meshes.push({ geometry: new THREE.EdgesGeometry(poleGeo), position: [0, 0.3, 0], rotation: [0,0,Math.PI/8], isEdges: true });

  const shadeGeo = new THREE.CylinderGeometry(0.05, 0.15, 0.2, 12);
  meshes.push({ geometry: shadeGeo, position: [0.12, 0.55, 0], rotation: [0,0,-Math.PI/4] });
  meshes.push({ geometry: new THREE.EdgesGeometry(shadeGeo), position: [0.12, 0.55, 0], rotation: [0,0,-Math.PI/4], isEdges: true });
  return meshes;
}

// ------------------------------------------------------------------
// Registry Initialization
// ------------------------------------------------------------------

function createTree(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 6);
  meshes.push({ geometry: trunkGeo, position: [0, 0.75, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(trunkGeo), position: [0, 0.75, 0], isEdges: true });
  
  for (let i = 0; i < 15; i++) {
    const s = 0.5 + pseudoRandom(i) * 0.8;
    const boxGeo = new THREE.BoxGeometry(s, s, s);
    const pos = [
      (pseudoRandom(i+10) - 0.5) * 1.5,
      1.5 + pseudoRandom(i+20) * 1.5,
      (pseudoRandom(i+30) - 0.5) * 1.5
    ] as [number, number, number];
    const rot = [
      pseudoRandom(i+40) * Math.PI,
      pseudoRandom(i+50) * Math.PI,
      pseudoRandom(i+60) * Math.PI
    ] as [number, number, number];
    meshes.push({ geometry: boxGeo, position: pos, rotation: rot });
    meshes.push({ geometry: new THREE.EdgesGeometry(boxGeo), position: pos, rotation: rot, isEdges: true });
  }
  return meshes;
}

function createCharacter(): PropMesh[] {
  const meshes: PropMesh[] = [];
  const headGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  meshes.push({ geometry: headGeo, position: [0, 1.6, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(headGeo), position: [0, 1.6, 0], isEdges: true });
  
  const bodyGeo = new THREE.BoxGeometry(0.4, 0.6, 0.2);
  meshes.push({ geometry: bodyGeo, position: [0, 1.1, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(bodyGeo), position: [0, 1.1, 0], isEdges: true });
  
  const armGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
  meshes.push({ geometry: armGeo, position: [-0.3, 1.1, 0], rotation: [0, 0, 0.2] });
  meshes.push({ geometry: new THREE.EdgesGeometry(armGeo), position: [-0.3, 1.1, 0], rotation: [0, 0, 0.2], isEdges: true });
  meshes.push({ geometry: armGeo, position: [0.3, 1.1, 0], rotation: [0, 0, -0.2] });
  meshes.push({ geometry: new THREE.EdgesGeometry(armGeo), position: [0.3, 1.1, 0], rotation: [0, 0, -0.2], isEdges: true });

  const legGeo = new THREE.BoxGeometry(0.15, 0.8, 0.15);
  meshes.push({ geometry: legGeo, position: [-0.1, 0.4, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(legGeo), position: [-0.1, 0.4, 0], isEdges: true });
  meshes.push({ geometry: legGeo, position: [0.1, 0.4, 0] });
  meshes.push({ geometry: new THREE.EdgesGeometry(legGeo), position: [0.1, 0.4, 0], isEdges: true });
  
  return meshes;
}


let templates: PropTemplate[] | null = null;

export function getPropTemplates(): PropTemplate[] {
  if (templates) return templates;
  
  templates = [];

  // ARCHITECTURAL
  templates.push({
    id: 'arch_table', category: 'small_table', type: 'architectural',
    meshes: createTable(), width: 2, height: 1.05, depth: 1, ySnap: 'floor'
  });
  templates.push({
    id: 'arch_plant', category: 'plant_vase', type: 'architectural',
    meshes: createPlant(), width: 1, height: 1.6, depth: 1, ySnap: 'floor'
  });
  templates.push({
    id: 'arch_mirror', category: 'mirror', type: 'architectural',
    meshes: createBoxProp(1.5, 2.5, 0.1), width: 1.5, height: 2.5, depth: 0.1, ySnap: 'wall'
  });
  templates.push({
    id: 'arch_clock', category: 'wall_clock', type: 'architectural',
    meshes: [
      { geometry: new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16), position: [0,0,0], rotation: [Math.PI/2,0,0] },
      { geometry: new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16)), position: [0,0,0], rotation: [Math.PI/2,0,0], isEdges: true }
    ], width: 1, height: 1, depth: 0.1, ySnap: 'wall'
  });
  templates.push({
    id: 'arch_tree', category: 'tree', type: 'architectural',
    meshes: createTree(), width: 2, height: 3.5, depth: 2, ySnap: 'floor'
  });

  // RARE
  templates.push({
    id: 'rare_coat', category: 'coat_stand', type: 'rare',
    meshes: createCoatStand(), width: 0.8, height: 2.0, depth: 0.8, ySnap: 'floor'
  });
  templates.push({
    id: 'rare_books', category: 'books_stack', type: 'rare',
    meshes: [
      ...createBoxProp(0.6, 0.1, 0.4).map(m => ({...m, position: [0, 0.05, 0] as [number, number, number]})),
      ...createBoxProp(0.5, 0.1, 0.35).map(m => ({...m, position: [0, 0.15, 0] as [number, number, number], rotation: [0, 0.2, 0] as [number, number, number]}))
    ], width: 0.6, height: 0.2, depth: 0.4, ySnap: 'table'
  });
  templates.push({
    id: 'rare_mug', category: 'coffee_mug', type: 'rare',
    meshes: createCoffeeMug(), width: 0.2, height: 0.2, depth: 0.2, ySnap: 'table'
  });
  templates.push({
    id: 'rare_lamp', category: 'lamp', type: 'rare',
    meshes: createLamp(), width: 0.4, height: 0.8, depth: 0.4, ySnap: 'table'
  });
  templates.push({
    id: 'rare_character', category: 'character', type: 'rare',
    meshes: createCharacter(), width: 0.8, height: 1.8, depth: 0.4, ySnap: 'floor'
  });

  // PORTFOLIO STORYTELLING (2D Canvas textures mounted on thin frames)
  const portfolioCategories = [
    'framed_ui_wireframe', 'startup_roadmap', 'client_milestone_board', 
    'product_sketch', 'design_iteration_sheet', 'sticky_note_cluster',
    'achievement_frame', 'project_blueprint', 'idea_wall', 'concept_art'
  ];

  portfolioCategories.forEach((cat, i) => {
    let subType = 'sketch';
    if (cat.includes('wire')) subType = 'wireframe';
    if (cat.includes('achieve') || cat.includes('milestone')) subType = 'achievement';
    if (cat.includes('road')) subType = 'roadmap';
    if (cat.includes('sticky')) subType = 'sticky';
    if (cat.includes('blueprint')) subType = 'blueprint';

    const tex = createPortfolioTexture(i * 100, subType);
    const mat = new THREE.MeshLambertMaterial({ map: tex, side: THREE.FrontSide });
    
    // Create the thin frame
    const w = 1.5 + (i%2);
    const h = 1.2 + (i%3)*0.5;
    const geo = new THREE.BoxGeometry(w, h, 0.05);
    const edges = new THREE.EdgesGeometry(geo);
    
    // Create a special PropMesh that uses the unique canvas material
    templates!.push({
      id: `port_${cat}`, category: cat, type: 'portfolio',
      meshes: [
        { geometry: geo, position: [0,0,0] }, // Will be rendered with `mat` in the component
        { geometry: edges, position: [0,0,0], isEdges: true }
      ],
      width: w, height: h, depth: 0.05, ySnap: 'wall',
      material: mat
    });
  });

  return templates;
}

export function getSharedMaterials() {
  return { solidMat, edgeMat };
}

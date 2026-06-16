import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getPropTemplates, getSharedMaterials, PropTemplate } from '../../lib/vanilla/prop-generator';

interface WallDecorationsProps {
  segmentIndex: number;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Global hard limits (from user JSON)
const hardLimits: Record<string, number> = {
  small_table: 3,
  mirror: 2,
  plant_vase: 4,
  wall_clock: 2,
  coat_stand: 1
};

export function WallDecorations({ segmentIndex }: WallDecorationsProps) {
  const { solidMat, edgeMat } = getSharedMaterials();

  const propsData = useMemo(() => {
    const templates = getPropTemplates();
    const result = [];
    
    // To track global hard limits deterministically, we walk the PRNG from segment 0 to current.
    const counts: Record<string, number> = {};
    Object.keys(hardLimits).forEach(k => counts[k] = 0);

    // We simulate up to the current segment to get the current counts
    for (let i = 0; i <= segmentIndex; i++) {
      const seed = i * 2026;
      
      // 40% empty space rule
      if (pseudoRandom(seed) < 0.40) {
        if (i === segmentIndex) return []; // Render nothing for this segment
        continue;
      }

      // Max 1 to 3 props per section
      const numProps = Math.floor(pseudoRandom(seed + 1) * 3) + 1;
      
      for (let p = 0; p < numProps; p++) {
        const propSeed = seed + 10 + p;
        
        // Pick category weights
        const r = pseudoRandom(propSeed);
        let selectedTemplate: PropTemplate;
        
        // 70% portfolio, 20% architectural, 10% rare
        if (r < 0.70) {
          const ports = templates.filter(t => t.type === 'portfolio');
          selectedTemplate = ports[Math.floor(pseudoRandom(propSeed+1)*ports.length)];
        } else if (r < 0.90) {
          const archs = templates.filter(t => t.type === 'architectural');
          selectedTemplate = archs[Math.floor(pseudoRandom(propSeed+1)*archs.length)];
        } else {
          const rares = templates.filter(t => t.type === 'rare');
          selectedTemplate = rares[Math.floor(pseudoRandom(propSeed+1)*rares.length)];
        }

        // Enforce hard limits
        if (hardLimits[selectedTemplate.category] !== undefined) {
          if (counts[selectedTemplate.category] >= hardLimits[selectedTemplate.category]) {
            continue; // Skip this prop, limit reached
          }
          counts[selectedTemplate.category]++;
        }

        // Only build the visual data if we are exactly on the segment being rendered
        if (i === segmentIndex) {
          const isDoorLeft = segmentIndex % 2 === 0;
          const wallSide = pseudoRandom(propSeed + 2) > 0.5 ? 'left' : 'right';
          const wallX = wallSide === 'left' ? -4.95 : 4.95;
          const rotY = wallSide === 'left' ? Math.PI / 2 : -Math.PI / 2;
          
          // Random Z spread within the 30-length segment (-12 to +12)
          let itemZ = (pseudoRandom(propSeed + 3) - 0.5) * 24;
          
          // Avoid near doors (door is at Z=0, footprint -4 to +4)
          if (wallSide === 'left' && isDoorLeft && itemZ > -6 && itemZ < 6) {
            itemZ = itemZ > 0 ? 8 : -8; // Push out
          }
          if (wallSide === 'right' && !isDoorLeft && itemZ > -6 && itemZ < 6) {
            itemZ = itemZ > 0 ? 8 : -8;
          }

          // Avoid near vents (left wall, odd segments, Z = -3)
          if (wallSide === 'left' && segmentIndex % 2 === 1 && itemZ > -6 && itemZ < 0) {
             itemZ = -8;
          }

          // Y snapping
          let itemY = 0;
          if (selectedTemplate.ySnap === 'floor') {
            itemY = 0; // The generator puts origins correctly or we adjust
          } else if (selectedTemplate.ySnap === 'wall') {
            itemY = 1.2 + pseudoRandom(propSeed + 4) * 1.5;
          } else if (selectedTemplate.ySnap === 'table') {
            itemY = 1.05; // Table height
          }

          const rotZ = (pseudoRandom(propSeed + 5) - 0.5) * 0.1;
          const zOff = wallSide === 'left' ? 0.05 : -0.05;

          result.push({
            id: `prop-${segmentIndex}-${p}`,
            template: selectedTemplate,
            position: [wallX + zOff, itemY, itemZ] as [number, number, number],
            rotation: [0, rotY, rotZ] as [number, number, number]
          });
        }
      }
    }
    
    return result;
  }, [segmentIndex]);

  if (propsData.length === 0) return null;

  return (
    <group name={`WallDecorations-${segmentIndex}`}>
      {propsData.map(prop => (
        <group key={prop.id} position={prop.position} rotation={prop.rotation}>
          {prop.template.meshes.map((subMesh, i) => (
            subMesh.isEdges ? (
              <lineSegments 
                key={i} 
                geometry={subMesh.geometry} 
                material={edgeMat} 
                position={subMesh.position} 
                rotation={subMesh.rotation || [0,0,0]} 
              />
            ) : (
              <mesh 
                key={i} 
                geometry={subMesh.geometry} 
                material={prop.template.material || solidMat}
                position={subMesh.position} 
                rotation={subMesh.rotation || [0,0,0]} 
              />
            )
          ))}
        </group>
      ))}
    </group>
  );
}

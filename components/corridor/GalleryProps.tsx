import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface GalleryPropsType {
  segmentIndex: number;
}

// Pseudo-random generator based on seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function GalleryProps({ segmentIndex }: GalleryPropsType) {
  // Use the 2 newly generated sketch paintings (jester and robot)
  const artIndex = (segmentIndex % 2) + 1;
  const artTexture = useTexture(`/textures/sketch-art-${artIndex}.png`);
  
  const { canvasGeo, canvasMat, zOffset } = useMemo(() => {
    // 1. Fixed dimensions (since the image includes the frame)
    const isLandscape = segmentIndex % 3 === 0;
    const isSquare = segmentIndex % 3 === 1;
    
    let w = 4;
    let h = 4;
    
    // Just a flat plane, because the drawn frame is IN the texture!
    const cGeo = new THREE.PlaneGeometry(w, h);
    
    artTexture.colorSpace = THREE.SRGBColorSpace;
    const cMat = new THREE.MeshBasicMaterial({ map: artTexture, transparent: true }); // Flat shaded
    
    // Positional jitter
    const zOff = (pseudoRandom(segmentIndex * 5) - 0.5) * 4; // +/- 2 units
    
    return { canvasGeo: cGeo, canvasMat: cMat, zOffset: zOff };
  }, [artTexture, segmentIndex]);

  // Corridor width is 10. Wall x is +/- 4.9.
  const isDoorLeft = segmentIndex % 2 === 0;
  const wallX = isDoorLeft ? 4.95 : -4.95;
  const rotY = isDoorLeft ? -Math.PI / 2 : Math.PI / 2;
  
  return (
    <group name={`GalleryProps-${segmentIndex}`}>
      {/* Canvas with embedded hand-drawn frame */}
      <mesh geometry={canvasGeo} material={canvasMat} position={[wallX + (isDoorLeft ? -0.01 : 0.01), 3.5, zOffset]} rotation={[0, rotY, 0]} />
    </group>
  );
}

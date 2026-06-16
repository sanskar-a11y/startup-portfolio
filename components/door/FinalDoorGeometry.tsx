import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useUIStore } from '../../store/uiStore';
import { getPropTemplates } from '../../lib/vanilla/prop-generator';

const CORRIDOR_WIDTH = 10;
const CORRIDOR_HEIGHT = 6;
const FAKE_ROOM_DEPTH = 15;

function createInfinityTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 1024);

  // Infinity symbol
  ctx.strokeStyle = '#4A90E2';
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Draw an infinity symbol
  const cx = 512, cy = 512, a = 200;
  for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.1) {
    const r = a * Math.sqrt(Math.cos(2 * t));
    if (isNaN(r)) continue;
    const x = cx + r * Math.cos(t) * (t > Math.PI / 4 && t < 3 * Math.PI / 4 ? -1 : 1) * 2.5; // Stretch it a bit
    const y = cy + r * Math.sin(t) * 2.5;
    if (t === 0) ctx.moveTo(cx + a * 2.5, cy);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Text
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('while(true){ explore(); }', 512, 200);

  // Doodles
  const doodles = ['idea', 'dev', 'bug', 'creative_notes'];
  ctx.font = 'italic 32px cursive';
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  doodles.forEach((d, i) => {
    ctx.fillText(d, 200 + (i % 2) * 600, 300 + Math.floor(i / 2) * 400);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function FinalDoorGeometry({ positionZ }: { positionZ: number }) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { tex, doorMat, wallMat, sketchyLineMaterial } = useMemo(() => {
    const tex = createInfinityTexture();
    const doorMat = new THREE.MeshLambertMaterial({ map: tex });
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const sketchyLineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
      transparent: true,
      opacity: 0.15
    });
    return { tex, doorMat, wallMat, sketchyLineMaterial };
  }, []);

  const props = useMemo(() => {
    const templates = getPropTemplates();
    const tableTemp = templates.find(t => t.category === 'small_table');
    const plantTemp = templates.find(t => t.category === 'plant_vase');
    const sketchTemp = templates.find(t => t.category === 'framed_ui_wireframe');
    return { tableTemp, plantTemp, sketchTemp };
  }, []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);

    // 1. Open doors
    gsap.to(leftDoorRef.current!.rotation, {
      y: -105 * (Math.PI / 180),
      duration: 1.4,
      ease: 'power3.inOut'
    });
    gsap.to(rightDoorRef.current!.rotation, {
      y: 105 * (Math.PI / 180),
      duration: 1.4,
      ease: 'power3.inOut'
    });

    // 2. Camera push and bloom logic is handled in webgl-corridor.ts 
    //    We trigger it by communicating with the engine.
    import('../../lib/vanilla/webgl-corridor').then(({ triggerFinaleSequence }) => {
      triggerFinaleSequence(positionZ);
    });
  };

  const doorWidth = 4;
  const doorHeight = 5;

  return (
    <group position={[0, 0, positionZ]} name="FinalDoorScene">
      {/* Front Wall blocking the corridor */}
      <mesh position={[0, CORRIDOR_HEIGHT / 2, 0]}>
        <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
      
      {/* Double Doors */}
      <group position={[0, 0, 0.05]}>
        {/* Left Door */}
        <group ref={leftDoorRef} position={[-doorWidth / 2, 0, 0]}>
          <mesh position={[doorWidth / 4, doorHeight / 2, 0]} 
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
                onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            <boxGeometry args={[doorWidth / 2, doorHeight, 0.1]} />
            <meshLambertMaterial map={tex} />
          </mesh>
        </group>
        {/* Right Door */}
        <group ref={rightDoorRef} position={[doorWidth / 2, 0, 0]}>
          <mesh position={[-doorWidth / 4, doorHeight / 2, 0]}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
                onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            <boxGeometry args={[doorWidth / 2, doorHeight, 0.1]} />
            <meshLambertMaterial map={tex} />
          </mesh>
        </group>
      </group>

      {/* Frame Trims */}
      <mesh position={[-doorWidth / 2 - 0.2, doorHeight / 2, 0.05]}>
        <boxGeometry args={[0.4, doorHeight + 0.4, 0.2]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
      <mesh position={[doorWidth / 2 + 0.2, doorHeight / 2, 0.05]}>
        <boxGeometry args={[0.4, doorHeight + 0.4, 0.2]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
      <mesh position={[0, doorHeight + 0.2, 0.05]}>
        <boxGeometry args={[doorWidth, 0.4, 0.2]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>

      {/* FAKE ROOM BEHIND THE DOOR */}
      <group position={[0, 0, -FAKE_ROOM_DEPTH / 2]}>
        {/* Walls */}
        <mesh position={[-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[FAKE_ROOM_DEPTH, CORRIDOR_HEIGHT]} />
          <meshLambertMaterial color={0xf0f0f0} />
        </mesh>
        <mesh position={[CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[FAKE_ROOM_DEPTH, CORRIDOR_HEIGHT]} />
          <meshLambertMaterial color={0xf0f0f0} />
        </mesh>
        <mesh position={[0, CORRIDOR_HEIGHT / 2, -FAKE_ROOM_DEPTH / 2]}>
          <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT]} />
          <meshLambertMaterial color={0xf0f0f0} />
        </mesh>

        {/* Props in the fake room */}
        {props.tableTemp && (
          <group position={[0, 0, 0]}>
            {props.tableTemp.meshes.map((m, i) => (
              m.isEdges ? null : <mesh key={i} geometry={m.geometry} material={wallMat} position={m.position} />
            ))}
          </group>
        )}
        {props.plantTemp && (
          <group position={[2, 0, -2]}>
            {props.plantTemp.meshes.map((m, i) => (
              m.isEdges ? null : <mesh key={i} geometry={m.geometry} material={wallMat} position={m.position} />
            ))}
          </group>
        )}
        {props.sketchTemp && (
          <group position={[0, 2, -FAKE_ROOM_DEPTH / 2 + 0.1]}>
            {props.sketchTemp.meshes.map((m, i) => (
              m.isEdges ? null : <mesh key={i} geometry={m.geometry} material={props.sketchTemp?.material || wallMat} position={m.position} />
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

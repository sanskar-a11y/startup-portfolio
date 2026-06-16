"use client";

import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const SEGMENT_LENGTH = 30;
const CORRIDOR_WIDTH = 10;
const CORRIDOR_HEIGHT = 6;

import { DoorGeometry } from '../door/DoorGeometry';
import { WallDecorations } from './WallDecorations';
import { FinalDoorGeometry } from '../door/FinalDoorGeometry';
import { useUIStore } from '../../store/uiStore';

interface CorridorGeometryProps {
  numSegments: number;
  rooms: any[];
  onSegmentsReady: (segments: THREE.Group[]) => void;
}

export function CorridorGeometry({ numSegments, rooms, onSegmentsReady }: CorridorGeometryProps) {
  // 1. Shared Material (Texture)
  const floorTexture = useTexture('/textures/floor-sketch.png');
  const wallTexture = useTexture('/textures/wall-sketch.png');
  const { gl } = useThree();
  
  const { floorMaterial, wallMaterial, sketchyLineMaterial, doorTexture } = useMemo(() => {
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 3);
    floorTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    const floorMat = new THREE.MeshLambertMaterial({ map: floorTexture, color: 0xffffff });
    
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(1, 3);
    wallTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    const wallMat = new THREE.MeshLambertMaterial({ map: wallTexture, color: 0xffffff });

    // Door specific texture to avoid 1x10 repeat stretching
    const doorTex = wallTexture.clone();
    doorTex.repeat.set(1, 1);
    doorTex.needsUpdate = true;

    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2, transparent: true, opacity: 0.15 });
    
    floorMat.side = THREE.FrontSide;
    wallMat.side = THREE.FrontSide;

    return { floorMaterial: floorMat, wallMaterial: wallMat, sketchyLineMaterial: lineMat, doorTexture: doorTex };
  }, [floorTexture, wallTexture, gl]);

  // 2. Shared Geometries
  const { floorGeo, ceilingGeo, wallGeo, floorEdgesGeo, ceilingEdgesGeo, wallEdgesGeo, sharedDoorGeo, sharedTrimSideGeo, sharedTrimTopGeo, sharedDarkRecessGeo, sharedLabelGeo, ventGeo, ventEdgesGeo, lightGeo, lightEdgesGeo } = useMemo(() => {
    const floor = new THREE.PlaneGeometry(CORRIDOR_WIDTH, SEGMENT_LENGTH);
    const ceiling = new THREE.PlaneGeometry(CORRIDOR_WIDTH, SEGMENT_LENGTH);
    const wall = new THREE.PlaneGeometry(SEGMENT_LENGTH, CORRIDOR_HEIGHT);
    
    const floorEdges = new THREE.EdgesGeometry(floor);
    const ceilingEdges = new THREE.EdgesGeometry(ceiling);
    const wallEdges = new THREE.EdgesGeometry(wall);

    // Door now has physical thickness (0.04) to avoid paper-thin look
    const doorGeo = new THREE.BoxGeometry(3, 4.5, 0.04);
    
    // Physical Frame Trims
    const trimSide = new THREE.BoxGeometry(0.2, 4.7, 0.2); 
    const trimTop = new THREE.BoxGeometry(3.4, 0.2, 0.2);
    const recessGeo = new THREE.PlaneGeometry(3.4, 4.7);

    const labelGeo = new THREE.PlaneGeometry(2, 0.5);
    
    return {
      floorGeo: floor,
      ceilingGeo: ceiling,
      wallGeo: wall,
      floorEdgesGeo: floorEdges,
      ceilingEdgesGeo: ceilingEdges,
      wallEdgesGeo: wallEdges,
      sharedDoorGeo: doorGeo,
      sharedTrimSideGeo: trimSide,
      sharedTrimTopGeo: trimTop,
      sharedDarkRecessGeo: recessGeo,
      sharedLabelGeo: labelGeo,
      ventGeo: new THREE.BoxGeometry(1.5, 0.8, 0.05),
      ventEdgesGeo: new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.5, 0.8)),
      lightGeo: new THREE.BoxGeometry(2, 0.1, 4),
      lightEdgesGeo: new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 0.1, 4))
    };
  }, []);

  // Floor Scratches & Details (generated once)
  const { floorScratchesGeo } = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * CORRIDOR_WIDTH;
      const z = (Math.random() - 0.5) * SEGMENT_LENGTH;
      const length = Math.random() * 2 + 0.5;
      points.push(new THREE.Vector3(x, 0.01, z));
      points.push(new THREE.Vector3(x, 0.01, z + length));
    }
    return { floorScratchesGeo: new THREE.BufferGeometry().setFromPoints(points) };
  }, []);

  // Refs array to collect groups
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  useEffect(() => {
    // Filter out nulls and verify we have all segments
    const groups = groupRefs.current.filter((g): g is THREE.Group => g !== null && g !== undefined);
    console.log('CorridorGeometry mounted. Groups length:', groups.length, 'numSegments:', numSegments);
    if (groups.length === numSegments) {
      onSegmentsReady(groups);
    }
  }, [numSegments, onSegmentsReady]);

  // Render Segments
  const segments = Array.from({ length: numSegments }).map((_, i) => (
    <group 
      key={`segment-${i}`} 
      ref={(el) => { groupRefs.current[i] = el; }}
      position={[0, 0, -i * SEGMENT_LENGTH]}
    >
      {/* Floor */}
      <mesh geometry={floorGeo} material={floorMaterial} rotation={[-Math.PI / 2, 0, 0]} />
      <lineSegments geometry={floorEdgesGeo} material={sketchyLineMaterial} rotation={[-Math.PI / 2, 0, 0]} />
      {/* Floor Details: Wood grain scratches */}
      <lineSegments geometry={floorScratchesGeo} material={sketchyLineMaterial} />
      {/* Messy double line on floor edges to look like a sketch */}
      <lineSegments geometry={floorEdgesGeo} material={sketchyLineMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0.02, 0.01, 0]} />
      
      {/* Ceiling with Sketchy Tile Grid */}
      <mesh geometry={ceilingGeo} material={wallMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR_HEIGHT, 0]} />
      <lineSegments geometry={ceilingEdgesGeo} material={sketchyLineMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR_HEIGHT, 0]} />
      {/* Drop ceiling grid (10x10 grid with 5 divisions = 2x2 squares) */}
      <gridHelper args={[10, 5, 0x000000, 0x000000]} position={[0, CORRIDOR_HEIGHT - 0.02, 0]}>
        <lineBasicMaterial attach="material" color={0x000000} transparent opacity={0.08} />
      </gridHelper>
      
      {/* Ceiling Fluorescent Lights */}
      {i % 2 === 0 && (
        <group position={[0, CORRIDOR_HEIGHT - 0.05, -5]}>
          <mesh geometry={lightGeo}>
             <meshBasicMaterial color={0xffffff} />
          </mesh>
          <lineSegments geometry={lightEdgesGeo} material={sketchyLineMaterial} />
        </group>
      )}
      
      {/* Left Wall with Sketchy Air Vent */}
      <mesh geometry={wallGeo} material={wallMaterial} rotation={[0, Math.PI / 2, 0]} position={[-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, 0]} />
      <lineSegments geometry={wallEdgesGeo} material={sketchyLineMaterial} rotation={[0, Math.PI / 2, 0]} position={[-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, 0]} />
      {/* Vent only on every other segment to not clutter */}
      {i % 2 === 1 && (
        <group position={[-CORRIDOR_WIDTH / 2 + 0.05, CORRIDOR_HEIGHT - 1.2, -3]} rotation={[0, Math.PI / 2, 0]}>
          <mesh geometry={ventGeo} material={wallMaterial} />
          <lineSegments geometry={ventEdgesGeo} material={sketchyLineMaterial} />
          {/* Inner vent lines */}
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.3, 0.1))} material={sketchyLineMaterial} position={[0, 0.2, 0.03]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.3, 0.1))} material={sketchyLineMaterial} position={[0, 0, 0.03]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.3, 0.1))} material={sketchyLineMaterial} position={[0, -0.2, 0.03]} />
        </group>
      )}
      
      {/* Right Wall */}
      <mesh geometry={wallGeo} material={wallMaterial} rotation={[0, -Math.PI / 2, 0]} position={[CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, 0]} />
      <lineSegments geometry={wallEdgesGeo} material={sketchyLineMaterial} rotation={[0, -Math.PI / 2, 0]} position={[CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, 0]} />

      {/* Door Content Group */}
      <group name="contentGroup" userData={{ roomConfig: rooms[i] }}>
        <DoorGeometry 
          roomConfig={rooms[i]} 
          side={i % 2 === 0 ? 'left' : 'right'} 
          sharedDoorGeo={sharedDoorGeo}
          sharedTrimSideGeo={sharedTrimSideGeo}
          sharedTrimTopGeo={sharedTrimTopGeo}
          sharedDarkRecessGeo={sharedDarkRecessGeo}
          sharedLabelGeo={sharedLabelGeo}
          doorPaperTexture={doorTexture}
        />
        <WallDecorations segmentIndex={i} />
      </group>
    </group>
  ));

  return <group name="CorridorGeometry">{segments}</group>;
}

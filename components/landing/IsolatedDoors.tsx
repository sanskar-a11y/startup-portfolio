'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLandingStore } from '../../store/landingStore';
import * as THREE from 'three';
import { gsap } from 'gsap';

function DoorGeometry({ side }: { side: 'left' | 'right' }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentState = useLandingStore(state => state.currentState);
  const openDoor = useLandingStore(state => state.openDoor);
  
  const isLeft = side === 'left';
  const pivotX = isLeft ? -0.4 : 0.4;
  const doorWidth = 0.8;
  const meshPositionX = isLeft ? doorWidth / 2 : -doorWidth / 2;

  useEffect(() => {
    if (currentState === 'opening' && groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: isLeft ? -Math.PI * 0.6 : Math.PI * 0.6,
        duration: 1.5,
        ease: 'power3.out',
      });
    }
  }, [currentState, isLeft]);

  return (
    <group 
      ref={groupRef} 
      position={[pivotX, 0, 0]} 
      onClick={(e) => {
        e.stopPropagation();
        openDoor();
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <mesh position={[meshPositionX, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth, 2.2, 0.05]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
        {/* Door handle */}
        <mesh position={[isLeft ? 0.3 : -0.3, 0, 0.05]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
      </mesh>
    </group>
  );
}

function PortalLight() {
  const currentState = useLandingStore(state => state.currentState);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    if (currentState === 'opening' && lightRef.current) {
      // Delay the light flare slightly to wait for doors to crack open
      gsap.to(lightRef.current, {
        intensity: 50,
        distance: 10,
        duration: 2,
        delay: 0.5,
        ease: 'power2.inOut'
      });
    }
  }, [currentState]);

  return (
    <pointLight 
      ref={lightRef} 
      position={[0, 1.1, -1]} 
      intensity={0} 
      color="#ffffff" 
    />
  );
}

function CameraZoom() {
  const currentState = useLandingStore(state => state.currentState);
  const startTransition = useLandingStore(state => state.startTransition);
  const finishTransition = useLandingStore(state => state.finishTransition);

  useFrame((state) => {
    if (currentState === 'opening') {
      // Once doors start opening, trigger the transition phase after a short delay
      // In a real app we might just wait for a timeout or GSAP onComplete
    }
  });

  useEffect(() => {
    if (currentState === 'opening') {
      // Start zoom after doors are mostly open
      setTimeout(() => {
        startTransition();
      }, 1000);
    }
  }, [currentState, startTransition]);

  useEffect(() => {
    if (currentState === 'transitioning') {
      gsap.to(document.getElementById('isolated-doors-canvas'), {
        scale: 5,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
        onComplete: () => {
          finishTransition();
        }
      });
    }
  }, [currentState, finishTransition]);

  return null;
}

export default function IsolatedDoors() {
  return (
    <div 
      id="isolated-doors-canvas"
      style={{
        position: 'absolute',
        // These coordinates depend on the SVG layout. 
        // Our SVG door hole is roughly at 50% width, near the bottom.
        left: '50%',
        bottom: '150px', 
        width: '120px',
        height: '180px',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}
    >
      <Canvas
        camera={{ position: [0, 1.1, 3], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1} color="#ffffff" />
        <directionalLight position={[2, 5, 5]} intensity={1} castShadow />
        
        <DoorGeometry side="left" />
        <DoorGeometry side="right" />
        
        <PortalLight />
        <CameraZoom />
      </Canvas>
    </div>
  );
}

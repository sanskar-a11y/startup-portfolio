'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { boot, destroy } from '../../lib/vanilla/app.js';
import * as _THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useThree, useFrame } from '@react-three/fiber';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== 'production') {
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
  }
}

import { tick } from '../../lib/vanilla/webgl-corridor';
import { Suspense } from 'react';
import { CorridorGeometry } from '../corridor/CorridorGeometry';
import { getRooms } from '../../lib/vanilla/room-registry';
import { RaycastBridge } from './RaycastBridge';
import { CameraController } from '../camera/CameraController';

function VanillaBridge({ segmentGroups }: { segmentGroups: _THREE.Group[] | null }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const initialized = useRef(false);

  useEffect(() => {
    import('../../lib/vanilla/webgl-corridor').then(({ updateCamera, setAppState }) => {
      if (typeof updateCamera === 'function') updateCamera(camera);
      // Automatically ensure we are in CORRIDOR state since Landing is now handled entirely outside of Experience
      if (typeof setAppState === 'function') setAppState('CORRIDOR');
    });
  }, [camera]);

  useEffect(() => {
    if (!segmentGroups || initialized.current) return;
    initialized.current = true;
    
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      window.__SCENE__ = scene;
      window.__RENDERER__ = gl;
      
      // Context Loss Test Helper
      (window as any).__FORCE_CONTEXT_LOSS__ = () => {
        const ext = gl.getContext().getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      };
    }

    // Boot vanilla app, passing R3F's gl, scene, camera, and segmentGroups
    boot({ gl, scene, camera, segmentGroups });

    return () => {
      destroy();
      initialized.current = false;
    };
  }, [gl, scene, camera, segmentGroups]);

  useFrame(() => {
    // Tick drives the vanilla animation loop
    if (typeof tick === 'function') {
      tick();
    }
  }, 1);

  return null;
}

function FPSMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__FPS_MONITOR__ = { samples: [], lastTime: performance.now() };
    }
  }, []);

  useFrame(() => {
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      const monitor = (window as any).__FPS_MONITOR__;
      if (monitor) {
        const now = performance.now();
        const delta = now - monitor.lastTime;
        monitor.lastTime = now;
        const fps = 1000 / delta;
        monitor.samples.push(fps);
        if (monitor.samples.length > 600) monitor.samples.shift();
      }
    }
  });

  return null;
}

function CameraLight() {
  const camera = useThree(state => state.camera);
  const lightRef = useRef<_THREE.PointLight>(null);
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });
  return <pointLight ref={lightRef} intensity={1} color={0xffeebb} distance={60} />;
}

export default function Experience() {
  const [segmentGroups, setSegmentGroups] = useState<_THREE.Group[] | null>(null);
  const numSegments = getRooms().length;

  const handleSegmentsReady = useCallback((groups: _THREE.Group[]) => {
    setSegmentGroups(groups);
  }, []);

  return (
    <div id="experience-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 5] }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#ffffff']} />
          <fog attach="fog" args={['#ffffff', 10, 40]} />
          <ambientLight intensity={1.5} color={0xffffff} />
          <CameraLight />
          
          <CameraController />
          <CorridorGeometry numSegments={numSegments} rooms={getRooms()} onSegmentsReady={handleSegmentsReady} />
          <RaycastBridge />
          <VanillaBridge segmentGroups={segmentGroups} />
          {process.env.NODE_ENV !== 'production' && <FPSMonitor />}
        </Suspense>
      </Canvas>
    </div>
  );
}

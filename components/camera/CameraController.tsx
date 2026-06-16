'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCameraStore } from '../../store/cameraStore';
import { useThree } from '@react-three/fiber';

export function CameraController() {
  const target = useCameraStore(state => state.target);
  const duration = useCameraStore(state => state.duration);
  const camera = useThree(state => state.camera);

  useGSAP(() => {
    if (!target || !camera) return;

    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: duration,
      ease: 'power2.inOut',
      overwrite: true
    });

    gsap.to(camera.rotation, {
      x: target.rotX,
      y: target.rotY,
      z: target.rotZ,
      duration: duration,
      ease: 'power2.inOut',
      overwrite: true
    });
  }, [target, duration]);

  return null;
}

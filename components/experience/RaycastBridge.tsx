"use client";

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { interactiveObjects, getAppState, requestRoomExit, requestDoorActivation } from '../../lib/vanilla/webgl-corridor';
import { useDoorStore } from '../../store/doorStore';

export function RaycastBridge() {
  const { raycaster, camera, pointer, gl } = useThree();
  const pointerDirty = useRef(false);
  const hoveredDoorRef = useRef<any>(null);
  const hoveredExitRef = useRef(false);

  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') window.__CAMERA__ = camera;

  useEffect(() => {
    // We must track pointer moves, touches, and scrolls to set pointerDirty.
    const markDirty = () => { pointerDirty.current = true; };
    
    // We attach to window so it fires globally
    window.addEventListener('pointermove', markDirty, { passive: true });
    window.addEventListener('touchmove', markDirty, { passive: true });
    window.addEventListener('wheel', markDirty, { passive: true });

    return () => {
      window.removeEventListener('pointermove', markDirty);
      window.removeEventListener('touchmove', markDirty);
      window.removeEventListener('wheel', markDirty);
    };
  }, []);

  useFrame(() => {
    if (pointerDirty.current) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') window.__RAYCAST_COUNT__ = (window.__RAYCAST_COUNT__ || 0) + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      
      const appState = getAppState();

      if (appState === 'IN_CORRIDOR') {
        let newHoveredDoor = null;
        if (intersects.length > 0) {
          let hitObject: any = intersects[0].object;
          while (hitObject && !hitObject.userData.sectionId && !hitObject.userData.isExit) {
            hitObject = hitObject.parent;
          }
          if (hitObject && hitObject.userData.sectionId) {
            newHoveredDoor = hitObject;
          }
        }

        // Hover Diff Detection
        if (hoveredDoorRef.current !== newHoveredDoor) {
          if (hoveredDoorRef.current) {
            const doorId = hoveredDoorRef.current.userData.sectionId;
            const door = useDoorStore.getState().getDoor(doorId);
            if (door) door.exit();
          }
          if (newHoveredDoor) {
            const doorId = newHoveredDoor.userData.sectionId;
            const door = useDoorStore.getState().getDoor(doorId);
            if (door) door.enter();
          }
          hoveredDoorRef.current = newHoveredDoor as any;
          document.body.style.cursor = newHoveredDoor ? 'pointer' : 'auto';
        }
      } else if (appState === 'IN_ROOM') {
        let newHoveringExit = false;
        if (intersects.length > 0 && intersects[0].object.userData.isExit) {
          newHoveringExit = true;
        }

        if (hoveredExitRef.current !== newHoveringExit) {
          hoveredExitRef.current = newHoveringExit;
          document.body.style.cursor = newHoveringExit ? 'pointer' : 'auto';
        }
      }
      
      // Clear flag
      pointerDirty.current = false;
    }
  });

  // Handle Pointer Down
  useEffect(() => {
    const onPointerDown = (event: any) => {
      // Always raycast exactly when pointerdown occurs to ensure we don't miss a click
      const currentPointer = new THREE.Vector2();
      currentPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      currentPointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(currentPointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      
      const appState = getAppState();
      if (appState === 'TRANSITIONING') return;

      if (intersects.length > 0) {
        let hitObject: any = intersects[0].object;
        
        // Check if exit door in room
        if (appState === 'IN_ROOM' && hitObject.userData.isExit) {
          requestRoomExit();
          return;
        }

        // Check if corridor door
        while (hitObject && !hitObject.userData.sectionId && !hitObject.userData.isExit) {
          hitObject = hitObject.parent;
        }
        
        if (hitObject && hitObject.userData.sectionId && appState === 'IN_CORRIDOR') {
          requestDoorActivation(hitObject.userData.sectionId, hitObject);
        }
      }
    };
    
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [raycaster, pointer, camera]);

  return null;
}

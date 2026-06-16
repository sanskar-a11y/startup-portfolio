import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useDoorStore } from '../../store/doorStore';

interface DoorGeometryProps {
  roomConfig: any;
  side: 'left' | 'right';
  sharedTrimSideGeo: THREE.BoxGeometry;
  sharedTrimTopGeo: THREE.BoxGeometry;
  sharedDarkRecessGeo: THREE.PlaneGeometry;
  sharedDoorGeo: THREE.PlaneGeometry;
  sharedLabelGeo: THREE.PlaneGeometry;
  doorPaperTexture: THREE.Texture;
}

export function DoorGeometry({ 
  roomConfig, 
  side, 
  sharedTrimSideGeo,
  sharedTrimTopGeo,
  sharedDarkRecessGeo,
  sharedDoorGeo, 
  sharedLabelGeo, 
  doorPaperTexture 
}: DoorGeometryProps) {
  
  const doorGroupRef = useRef<THREE.Group>(null);
  const hingeGroupRef = useRef<THREE.Group>(null);
  const doorMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (doorGroupRef.current && hingeGroupRef.current && doorMeshRef.current) {
      doorGroupRef.current.userData = { 
        hinge: hingeGroupRef.current, 
        mesh: doorMeshRef.current 
      };
    }
  }, []);

  const { contextSafe } = useGSAP();

  const handleHoverEnter = contextSafe(() => {
    if (!hingeGroupRef.current) return;
    // Left door (hinge near camera) needs negative tilt to swing out.
    // Right door (hinge far from camera) needs positive tilt to swing out.
    const tilt = side === 'left' ? -Math.PI / 12 : Math.PI / 12;
    gsap.to(hingeGroupRef.current.rotation, { y: tilt, duration: 0.3, overwrite: true });
  });

  const handleHoverExit = contextSafe(() => {
    if (!hingeGroupRef.current) return;
    gsap.to(hingeGroupRef.current.rotation, { y: 0, duration: 0.3, overwrite: true });
  });

  const handleOpen = contextSafe(() => {
    if (!hingeGroupRef.current) return;
    const tilt = side === 'left' ? -Math.PI / 2 : Math.PI / 2;
    gsap.to(hingeGroupRef.current.rotation, { y: tilt, duration: 1.0, ease: 'power2.inOut', overwrite: true });
  });

  const handleClose = contextSafe(() => {
    if (!hingeGroupRef.current) return;
    gsap.to(hingeGroupRef.current.rotation, { y: 0, duration: 1.0, ease: 'power2.inOut', overwrite: true });
  });

  useEffect(() => {
    const doorId = roomConfig.id;
    const doorRecord = {
      id: doorId,
      mesh: doorGroupRef.current || undefined,
      hinge: hingeGroupRef.current || undefined,
      enter: handleHoverEnter,
      exit: handleHoverExit,
      open: handleOpen,
      close: handleClose
    };
    
    useDoorStore.getState().registerDoor(doorId, doorRecord);

    return () => {
      useDoorStore.getState().unregisterDoor(doorId);
    };
  }, [roomConfig.id, handleHoverEnter, handleHoverExit, handleOpen, handleClose]);

  const CORRIDOR_WIDTH = 10;
  const offset = (CORRIDOR_WIDTH / 2) - 0.05;
  const xPos = side === 'left' ? -offset : offset;
  const yRot = side === 'left' ? Math.PI / 2 : -Math.PI / 2;

  const hingeX = side === 'left' ? -1.5 : 1.5;
  const doorX = side === 'left' ? 1.5 : -1.5;

  // We need sketchy lines. We can create an EdgesGeometry for the door.
  const edgesGeo = new THREE.EdgesGeometry(sharedDoorGeo);

  // We need to create a text texture for the label.
  const labelTex = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(roomConfig.doorLabel || roomConfig.title, canvas.width / 2, canvas.height / 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [roomConfig.doorLabel, roomConfig.title]);

  // Blueprints
  const blueprintGeo1 = new THREE.PlaneGeometry(1.2, 1.6);
  const blueprintGeo2 = new THREE.PlaneGeometry(1.0, 1.4);
  const blueprintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tapeGeo = new THREE.PlaneGeometry(0.3, 0.1);
  const tapeMat = new THREE.MeshBasicMaterial({ color: 0x5a9bd4, transparent: true, opacity: 0.8 });
  
  const drawBlueprintLines = () => {
    // Create a detailed messy blueprint
    const points = [];
    // Outer border
    points.push(new THREE.Vector3(-0.55, 0.75, 0), new THREE.Vector3(0.55, 0.75, 0));
    points.push(new THREE.Vector3(0.55, 0.75, 0), new THREE.Vector3(0.55, -0.75, 0));
    points.push(new THREE.Vector3(0.55, -0.75, 0), new THREE.Vector3(-0.55, -0.75, 0));
    points.push(new THREE.Vector3(-0.55, -0.75, 0), new THREE.Vector3(-0.55, 0.75, 0));
    
    // House floor plan shapes
    points.push(new THREE.Vector3(-0.4, 0.4, 0), new THREE.Vector3(0.2, 0.4, 0));
    points.push(new THREE.Vector3(0.2, 0.4, 0), new THREE.Vector3(0.2, 0.0, 0));
    points.push(new THREE.Vector3(-0.4, 0.0, 0), new THREE.Vector3(0.2, 0.0, 0));
    points.push(new THREE.Vector3(-0.4, 0.4, 0), new THREE.Vector3(-0.4, -0.2, 0));
    points.push(new THREE.Vector3(-0.4, -0.2, 0), new THREE.Vector3(0.3, -0.2, 0));
    points.push(new THREE.Vector3(0.3, -0.2, 0), new THREE.Vector3(0.3, 0.2, 0));
    points.push(new THREE.Vector3(0.3, 0.2, 0), new THREE.Vector3(0.5, 0.2, 0));
    
    // Roof elevation
    points.push(new THREE.Vector3(-0.3, -0.4, 0), new THREE.Vector3(0, -0.7, 0));
    points.push(new THREE.Vector3(0, -0.7, 0), new THREE.Vector3(0.3, -0.4, 0));
    points.push(new THREE.Vector3(-0.3, -0.4, 0), new THREE.Vector3(0.3, -0.4, 0));

    // Grid lines
    for (let i = -0.5; i <= 0.5; i += 0.1) {
      points.push(new THREE.Vector3(i, 0.75, 0), new THREE.Vector3(i, -0.75, 0));
    }
    for (let i = -0.7; i <= 0.7; i += 0.1) {
      points.push(new THREE.Vector3(-0.55, i, 0), new THREE.Vector3(0.55, i, 0));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <lineSegments geometry={geo}>
         <lineBasicMaterial color={0x000000} linewidth={1} transparent opacity={0.25} />
      </lineSegments>
    );
  };

  // Door Panel Lines (to make the door look like it has inset panels)
  const doorPanelsGeo = new THREE.BufferGeometry().setFromPoints([
    // Top Panel
    new THREE.Vector3(-1.2, 2, 0), new THREE.Vector3(1.2, 2, 0),
    new THREE.Vector3(1.2, 2, 0), new THREE.Vector3(1.2, 0.2, 0),
    new THREE.Vector3(1.2, 0.2, 0), new THREE.Vector3(-1.2, 0.2, 0),
    new THREE.Vector3(-1.2, 0.2, 0), new THREE.Vector3(-1.2, 2, 0),
    // Bottom Panel
    new THREE.Vector3(-1.2, -0.2, 0), new THREE.Vector3(1.2, -0.2, 0),
    new THREE.Vector3(1.2, -0.2, 0), new THREE.Vector3(1.2, -2, 0),
    new THREE.Vector3(1.2, -2, 0), new THREE.Vector3(-1.2, -2, 0),
    new THREE.Vector3(-1.2, -2, 0), new THREE.Vector3(-1.2, -0.2, 0),
  ]);

  // Nailed Wooden Sign
  const signGeo = new THREE.PlaneGeometry(2.4, 0.8);
  const signMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White to match sketch
  const nailGeo = new THREE.CircleGeometry(0.04, 8);
  const nailMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Arrow curve pointing to door
  const arrowCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(side === 'left' ? 3 : -3, 2, 0),
    new THREE.Vector3(side === 'left' ? 2 : -2, 2.5, 0),
    new THREE.Vector3(side === 'left' ? 1.5 : -1.5, 2, 0),
    new THREE.Vector3(side === 'left' ? 1 : -1, 2, 0)
  );
  const arrowPoints = arrowCurve.getPoints(20);
  const arrowGeo = new THREE.BufferGeometry().setFromPoints(arrowPoints);
  const arrowHeadGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(side === 'left' ? 1.2 : -1.2, 2.2, 0),
    new THREE.Vector3(side === 'left' ? 1 : -1, 2, 0),
    new THREE.Vector3(side === 'left' ? 1.2 : -1.2, 1.8, 0)
  ]);

  return (
    <group ref={doorGroupRef} position={[xPos, 0, 0]} rotation={[0, yRot, 0]}>
      {/* Physical Frame Trim */}
      <group position={[0, 4.7 / 2, 0]}>
        <mesh position={[-1.6, 0, 0]} geometry={sharedTrimSideGeo}>
          <meshLambertMaterial color={0x222222} />
        </mesh>
        <mesh position={[1.6, 0, 0]} geometry={sharedTrimSideGeo}>
          <meshLambertMaterial color={0x222222} />
        </mesh>
        <mesh position={[0, 2.25, 0]} geometry={sharedTrimTopGeo}>
          <meshLambertMaterial color={0x222222} />
        </mesh>
      </group>

      {/* Dark Recess Plane */}
      <mesh position={[0, 4.7 / 2, -0.04]} geometry={sharedDarkRecessGeo}>
        <meshLambertMaterial color={0x333333} />
      </mesh>

      {/* Hinge Group - placed at 0.06 to recess the front of the door exactly 0.02 units behind the frame front */}
      <group ref={hingeGroupRef} position={[hingeX, 4.5 / 2, 0.06]}>
        {/* Door Mesh */}
        <mesh 
          ref={doorMeshRef} 
          position={[doorX, 0, 0]} 
          geometry={sharedDoorGeo}
          userData={{ type: 'door', sectionId: roomConfig.id, side: side, originalY: 0 }}
        >
          <meshStandardMaterial map={doorPaperTexture} bumpMap={doorPaperTexture} bumpScale={0.05} roughness={1} metalness={0} color={0xffffff} />
          <lineSegments geometry={edgesGeo}>
            <lineBasicMaterial color={0x000000} linewidth={2} transparent opacity={0.15} />
          </lineSegments>
          {/* Sketchy Door Panels - moved slightly forward to sit on the thick Box face */}
          <lineSegments geometry={doorPanelsGeo} position={[0, 0, 0.021]}>
            <lineBasicMaterial color={0x000000} linewidth={1} transparent opacity={0.15} />
          </lineSegments>
          {/* Duplicate messy lines for a "sketched twice" look */}
          <lineSegments geometry={doorPanelsGeo} position={[0.02, 0.02, 0.022]}>
            <lineBasicMaterial color={0x000000} linewidth={1} transparent opacity={0.05} />
          </lineSegments>
          
          {/* Blueprints and Tape on the Door */}
          <group position={[0, 0.5, 0.025]}>
            {/* Blueprint 1 */}
            <mesh geometry={blueprintGeo1} material={blueprintMat} position={[0, 0.6, 0]} rotation={[0, 0, 0.05]}>
               {drawBlueprintLines()}
               {/* Tape */}
               <mesh geometry={tapeGeo} material={tapeMat} position={[-0.5, 0.7, 0.01]} rotation={[0, 0, Math.PI/4]} />
               <mesh geometry={tapeGeo} material={tapeMat} position={[0.5, 0.7, 0.01]} rotation={[0, 0, -Math.PI/4]} />
               <mesh geometry={tapeGeo} material={tapeMat} position={[-0.5, -0.7, 0.01]} rotation={[0, 0, -Math.PI/4]} />
               <mesh geometry={tapeGeo} material={tapeMat} position={[0.5, -0.7, 0.01]} rotation={[0, 0, Math.PI/4]} />
            </mesh>
            {/* Blueprint 2 */}
            <mesh geometry={blueprintGeo2} material={blueprintMat} position={[0.1, -0.7, 0.01]} rotation={[0, 0, -0.1]}>
               {drawBlueprintLines()}
               {/* Tape */}
               <mesh geometry={tapeGeo} material={tapeMat} position={[-0.4, 0.6, 0.01]} rotation={[0, 0, Math.PI/4]} />
               <mesh geometry={tapeGeo} material={tapeMat} position={[0.4, 0.6, 0.01]} rotation={[0, 0, -Math.PI/4]} />
               <mesh geometry={tapeGeo} material={tapeMat} position={[-0.4, -0.6, 0.01]} rotation={[0, 0, -Math.PI/4]} />
               <mesh geometry={tapeGeo} material={tapeMat} position={[0.4, -0.6, 0.01]} rotation={[0, 0, Math.PI/4]} />
            </mesh>
          </group>
        </mesh>
      </group>

      {/* Nailed Wooden Sign */}
      <mesh 
        position={[0, 4.7 + 0.6, 0.06]} 
        geometry={signGeo}
        userData={{ type: 'door', sectionId: roomConfig.id }}
      >
        <meshBasicMaterial map={labelTex} transparent />
        <lineSegments geometry={new THREE.EdgesGeometry(signGeo)}>
           <lineBasicMaterial color={0x000000} linewidth={2} />
        </lineSegments>
        {/* Nails */}
        <mesh geometry={nailGeo} material={nailMat} position={[-1.1, 0.3, 0.01]} />
        <mesh geometry={nailGeo} material={nailMat} position={[1.1, 0.3, 0.01]} />
        <mesh geometry={nailGeo} material={nailMat} position={[-1.1, -0.3, 0.01]} />
        <mesh geometry={nailGeo} material={nailMat} position={[1.1, -0.3, 0.01]} />
      </mesh>

      {/* Hand-Drawn Arrow (Double stroked for messiness) */}
      <group position={[0, 0, 0.05]}>
        <primitive object={new THREE.Line(arrowGeo, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }))} />
        <primitive object={new THREE.Line(arrowHeadGeo, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }))} />
        {/* Messy second stroke */}
        <primitive object={new THREE.Line(arrowGeo, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, transparent: true, opacity: 0.5 }))} position={[0.05, -0.05, 0]} />
        <primitive object={new THREE.Line(arrowHeadGeo, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, transparent: true, opacity: 0.5 }))} position={[0.05, -0.05, 0]} />
      </group>
    </group>
  );
}

import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
/**
 * webgl-corridor.js
 * =================
 * Renders the interactive 3D WebGL corridor using Three.js and virtual scrolling.
 * Implements infinite segment recycling, door spawning, and proximity tilt.
 */

import { getRooms } from './room-registry';
import { initRooms, getActiveRoomScene, enterRoom, exitRoom, disposeRooms } from './room-manager';
import { useUIStore } from '../../store/uiStore';
import { useDoorStore } from '../../store/doorStore';
import gsap from 'gsap';

let scene: any, camera: any, renderer: any, cssRenderer: any;
let corridorGroup: any;
let animationId: any = null;
let isR3F = false;
export let interactiveObjects: any[] = [];

let sketchyLineMaterial: any;
const edgeGeoCache = new Map<any, any>();
let sharedFrameGeo: any;
let sharedDoorFrameGeo: any;
let sharedDoorGeo: any;
let sharedLabelGeo: any;
let doorPaperTexture: any;

let globalTextureLoader: any;
const textureCache = new Map<any, any>();
const labelCache = new Map<any, any>();

const SEGMENT_LENGTH = 100;
let NUM_SEGMENTS = 7;
const CORRIDOR_WIDTH = 10;
const CORRIDOR_HEIGHT = 6;
let segments: any[] = [];

let targetCameraZ = 5;
let currentCameraZ = 5;
let touchStartY = 0;
let currentRoomId: string | null = null;

let appState = 'LANDING'; // 'LANDING', 'CORRIDOR', 'ENTERING_ROOM', 'IN_ROOM', 'EXITING_ROOM'
export function getAppState() { return appState; }
export function setAppState(state: string) { appState = state; }

export function updateCamera(newCamera: any) {
  camera = newCamera;
}

let savedCorridorZ = 5;
let savedCorridorRotation: any = null;
let hoveredDoor: any = null;

let extractedData: Record<string, any> = {};

function extractDOMData() {
  extractedData['about'] = {
    title: (document.querySelector('.about__title') as HTMLElement)?.innerText || 'The Studio',
    text: [
      (document.querySelector('.about__intro') as HTMLElement)?.innerText || 'Welcome to the studio.',
      ...Array.from(document.querySelectorAll('.about__skills-list li')).map(li => '- ' + (li as HTMLElement).innerText)
    ]
  };
  
  document.querySelectorAll('.gallery__card').forEach(card => {
    const title = (card.querySelector('.gallery__card-title') as HTMLElement)?.innerText;
    const desc = (card.querySelector('.gallery__card-description') as HTMLElement)?.innerText;
    const tags = Array.from(card.querySelectorAll('.gallery__card-tag')).map(t => '#' + (t as HTMLElement).innerText).join(' ');
    if (title && desc) {
      extractedData[title.toLowerCase()] = {
        title: title,
        text: [desc, '', tags]
      };
    }
  });
}

export function init(config: any = {}) {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas && !config.gl) {
    console.warn('WebGL canvas not found.');
    return;
  }

  // Disable native DOM scrolling, we use virtual scroll now
  document.body.style.overflow = 'hidden';

  extractDOMData();

  if (config.gl) {
    isR3F = true;
    renderer = config.gl;
    scene = config.scene;
    camera = config.camera;
  } else {
    isR3F = false;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('gl-canvas') as HTMLCanvasElement,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (canvas) {
      canvas.style.position = 'absolute';
      canvas.style.top = '0px';
      canvas.style.zIndex = '1';
    }
  }

  // Initialize CSS3DRenderer for the terminal
  cssRenderer = new CSS3DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = '0px';
  cssRenderer.domElement.style.zIndex = '2';
  cssRenderer.domElement.style.pointerEvents = 'none'; // only elements inside will have auto
  const appContainer = document.getElementById('app');
  if (appContainer) appContainer.appendChild(cssRenderer.domElement);
  
  // if (typeof window !== 'undefined') window.__RENDERER__ = renderer; // removed

  window.addEventListener('resize', onWindowResize, false);
  // Removed pointermove and pointerdown native events since R3F Raycast Bridge handles them
  
  // Virtual Scroll Listeners
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });

  corridorGroup = new THREE.Group();
  scene.add(corridorGroup);

  if (!isR3F) {
    scene.fog = new THREE.Fog('#fafafa', 40, 150);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffeebb, 1, 60);
    camera.add(pointLight);
    scene.add(camera);
  } else {
    // If R3F, camera already in scene. We attach point light to R3F's camera manually for parity,
    // or rely on R3F to do it. The implementation plan said "Environment Layer only", so we let R3F handle pointLight.
    // Wait, let's attach it to camera here just in case R3F didn't, or let Experience.tsx do it.
    // I will let R3F do it in Experience.tsx.
  }

  globalTextureLoader = new THREE.TextureLoader();
  doorPaperTexture = globalTextureLoader.load('/textures/paper-texture.png');

  sharedFrameGeo = new THREE.PlaneGeometry(4, 2.5);
  sharedDoorFrameGeo = new THREE.PlaneGeometry(3.4, 4.7);
  sharedDoorGeo = new THREE.PlaneGeometry(3, 4.5);
  sharedLabelGeo = new THREE.PlaneGeometry(2, 0.5);

  sketchyLineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
    transparent: true,
    opacity: 0.05
  });



  const rooms = getRooms();
  NUM_SEGMENTS = rooms.length;
  
  // Initialize Rooms
  initRooms(interactiveObjects);

  // Initialize Segments from React
  if (config.segmentGroups) {
    segments = config.segmentGroups;
    
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const segGroup = segments[i];
      segGroup.userData = { index: i, roomConfig: rooms[i] };
      
      // We NO LONGER reparent segGroup into corridorGroup.
      // React owns the hierarchy. Vanilla mutates transforms.
      
      // Find door meshes and labels created by React for raycasting
      segGroup.traverse((child: any) => {
        if (child.userData && child.userData.type === 'door') {
          interactiveObjects.push(child);
        }
      });
    }
  }

  // We no longer start a manual RAF loop here. R3F's useFrame will call tick().
  if (!isR3F) {
    animationId = requestAnimationFrame(function fallbackLoop() {
      animationId = requestAnimationFrame(fallbackLoop);
      tick();
    });
  }
}

function onWheel(event: any) {
  if (appState !== 'CORRIDOR') return;
  event.preventDefault();
  // Translate wheel delta to camera Z movement
  targetCameraZ -= event.deltaY * 0.05;
}

function onTouchStart(event: any) {
  if (appState !== 'CORRIDOR') return;
  if (event.touches.length > 0) {
    touchStartY = event.touches[0].clientY;
  }
}

function onTouchMove(event: any) {
  if (appState !== 'CORRIDOR') return;
  event.preventDefault();
  if (event.touches.length > 0) {
    const deltaY = event.touches[0].clientY - touchStartY;
    targetCameraZ += deltaY * 0.1;
    touchStartY = event.touches[0].clientY;
  }
}

// populateSegment, addSketchyWireframe, and createDoor have been migrated to React.

let clock: any = null;

export function tick() {
  if (appState === 'TRANSITIONING') return;
  if (!camera) return;

  if (!clock) clock = new THREE.Clock();
  const elapsedTime = clock.getElapsedTime();
  
  if (appState === 'CORRIDOR') {
    // Check if we should spawn the finale (e.g. after traveling deep)
    const storeFinaleZ = useUIStore.getState().finaleZ;
    if (currentCameraZ < -600 && storeFinaleZ === null) {
      const nextSegZ = Math.floor(currentCameraZ / SEGMENT_LENGTH) * SEGMENT_LENGTH - SEGMENT_LENGTH;
      useUIStore.getState().setFinaleZ(nextSegZ);
    }
    
    // Clamp scrolling if finale is spawned
    if (storeFinaleZ !== null && targetCameraZ < storeFinaleZ + 5) {
      targetCameraZ = storeFinaleZ + 5;
    }

    // Smooth scroll interpolation
    currentCameraZ += (targetCameraZ - currentCameraZ) * 0.05;
    camera.position.z = currentCameraZ;

    // Coordinate Snapping (Float Precision Fix)
    if (currentCameraZ < -SEGMENT_LENGTH * NUM_SEGMENTS * 2) {
      const shift = SEGMENT_LENGTH * NUM_SEGMENTS;
      currentCameraZ += shift;
      targetCameraZ += shift;
      camera.position.z = currentCameraZ;
      segments.forEach(seg => seg.position.z += shift);
    } else if (currentCameraZ > SEGMENT_LENGTH * NUM_SEGMENTS * 2) {
      const shift = SEGMENT_LENGTH * NUM_SEGMENTS;
      currentCameraZ -= shift;
      targetCameraZ -= shift;
      camera.position.z = currentCameraZ;
      segments.forEach(seg => seg.position.z -= shift);
    }

    // Camera wobble
    camera.position.x = Math.sin(elapsedTime * 2) * 0.1;
    camera.position.y = 2 + Math.cos(elapsedTime * 4) * 0.05;

    // Segment recycling (Leapfrogging without content repopulation)
    segments.forEach(seg => {
      if (!seg || !seg.position) {
        console.error('Invalid segment in tick:', seg);
        return;
      }
      if (camera.position.z < seg.position.z - (SEGMENT_LENGTH * 3)) {
        seg.position.z -= SEGMENT_LENGTH * NUM_SEGMENTS;
      } 
      else if (camera.position.z > seg.position.z + (SEGMENT_LENGTH * 3)) {
        seg.position.z += SEGMENT_LENGTH * NUM_SEGMENTS;
      }
      // Door proximity interactions (Disabled - React GSAP owns transforms now)
      /*
      seg.traverse((child: any) => {
        if (child.userData && child.userData.type === 'door') {
          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);
          const distZ = Math.abs(worldPos.z - camera.position.z);
          
          const hinge = child.parent;
          const isLeft = child.userData.side === 'left';
          
          if (distZ < 20) {
            const factor = Math.max(0, 1 - (distZ / 20));
            const easeFactor = factor * factor * factor; // smooth steep curve
            
            const tilt = isLeft ? (-Math.PI / 4) * easeFactor : (Math.PI / 4) * easeFactor;
            const scale = 1 + (0.1 * easeFactor);
            
            hinge.rotation.y = tilt;
            child.scale.set(scale, scale, scale);
          } else {
            hinge.rotation.y = 0;
            child.scale.set(1, 1, 1);
          }
        }
      });
      */
    });

    // Hover interactions handled externally
    if (appState === 'CORRIDOR') {
      renderer.render(scene, camera);
      if (cssRenderer) cssRenderer.render(scene, camera);
    }
  } else if (appState === 'ENTERING_ROOM' || appState === 'EXITING_ROOM') {
    // Render the corridor while we animate the camera
    renderer.render(scene, camera);
    if (cssRenderer) cssRenderer.render(scene, camera);
  } else if (appState === 'IN_ROOM') {
    // Room interaction raycasting for exit doors
    // Exit interactions handled externally by handleHoverIntersects
    const roomScene = getActiveRoomScene();
    if (roomScene) {
      renderer.render(roomScene, camera);
      if (cssRenderer) cssRenderer.render(roomScene, camera);
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  if (!isR3F) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  if (cssRenderer) {
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Transition Mask now managed by React (Overlay.tsx + useUIStore)

export function requestRoomExit() {
  if (appState === 'ENTERING_ROOM') {
    // INTERRUPT ENTRY!
    appState = 'EXITING_ROOM';
    
    // Smoothly reverse camera
    import('../../store/cameraStore').then(({ useCameraStore }) => {
      useCameraStore.getState().returnHome();
    });
    
    // Reverse door hinge
    if (currentRoomId) {
      const callbacks = useDoorStore.getState().getDoor(currentRoomId);
      if (callbacks?.close) {
        callbacks.close();
      }
    }
    
    setTimeout(() => {
      appState = 'CORRIDOR';
      currentRoomId = null;
    }, 1000);
    
    return;
  }
  
  if (appState !== 'IN_ROOM') return;
  
  appState = 'EXITING_ROOM';
  
  // Fade out screen
  useUIStore.getState().fadeIn();

  // React owns hinge animation
  if (currentRoomId) {
    const callbacks = useDoorStore.getState().getDoor(currentRoomId);
    if (callbacks?.close) {
      callbacks.close();
    }
  }
  
  setTimeout(() => {
    exitRoom();
    
    // Restore Corridor Camera
    camera.position.z = savedCorridorZ;
    camera.position.x = 0;
    camera.position.y = 2;
    camera.rotation.copy(savedCorridorRotation);
    
    import('../../store/cameraStore').then(({ useCameraStore }) => {
      // Just to sync the state without tweening (since we teleported)
      // Duration 0 essentially
      useCameraStore.getState().returnHome(0);
    });
    
    appState = 'CORRIDOR';
    currentRoomId = null;
    
    // Fade in screen
    useUIStore.getState().fadeOut();
  }, 300);
}

export function requestDoorActivation(roomId: string, doorMesh: any) {
  if (appState !== 'CORRIDOR') return;
  if (!enterRoom(roomId)) return; // Invalid room
  
  appState = 'ENTERING_ROOM';
  currentRoomId = roomId;
  
  // Save Corridor State
  savedCorridorZ = camera.position.z;
  savedCorridorRotation = camera.rotation.clone();
  
  // Animate Door Open & Camera Walkthrough
  const hinge = doorMesh.parent.userData.hinge || doorMesh.parent.parent.userData.hinge;
  const isLeft = doorMesh.userData.side === 'left';
  
  // Get global world position of the door opening
  const worldPos = new THREE.Vector3();
  hinge.getWorldPosition(worldPos);
  
  // React owns hinge animation
  const callbacks = useDoorStore.getState().getDoor(roomId);
  if (callbacks?.open) {
    callbacks.open();
  }
  
  // React owns camera animation
  const targetX = isLeft ? -CORRIDOR_WIDTH/2 : CORRIDOR_WIDTH/2;
  const targetRotY = isLeft ? Math.PI/2 : -Math.PI/2;
  
  import('../../store/cameraStore').then(({ useCameraStore }) => {
    useCameraStore.getState().navigate(
      { x: targetX, y: camera.position.y, z: worldPos.z, rotX: 0, rotY: targetRotY, rotZ: 0 },
      { x: 0, y: 2, z: savedCorridorZ, rotX: 0, rotY: 0, rotZ: 0 },
      1.0
    );
  });
  
  // Fade mask after movement
  setTimeout(() => {
    if (appState !== 'ENTERING_ROOM') return; // Cancelled
    useUIStore.getState().fadeIn();
    
    setTimeout(() => {
      if (appState !== 'ENTERING_ROOM') return; // Cancelled
      // Swap to room
      appState = 'IN_ROOM';
      camera.position.set(0, 2, 5); // Default room entry
      camera.rotation.set(0, 0, 0);
      
      useUIStore.getState().fadeOut();
    }, 300);
  }, 800);
}

export function triggerFinaleSequence(doorZ: number) {
  appState = 'TRANSITIONING';
  
  gsap.to(camera.position, {
    z: doorZ - 10,
    duration: 2.0,
    ease: 'power2.inOut',
    onUpdate: () => {
      // Trigger white bloom after crossing threshold
      if (camera.position.z < doorZ && !useUIStore.getState().whiteOverlayVisible) {
        useUIStore.getState().fadeInWhite();
      }
    },
    onComplete: () => {
      // Allow bloom to fully opaque, then teleport and reset
      setTimeout(() => {
        currentCameraZ = 5;
        targetCameraZ = 5;
        camera.position.z = 5;
        useUIStore.getState().setFinaleZ(null);
        appState = 'CORRIDOR';
        useUIStore.getState().fadeOutWhite();
      }, 500);
    }
  });
}

export function dispose() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);

  if (renderer && !isR3F) {
    renderer.setAnimationLoop(null);
    renderer.dispose();
  }

  if (scene) {
    scene.traverse((object: any) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m: any) => { if (m.map) m.map.dispose(); m.dispose(); });
        } else {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      }
    });
  }

  edgeGeoCache.forEach(geo => geo.dispose());
  edgeGeoCache.clear();
  
  textureCache.forEach(tex => tex.dispose());
  textureCache.clear();
  labelCache.forEach(tex => tex.dispose());
  labelCache.clear();
  
  if (cssRenderer) {
    if (cssRenderer.domElement && cssRenderer.domElement.parentNode) {
      cssRenderer.domElement.parentNode.removeChild(cssRenderer.domElement);
    }
    cssRenderer = null;
  }
  
  if (sketchyLineMaterial) sketchyLineMaterial.dispose();
  if (sharedFrameGeo) sharedFrameGeo.dispose();
  if (sharedDoorFrameGeo) sharedDoorFrameGeo.dispose();
  if (sharedDoorGeo) sharedDoorGeo.dispose();
  if (sharedLabelGeo) sharedLabelGeo.dispose();
  if (doorPaperTexture) doorPaperTexture.dispose();

  document.body.style.overflow = '';
  interactiveObjects = [];
  
  disposeRooms();
  
  scene = null;
  camera = null;
  renderer = null;
  corridorGroup = null;
  segments = [];
}

function createTextTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  if (context) {
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 60px Caveat, cursive';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  
  return texture;
}

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__FORCE_STATE__ = function(s: string) { appState = s; };
  window.requestDoorActivation = requestDoorActivation;
  window.requestRoomExit = requestRoomExit;
}

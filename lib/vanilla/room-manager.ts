import { getRooms, RoomConfig } from './room-registry';
import * as THREE from 'three';

let roomScenes: Record<string, any> = {};
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__ROOM_SCENES__ = roomScenes;
}
let activeRoomId: string | null = null;

let sharedRoomFloorGeo: any, sharedRoomWallGeo: any;
let wallMaterial: any, floorMaterial: any;

function initGeometries() {
  if (sharedRoomFloorGeo) return;
  sharedRoomFloorGeo = new THREE.PlaneGeometry(30, 30);
  sharedRoomWallGeo = new THREE.PlaneGeometry(30, 15);
  
  const textureLoader = new THREE.TextureLoader();
  const paperTex = textureLoader.load('textures/paper-texture.webp');
  paperTex.wrapS = THREE.RepeatWrapping;
  paperTex.wrapT = THREE.RepeatWrapping;
  paperTex.repeat.set(3, 3);
  paperTex.anisotropy = 8;
  
  wallMaterial = new THREE.MeshStandardMaterial({ 
    map: paperTex, 
    bumpMap: paperTex,
    bumpScale: 0.03,
    roughness: 0.85,
    metalness: 0.1,
    color: 0xffffff, 
    side: THREE.DoubleSide 
  });
  floorMaterial = new THREE.MeshLambertMaterial({ map: paperTex, color: 0xdddddd });
}

function buildBasicRoom(roomConfig: RoomConfig) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#fafafa', 20, 60);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffeebb, 1, 60);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  // Floor
  const floor = new THREE.Mesh(sharedRoomFloorGeo, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Walls
  const backWall = new THREE.Mesh(sharedRoomWallGeo, wallMaterial);
  backWall.position.set(0, 7.5, -15);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(sharedRoomWallGeo, wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-15, 7.5, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(sharedRoomWallGeo, wallMaterial);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(15, 7.5, 0);
  scene.add(rightWall);

  const frontWall = new THREE.Mesh(sharedRoomWallGeo, wallMaterial);
  frontWall.rotation.y = Math.PI;
  frontWall.position.set(0, 7.5, 15);
  scene.add(frontWall);

  // Exit Door
  const exitDoorGeo = new THREE.PlaneGeometry(3, 4.5);
  const exitDoorMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const exitDoor = new THREE.Mesh(exitDoorGeo, exitDoorMat);
  exitDoor.position.set(0, 2.25, 14.9);
  exitDoor.rotation.y = Math.PI;
  exitDoor.userData = { isExit: true };
  scene.add(exitDoor);

  return { scene, exitDoor };
}

export function initRooms(interactiveObjects: any[]) {
  initGeometries();
  const rooms = getRooms();
  rooms.forEach(config => {
    const { scene, exitDoor } = buildBasicRoom(config);
    if (config.layoutBuilder) {
      config.layoutBuilder(scene);
    }
    interactiveObjects.push(exitDoor);
    roomScenes[config.id] = scene;
  });
}

export function getActiveRoomScene() {
  if (!activeRoomId) return null;
  return roomScenes[activeRoomId];
}

export function enterRoom(roomId: string) {
  if (roomScenes[roomId]) {
    activeRoomId = roomId;
    return true;
  }
  return false;
}

export function exitRoom() {
  activeRoomId = null;
}

export function disposeRooms() {
  for (const roomId in roomScenes) {
    const scene = roomScenes[roomId];
    if (scene) {
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m: any) => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
    }
  }
  
  if (sharedRoomFloorGeo) sharedRoomFloorGeo.dispose();
  if (sharedRoomWallGeo) sharedRoomWallGeo.dispose();
  if (wallMaterial) {
    if (wallMaterial.map) wallMaterial.map.dispose();
    wallMaterial.dispose();
  }
  if (floorMaterial) {
    if (floorMaterial.map) floorMaterial.map.dispose();
    floorMaterial.dispose();
  }
  
  roomScenes = {};
  activeRoomId = null;
}

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__ENTER_ROOM__ = enterRoom;
  window.__EXIT_ROOM__ = exitRoom;
}

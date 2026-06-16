import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __SCENE__: THREE.Scene;
    __RENDERER__: THREE.WebGLRenderer;
    __DOOR_CALLBACKS__: Record<string, any>;
    __CAMERA__: THREE.Camera;
    __RAYCAST_COUNT__: number;
    __UI_STORE__: any;
    __MOUNT__: () => void;
    __UNMOUNT__: () => void;
    __ROOM_SCENES__: Record<string, any>;
    __ENTER_ROOM__: (id: string) => void;
    __EXIT_ROOM__: () => void;
    __FORCE_STATE__: (state: string) => void;
    requestDoorActivation: (id: string, mesh: any) => void;
    requestRoomExit: () => void;
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
    THREE: typeof THREE & {
      CSS3DRenderer: typeof CSS3DRenderer;
      CSS3DObject: typeof CSS3DObject;
    };
  }
}

export {};

import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
export type RoomConfig = {
  id: string;
  theme: string;
  doorLabel: string;
  description: string;
  layoutBuilder: (scene: any) => void;
};

export const RoomRegistry: Record<string, RoomConfig> = {
  about: {
    id: 'about',
    theme: 'Executive Office',
    doorLabel: 'STUDIO',
    description: 'Personal info, skills, experience',
    layoutBuilder: (scene) => {
      // Wall-mounted skill displays
      const geo = new THREE.PlaneGeometry(6, 4);
      const mat = new THREE.MeshLambertMaterial({ color: 0x444444 });
      const board = new THREE.Mesh(geo, mat);
      board.position.set(-14.9, 7.5, -5);
      board.rotation.y = Math.PI / 2;
      scene.add(board);
    }
  },
  projects: {
    id: 'projects',
    theme: 'Innovation Lab',
    doorLabel: 'PROJECTS',
    description: 'Project showcases',
    layoutBuilder: (scene) => {
      // Innovation lab screens
      for (let i = 0; i < 3; i++) {
        const geo = new THREE.PlaneGeometry(4, 3);
        const mat = new THREE.MeshLambertMaterial({ color: 0x112233 });
        const screen = new THREE.Mesh(geo, mat);
        screen.position.set(-8 + i * 8, 7.5, -14.9);
        scene.add(screen);
      }
    }
  },
  services: {
    id: 'services',
    theme: 'Strategy Center',
    doorLabel: 'SERVICES',
    description: 'Service offerings',
    layoutBuilder: (scene) => {
      // Strategy boards
      const geo = new THREE.PlaneGeometry(8, 6);
      const mat = new THREE.MeshLambertMaterial({ color: 0x221111 });
      const board = new THREE.Mesh(geo, mat);
      board.position.set(0, 7.5, -14.9);
      scene.add(board);
    }
  },
  contact: {
    id: 'contact',
    theme: 'Communication Hub',
    doorLabel: 'CONTACT',
    description: 'Contact form and links',
    layoutBuilder: (scene) => {
      // Terminal Desk (Transferred from Corridor)
      const group = new THREE.Group();
      const deskGeo = new THREE.BoxGeometry(4, 2, 2);
      const deskMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.y = 1;
      group.add(desk);

      const monitorGeo = new THREE.BoxGeometry(3.2, 2.2, 0.5);
      const monitorMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const monitor = new THREE.Mesh(monitorGeo, monitorMat);
      monitor.position.y = 3.5;
      group.add(monitor);

      const originalForm = document.getElementById('contact-form');
      if (originalForm && CSS3DObject) {
        const formElement = originalForm.cloneNode(true) as HTMLElement;
        formElement.id = '';
        formElement.style.display = 'flex';
        formElement.style.flexDirection = 'column';
        formElement.style.justifyContent = 'center';
        formElement.style.background = '#fafafa';
        formElement.style.padding = '30px';
        formElement.style.width = '640px';
        formElement.style.height = '440px';
        formElement.style.border = '4px solid #1a1a1a';
        formElement.style.pointerEvents = 'auto'; 
        formElement.style.boxSizing = 'border-box';
        
        const cssObject = new CSS3DObject(formElement);
        cssObject.scale.set(3/640, 2/440, 1);
        cssObject.position.y = 3.5;
        cssObject.position.z = 0.26; 
        group.add(cssObject);
      }
      group.position.set(0, 0, -10);
      scene.add(group);
    }
  },
  achievements: {
    id: 'achievements',
    theme: 'Trophy Gallery',
    doorLabel: 'AWARDS',
    description: 'Achievements and trophies',
    layoutBuilder: (scene) => {
      // Pedestals
      for (let i = 0; i < 4; i++) {
        const geo = new THREE.BoxGeometry(1.5, 3, 1.5);
        const mat = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const pedestal = new THREE.Mesh(geo, mat);
        pedestal.position.set(-10 + i * 6.5, 1.5, -10);
        scene.add(pedestal);
      }
    }
  },
  case_studies: {
    id: 'case_studies',
    theme: 'War Room',
    doorLabel: 'CASES',
    description: 'Deep dives into specific cases',
    layoutBuilder: (scene) => {
      // Giant central table
      const geo = new THREE.BoxGeometry(12, 2, 6);
      const mat = new THREE.MeshLambertMaterial({ color: 0x223322 });
      const table = new THREE.Mesh(geo, mat);
      table.position.set(0, 1, -8);
      scene.add(table);
    }
  },
  labs: {
    id: 'labs',
    theme: 'R&D Facility',
    doorLabel: 'LABS',
    description: 'Experimental projects',
    layoutBuilder: (scene) => {
      // Floating abstract structures
      const geo = new THREE.OctahedronGeometry(2);
      const mat = new THREE.MeshLambertMaterial({ color: 0x992299, wireframe: true });
      const core = new THREE.Mesh(geo, mat);
      core.position.set(0, 7.5, -10);
      scene.add(core);
    }
  }
};

export function getRooms() {
  return Object.values(RoomRegistry);
}

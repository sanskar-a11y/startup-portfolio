import { create } from 'zustand';
import * as THREE from 'three';

export type DoorRecord = {
  id: string;
  mesh?: THREE.Object3D;
  hinge?: THREE.Group;

  enter: () => void;
  exit: () => void;
  open: () => void;
  close: () => void;
};

type DoorState = {
  doors: Record<string, DoorRecord>;
  registerDoor: (id: string, record: DoorRecord) => void;
  unregisterDoor: (id: string) => void;
  getDoor: (id: string) => DoorRecord | undefined;
};

export const useDoorStore = create<DoorState>((set, get) => ({
  doors: {},
  registerDoor: (id, record) => set((state) => ({ 
    doors: { ...state.doors, [id]: record } 
  })),
  unregisterDoor: (id) => set((state) => {
    const newDoors = { ...state.doors };
    delete newDoors[id];
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      window.__DOOR_CALLBACKS__ = newDoors;
    }
    return { doors: newDoors };
  }),
  getDoor: (id) => get().doors[id]
}));

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__DOOR_CALLBACKS__ = useDoorStore.getState().doors;
  useDoorStore.subscribe((state) => {
    window.__DOOR_CALLBACKS__ = state.doors;
  });
}

import { create } from 'zustand';

interface Transform {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
}

interface CameraState {
  target: Transform | null;
  homeTarget: Transform | null;
  duration: number;
  
  navigate: (target: Partial<Transform>, homeTarget: Partial<Transform>, duration?: number) => void;
  returnHome: (duration?: number) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  target: null,
  homeTarget: null,
  duration: 1.0,
  
  navigate: (target, homeTarget, duration = 1.0) => set((state) => ({
    target: { ...state.target, x: 0, y: 2, z: 5, rotX: 0, rotY: 0, rotZ: 0, ...target },
    homeTarget: { ...state.homeTarget, x: 0, y: 2, z: 5, rotX: 0, rotY: 0, rotZ: 0, ...homeTarget },
    duration
  })),
  
  returnHome: (duration = 1.0) => set((state) => ({
    target: state.homeTarget,
    duration
  }))
}));

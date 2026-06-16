import { create } from 'zustand';

export type LandingState = 'idle' | 'opening' | 'transitioning' | 'completed';

interface LandingStore {
  currentState: LandingState;
  openDoor: () => void;
  startTransition: () => void;
  finishTransition: () => void;
}

export const useLandingStore = create<LandingStore>((set, get) => ({
  currentState: 'idle',
  
  openDoor: () => {
    if (get().currentState === 'idle') {
      set({ currentState: 'opening' });
    } else {
      console.warn(`Cannot transition to opening from ${get().currentState}`);
    }
  },

  startTransition: () => {
    if (get().currentState === 'opening') {
      set({ currentState: 'transitioning' });
    } else {
      console.warn(`Cannot transition to transitioning from ${get().currentState}`);
    }
  },

  finishTransition: () => {
    if (get().currentState === 'transitioning') {
      set({ currentState: 'completed' });
    } else {
      console.warn(`Cannot transition to completed from ${get().currentState}`);
    }
  }
}));

import { create } from 'zustand';

interface UIState {
  overlayVisible: boolean;
  whiteOverlayVisible: boolean;
  finaleZ: number | null;
  fadeIn: () => void;
  fadeOut: () => void;
  fadeInWhite: () => void;
  fadeOutWhite: () => void;
  setFinaleZ: (z: number | null) => void;
  hasEntered: boolean;
  setHasEntered: (entered: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  overlayVisible: false,
  whiteOverlayVisible: false,
  finaleZ: null,
  fadeIn: () => set({ overlayVisible: true }),
  fadeOut: () => set({ overlayVisible: false }),
  fadeInWhite: () => set({ whiteOverlayVisible: true }),
  fadeOutWhite: () => set({ whiteOverlayVisible: false }),
  setFinaleZ: (z) => set({ finaleZ: z }),
  hasEntered: false,
  setHasEntered: (entered) => set({ hasEntered: entered })
}));

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__UI_STORE__ = useUIStore;
}

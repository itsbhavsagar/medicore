import { create } from "zustand";

interface SidebarStoreState {
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarStoreState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

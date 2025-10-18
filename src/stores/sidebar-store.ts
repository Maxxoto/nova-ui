import { create } from "zustand";

interface SidebarStore {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: true,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
}));

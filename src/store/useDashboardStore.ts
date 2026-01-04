import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TerminalTheme = 'amber' | 'green' | 'blue';
export type FontSize = 'small' | 'standard' | 'large';
export type SkinType = 'modern' | 'retro';
export type SyncStatus = 'idle' | 'syncing' | 'error';

interface DashboardState {
  theme: TerminalTheme;
  fontSize: FontSize;
  skin: SkinType;
  contrast: number;
  activeCategory: string;
  activeTag: string | null;
  activeNoteIndex: number;
  syncStatus: SyncStatus;
  triggerSync: number;
  
  // UI States
  isConfigOpen: boolean;
  isSearchExpanded: boolean;
  isAddingLink: boolean;
  isAddingTimer: boolean;

  setTheme: (theme: TerminalTheme) => void;
  setFontSize: (size: FontSize) => void;
  setSkin: (skin: SkinType) => void;
  setContrast: (contrast: number) => void;
  setActiveCategory: (category: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveNoteIndex: (index: number) => void;
  setSyncStatus: (status: SyncStatus) => void;
  requestSync: () => void;
  
  // UI Setters
  setIsConfigOpen: (isOpen: boolean) => void;
  setIsSearchExpanded: (isExpanded: boolean) => void;
  setIsAddingLink: (isAdding: boolean) => void;
  setIsAddingTimer: (isAdding: boolean) => void;
  
  resetAllData: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      theme: 'amber',
      fontSize: 'standard',
      skin: 'retro',
      contrast: 100,
      activeCategory: 'ALL SYSTEMS',
      activeTag: null,
      activeNoteIndex: 0,
      syncStatus: 'idle',
      triggerSync: 0,
      isConfigOpen: false,
      isSearchExpanded: false,
      isAddingLink: false,
      isAddingTimer: false,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setSkin: (skin) => set({ skin }),
      setContrast: (contrast) => set({ contrast }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setActiveTag: (activeTag) => set({ activeTag }),
      setActiveNoteIndex: (activeNoteIndex) => set({ activeNoteIndex }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      requestSync: () => set((state) => ({ triggerSync: state.triggerSync + 1 })),
      setIsConfigOpen: (isConfigOpen) => set({ isConfigOpen }),
      setIsSearchExpanded: (isSearchExpanded) => set({ isSearchExpanded }),
      setIsAddingLink: (isAddingLink) => set({ isAddingLink }),
      setIsAddingTimer: (isAddingTimer) => set({ isAddingTimer }),
      resetAllData: () => {
        window.localStorage.clear();
        window.location.reload();
      },
    }),
    {
      name: 'bdeck-dashboard-storage',
    }
  )
);

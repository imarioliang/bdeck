import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TerminalTheme = 'amber' | 'green' | 'blue';
export type FontSize = 'small' | 'standard' | 'large';
export type SyncStatus = 'idle' | 'syncing' | 'error';

interface DashboardState {
  theme: TerminalTheme;
  fontSize: FontSize;
  activeCategory: string;
  syncStatus: SyncStatus;
  setTheme: (theme: TerminalTheme) => void;
  setFontSize: (size: FontSize) => void;
  setActiveCategory: (category: string) => void;
  setSyncStatus: (status: SyncStatus) => void;
  resetAllData: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      theme: 'amber',
      fontSize: 'standard',
      activeCategory: 'ALL SYSTEMS',
      syncStatus: 'idle',
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
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

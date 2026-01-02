import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TerminalTheme = 'amber' | 'green' | 'blue';
export type FontSize = 'small' | 'standard' | 'large';

interface DashboardState {
  theme: TerminalTheme;
  fontSize: FontSize;
  activeCategory: string;
  setTheme: (theme: TerminalTheme) => void;
  setFontSize: (size: FontSize) => void;
  setActiveCategory: (category: string) => void;
  resetAllData: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      theme: 'amber',
      fontSize: 'standard',
      activeCategory: 'ALL SYSTEMS',
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
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

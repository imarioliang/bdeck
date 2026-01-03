'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { useEffect, useState } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useDashboardStore((state) => state.theme);
  const fontSize = useDashboardStore((state) => state.fontSize);
  const skin = useDashboardStore((state) => state.skin);
  const [mounted, setFocused] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setFocused(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-size', fontSize);
      document.documentElement.setAttribute('data-skin', skin);
    }
  }, [mounted, theme, fontSize, skin]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {skin === 'retro' && <div className="scanline-overlay" />}
      {children}
    </div>
  );
}

'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { useEffect, useState } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useDashboardStore((state) => state.theme);
  const fontSize = useDashboardStore((state) => state.fontSize);
  const [mounted, setFocused] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setFocused(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div data-theme={theme} data-size={fontSize} className="min-h-screen">
      {children}
    </div>
  );
}

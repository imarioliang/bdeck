'use client';

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  Action,
} from 'kbar';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useMemo, useState, useEffect } from 'react';

export const CommandPalette = ({ children }: { children: React.ReactNode }) => {
  const { setActiveCategory } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const actions: Action[] = useMemo(() => [
    {
      id: 'nav-all',
      name: 'ALL SYSTEMS',
      shortcut: ['g', 'a'],
      keywords: 'navigation dashboard all',
      perform: () => setActiveCategory('ALL SYSTEMS'),
      section: 'Navigation',
    },
    {
      id: 'nav-dev',
      name: 'DEVELOPMENT',
      shortcut: ['g', 'd'],
      keywords: 'navigation dev coding',
      perform: () => setActiveCategory('DEVELOPMENT'),
      section: 'Navigation',
    },
    {
      id: 'nav-comm',
      name: 'COMMUNICATION',
      shortcut: ['g', 'c'],
      keywords: 'navigation email chat slack',
      perform: () => setActiveCategory('COMMUNICATION'),
      section: 'Navigation',
    },
    {
      id: 'nav-anal',
      name: 'ANALYTICS',
      shortcut: ['g', 'y'],
      keywords: 'navigation stats data',
      perform: () => setActiveCategory('ANALYTICS'),
      section: 'Navigation',
    },
    {
      id: 'nav-sys',
      name: 'SYSTEM',
      shortcut: ['g', 's'],
      keywords: 'navigation core settings',
      perform: () => setActiveCategory('SYSTEM'),
      section: 'Navigation',
    },
  ], [setActiveCategory]);

  if (!mounted) return <>{children}</>;

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="z-[200] bg-black/60 backdrop-blur-sm">
          <KBarAnimator className="w-full max-w-xl bg-[#111111] border-2 border-terminal-main overflow-hidden shadow-[0_0_50px_-12px_rgba(255,176,0,0.4)]">
            <div className="p-4 border-b border-white/5">
              <KBarSearch className="w-full bg-transparent border-none focus:outline-none text-terminal-main font-mono text-sm uppercase tracking-widest placeholder:text-white/10" placeholder="SEARCH_SYSTEM_COMMANDS..." />
            </div>
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-[8px] font-black text-white/20 uppercase tracking-widest bg-white/[0.02]">
            {item}
          </div>
        ) : (
          <div
            className={`px-4 py-3 flex justify-between items-center cursor-pointer transition-colors ${
              active ? 'bg-terminal-main text-black shadow-inner' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
              {item.subtitle && <span className="text-[8px] opacity-60 uppercase">{item.subtitle}</span>}
            </div>
            {item.shortcut?.length ? (
              <div className="flex gap-1">
                {item.shortcut.map((sc) => (
                  <kbd key={sc} className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase rounded-[2px] ${active ? 'border-black/20 bg-black/10' : 'border-white/10 bg-white/5'}`}>
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}

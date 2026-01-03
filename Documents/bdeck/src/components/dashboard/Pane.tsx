'use client';

import { useSkin } from '@/hooks/useSkin';

export const Pane = ({ title, label, children, actions, badge, className = "" }: { title: string, label: string, children: React.ReactNode, actions?: React.ReactNode, badge?: string | number, className?: string }) => {
  const skin = useSkin();
  const isRetro = skin === 'retro';

  if (isRetro) {
    return (
      <div className={`border border-terminal-main bg-black p-2 md:p-3 flex flex-col font-mono relative ${className}`}>
        {/* Retro Header: [ TITLE ] PID: X */}
        <div className="flex justify-between items-baseline mb-4 border-b border-terminal-main/50 border-dashed pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base text-terminal-main uppercase">
              [ {title} ]
            </h2>
            {badge !== undefined && (
              <span className="bg-terminal-main text-black text-xs px-1">
                PEND: {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-terminal-main/70 text-xs">
            {label && <span>[ {label} ]</span>}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
        
        <div className="flex-1 relative">
           {children}
        </div>

        {/* Retro Status Footer (Mock) */}
        <div className="mt-2 border-t border-terminal-main/30 border-dotted pt-1 flex justify-between text-[10px] text-terminal-main/50">
           <span>MEM: 64K</span>
           <span>stat: OK</span>
        </div>
      </div>
    );
  }

  // Modern Default
  return (
    <div className={`border border-white/10 bg-black/40 p-3 md:p-4 flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-terminal-main rounded-full shadow-[0_0_5px_rgba(255,157,0,0.5)] animate-pulse"></span>
          <h2 className="text-[0.65rem] md:text-xs font-black text-terminal-main tracking-widest uppercase">
            {title}
          </h2>
          {badge !== undefined && (
            <span className="bg-terminal-main/5 border border-terminal-main/20 text-terminal-main text-[0.5rem] font-bold px-1.5 py-0.5 rounded-[1px]">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-white/10">
          <span className="text-[0.5rem] font-bold tracking-tighter uppercase">{label}</span>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
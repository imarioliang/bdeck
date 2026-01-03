'use client';

import { useSkin } from '@/hooks/useSkin';

export const Pane = ({ title, label, children, actions, badge, className = "" }: { title: string, label: string, children: React.ReactNode, actions?: React.ReactNode, badge?: string | number, className?: string }) => {
  const skin = useSkin();
  const isRetro = skin === 'retro';

  if (isRetro) {
    return (
      <div className={`border border-terminal-main bg-black p-3 flex flex-col font-mono relative ${className}`}>
        {/* Mockup-accurate Retro Header */}
        <div className="flex justify-between items-center mb-4 border-b border-terminal-main/30 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] text-terminal-main font-black uppercase">
              [ {title} ]
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {badge !== undefined && (
              <div className="border border-terminal-main px-1 text-[9px] text-terminal-main font-bold">
                {String(label).includes('OBJ') ? 'PEND' : 'PID'}: {badge}
              </div>
            )}
            {actions}
          </div>
        </div>
        
        <div className="flex-1 relative">
           {children}
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
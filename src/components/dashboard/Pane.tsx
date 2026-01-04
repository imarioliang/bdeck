'use client';

import { useSkin } from '@/hooks/useSkin';

export const Pane = ({ title, label, children, actions, badge, className = "", headerColor = "terminal-main", shortcut }: { 
  title: string, 
  label: string, 
  children: React.ReactNode, 
  actions?: React.ReactNode, 
  badge?: string | number, 
  className?: string,
  headerColor?: "terminal-main" | "terminal-green" | "terminal-red" | "terminal-blue",
  shortcut?: string
}) => {
  const skin = useSkin();
  const isRetro = skin === 'retro';

  const colorClass = headerColor === 'terminal-main' ? 'text-terminal-main' :
                    headerColor === 'terminal-green' ? 'text-terminal-green' :
                    headerColor === 'terminal-red' ? 'text-terminal-red' :
                    'text-terminal-blue';

  const borderClass = headerColor === 'terminal-main' ? 'border-terminal-main' :
                     headerColor === 'terminal-green' ? 'border-terminal-green' :
                     headerColor === 'terminal-red' ? 'border-terminal-red' :
                     'border-terminal-blue';

  const bgClass = headerColor === 'terminal-main' ? 'bg-terminal-main' :
                  headerColor === 'terminal-green' ? 'bg-terminal-green' :
                  headerColor === 'terminal-red' ? 'bg-terminal-red' :
                  'bg-terminal-blue';

  const shadowClass = headerColor === 'terminal-main' ? 'shadow-[0_0_5px_rgba(255,157,0,0.5)]' :
                     headerColor === 'terminal-green' ? 'shadow-[0_0_5px_rgba(74,222,128,0.5)]' :
                     headerColor === 'terminal-red' ? 'shadow-[0_0_5px_rgba(255,95,95,0.5)]' :
                     'shadow-[0_0_5px_rgba(59,130,246,0.5)]';

  if (isRetro) {
    return (
      <div className={`border ${borderClass} bg-black flex flex-col font-mono relative min-h-[400px] ${className}`}>
        {/* Mockup-accurate Retro Header */}
        <div className={`flex justify-between items-center ${bgClass} text-black px-3 py-1.5 mb-4 font-black retro-invert`}>
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] uppercase">
              [ {title} ]
            </h2>
            {shortcut && (
              <span className="text-[8px] bg-black text-terminal-main px-1 border border-terminal-main/30 ml-1">
                {shortcut}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {badge !== undefined && (
              <div className="border border-black px-1 text-[9px] font-bold">
                {String(label).includes('OBJ') ? 'PEND' : 'PID'}: {badge}
              </div>
            )}
            {actions}
          </div>
        </div>
        
        <div className="flex-1 relative px-3 pb-3">
           {children}
        </div>
      </div>
    );
  }

  // Modern Default
  return (
    <div className={`border border-white/10 bg-black/40 flex flex-col ${className}`}>
      <div className={`flex justify-between items-center px-3 py-2 md:px-4 bg-white/[0.03] border-b border-white/5`}>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 ${bgClass} rounded-full ${shadowClass} animate-pulse`}></span>
          <h2 className={`text-[0.65rem] md:text-xs font-black ${colorClass} tracking-widest uppercase`}>
            {title}
          </h2>
          {shortcut && (
            <span className="text-[0.5rem] bg-white/5 border border-white/10 text-white/40 px-1 py-0.5 rounded-[1px] font-mono">
              {shortcut}
            </span>
          )}
          {badge !== undefined && (
            <span className={`${colorClass}/5 border ${borderClass}/20 ${colorClass} text-[0.5rem] font-bold px-1.5 py-0.5 rounded-[1px]`}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-white/10">
          <span className="text-[0.5rem] font-bold tracking-tighter uppercase">{label}</span>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </div>
      </div>
      <div className="flex-1 p-3 md:p-4">
        {children}
      </div>
    </div>
  );
};
'use client';

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
  const borderClass = headerColor === 'terminal-main' ? 'border-terminal-main' :
                     headerColor === 'terminal-green' ? 'border-terminal-green' :
                     headerColor === 'terminal-red' ? 'border-terminal-red' :
                     'border-terminal-blue';

  const bgClass = headerColor === 'terminal-main' ? 'bg-terminal-main' :
                  headerColor === 'terminal-green' ? 'bg-terminal-green' :
                  headerColor === 'terminal-red' ? 'bg-terminal-red' :
                  'bg-terminal-blue';

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
};
export const Pane = ({ title, label, children, actions, badge, className = "" }: { title: string, label: string, children: React.ReactNode, actions?: React.ReactNode, badge?: string | number, className?: string }) => (
  <div className={`border border-white/10 bg-[#111111] p-3 md:p-4 flex flex-col ${className}`}>
    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-terminal-main rounded-full shadow-[0_0_5px_rgba(255,157,0,0.5)] animate-pulse"></span>
        <h2 className="text-[10px] md:text-xs font-black text-terminal-main tracking-widest uppercase">
          {title}
        </h2>
        {badge !== undefined && (
          <span className="bg-terminal-main/5 border border-terminal-main/20 text-terminal-main text-[8px] font-bold px-1.5 py-0.5 rounded-[1px]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-white/10">
        <span className="text-[8px] font-bold tracking-tighter uppercase">{label}</span>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);
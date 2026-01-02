export const Pane = ({ title, label, children, actions, className = "" }: { title: string, label: string, children: React.ReactNode, actions?: React.ReactNode, className?: string }) => (
  <div className={`border-4 md:border-8 border-black p-4 md:p-6 bg-white hover:bg-gray-50 transition-colors flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    <div className="flex justify-between items-start mb-6 border-b-4 md:border-b-8 border-black pb-2">
      <div>
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter inline-block">
          {title}
        </h2>
        <p className="text-[10px] md:text-xs font-bold opacity-70 leading-none mt-1">{label}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

export const Pane = ({ title, label, children, actions, className = "" }: { title: string, label: string, children: React.ReactNode, actions?: React.ReactNode, className?: string }) => (
  <div className={`border-4 border-black p-4 bg-white hover:bg-gray-50 transition-colors flex flex-col ${className}`}>
    <div className="flex justify-between items-start mb-4 border-b-4 border-black pb-1">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-tighter inline-block">
          {title}
        </h2>
        <p className="text-[10px] opacity-70 leading-none">{label}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);
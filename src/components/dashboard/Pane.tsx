export const Pane = ({ title, label, children, className = "" }: { title: string, label: string, children: React.ReactNode, className?: string }) => (
  <div className={`border-4 border-black p-4 bg-white hover:bg-gray-50 transition-colors flex flex-col ${className}`}>
    <h2 className="text-xl font-bold mb-4 uppercase tracking-tighter border-b-4 border-black pb-1 inline-block self-start">
      {title}
    </h2>
    <p className="text-sm mb-4">{label}</p>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

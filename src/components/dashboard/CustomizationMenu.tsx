'use client';

import { useDashboardStore, TerminalTheme, FontSize } from '@/store/useDashboardStore';
import { X, Download, RotateCcw, Monitor, Type } from 'lucide-react';

interface CustomizationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationMenu = ({ isOpen, onClose }: CustomizationMenuProps) => {
  const { theme, fontSize, setTheme, setFontSize, resetAllData } = useDashboardStore();

  const themes: { name: string; value: TerminalTheme; color: string }[] = [
    { name: 'Amber', value: 'amber', color: '#ffb000' },
    { name: 'Green', value: 'green', color: '#4ade80' },
    { name: 'Blue', value: 'blue', color: '#3b82f6' },
  ];

  const fontSizes: { name: string; value: FontSize }[] = [
    { name: 'Small', value: 'small' },
    { name: 'Standard', value: 'standard' },
    { name: 'Large', value: 'large' },
  ];

  const handleExport = () => {
    const data = {
      timers: localStorage.getItem('bdeck-timers'),
      todos: localStorage.getItem('bdeck-todos'),
      links: localStorage.getItem('bdeck-links'),
      note: localStorage.getItem('bdeck-note'),
      settings: localStorage.getItem('bdeck-dashboard-storage'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bdeck-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex justify-end">
      <div className="w-80 h-full bg-[#111111] border-l border-white/10 p-8 flex flex-col gap-10 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h2 className="text-terminal-main text-lg font-black tracking-widest uppercase">System Config</h2>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* THEME SELECTOR */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40">
            <Monitor size={14} />
            <span className="text-[0.65rem] font-black tracking-widest uppercase">Visual Theme</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex items-center justify-between p-3 border transition-all ${
                  theme === t.value 
                    ? 'border-terminal-main bg-terminal-main/10 text-terminal-main' 
                    : 'border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20'
                }`}
              >
                <span className="text-[0.65rem] font-bold uppercase">{t.name}</span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></div>
              </button>
            ))}
          </div>
        </section>

        {/* FONT SIZE SELECTOR */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40">
            <Type size={14} />
            <span className="text-[0.65rem] font-black tracking-widest uppercase">Text Scaling</span>
          </div>
          <div className="flex gap-2">
            {fontSizes.map((s) => (
              <button
                key={s.value}
                onClick={() => setFontSize(s.value)}
                className={`flex-1 py-2 border text-[0.6rem] font-black uppercase transition-all ${
                  fontSize === s.value 
                    ? 'border-terminal-main bg-terminal-main/10 text-terminal-main' 
                    : 'border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </section>

        {/* DATA MANAGEMENT */}
        <section className="mt-auto space-y-4 pt-10 border-t border-white/5">
          <button 
            onClick={handleExport}
            className="w-full py-3 border border-white/10 hover:border-white/30 text-white/60 hover:text-white flex items-center justify-center gap-2 text-[0.65rem] font-black uppercase tracking-widest transition-all"
          >
            <Download size={14} />
            Export Configuration
          </button>
          <button 
            onClick={() => confirm("DANGER: INITIATING FULL DATA WIPE. ALL LOGS, CHRONOS, AND MODULES WILL BE PURGED. CONTINUE?") && resetAllData()}
            className="w-full py-3 border border-terminal-red/20 hover:bg-terminal-red/10 text-terminal-red/60 hover:text-terminal-red flex items-center justify-center gap-2 text-[0.65rem] font-black uppercase tracking-widest transition-all"
          >
            <RotateCcw size={14} />
            Factory Reset
          </button>
        </section>
      </div>
    </div>
  );
};

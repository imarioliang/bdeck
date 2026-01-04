'use client';

import { useDashboardStore, TerminalTheme, FontSize, SkinType } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/utils/supabaseClient';
import { X, Download, RotateCcw, Monitor, Type, User, LogIn, LogOut, Layers } from 'lucide-react';

interface CustomizationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationMenu = ({ isOpen, onClose }: CustomizationMenuProps) => {
  const { theme, fontSize, skin, contrast, setTheme, setFontSize, setSkin, setContrast, resetAllData } = useDashboardStore();
  const { user, setAuthModalOpen } = useAuthStore();

  const themes: { name: string; value: TerminalTheme; color: string }[] = [
    { name: 'Amber', value: 'amber', color: '#ffb000' },
    { name: 'Green', value: 'green', color: '#4ade80' },
    { name: 'Blue', value: 'blue', color: '#3b82f6' },
  ];

  const skins: { name: string; value: SkinType }[] = [
    { name: 'Modern', value: 'modern' },
    { name: 'Retro', value: 'retro' },
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose(); // Close modal after logout
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={onClose}>
      <div 
        className={`w-full max-w-lg bg-black border ${skin === 'retro' ? 'border-terminal-main shadow-[0_0_30px_-10px_var(--terminal-main)]' : 'border-terminal-main/30 shadow-[0_0_50px_-20px_rgba(255,157,0,0.2)]'} overflow-hidden flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {skin === 'retro' ? (
          <>
            {/* Retro Header Bar */}
            <div className="bg-terminal-main text-black px-3 py-1 flex justify-between items-center font-black text-[9px] tracking-widest retro-invert">
              <span>[ SYSTEM_CONFIGURATION_UTILITY ]</span>
              <div className="flex gap-4 items-center">
                <span>_</span>
                <button 
                  onClick={onClose} 
                  className="hover:bg-black hover:text-terminal-main px-1 transition-colors font-black"
                >
                  X
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <div className="text-center space-y-2 mb-4">
                <h3 className="text-terminal-main text-sm font-black tracking-[0.2em] uppercase">Control Panel</h3>
                <p className="text-[9px] text-terminal-main/50 font-bold">Adjust system parameters and aesthetic profiles.</p>
                <div className="border-b border-terminal-main/20 border-dashed pt-2 w-full mx-auto max-w-[80%]" />
              </div>

              <div className="space-y-6">
                {/* AUTHENTICATION */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">Operator Identity</label>
                  </div>
                  {user ? (
                    <div className="bg-terminal-main/5 border border-terminal-main/20 px-3 py-2 flex items-center justify-between group/auth">
                      <span className="text-[10px] font-black uppercase truncate text-terminal-main">&gt; {user.email?.split('@')[0]}</span>
                      <button 
                        onClick={handleLogout}
                        className="text-[9px] font-black text-terminal-red hover:underline uppercase"
                      >
                        [ TERMINATE ]
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { onClose(); setAuthModalOpen(true); }}
                      className="w-full py-2.5 bg-terminal-main text-black flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_-5px_var(--terminal-main)]"
                    >
                      &lt; IDENTIFY / LOGIN &gt;
                    </button>
                  )}
                </div>

                {/* THEME SELECTOR */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">Visual Theme</label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`py-2 border text-[9px] font-black uppercase transition-all ${
                          theme === t.value 
                            ? 'retro-invert' 
                            : 'border-terminal-main/20 text-terminal-main/60 retro-hover-invert'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKIN SELECTOR HIDDEN - RETURNING TO RETRO ONLY */}

                {/* FONT SIZE SELECTOR */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">Text Scaling</label>
                  </div>
                  <div className="flex gap-2">
                    {fontSizes.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setFontSize(s.value)}
                        className={`flex-1 py-2 border text-[9px] font-black uppercase transition-all ${
                          fontSize === s.value 
                            ? 'retro-invert' 
                            : 'border-terminal-main/20 text-terminal-main/60 retro-hover-invert'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTRAST SLIDER */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">Signal Contrast</label>
                  </div>
                  <div className="bg-terminal-main/5 border border-terminal-main/20 px-3 py-2 flex items-center group/contrast focus-within:border-terminal-main/50 transition-all gap-4">
                    <span className="text-terminal-main text-xs font-black shrink-0">&gt;</span>
                    
                    <button 
                      onClick={() => setContrast(Math.max(50, contrast - 5))}
                      className="text-terminal-main hover:bg-terminal-main hover:text-black px-1.5 border border-terminal-main/40 text-[10px] font-black transition-all"
                    >
                      -
                    </button>

                    <div className="relative flex-1 h-2.5 bg-terminal-main/10 border border-terminal-main/20 overflow-hidden">
                      <div 
                        className="h-full bg-terminal-main transition-all duration-75" 
                        style={{ width: `${((contrast - 50) / (120 - 50)) * 100}%` }} 
                      />
                      <input 
                        type="range" 
                        min="50" 
                        max="120" 
                        value={contrast} 
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>

                    <button 
                      onClick={() => setContrast(Math.min(120, contrast + 5))}
                      className="text-terminal-main hover:bg-terminal-main hover:text-black px-1.5 border border-terminal-main/40 text-[10px] font-black transition-all"
                    >
                      +
                    </button>

                    <span className="text-[10px] font-black text-terminal-main w-10 text-right font-mono shrink-0">{contrast}%</span>
                  </div>
                </div>

                {/* DATA MANAGEMENT */}
                <div className="space-y-3 pt-4 border-t border-terminal-main/20 border-dashed">
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExport}
                      className="flex-1 py-2 border border-terminal-main/40 text-[9px] font-black text-terminal-main retro-hover-invert transition-all uppercase"
                    >
                      [ EXPORT_BACKUP ]
                    </button>
                    <button 
                      onClick={() => confirm("DANGER: INITIATING FULL DATA WIPE. CONTINUE?") && resetAllData()}
                      className="flex-1 py-2 border border-terminal-red/40 text-[9px] font-black text-terminal-red hover:bg-terminal-red hover:text-black transition-all uppercase"
                    >
                      [ FACTORY_RESET ]
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={onClose} 
                  className="w-full py-2.5 bg-terminal-main/10 border border-terminal-main/40 text-[10px] font-black text-terminal-main retro-hover-invert transition-all uppercase tracking-widest"
                >
                  &lt; EXIT CONFIGURATION &gt;
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full max-w-lg bg-[#111111] p-8 flex flex-col gap-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-terminal-main text-lg font-black tracking-widest uppercase">System Config</h2>
              <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* AUTHENTICATION */}
            <section className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-2 text-white/40">
                    <User size={14} />
                    <span className="text-[0.65rem] font-black tracking-widest uppercase text-white/90">Operator Identity</span>
                </div>
                {user ? (
                    <div className="bg-white/[0.02] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-terminal-main">
                            <div className="w-2 h-2 rounded-full bg-terminal-main animate-pulse"></div>
                            <span className="text-[0.6rem] font-black uppercase truncate text-white/90">{user.email}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[0.6rem] font-bold text-white/40 hover:text-terminal-red uppercase tracking-wider transition-colors"
                        >
                            <LogOut size={12} />
                            Terminate Session
                        </button>
                    </div>
                ) : (
                    <button 
                                                onClick={() => { onClose(); setAuthModalOpen(true); }}
                                                className="w-full py-3 border border-terminal-main/30 bg-terminal-main/5 hover:bg-terminal-main/10 text-terminal-main flex items-center justify-center gap-2 text-[0.65rem] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_-5px_rgba(255,176,0,0.15)] text-white/90"                >
                        <LogIn size={14} />
                        Identify / Login
                    </button>
                )}
            </section>

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

            {/* SKIN SELECTOR HIDDEN */}

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

            {/* CONTRAST SLIDER */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-white/40">
                <Monitor size={14} />
                <span className="text-[0.65rem] font-black tracking-widest uppercase">Signal Contrast</span>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-4 py-3">
                <input 
                  type="range" 
                  min="50" 
                  max="200" 
                  value={contrast} 
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="flex-1 accent-terminal-main cursor-pointer h-1 bg-white/10 appearance-none rounded-full"
                />
                <span className="text-[0.65rem] font-black text-white/40 w-8 text-right">{contrast}%</span>
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
        )}
      </div>
    </div>
  );
};

'use client';

import { useState, useMemo } from 'react';
import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";
import { CustomizationMenu } from "@/components/dashboard/CustomizationMenu";
import { AsciiLogo } from "@/components/dashboard/AsciiLogo";
import { AuthModal } from "@/components/auth/AuthModal";
import { SyncManager } from "@/components/sync/SyncManager";
import { HeaderIndicators } from "@/components/dashboard/HeaderIndicators";
import { Search } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Home() {
  const [linksSearchTerm, setLinksSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isAddingTimer, setIsAddingTimer] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const { activeCategory, setActiveCategory } = useDashboardStore();
  
  // Initialize Global Shortcuts
  useKeyboardShortcuts();
  
  const [projects] = useLocalStorage<any[]>('bdeck-timers', []);
  const [todos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [links] = useLocalStorage<any[]>('bdeck-links', []);

  const pendingTodosCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

  const categories = useMemo(() => {
    const base = ['ALL SYSTEMS', 'DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
    const custom = links.map(l => l.category).filter(Boolean) as string[];
    return Array.from(new Set([...base, ...custom]));
  }, [links]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d4] font-mono selection:bg-terminal-main selection:text-black antialiased overflow-x-hidden">
      <SyncManager />
      <AuthModal />
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        
        <CustomizationMenu isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />

        {/* COMBINED CONTAINER FOR HEADER AND LINKS */}
        <div className="border border-white/10 bg-white/[0.01] overflow-hidden shadow-[0_0_40px_-20px_rgba(0,0,0,1)]">
          
          {/* HEADER SECTION */}
          <header className="p-4 md:p-6 border-b border-white/10 bg-white/[0.01] space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <button 
                onClick={() => setIsConfigOpen(true)}
                className="text-left group transition-all"
              >
                <div className="flex items-center gap-4">
                  <AsciiLogo />
                  <div className="flex flex-col">
                    <h1 className="text-sm md:text-base font-black tracking-[0.3em] uppercase leading-none text-terminal-main group-hover:text-white transition-colors">Command Center</h1>
                    <p className="text-[0.55rem] text-white/40 mt-1.5 font-bold tracking-widest group-hover:text-white/60 transition-colors uppercase">&gt; System_Config_v4.2</p>
                  </div>
                </div>
              </button>
              
              <div className="flex items-center gap-6">
                <HeaderIndicators />
              </div>
            </div>

            {/* UNIFIED NAV & SEARCH ROW */}
            <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-6">
              {!isSearchExpanded && (
                <nav className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left duration-300">
                  {categories.map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveCategory(tab)}
                      className={`px-4 py-1 text-[0.6rem] font-black border transition-all tracking-widest ${activeCategory === tab ? 'bg-terminal-main text-black border-terminal-main shadow-[0_0_10px_-2px_rgba(255,176,0,0.3)]' : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white bg-white/[0.01]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              )}

              <div className={`flex items-center justify-end transition-all duration-300 ${isSearchExpanded ? 'flex-1' : 'w-10'}`}>
                <div className={`relative group w-full flex items-center justify-end`}>
                  <button 
                    onClick={() => {
                      setIsSearchExpanded(!isSearchExpanded);
                      if (isSearchExpanded) setLinksSearchTerm('');
                    }}
                    className={`p-2 text-white/20 hover:text-terminal-main transition-colors ${isSearchExpanded ? 'absolute left-0 z-10' : ''}`}
                  >
                    <Search size={16} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="SEARCH_MODULES..."
                    autoFocus={isSearchExpanded}
                    value={linksSearchTerm}
                    onChange={(e) => setLinksSearchTerm(e.target.value)}
                    className={`bg-black/40 border border-white/10 py-2 text-[0.65rem] focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest placeholder:text-white/20 ${
                      isSearchExpanded 
                        ? 'w-full pl-10 pr-4 opacity-100' 
                        : 'w-0 opacity-0 pointer-events-none'
                    }`}}
                  />
                  {isSearchExpanded && (
                    <button 
                      onClick={() => { setIsSearchExpanded(false); setLinksSearchTerm(''); }}
                      className="absolute right-3 text-white/10 hover:text-terminal-red transition-colors"
                    >
                      <div className="text-[10px] font-black">ESC</div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* APPS GRID */}
          <section className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            <LinksPane 
              isAdding={isAddingLink} 
              setIsAdding={setIsAddingLink} 
              searchTerm={linksSearchTerm}
              activeCategory={activeCategory}
            />
          </section>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div id="pane-timers" className="lg:col-span-4 h-full">
            <Pane title="Project Timers" badge={`TOTAL: ${projects.length}`} label="SYS_CHRONO">
              <TimersPane isAdding={isAddingTimer} setIsAdding={setIsAddingTimer} />
            </Pane>
          </div>
          <div id="pane-todo" className="lg:col-span-4 h-full">
            <Pane title="Mission Objectives" badge={`${pendingTodosCount} Pending`} label="OBJ_PRIORITY">
              <TodoPane />
            </Pane>
          </div>
          <div id="pane-notes" className="lg:col-span-4 h-full">
            <Pane title="Data Log" label="LOG_STREAM" actions={<WindowControls />}>
              <NotesPane />
            </Pane>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.6rem] font-black text-white/10 tracking-[0.2em] border-t border-white/5 uppercase">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-terminal-green rounded-full shadow-terminal"></span>
              <span>MEM: 64K OK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse shadow-terminal"></span>
              <span>CPU: 8%</span>
            </div>
          </div>
          <div>Retro.OS Build 2024.1</div>
        </footer>
      </div>
    </div>
  );
}

const WindowControls = () => (
  <div className="flex gap-1">
    <div className="w-2 h-2 rounded-full bg-terminal-red opacity-40"></div>
    <div className="w-2 h-2 rounded-full bg-terminal-main opacity-40"></div>
    <div className="w-2 h-2 rounded-full bg-terminal-green opacity-40"></div>
  </div>
);

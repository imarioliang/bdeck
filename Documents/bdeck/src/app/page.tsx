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
import { useSkin } from '@/hooks/useSkin';
import { DirectoriesSidebar } from "@/components/dashboard/DirectoriesSidebar";

export default function Home() {
  const [linksSearchTerm, setLinksSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isAddingTimer, setIsAddingTimer] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const { activeCategory, setActiveCategory } = useDashboardStore();
  const skin = useSkin();
  const isRetro = skin === 'retro';
  
  // Initialize Global Shortcuts
  useKeyboardShortcuts();
  
  const [projects] = useLocalStorage<any[]>('bdeck-timers', []);
  const [todos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [links] = useLocalStorage<any[]>('bdeck-links', []);

  const pendingTodosCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

  const categories = useMemo(() => {
    const base = ['ALL SYSTEMS', 'DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
    const custom = links.map(l => l.category).filter(Boolean) as string[];
    const uniqueCategories = Array.from(new Set([...base, ...custom]));
    // Remove 'ALL SYSTEMS' from the sidebar categories since it's implied or handled separately
    return uniqueCategories.filter(c => c !== 'ALL SYSTEMS');
  }, [links]);

  return (
    <div className={`min-h-screen font-mono selection:bg-terminal-main selection:text-black antialiased overflow-x-hidden transition-colors ${isRetro ? 'bg-black text-terminal-main' : 'bg-[#0a0a0a] text-[#d4d4d4]'}`}>
      <SyncManager />
      <AuthModal />
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        
        <CustomizationMenu isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />

        {/* COMBINED CONTAINER FOR HEADER AND LINKS */}
        <div className={`overflow-hidden transition-all ${isRetro ? 'border border-terminal-main bg-black' : 'border border-white/10 bg-white/[0.01] shadow-[0_0_40px_-20px_rgba(0,0,0,1)]'}`}>
          
          {/* HEADER SECTION */}
          {isRetro ? (
            <header className="flex flex-col">
              {/* Row 1: System Bar */}
              <div className="flex justify-between items-center bg-terminal-main text-black px-3 py-1 font-bold text-[10px] tracking-widest">
                <span>[ COMMAND_CENTER_V1.0 ]</span>
                <button 
                  onClick={() => setIsConfigOpen(true)} 
                  className="hover:bg-black hover:text-terminal-main px-2 py-0.5 transition-all border border-transparent hover:border-black uppercase font-black"
                >
                  [ MENU ]
                </button>
              </div>
              
              {/* Row 2: Path Bar / Search */}
              <div className="flex items-center gap-0 px-3 py-1.5 border-b border-terminal-main bg-black group/path">
                <span className="text-[10px] text-terminal-main font-bold whitespace-nowrap mr-2">PATH:</span>
                <div className="flex-1 flex items-center bg-terminal-main/5 border border-terminal-main/20 px-2 py-0.5 group-focus-within/path:border-terminal-main/50 transition-all">
                  <span className="text-terminal-main text-[10px] mr-2">C:\USERS\ADMIN\SEARCH\</span>
                  <input 
                    type="text" 
                    placeholder="INIT_QUERY..."
                    value={linksSearchTerm}
                    onChange={(e) => setLinksSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none py-0.5 text-xs text-terminal-main placeholder:text-terminal-main/20 focus:outline-none uppercase tracking-widest font-mono"
                  />
                  <span className="text-terminal-main text-xs animate-pulse ml-1">█</span>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <HeaderIndicators />
                  <button className="border border-terminal-main px-2 py-0.5 text-[10px] text-terminal-main hover:bg-terminal-main hover:text-black transition-colors font-bold tracking-tighter">↑ UP</button>
                </div>
              </div>
            </header>
          ) : (
            <header className={`p-4 md:p-6 transition-all ${isRetro ? 'border-b border-terminal-main bg-black space-y-4' : 'border-b border-white/10 bg-white/[0.01] space-y-6'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button 
                  onClick={() => setIsConfigOpen(true)}
                  className="text-left group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <AsciiLogo />
                    <div className="flex flex-col">
                      <h1 className="text-sm md:text-base font-black tracking-[0.3em] uppercase leading-none text-terminal-main group-hover:text-white transition-colors">Command Center</h1>
                      <p className={`text-[0.55rem] mt-1.5 font-bold tracking-widest group-hover:text-white/60 transition-colors uppercase ${isRetro ? 'text-terminal-main/60' : 'text-white/40'}`}>&gt; System_Config_v4.2</p>
                    </div>
                  </div>
                </button>
                
                <div className="flex items-center gap-6">
                  <HeaderIndicators />
                </div>
              </div>

              {/* UNIFIED NAV & SEARCH ROW */}
              <div className={`flex items-center justify-between gap-4 border-t pt-6 ${isRetro ? 'border-terminal-main/50' : 'border-white/5'}`}>
                {!isSearchExpanded && (
                  <nav className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left duration-300">
                    {['ALL SYSTEMS', ...categories].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveCategory(tab)}
                        className={`px-4 py-1 text-[0.6rem] font-black border transition-all tracking-widest ${
                          activeCategory === tab 
                            ? (isRetro ? 'bg-terminal-main text-black border-terminal-main' : 'bg-terminal-main text-black border-terminal-main shadow-[0_0_10px_-2px_rgba(255,176,0,0.3)]') 
                            : (isRetro ? 'border-terminal-main/30 text-terminal-main/40 hover:border-terminal-main/60 hover:text-terminal-main bg-black' : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white bg-white/[0.01]')
                        }`}
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
                      className={`p-2 transition-colors ${isRetro ? 'text-terminal-main/40 hover:text-terminal-main' : 'text-white/20 hover:text-terminal-main'} ${isSearchExpanded ? 'absolute left-0 z-10' : ''}`}
                    >
                      <Search size={16} />
                    </button>
                    <input 
                      type="text" 
                      placeholder="SEARCH_MODULES..."
                      autoFocus={isSearchExpanded}
                      value={linksSearchTerm}
                      onChange={(e) => setLinksSearchTerm(e.target.value)}
                      className={`transition-all uppercase tracking-widest ${
                        isRetro 
                          ? 'bg-black border border-terminal-main/50 py-2 text-xs text-terminal-main placeholder:text-terminal-main/20' 
                          : 'bg-black/40 border border-white/10 py-2 text-[0.65rem] placeholder:text-white/20'
                      } focus:outline-none focus:border-terminal-main/40 ${
                        isSearchExpanded 
                          ? 'w-full pl-10 pr-4 opacity-100' 
                          : 'w-0 opacity-0 pointer-events-none'
                      }`}
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
          )}

          {/* MAIN SECTION WITH SIDEBAR AND GRID */}
          <div className={`flex flex-col md:flex-row h-full min-h-[400px]`}>
            {isRetro && (
              <aside className="w-full md:w-[250px] border-r border-terminal-main bg-black">
                <DirectoriesSidebar 
                  categories={['ALL SYSTEMS', ...categories]} 
                  activeCategory={activeCategory} 
                  setActiveCategory={setActiveCategory} 
                />
              </aside>
            )}
            
            {/* APPS GRID */}
            <section className={`flex-1 p-4 md:p-6 ${isRetro ? 'flex flex-col overflow-y-auto custom-scrollbar' : 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3'}`}>
              <LinksPane 
                isAdding={isAddingLink} 
                setIsAdding={setIsAddingLink} 
                searchTerm={linksSearchTerm}
                activeCategory={activeCategory}
              />
            </section>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div id="pane-timers" className="lg:col-span-4 h-full">
            <Pane title="Project Timers" badge={isRetro ? projects.length : `TOTAL: ${projects.length}`} label="SYS_CHRONO">
              <TimersPane isAdding={isAddingTimer} setIsAdding={setIsAddingTimer} />
            </Pane>
          </div>
          <div id="pane-todo" className="lg:col-span-4 h-full">
            <Pane title="Mission Objectives" badge={isRetro ? pendingTodosCount : `${pendingTodosCount} Pending`} label="OBJ_PRIORITY">
              <TodoPane />
            </Pane>
          </div>
          <div id="pane-notes" className="lg:col-span-4 h-full">
            <Pane title="Data Log" label="LOG_STREAM" actions={isRetro ? null : <WindowControls />}>
              <NotesPane />
            </Pane>
          </div>
        </div>

        {/* FOOTER */}
        <footer className={`pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.6rem] font-black tracking-[0.2em] border-t transition-all uppercase ${isRetro ? 'border-terminal-main text-terminal-main' : 'border-white/5 text-white/10'}`}>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isRetro ? 'bg-terminal-main shadow-[0_0_5px_var(--terminal-main)]' : 'bg-terminal-green shadow-terminal'}`}></span>
              <span>MEM: 64K OK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isRetro ? 'bg-terminal-main shadow-[0_0_5px_var(--terminal-main)]' : 'bg-terminal-green shadow-terminal'}`}></span>
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

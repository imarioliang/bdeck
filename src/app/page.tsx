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
  const [isEditingTimers, setIsEditingTimers] = useState(false);
  
  const { 
    activeCategory, setActiveCategory, 
    activeTag, setActiveTag,
    isConfigOpen, setIsConfigOpen,
    isSearchExpanded, setIsSearchExpanded,
    isAddingLink, setIsAddingLink,
    isAddingTimer, setIsAddingTimer
  } = useDashboardStore();
  const skin = useSkin();
  const isRetro = skin === 'retro';
  
  // Initialize Global Shortcuts
  useKeyboardShortcuts();
  
  const [projects] = useLocalStorage<any[]>('bdeck-timers', []);
  const [todos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [links] = useLocalStorage<any[]>('bdeck-links', []);

  const pendingTodosCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

  const categories = useMemo(() => {
    const baseOrder = ['SYSTEM', 'DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS'];
    const custom = links.map(l => l.category).filter(Boolean) as string[];
    const unique = Array.from(new Set(custom)).filter(c => c !== 'ALL SYSTEMS');
    
    return unique.sort((a, b) => {
      const aIdx = baseOrder.indexOf(a);
      const bIdx = baseOrder.indexOf(b);
      
      // If both are in baseOrder, sort by baseOrder
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      // If only one is in baseOrder, it comes first
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      
      // Otherwise, natural alphabetical sort
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [links]);

  const allTags = useMemo(() => {
    const tags = links.flatMap(l => l.tags || []);
    return Array.from(new Set(tags)).sort((a, b) => 
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [links]);

  return (
    <div className={`min-h-screen font-mono selection:bg-terminal-main selection:text-black antialiased overflow-x-hidden transition-colors ${isRetro ? 'bg-black text-terminal-main' : 'bg-[#0a0a0a] text-[#d4d4d4]'}`}>
      <SyncManager />
      <AuthModal />
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        
        <CustomizationMenu isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />

        {/* HEADER SECTION */}
        <div className={`overflow-hidden transition-all ${isRetro ? 'border border-terminal-main bg-black' : 'border border-white/10 bg-white/[0.01] shadow-[0_0_40px_-20px_rgba(0,0,0,1)]'}`}>
          {isRetro ? (
            <header className="flex flex-col">
              {/* Row 1: System Bar */}
              <div className="flex justify-between items-center bg-terminal-main text-black px-3 py-1 font-bold text-[10px] tracking-widest retro-invert">
                <div className="flex items-center gap-3">
                  <span>[ COMMAND_CENTER_V1.0 ]</span>
                  <span className="bg-black text-terminal-main px-1.5 py-0.5 text-[8px] animate-pulse">BETA_RELEASE</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[8px] opacity-50">[M]</span>
                  <button 
                    onClick={() => setIsConfigOpen(true)} 
                    className="hover:bg-black hover:text-terminal-main px-2 py-0.5 transition-all border border-transparent hover:border-black uppercase font-black"
                  >
                    [ MENU ]
                  </button>
                </div>
              </div>
              
              {/* Row 2: Path Bar / Search */}
              <div className="flex items-center gap-0 px-4 py-3 border-b border-terminal-main bg-black group/path">
                <span className="text-[10px] text-terminal-main font-bold whitespace-nowrap mr-3">PATH:</span>
                <div className="flex-1 flex items-center bg-terminal-main/5 border border-terminal-main/20 px-3 py-1.5 group-focus-within/path:border-terminal-main/50 transition-all">
                  <span className="text-terminal-main text-[10px] mr-2">C:\USERS\ADMIN\SEARCH\</span>
                  <input 
                    type="text" 
                    id="global-search-input"
                    placeholder="INIT_QUERY..."
                    value={linksSearchTerm}
                    onChange={(e) => setLinksSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none py-0.5 text-xs text-terminal-main placeholder:text-terminal-main/20 focus:outline-none uppercase tracking-widest font-mono"
                  />
                  <span className="text-terminal-main text-xs animate-pulse ml-1">█</span>
                </div>
                <div className="flex items-center gap-4 ml-6">
                  <HeaderIndicators />
                  <button className="border border-terminal-main px-3 py-1 text-[10px] text-terminal-main hover:bg-terminal-main hover:text-black transition-colors font-bold tracking-tighter uppercase">↑ UP</button>
                </div>
              </div>
            </header>
          ) : (
            <header className={`p-4 md:p-6 transition-all border-b border-white/10 bg-white/[0.01] space-y-6`}>
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
              <div className={`flex items-center justify-between gap-4 border-t pt-6 border-white/5`}>
                {!isSearchExpanded && (
                  <nav className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left duration-300">
                    {['ALL SYSTEMS', ...categories].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveCategory(tab)}
                        className={`px-4 py-1 text-[0.6rem] font-black border border-white/5 text-white/20 hover:border-white/20 hover:text-white bg-white/[0.01] transition-all tracking-widest ${
                          activeCategory === tab ? 'bg-terminal-main text-black border-terminal-main shadow-[0_0_10px_-2px_rgba(255,176,0,0.3)]' : ''
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
                      className={`p-2 transition-colors text-white/20 hover:text-terminal-main ${isSearchExpanded ? 'absolute left-0 z-10' : ''}`}
                    >
                      <Search size={16} />
                    </button>
                    <input 
                      type="text" 
                      id="global-search-input"
                      placeholder="SEARCH_MODULES..."
                      autoFocus={isSearchExpanded}
                      value={linksSearchTerm}
                      onChange={(e) => setLinksSearchTerm(e.target.value)}
                      className={`transition-all uppercase tracking-widest bg-black/40 border border-white/10 py-2 text-[0.65rem] placeholder:text-white/20 focus:outline-none focus:border-terminal-main/40 ${
                        isSearchExpanded ? 'w-full pl-10 pr-4 opacity-100' : 'w-0 opacity-0 pointer-events-none'
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
        </div>

        {/* TOP SECTION WITH SIDEBAR AND GRID */}
        <div className={`flex flex-col md:flex-row ${isRetro ? 'min-h-[400px] max-h-[500px] gap-6' : 'min-h-[400px] gap-6'}`}>
          {isRetro && (
            <aside className="w-full md:w-[250px] border border-terminal-main bg-black overflow-y-auto custom-scrollbar" role="complementary">
              <DirectoriesSidebar 
                categories={['ALL SYSTEMS', ...categories]} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                tags={allTags}
                activeTag={activeTag}
                setActiveTag={setActiveTag}
              />
            </aside>
          )}
          
          {/* APPS GRID */}
          <section 
            aria-label="Apps Grid"
            className={`flex-1 ${isRetro ? 'flex flex-col overflow-y-auto custom-scrollbar bg-black border border-terminal-main' : 'p-4 md:p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 border border-white/10 bg-white/[0.01]'}`}
          >
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
            <Pane 
              title={isRetro ? "Timer Daemon" : "Project Timers"} 
              badge={isRetro ? projects.length : `TOTAL: ${projects.length}`} 
              label="SYS_CHRONO"
              headerColor="terminal-main"
              shortcut="P"
              actions={isRetro && (
                <button 
                  onClick={() => setIsEditingTimers(!isEditingTimers)}
                  className={`text-[9px] px-1.5 py-0.5 border transition-all ${isEditingTimers ? 'bg-terminal-main text-black border-terminal-main' : 'border-terminal-main/40 text-terminal-main/60 hover:border-terminal-main hover:text-terminal-main'}`}
                >
                  [ {isEditingTimers ? 'FINISH' : 'MODIFY'} ]
                </button>
              )}
            >
              <TimersPane isAdding={isAddingTimer} setIsAdding={setIsAddingTimer} isEditing={isEditingTimers} />
            </Pane>
          </div>
          <div id="pane-todo" className="lg:col-span-4 h-full">
            <Pane title={isRetro ? "Task List" : "Mission Objectives"} badge={isRetro ? pendingTodosCount : `${pendingTodosCount} Pending`} label="OBJ_PRIORITY" headerColor="terminal-main" shortcut="T">
              <TodoPane />
            </Pane>
          </div>
          <div id="pane-notes" className="lg:col-span-4 h-full">
            <Pane title={isRetro ? "System Log" : "Data Log"} label="LOG_STREAM" headerColor="terminal-main" shortcut="N" actions={isRetro ? null : <WindowControls />}>
              <NotesPane />
            </Pane>
          </div>
        </div>

        {/* FOOTER / STATUS BAR */}
        <footer className={`flex flex-col sm:flex-row justify-between items-center transition-all uppercase font-bold ${
          isRetro 
            ? 'border border-terminal-main bg-black px-3 py-1 text-[9px] text-terminal-main' 
            : 'pt-8 pb-4 border-t border-white/5 text-white/10 text-[0.6rem] tracking-[0.2em]'
        }`}>
          {isRetro ? (
            <>
              <div className="flex gap-6">
                <div className="flex items-center gap-4">
                  <span>MEM: 64K [OK]</span>
                  <span>CPU: 8%</span>
                  <span>UPTIME: 14:02:11</span>
                </div>
                <HeaderIndicators />
              </div>
              <div className="flex items-center gap-4">
                <span>RETRO_OS_BUILD_2024.1</span>
                <span className="animate-pulse">█</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green shadow-terminal"></span>
                  <span>MEM: 64K OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-terminal-green shadow-terminal"></span>
                  <span>CPU: 8%</span>
                </div>
              </div>
              <div>Retro.OS Build 2024.1</div>
            </>
          )}
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

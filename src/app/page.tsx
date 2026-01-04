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
import { DirectoriesSidebar } from "@/components/dashboard/DirectoriesSidebar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

export default function Home() {
  const [linksSearchTerm, setLinksSearchTerm] = useState('');
  const [isEditingTimers, setIsEditingTimers] = useState(false);
  
  const { 
    activeCategory, setActiveCategory, 
    activeTag, setActiveTag,
    isConfigOpen, setIsConfigOpen,
    isSearchExpanded, setIsSearchExpanded,
    isAddingLink, setIsAddingLink,
    isAddingTimer, setIsAddingTimer,
    requestSync, syncStatus
  } = useDashboardStore();
  
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
      
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      
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
    <div className="min-h-screen font-mono selection:bg-terminal-main selection:text-black antialiased overflow-x-hidden bg-black text-terminal-main transition-colors duration-300">
      <SyncManager />
      <AuthModal />
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        
        <CustomizationMenu isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />

        {/* HEADER SECTION - RETRO ONLY */}
        <div className="overflow-hidden border border-terminal-main bg-black shadow-[0_0_20px_rgba(255,176,0,0.05)]">
          <header className="flex flex-col">
            {/* Row 1: System Bar */}
            <div className="flex justify-between items-center bg-terminal-main text-black px-3 py-1 font-bold text-[10px] tracking-widest retro-invert">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">●</span>
                  [ COMMAND_CENTER ]
                </span>
                <span className="hidden sm:inline opacity-80 border-l border-black/20 pl-3">MEM:64K CPU:8% UP:14H</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-[8px] opacity-80 font-black">[{process.env.NEXT_PUBLIC_GIT_BRANCH || 'DEV'}] v0.1.2</span>
                <button 
                  onClick={() => setIsConfigOpen(true)} 
                  className="px-2 py-0.5 retro-btn-filled uppercase font-black border-none"
                >
                  [ MENU ]
                </button>
              </div>
            </div>
            
            {/* Row 2: Path Bar / Search */}
            <div className="flex items-center gap-0 px-4 py-3 border-b border-terminal-main/20 bg-black group/path">
              <span className="text-[10px] text-terminal-main font-bold whitespace-nowrap mr-3 opacity-70">PATH:</span>
              <div className="flex-1 flex items-center bg-terminal-main/5 border border-terminal-main/10 px-3 py-1.5 group-focus-within/path:border-terminal-main/40 transition-all">
                <span className="text-terminal-main/40 text-[10px] mr-2">C:\USERS\ADMIN\SEARCH\</span>
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
              <div className="flex items-center gap-6 ml-6">
                <HeaderIndicators />
                <button 
                  onClick={requestSync}
                  disabled={syncStatus === 'syncing'}
                  className={`border border-terminal-main px-4 py-1.5 text-[10px] font-black tracking-tighter uppercase transition-all duration-200 active:scale-95
                    ${syncStatus === 'syncing' 
                      ? 'bg-terminal-main/20 text-terminal-main animate-pulse cursor-wait' 
                      : 'bg-transparent text-terminal-main hover:bg-terminal-main hover:text-black'
                    }`}
                >
                  {syncStatus === 'syncing' ? 'SYNCING...' : '↑ SYNC'}
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* TOP SECTION WITH SIDEBAR AND GRID */}
        <div className="flex flex-col md:flex-row min-h-[400px] max-h-[500px] gap-6">
          <aside className="w-full md:w-[250px] border border-terminal-main/30 bg-black overflow-y-auto custom-scrollbar" role="complementary">
            <DirectoriesSidebar 
              categories={['ALL SYSTEMS', ...categories]} 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
              tags={allTags}
              activeTag={activeTag}
              setActiveTag={setActiveTag}
            />
          </aside>
          
          {/* APPS GRID */}
          <section 
            aria-label="Apps Grid"
            className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-black border border-terminal-main/30"
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
              title="Timer Daemon" 
              badge={projects.length} 
              label="SYS_CHRONO"
              headerColor="terminal-main"
              shortcut="P"
              actions={(
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
            <Pane title="Task List" badge={pendingTodosCount} label="OBJ_PRIORITY" headerColor="terminal-main" shortcut="T">
              <TodoPane />
            </Pane>
          </div>
          <div id="pane-notes" className="lg:col-span-4 h-full">
            <Pane title="System Log" label="LOG_STREAM" headerColor="terminal-main" shortcut="N">
              <NotesPane />
            </Pane>
          </div>
        </div>
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
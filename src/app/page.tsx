'use client';

import { useState, useMemo } from 'react';
import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";
import { Search } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const [linksSearchTerm, setLinksSearchTerm] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isAddingTimer, setIsAddingTimer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL SYSTEMS');
  
  const [projects] = useLocalStorage<any[]>('bdeck-timers', []);
  const [todos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [links] = useLocalStorage<any[]>('bdeck-links', []);

  const pendingTodosCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

  const categories = useMemo(() => {
    const base = ['ALL SYSTEMS', 'DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
    const custom = links.map(l => l.category).filter(Boolean) as string[];
    // Filter out duplicates and ensure 'ALL SYSTEMS' is first
    const unique = Array.from(new Set([...base, ...custom]));
    return unique;
  }, [links]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d4] font-mono selection:bg-terminal-amber selection:text-black antialiased overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* COMBINED CONTAINER FOR HEADER AND LINKS */}
        <div className="border border-white/10 bg-white/[0.01] overflow-hidden shadow-[0_0_40px_-20px_rgba(0,0,0,1)]">
          
          {/* HEADER SECTION */}
          <header className="p-4 md:p-6 border-b border-white/10 bg-white/[0.01]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 text-terminal-amber">
                  <div className="grid grid-cols-3 gap-0.5">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`w-0.5 h-0.5 rounded-full ${i === 4 ? 'bg-terminal-amber animate-pulse' : 'bg-terminal-amber/30'}`}></div>
                    ))}
                  </div>
                  <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase leading-none">Command Center</h1>
                </div>
                <p className="text-[10px] text-white/30 mt-2 font-bold tracking-widest">&gt; SELECT A SUBSYSTEM TO INITIALIZE...</p>
              </div>
              <div className="relative group w-full md:w-auto">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-terminal-amber transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="SEARCH MODULES..."
                  value={linksSearchTerm}
                  onChange={(e) => setLinksSearchTerm(e.target.value)}
                  className="bg-black/40 border border-white/10 px-4 pr-10 py-2 text-[10px] focus:outline-none focus:border-terminal-amber/40 w-full md:w-64 transition-all uppercase tracking-widest placeholder:text-white/5"
                />
              </div>
            </div>
          </header>

          {/* NAVIGATION TABS (Inside Container) */}
          <div className="px-4 md:px-6 pt-4">
            <nav className="flex flex-wrap gap-2">
              {categories.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`px-4 py-1 text-[9px] font-black border transition-all tracking-widest ${activeCategory === tab ? 'bg-terminal-amber text-black border-terminal-amber shadow-[0_0_10px_-2px_rgba(255,176,0,0.3)]' : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white bg-white/[0.01]'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* APPS GRID (Inside Container) */}
          <section className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
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
          
          <div className="lg:col-span-4 h-full">
            <Pane 
              title="Project Timers" 
              badge={`TOTAL: ${projects.length}`}
              label="SYS_CHRONO"
            >
              <TimersPane isAdding={isAddingTimer} setIsAdding={setIsAddingTimer} />
            </Pane>
          </div>

          <div className="lg:col-span-4 h-full">
            <Pane 
              title="Mission Objectives" 
              badge={`${pendingTodosCount} Pending`}
              label="OBJ_PRIORITY"
            >
              <TodoPane />
            </Pane>
          </div>

          <div className="lg:col-span-4 h-full">
            <Pane 
              title="Data Log" 
              label="LOG_STREAM"
              actions={
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-terminal-red opacity-40"></div>
                  <div className="w-2 h-2 rounded-full bg-terminal-amber opacity-40"></div>
                  <div className="w-2 h-2 rounded-full bg-terminal-green opacity-40"></div>
                </div>
              }
            >
              <NotesPane />
            </Pane>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-black text-white/10 tracking-[0.2em] border-t border-white/5 uppercase">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-terminal-green rounded-full"></span>
              <span>MEM: 64K OK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse"></span>
              <span>CPU: 8%</span>
            </div>
          </div>
          <div>Retro.OS Build 2024.1</div>
        </footer>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";

export default function Home() {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linksSearchTerm, setLinksSearchTerm] = useState('');

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white text-black font-mono">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 border-8 border-black p-4 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Full Width Row: Links */}
        <div className="col-span-12">
          <Pane 
            title="01_Links" 
            label="/dev/links"
            actions={
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={linksSearchTerm}
                  onChange={(e) => setLinksSearchTerm(e.target.value)}
                  className="w-24 md:w-32 text-[10px] border-b-2 border-black focus:outline-none bg-transparent h-6"
                />
                <button 
                  onClick={() => setIsAddingLink(true)}
                  className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 md:border-4 border-black hover:bg-black hover:text-white transition-colors"
                  title="Add Link"
                  disabled={isAddingLink}
                >
                  <span className="text-sm md:text-xl font-bold leading-none">+</span>
                </button>
              </div>
            }
          >
            <LinksPane 
              isAdding={isAddingLink} 
              setIsAdding={setIsAddingLink} 
              searchTerm={linksSearchTerm}
            />
          </Pane>
        </div>

        {/* 3-Column Layout for the rest */}
        <div className="md:col-span-4">
          <Pane title="02_Timers" label="/dev/timers" className="h-full">
            <TimersPane />
          </Pane>
        </div>

        <div className="md:col-span-4">
          <Pane title="03_Todo" label="/var/tasks" className="h-full">
            <TodoPane />
          </Pane>
        </div>

        <div className="md:col-span-4">
          <Pane title="04_Notes" label="/tmp/scratchpad" className="h-full">
            <NotesPane />
          </Pane>
        </div>
      </div>
      <footer className="mt-12 text-center text-xs font-bold uppercase tracking-widest border-t-4 border-black pt-4">
        Bdeck_v0.1.0 // Brutalist Dashboard for Power Users
      </footer>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";

export default function Home() {
  const [isAddingLink, setIsAddingLink] = useState(false);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white text-black font-mono">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 border-8 border-black p-4 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Full Width Row: Links */}
        <div className="col-span-12">
          <Pane 
            title="01_Links" 
            label="/dev/links"
            actions={
              <button 
                onClick={() => setIsAddingLink(true)}
                className="w-8 h-8 flex items-center justify-center border-4 border-black hover:bg-black hover:text-white transition-colors"
                title="Add Link"
                disabled={isAddingLink}
              >
                <span className="text-xl font-bold leading-none">+</span>
              </button>
            }
          >
            <LinksPane isAdding={isAddingLink} setIsAdding={setIsAddingLink} />
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

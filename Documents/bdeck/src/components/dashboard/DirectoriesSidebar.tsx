'use client';

import { useSkin } from '@/hooks/useSkin';
import { Folder, FolderOpen } from 'lucide-react';

interface DirectoriesSidebarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const DirectoriesSidebar = ({ categories, activeCategory, setActiveCategory }: DirectoriesSidebarProps) => {
  const skin = useSkin();
  const isRetro = skin === 'retro';

  if (!isRetro) return null;

  return (
    <div className="w-full flex flex-col border border-terminal-main bg-black h-full">
      <div className="border-b border-terminal-main/50 px-3 py-1.5 flex items-center justify-center">
        <span className="text-[10px] text-terminal-main font-bold tracking-widest">[ DIRECTORIES ]</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="flex items-center gap-2 px-2 py-1 bg-terminal-main/10 border-b border-terminal-main/30 mb-2">
           <FolderOpen size={14} className="text-terminal-main" />
           <span className="text-xs text-terminal-main font-bold">[ ROOT ]</span>
        </div>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`w-full flex items-center gap-3 px-4 py-1.5 transition-all group relative ${
              activeCategory === category 
                ? 'retro-invert font-black' 
                : 'text-terminal-main/60 retro-hover-invert hover:font-bold'
            }`}
          >
            <Folder size={12} className={activeCategory === category ? 'text-black' : 'text-terminal-main/40 group-hover:text-black'} />
            <span className="text-[10px] uppercase tracking-widest truncate">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

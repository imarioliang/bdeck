'use client';

import { useSkin } from '@/hooks/useSkin';
import { Folder, FolderOpen, Tag, Hash } from 'lucide-react';

interface DirectoriesSidebarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  tags?: string[];
  activeTag?: string | null;
  setActiveTag?: (tag: string | null) => void;
}

export const DirectoriesSidebar = ({ categories, activeCategory, setActiveCategory, tags = [], activeTag = null, setActiveTag }: DirectoriesSidebarProps) => {
  const skin = useSkin();
  const isRetro = skin === 'retro';

  if (!isRetro) return null;

  return (
    <div className="w-full flex flex-col bg-black h-full">
      <div className="border-b border-terminal-main/50 px-3 py-1.5 flex items-center justify-center bg-terminal-main text-black sticky top-0 z-10 font-black retro-invert">
        <span className="text-[10px] uppercase tracking-widest">[ REPOSITORIES ]</span>
      </div>
      
      <div className="flex-1 p-1 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 px-3 py-1 bg-terminal-main/10 mb-1">
           <FolderOpen size={14} className="text-terminal-main" />
           <span className="text-[10px] text-terminal-main font-bold">[ ROOT ]</span>
        </div>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`w-full flex items-center gap-2 px-4 py-1 transition-all group relative ${
              activeCategory === category && !activeTag
                ? 'retro-invert font-black' 
                : 'text-terminal-main/60 retro-hover-invert'
            }`}
          >
            <Folder size={12} className={(activeCategory === category && !activeTag) ? 'text-black' : 'text-terminal-main/40 group-hover:text-black'} />
            <span className="text-[9px] uppercase tracking-wider truncate">{category}</span>
          </button>
        ))}

        {tags.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-3 py-1 bg-terminal-main/10 mt-4 mb-1 border-t border-terminal-main/20 pt-2">
               <Tag size={12} className="text-terminal-main" />
               <span className="text-[10px] text-terminal-main font-bold">[ TAGS ]</span>
            </div>

            <button
              onClick={() => setActiveTag?.(null)}
              className={`w-full flex items-center gap-2 px-4 py-1 transition-all group relative ${
                !activeTag 
                  ? 'retro-invert font-black' 
                  : 'text-terminal-main/60 retro-hover-invert'
              }`}
            >
              <Hash size={10} className={!activeTag ? 'text-black' : 'text-terminal-main/40 group-hover:text-black'} />
              <span className="text-[9px] uppercase tracking-wider truncate">ALL_TAGS</span>
            </button>

            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag?.(activeTag === tag ? null : tag)}
                className={`w-full flex items-center gap-2 px-4 py-1 transition-all group relative ${
                  activeTag === tag 
                    ? 'retro-invert font-black' 
                    : 'text-terminal-main/60 retro-hover-invert'
                }`}
              >
                <Hash size={10} className={activeTag === tag ? 'text-black' : 'text-terminal-main/40 group-hover:text-black'} />
                <span className="text-[9px] uppercase tracking-wider truncate">{tag}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

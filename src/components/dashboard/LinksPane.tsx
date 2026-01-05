'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Pin, Mail, Calendar, Music, HardDrive, BarChart3, Code, ShieldCheck } from 'lucide-react';
import { getFaviconUrl } from '@/utils/favicon';
import { useDashboardStore, ViewMode } from '@/store/useDashboardStore';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Link {
  id: string;
  title: string;
  url: string;
  category?: string;
  isPinned?: boolean;
  tags?: string[];
}

interface LinksPaneProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  searchTerm: string;
  activeCategory: string;
}

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('mail')) return Mail;
  if (t.includes('calendar')) return Calendar;
  if (t.includes('audio') || t.includes('music')) return Music;
  if (t.includes('drive')) return HardDrive;
  if (t.includes('stats') || t.includes('analyt')) return BarChart3;
  if (t.includes('dev') || t.includes('git') || t.includes('code')) return Code;
  return ShieldCheck;
};

const getStatusText = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('mail')) return 'INBOX: 0';
  if (t.includes('calendar')) return '4 EVENTS';
  if (t.includes('audio')) return 'PAUSED';
  if (t.includes('drive')) return 'SYNC: OK';
  if (t.includes('stats')) return 'LIVE';
  if (t.includes('dev')) return 'IDLE';
  return 'STANDBY';
};

const SortableLinkItem = ({ link, onEdit, onDelete, onTogglePin, isReorderable, viewMode }: {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  isReorderable: boolean;
  viewMode: ViewMode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id, disabled: !isReorderable });

  const Icon = useMemo(() => getIcon(link.title), [link.title]);
  const status = useMemo(() => getStatusText(link.title), [link.title]);
  const faviconUrl = useMemo(() => getFaviconUrl(link.url), [link.url]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const categoryShorthand = useMemo(() => {
    if (!link.category) return '.LNK';
    const clean = link.category.replace(/[^a-zA-Z0-9]/g, '');
    return `.${clean.substring(0, 3).toUpperCase()}`;
  }, [link.category]);

  const tagDisplay = useMemo(() => {
    if (!link.tags || link.tags.length === 0) return '---';
    const firstTwo = link.tags.slice(0, 2).join(' ');
    return link.tags.length > 2 ? `${firstTwo}...` : firstTwo;
  }, [link.tags]);

  if (viewMode === 'grid') {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="relative group aspect-square flex flex-col border border-terminal-main/20 bg-black hover:border-terminal-main/50 transition-all cursor-pointer overflow-hidden retro-hover-invert"
      >
        {/* HEADER: PIN INDICATOR */}
        {link.isPinned && (
          <div className="absolute top-1.5 left-1.5 z-30">
            <Pin size={10} className="fill-terminal-main text-terminal-main group-hover:text-black group-hover:fill-black" />
          </div>
        )}

        {/* BODY: ICON & TITLE */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-3 pb-1 min-w-0 transition-opacity duration-200 group-hover:opacity-20">
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2"
          >
            {faviconUrl ? (
              <div className="w-4 h-4 shrink-0 overflow-hidden relative flex items-center justify-center scale-150 mb-1">
                <img 
                  src={faviconUrl} 
                  alt="" 
                  className="favicon-retro"
                  onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
                />
              </div>
            ) : (
              <Icon size={24} className="text-terminal-main group-hover:text-black transition-transform" />
            )}
            
            <span className="text-[10px] font-black uppercase truncate w-full text-center tracking-tighter leading-tight">
              {link.title}
            </span>
          </a>
        </div>

        {/* CENTER OVERLAY ACTIONS */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 scale-90 group-hover:scale-100">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }} 
            className="w-10 h-10 flex items-center justify-center border border-black/40 font-black text-[10px] hover:bg-black hover:text-terminal-main transition-all hover:animate-pulse active:scale-90"
            title={link.isPinned ? 'UNPIN' : 'PIN'}
          >
            {link.isPinned ? '[P!]' : '[P]'}
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} 
            className="w-10 h-10 flex items-center justify-center border border-black/40 font-black text-[10px] hover:bg-black hover:text-terminal-main transition-all hover:animate-pulse active:scale-90"
            title="EDIT"
          >
            [E]
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} 
            className="w-10 h-10 flex items-center justify-center border border-terminal-red/40 text-terminal-red hover:bg-black hover:text-terminal-red transition-all font-black text-[10px] hover:animate-pulse active:scale-90"
            title="DELETE"
          >
            [X]
          </button>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-[8px] opacity-40 hover:opacity-100 p-2 hover:bg-black/20 transition-all">
            [::]
          </div>
        </div>

        {/* FOOTER: METADATA */}
        <div className="h-6 border-t border-terminal-main/20 flex items-center justify-between px-2 shrink-0">
          <span 
            className="text-[11px] text-terminal-main/40 uppercase group-hover:text-black/40 truncate"
            style={{ fontFamily: 'var(--font-vt323)' }}
          >
            {categoryShorthand}
          </span>
          <span 
            className="text-[11px] text-terminal-main/40 uppercase truncate max-w-[60%] group-hover:text-black/40 text-right"
            style={{ fontFamily: 'var(--font-vt323)' }}
          >
            {link.tags?.[0] || '---'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group w-full flex items-center border border-terminal-main/20 -mt-[1px] first:mt-0 retro-hover-invert retro-glitch-hover transition-colors cursor-pointer min-h-[44px]"
    >
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-1 flex items-center py-2.5 px-3 gap-0 min-w-0"
      >
         <div className="w-[45%] flex items-center gap-3 pr-2 min-w-0">
           {faviconUrl ? (
             <div className="w-4 h-4 shrink-0 overflow-hidden relative flex items-center">
               <img 
                src={faviconUrl} 
                alt="" 
                className="favicon-retro"
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.display = 'none';
                }}
               />
             </div>
           ) : null}
           {!faviconUrl && <Icon size={16} className="text-terminal-main group-hover:text-black shrink-0" />}
           <span className="text-[11px] font-mono uppercase truncate text-terminal-main group-hover:text-black font-black tracking-tighter">{link.title}</span>
         </div>

         <div className="w-[15%] text-[11px] font-mono uppercase truncate text-terminal-main/60 group-hover:text-black/60 text-right pr-4">
           {categoryShorthand}
         </div>

         <div className="w-[15%] text-[11px] font-mono uppercase truncate text-terminal-main/60 group-hover:text-black/60 text-right pr-4">
           {tagDisplay}
         </div>

         <div className="flex-1 text-[11px] font-mono uppercase truncate text-terminal-main/60 group-hover:text-black/60 text-right font-bold">
           {link.isPinned ? '[PRIORITY]' : status}
         </div>
      </a>

      {/* LIST ACTIONS (RETRO) */}
      <div className="flex items-center gap-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity h-full absolute right-0 border-l border-terminal-main/20">
         <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }} className="text-[10px] text-terminal-main hover:bg-terminal-main hover:text-black px-1 border border-terminal-main/40 group-hover:text-black group-hover:border-black/40 group-hover:hover:bg-black group-hover:hover:text-terminal-main">
           {link.isPinned ? 'UNPIN' : 'PIN'}
         </button>
         <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="text-[10px] text-terminal-main hover:bg-terminal-main hover:text-black px-1 border border-terminal-main/40 group-hover:text-black group-hover:border-black/40 group-hover:hover:bg-black group-hover:hover:text-terminal-main">EDIT</button>
         <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="text-[10px] text-terminal-red hover:bg-terminal-red hover:text-black px-1 border border-terminal-red/40 group-hover:text-black group-hover:border-black/40 group-hover:hover:bg-black group-hover:hover:text-terminal-red">DEL</button>
         <div {...attributes} {...listeners} className="text-terminal-main/30 cursor-grab active:cursor-grabbing text-[10px]">
          [::]
        </div>
      </div>
    </div>
  );
};

export const LinksPane = ({ isAdding, setIsAdding, searchTerm, activeCategory }: LinksPaneProps) => {
  const [links, setLinks] = useLocalStorage<Link[]>('bdeck-links', []);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('SYSTEM');
  const [newTags, setNewTags] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const { activeTag, viewMode, setViewMode } = useDashboardStore();

  // Extraction of categories from existing links
  const categories = useMemo(() => {
    const base = ['DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
    const custom = links.map(l => l.category).filter(Boolean) as string[];
    return Array.from(new Set([...base, ...custom]));
  }, [links]);

  // Migration logic - ensure all links have required fields
  useEffect(() => {
    const needsMigration = links.some(l => !l.id || !l.category || !l.tags);
    if (needsMigration) {
      console.log('LinksPane: Migrating data to include tags...');
      const sanitized = links.map((l, i) => ({
        ...l,
        id: l.id || `link-${i}-${Date.now()}`,
        category: l.category || 'SYSTEM',
        tags: l.tags || []
      }));
      setLinks(sanitized);
    }
  }, [links, setLinks]);

  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => {
      const aPinned = a.isPinned ?? false;
      const bPinned = b.isPinned ?? false;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [links]);

  const filteredLinks = useMemo(() => {
    return sortedLinks.filter(link => {
      const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (link.tags && link.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = activeCategory === 'ALL SYSTEMS' || link.category === activeCategory;
      const matchesTag = !activeTag || (link.tags && link.tags.includes(activeTag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [sortedLinks, searchTerm, activeCategory, activeTag]);

  const addLink = () => {
    if (newTitle.trim() && newUrl.trim()) {
      let formattedUrl = newUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = 'https://' + formattedUrl;
      
      const category = newCategory.trim().toUpperCase();
      const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);

      if (editingId) {
        setLinks(prev => prev.map(l => l.id === editingId ? { ...l, title: newTitle.trim(), url: formattedUrl, category, tags } : l));
        setEditingId(null);
      } else {
        const id = `link-${Date.now()}`;
        setLinks(prev => [{ id, title: newTitle.trim(), url: formattedUrl, category, isPinned: false, tags }, ...prev]);
      }
      setNewTitle(''); setNewUrl(''); setNewTags(''); setIsAdding(false); setIsCustomCategory(false);
    }
  };

  const startEditing = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setNewTitle(link.title); setNewUrl(link.url); setNewCategory(link.category || 'SYSTEM'); setEditingId(id); setIsAdding(true);
      setNewTags(link.tags?.join(', ') || '');
    }
  };

  const deleteLink = (id: string) => setLinks(prev => prev.filter(l => l.id !== id));
  const togglePin = (id: string) => setLinks(prev => prev.map(l => l.id === id ? { ...l, isPinned: !l.isPinned } : l));

  return (
    <>
      <div className={`w-full flex flex-col border border-terminal-main/20 ${viewMode === 'grid' ? 'bg-terminal-main/5' : ''}`}>
        <div className="flex w-full border-b border-terminal-main py-1.5 px-3 bg-terminal-main text-black sticky top-0 z-10 font-black retro-invert">
           <div className={`${viewMode === 'list' ? 'w-[45%]' : 'flex-1'} uppercase tracking-widest flex items-center gap-4`}>
             <span className="text-[9px]">FILENAME</span>
             <button 
               onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
               className="px-3 py-1 bg-black text-terminal-main border border-terminal-main/40 hover:bg-terminal-main hover:text-black transition-all text-[8px] font-black shadow-[0_0_10px_-2px_var(--terminal-main)]"
             >
               [ MODE: {viewMode.toUpperCase()} ]
             </button>
           </div>
           {viewMode === 'list' && (
             <>
               <div className="w-[15%] text-[9px] uppercase tracking-widest text-right pr-4">EXT</div>
               <div className="w-[15%] text-[9px] uppercase tracking-widest text-right pr-4">TAGS</div>
               <div className="flex-1 text-[9px] uppercase tracking-widest text-right">STATUS</div>
             </>
           )}
        </div>
        
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${viewMode === 'grid' ? 'p-4' : ''}`}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active, over } = e;
            if (over && active.id !== over.id) {
              const oldIndex = links.findIndex(l => l.id === active.id);
              const newIndex = links.findIndex(l => l.id === over.id);
              setLinks(arrayMove(links, oldIndex, newIndex));
            }
          }}>
            <SortableContext 
              items={filteredLinks.map(l => l.id)} 
              strategy={viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
            >
            <div className={viewMode === 'list' ? 'flex flex-col' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}>
                {filteredLinks.map(link => (
                  <SortableLinkItem 
                    key={link.id} 
                    link={link} 
                    onEdit={() => startEditing(link.id)} 
                    onDelete={() => deleteLink(link.id)} 
                    onTogglePin={() => togglePin(link.id)}
                    isReorderable={searchTerm === ''}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* ADD APP BUTTON - STICKY BOTTOM */}
        <button 
          onClick={() => { setEditingId(null); setNewTitle(''); setNewUrl(''); setNewCategory('SYSTEM'); setNewTags(''); setIsAdding(true); setIsCustomCategory(false); }}
          className="w-full flex items-center py-2.5 px-3 gap-4 border-t border-dashed border-terminal-main/40 text-terminal-main bg-black sticky bottom-0 z-10 transition-all group retro-hover-invert"
        >
          <span className="text-sm font-mono group-hover:scale-125 transition-transform">+</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.4em] transition-all">[ ADD_NEW_MODULE ]</span>
        </button>
      </div>

      {/* MODAL FORM */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={() => setIsAdding(false)}>
          <div 
            className="w-full max-w-lg bg-black border border-terminal-main shadow-[0_0_30px_-10px_var(--terminal-main)] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Retro Header Bar */}
            <div className="bg-terminal-main text-black px-3 py-1 flex justify-between items-center font-black text-[9px] tracking-widest retro-invert">
              <span>[ ADD_LINK ]</span>
              <div className="flex gap-4 items-center">
                <span>_</span>
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="hover:bg-black hover:text-terminal-main px-1 transition-colors font-black"
                >
                  X
                </button>
              </div>
            </div>                
            <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <div className="text-center space-y-2">
                <h3 className="text-terminal-main text-xs font-black tracking-[0.2em] uppercase">NEW_ENTRY</h3>
                <div className="border-b border-terminal-main/20 border-dashed pt-2 w-full mx-auto max-w-[80%]" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">TITLE</label>
                  </div>
                  <div className="flex items-center bg-terminal-main/5 border border-terminal-main/20 px-3 py-2 group-focus-within:border-terminal-main/50 transition-all">
                    <span className="text-terminal-main text-xs mr-2 font-black">&gt;</span>
                    <input 
                      type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLink()}
                      placeholder="TITLE..." className="flex-1 bg-transparent border-none p-0 text-xs font-black focus:outline-none uppercase tracking-widest text-terminal-main placeholder:text-terminal-main/20 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">URL</label>
                  </div>
                  <div className="flex items-center bg-terminal-main/5 border border-terminal-main/20 px-3 py-2 group-focus-within:border-terminal-main/50 transition-all">
                    <span className="text-terminal-main text-xs mr-2 font-black">&gt;</span>
                    <input 
                      type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLink()}
                      placeholder="https://..." className="flex-1 bg-transparent border-none p-0 text-xs font-black focus:outline-none uppercase tracking-widest text-terminal-main placeholder:text-terminal-main/20 font-mono lowercase"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">TAGS</label>
                  </div>
                  <div className="flex items-center bg-terminal-main/5 border border-terminal-main/20 px-3 py-2 group-focus-within:border-terminal-main/50 transition-all">
                    <span className="text-terminal-main text-xs mr-2 font-black">&gt;</span>
                    <input 
                      type="text" value={newTags} onChange={e => setNewTags(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLink()}
                      placeholder="TAGS..." className="flex-1 bg-transparent border-none p-0 text-xs font-black focus:outline-none uppercase tracking-widest text-terminal-main placeholder:text-terminal-main/20 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-terminal-main" />
                    <label className="text-[10px] font-black text-terminal-main uppercase tracking-widest">CATEGORY</label>
                  </div>
                  <div className="flex items-center bg-terminal-main/5 border border-terminal-main/20 px-3 py-2 group-focus-within:border-terminal-main/50 transition-all relative">
                    <span className="text-terminal-main text-xs mr-2 font-black">&gt;</span>
                    <select 
                      value={newCategory} 
                      onChange={e => {
                        if (e.target.value === 'CUSTOM') {
                          setNewCategory('');
                          setIsCustomCategory(true);
                        } else {
                          setNewCategory(e.target.value);
                        }
                      }}
                      className="flex-1 bg-transparent border-none p-0 text-xs font-black focus:outline-none uppercase tracking-widest text-terminal-main appearance-none cursor-pointer font-mono"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} style={{ backgroundColor: '#000', color: 'var(--terminal-main)' }}>{cat}</option>
                      ))}
                      <option value="CUSTOM" style={{ backgroundColor: '#000', color: 'var(--terminal-main)' }}>ADD NEW...</option>
                    </select>
                    <div className="absolute right-3 pointer-events-none text-terminal-main">▼</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="flex-1 py-2 border border-terminal-main/40 text-[10px] font-black text-terminal-main retro-hover-invert transition-all uppercase tracking-widest"
                >
                  [ ABORT ]
                </button>
                <button 
                  onClick={addLink} 
                  className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all retro-btn-filled"
                >
                  [ EXECUTE ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

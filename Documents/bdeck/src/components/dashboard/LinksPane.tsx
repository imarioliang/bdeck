'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Pencil, Trash2, GripHorizontal, Pin, Mail, Calendar, Music, HardDrive, BarChart3, Code, Plus, ShieldCheck } from 'lucide-react';
import { getFaviconUrl } from '@/utils/favicon';
import { useSkin } from '@/hooks/useSkin';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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

const SortableLinkItem = ({ link, onEdit, onDelete, onTogglePin, isReorderable }: {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  isReorderable: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id, disabled: !isReorderable });
  const skin = useSkin();
  const isRetro = skin === 'retro';

  const Icon = getIcon(link.title);
  const status = getStatusText(link.title);
  const faviconUrl = getFaviconUrl(link.url);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isRetro) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="relative group w-full flex items-center border border-terminal-main/20 -mt-[1px] first:mt-0 retro-hover-invert transition-colors cursor-pointer min-h-[32px]"
      >
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center py-1.5 px-3 gap-0 min-w-0"
        >
           <div className="w-[45%] flex items-center gap-2 pr-2 min-w-0">
             <Icon size={12} className="text-terminal-main group-hover:text-black shrink-0" />
             <span className="text-[10px] font-mono uppercase truncate text-terminal-main group-hover:text-black">{link.title}</span>
           </div>

           <div className="w-[15%] text-[9px] font-mono uppercase truncate text-terminal-main/60 group-hover:text-black/60 text-right pr-4">
             .EXE
           </div>

           <div className="w-[15%] text-[9px] font-mono uppercase truncate text-terminal-main/60 group-hover:text-black/60 text-right pr-4">
             4KB
           </div>

           <div className="flex-1 text-[9px] font-mono uppercase truncate text-terminal-main/60 group-hover:text-black/60 text-right">
             {link.isPinned ? '[PRIORITY]' : status}
           </div>
        </a>

        {/* LIST ACTIONS (RETRO) */}
        <div className="flex items-center gap-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity h-full absolute right-0 border-l border-terminal-main/20">
           <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }} className="text-[9px] text-terminal-main hover:bg-terminal-main hover:text-black px-1 border border-terminal-main/40 group-hover:text-black group-hover:border-black/40 group-hover:hover:bg-black group-hover:hover:text-terminal-main">
             {link.isPinned ? 'UNPIN' : 'PIN'}
           </button>
           <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="text-[9px] text-terminal-main hover:bg-terminal-main hover:text-black px-1 border border-terminal-main/40 group-hover:text-black group-hover:border-black/40 group-hover:hover:bg-black group-hover:hover:text-terminal-main">EDIT</button>
           <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="text-[9px] text-terminal-red hover:bg-terminal-red hover:text-black px-1 border border-terminal-red/40 group-hover:text-black group-hover:border-black/40 group-hover:hover:bg-black group-hover:hover:text-terminal-red">DEL</button>
           <div {...attributes} {...listeners} className="text-terminal-main/30 cursor-grab active:cursor-grabbing text-[9px]">
            [::]
          </div>
        </div>
      </div>
    );
  }

  // Modern Default
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-terminal-main/20 transition-all cursor-pointer overflow-hidden p-1.5"
    >
      {/* FAVICON WATERMARK - REFINED */}
      {faviconUrl && (
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none transition-opacity group-hover:opacity-[0.05] bg-center bg-no-repeat grayscale invert brightness-0"
          style={{ backgroundImage: `url(${faviconUrl})`, backgroundSize: '40%' }}
        />
      )}

      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full h-full flex flex-col items-center justify-center gap-1.5 relative z-10"
      >
        <div className="text-white/10 group-hover:text-terminal-main transition-colors">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-0.5 w-full px-1">
          <span className="text-[0.6rem] font-black tracking-[0.15em] text-white/90 group-hover:text-white uppercase truncate w-full text-center">
            {link.title}
          </span>
          <span className="text-[0.35rem] text-white/10 font-bold uppercase tracking-tighter truncate w-full text-center">
            {link.isPinned ? 'SYS_PRIORITY' : status}
          </span>
        </div>
      </a>

      {link.isPinned && (
        <div className="absolute top-1.5 left-1.5 text-terminal-main/40">
          <Pin size={8} fill="currentColor" />
        </div>
      )}

      {/* OVERLAY ACTIONS */}
      <div className="absolute inset-0 bg-[#0a0a0a]/95 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }} className="p-1 text-white/20 hover:text-terminal-main transition-colors" title="Pin">
          <Pin size={12} className={link.isPinned ? "fill-terminal-main text-terminal-main" : ""} />
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="p-1 text-white/20 hover:text-terminal-main transition-colors" title="Edit">
          <Pencil size={12} />
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="p-1 text-white/20 hover:text-terminal-red transition-colors" title="Delete">
          <Trash2 size={12} />
        </button>
        <div {...attributes} {...listeners} className="p-1 text-white/10 hover:text-white cursor-grab active:cursor-grabbing">
          <GripHorizontal size={12} />
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
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const skin = useSkin();
  const isRetro = skin === 'retro';

  // Extraction of categories from existing links
  const categories = useMemo(() => {
    const base = ['DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
    const custom = links.map(l => l.category).filter(Boolean) as string[];
    return Array.from(new Set([...base, ...custom]));
  }, [links]);

  // Migration logic
  useEffect(() => {
    const hasMissingIds = links.some(l => !l.id || !l.category);
    if (hasMissingIds) {
      const sanitized = links.map((l, i) => ({
        ...l,
        id: l.id || `link-${i}-${Date.now()}`,
        category: l.category || 'SYSTEM'
      }));
      setLinks(sanitized);
    }
  }, [links.length]);

  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => {
      const aPinned = a.isPinned ?? false;
      const bPinned = b.isPinned ?? false;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [links]);

  const filteredLinks = useMemo(() => {
    return sortedLinks.filter(link => {
      const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           link.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'ALL SYSTEMS' || link.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sortedLinks, searchTerm, activeCategory]);

  const addLink = () => {
    if (newTitle.trim() && newUrl.trim()) {
      let formattedUrl = newUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = 'https://' + formattedUrl;
      
      const category = newCategory.trim().toUpperCase();

      if (editingId) {
        setLinks(prev => prev.map(l => l.id === editingId ? { ...l, title: newTitle.trim(), url: formattedUrl, category } : l));
        setEditingId(null);
      } else {
        const id = `link-${Date.now()}`;
        setLinks(prev => [...prev, { id, title: newTitle.trim(), url: formattedUrl, category, isPinned: false }]);
      }
      setNewTitle(''); setNewUrl(''); setIsAdding(false); setIsCustomCategory(false);
    }
  };

  const startEditing = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setNewTitle(link.title); setNewUrl(link.url); setNewCategory(link.category || 'SYSTEM'); setEditingId(id); setIsAdding(true);
    }
  };

  const deleteLink = (id: string) => setLinks(prev => prev.filter(l => l.id !== id));
  const togglePin = (id: string) => setLinks(prev => prev.map(l => l.id === id ? { ...l, isPinned: !l.isPinned } : l));

  return (
    <>
      <div className={`w-full ${isRetro ? 'flex flex-col' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-white/5 border border-white/5'}`}>
        {isRetro && (
          <div className="flex w-full border border-terminal-main/40 py-1.5 px-3 bg-terminal-main/5 mb-0 font-bold">
             <div className="w-[45%] text-[9px] text-terminal-main uppercase tracking-widest">FILENAME</div>
             <div className="w-[15%] text-[9px] text-terminal-main uppercase tracking-widest text-right pr-4">EXT</div>
             <div className="w-[15%] text-[9px] text-terminal-main uppercase tracking-widest text-right pr-4">SIZE</div>
             <div className="flex-1 text-[9px] text-terminal-main uppercase tracking-widest text-right">STATUS</div>
          </div>
        )}
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
          const { active, over } = e;
          if (over && active.id !== over.id) {
            const oldIndex = links.findIndex(l => l.id === active.id);
            const newIndex = links.findIndex(l => l.id === over.id);
            setLinks(arrayMove(links, oldIndex, newIndex));
          }
        }}>
          <SortableContext items={filteredLinks.map(l => l.id)} strategy={isRetro ? verticalListSortingStrategy : rectSortingStrategy}>
            {filteredLinks.map(link => (
              <SortableLinkItem 
                key={link.id} 
                link={link} 
                onEdit={() => startEditing(link.id)} 
                onDelete={() => deleteLink(link.id)} 
                onTogglePin={() => togglePin(link.id)}
                isReorderable={searchTerm === ''}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* ADD APP BUTTON */}
        {isRetro ? (
          <button 
            onClick={() => { setEditingId(null); setNewTitle(''); setNewUrl(''); setNewCategory('SYSTEM'); setIsAdding(true); setIsCustomCategory(false); }}
            className="w-full flex items-center py-1.5 px-3 gap-4 border border-dashed border-terminal-main/20 text-terminal-main/40 hover:bg-terminal-main/5 hover:text-terminal-main hover:border-terminal-main/40 transition-all group mt-1"
          >
            <span className="text-xs font-mono">+</span>
            <span className="text-[9px] font-mono uppercase tracking-widest">[ADD_NEW_MODULE]</span>
          </button>
        ) : (
          <button 
            onClick={() => { setEditingId(null); setNewTitle(''); setNewUrl(''); setNewCategory('SYSTEM'); setIsAdding(true); setIsCustomCategory(false); }}
            className="aspect-square flex flex-col items-center justify-center gap-1.5 border border-dashed border-white/5 hover:border-terminal-main/30 hover:bg-white/[0.01] transition-all text-white/10 hover:text-terminal-main group p-1.5"
          >
            <Plus size={18} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform" />
            <div className="flex flex-col items-center">
              <span className="text-[0.5rem] font-black tracking-widest uppercase italic">Add App</span>
              <span className="text-[0.35rem] font-bold uppercase opacity-30">System</span>
            </div>
          </button>
        )}
      </div>

      {/* MODAL FORM */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={`bg-[#111111] border ${isRetro ? 'border-terminal-main' : 'border-terminal-main/30'} p-8 w-full max-w-sm space-y-6 shadow-[0_0_50px_-20px_rgba(255,157,0,0.2)]`}>
            <h3 className="text-terminal-main text-sm font-black tracking-[0.2em] uppercase leading-none">{editingId ? 'Modify Module' : 'Initialize Module'}</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">Identifier</label>
                <input 
                  type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLink()}
                  placeholder="MODULE_NAME..." className={`w-full bg-white/[0.02] border border-white/5 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80 ${isRetro ? 'font-mono' : ''}`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">Protocol Path</label>
                <input 
                  type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLink()}
                  placeholder="PROTOCOL_PATH..." className={`w-full bg-white/[0.02] border border-white/5 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80 ${isRetro ? 'font-mono' : ''}`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">Category</label>
                {isCustomCategory ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLink()}
                      placeholder="NEW_CAT..." className="flex-1 bg-white/[0.02] border border-white/5 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main uppercase tracking-widest text-white/80"
                      autoFocus
                    />
                    <button onClick={() => setIsCustomCategory(false)} className="text-[0.5rem] font-bold text-white/20 hover:text-white uppercase tracking-tighter">Cancel</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
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
                      onKeyDown={e => e.key === 'Enter' && addLink()}
                      className="flex-1 bg-white/[0.02] border border-white/5 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80 appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#111111]">{cat}</option>
                      ))}
                      <option value="CUSTOM" className="bg-[#111111]">ADD NEW...</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={() => { setIsAdding(false); setIsCustomCategory(false); }} className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">Abort</button>
              <button onClick={addLink} className="bg-terminal-main text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_10px_-2px_rgba(255,176,0,0.4)]">Execute</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

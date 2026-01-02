'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Pencil, Trash2, GripHorizontal, Pin, Mail, Calendar, Music, HardDrive, BarChart3, Code, Plus, ShieldCheck } from 'lucide-react';
import { getFaviconUrl } from '@/utils/favicon';
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

  const Icon = getIcon(link.title);
  const status = getStatusText(link.title);
  const faviconUrl = getFaviconUrl(link.url);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-terminal-main/20 transition-all cursor-pointer overflow-hidden p-2"
    >
      {/* FAVICON WATERMARK - REFINED */}
      {faviconUrl && (
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none transition-opacity group-hover:opacity-[0.05] bg-center bg-no-repeat grayscale invert brightness-0"
          style={{ backgroundImage: `url(${faviconUrl})`, backgroundSize: '50%' }}
        />
      )}

      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full h-full flex flex-col items-center justify-center gap-2 relative z-10"
      >
        <div className="text-white/10 group-hover:text-terminal-main transition-colors">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-0.5 w-full">
          <span className="text-[9px] font-black tracking-widest text-white/60 group-hover:text-white uppercase truncate w-full text-center px-1">
            {link.title}
          </span>
          <span className="text-[7px] text-white/10 font-bold uppercase tracking-tighter truncate w-full text-center">
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
          const oldIndex = links.findIndex(l => l.id === active.id);
          const newIndex = links.findIndex(l => l.id === over.id);
          setLinks(arrayMove(links, oldIndex, newIndex));
        }
      }}>
        <SortableContext items={filteredLinks.map(l => l.id)} strategy={rectSortingStrategy}>
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
      <button 
        onClick={() => { setEditingId(null); setNewTitle(''); setNewUrl(''); setNewCategory('SYSTEM'); setIsAdding(true); setIsCustomCategory(false); }}
        className="aspect-square flex flex-col items-center justify-center gap-2 border border-dashed border-white/5 hover:border-terminal-main/30 hover:bg-white/[0.01] transition-all text-white/10 hover:text-terminal-main group p-2"
      >
        <Plus size={24} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black tracking-widest uppercase italic">Add App</span>
          <span className="text-[7px] font-bold uppercase opacity-30">System</span>
        </div>
      </button>

      {/* MODAL FORM */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-terminal-main/30 p-8 w-full max-w-sm space-y-6 shadow-[0_0_50px_-20px_rgba(255,157,0,0.2)]">
            <h3 className="text-terminal-main text-sm font-black tracking-[0.2em] uppercase leading-none">{editingId ? 'Modify Module' : 'Initialize Module'}</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Identifier</label>
                <input 
                  type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="MODULE_NAME..." className="w-full bg-white/[0.02] border border-white/5 p-3 text-[10px] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Protocol Path</label>
                <input 
                  type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
                  placeholder="PROTOCOL_PATH..." className="w-full bg-white/[0.02] border border-white/5 p-3 text-[10px] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Category</label>
                {isCustomCategory ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      placeholder="NEW_CAT..." className="flex-1 bg-white/[0.02] border border-white/5 p-3 text-[10px] font-bold focus:outline-none focus:border-terminal-main uppercase tracking-widest text-white/80"
                      autoFocus
                    />
                    <button onClick={() => setIsCustomCategory(false)} className="text-[8px] font-bold text-white/20 hover:text-white uppercase tracking-tighter">Cancel</button>
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
                      className="flex-1 bg-white/[0.02] border border-white/5 p-3 text-[10px] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80 appearance-none cursor-pointer"
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

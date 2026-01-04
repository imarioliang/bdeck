'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { useDashboardStore } from '@/store/useDashboardStore';

// Helper to generate unique IDs
const generateId = () => `note-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const NotesPane = () => {
  const { activeNoteIndex: activeIndex, setActiveNoteIndex: setActiveIndex } = useDashboardStore();
  // Change local storage to store an array of objects {id: string, content: string}
  const [notes, setNotes] = useLocalStorage<{ id: string, content: string }[]>('bdeck-notes-multi', 
    Array.from({ length: 3 }).map((_, i) => ({ id: generateId(), content: '' }))
  );
  const skin = useSkin();
  const isRetro = skin === 'retro';

  // Migration from legacy single-note store (string to object array)
  useEffect(() => {
    const legacyNote = localStorage.getItem('bdeck-note');
    if (legacyNote) {
      try {
        const parsed = JSON.parse(legacyNote);
        if (typeof parsed === 'string' && parsed.trim() !== '') {
          // If legacy note exists, create an object for it and fill others
          const newNotes = [
            { id: generateId(), content: parsed },
            { id: generateId(), content: '' },
            { id: generateId(), content: '' }
          ];
          setNotes(newNotes);
          localStorage.removeItem('bdeck-note');
        }
      } catch (e) {
        // Silently fail if not valid JSON or string
      }
    } else {
      // Ensure notes array has IDs if initial load didn't generate them
      // This covers cases where 'bdeck-notes-multi' might exist but contain old structure
      const currentNotes = notes;
      const needsIdFix = currentNotes.some(note => typeof note === 'string' || !note.id);
      if (needsIdFix || currentNotes.length !== 3) {
        const fixedNotes = Array.from({ length: 3 }).map((_, i) => {
          const existing = currentNotes[i];
          if (existing && typeof existing === 'object' && existing.id) {
            return existing;
          }
          return { id: generateId(), content: typeof existing === 'string' ? existing : '' };
        });
        setNotes(fixedNotes);
      }
    }
  }, [setNotes]);

  // Ensure 'notes' array always has 3 elements with IDs
  useEffect(() => {
    if (notes.length !== 3 || notes.some(note => !note.id)) {
      setNotes(prevNotes => {
        const newNotes = Array.from({ length: 3 }).map((_, i) => {
          const existing = prevNotes[i];
          return { id: existing?.id || generateId(), content: existing?.content || '' };
        });
        return newNotes;
      });
    }
  }, [notes, setNotes]);

  const activeNote = notes[activeIndex] ? notes[activeIndex].content : '';

  const updateActiveNote = (content: string) => {
    const newNotes = [...notes];
    newNotes[activeIndex] = { id: newNotes[activeIndex]?.id || generateId(), content };
    setNotes(newNotes);
  };

  const lineCount = useMemo(() => {
    return typeof activeNote === 'string' ? activeNote.split('\n').length || 1 : 1;
  }, [activeNote]);

  const tabs = ['LOG_01', 'LOG_02', 'LOG_03'];

  return (
    <div className={`h-full flex flex-col relative transition-all ${isRetro ? 'bg-black border border-terminal-main' : 'bg-black/40 border border-white/5'}`}>
      {/* TAB SELECTOR */}
      <div className={`flex border-b transition-colors ${isRetro ? 'border-terminal-main/30' : 'border-white/5'}`}>
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveIndex(idx)}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              activeIndex === idx
                ? (isRetro ? 'bg-terminal-main text-black retro-invert' : 'bg-white/10 text-terminal-main border-b border-terminal-main')
                : (isRetro ? 'text-terminal-main/40 hover:text-terminal-main/70' : 'text-white/20 hover:text-white/40')
            } ${isRetro && idx !== tabs.length - 1 ? 'border-r border-terminal-main/30' : ''}`}
          >
            {isRetro ? `[ ${tab} ]` : tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-[300px]">
        {/* LINE NUMBERS */}
        <div className={`w-10 flex flex-col items-end pr-3 pt-4 text-[9px] font-bold select-none border-r font-mono transition-colors ${isRetro ? 'text-terminal-main/40 bg-black border-terminal-main/20' : 'text-white/5 bg-black/20 border-white/5'}`}>
          {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
            <div key={i} className="leading-6 h-6">{String(i + 1).padStart(2, '0')}</div>
          ))}
        </div>

        {/* EDITOR */}
        <div className="flex-1 relative group">
          <textarea 
            value={activeNote}
            onChange={(e) => updateActiveNote(e.target.value)}
            className={`w-full h-full bg-transparent focus:outline-none p-4 pt-4 text-[11px] leading-6 resize-none custom-scrollbar selection:bg-terminal-main selection:text-black font-mono tracking-wide transition-colors ${isRetro ? 'text-terminal-main placeholder:text-terminal-main/20' : 'text-white/60 font-medium placeholder:text-white/5'}`}
            placeholder={isRetro ? `> AWAITING_${tabs[activeIndex]}_INPUT...` : `> AWAITING ${tabs[activeIndex]} SYSTEM LOG INPUT...`}
            spellCheck={false}
          ></textarea>
          
          {/* SCANLINE EFFECT (Subtle) */}
          <div className={`absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] ${isRetro ? 'opacity-20' : 'opacity-10'}`}></div>
          
          {/* CURSOR EFFECT */}
          <div className={`absolute bottom-4 right-4 w-2 h-4 bg-terminal-main animate-pulse pointer-events-none shadow-[0_0_5px_rgba(255,157,0,0.5)] ${isRetro ? 'opacity-60' : 'opacity-30'}`}></div>
        </div>
      </div>
    </div>
  );
};
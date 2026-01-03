'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { useMemo } from 'react';

export const NotesPane = () => {
  const [note, setNote] = useLocalStorage<string>('bdeck-note', '');
  const skin = useSkin();
  const isRetro = skin === 'retro';

  const lineCount = useMemo(() => {
    return note.split('\n').length || 1;
  }, [note]);

  return (
    <div className={`h-full flex flex-col relative transition-all ${isRetro ? 'bg-black border border-terminal-main' : 'bg-black/40 border border-white/5'}`}>
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`w-full h-full bg-transparent focus:outline-none p-4 pt-4 text-[11px] leading-6 resize-none custom-scrollbar selection:bg-terminal-main selection:text-black font-mono tracking-wide transition-colors ${isRetro ? 'text-terminal-main placeholder:text-terminal-main/20' : 'text-white/60 font-medium placeholder:text-white/5'}`}
            placeholder={isRetro ? "> AWAITING_LOG_INPUT..." : "> AWAITING SYSTEM LOG INPUT..."}
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
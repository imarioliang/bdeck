'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Trash2, GripVertical, Play, Pause, Square, RotateCcw, Plus, Coffee } from 'lucide-react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectTimer {
  id: string;
  name: string;
  time: number;
  isActive: boolean;
  sessionStartTime: number; // The time value when the current session started
}

interface TimersPaneProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
}

const SortableTimerItem = ({ project, onToggle, onReset, onDelete, formatTime, workLimit }: {
  project: ProjectTimer;
  onToggle: () => void;
  onReset: () => void;
  onDelete: () => void;
  formatTime: (seconds: number) => string;
  workLimit: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  
  // A project is "over limit" if the current session has exceeded the work limit
  const isOverLimit = project.isActive && (project.time - project.sessionStartTime >= workLimit);

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
      className={`group flex flex-col p-2.5 border transition-all gap-2 ${isOverLimit ? 'border-terminal-red/50 bg-terminal-red/5 animate-pulse' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 overflow-hidden">
          <div {...attributes} {...listeners} className="text-white/5 group-hover:text-white/20 cursor-grab active:cursor-grabbing">
            <GripVertical size={12} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${project.isActive ? (isOverLimit ? 'bg-terminal-red animate-ping shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'bg-terminal-amber animate-pulse shadow-[0_0_5px_rgba(255,157,0,0.5)]') : 'bg-white/5'}`}></span>
            <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-wider truncate ${isOverLimit ? 'text-terminal-red' : 'text-white/70'}`}>{project.name}</span>
              <span className={`text-[11px] font-black font-mono tracking-tighter ${project.isActive ? (isOverLimit ? 'text-terminal-red' : 'text-terminal-amber') : 'text-white/20'}`}>
                {formatTime(project.time)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onToggle}
            className={`p-1.5 hover:bg-white/5 transition-colors ${project.isActive ? 'text-terminal-amber' : 'text-white'}`}
            title={project.isActive ? "Pause" : "Start"}
          >
            {project.isActive ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </button>
          <button onClick={onReset} className="p-1.5 hover:bg-white/5 transition-colors text-white/40" title="Reset">
            <Square size={12} fill="currentColor" />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-white/5 hover:text-terminal-red transition-colors text-white/40" title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TimersPane = ({ isAdding, setIsAdding }: TimersPaneProps) => {
  const [projects, setProjects] = useLocalStorage<ProjectTimer[]>('bdeck-timers', []);
  const [restMode, setRestMode] = useLocalStorage<boolean>('bdeck-rest-mode', false);
  const [restTime, setRestTime] = useLocalStorage<number>('bdeck-rest-time', 0);
  
  const [workLimitMin, setWorkLimitMin] = useLocalStorage<number>('bdeck-work-limit-min', 25);
  const [restLimitMin, setRestLimitMin] = useLocalStorage<number>('bdeck-rest-limit-min', 5);

  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const workLimitSecondsRef = useRef(workLimitMin * 60);
  useEffect(() => { workLimitSecondsRef.current = Math.max(1, workLimitMin) * 60; }, [workLimitMin]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.warn('Audio fail'); }
  };

  // Work Timer Effect
  useEffect(() => {
    projects.forEach((project) => {
      if (project.isActive) {
        if (!intervalRefs.current[project.id]) {
          intervalRefs.current[project.id] = setInterval(() => {
            setProjects((prev) => 
              prev.map((p) => {
                if (p.id === project.id) {
                  const newTime = p.time + 1;
                  const limit = workLimitSecondsRef.current;
                  const sessionElapsed = newTime - p.sessionStartTime;
                  if (sessionElapsed >= limit && (sessionElapsed - limit) % 5 === 0) {
                    playBeep();
                  }
                  return { ...p, time: newTime };
                }
                return p;
              })
            );
          }, 1000);
        }
      } else if (intervalRefs.current[project.id]) {
        clearInterval(intervalRefs.current[project.id]);
        delete intervalRefs.current[project.id];
      }
    });
    return () => {
      const activeIds = new Set(projects.map(p => p.id));
      Object.keys(intervalRefs.current).forEach(id => {
        if (!activeIds.has(id)) {
          clearInterval(intervalRefs.current[id]);
          delete intervalRefs.current[id];
        }
      });
    };
  }, [projects.map(p => `${p.id}-${p.isActive}`).join(','), workLimitMin]);

  // Rest Timer Effect
  useEffect(() => {
    if (restMode && restTime > 0) {
      if (!restIntervalRef.current) {
        restIntervalRef.current = setInterval(() => {
          setRestTime(prev => {
            if (prev <= 1) {
              playBeep();
              setRestMode(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
        restIntervalRef.current = null;
      }
    };
  }, [restMode, restTime]);

  const addProject = () => {
    if (newProjectName.trim()) {
      const id = `timer-${Date.now()}`;
      setProjects([...projects, { id, name: newProjectName.trim(), time: 0, isActive: false, sessionStartTime: 0 }]);
      setNewProjectName(''); setIsAdding(false);
    }
  };

  const toggleTimer = (id: string) => {
    // If starting work, stop rest mode
    const project = projects.find(p => p.id === id);
    if (project && !project.isActive) {
      setRestMode(false);
      setRestTime(0);
    }

    setProjects((prev) => prev.map((p) => {
      if (p.id === id) {
        const becomingActive = !p.isActive;
        return { 
          ...p, 
          isActive: becomingActive,
          sessionStartTime: becomingActive ? p.time : p.sessionStartTime 
        };
      }
      return p;
    }));
  };

  const resetTimer = (id: string) => {
    setProjects((prev) => prev.map((p) => 
      p.id === id ? { ...p, time: 0, isActive: false, sessionStartTime: 0 } : p
    ));
  };

  const restProtocol = () => {
    const anyActive = projects.some(p => p.isActive);
    const limit = Math.max(1, restLimitMin) * 60;
    if (anyActive) {
      setProjects(prev => prev.map(p => ({ ...p, isActive: false })));
      setRestTime(limit);
      setRestMode(true);
    } else {
      setRestMode(!restMode);
      if (!restMode) setRestTime(limit);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 h-full flex flex-col relative">
      
      <div className="flex flex-col gap-3 border-b border-white/5 pb-4">
        {/* REST TIMER BUTTON */}
        <button 
          onClick={restProtocol}
          className={`w-full py-2.5 border transition-all group flex items-center justify-center gap-2 ${restMode ? 'border-terminal-green bg-terminal-green/10 text-terminal-green animate-pulse' : 'border-terminal-red/20 hover:bg-terminal-red/5 text-terminal-red/60 hover:text-terminal-red'}`}
        >
          {restMode ? (
            <>
              <Coffee size={12} />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase">RESTING: {formatTime(restTime)}</span>
            </>
          ) : (
            <>
              <RotateCcw size={10} className="group-hover:-rotate-90 transition-transform duration-500" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase">REST TIMER</span>
            </>
          )}
        </button>

        {/* SUBTLE DURATIONS BELOW BUTTON */}
        <div className="flex justify-center items-center gap-10 px-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center group/input cursor-pointer">
            <span className="text-[5px] font-black text-white/10 uppercase tracking-[0.3em] group-hover/input:text-terminal-amber transition-colors">W_INTERVAL</span>
            <input 
              type="number" value={workLimitMin} onChange={e => setWorkLimitMin(Math.max(1, Number(e.target.value)))}
              className="w-10 bg-transparent border-none p-0 text-[10px] font-black focus:outline-none text-white/40 focus:text-terminal-amber transition-colors text-center appearance-none"
            />
          </div>
          <div className="flex flex-col items-center group/input cursor-pointer">
            <span className="text-[5px] font-black text-white/10 uppercase tracking-[0.3em] group-hover/input:text-terminal-amber transition-colors">R_INTERVAL</span>
            <input 
              type="number" value={restLimitMin} onChange={e => setRestLimitMin(Math.max(1, Number(e.target.value)))}
              className="w-10 bg-transparent border-none p-0 text-[10px] font-black focus:outline-none text-white/40 focus:text-terminal-amber transition-colors text-center appearance-none"
            />
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="p-3 border border-terminal-amber/30 bg-terminal-amber/5 space-y-3">
          <input 
            type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addProject()}
            placeholder="PROJECT_ID..." 
            className="w-full bg-black/60 border border-white/10 p-2.5 text-[10px] focus:outline-none focus:border-terminal-amber transition-all uppercase tracking-widest text-white/80" 
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsAdding(false)} className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white">Abort</button>
            <button onClick={addProject} className="bg-terminal-amber text-black px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_10px_-2px_rgba(255,176,0,0.4)]">Execute</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
          const { active, over } = e;
          if (over && active.id !== over.id) {
            const oldIndex = projects.findIndex((p) => p.id === active.id);
            const newIndex = projects.findIndex((p) => p.id === over.id);
            setProjects(arrayMove(projects, oldIndex, newIndex));
          }
        }}>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {projects.map((project) => (
                <SortableTimerItem 
                  key={project.id} 
                  project={project}
                  workLimit={workLimitSecondsRef.current}
                  onToggle={() => toggleTimer(project.id)}
                  onReset={() => resetTimer(project.id)}
                  onDelete={() => setProjects(prev => prev.filter(p => p.id !== project.id))}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-dashed border-white/5 hover:border-terminal-amber/20 hover:bg-white/[0.01] transition-all text-white/5 hover:text-terminal-amber group"
          >
            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            <span className="text-[9px] font-black tracking-widest uppercase italic">New Project</span>
          </button>
        )}
      </div>
    </div>
  );
};

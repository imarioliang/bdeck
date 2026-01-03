'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Trash2, GripVertical, Play, Pause, Square, RotateCcw, Plus, Coffee } from 'lucide-react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectTimer {
  id: string;
  name: string;
  time: number;
  isActive: boolean;
  sessionStartTime: number;
}

interface TimersPaneProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  isEditing?: boolean;
}

const SortableTimerItem = ({ project, onToggle, onReset, onDelete, onUpdateName, formatTime, workLimit, isGlobalEditing }: {
  project: ProjectTimer;
  onToggle: () => void;
  onReset: () => void;
  onDelete: () => void;
  onUpdateName: (name: string) => void;
  formatTime: (seconds: number) => string;
  workLimit: number;
  isGlobalEditing: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const skin = useSkin();
  const isRetro = skin === 'retro';
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id, disabled: isEditing });
  const isOverLimit = project.isActive && (project.time - project.sessionStartTime >= workLimit);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== project.name) {
      onUpdateName(editValue.trim());
    } else {
      setEditValue(project.name);
    }
    setIsEditing(false);
  };

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
        className={`group flex items-center p-2.5 border font-mono ${isOverLimit ? 'border-terminal-red text-terminal-red animate-pulse' : 'border-terminal-main/20 text-terminal-main hover:border-terminal-main'} mb-1 last:mb-0 bg-black retro-hover-invert transition-all`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div {...attributes} {...listeners} className="text-terminal-main font-bold group-hover:text-black cursor-grab active:cursor-grabbing px-1">
            &gt;
          </div>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') {
                    setEditValue(project.name);
                    setIsEditing(false);
                  }
                }}
                className="bg-terminal-main/10 border-none p-0 text-[10px] font-mono uppercase focus:outline-none focus:ring-0 text-terminal-main w-full font-black"
              />
            ) : (
              <span className="text-[10px] uppercase font-black tracking-widest whitespace-nowrap overflow-hidden text-ellipsis text-terminal-main group-hover:text-black" onDoubleClick={() => setIsEditing(true)}>{project.name}</span>
            )}
            <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${project.isActive ? 'text-terminal-main group-hover:text-black' : 'text-terminal-main/40 group-hover:text-black/40'}`}>
              {formatTime(project.time)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {isGlobalEditing ? (
            <div className="flex items-center gap-1">
              <button onClick={onReset} className="text-[9px] border px-1.5 py-1 transition-colors font-black uppercase">CLR</button>
              <button onClick={onDelete} className="text-[9px] border px-1.5 py-1 text-terminal-red border-terminal-red/50 transition-colors font-black uppercase">DEL</button>
            </div>
          ) : (
            <button onClick={onToggle} className="min-w-[100px] text-[9px] font-black border border-terminal-main/40 px-2 py-1.5 transition-all whitespace-nowrap text-center">
              {project.isActive ? '▶ PLAYING' : 'II PAUSED'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col p-2.5 border transition-all gap-2 ${isOverLimit ? 'border-terminal-red/50 bg-terminal-red/5 animate-pulse' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          {!isEditing && (
            <div {...attributes} {...listeners} className="text-white/5 group-hover:text-white/20 cursor-grab active:cursor-grabbing shrink-0">
              <GripVertical size={12} />
            </div>
          )}
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${project.isActive ? (isOverLimit ? 'bg-terminal-red animate-ping shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'bg-terminal-main animate-pulse shadow-[0_0_5px_rgba(255,176,0,0.5)]') : 'bg-white/5'}`}></span>
            <div className="flex flex-col flex-1 overflow-hidden">
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') {
                      setEditValue(project.name);
                      setIsEditing(false);
                    }
                  }}
                  className="bg-white/5 border-none p-0 text-[0.6rem] font-black uppercase tracking-wider focus:outline-none focus:ring-0 text-white w-full"
                />
              ) : (
              <span className={`text-[0.6rem] font-black uppercase tracking-wider truncate ${isOverLimit ? 'text-terminal-red' : 'text-white/90'}`}>{project.name}</span>
              )}
              <span className={`text-[0.7rem] font-black font-mono tracking-tighter ${project.isActive ? (isOverLimit ? 'text-terminal-red' : 'text-terminal-main') : 'text-white/20'}`}>
                {formatTime(project.time)}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 transition-opacity ${isEditing ? 'opacity-0 pointer-events-none' : 'opacity-20 group-hover:opacity-100'}`}>
          <button 
            onClick={onToggle}
            className={`p-1.5 hover:bg-white/5 transition-colors ${project.isActive ? 'text-terminal-main' : 'text-white'}`}
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

export const TimersPane = ({ isAdding, setIsAdding, isEditing = false }: TimersPaneProps) => {
  const [projects, setProjects] = useLocalStorage<ProjectTimer[]>('bdeck-timers', []);
  const [restMode, setRestMode] = useLocalStorage<boolean>('bdeck-rest-mode', false);
  const [restTime, setRestTime] = useLocalStorage<number>('bdeck-rest-time', 0);
  
  const [workLimitMin, setWorkLimitMin] = useLocalStorage<number>('bdeck-work-limit-min', 25);
  const [restLimitMin, setRestLimitMin] = useLocalStorage<number>('bdeck-rest-limit-min', 5);
  
  const [newProjectName, setNewProjectName] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const skin = useSkin();
  const isRetro = skin === 'retro';

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

  useEffect(() => {
    if (restMode && restTime > 0) {
      if (!restIntervalRef.current) {
        restIntervalRef.current = setInterval(() => {
          setRestTime(prev => {
            if (prev <= 1) {
              playBeep();
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

  const updateTimerName = (id: string, name: string) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, name } : p));
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
      <div className={`flex flex-col gap-3 ${isRetro ? 'border-b border-terminal-main pb-4' : 'border-b border-white/5 pb-4'}`}>
        <div className={isRetro ? "flex items-center gap-2" : "flex flex-col gap-3"}>
          <button 
            onClick={restProtocol}
            className={`flex-1 py-2.5 border transition-all group flex items-center justify-center gap-2 ${
              isRetro 
                ? (restMode ? 'bg-terminal-main text-black border-terminal-main animate-pulse' : 'border-terminal-red text-terminal-red hover:bg-terminal-red hover:text-black')
                : (restMode ? 'border-terminal-green bg-terminal-green/10 text-terminal-green animate-pulse' : 'border-terminal-red/20 hover:bg-terminal-red/5 text-terminal-red/60 hover:text-terminal-red')
            }`}
          >
            {restMode ? (
              <>
                {!isRetro && <Coffee size={12} />}
                <span className={`font-black uppercase ${isRetro ? 'text-[9px]' : 'text-[0.6rem] tracking-[0.2em]'}`}>RESTING: {formatTime(restTime)}</span>
              </>
            ) : (
              <>
                {!isRetro && <RotateCcw size={10} className="group-hover:-rotate-90 transition-transform duration-500" />}
                <span className={`font-black uppercase ${isRetro ? 'text-[9px]' : 'text-[0.6rem] tracking-[0.2em]'}`}>{isRetro ? '[ INITIATE_REST ]' : '[ RESET_ALL_PROCESSES ]'}</span>
              </>
            )}
          </button>

          {isRetro && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-2.5 border transition-all font-black text-[9px] ${showSettings ? 'bg-terminal-main text-black border-terminal-main' : 'border-terminal-main/40 text-terminal-main/60 hover:border-terminal-main hover:text-terminal-main'}`}
            >
              [ MENU ]
            </button>
          )}
        </div>

        {!isRetro && (
          <div className="flex justify-center items-center gap-10 px-4 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center group/input cursor-pointer">
              <span className="text-[0.35rem] text-white/20 font-black uppercase tracking-[0.3em] group-hover/input:text-terminal-main transition-colors">W_INTERVAL</span>
              <input 
                type="number" value={workLimitMin} onChange={e => setWorkLimitMin(Math.max(1, Number(e.target.value)))}
                className="w-10 bg-transparent border-none p-0 font-black focus:outline-none transition-colors text-center appearance-none text-white/40 focus:text-terminal-main text-[0.65rem]"
              />
            </div>
            <div className="flex flex-col items-center group/input cursor-pointer">
              <span className="text-[0.35rem] text-white/20 font-black uppercase tracking-[0.3em] group-hover/input:text-terminal-main transition-colors">R_INTERVAL</span>
              <input 
                type="number" value={restLimitMin} onChange={e => setRestLimitMin(Math.max(1, Number(e.target.value)))}
                className="w-10 bg-transparent border-none p-0 font-black focus:outline-none transition-colors text-center appearance-none text-white/40 focus:text-terminal-main text-[0.65rem]"
              />
            </div>
          </div>
        )}

        {isRetro && showSettings && (
          <div className="flex flex-col gap-6 px-4 py-6 border border-terminal-main/30 bg-terminal-main/5">
            <div className="flex flex-col gap-3 group/input">
              <span className="text-[10px] text-terminal-main/50 font-black uppercase tracking-widest">WORK_SESSION_DURATION</span>
              <div className="flex items-center gap-4">
                <input 
                  type="number" value={workLimitMin} onChange={e => setWorkLimitMin(Math.max(1, Number(e.target.value)))}
                  className="w-32 bg-terminal-main/10 border border-terminal-main/40 px-4 py-3 font-bold focus:outline-none text-left appearance-none text-terminal-main text-xl"
                />
                <span className="text-xs text-terminal-main/40 font-black tracking-widest">MINUTES</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 group/input">
              <span className="text-[10px] text-terminal-main/50 font-black uppercase tracking-widest">REST_SESSION_DURATION</span>
              <div className="flex items-center gap-4">
                <input 
                  type="number" value={restLimitMin} onChange={e => setRestLimitMin(Math.max(1, Number(e.target.value)))}
                  className="w-32 bg-terminal-main/10 border border-terminal-main/40 px-4 py-3 font-bold focus:outline-none text-left appearance-none text-terminal-main text-xl"
                />
                <span className="text-xs text-terminal-main/40 font-black tracking-widest">MINUTES</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAdding && (
        <div className={`p-3 border ${isRetro ? 'border-terminal-main bg-black' : 'border-terminal-main/30 bg-terminal-main/5'} space-y-3`}>
          <input 
            type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addProject()}
            placeholder="PROJECT_ID..." 
            className={`w-full bg-black border p-2.5 focus:outline-none transition-all uppercase tracking-widest ${isRetro ? 'border-terminal-main text-terminal-main text-xs font-mono' : 'border-white/10 text-[0.65rem] text-white/80 focus:border-terminal-main'}`} 
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsAdding(false)} className={`${isRetro ? 'text-xs text-terminal-main/50' : 'text-[0.55rem] text-white/20'} font-bold uppercase tracking-widest hover:text-white`}>Abort</button>
            <button onClick={addProject} className={`bg-terminal-main text-black px-4 py-1.5 font-black uppercase tracking-widest hover:bg-white transition-all ${isRetro ? 'text-xs' : 'text-[0.55rem] shadow-[0_0_10px_-2px_rgba(255,176,0,0.4)]'}`}>Execute</button>
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
                  onUpdateName={(name) => updateTimerName(project.id, name)}
                  formatTime={formatTime}
                  isGlobalEditing={isEditing}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-3 border border-dashed transition-all group ${
              isRetro 
                ? 'border-terminal-main text-terminal-main hover:bg-terminal-main hover:text-black font-mono' 
                : 'border-white/5 text-white/5 hover:border-terminal-main/20 hover:bg-white/[0.01] hover:text-terminal-main'
            }`}
          >
            {isRetro ? (
               <span className="text-xs font-black uppercase tracking-widest">[ INIT_NEW_TIMER ]</span>
            ) : (
              <>
                <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                <span className="text-[0.6rem] font-black tracking-widest uppercase italic">New Project</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
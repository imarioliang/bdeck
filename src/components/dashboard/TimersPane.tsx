'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RotateCcw, Coffee } from 'lucide-react';
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
          <span className={`text-lg font-black tracking-tighter whitespace-nowrap ml-auto ${project.isActive ? 'text-terminal-main group-hover:text-black' : 'text-terminal-main/40 group-hover:text-black/40'}`}>
            {formatTime(project.time)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {isGlobalEditing ? (
          <div className="flex items-center gap-1">
            <button onClick={onReset} className="text-[9px] border px-1.5 py-1 transition-colors font-black uppercase hover:retro-invert">CLR</button>
            <button onClick={onDelete} className="text-[9px] border px-1.5 py-1 text-terminal-red border-terminal-red/50 transition-colors font-black uppercase hover:bg-terminal-red hover:text-black">DEL</button>
          </div>
        ) : (
          <button 
            onClick={onToggle} 
            className={`min-w-[100px] text-[9px] font-black border border-terminal-main/40 px-2 py-1.5 transition-all whitespace-nowrap text-center ${
              project.isActive ? 'retro-invert' : 'hover:retro-invert'
            }`}
          >
            {project.isActive ? '▶ PLAYING' : 'II PAUSED'}
          </button>
        )}
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

  const currentWorkLimit = workLimitSecondsRef.current;

  return (
    <div className="space-y-4 h-full flex flex-col relative">
      <div className="flex flex-col gap-3 border-b border-terminal-main pb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={restProtocol}
            className={`flex-1 py-2.5 border transition-all group flex items-center justify-center gap-2 ${
              restMode ? 'retro-invert animate-pulse' : 'border-terminal-red text-terminal-red hover:bg-terminal-red hover:text-black'
            }`}
          >
            {restMode ? (
              <span className="font-black uppercase text-[9px]">RESTING: {formatTime(restTime)}</span>
            ) : (
              <span className="font-black uppercase text-[9px]">[ INITIATE_REST ]</span>
            )}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-2.5 border transition-all font-black text-[9px] ${showSettings ? 'retro-btn-filled' : 'border-terminal-main/40 text-terminal-main/60 hover:border-terminal-main hover:text-terminal-main'}`}
          >
            [ MENU ]
          </button>
        </div>

        {showSettings && (
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
        <div className="p-3 border border-terminal-main bg-black space-y-3">
          <input 
            type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addProject()}
            placeholder="PROJECT_ID..." 
            className="w-full bg-black border p-2.5 focus:outline-none transition-all uppercase tracking-widest border-terminal-main text-terminal-main text-xs font-mono hover:bg-terminal-main/5" 
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsAdding(false)} className="text-xs text-terminal-main/50 font-bold uppercase tracking-widest hover:text-white">Abort</button>
            <button onClick={addProject} className="bg-terminal-main text-black px-4 py-1.5 font-black uppercase tracking-widest hover:bg-white transition-all text-xs">Execute</button>
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
                  workLimit={currentWorkLimit}
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
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-dashed border-terminal-main/40 text-terminal-main bg-black transition-all group retro-hover-invert font-mono"
          >
            <span className="text-xs font-black uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">[ INIT_NEW_TIMER ]</span>
          </button>
        )}
      </div>
    </div>
  );
};
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Trash2, GripVertical, Play, Pause, Square, RotateCcw, Plus } from 'lucide-react';
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
}

interface TimersPaneProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
}

const SortableTimerItem = ({ project, onToggle, onReset, onDelete, formatTime }: {
  project: ProjectTimer;
  onToggle: () => void;
  onReset: () => void;
  onDelete: () => void;
  formatTime: (seconds: number) => string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

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
      className="group flex flex-col p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all gap-2"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 overflow-hidden">
          <div {...attributes} {...listeners} className="text-white/5 group-hover:text-white/20 cursor-grab active:cursor-grabbing">
            <GripVertical size={12} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${project.isActive ? 'bg-terminal-amber animate-pulse shadow-[0_0_5px_rgba(255,157,0,0.5)]' : 'bg-white/5'}`}></span>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-wider text-white/70 truncate">{project.name}</span>
              <span className={`text-[11px] font-black font-mono tracking-tighter ${project.isActive ? 'text-terminal-amber' : 'text-white/20'}`}>
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
  const [newProjectName, setNewProjectName] = useState('');
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    projects.forEach((project) => {
      if (project.isActive) {
        if (!intervalRefs.current[project.id]) {
          intervalRefs.current[project.id] = setInterval(() => {
            setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, time: p.time + 1 } : p));
          }, 1000);
        }
      } else {
        if (intervalRefs.current[project.id]) {
          clearInterval(intervalRefs.current[project.id]);
          delete intervalRefs.current[project.id];
        }
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
  }, [projects.map(p => `${p.id}-${p.isActive}`).join(',')]);

  const addProject = () => {
    if (newProjectName.trim()) {
      const id = `timer-${Date.now()}`;
      setProjects([...projects, { id, name: newProjectName.trim(), time: 0, isActive: false }]);
      setNewProjectName(''); setIsAdding(false);
    }
  };

  const restProtocol = () => {
    // REST TIMER function: Pause all active timers
    setProjects(prev => prev.map(p => ({ ...p, isActive: false })));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      
      <button 
        onClick={restProtocol}
        className="w-full py-2.5 border border-terminal-red/30 hover:bg-terminal-red/10 text-terminal-red text-[9px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all group"
      >
        <RotateCcw size={10} className="group-hover:-rotate-90 transition-transform duration-500" />
        REST TIMER
      </button>

      {isAdding && (
        <div className="p-3 border border-terminal-amber/30 bg-terminal-amber/5 space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-terminal-amber/60 tracking-widest">INITIALIZING_NEW_CHRONO_STREAM</span>
            <input 
              type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProject()}
              placeholder="PROJECT_ID..." 
              className="w-full bg-black/60 border border-white/10 p-2.5 text-[10px] focus:outline-none focus:border-terminal-amber transition-all uppercase tracking-widest text-white/80" 
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsAdding(false)} className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white">Abort</button>
            <button onClick={addProject} className="bg-terminal-amber text-black px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_10px_-2px_rgba(255,176,0,0.4)]">Execute</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
        {projects.length === 0 && !isAdding && (
          <div className="text-center py-8 opacity-10">
            <p className="text-[9px] tracking-[0.2em] uppercase italic">System Chrono Idle</p>
          </div>
        )}
        
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
                  onToggle={() => setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isActive: !p.isActive } : p))}
                  onReset={() => setProjects(prev => prev.map(p => p.id === project.id ? { ...p, time: 0, isActive: false } : p))}
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

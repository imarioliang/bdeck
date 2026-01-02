'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Trash2, GripVertical } from 'lucide-react';
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

interface SortableTimerItemProps {
  project: ProjectTimer;
  onToggle: () => void;
  onReset: () => void;
  onDelete: () => void;
  formatTime: (seconds: number) => string;
}

const SortableTimerItem = ({ project, onToggle, onReset, onDelete, formatTime }: SortableTimerItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group border-2 border-black p-2 space-y-2 bg-white"
    >
      <div className="flex justify-between items-center border-b-2 border-black pb-1">
        <div className="flex items-center gap-2 overflow-hidden">
          <button 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            aria-label="Reorder"
          >
            <GripVertical size={12} />
          </button>
          <span className="text-xs font-bold uppercase truncate">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold">{formatTime(project.time)}</span>
          <button 
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black hover:text-white transition-opacity"
            aria-label="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onToggle}
          className={`flex-1 p-1 border-2 border-black text-[10px] font-bold uppercase ${project.isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
        >
          {project.isActive ? 'Stop' : 'Start'}
        </button>
        <button 
          onClick={onReset}
          className="flex-1 p-1 border-2 border-black text-[10px] font-bold uppercase hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export const TimersPane = () => {
  const [projects, setProjects] = useLocalStorage<ProjectTimer[]>('bdeck-timers', []);
  const [newProjectName, setNewProjectName] = useState('');
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    projects.forEach((project) => {
      if (project.isActive && !intervalRefs.current[project.id]) {
        intervalRefs.current[project.id] = setInterval(() => {
          setProjects((prev) => 
            prev.map((p) => p.id === project.id ? { ...p, time: p.time + 1 } : p)
          );
        }, 1000);
      } else if (!project.isActive && intervalRefs.current[project.id]) {
        clearInterval(intervalRefs.current[project.id]);
        delete intervalRefs.current[project.id];
      }
    });

    return () => {
      // Clean up intervals for projects that might have been deleted
      const currentProjectIds = projects.map(p => p.id);
      Object.keys(intervalRefs.current).forEach(id => {
        if (!currentProjectIds.includes(id)) {
          clearInterval(intervalRefs.current[id]);
          delete intervalRefs.current[id];
        }
      });
    };
  }, [projects, setProjects]);

  const addProject = () => {
    if (newProjectName.trim()) {
      const id = Date.now().toString();
      setProjects([...projects, { id, name: newProjectName.trim(), time: 0, isActive: false }]);
      setNewProjectName('');
    }
  };

  const toggleTimer = (id: string) => {
    setProjects(projects.map((p) => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const resetTimer = (id: string) => {
    setProjects(projects.map((p) => 
      p.id === id ? { ...p, time: 0, isActive: false } : p
    ));
  };

  const deleteProject = (id: string) => {
    if (intervalRefs.current[id]) {
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
    }
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      setProjects(arrayMove(projects, oldIndex, newIndex));
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ensure projects have IDs (migration)
  const sanitizedProjects = projects.map((project, index) => ({
    ...project,
    id: project.id || `project-${index}-${Date.now()}`
  }));

  return (
    <div className="space-y-4 h-full flex flex-col pt-2">
      <div className="flex gap-2 mb-2">
        <input 
          type="text" 
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addProject()}
          placeholder="New project name..." 
          className="flex-1 text-sm border-b-2 border-black focus:outline-none bg-transparent" 
        />
        <button 
          onClick={addProject}
          className="text-xs font-bold uppercase underline hover:no-underline"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {sanitizedProjects.length === 0 && (
          <p className="text-xs italic text-gray-500">No projects. Add one above to track time.</p>
        )}
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sanitizedProjects.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sanitizedProjects.map((project) => (
                <SortableTimerItem 
                  key={project.id} 
                  project={project}
                  onToggle={() => toggleTimer(project.id)}
                  onReset={() => resetTimer(project.id)}
                  onDelete={() => deleteProject(project.id)}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

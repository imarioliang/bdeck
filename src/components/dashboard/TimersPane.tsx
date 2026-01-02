'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProjectTimer {
  name: string;
  time: number;
  isActive: boolean;
}

export const TimersPane = () => {
  const [projects, setProjects] = useLocalStorage<ProjectTimer[]>('bdeck-timers', []);
  const [newProjectName, setNewProjectName] = useState('');
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    projects.forEach((project, index) => {
      if (project.isActive && !intervalRefs.current[index]) {
        intervalRefs.current[index] = setInterval(() => {
          setProjects((prev) => 
            prev.map((p, i) => i === index ? { ...p, time: p.time + 1 } : p)
          );
        }, 1000);
      } else if (!project.isActive && intervalRefs.current[index]) {
        clearInterval(intervalRefs.current[index]);
        delete intervalRefs.current[index];
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [projects, setProjects]);

  const addProject = () => {
    if (newProjectName.trim()) {
      setProjects([...projects, { name: newProjectName.trim(), time: 0, isActive: false }]);
      setNewProjectName('');
    }
  };

  const toggleTimer = (index: number) => {
    setProjects(projects.map((p, i) => 
      i === index ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const resetTimer = (index: number) => {
    setProjects(projects.map((p, i) => 
      i === index ? { ...p, time: 0, isActive: false } : p
    ));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {projects.length === 0 && (
          <p className="text-xs italic text-gray-500">No projects. Add one above to track time.</p>
        )}
        {projects.map((project, i) => (
          <div key={i} className="border-2 border-black p-2 space-y-2">
            <div className="flex justify-between items-center border-b-2 border-black pb-1">
              <span className="text-xs font-bold uppercase truncate max-w-[150px]">{project.name}</span>
              <span className="text-sm font-mono font-bold">{formatTime(project.time)}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleTimer(i)}
                className={`flex-1 p-1 border-2 border-black text-[10px] font-bold uppercase ${project.isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {project.isActive ? 'Stop' : 'Start'}
              </button>
              <button 
                onClick={() => resetTimer(i)}
                className="flex-1 p-1 border-2 border-black text-[10px] font-bold uppercase hover:bg-gray-100"
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Trash2, GripVertical, CheckSquare, Square, CornerDownLeft } from 'lucide-react';
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

interface Todo {
  id: string;
  text: string;
  done: boolean;
  level: number; // 0 for task, 1 for subtask
}

const SortableTodoItem = ({ todo, onToggle, onDelete, onUpdateText, onKeyDown, isFocused }: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateText: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isFocused: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });
  const skin = useSkin();
  const isRetro = skin === 'retro';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: todo.level === 1 ? '2.5rem' : '0.5rem',
  };

  useEffect(() => { if (isFocused && inputRef.current) inputRef.current.focus(); }, [isFocused]);

  if (isRetro) {
    return (
      <li 
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 group bg-black border-b border-terminal-main/20 py-2 pr-2 font-mono text-sm retro-hover-invert transition-all"
      >
        <span {...attributes} {...listeners} className="text-terminal-main/50 cursor-grab active:cursor-grabbing shrink-0 select-none group-hover:text-black/30">
          ::
        </span>
        
        <div className="flex-1 flex items-center gap-3">
          <button 
            onClick={onToggle}
            className={`flex-shrink-0 font-bold ${todo.done ? 'text-terminal-main group-hover:text-black' : 'text-terminal-main/50 hover:text-terminal-main group-hover:text-black/50 group-hover:hover:text-black'}`}
            title={todo.done ? "Mark as undone" : "Mark as done"}
          >
            [{todo.done ? 'x' : ' '}]
          </button>
          
          <div className="flex flex-col flex-1 gap-0">
            <input
              ref={inputRef}
              type="text"
              value={todo.text}
              onChange={(e) => onUpdateText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="OBJECTIVE..."
              className={`bg-transparent focus:outline-none border-none p-0 font-mono uppercase transition-all ${todo.done ? 'line-through text-terminal-main/40 group-hover:text-black/40' : 'text-terminal-main group-hover:text-black'}}`}
            />
          </div>
        </div>
  
        <button 
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 px-1 text-terminal-red hover:bg-terminal-red hover:text-black transition-all border border-terminal-red text-xs group-hover:border-black/40 group-hover:text-black group-hover:hover:bg-black group-hover:hover:text-terminal-red"
          title="Delete"
        >
          DEL
        </button>
      </li>
    );
  }

  // Modern Default
  return (
    <li 
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2.5 group bg-white/[0.01] border-b border-white/5 py-2.5 pr-2.5"
    >
      <div {...attributes} {...listeners} className="text-white/5 group-hover:text-white/20 cursor-grab active:cursor-grabbing shrink-0">
        <GripVertical size={14} />
      </div>
      
      <div className="flex-1 flex items-center gap-3">
        <button 
          onClick={onToggle}
          className={`flex-shrink-0 transition-all ${todo.done ? 'text-terminal-main' : 'text-white/10 hover:text-white/20'}`}
          title={todo.done ? "Mark as undone" : "Mark as done"}
        >
          {todo.done ? <CheckSquare size={18} strokeWidth={2} /> : <Square size={18} strokeWidth={2} />}
        </button>
        
        <div className="flex flex-col flex-1 gap-0">
          <input
            ref={inputRef}
            type="text"
            value={todo.text}
            onChange={(e) => onUpdateText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="OBJECTIVE_INPUT..."
            className={`bg-transparent focus:outline-none border-none p-0 text-[10px] font-black uppercase tracking-wider transition-all ${todo.done ? 'line-through text-white/30' : 'text-white/90'}}`}
          />
          <span className={`text-[7px] font-black tracking-widest ${todo.done ? 'text-terminal-green/30' : 'text-white/10'}`}>
            {todo.done ? 'STATUS: NOMINAL' : 'PRIORITY: STANDBY'}
          </span>
        </div>
      </div>

      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/10 hover:text-terminal-red transition-all hover:bg-terminal-red/5 rounded-sm"
        title="Delete"
      >
        <Trash2 size={12} />
      </button>
    </li>
  );
};

export const TodoPane = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('bdeck-todos', []);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const skin = useSkin();
  const isRetro = skin === 'retro';

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.done && !b.done) return 1;
      if (!a.done && b.done) return -1;
      return 0;
    });
  }, [todos]);

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = (id: string) => {
    const index = sortedTodos.findIndex(t => t.id === id);
    const newTodos = todos.filter(t => t.id !== id);
    setTodos(newTodos);
    if (index > 0) setFocusedId(sortedTodos[index - 1].id);
    else if (newTodos.length > 0) setFocusedId(newTodos[0].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    const index = sortedTodos.findIndex(t => t.id === id);
    if (e.key === 'Enter') {
      e.preventDefault();
      const newId = `todo-${Date.now()}`;
      const newTodos = [...todos];
      const origIndex = todos.findIndex(t => t.id === id);
      newTodos.splice(origIndex + 1, 0, { id: newId, text: '', done: false, level: todos[origIndex].level });
      setTodos(newTodos); setFocusedId(newId);
    } else if (e.key === 'Backspace' && todos.find(t => t.id === id)?.text === '' && todos.length > 1) {
      e.preventDefault(); deleteTodo(id);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      updateTodo(id, { level: e.shiftKey ? 0 : 1 });
    }
  };

  useEffect(() => {
    if (todos.length === 0) setTodos([{ id: 'todo-init', text: '', done: false, level: 0 }]);
  }, [todos.length, setTodos]);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* ADD INPUT BAR */}
      <div className="relative group">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isRetro ? 'text-terminal-main font-mono text-sm' : 'text-white/10 font-black text-xs'}`}>{isRetro ? '>' : '+'}</div>
        <input 
          type="text"
          placeholder={isRetro ? "ADD_OBJECTIVE..." : "NEW MISSION OBJECTIVE..."}
          className={`w-full px-8 py-2.5 transition-all uppercase focus:outline-none ${isRetro ? 'bg-black border border-terminal-main text-terminal-main font-mono text-xs placeholder:text-terminal-main/30 pr-12' : 'bg-white/[0.02] border border-white/5 text-[9px] font-black focus:border-terminal-main/20 placeholder:text-white/5 tracking-[0.1em]'}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const id = `todo-${Date.now()}`;
              setTodos([{ id, text: e.currentTarget.value.trim(), done: false, level: 0 }, ...todos]);
              e.currentTarget.value = '';
              setFocusedId(id);
            }
          }}
        />
        {isRetro ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-main/50 font-mono text-[10px] select-none">[ENT]</div>
        ) : (
          <CornerDownLeft className="absolute right-3 top-1/2 -translate-y-1/2 text-white/5 group-focus-within:text-terminal-main/40 transition-colors" size={12} />
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
          const { active, over } = e;
          if (over && active.id !== over.id) {
            const oldIndex = todos.findIndex(t => t.id === active.id);
            const newIndex = todos.findIndex(t => t.id === over.id);
            setTodos(arrayMove(todos, oldIndex, newIndex));
          }
        }}>
          <SortableContext items={sortedTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-0.5">
              {sortedTodos.map((todo) => (
                <SortableTodoItem 
                  key={todo.id} 
                  todo={todo}
                  isFocused={focusedId === todo.id}
                  onToggle={() => updateTodo(todo.id, { done: !todo.done })}
                  onDelete={() => deleteTodo(todo.id)}
                  onUpdateText={(text) => updateTodo(todo.id, { text })}
                  onKeyDown={(e) => handleKeyDown(e, todo.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

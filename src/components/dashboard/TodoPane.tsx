'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: todo.level === 1 ? '2.5rem' : '0.5rem',
  };

  useEffect(() => { if (isFocused && inputRef.current) inputRef.current.focus(); }, [isFocused]);

  return (
    <li 
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 group bg-black border-b border-terminal-main/20 py-3 pr-2 font-mono retro-hover-invert transition-all"
    >
      <span {...attributes} {...listeners} className="text-terminal-main/50 cursor-grab active:cursor-grabbing shrink-0 select-none group-hover:text-black/30 text-base px-1">
        ::
      </span>
      
      <div className="flex-1 flex items-center gap-4">
        <button 
          onClick={onToggle}
          className={`flex-shrink-0 font-black text-base ${todo.done ? 'text-terminal-main group-hover:text-black' : 'text-terminal-main/50 hover:text-terminal-main group-hover:text-black/50 group-hover:hover:text-black'}`}
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
            className={`bg-transparent focus:outline-none border-none p-0 font-mono uppercase transition-all text-base ${todo.done ? 'line-through text-terminal-main/40 group-hover:text-black/40' : 'text-terminal-main group-hover:text-black'}}`}
          />
        </div>
      </div>

      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 px-1.5 text-terminal-red hover:bg-terminal-red hover:text-black transition-all border border-terminal-red text-xs group-hover:border-black/40 group-hover:text-black group-hover:hover:bg-black group-hover:hover:text-terminal-red"
        title="Delete"
      >
        DEL
      </button>
    </li>
  );
};

export const TodoPane = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('bdeck-todos', []);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

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
    const newTodos = todos.filter(t => t.id !== id);
    setTodos(newTodos);
    
    // Find index in sorted list to decide focus
    const index = sortedTodos.findIndex(t => t.id === id);
    if (index > 0) setFocusedId(sortedTodos[index - 1].id);
    else if (newTodos.length > 0) setFocusedId(newTodos[0].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
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

  return (
    <div className="h-full flex flex-col gap-4">
      {/* ADD INPUT BAR */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-main font-mono text-sm">&gt;</div>
        <input 
          type="text"
          placeholder="ADD_OBJECTIVE..."
          className="w-full px-8 py-2.5 transition-all uppercase focus:outline-none bg-black border border-terminal-main text-terminal-main font-mono text-xs placeholder:text-terminal-main/30 pr-12 hover:bg-terminal-main/5"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const id = `todo-${Date.now()}`;
              setTodos([{ id, text: e.currentTarget.value.trim(), done: false, level: 0 }, ...todos]);
              e.currentTarget.value = '';
              setFocusedId(id);
            }
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-main/50 font-mono text-[10px] select-none">[ENT]</div>
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

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
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

interface Todo {
  id: string;
  text: string;
  done: boolean;
  level: number; // 0 for task, 1 for subtask
}

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateText: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isFocused: boolean;
}

const SortableTodoItem = ({ todo, onToggle, onDelete, onUpdateText, onKeyDown, isFocused }: SortableTodoItemProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: todo.level === 1 ? '2rem' : '0',
  };

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <li 
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 group bg-white border-b border-gray-100 last:border-0 relative"
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors shrink-0"
        aria-label="Reorder"
      >
        <GripVertical size={14} />
      </button>
      
      <div className="flex-1 flex items-center gap-2 py-1">
        <button 
          onClick={onToggle}
          className={`w-4 h-4 border-2 border-black flex-shrink-0 transition-colors ${todo.done ? 'bg-black' : 'bg-white'}`}
          aria-label={todo.done ? "Mark as undone" : "Mark as done"}
        />
        
        <input
          ref={inputRef}
          type="text"
          value={todo.text}
          onChange={(e) => onUpdateText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="List item"
          className={`flex-1 text-sm bg-transparent focus:outline-none border-none p-0 ${todo.done ? 'line-through text-gray-400' : ''}`}
        />
      </div>

      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black hover:text-white transition-opacity shrink-0"
        aria-label="Delete"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
};

export const TodoPane = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('bdeck-todos', []);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sanitize and migration logic
  const sanitizedTodos = useMemo(() => {
    return todos.map((todo, index) => ({
      ...todo,
      id: todo.id || `todo-${index}-${Date.now()}`,
      level: todo.level ?? 0,
      text: todo.text ?? '',
      done: !!todo.done
    }));
  }, [todos]);

  const sortedTodos = useMemo(() => {
    return [...sanitizedTodos].sort((a, b) => {
      if (a.done && !b.done) return 1;
      if (!a.done && b.done) return -1;
      return 0;
    });
  }, [sanitizedTodos]);

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = (id: string) => {
    const index = sortedTodos.findIndex(t => t.id === id);
    const newTodos = sanitizedTodos.filter(t => t.id !== id);
    setTodos(newTodos);
    
    // Move focus
    if (index > 0) {
      setFocusedId(sortedTodos[index - 1].id);
    } else if (newTodos.length > 0) {
      setFocusedId(newTodos[0].id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    const index = sortedTodos.findIndex(t => t.id === id);
    const currentTodo = sortedTodos[index];

    if (e.key === 'Enter') {
      e.preventDefault();
      const newId = `todo-${Date.now()}`;
      const newTodoItem = { id: newId, text: '', done: false, level: currentTodo.level };
      const originalIndex = sanitizedTodos.findIndex(t => t.id === id);
      const newTodos = [...sanitizedTodos];
      newTodos.splice(originalIndex + 1, 0, newTodoItem);
      setTodos(newTodos);
      setFocusedId(newId);
    } else if (e.key === 'Backspace' && currentTodo.text === '' && sanitizedTodos.length > 1) {
      e.preventDefault();
      deleteTodo(id);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        updateTodo(id, { level: 0 });
      } else {
        if (index > 0) {
          updateTodo(id, { level: 1 });
        }
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      setFocusedId(sortedTodos[index - 1].id);
    } else if (e.key === 'ArrowDown' && index < sortedTodos.length - 1) {
      setFocusedId(sortedTodos[index + 1].id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sanitizedTodos.findIndex((t) => t.id === active.id);
      const newIndex = sanitizedTodos.findIndex((t) => t.id === over.id);
      setTodos(arrayMove(sanitizedTodos, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    if (todos.length === 0) {
      setTodos([{ id: 'todo-init', text: '', done: false, level: 0 }]);
    }
  }, [todos.length, setTodos]);

  return (
    <div className="h-full flex flex-col pt-2 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sortedTodos.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-0">
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
        
        <button 
          onClick={() => {
            const newId = `todo-${Date.now()}`;
            setTodos([...sanitizedTodos, { id: newId, text: '', done: false, level: 0 }]);
            setFocusedId(newId);
          }}
          className="w-full text-left px-10 py-2 text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span> List item
        </button>
      </div>
    </div>
  );
};
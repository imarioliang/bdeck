'use client';

import { useState } from 'react';
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
}

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

const SortableTodoItem = ({ todo, onToggle, onDelete }: SortableTodoItemProps) => {
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
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li 
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 group bg-white"
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors shrink-0"
        aria-label="Reorder"
      >
        <GripVertical size={14} />
      </button>
      <div 
        className="flex-1 flex items-center gap-2 cursor-pointer py-1"
        onClick={onToggle}
      >
        <span className={`w-4 h-4 border-2 border-black inline-block shrink-0 ${todo.done ? 'bg-black' : 'bg-white'}`}></span>
        <span className={`text-sm break-all ${todo.done ? 'line-through text-gray-400' : ''}`}>{todo.text}</span>
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
  const [newTodo, setNewTodo] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = () => {
    if (newTodo.trim()) {
      const id = Date.now().toString();
      setTodos([...todos, { id, text: newTodo.trim(), done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      setTodos(arrayMove(todos, oldIndex, newIndex));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Ensure todos have IDs (migration for existing data)
  const sanitizedTodos = todos.map((todo, index) => ({
    ...todo,
    id: todo.id || `todo-${index}-${Date.now()}`
  }));

  return (
    <div className="space-y-4 h-full flex flex-col pt-2">
      <div className="flex gap-2 mb-2">
        <input 
          type="text" 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add task..." 
          className="flex-1 text-sm border-b-2 border-black focus:outline-none bg-transparent" 
        />
        <button 
          onClick={addTodo}
          className="text-xs font-bold uppercase underline hover:no-underline"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {sanitizedTodos.length === 0 && (
          <p className="text-xs italic text-gray-500">No tasks. Add one above.</p>
        )}
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sanitizedTodos.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {sanitizedTodos.map((todo) => (
                <SortableTodoItem 
                  key={todo.id} 
                  todo={todo}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Todo {
  text: string;
  done: boolean;
}

export const TodoPane = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('bdeck-todos', []);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo.trim(), done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (index: number) => {
    const updatedTodos = todos.map((todo, i) => 
      i === index ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      <ul className="mt-4 space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {todos.length === 0 && (
          <p className="text-xs italic text-gray-500">No tasks. Add one below.</p>
        )}
        {todos.map((todo, i) => (
          <li 
            key={i} 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => toggleTodo(i)}
          >
            <span className={`w-4 h-4 border-2 border-black inline-block shrink-0 ${todo.done ? 'bg-black' : 'bg-white'}`}></span>
            <span className={`text-sm break-all ${todo.done ? 'line-through text-gray-400' : ''}`}>{todo.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2 border-t-2 border-black pt-4">
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
    </div>
  );
};
export const TodoPane = () => (
  <div className="space-y-2">
    <ul className="mt-4 space-y-2">
      {[
        { text: 'Implement initial layout', done: true },
        { text: 'Create placeholder components', done: false },
        { text: 'Add keyboard navigation', done: false }
      ].map((todo, i) => (
        <li key={i} className="flex items-center gap-2 group cursor-pointer">
          <span className={`w-4 h-4 border-2 border-black inline-block ${todo.done ? 'bg-black' : 'bg-white'}`}></span>
          <span className={`text-sm ${todo.done ? 'line-through text-gray-400' : ''}`}>{todo.text}</span>
        </li>
      ))}
    </ul>
    <div className="mt-4 flex gap-2">
      <input type="text" placeholder="Add task..." className="flex-1 text-sm border-b-2 border-black focus:outline-none" />
      <button className="text-xs font-bold uppercase underline">Add</button>
    </div>
  </div>
);

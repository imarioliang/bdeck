export const NotesPane = () => (
  <div className="h-full flex flex-col">
    <textarea 
      className="w-full flex-1 p-2 bg-transparent border-2 border-black focus:outline-none text-sm resize-none font-mono"
      placeholder="Type your notes here... (Auto-saves to local storage)"
    ></textarea>
  </div>
);

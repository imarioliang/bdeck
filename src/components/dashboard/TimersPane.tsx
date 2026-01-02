export const TimersPane = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-center h-16 border-2 border-black bg-black text-white">
      <p className="text-2xl font-bold font-mono tracking-widest">00:00:00</p>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 p-1 border-2 border-black text-xs font-bold uppercase hover:bg-gray-100">Start</button>
      <button className="flex-1 p-1 border-2 border-black text-xs font-bold uppercase hover:bg-gray-100">Reset</button>
    </div>
  </div>
);

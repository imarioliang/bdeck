export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-white text-black font-mono">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-2rem)] border-4 border-black p-2">
        {/* Left Column: Links and Timers */}
        <div className="col-span-4 row-span-6 flex flex-col gap-4">
          <div className="flex-1 border-4 border-black p-4">
            <h2 className="text-xl font-bold mb-4 uppercase">Links</h2>
            <div className="space-y-2">
              <p className="text-sm italic">Placeholder: Frequently visited sites...</p>
            </div>
          </div>
          <div className="h-1/3 border-4 border-black p-4">
            <h2 className="text-xl font-bold mb-4 uppercase">Timers</h2>
            <div className="space-y-2">
              <p className="text-sm italic">Placeholder: Project timers...</p>
            </div>
          </div>
        </div>

        {/* Right Column: Todo and Notes */}
        <div className="col-span-8 row-span-6 flex flex-col gap-4">
          <div className="flex-1 border-4 border-black p-4">
            <h2 className="text-xl font-bold mb-4 uppercase">Todo List</h2>
            <div className="space-y-2">
              <p className="text-sm italic">Placeholder: Your tasks...</p>
            </div>
          </div>
          <div className="h-1/2 border-4 border-black p-4">
            <h2 className="text-xl font-bold mb-4 uppercase">Notes</h2>
            <div className="space-y-2">
              <p className="text-sm italic">Placeholder: Scratchpad...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
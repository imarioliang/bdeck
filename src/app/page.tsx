export default function Home() {
  const paneClass = "border-4 border-black p-4 bg-white hover:bg-gray-50 transition-colors";
  const headerClass = "text-xl font-bold mb-4 uppercase tracking-tighter border-b-4 border-black pb-1 inline-block";

  return (
    <main className="min-h-screen p-4 bg-white text-black font-mono">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-2rem)] border-4 border-black p-4">
        {/* Left Column: Links and Timers */}
        <div className="col-span-4 row-span-6 flex flex-col gap-4">
          <div className={`${paneClass} flex-1`}>
            <h2 className={headerClass}>01_Links</h2>
            <div className="space-y-2">
              <p className="text-sm">/dev/links</p>
              <div className="mt-4 p-2 border-2 border-dashed border-black">
                <p className="text-xs italic text-gray-500">No links found. Add your first link using the Omnibar.</p>
              </div>
            </div>
          </div>
          <div className={`${paneClass} h-1/3`}>
            <h2 className={headerClass}>02_Timers</h2>
            <div className="space-y-2">
              <p className="text-sm">/dev/timers</p>
              <div className="mt-4 flex items-center justify-center h-12 border-2 border-black bg-black text-white">
                <p className="text-sm font-bold">00:00:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Todo and Notes */}
        <div className="col-span-8 row-span-6 flex flex-col gap-4">
          <div className={`${paneClass} flex-1`}>
            <h2 className={headerClass}>03_Todo</h2>
            <div className="space-y-2">
              <p className="text-sm">/var/tasks</p>
              <ul className="mt-4 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black inline-block"></span>
                  <span className="text-sm">Implement initial layout</span>
                </li>
              </ul>
            </div>
          </div>
          <div className={`${paneClass} h-1/2`}>
            <h2 className={headerClass}>04_Notes</h2>
            <div className="space-y-2">
              <p className="text-sm">/tmp/scratchpad</p>
              <textarea 
                className="w-full h-24 mt-2 p-2 bg-transparent border-2 border-black focus:outline-none text-sm resize-none"
                placeholder="Type your notes here..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

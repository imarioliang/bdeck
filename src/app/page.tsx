import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-white text-black font-mono">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-2rem)] border-4 border-black p-4">
        {/* Left Column: Links and Timers */}
        <div className="col-span-4 row-span-6 flex flex-col gap-4">
          <Pane title="01_Links" label="/dev/links" className="flex-1">
            <LinksPane />
          </Pane>
          <Pane title="02_Timers" label="/dev/timers" className="h-1/3">
            <TimersPane />
          </Pane>
        </div>

        {/* Right Column: Todo and Notes */}
        <div className="col-span-8 row-span-6 flex flex-col gap-4">
          <Pane title="03_Todo" label="/var/tasks" className="flex-1">
            <TodoPane />
          </Pane>
          <Pane title="04_Notes" label="/tmp/scratchpad" className="h-1/2">
            <NotesPane />
          </Pane>
        </div>
      </div>
    </main>
  );
}
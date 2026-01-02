import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";

export default function Home() {
  return (
    <main className="min-h-screen p-2 md:p-4 bg-white text-black font-mono">
      <div className="flex flex-col md:grid md:grid-cols-12 md:grid-rows-6 gap-2 md:gap-4 md:h-[calc(100vh-2rem)] border-4 border-black p-2 md:p-4">
        {/* Left Column: Links and Timers */}
        <div className="flex flex-col gap-2 md:gap-4 md:col-span-4 md:row-span-6">
          <Pane title="01_Links" label="/dev/links" className="flex-1 min-h-[300px] md:min-h-0">
            <LinksPane />
          </Pane>
          <Pane title="02_Timers" label="/dev/timers" className="md:h-1/3 min-h-[200px] md:min-h-0">
            <TimersPane />
          </Pane>
        </div>

        {/* Right Column: Todo and Notes */}
        <div className="flex flex-col gap-2 md:gap-4 md:col-span-8 md:row-span-6">
          <Pane title="03_Todo" label="/var/tasks" className="flex-1 min-h-[300px] md:min-h-0">
            <TodoPane />
          </Pane>
          <Pane title="04_Notes" label="/tmp/scratchpad" className="md:h-1/2 min-h-[250px] md:min-h-0">
            <NotesPane />
          </Pane>
        </div>
      </div>
    </main>
  );
}

import { Pane } from "@/components/dashboard/Pane";
import { LinksPane } from "@/components/dashboard/LinksPane";
import { TimersPane } from "@/components/dashboard/TimersPane";
import { TodoPane } from "@/components/dashboard/TodoPane";
import { NotesPane } from "@/components/dashboard/NotesPane";

export default function Home() {
  return (
    <main className="min-h-screen p-2 md:p-4 bg-white text-black font-mono">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 border-4 border-black p-2 md:p-4">
        {/* Full Width Row: Links */}
        <div className="col-span-12">
          <Pane title="01_Links" label="/dev/links">
            <LinksPane />
          </Pane>
        </div>

        {/* Left Column: Timers */}
        <div className="md:col-span-4">
          <Pane title="02_Timers" label="/dev/timers">
            <TimersPane />
          </Pane>
        </div>

        {/* Right Column: Todo and Notes */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <Pane title="03_Todo" label="/var/tasks">
            <TodoPane />
          </Pane>
          <Pane title="04_Notes" label="/tmp/scratchpad">
            <NotesPane />
          </Pane>
        </div>
      </div>
    </main>
  );
}
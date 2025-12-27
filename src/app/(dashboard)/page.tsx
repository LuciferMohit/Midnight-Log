import { DashboardShell } from "@/components/dashboard-shell";
import { TimeGrid } from "@/features/scheduler/components/time-grid";
import { SeedButton } from "@/features/scheduler/components/seed-button";
import { ScheduleButton } from "@/features/scheduler/components/schedule-button";
// Import the new fetchers (Make sure these exist in actions.ts!)
import { getSchedule, getHabits, getProjects } from "@/features/scheduler/actions"; 

export default async function HomePage() {
  // 1. Fetch ALL data from the database in parallel
  const [scheduleData, habits, projects] = await Promise.all([
    getSchedule(),
    getHabits(),
    getProjects()
  ]);

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Midnight Station</h1>
          <p className="text-zinc-400">Welcome back, Lucifer. Systems operational.</p>
        </div>
        <div className="flex items-center gap-2">
            <SeedButton />
            <ScheduleButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[80vh]">
        
        {/* SLOT 1: Scheduler Grid */}
        <div className="col-span-1 md:col-span-8 h-full">
            <DashboardShell title="Resource Orchestrator" className="h-full">
                <TimeGrid initialData={scheduleData} />
            </DashboardShell>
        </div>

        {/* SLOT 2: REAL HABITS (Connected to DB) */}
        <div className="col-span-1 md:col-span-4 h-full">
            <DashboardShell title="Active Habits" className="h-full">
                <div className="space-y-2">
                    {/* If empty, show message */}
                    {habits.length === 0 && <p className="text-zinc-500 text-sm">No active habits.</p>}
                    
                    {/* Map over real habits */}
                    {habits.map(habit => (
                      <div key={habit.id} className="p-3 bg-zinc-800/50 rounded flex justify-between items-center border border-zinc-800/50">
                          <span className="text-sm font-medium text-zinc-200">{habit.title}</span>
                          <span className="text-zinc-500 text-[10px] uppercase border border-zinc-700 px-1 rounded">
                            {habit.frequency}
                          </span>
                      </div>
                    ))}
                </div>
            </DashboardShell>
        </div>

        {/* SLOT 3: REAL PROJECTS (Connected to DB) */}
        <div className="col-span-1 md:col-span-4 h-64">
            <DashboardShell title="Active Projects">
                 {projects.length === 0 && <div className="text-zinc-500 text-sm">No active sprints.</div>}
                 {projects.map(project => (
                    <div key={project.id} className="mb-2 p-2 bg-zinc-800/30 rounded border-l-2 border-indigo-500 text-sm">
                      {project.title}
                    </div>
                 ))}
            </DashboardShell>
        </div>

         {/* SLOT 4: Media (Still Placeholder for now) */}
        <div className="col-span-1 md:col-span-8 h-64">
            <DashboardShell title="Media Backlog">
                <div className="grid grid-cols-3 gap-4">
                     <div className="h-20 bg-zinc-800 rounded opacity-50 flex items-center justify-center text-xs text-zinc-600">
                        Media Module Loading...
                     </div>
                </div>
            </DashboardShell>
        </div>

      </div>
    </div>
  );
}

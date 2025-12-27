import { DashboardShell } from "@/components/dashboard-shell";
import { TimeGrid } from "@/features/scheduler/components/time-grid";
import { getSchedule } from "@/features/scheduler/actions";
import { HabitList } from "@/components/dashboard/habit-list";
import { MediaList } from "@/components/dashboard/media-list";
import { ProjectList } from "@/components/dashboard/project-list";
// import { SeedButton } from "@/features/scheduler/components/seed-button";
// import { AutoScheduleButton } from "@/features/scheduler/components/auto-schedule-button";

export default async function HomePage() {
  // Fetch real data from DB
  const scheduleData = await getSchedule();

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Midnight Station
          </h1>
          <p className="text-zinc-400">
            Welcome back, Lucifer. Systems operational.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-zinc-500" suppressHydrationWarning>
            {new Date().toLocaleDateString()}
          </div>
          {/* <SeedButton /> */}
          {/* <AutoScheduleButton /> */}
        </div>
      </div>

      {/* The Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[80vh]">
        {/* SLOT 1: The Scheduler (Your Core Feature) */}
        <div className="col-span-1 md:col-span-8 h-full">
          <DashboardShell title="Resource Orchestrator" className="h-full">
            <TimeGrid initialData={scheduleData} />
          </DashboardShell>
        </div>

        {/* SLOT 2: Habits (Member A) */}
        <div className="col-span-1 md:col-span-4 h-full">
          <DashboardShell title="Active Habits" className="h-full">
            <HabitList />
          </DashboardShell>
        </div>

        {/* SLOT 3: Media Backlog */}
        <div className="col-span-1 md:col-span-6 h-64">
          <DashboardShell title="Media Backlog">
            <MediaList />
          </DashboardShell>
        </div>

        {/* SLOT 4: Projects (Member C) */}
        <div className="col-span-1 md:col-span-6 h-64">
          <DashboardShell title="Active Projects">
            <ProjectList />
          </DashboardShell>
        </div>
      </div>
    </div>
  );
}

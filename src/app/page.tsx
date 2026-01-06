import { DashboardShell } from "@/components/dashboard-shell";
import { TimeGrid } from "@/features/scheduler/components/time-grid";
import { ResourceSummary } from "@/features/scheduler/components/resource-summary";
import { getSchedule } from "@/features/scheduler/actions";
import { HabitList } from "@/components/dashboard/habit-list";
import { MediaList } from "@/components/dashboard/media-list";
import { ProjectList } from "@/components/dashboard/project-list";
import { AutoScheduleButton } from "@/features/scheduler/components/auto-schedule-button";
import { ClearButton } from "@/features/scheduler/components/clear-button";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth"; // <--- Updated Import
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId, isDev } = await getCurrentUser(); // <--- Use Abstraction

  // Decide what name to show
  let displayName = "Traveler";
  if (isDev) {
    displayName = "System Admin";
  } else {
    const clerkUser = await currentUser();
    if (clerkUser?.firstName) displayName = clerkUser.firstName;
  }

  // Redirect or handle unauthenticated state (though middleware should catch this)
  if (!userId) return null;

  // 1. Fetch Schedule (Existing)
  const scheduleData = await getSchedule();

  // 2. Fetch Active Habits for the "Command Menu"
  const habits = await prisma.habit.findMany({
    where: { userId: userId },
    select: { id: true, title: true },
  });

  // 3. Fetch Active Projects for the "Command Menu"
  const projects = await prisma.project.findMany({
    where: { userId: userId, status: "ACTIVE" },
    select: { id: true, title: true },
  });

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Midnight Station
          </h1>
          <p className="text-zinc-400">
            Welcome back, {displayName}. Systems operational.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-zinc-500" suppressHydrationWarning>
            {new Date().toLocaleDateString()}
          </div>
          <ClearButton />
          <AutoScheduleButton />
        </div>
      </div>

      {/* The Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[80vh]">
        {/* SLOT 1: The Scheduler (Your Core Feature) */}
        <div className="col-span-1 md:col-span-8 h-full">
          <DashboardShell title="Resource Orchestrator" className="h-full">
            <div className="space-y-4">
              {/* Resource Summary Stats */}
              <ResourceSummary schedule={scheduleData} />

              {/* The Interactive Grid */}
              <TimeGrid
                initialSchedule={scheduleData}
                habits={habits}
                projects={projects}
              />
            </div>
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

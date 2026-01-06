import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/dashboard/project-form";
import { ProjectItem } from "@/components/dashboard/project-item";
import { Target, CheckSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/auth"; // <--- Updated Import

export default async function ProjectsPage() {
  const { userId } = await getCurrentUser();
  if (!userId) return <div>Please sign in</div>;

  const allProjects = await prisma.project.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  const active = allProjects.filter((p) => p.status === "ACTIVE");
  const completed = allProjects.filter((p) => p.status === "COMPLETED");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Projects</h1>
        <p className="text-zinc-500">High-level goals and sprints.</p>
      </div>

      {/* New Project Input */}
      <div className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
        <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          Initialize New Project
        </h3>
        <ProjectForm />
      </div>

      {/* Active Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Active Sprints
          <span className="text-zinc-600 text-sm font-normal ml-2">
            ({active.length})
          </span>
        </h2>

        {active.length === 0 ? (
          <div className="h-32 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-600">
            No active projects.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Projects List */}
      {completed.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-500 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Completed History
            <span className="text-zinc-700 text-sm font-normal ml-2">
              ({completed.length})
            </span>
          </h2>

          <div className="space-y-2">
            {completed.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

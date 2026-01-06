import { prisma } from "@/lib/db"
import { ProjectItem } from "./project-item"
import { ProjectForm } from "./project-form"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCurrentUser } from "@/lib/auth" // <--- Updated Import

export async function ProjectList() {
  const { userId } = await getCurrentUser()
  if (!userId) return null

  const projects = await prisma.project.findMany({
    where: {
      userId: userId,
      status: { not: "COMPLETED" }
    },
  })

  return (
    <div className="w-full h-full flex flex-col">
      <ProjectForm />

      <div className="flex items-center justify-between mt-4 mb-2">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Current Sprints
        </h3>
        <Link
          href="/projects"
          className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
        >
          All Projects <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 space-y-3">
        {projects.length === 0 ? (
          <div className="h-24 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-600">
            <p className="text-sm">No active sprints.</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}

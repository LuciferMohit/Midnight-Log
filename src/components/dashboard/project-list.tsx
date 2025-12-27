import { prisma } from "@/lib/db"
import { ProjectItem } from "./project-item"
import { ProjectForm } from "./project-form"

export async function ProjectList() {
  const USER_ID = "lucifer-demo-id"
  
  // Fetch only active/on_hold projects
  const projects = await prisma.project.findMany({
    where: { 
      userId: USER_ID,
      status: {
        not: "COMPLETED" 
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="w-full h-full flex flex-col">
      <ProjectForm />

      <div className="flex-1 space-y-3 mt-2 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-600">
            <p className="text-sm">No active projects.</p>
            <p className="text-xs">Time to build something new.</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  )
}

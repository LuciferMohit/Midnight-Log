"use client";

import { updateProjectStatus, deleteProject } from "@/app/actions/projects";
import { CheckCircle2, Trash2 } from "lucide-react";

interface ProjectItemProps {
  project: {
    id: string;
    title: string;
    status: string; // ACTIVE, COMPLETED, ON_HOLD
  };
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 group hover:border-zinc-700 transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${
            project.status === "ACTIVE"
              ? "bg-emerald-500 animate-pulse"
              : "bg-yellow-500"
          }`}
        />
        <span className="text-zinc-200 font-medium">{project.title}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Complete Button */}
        {project.status !== "COMPLETED" && (
          <form
            action={async () => {
              await updateProjectStatus(project.id, "COMPLETED");
            }}
          >
            <button
              type="submit"
              className="p-2 text-zinc-500 hover:text-green-400 transition-colors"
              title="Mark Complete"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Delete Button */}
        <form
          action={async () => {
            await deleteProject(project.id);
          }}
        >
          <button
            type="submit"
            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

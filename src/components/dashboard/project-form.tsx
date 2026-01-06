"use client";

import { useRef } from "react";
import { createProject } from "@/app/actions/projects";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";

export function ProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createProject(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2 mb-4"
    >
      <Input
        name="title"
        placeholder="New project (e.g., Portfolio Website)..."
        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200"
        required
      />

      <button
        type="submit"
        className="shrink-0 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
      >
        <FolderPlus className="h-4 w-4" />
        <span className="sr-only">Create Project</span>
      </button>
    </form>
  );
}

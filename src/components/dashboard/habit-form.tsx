'use client'

import { useRef } from "react"
import { createHabit } from "@/app/actions/habits"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function HabitForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData)
        formRef.current?.reset() // Clears the input on success
      }}
      className="flex gap-2 mb-4"
    >
      <Input
        name="title"
        placeholder="Add a new habit..."
        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200"
        required
      />
      {/* Hidden default for simplicity, can be exposed later */}
      <input type="hidden" name="frequency" value="DAILY" />
      
      <button 
        type="submit" 
        className="shrink-0 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add</span>
      </button>
    </form>
  )
}

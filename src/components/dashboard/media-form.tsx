'use client'

import { useRef } from "react"
import { createMediaItem } from "@/app/actions/media"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function MediaForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createMediaItem(formData)
        formRef.current?.reset()
      }}
      className="flex gap-2 mb-4"
    >
      <div className="flex-1 flex gap-2">
        <Input
          name="title"
          placeholder="New game, movie, or book..."
          className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200"
          required
        />
        <select 
          name="type" 
          className="bg-zinc-900/50 border border-zinc-800 rounded-md text-zinc-400 text-xs px-2 focus:outline-none focus:border-zinc-700"
        >
          <option value="GAME">Game</option>
          <option value="MOVIE">Movie</option>
          <option value="SHOW">Show</option>
          <option value="BOOK">Book</option>
        </select>
      </div>
      
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

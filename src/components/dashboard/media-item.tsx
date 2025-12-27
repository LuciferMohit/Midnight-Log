'use client'

import { updateMediaStatus, deleteMediaItem } from "@/app/actions/media"
import { Play, Check, X, Trash2 } from "lucide-react"

// Define interface matching your Schema/Action types
interface MediaItemProps {
  item: {
    id: string
    title: string
    type: string
    status: "BACKLOG" | "IN_PROGRESS" | "COMPLETED" | "DROPPED"
  }
}

export function MediaItem({ item }: MediaItemProps) {
  
  // Helper to render type badge colors
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'GAME': return 'text-purple-400 border-purple-400/20 bg-purple-400/10'
      case 'MOVIE': return 'text-blue-400 border-blue-400/20 bg-blue-400/10'
      case 'SHOW': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10'
      case 'BOOK': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
      default: return 'text-zinc-400'
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 group hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-3">
        {/* Type Badge */}
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTypeColor(item.type)}`}>
          {item.type}
        </span>
        
        <span className="text-zinc-200 text-sm font-medium">{item.title}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* CONTROLS: Based on Status */}
        
        {/* If BACKLOG -> Show "Start" */}
        {item.status === 'BACKLOG' && (
          <form action={async () => {
            await updateMediaStatus(item.id, 'IN_PROGRESS')
          }}>
            <button 
              type="submit"
              className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors" 
              title="Start"
            >
              <Play className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* If IN_PROGRESS -> Show "Complete" or "Drop" */}
        {item.status === 'IN_PROGRESS' && (
          <>
            <form action={async () => {
              await updateMediaStatus(item.id, 'COMPLETED')
            }}>
              <button 
                type="submit"
                className="p-2 text-zinc-500 hover:text-green-400 hover:bg-green-400/10 rounded transition-colors" 
                title="Complete"
              >
                <Check className="h-4 w-4" />
              </button>
            </form>
            <form action={async () => {
              await updateMediaStatus(item.id, 'DROPPED')
            }}>
              <button 
                type="submit"
                className="p-2 text-zinc-500 hover:text-orange-400 hover:bg-orange-400/10 rounded transition-colors" 
                title="Drop"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </>
        )}

        {/* Delete (Always visible on hover) */}
        <form action={async () => {
          await deleteMediaItem(item.id)
        }}>
          <button 
            type="submit"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-600 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

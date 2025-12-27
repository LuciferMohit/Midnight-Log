import { prisma } from "@/lib/db"
import { MediaItem } from "./media-item"
import { MediaForm } from "./media-form"

export async function MediaList() {
  const USER_ID = "lucifer-demo-id"
  
  // Fetch all non-archived items (Skip COMPLETED/DROPPED for the dashboard view to keep it clean)
  const items = await prisma.mediaItem.findMany({
    where: { 
      userId: USER_ID,
      status: {
        in: ["BACKLOG", "IN_PROGRESS"] 
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Separate logic for UI organization
  const inProgress = items.filter(i => i.status === "IN_PROGRESS")
  const backlog = items.filter(i => i.status === "BACKLOG")

  return (
    <div className="w-full space-y-6">
      <MediaForm />

      {/* SECTION 1: NOW PLAYING / WATCHING */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          In Progress
        </h3>
        
        {inProgress.length === 0 ? (
          <div className="text-sm text-zinc-600 italic pl-2">
            Nothing active. Start something from your backlog!
          </div>
        ) : (
          <div className="space-y-2">
            {inProgress.map(item => (
              <MediaItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: BACKLOG */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Backlog ({backlog.length})
        </h3>
        
        {backlog.length === 0 ? (
          <p className="text-sm text-zinc-600 italic pl-2">Backlog empty.</p>
        ) : (
          <div className="space-y-2">
            {backlog.map(item => (
              <MediaItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

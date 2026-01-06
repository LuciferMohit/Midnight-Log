import { prisma } from "@/lib/db"
import { MediaItem } from "./media-item"
import { MediaForm } from "./media-form"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCurrentUser } from "@/lib/auth" // <--- Updated Import

export async function MediaList() {
  const { userId } = await getCurrentUser()

  if (!userId) return null

  const items = await prisma.mediaItem.findMany({
    where: {
      userId: userId,
      status: "IN_PROGRESS",
    },
  });

  return (
    <div className="w-full space-y-4">
      <MediaForm />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Now Playing
          </h3>

          <Link
            href="/media"
            className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            Full Library <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-sm text-zinc-600 italic pl-2 border-l-2 border-zinc-800 py-2">
            Nothing active.
            <Link
              href="/media"
              className="text-zinc-400 hover:text-zinc-200 underline ml-1"
            >
              Check backlog.
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <MediaItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

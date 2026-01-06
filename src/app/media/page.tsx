import { prisma } from "@/lib/db";
import { MediaForm } from "@/components/dashboard/media-form";
import { MediaItem } from "@/components/dashboard/media-item";
import { CheckCircle2, PlayCircle, Library, Archive } from "lucide-react";
import { getCurrentUser } from "@/lib/auth"; // <--- Updated Import

export default async function MediaPage() {
  const { userId } = await getCurrentUser();

  if (!userId) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-zinc-500">
        Please sign in to access your Media Library.
      </div>
    );
  }

  // 1. Fetch ALL media items
  const allMedia = await prisma.mediaItem.findMany({
    where: { userId: userId }, // <--- Fixed: Real ID
    orderBy: { createdAt: "desc" },
  });

  // 2. Bucketing Logic
  const active = allMedia.filter((i) => i.status === "IN_PROGRESS");
  const backlog = allMedia.filter((i) => i.status === "BACKLOG");
  const completed = allMedia.filter((i) => i.status === "COMPLETED");
  const dropped = allMedia.filter((i) => i.status === "DROPPED");

  // 3. Helper for Section Headers
  const SectionHeader = ({ title, icon: Icon, count, color }: any) => (
    <div
      className={`flex items-center gap-2 pb-2 border-b border-zinc-800 mb-4 ${color}`}
    >
      <Icon className="w-5 h-5" />
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <span className="ml-auto text-xs font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-500">
        {count}
      </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header & Input */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Media Library</h1>
          <p className="text-zinc-500">Manage your consumption pipeline.</p>
        </div>

        {/* Reusing the Form */}
        <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">
            Add to Backlog
          </h3>
          <MediaForm />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT COLUMN: The Pipeline */}
        <div className="space-y-10">
          {/* 1. NOW PLAYING */}
          <section>
            <SectionHeader
              title="Now Playing"
              icon={PlayCircle}
              count={active.length}
              color="text-green-400"
            />
            {active.length === 0 ? (
              <div className="text-sm text-zinc-600 italic border-l-2 border-zinc-800 pl-3 py-2">
                Nothing active. Pick something from the backlog!
              </div>
            ) : (
              <div className="space-y-2">
                {active.map((item) => (
                  <MediaItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          {/* 2. BACKLOG */}
          <section>
            <SectionHeader
              title="Backlog"
              icon={Library}
              count={backlog.length}
              color="text-zinc-400"
            />
            {backlog.length === 0 ? (
              <div className="text-sm text-zinc-600 italic border-l-2 border-zinc-800 pl-3 py-2">
                Backlog empty.
              </div>
            ) : (
              <div className="space-y-2">
                {backlog.map((item) => (
                  <MediaItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: The Archive */}
        <div className="space-y-10">
          {/* 3. COMPLETED */}
          <section>
            <SectionHeader
              title="Completed"
              icon={CheckCircle2}
              count={completed.length}
              color="text-purple-400"
            />
            <div className="space-y-2 opacity-80 hover:opacity-100 transition-opacity">
              {completed.length === 0 && (
                <p className="text-sm text-zinc-600 italic">No finishes yet.</p>
              )}
              {completed.map((item) => (
                <MediaItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* 4. DROPPED */}
          {dropped.length > 0 && (
            <section>
              <SectionHeader
                title="Dropped / Abandoned"
                icon={Archive}
                count={dropped.length}
                color="text-red-900"
              />
              <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity">
                {dropped.map((item) => (
                  <MediaItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

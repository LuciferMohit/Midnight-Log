import { prisma } from "@/lib/db";
import { HabitForm } from "@/components/dashboard/habit-form";
import { Zap, Repeat, Trash2 } from "lucide-react";
import { deleteHabit } from "@/app/actions/habits";
import { getCurrentUser } from "@/lib/auth"; // <--- Updated Import

export default async function HabitsPage() {
  const { userId } = await getCurrentUser();

  if (!userId) return <div>Please sign in</div>;

  const habits = await prisma.habit.findMany({
    where: { userId: userId },
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Habit Protocols</h1>
        <p className="text-zinc-500">
          Define your daily and weekly recurrences.
        </p>
      </div>

      {/* Creation Form */}
      <div className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
        <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          Install New Protocol
        </h3>
        <HabitForm />
      </div>

      {/* The Master List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200">
          Active Protocols ({habits.length})
        </h2>

        <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-lg bg-zinc-900/20 overflow-hidden">
          {habits.length === 0 && (
            <div className="p-4 text-zinc-600 italic">No habits defined.</div>
          )}

          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 flex items-center justify-between group hover:bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-900 rounded-md text-zinc-500">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-zinc-200">{habit.title}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">
                    {habit.frequency}
                  </div>
                </div>
              </div>

              {/* Delete Action */}
              <form
                action={async () => {
                  "use server";
                  await deleteHabit(habit.id);
                }}
              >
                <button
                  className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Habit Protocol"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

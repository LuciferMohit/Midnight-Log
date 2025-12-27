import { prisma } from "@/lib/db"
import { HabitItem } from "./habit-item"
import { HabitForm } from "./habit-form"

export async function HabitList() {
  const USER_ID = "lucifer-demo-id"
  
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // Fetch habits + logs
  const habits = await prisma.habit.findMany({
    where: { userId: USER_ID },
    include: {
      logs: {
        where: {
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      },
    },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="w-full">
      {/* 1. The Input Form */}
      <HabitForm />

      {/* 2. The List of Items */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-500 text-sm">No active habits.</p>
            <p className="text-zinc-600 text-xs mt-1">Add one above to get started.</p>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))
        )}
      </div>
    </div>
  )
}

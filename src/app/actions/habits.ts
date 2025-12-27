'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// --- CREATE ---
export async function createHabit(formData: FormData) {
  const title = formData.get("title") as string
  // Default to DAILY if not specified
  const frequency = (formData.get("frequency") as string) || "DAILY" 

  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" }
  }

  try {
    // Ensure the Demo User exists before creating the habit
    await prisma.user.upsert({
      where: { id: "lucifer-demo-id" },
      update: {}, // If user exists, do nothing
      create: {
        id: "lucifer-demo-id",
        name: "Lucifer",
        email: "lucifer@midnight.local" // Dummy email required by schema
      }
    })

    // Now it is safe to create the habit
    await prisma.habit.create({
      data: {
        userId: "lucifer-demo-id", // Hardcoded for alpha
        title: title.trim(),
        frequency: frequency,
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create habit:", error)
    return { success: false, error: "Database error" }
  }
}

// --- UPDATE ---
export async function updateHabit(habitId: string, formData: FormData) {
  const title = formData.get("title") as string
  const frequency = formData.get("frequency") as string

  try {
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        title: title,
        frequency: frequency
      }
    })
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update habit:", error)
    return { success: false, error: "Failed to update" }
  }
}

// --- DELETE ---
export async function deleteHabit(habitId: string) {
  try {
    // 1. Cleanup logs first (Cascade delete manual handling if DB doesn't do it)
    await prisma.habitLog.deleteMany({
      where: { habitId }
    })

    // 2. Delete the habit
    await prisma.habit.delete({
      where: { id: habitId }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete habit:", error)
    return { success: false, error: "Failed to delete" }
  }
}

// --- TOGGLE (EXISTING) ---
export async function toggleHabit(habitId: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: habitId,
        date: { gte: today }, // Using 'date' per your schema
      },
    })

    if (existingLog) {
      await prisma.habitLog.delete({ where: { id: existingLog.id } })
    } else {
      await prisma.habitLog.create({
        data: {
          habitId: habitId,
          status: "COMPLETED", // Using 'status' per your schema
        },
      })
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle habit:", error)
    return { success: false, error: "Failed to toggle" }
  }
}

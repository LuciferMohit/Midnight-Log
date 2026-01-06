'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth" // <--- Updated Import
import { currentUser } from "@clerk/nextjs/server";
import { EnergyLevel } from "@prisma/client"

export async function createHabit(formData: FormData) {
  const { userId, isDev } = await getCurrentUser()

  if (!userId) return { success: false, error: "Unauthorized" }

  const title = formData.get("title") as string
  const frequency = (formData.get("frequency") as string) || "DAILY"
  const energyLevel = (formData.get("energyLevel") as EnergyLevel) || "MEDIUM"
  const duration = parseInt(formData.get("duration") as string) || 30
  const defaultTime = (formData.get("defaultTime") as string) || null

  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" }
  }

  try {
    // 1. SELF-HEALING: Sync User to Postgres
    let userEmail = "no-email@midnight.local";
    let userName = "Traveler";

    if (!isDev) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        userEmail = clerkUser.emailAddresses[0]?.emailAddress || userEmail;
        userName = clerkUser.firstName || userName;
      }
    } else {
      userEmail = "admin@midnight.local";
      userName = "System Admin";
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: userEmail,
        name: userName,
      },
    })

    // 2. Create Habit
    await prisma.habit.create({
      data: {
        userId: userId,
        title: title.trim(),
        frequency,
        energyLevel,
        duration,
        defaultTime,
      },
    })

    revalidatePath("/")
    revalidatePath("/habits")
    return { success: true }
  } catch (error) {
    console.error("Failed to create habit:", error)
    return { success: false, error: "Database error" }
  }
}

// ... Rest of the file (Update/Delete/Toggle) ...

export async function deleteHabit(habitId: string) {
  const { userId } = await getCurrentUser()
  if (!userId) return { success: false }

  await prisma.habit.deleteMany({
    where: {
      id: habitId,
      userId: userId // <--- Security
    }
  })
  revalidatePath("/")
  revalidatePath("/habits")
  return { success: true }
}

export async function updateHabit(habitId: string, formData: FormData) {
  const { userId } = await getCurrentUser()
  if (!userId) return { success: false, error: "Unauthorized" }

  const title = formData.get("title") as string;
  const frequency = formData.get("frequency") as string;

  try {
    await prisma.habit.updateMany({
      where: { id: habitId, userId: userId },
      data: {
        title: title,
        frequency: frequency,
      },
    });

    revalidatePath("/");
    revalidatePath("/habits");
    return { success: true };
  } catch (error) {
    console.error("Failed to update habit:", error);
    return { success: false, error: "Failed to update" };
  }
}

export async function toggleHabit(habitId: string) {
  const { userId } = await getCurrentUser()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    })

    if (!habit || habit.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: habitId,
        date: { gte: today },
      },
    });

    if (existingLog) {
      await prisma.habitLog.delete({ where: { id: existingLog.id } });
    } else {
      await prisma.habitLog.create({
        data: {
          habitId: habitId,
          status: "COMPLETED",
        },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle habit:", error);
    return { success: false, error: "Failed to toggle" };
  }
}

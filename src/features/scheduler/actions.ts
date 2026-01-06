'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth" // <--- Updated Import
import { currentUser } from "@clerk/nextjs/server";
import { EnergyLevel } from "@prisma/client"

// 1. Fetch existing slots (to show them when page loads)
export async function getSchedule() {
  const { userId } = await getCurrentUser()
  if (!userId) return []

  return await prisma.timeBlock.findMany({
    where: { userId: userId }, // <--- Filter by user
    include: {
      habit: true,
      project: true,
    },
  });
}

// 2. Toggle a slot (Occupied <-> Free)
export async function toggleTimeBlock(
  dayIndex: number,
  slotIndex: number,
  data?: { habitId?: string; projectId?: string }
) {
  const { userId, isDev } = await getCurrentUser()
  if (!userId) return { success: false, error: "Unauthorized" }

  const day = dayIndex;

  try {
    // 0. SELF-HEALING (Ensure user exists before creating blocks)
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
      create: { id: userId, email: userEmail, name: userName }
    });

    // 1. Check if block exists
    const existingBlock = await prisma.timeBlock.findUnique({
      where: {
        userId_day_slotIndex: {
          userId: userId,
          day,
          slotIndex,
        },
      },
    });

    if (existingBlock) {
      if (existingBlock.isOccupied) {
        await prisma.timeBlock.delete({
          where: { id: existingBlock.id },
        });
      } else {
        await prisma.timeBlock.update({
          where: { id: existingBlock.id },
          data: {
            isOccupied: true,
            habitId: data?.habitId || null,
            projectId: data?.projectId || null,
          },
        });
      }
    } else {
      // 2. Create new block
      await prisma.timeBlock.create({
        data: {
          userId: userId,
          day,
          slotIndex,
          isOccupied: true,
          habitId: data?.habitId || null,
          projectId: data?.projectId || null,
        },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle block:", error);
    return { success: false, error: "Failed to update schedule" };
  }
}

export async function runAutoSchedule() {
  const { userId } = await getCurrentUser()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const habits = await prisma.habit.findMany({
      where: { userId: userId, frequency: "DAILY" }
    })

    const existingBlocks = await prisma.timeBlock.findMany({
      where: { userId: userId }
    })

    const timeToSlot = (timeStr: string): number => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 2 + (m >= 30 ? 1 : 0);
    };

    const getSlotEnergy = (hour: number): "HIGH" | "MEDIUM" | "LOW" => {
      if (hour >= 6 && hour < 12) return "HIGH";
      if (hour >= 12 && hour < 17) return "LOW";
      if (hour >= 17 && hour < 23) return "MEDIUM";
      return "LOW";
    };

    const newBlocks: any[] = [];
    const fixedHabits = habits.filter((h) => h.defaultTime);
    const flexibleHabits = habits.filter((h) => !h.defaultTime);

    // --- PHASE 1: PLACE ANCHORS (Fixed Time) ---
    for (let day = 0; day <= 6; day++) {
      for (const habit of fixedHabits) {
        if (!habit.defaultTime) continue;

        const startSlot = timeToSlot(habit.defaultTime);
        const durationSlots = Math.ceil(habit.duration / 30);
        let canPlace = true;
        for (let k = 0; k < durationSlots; k++) {
          const slotToCheck = startSlot + k;
          if (slotToCheck >= 48) { canPlace = false; break; }
          const isBlocked = existingBlocks.some(
            (b) => b.day === day && b.slotIndex === slotToCheck
          );
          if (isBlocked) { canPlace = false; break; }
        }

        if (canPlace) {
          for (let k = 0; k < durationSlots; k++) {
            const currentSlot = startSlot + k;
            if (currentSlot < 48) {
              newBlocks.push({
                userId: userId,
                day,
                slotIndex: currentSlot,
                isOccupied: true,
                habitId: habit.id,
                projectId: null,
              });
            }
          }
        }
      }
    }

    // --- PHASE 2: PLACE FLEXIBLE ---
    for (let day = 0; day <= 6; day++) {
      for (const habit of flexibleHabits) {
        const durationSlots = Math.ceil(habit.duration / 30);
        let slotsFound = 0;
        let startSlotIndex = -1;

        for (let i = 0; i < 48; i++) {
          const hour = Math.floor(i / 2);
          const isBlockedDB = existingBlocks.some(
            (b) => b.day === day && b.slotIndex === i
          );
          const isBlockedNew = newBlocks.some(
            (b) => b.day === day && b.slotIndex === i
          );

          const slotEnergy = getSlotEnergy(hour);
          const isEnergyCompatible =
            habit.energyLevel === "LOW" ||
            (habit.energyLevel === "MEDIUM" && slotEnergy !== "LOW") ||
            (habit.energyLevel === "HIGH" && slotEnergy === "HIGH");

          if (!isBlockedDB && !isBlockedNew && isEnergyCompatible) {
            if (slotsFound === 0) startSlotIndex = i;
            slotsFound++;
          } else {
            slotsFound = 0;
            startSlotIndex = -1;
          }

          if (slotsFound === durationSlots) {
            for (let k = 0; k < durationSlots; k++) {
              newBlocks.push({
                userId: userId,
                day,
                slotIndex: startSlotIndex + k,
                isOccupied: true,
                habitId: habit.id,
                projectId: null,
              });
            }
            break;
          }
        }
      }
    }

    if (newBlocks.length > 0) {
      // Ensure user exists before transaction if not already done?
      // We rely on getSchedule/toggle to have set it up, or upsert here.
      // Safest is to upsert here too or assume it's done elsewhere.
      // Given we are creating blocks, we HAVE to ensure user exists.

      // We already have userId. 
      // If runAutoSchedule is the FIRST thing a user does (unlikely but possible), we should upsert.
      // Re-using the logic from toggle/others.
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: "scheduler@midnight.local", name: "Scheduler User" } // Simple fallback if not fetched
      });

      await prisma.$transaction(
        newBlocks.map((block) => prisma.timeBlock.create({ data: block }))
      );
    }

    revalidatePath("/");
    return { success: true, count: newBlocks.length };
  } catch (error) {
    console.error("Auto-schedule failed:", error);
    return { success: false, error: "Algorithm crashed" };
  }
}

export async function clearSchedule() {
  const { userId } = await getCurrentUser()
  if (!userId) return { success: false }

  try {
    await prisma.timeBlock.deleteMany({
      where: { userId: userId }
    })
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function getHabits() {
  const { userId } = await getCurrentUser()
  if (!userId) return []
  return await prisma.habit.findMany({
    where: { userId: userId },
    orderBy: { title: "asc" },
  });
}

export async function getProjects() {
  const { userId } = await getCurrentUser()
  if (!userId) return []
  return await prisma.project.findMany({
    where: { userId: userId },
  });
}

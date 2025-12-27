"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Fetch existing slots (to show them when page loads)
export async function getSchedule() {
  // In a real app, we would get the userId from session
  // For now, we fetch ALL blocks to keep it simple
  return await prisma.timeBlock.findMany();
}

// 2. Toggle a slot (Occupied <-> Free)
export async function toggleTimeBlock(dayIndex: number, slotIndex: number) {
  const userId = "lucifer-demo-id"; // Hardcoded for now until we add Auth
  const dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex];

  // Check if it exists
  const existing = await prisma.timeBlock.findUnique({
    where: {
      userId_day_slotIndex: {
        userId,
        day: dayName,
        slotIndex,
      },
    },
  });

  if (existing) {
    // If it exists, delete it (User wants to free up the slot)
    await prisma.timeBlock.delete({ where: { id: existing.id } });
  } else {
    // Ensure demo user exists so foreign key constraint won't fail
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@local`, name: "Lucifer" },
    });

    // If not, create it (User is marking it as Occupied)
    await prisma.timeBlock.create({
      data: {
        userId,
        day: dayName,
        slotIndex,
        type: "OCCUPIED",
      },
    });
  }

  // Refresh the UI automatically
  revalidatePath("/");
}

// 3. Seed sample data for dev
export async function seedDatabase() {
  const userId = "lucifer-demo-id";

  // Ensure user exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@local`, name: "Lucifer" },
  });

  // 1. Create Habits
  await prisma.habit.createMany({
    data: [
      { title: "Morning Run", frequency: "DAILY", userId },
      { title: "Deep Work (Code)", frequency: "DAILY", userId },
      { title: "Read 30 Pages", frequency: "DAILY", userId },
    ],
    skipDuplicates: true,
  });

  // 2. Create Backlog Media
  await prisma.mediaItem.createMany({
    data: [
      { title: "Elden Ring", type: "GAME", status: "BACKLOG", userId },
      { title: "Interstellar", type: "MOVIE", status: "BACKLOG", userId },
    ],
    skipDuplicates: true,
  });

  // 3. Create Project
  await prisma.project.upsert({
    where: { id: "midnight-plos-project" },
    update: {},
    create: {
      id: "midnight-plos-project",
      title: "Midnight PLOS",
      status: "ACTIVE",
      userId,
    },
  });

  revalidatePath("/");
}

// 4. Run a simple auto-scheduling algorithm
export async function runAutoSchedule() {
  const userId = "lucifer-demo-id";
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Clear previous AI suggestions
  await prisma.timeBlock.deleteMany({ where: { userId, type: "ALLOCATED" } });

  // Fetch resources
  const habits = await prisma.habit.findMany({ where: { userId } });
  const occupiedSlots = await prisma.timeBlock.findMany({ where: { userId } });

  const busyMap = new Set(occupiedSlots.map((b) => `${b.day}-${b.slotIndex}`));

  const newBlocks: any[] = [];

  for (let d = 0; d < 7; d++) {
    let habitIndex = 0;
    for (let slot = 16; slot < 24; slot++) {
      const key = `${DAYS[d]}-${slot}`;
      if (!busyMap.has(key) && habitIndex < habits.length) {
        newBlocks.push({
          userId,
          day: DAYS[d],
          slotIndex: slot,
          type: "ALLOCATED",
          activityId: habits[habitIndex].id,
          activityType: "HABIT",
        });
        habitIndex++;
      }
    }
  }

  if (newBlocks.length > 0) {
    await prisma.timeBlock.createMany({ data: newBlocks });
  }

  revalidatePath("/");
}

// Fetch real habits for the UI
export async function getHabits() {
  return await prisma.habit.findMany({
    orderBy: { title: 'asc' },
  });
}

// Fetch real projects for the UI
export async function getProjects() {
  return await prisma.project.findMany();
}

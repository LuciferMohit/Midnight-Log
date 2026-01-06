import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ID = "lucifer-demo-id";

async function seed() {
  try {
    // Ensure user exists
    await prisma.user.upsert({
      where: { id: USER_ID },
      update: {},
      create: {
        id: USER_ID,
        name: "Lucifer",
        email: "lucifer@midnight.local",
      },
    });

    // Create Projects
    const projects = [
      { title: "Web Technologies Lab", status: "ACTIVE" },
      { title: "IoT Lab", status: "ACTIVE" },
      { title: "Machine Learning Lab", status: "ACTIVE" },
      { title: "Mini Project", status: "ACTIVE" },
      { title: "Computer Networks Lab", status: "ACTIVE" },
    ];

    for (const project of projects) {
      await prisma.project.upsert({
        where: { id: `${USER_ID}-${project.title}` },
        update: {},
        create: {
          userId: USER_ID,
          title: project.title,
          status: project.status as "ACTIVE" | "COMPLETED",
        },
      });
    }

    // Create Habits with Energy Levels
    const habits = [
      {
        title: "College Lectures",
        frequency: "DAILY",
        energyLevel: "HIGH",
        duration: 120,
      },
    ];

    for (const habit of habits) {
      await prisma.habit.upsert({
        where: { id: `${USER_ID}-${habit.title}` },
        update: {},
        create: {
          userId: USER_ID,
          title: habit.title,
          frequency: habit.frequency,
          energyLevel: habit.energyLevel as "HIGH" | "MEDIUM" | "LOW",
          duration: habit.duration,
        },
      });
    }

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

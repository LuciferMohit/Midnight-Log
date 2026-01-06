import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const USER_ID = "lucifer-demo-id";

async function createAnchors() {
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

    // Create fixed-time anchor habits
    const anchors = [
      {
        title: "Lunch",
        frequency: "DAILY",
        energyLevel: "LOW",
        duration: 30,
        defaultTime: "13:00",
      },
      {
        title: "Dinner",
        frequency: "DAILY",
        energyLevel: "LOW",
        duration: 30,
        defaultTime: "20:00",
      },
      {
        title: "Sleep",
        frequency: "DAILY",
        energyLevel: "LOW",
        duration: 120, // 2 hours
        defaultTime: "23:00",
      },
    ];

    for (const anchor of anchors) {
      const existing = await prisma.habit.findFirst({
        where: { userId: USER_ID, title: anchor.title },
      });

      if (!existing) {
        await prisma.habit.create({
          data: {
            userId: USER_ID,
            ...anchor,
            energyLevel: anchor.energyLevel as "HIGH" | "MEDIUM" | "LOW",
          },
        });
        console.log(
          `✅ Created anchor: ${anchor.title} at ${anchor.defaultTime}`
        );
      } else {
        console.log(`⏭️  Skipped: ${anchor.title} already exists`);
      }
    }

    console.log("\n✨ Anchors ready! Run Auto-Schedule to see them placed.");
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAnchors();

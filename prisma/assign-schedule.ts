import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const USER_ID = "lucifer-demo-id";

async function assignSchedule() {
  try {
    // Get all projects and habit IDs
    const collegeHabit = await prisma.habit.findFirst({
      where: { userId: USER_ID, title: "College Lectures" },
    });

    const webTech = await prisma.project.findFirst({
      where: { userId: USER_ID, title: "Web Technologies Lab" },
    });

    const iot = await prisma.project.findFirst({
      where: { userId: USER_ID, title: "IoT Lab" },
    });

    const ml = await prisma.project.findFirst({
      where: { userId: USER_ID, title: "Machine Learning Lab" },
    });

    const mini = await prisma.project.findFirst({
      where: { userId: USER_ID, title: "Mini Project" },
    });

    const cn = await prisma.project.findFirst({
      where: { userId: USER_ID, title: "Computer Networks Lab" },
    });

    console.log("Found items:");
    console.log(`- College Lectures (Habit): ${collegeHabit?.id}`);
    console.log(`- Web Tech Lab: ${webTech?.id}`);
    console.log(`- IoT Lab: ${iot?.id}`);
    console.log(`- ML Lab: ${ml?.id}`);
    console.log(`- Mini Project: ${mini?.id}`);
    console.log(`- CN Lab: ${cn?.id}`);

    // Time slot conversion: 30-min slots from 0-47
    // 09:00 = slot 18, 10:00 = slot 20, etc.
    const assignments = [
      // Monday (0)
      {
        day: 0,
        slots: [18, 19, 20, 21],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 09:00-11:00
      {
        day: 0,
        slots: [23, 24, 25, 26],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 11:30-13:30
      {
        day: 0,
        slots: [29, 30, 31, 32],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 14:30-16:30

      // Tuesday (1)
      { day: 1, slots: [18, 19], habitId: collegeHabit?.id, projectId: null }, // 09:00-10:00
      {
        day: 1,
        slots: [21, 22, 23, 24, 25, 26],
        habitId: null,
        projectId: ml?.id,
      }, // 10:30-13:30
      {
        day: 1,
        slots: [29, 30, 31, 32],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 14:30-16:30

      // Wednesday (2)
      { day: 2, slots: [18, 19], habitId: collegeHabit?.id, projectId: null }, // 09:00-10:00
      {
        day: 2,
        slots: [21, 22, 23, 24, 25, 26],
        habitId: null,
        projectId: mini?.id,
      }, // 10:30-13:30
      {
        day: 2,
        slots: [29, 30, 31, 32],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 14:30-16:30

      // Thursday (3) - Heavy Lab Day
      {
        day: 3,
        slots: [18, 19, 20, 21, 22, 23, 24, 25],
        habitId: null,
        projectId: webTech?.id,
      }, // 09:00-13:00
      {
        day: 3,
        slots: [29, 30, 31, 32, 33, 34],
        habitId: null,
        projectId: iot?.id,
      }, // 14:30-17:30

      // Friday (4)
      {
        day: 4,
        slots: [18, 19, 20, 21],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 09:00-11:00
      {
        day: 4,
        slots: [23, 24, 25, 26],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 11:30-13:30
      {
        day: 4,
        slots: [29, 30, 31, 32],
        habitId: collegeHabit?.id,
        projectId: null,
      }, // 14:30-16:30

      // Saturday (5)
      { day: 5, slots: [18, 19, 20, 21], habitId: null, projectId: cn?.id }, // 09:00-11:00
      { day: 5, slots: [23, 24], habitId: collegeHabit?.id, projectId: null }, // 11:30-12:30
    ];

    let count = 0;
    for (const assignment of assignments) {
      for (const slot of assignment.slots) {
        // Delete existing block if any
        await prisma.timeBlock.deleteMany({
          where: {
            userId: USER_ID,
            day: assignment.day,
            slotIndex: slot,
          },
        });

        // Create new block
        await prisma.timeBlock.create({
          data: {
            userId: USER_ID,
            day: assignment.day,
            slotIndex: slot,
            isOccupied: true,
            habitId: assignment.habitId,
            projectId: assignment.projectId,
          },
        });
        count++;
      }
    }

    console.log(`✅ Created ${count} time block assignments!`);
  } catch (error) {
    console.error("❌ Assignment failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

assignSchedule();

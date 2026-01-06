"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth"; // <--- Updated Import
import { currentUser } from "@clerk/nextjs/server";

// --- CREATE ---
export async function createProject(formData: FormData) {
  const { userId, isDev } = await getCurrentUser();

  if (!userId) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;

  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" };
  }

  try {
    // 1. SELF-HEALING: Ensure User exists
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
    });

    // 2. Create Project
    await prisma.project.create({
      data: {
        userId: userId,
        title: title.trim(),
        status: "ACTIVE",
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Database error" };
  }
}

// --- UPDATE STATUS ---
export async function updateProjectStatus(id: string, newStatus: string) {
  const { userId } = await getCurrentUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    await prisma.project.updateMany({
      where: { id, userId }, // Ownership
      data: { status: newStatus },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update" };
  }
}

// --- DELETE ---
export async function deleteProject(id: string) {
  const { userId } = await getCurrentUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    await prisma.project.deleteMany({
      where: { id, userId }, // Ownership
    });

    revalidatePath("/");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete" };
  }
}

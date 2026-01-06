"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth"; // <--- Updated Import
import { currentUser } from "@clerk/nextjs/server";

// Define valid types and statuses to ensure data integrity
export type MediaType = "GAME" | "MOVIE" | "SHOW" | "BOOK";
export type MediaStatus = "BACKLOG" | "IN_PROGRESS" | "COMPLETED" | "DROPPED";

// --- CREATE ---
export async function createMediaItem(formData: FormData) {
  const { userId, isDev } = await getCurrentUser(); // <--- Get User

  // If not authenticated via either method
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as MediaType;

  // Validation
  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" };
  }

  try {
    // 1. SELF-HEALING: Ensure User exists in local DB
    // Logic: If Dev, we need to ensure 'dev-admin-id' exists if not already.
    // If Clerk, we fetch currentUser() details.

    let userEmail = "no-email@midnight.local";
    let userName = "Traveler";

    if (!isDev) {
      // Only fetch Clerk details if valid Clerk session
      const clerkUser = await currentUser();
      if (clerkUser) {
        userEmail = clerkUser.emailAddresses[0]?.emailAddress || userEmail;
        userName = clerkUser.firstName || userName;
      }
    } else {
      // Dev Overrides
      userEmail = "admin@midnight.local";
      userName = "System Admin";
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {}, // No updates, just ensure existence
      create: {
        id: userId,
        email: userEmail,
        name: userName,
      },
    });

    // 2. Create Media Item linked to Real User
    await prisma.mediaItem.create({
      data: {
        userId: userId, // <--- True ID (Clerk or Dev)
        title: title.trim(),
        type: type || "GAME",
        status: "BACKLOG",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create media item:", error);
    return { success: false, error: "Database error" };
  }
}

// --- UPDATE STATUS ---
export async function updateMediaStatus(id: string, newStatus: MediaStatus) {
  const { userId } = await getCurrentUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    await prisma.mediaItem.updateMany({
      where: {
        id: id,
        userId: userId // Ownership check
      },
      data: { status: newStatus },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Failed to update" };
  }
}

// --- DELETE ---
export async function deleteMediaItem(id: string) {
  const { userId } = await getCurrentUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    await prisma.mediaItem.deleteMany({
      where: {
        id: id,
        userId: userId // Ownership check
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media item:", error);
    return { success: false, error: "Failed to delete" };
  }
}

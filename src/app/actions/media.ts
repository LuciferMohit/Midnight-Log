'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Define valid types and statuses to ensure data integrity
export type MediaType = "GAME" | "MOVIE" | "SHOW" | "BOOK"
export type MediaStatus = "BACKLOG" | "IN_PROGRESS" | "COMPLETED" | "DROPPED"

// --- CREATE ---
export async function createMediaItem(formData: FormData) {
  const title = formData.get("title") as string
  const type = formData.get("type") as MediaType
  
  // Validation
  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" }
  }

  try {
    // Ensure the Demo User exists
    await prisma.user.upsert({
      where: { id: "lucifer-demo-id" },
      update: {},
      create: {
        id: "lucifer-demo-id",
        name: "Lucifer",
        email: "lucifer@midnight.local"
      }
    })

    await prisma.mediaItem.create({
      data: {
        userId: "lucifer-demo-id",
        title: title.trim(),
        type: type || "GAME",     // Default type
        status: "BACKLOG",        // ALWAYS starts in Backlog
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create media item:", error)
    return { success: false, error: "Database error" }
  }
}

// --- UPDATE STATUS (Move to Progress, Complete, Drop) ---
export async function updateMediaStatus(id: string, newStatus: MediaStatus) {
  try {
    await prisma.mediaItem.update({
      where: { id },
      data: { status: newStatus }
    })
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update status:", error)
    return { success: false, error: "Failed to update" }
  }
}

// --- DELETE ---
export async function deleteMediaItem(id: string) {
  try {
    await prisma.mediaItem.delete({
      where: { id }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete media item:", error)
    return { success: false, error: "Failed to delete" }
  }
}

'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// --- CREATE ---
export async function createProject(formData: FormData) {
  const title = formData.get("title") as string
  
  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" }
  }

  try {
    // Safety check: Ensure user exists
    await prisma.user.upsert({
      where: { id: "lucifer-demo-id" },
      update: {},
      create: {
        id: "lucifer-demo-id",
        name: "Lucifer",
        email: "lucifer@midnight.local"
      }
    })

    await prisma.project.create({
      data: {
        userId: "lucifer-demo-id",
        title: title.trim(),
        status: "ACTIVE",
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: "Database error" }
  }
}

// --- UPDATE STATUS ---
export async function updateProjectStatus(id: string, newStatus: string) {
  try {
    await prisma.project.update({
      where: { id },
      data: { status: newStatus }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { success: false, error: "Failed to update" }
  }
}

// --- DELETE ---
export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { success: false, error: "Failed to delete" }
  }
}

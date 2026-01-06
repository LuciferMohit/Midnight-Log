import { auth } from "@clerk/nextjs/server"
import { cookies } from "next/headers"

export async function getCurrentUser() {
    // 1. CHECK FOR DEV OVERRIDE (Priority #1)
    const cookieStore = await cookies()
    const devToken = cookieStore.get("midnight-dev-token")

    if (devToken && devToken.value === "authorized") {
        return {
            userId: "dev-admin-id",
            isDev: true
        }
    }

    // 2. CHECK CLERK (Priority #2)
    try {
        const clerkSession = await auth()
        if (clerkSession.userId) {
            return {
                userId: clerkSession.userId,
                isDev: false
            }
        }
    } catch (e) {
        // Ignore Clerk errors
    }

    // 3. NO ACCESS
    return { userId: null, isDev: false }
}

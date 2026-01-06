'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginDev(formData: FormData) {
    const password = formData.get("password") as string

    if (password === process.env.ADMIN_PASSWORD) {
        const cookieStore = await cookies()

        // Set cookie for 30 days
        cookieStore.set("midnight-dev-token", "authorized", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30,
            path: "/"
        })

        redirect("/")
    }

    return { success: false }
}

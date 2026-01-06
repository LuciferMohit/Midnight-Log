'use client'

import { loginDev } from "./actions"
import { useState } from "react"

export default function DevLoginPage() {
    const [error, setError] = useState("")

    return (
        <div className="h-screen flex items-center justify-center bg-black">
            <form
                action={async (formData) => {
                    const res = await loginDev(formData)
                    if (!res && !res?.success) setError("Access Denied") // Handle potential void return from redirect
                }}
                className="flex flex-col gap-4 p-8 border border-red-900/50 rounded-xl bg-zinc-950"
            >
                <h1 className="text-red-500 font-mono text-xl">⚠️ SYSTEM OVERRIDE</h1>
                <input
                    name="password"
                    type="password"
                    placeholder="Admin Key..."
                    className="bg-zinc-900 border border-zinc-800 p-2 rounded text-zinc-100 focus:border-red-500 outline-none"
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button className="bg-red-900/20 text-red-400 border border-red-900/50 p-2 rounded hover:bg-red-900/40">
                    Execute Bypass
                </button>
            </form>
        </div>
    )
}

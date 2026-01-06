'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs" // <--- Import Clerk hooks
import {
  LayoutDashboard,
  CheckSquare,
  Gamepad2,
  Briefcase,
  Settings
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser() // <--- Get real user data

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/habits", label: "Habits", icon: CheckSquare },
    { href: "/projects", label: "Projects", icon: Briefcase },
    { href: "/media", label: "Media", icon: Gamepad2 },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-zinc-950 border-r border-zinc-900 flex flex-col items-center py-6 z-50">
      {/* Brand Icon */}
      <div className="w-8 h-8 bg-zinc-100 rounded-full mb-8 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <div className="w-3 h-3 bg-zinc-950 rounded-full" />
      </div>

      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                p-3 rounded-xl flex items-center justify-center transition-all group relative
                ${isActive
                  ? "bg-zinc-800 text-zinc-100 shadow-inner"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute left-14 bg-zinc-900 text-zinc-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 pointer-events-none z-50">
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 px-2 items-center">
        <button className="p-3 text-zinc-500 hover:text-zinc-300 rounded-xl hover:bg-zinc-900 transition-all">
          <Settings className="w-5 h-5" />
        </button>

        {/* Real User Button */}
        {isLoaded && user ? (
          <div className="w-8 h-8 flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full border border-zinc-800"
                }
              }}
            />
          </div>
        ) : (
          /* Loading Placeholder */
          <div className="w-8 h-8 rounded-full bg-zinc-900 animate-pulse" />
        )}
      </div>
    </aside>
  )
}

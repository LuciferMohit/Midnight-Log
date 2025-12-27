'use client'

import { runAutoSchedule } from "../actions"

export function AutoScheduleButton() {
  return (
    <button
      onClick={() => runAutoSchedule()}
      className="px-3 py-1 text-xs bg-blue-900/30 text-blue-400 border border-blue-900 rounded hover:bg-blue-900/50"
    >
      ⚡ Auto Schedule
    </button>
  )
}

"use client";

import { runAutoSchedule } from "../actions";
import { useTransition } from "react";
import { Sparkles } from "lucide-react";

export function AutoScheduleButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await runAutoSchedule();
      if (result.success) {
        console.log(`✅ Scheduled ${result.count} new blocks`);
      } else {
        console.error("❌ Scheduling failed:", result.error);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-colors"
    >
      <Sparkles className="w-4 h-4" />
      {isPending ? "Scheduling..." : "Auto-Schedule"}
    </button>
  );
}

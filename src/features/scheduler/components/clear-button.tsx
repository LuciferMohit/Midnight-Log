"use client";

import { clearSchedule } from "../actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function ClearButton() {
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    if (confirm("⚠️ Clear entire schedule? This cannot be undone.")) {
      startTransition(async () => {
        const result = await clearSchedule();
        if (result.success) {
          console.log("✅ Schedule cleared");
        } else {
          console.error("❌ Failed to clear:", result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleClear}
      disabled={isPending}
      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 disabled:opacity-50 rounded-lg transition-colors"
      title="Clear Entire Schedule"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

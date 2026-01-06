"use client";

import { useRef } from "react";
import { createHabit } from "@/app/actions/habits";
import { Input } from "@/components/ui/input";
import { Plus, Anchor } from "lucide-react";

export function HabitForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset(); // Clears the input on success
      }}
      className="space-y-3 mb-4 p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg"
    >
      <div className="flex gap-2">
        <Input
          name="title"
          placeholder="Habit title..."
          className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200"
          required
        />
        <button
          type="submit"
          className="shrink-0 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="text-xs text-zinc-500 uppercase block mb-1">
            Frequency
          </label>
          <select
            name="frequency"
            defaultValue="DAILY"
            className="w-full px-2 py-1 bg-zinc-900/50 border border-zinc-800 rounded text-xs text-zinc-200"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-zinc-500 uppercase block mb-1">
            Energy
          </label>
          <select
            name="energyLevel"
            defaultValue="MEDIUM"
            className="w-full px-2 py-1 bg-zinc-900/50 border border-zinc-800 rounded text-xs text-zinc-200"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-zinc-500 uppercase block mb-1">
            Duration (min)
          </label>
          <Input
            type="number"
            name="duration"
            defaultValue="60"
            min="30"
            step="30"
            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 text-xs"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500 uppercase block mb-1 flex items-center gap-1">
            <Anchor className="w-3 h-3" /> Time
          </label>
          <Input
            type="time"
            name="defaultTime"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded text-xs text-zinc-200"
            placeholder="--:--"
          />
        </div>
      </div>

      <div className="text-[10px] text-zinc-500 italic">
        ⭐ Leave time empty for auto-scheduling based on energy. Set time to
        anchor it to a fixed slot.
      </div>
    </form>
  );
}

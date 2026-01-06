"use client";

import { useState } from "react";
import { toggleHabit, deleteHabit, updateHabit } from "@/app/actions/habits";
import { Input } from "@/components/ui/input";

interface HabitItemProps {
  habit: {
    id: string;
    title: string;
    frequency: string;
    logs: { id: string }[]; // minimal shape needed to check length
  };
}

export function HabitItem({ habit }: HabitItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [isLoading, setIsLoading] = useState(false);

  const isCompleted = habit.logs.length > 0;

  const handleSave = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("frequency", habit.frequency); // Preserving existing frequency

    await updateHabit(habit.id, formData);
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this habit?")) {
      setIsLoading(true);
      await deleteHabit(habit.id);
    }
  };

  const handleToggle = async () => {
    // Optimistic UI update could go here, but keeping it simple
    await toggleHabit(habit.id);
  };

  // --- EDIT MODE UI ---
  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-zinc-900/80 rounded-lg border border-zinc-700">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-8 bg-zinc-800 border-zinc-600"
        />
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-sm bg-zinc-700 text-zinc-200 rounded hover:bg-zinc-600"
        >
          Cancel
        </button>
      </div>
    );
  }

  // --- VIEW MODE UI ---
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 transition-colors hover:border-zinc-700 group">
      <div className="flex flex-col">
        <span
          className={`font-medium cursor-pointer ${
            isCompleted ? "text-zinc-500 line-through" : "text-zinc-200"
          }`}
          onClick={handleToggle}
        >
          {habit.title}
        </span>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
          {habit.frequency}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Edit Button (Visible on Hover) */}
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-blue-400 p-2 text-xs"
        >
          Edit
        </button>

        {/* Delete Button (Visible on Hover) */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 p-2 text-xs"
        >
          ✕
        </button>

        {/* Toggle Button */}
        <button
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            isCompleted
              ? "bg-green-900/20 text-green-400 hover:bg-green-900/30"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={handleToggle}
        >
          {isCompleted ? "Done" : "Mark"}
        </button>
      </div>
    </div>
  );
}

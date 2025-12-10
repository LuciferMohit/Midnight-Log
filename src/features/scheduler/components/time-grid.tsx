"use client";

import { useTransition } from "react";
import { toggleTimeBlock } from "../actions";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = Array.from({ length: 48 }, (_, i) => i);

// Define what a Block looks like
type TimeBlock = {
  day: string;
  slotIndex: number;
  type: string;
};

export function TimeGrid({ initialData }: { initialData: TimeBlock[] }) {
  const [isPending, startTransition] = useTransition();

  // Convert DB array to a Set for fast lookup
  const isOccupied = (dayIndex: number, slotIndex: number) => {
    const dayName = DAYS[dayIndex];
    return initialData.some(
      (b) =>
        b.day === dayName && b.slotIndex === slotIndex && b.type === "OCCUPIED"
    );
  };

  const handleToggle = (dayIndex: number, slotIndex: number) => {
    // Use Transition to keep UI responsive while Server Action runs
    startTransition(async () => {
      await toggleTimeBlock(dayIndex, slotIndex);
    });
  };

  return (
    <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header (Hours) */}
        <div className="flex mb-2 ml-12">
          {[0, 8, 16, 24, 32, 40].map((i) => (
            <div
              key={i}
              className="flex-1 text-xs text-zinc-500 pl-1 border-l border-zinc-800"
            >
              {Math.floor(i / 2)}:00
            </div>
          ))}
        </div>

        {/* The Grid Rows */}
        <div className="space-y-1">
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-2">
              <div className="w-10 text-xs font-medium text-zinc-400">
                {day}
              </div>

              <div className="flex gap-0.5 flex-1">
                {SLOTS.map((slot) => {
                  const occupied = isOccupied(dayIndex, slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => handleToggle(dayIndex, slot)}
                      disabled={isPending}
                      title={`Slot ${slot}`}
                      className={`
                        h-6 flex-1 rounded-sm transition-colors
                        ${
                          occupied
                            ? "bg-red-500/80 hover:bg-red-600"
                            : "bg-zinc-800 hover:bg-zinc-700"
                        }
                      `}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 text-xs text-zinc-500 flex gap-4">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500/80"></div> Occupied
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-zinc-800"></div> Free
          </span>
        </div>
      </div>
    </div>
  );
}

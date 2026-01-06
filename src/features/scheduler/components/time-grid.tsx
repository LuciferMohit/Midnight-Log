"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { toggleTimeBlock } from "@/features/scheduler/actions";
import { Loader2, X, Check, Briefcase, Zap } from "lucide-react";

// --- TYPES ---
type SimpleTask = { id: string; title: string };

interface TimeBlock {
  id: string;
  day: number;
  slotIndex: number;
  isOccupied: boolean;
  habitId?: string | null;
  projectId?: string | null;
  habit?: { title: string };
  project?: { title: string };
}

interface TimeGridProps {
  initialSchedule: TimeBlock[];
  habits: SimpleTask[];
  projects: SimpleTask[];
}

// --- COMPONENT ---
export function TimeGrid({ initialSchedule, habits, projects }: TimeGridProps) {
  const [schedule, setSchedule] = useState<TimeBlock[]>(initialSchedule);
  const [isPending, startTransition] = useTransition();

  // Update local schedule when initialSchedule changes (e.g. after server action)
  useEffect(() => {
    setSchedule(initialSchedule);
  }, [initialSchedule]);

  // UI State: Which slot is currently open for assignment?
  const [activeSlot, setActiveSlot] = useState<{
    day: number;
    slot: number;
  } | null>(null);

  // Click Outside Handler
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveSlot(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // --- HELPERS ---
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getBlock = (day: number, slotIndex: number) => {
    return schedule.find((b) => b.day === day && b.slotIndex === slotIndex);
  };

  // --- ACTIONS ---
  const handleAssignment = (
    day: number,
    slotIndex: number,
    data?: { habitId?: string; projectId?: string }
  ) => {
    // 1. Optimistic Update
    const newBlock: TimeBlock = {
      id: "temp-" + Date.now(),
      day,
      slotIndex,
      isOccupied: true, // If we are assigning, it becomes occupied
      habitId: data?.habitId,
      projectId: data?.projectId,
      // Mock the nested objects for immediate UI feedback
      habit: data?.habitId
        ? {
          title: habits.find((h) => h.id === data.habitId)?.title || "",
        }
        : undefined,
      project: data?.projectId
        ? {
          title: projects.find((p) => p.id === data.projectId)?.title || "",
        }
        : undefined,
    };

    // Update local state (remove old block if exists, add new one)
    setSchedule((prev) => [
      ...prev.filter((b) => !(b.day === day && b.slotIndex === slotIndex)),
      newBlock,
    ]);

    // 2. Server Action
    startTransition(async () => {
      await toggleTimeBlock(day, slotIndex, data);
    });

    // 3. Close Menu
    setActiveSlot(null);
  };

  const handleClear = (day: number, slotIndex: number) => {
    // Optimistic clear
    setSchedule((prev) =>
      prev.filter((b) => !(b.day === day && b.slotIndex === slotIndex))
    );

    startTransition(async () => {
      // Toggle toggles off if it exists
      await toggleTimeBlock(day, slotIndex);
    });
    setActiveSlot(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-6 relative">
      <div className="min-w-[800px] select-none">
        {/* Header Row */}
        <div className="flex mb-2">
          <div className="w-12" /> {/* Label spacer */}
          {/* Time Markers (Every 4 hours) */}
          {[0, 4, 8, 12, 16, 20].map((h) => (
            <div
              key={h}
              className="flex-1 text-xs text-zinc-500 border-l border-zinc-800 pl-1"
            >
              {h}:00
            </div>
          ))}
        </div>

        {/* Days Rows */}
        <div className="space-y-1">
          {days.map((dayName, dayIndex) => (
            <div key={dayName} className="flex items-center gap-2">
              {/* Row Label */}
              <div className="w-12 text-xs font-medium text-zinc-500 text-right pr-2">
                {dayName}
              </div>

              {/* Slots Container */}
              <div className="flex-1 flex gap-px h-8 relative">
                {Array.from({ length: 48 }).map((_, slotIndex) => {
                  const block = getBlock(dayIndex, slotIndex);
                  const isOccupied = block?.isOccupied;
                  const isActive =
                    activeSlot?.day === dayIndex &&
                    activeSlot?.slot === slotIndex;

                  // Color Logic
                  let bgColor = "bg-zinc-800/50 hover:bg-zinc-700/50"; // Default Free
                  if (isOccupied) {
                    if (block.habitId)
                      bgColor =
                        "bg-emerald-900/40 border border-emerald-500/30 hover:bg-emerald-900/60";
                    else if (block.projectId)
                      bgColor =
                        "bg-blue-900/40 border border-blue-500/30 hover:bg-blue-900/60";
                    else bgColor = "bg-zinc-600 hover:bg-zinc-500"; // Generic blocked
                  }

                  return (
                    <div
                      key={slotIndex}
                      className="relative flex-1 h-full group"
                    >
                      {/* THE SLOT BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent document click
                          setActiveSlot(
                            isActive ? null : { day: dayIndex, slot: slotIndex }
                          );
                        }}
                        className={`w-full h-full rounded-sm transition-all text-[10px] flex items-center justify-center overflow-hidden ${bgColor} ${isActive ? "ring-2 ring-zinc-100 z-10" : ""
                          }`}
                        title={
                          block?.habit?.title ||
                          block?.project?.title ||
                          "Free Slot"
                        }
                      >
                        {/* Mini Indicator Icons */}
                        {block?.habitId && (
                          <Zap className="w-3 h-3 text-emerald-400" />
                        )}
                        {block?.projectId && (
                          <Briefcase className="w-3 h-3 text-blue-400" />
                        )}
                      </button>

                      {/* --- COMMAND MENU (The "Link" UI) --- */}
                      {isActive && (
                        <div
                          ref={menuRef}
                          className="absolute z-50 mt-1 w-64 bg-zinc-950 border border-zinc-700 rounded-lg shadow-2xl p-2 flex flex-col gap-1 left-0 transform -translate-x-1/2 ml-4"
                          style={{ minWidth: "200px" }}
                        >
                          <div className="text-[10px] text-zinc-500 px-2 py-1 uppercase tracking-wider font-semibold border-b border-zinc-800 mb-1">
                            Assign to {dayName} {Math.floor(slotIndex / 2)}:{slotIndex % 2 === 0 ? "00" : "30"}
                          </div>

                          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                            {/* Habits List */}
                            {habits.length > 0 && (
                              <div className="space-y-0.5">
                                <div className="text-[10px] text-zinc-600 px-2 pt-1 pb-0.5">Habits</div>
                                {habits.map((h) => (
                                  <button
                                    key={h.id}
                                    onClick={() =>
                                      handleAssignment(dayIndex, slotIndex, {
                                        habitId: h.id,
                                      })
                                    }
                                    className="w-full text-left text-xs px-2 py-2 rounded hover:bg-zinc-900 text-emerald-400 flex items-center gap-2 group/btn transition-colors"
                                  >
                                    <Zap className="w-3 h-3 group-hover/btn:text-emerald-300" />
                                    <span className="truncate group-hover/btn:text-emerald-200">{h.title}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Projects List */}
                            {projects.length > 0 && (
                              <div className="space-y-0.5 mt-2">
                                <div className="text-[10px] text-zinc-600 px-2 pt-1 pb-0.5">Projects</div>
                                {projects.map((p) => (
                                  <button
                                    key={p.id}
                                    onClick={() =>
                                      handleAssignment(dayIndex, slotIndex, {
                                        projectId: p.id,
                                      })
                                    }
                                    className="w-full text-left text-xs px-2 py-2 rounded hover:bg-zinc-900 text-blue-400 flex items-center gap-2 group/btn transition-colors"
                                  >
                                    <Briefcase className="w-3 h-3 group-hover/btn:text-blue-300" />
                                    <span className="truncate group-hover/btn:text-blue-200">{p.title}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Clear / Generic Block Options */}
                          <div className="border-t border-zinc-800 mt-2 pt-2 space-y-1">
                            {/* Only show Generic Block if slot is empty */}
                            {!isOccupied && (
                              <button
                                onClick={() =>
                                  handleAssignment(dayIndex, slotIndex)
                                }
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                              >
                                Block as "Busy"
                              </button>
                            )}

                            {isOccupied && (
                              <button
                                onClick={() => handleClear(dayIndex, slotIndex)}
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-red-900/20 text-red-400 flex items-center gap-2"
                              >
                                <X className="w-3 h-3" />
                                Clear Slot
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

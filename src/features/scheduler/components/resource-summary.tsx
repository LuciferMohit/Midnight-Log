import { Zap, Briefcase, Clock, Battery, LucideIcon } from "lucide-react";

interface TimeBlock {
  isOccupied: boolean;
  habitId?: string | null;
  projectId?: string | null;
}

interface ResourceSummaryProps {
  schedule: TimeBlock[];
}

interface StatProps {
  label: string;
  count: number;
  icon: LucideIcon;
  color: {
    border: string;
    text: string;
  };
}

// 2. Helper to render a stat block - MOVED OUTSIDE
const Stat = ({ label, count, color, icon: Icon }: StatProps) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 rounded-md bg-zinc-900 border ${color.border}`}>
      <Icon className={`w-4 h-4 ${color.text}`} />
    </div>
    <div>
      <div className="text-xl font-bold text-zinc-200 leading-none">
        {count / 2}
        <span className="text-[10px] text-zinc-500 font-normal ml-0.5">h</span>
      </div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  </div>
);

export function ResourceSummary({ schedule }: ResourceSummaryProps) {
  // 1. Math: Calculate Allocations
  const totalSlots = 48; // 24 hours * 2

  const habitSlots = schedule.filter((b) => b.habitId).length;
  const projectSlots = schedule.filter((b) => b.projectId).length;
  const genericSlots = schedule.filter(
    (b) => b.isOccupied && !b.habitId && !b.projectId
  ).length;
  const freeSlots = totalSlots - (habitSlots + projectSlots + genericSlots);

  // Convert to Percentages
  const getPct = (count: number) => Math.round((count / totalSlots) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Habits Stat */}
      <Stat
        label="Habits"
        count={habitSlots}
        icon={Zap}
        color={{ border: "border-emerald-500/20", text: "text-emerald-400" }}
      />

      {/* Projects Stat */}
      <Stat
        label="Deep Work"
        count={projectSlots}
        icon={Briefcase}
        color={{ border: "border-blue-500/20", text: "text-blue-400" }}
      />

      {/* Busy/Generic Stat */}
      <Stat
        label="Occupied"
        count={genericSlots}
        icon={Clock}
        color={{ border: "border-zinc-700/50", text: "text-zinc-400" }}
      />

      {/* Energy/Free Stat */}
      <Stat
        label="Free Capacity"
        count={freeSlots}
        icon={Battery}
        color={{ border: "border-zinc-700/50", text: "text-zinc-500" }}
      />

      {/* Visual Progress Bar */}
      <div className="col-span-2 md:col-span-4 h-1.5 bg-zinc-900 rounded-full overflow-hidden flex mt-2">
        <div
          style={{ width: `${getPct(habitSlots)}%` }}
          className="h-full bg-emerald-500/50"
        />
        <div
          style={{ width: `${getPct(projectSlots)}%` }}
          className="h-full bg-blue-500/50"
        />
        <div
          style={{ width: `${getPct(genericSlots)}%` }}
          className="h-full bg-zinc-600"
        />
      </div>
    </div>
  );
}

import React from "react";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function DashboardShell({
  title,
  children,
  className,
  action,
}: DashboardShellProps) {
  return (
    <div
      className={`h-full flex flex-col border border-zinc-800 bg-zinc-900/50 rounded-lg overflow-hidden ${
        className || ""
      }`}
    >
      <div className="flex flex-row items-center justify-between pb-2 px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-medium text-zinc-100">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">{children}</div>
    </div>
  );
}

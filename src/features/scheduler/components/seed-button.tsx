"use client";

import { seedDatabase } from "../actions";

export function SeedButton() {
  return (
    <button
      onClick={() => seedDatabase()}
      className="px-3 py-1 text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-900 rounded hover:bg-emerald-900/50"
    >
      🌱 Inject Test Data
    </button>
  );
}

import React from "react";
import { Flame, Trophy } from "lucide-react";

export default function StreakBox({ current, best }) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <Flame size={16} className="text-orange-500" />
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xl font-bold text-white">{current} days</p>
          <p className="text-xs text-gray-500">Current Streak</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-orange-500" />
          <div>
            <p className="text-xl font-bold text-white">{best} days</p>
            <p className="text-xs text-gray-500">Highest Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}

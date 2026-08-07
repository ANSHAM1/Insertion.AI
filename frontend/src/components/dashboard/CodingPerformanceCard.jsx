import {
  Code2,
  Clock,
  ListChecks,
  CheckCircle2,
  PlayCircle,
  Flame,
} from "lucide-react";

import { SectionCard } from "../UI";

export default function CodingPerformanceCard({
  codingOverview,
  codingStreak,
}) {
  const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

  const DIFFICULTY_DOT = {
    easy: "bg-emerald-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  };

  const hasDifficultyData =
    codingOverview?.difficulty &&
    Object.keys(codingOverview.difficulty).length > 0;

  return (
    <SectionCard
      title="Coding Performance"
      icon={Code2}
      className="lg:col-span-2"
    >
      <div className="space-y-5">
        {/* Streak row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-[#0d0d0f] border border-[#232326] rounded-lg px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white leading-none">
                {codingStreak?.current_streak ?? 0}
                <span className="text-xs text-gray-500 font-normal ml-1">
                  days
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Current Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0d0d0f] border border-[#232326] rounded-lg px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white leading-none">
                {codingStreak?.best_streak ?? 0}
                <span className="text-xs text-gray-500 font-normal ml-1">
                  days
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Best Streak</p>
            </div>
          </div>
        </div>

        {/* Overall last-30-days stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-[#0d0d0f] border border-[#232326] rounded-lg py-3">
            <p className="text-base font-semibold text-emerald-400">
              {codingOverview?.overall?.unique_attempts ?? 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
              <PlayCircle size={11} /> Attempts
            </p>
          </div>
          <div className="text-center bg-[#0d0d0f] border border-[#232326] rounded-lg py-3">
            <p className="text-base font-semibold text-emerald-400">
              {codingOverview?.overall?.avg_score ?? 0}%
            </p>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
              <ListChecks size={11} /> Avg Score
            </p>
          </div>
          <div className="text-center bg-[#0d0d0f] border border-[#232326] rounded-lg py-3">
            <p className="text-base font-semibold text-emerald-400">
              {codingOverview?.overall?.avg_time_taken_minutes ?? 0}m
            </p>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
              <Clock size={11} /> Avg Time
            </p>
          </div>
        </div>

        <div className="h-[10px]"></div>

        {/* Difficulty breakdown */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Last 30 Days by Difficulty
          </p>

          {hasDifficultyData ? (
            DIFFICULTY_ORDER.filter(
              (level) => codingOverview.difficulty[level],
            ).map((level) => {
              const d = codingOverview.difficulty[level];
              return (
                <div
                  key={level}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-[#232326] bg-[#0d0d0f] hover:border-orange-500/40 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${DIFFICULTY_DOT[level]}`}
                    />
                    <span className="text-sm text-gray-300 capitalize">
                      {level}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 tabular-nums">
                    <span className="w-32 text-right">
                      {d.unique_attempts} unique attempts
                    </span>
                    <span className="w-16 text-right">
                      {d.avg_score}% score
                    </span>
                    <span className="w-16 text-right">
                      {d.avg_time_taken_minutes}m avg
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-600 italic px-1">
              No coding activity in the last 30 days.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

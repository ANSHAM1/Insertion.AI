import { Flame, CalendarDays, Target, Sparkles } from "lucide-react";

import DashboardCard from "./DashboardCard";

const DEFAULT_DAYS = [
  { day: "Mon", value: 100 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 65 },
  { day: "Thu", value: 100 },
  { day: "Fri", value: 90 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 0 },
];

function getColor(value) {
  if (value >= 90) return "bg-green-500";
  if (value >= 70) return "bg-green-400";
  if (value >= 50) return "bg-yellow-400";
  if (value >= 20) return "bg-orange-400";
  return "bg-bg";
}

export default function WeeklyConsistencyCard({
  days = DEFAULT_DAYS,
  currentStreak = 6,
  bestStreak = 14,
}) {
  const completed = days.filter((d) => d.value >= 70).length;

  const consistency = Math.round(
    days.reduce((sum, d) => sum + d.value, 0) / days.length,
  );

  return (
    <DashboardCard
      title="Weekly Consistency"
      subtitle="Your discipline this week"
    >
      <div className="flex flex-col gap-6">
        {/* KPI */}

        <div className="rounded-xl bg-bg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-text-muted">Consistency Score</div>

              <div className="mt-2 text-4xl font-bold text-accent">
                {consistency}%
              </div>
            </div>

            <div className="rounded-xl bg-surface p-3">
              <Target size={28} className="text-accent" />
            </div>
          </div>
        </div>

        {/* Heatmap */}

        <div>
          <div className="mb-3 text-sm font-semibold text-text-primary">
            Weekly Activity
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <div
                  title={`${day.day} : ${day.value}%`}
                  className={`h-10 w-10 rounded-lg transition-transform duration-200 hover:scale-110 ${getColor(
                    day.value,
                  )}`}
                />

                <span className="text-[11px] text-text-muted">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-bg p-4">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />

              <span className="text-xs text-text-muted">Current Streak</span>
            </div>

            <div className="mt-2 text-2xl font-bold text-text-primary">
              {currentStreak} days
            </div>
          </div>

          <div className="rounded-xl bg-bg p-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-accent" />

              <span className="text-xs text-text-muted">Best Streak</span>
            </div>

            <div className="mt-2 text-2xl font-bold text-text-primary">
              {bestStreak} days
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />

            <span className="font-semibold text-text-primary">AI Insight</span>
          </div>

          <p className="text-sm leading-6 text-text-secondary">
            You completed{" "}
            <span className="font-semibold text-text-primary">{completed}</span>{" "}
            productive days this week with an average consistency of{" "}
            <span className="font-semibold text-text-primary">
              {consistency}%
            </span>
            . Maintaining a streak above <strong>10 days</strong> typically
            leads to a noticeable improvement in long-term productivity and
            habit formation.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

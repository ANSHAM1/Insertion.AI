import { Clock3, Timer, TrendingUp } from "lucide-react";

import DashboardCard from "./DashboardCard";

export default function TimeLostCard({ plannedHours = 8, workedHours = 6 }) {
  const lostHours = Math.max(plannedHours - workedHours, 0);

  const productivity =
    plannedHours === 0 ? 0 : Math.round((workedHours / plannedHours) * 100);

  return (
    <DashboardCard title="Productivity" subtitle="Today's work summary">
      <div className="flex flex-col gap-5">
        {/* KPI */}

        <div className="rounded-xl bg-bg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-text-muted">Productivity Score</div>

              <div className="mt-2 text-4xl font-bold text-accent">
                {productivity}%
              </div>
            </div>

            <div className="rounded-xl bg-surface p-3">
              <TrendingUp size={28} className="text-accent" />
            </div>
          </div>
        </div>

        {/* Metrics */}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-bg p-4 text-center">
            <Clock3 size={18} className="mx-auto mb-2 text-accent" />

            <div className="text-xs text-text-muted">Planned</div>

            <div className="mt-1 text-xl font-bold text-text-primary">
              {plannedHours}h
            </div>
          </div>

          <div className="rounded-xl bg-bg p-4 text-center">
            <Timer size={18} className="mx-auto mb-2 text-green-500" />

            <div className="text-xs text-text-muted">Worked</div>

            <div className="mt-1 text-xl font-bold text-green-500">
              {workedHours}h
            </div>
          </div>

          <div className="rounded-xl bg-bg p-4 text-center">
            <Clock3 size={18} className="mx-auto mb-2 text-red-500" />

            <div className="text-xs text-text-muted">Lost</div>

            <div className="mt-1 text-xl font-bold text-red-500">
              {lostHours}h
            </div>
          </div>
        </div>

        {/* Progress */}

        <div>
          <div className="mb-2 flex justify-between text-xs text-text-muted">
            <span>Work Progress</span>

            <span>
              {workedHours}/{plannedHours} hrs
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{
                width: `${productivity}%`,
              }}
            />
          </div>
        </div>

        {/* AI Insight */}

        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="mb-2 text-sm font-semibold text-text-primary">
            AI Insight
          </div>

          <p className="text-sm leading-6 text-text-secondary">
            {lostHours === 0
              ? "Excellent! You completed all planned working hours today. Maintain this consistency to build long-term productivity."
              : `You lost ${lostHours} hour${lostHours > 1 ? "s" : ""} today. Recovering just 30–45 minutes tomorrow will significantly improve your weekly consistency score.`}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

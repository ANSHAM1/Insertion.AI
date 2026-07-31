import { Target, TrendingUp } from "lucide-react";
import DashboardCard from "./DashboardCard";

export default function ResumeDistributionCard({
  distribution = [
    { range: "90-100", jobs: 12 },
    { range: "80-90", jobs: 21 },
    { range: "70-80", jobs: 10 },
    { range: "60-70", jobs: 4 },
    { range: "<60", jobs: 3 },
  ],
}) {
  const total = distribution.reduce((sum, item) => sum + item.jobs, 0);

  const max = Math.max(...distribution.map((d) => d.jobs), 1);

  const weighted =
    distribution.reduce((sum, item) => {
      let score = 50;

      if (item.range === "90-100") score = 95;
      else if (item.range === "80-90") score = 85;
      else if (item.range === "70-80") score = 75;
      else if (item.range === "60-70") score = 65;

      return sum + score * item.jobs;
    }, 0) / total;

  return (
    <DashboardCard
      title="Resume Match Distribution"
      subtitle="How competitive is your profile?"
    >
      <div className="flex flex-col gap-6">
        {/* KPI */}

        <div className="flex flex-wrap items-center justify-between rounded-xl bg-bg p-4">
          <div>
            <div className="text-xs text-text-muted">Average Resume Match</div>

            <div className="mt-2 text-4xl font-bold text-accent">
              {Math.round(weighted)}%
            </div>
          </div>

          <div className="rounded-lg bg-surface p-3">
            <Target size={28} className="text-accent" />
          </div>
        </div>

        {/* Histogram */}

        <div className="flex h-52 items-end gap-5">
          {distribution.map((item) => (
            <div
              key={item.range}
              className="flex flex-1 flex-col items-center gap-3"
            >
              <span className="text-xs font-medium text-text-primary">
                {item.jobs}
              </span>

              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-accent transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${(item.jobs / max) * 100}%`,
                  }}
                />
              </div>

              <span className="text-[11px] text-text-muted">{item.range}</span>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="flex flex-wrap items-center justify-between rounded-xl border border-border bg-bg p-4 gap-4">
          <div>
            <div className="text-xs text-text-muted">Total Matching Jobs</div>

            <div className="mt-1 text-2xl font-semibold text-text-primary">
              {total}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-success">
            <TrendingUp size={16} />
            Most jobs fall in the
            <span className="font-semibold text-text-primary">80–90%</span>
            range.
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

import {
  Briefcase,
  Percent,
  IndianRupee,
  Trophy,
  TriangleAlert,
  ArrowUpRight,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

function SmallMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-bg px-4 py-3 transition-colors hover:bg-surface-hover">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-surface p-2">
          <Icon size={15} className="text-accent" />
        </div>

        <div>
          <div className="text-xs text-text-muted">{label}</div>

          <div className="mt-1 text-lg font-semibold text-text-primary">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HiringTodayCard({
  jobsAdded = 14,
  averageMatch = 81,
  highestSalary = "48 LPA",
  bestMatch = "NVIDIA",
  missingSkill = "Docker",
}) {
  return (
    <DashboardCard
      title="Daily Hiring Dashboard"
      subtitle="Today's hiring insights"
    >
      <div className="flex flex-col gap-5">
        {/* Hero */}

        <div className="rounded-xl border border-border bg-bg p-5">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">
                Best Opportunity Today
              </div>

              <div className="mt-2 text-4xl font-bold text-text-primary">
                {bestMatch}
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-success">
                <ArrowUpRight size={15} />
                Highest Resume Match
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-text-muted">Highest Salary</div>

              <div className="mt-2 text-3xl font-bold text-accent">
                {highestSalary}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}

        <div className="grid gap-3 md:grid-cols-2">
          <SmallMetric icon={Briefcase} label="Jobs Added" value={jobsAdded} />

          <SmallMetric
            icon={Percent}
            label="Average Match"
            value={`${averageMatch}%`}
          />

          <SmallMetric
            icon={IndianRupee}
            label="Highest Salary"
            value={highestSalary}
          />

          <SmallMetric icon={Trophy} label="Best Match" value={bestMatch} />
        </div>

        {/* AI */}

        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TriangleAlert size={16} className="text-accent" />

                <span className="text-sm font-semibold text-text-primary">
                  Top Missing Skill
                </span>
              </div>

              <div className="mt-3 text-3xl font-bold text-text-primary">
                {missingSkill}
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted">
                Learning this skill is expected to unlock significantly more
                opportunities across today's matching jobs.
              </p>
            </div>

            <button className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              Learn
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
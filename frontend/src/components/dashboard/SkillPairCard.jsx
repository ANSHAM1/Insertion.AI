import { Link2, ArrowUpRight, Star } from "lucide-react";

import DashboardCard from "./DashboardCard";

const DEFAULT_PAIRS = [
  {
    primary: "Python",
    secondary: "SQL",
    score: 96,
  },
  {
    primary: "Docker",
    secondary: "Kubernetes",
    score: 91,
  },
  {
    primary: "React",
    secondary: "TypeScript",
    score: 89,
  },
  {
    primary: "AWS",
    secondary: "Terraform",
    score: 84,
  },
  {
    primary: "Redis",
    secondary: "Kafka",
    score: 80,
  },
];

export default function SkillPairCard({ pairs = DEFAULT_PAIRS }) {
  return (
    <DashboardCard
      title="High Value Skill Pairs"
      subtitle="Skills frequently required together"
    >
      <div className="flex flex-col gap-5">
        {pairs.map((pair) => (
          <div
            key={`${pair.primary}-${pair.secondary}`}
            className="rounded-xl bg-bg p-4 transition-colors hover:bg-surface-hover"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-surface p-2">
                  <Link2 size={16} className="text-accent" />
                </div>

                <div>
                  <div className="flex items-center gap-2 font-semibold text-text-primary">
                    <span>{pair.primary}</span>

                    <ArrowUpRight size={14} className="text-text-muted" />

                    <span>{pair.secondary}</span>
                  </div>

                  <div className="text-xs text-text-muted">
                    Frequently required together
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />

                <span className="font-semibold">{pair.score}</span>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{
                  width: `${pair.score}%`,
                }}
              />
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-border bg-bg p-5">
          <h4 className="mb-2 font-semibold text-text-primary">AI Insight</h4>

          <p className="leading-7 text-text-secondary">
            Companies increasingly hire engineers with complementary skill sets
            instead of isolated technologies. Focus on learning skills in
            pairs—for example{" "}
            <span className="font-semibold text-text-primary">
              Docker + Kubernetes
            </span>{" "}
            or{" "}
            <span className="font-semibold text-text-primary">
              Python + SQL
            </span>{" "}
            —to maximize resume relevance and interview opportunities.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

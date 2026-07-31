import { Brain, ArrowUpRight, Sparkles } from "lucide-react";

import DashboardCard from "./DashboardCard";

const DEFAULT_SKILLS = [
  {
    name: "Docker",
    gain: 76,
  },
  {
    name: "AWS",
    gain: 68,
  },
  {
    name: "Kubernetes",
    gain: 61,
  },
  {
    name: "Redis",
    gain: 54,
  },
  {
    name: "Kafka",
    gain: 41,
  },
];

export default function SkillGapCard({ skills = DEFAULT_SKILLS }) {
  return (
    <DashboardCard
      title="Top Missing Skills"
      subtitle="Highest impact technologies to learn"
    >
      <div className="flex flex-col gap-6">
        {/* Leaderboard */}

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="rounded-xl bg-bg p-4 transition-colors hover:bg-surface-hover"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
                    #{index + 1}
                  </div>

                  <div>
                    <div className="font-semibold text-text-primary">
                      {skill.name}
                    </div>

                    <div className="text-xs text-text-muted">
                      Resume Match Increase
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-lg font-bold text-success">
                  +{skill.gain}%
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{
                    width: `${skill.gain}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}

        <div className="rounded-xl border border-border bg-bg p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />

            <span className="font-semibold text-text-primary">
              AI Recommendation
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-surface p-3">
              <Brain size={24} className="text-accent" />
            </div>

            <div className="flex-1">
              <p className="leading-7 text-text-secondary">
                Learning
                <span className="font-semibold text-text-primary">
                  {" "}
                  Docker
                </span>{" "}
                first provides the highest improvement because it appears in
                most Backend, DevOps, AI, ML and Cloud job descriptions.
                Combining Docker with AWS and Kubernetes significantly increases
                interview opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

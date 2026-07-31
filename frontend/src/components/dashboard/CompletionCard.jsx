import DashboardCard from "./DashboardCard";
import { useApp } from "../../context/AppContext.jsx";

export default function CompletionCard() {
  const { plannerTasks } = useApp();

  const total = plannerTasks.length;
  const completed = plannerTasks.filter((task) => task.completed).length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <DashboardCard title="Today's Progress" subtitle="Task completion">
      <div className="flex flex-col gap-6">
        {/* Progress Ring */}

        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="120" height="120" className="-rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-bg"
              />

              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeLinecap="round"
                className="text-accent transition-all duration-700"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-text-primary">
                {percent}%
              </span>

              <span className="text-xs text-text-muted">Complete</span>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-bg p-4 text-center">
            <div className="text-xs text-text-muted">Completed</div>

            <div className="mt-2 text-2xl font-bold text-success">
              {completed}
            </div>
          </div>

          <div className="rounded-xl bg-bg p-4 text-center">
            <div className="text-xs text-text-muted">Remaining</div>

            <div className="mt-2 text-2xl font-bold text-text-primary">
              {Math.max(total - completed, 0)}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div>
          <div className="mb-2 flex justify-between text-xs text-text-muted">
            <span>Overall Progress</span>

            <span>
              {completed}/{total}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{
                width: `${percent}%`,
              }}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

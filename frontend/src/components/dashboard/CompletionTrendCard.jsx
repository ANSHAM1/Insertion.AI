import DashboardCard from "./DashboardCard";

export default function CompletionTrendCard({ data = [] }) {
  const values = data.map((d) => ({
    ...d,
    percent: d.total === 0 ? 0 : Math.round((d.completed / d.total) * 100),
  }));

  const average =
    values.length === 0
      ? 0
      : Math.round(values.reduce((s, d) => s + d.percent, 0) / values.length);

  return (
    <DashboardCard
      title="30 Day Completion Trend"
      subtitle="Daily completion percentage"
    >
      <div className="flex flex-col gap-5">
        {/* Summary */}

        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-bg p-4">
          <div>
            <div className="text-xs text-text-muted">Average Completion</div>

            <div className="mt-2 text-4xl font-bold text-accent">
              {average}%
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-xs text-text-muted">Best</div>

              <div className="mt-1 font-semibold text-success">
                {Math.max(...values.map((v) => v.percent), 0)}%
              </div>
            </div>

            <div>
              <div className="text-xs text-text-muted">Lowest</div>

              <div className="mt-1 font-semibold text-red-500">
                {values.length ? Math.min(...values.map((v) => v.percent)) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}

        <div className="flex gap-4">
          {/* Y Axis */}

          <div className="flex h-[260px] flex-col justify-between text-xs text-text-muted">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Bars */}

          <div className="flex flex-1">
            <div className="flex h-[260px] w-full items-end gap-1">
              {values.map((day, index) => (
                <div
                  key={index}
                  className="group flex flex-1 items-end"
                  title={`${day.date}
${day.completed}/${day.total}
${day.percent}%`}
                >
                  <div
                    className="w-full rounded-t-md bg-accent transition-all duration-300 group-hover:opacity-80 group-hover:scale-y-105"
                    style={{
                      height: `${Math.max(day.percent, 3)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X Axis */}

        <div className="flex">
          <div className="w-8" />

          <div className="flex flex-1 gap-1">
            {values.map((day, index) => (
              <div
                key={index}
                className="flex-1 text-center text-[10px] text-text-muted"
              >
                {index % 5 === 0 ? day.date.split(" ")[1] : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

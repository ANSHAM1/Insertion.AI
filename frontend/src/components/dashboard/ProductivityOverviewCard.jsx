import { useState } from "react";
import { SectionCard } from "../UI";

export default function ProductivityOverviewCard({ data = [] }) {
  const [hovered, setHovered] = useState(null);

  const values = data.map((d) => ({
    ...d,
    percent:
      d.num_tasks === 0
        ? 0
        : Math.round((d.completed_tasks / d.num_tasks) * 100),
  }));

  const average =
    values.length === 0
      ? 0
      : Math.round(
          values.reduce((sum, day) => sum + day.percent, 0) / values.length,
        );

  const best =
    values.length === 0 ? 0 : Math.max(...values.map((v) => v.percent));

  const lowest =
    values.length === 0 ? 0 : Math.min(...values.map((v) => v.percent));

  return (
    <SectionCard title="Productivity Overview" className="lg:col-span-3">
      <div className="flex flex-col gap-5">
        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-gradient-to-br from-[#17171a] to-[#121214] border border-[#1f1f23] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Average Completion
            </div>
            <div className="mt-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-4xl font-bold text-transparent">
              {average}%
            </div>
          </div>

          <div className="flex gap-8 text-sm">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Best
              </div>
              <div className="mt-1.5 text-lg font-semibold text-emerald-400">
                {best}%
              </div>
            </div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Lowest
              </div>
              <div className="mt-1.5 text-lg font-semibold text-red-400">
                {lowest}%
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex gap-4">
          <div className="flex h-[260px] flex-col justify-between text-xs text-gray-600">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          <div className="relative flex h-[260px] flex-1 items-end gap-1">
            {/* Gridlines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-[#1c1c1f]" />
              ))}
            </div>

            {values.map((day, index) => (
              <div
                key={day.date}
                className="group relative flex h-full flex-1 items-end"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === index && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#2a2a2e] bg-[#1c1c1f] px-3 py-2 text-xs shadow-lg shadow-black/40">
                    <div className="font-semibold text-gray-100">
                      {day.date}
                    </div>
                    <div className="mt-0.5 text-gray-400">
                      {day.completed_tasks}/{day.num_tasks} tasks ·{" "}
                      <span className="font-medium text-orange-400">
                        {day.percent}%
                      </span>
                    </div>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1c1c1f]" />
                  </div>
                )}

                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-300 ease-out group-hover:from-orange-500 group-hover:to-orange-300 group-hover:shadow-[0_0_12px_rgba(251,146,60,0.35)]"
                  style={{
                    height: `${Math.max(day.percent, 3)}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex">
          <div className="w-8" />

          <div className="flex flex-1 gap-1">
            {values.map((day, index) => {
              const crowded = values.length > 20;
              const medium = values.length > 12 && values.length <= 20;

              const showLabel = crowded
                ? true
                : medium
                  ? index % 2 === 0
                  : true;

              return (
                <div
                  key={day.date}
                  className="flex flex-1 justify-center overflow-visible"
                >
                  {showLabel && (
                    <span
                      className={`text-gray-500 transition-colors ${
                        hovered === index ? "text-orange-400" : ""
                      } ${
                        crowded
                          ? "-rotate-90 origin-center whitespace-nowrap text-[9px]"
                          : "text-[10px]"
                      }`}
                    >
                      {day.date}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

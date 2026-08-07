import React, { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { SectionCard } from "../UI";
import { buildLast3MonthsHeatmap, heatColor } from "../../utils/heatmap";

// `dailyData`: array of { date: "YYYY-MM-DD", attempts: number } covering
// the current month plus the 2 previous months.
export default function ActivityHeatmap({ dailyData }) {
  const monthsData = useMemo(
    () => buildLast3MonthsHeatmap(dailyData),
    [dailyData],
  );

  const hasActivity = monthsData.some((m) =>
    m.weeks.some((week) => week.some((day) => day.inMonth)),
  );

  const title = monthsData.length
    ? `${monthsData[0].label} – ${monthsData[monthsData.length - 1].label}`
    : "Last 3 Months";

  return (
    <SectionCard title={title} icon={CalendarDays}>
      {!hasActivity ? (
        <p className="text-sm text-gray-500 py-2">No activity yet.</p>
      ) : null}

      <div className="overflow-x-auto">
        <div className="flex items-start gap-8 w-max">
          {/* Weekday labels, shared across all three month blocks since
              every block has the same fixed 7-row height. */}
          <div className="flex flex-col justify-between text-[10px] text-gray-600 h-[108px] pt-5 shrink-0">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {monthsData.map((month) => (
            <div key={month.key} className="flex flex-col shrink-0">
              <p className="text-[11px] text-gray-500 mb-2 font-medium">
                {month.label}
              </p>
              <div className="flex gap-1">
                {month.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) =>
                      day.inMonth ? (
                        <div
                          key={day.date}
                          title={`${day.date}\n${day.count} submission${
                            day.count === 1 ? "" : "s"
                          }`}
                          className={`w-3 h-3 rounded-sm transition-colors ${heatColor(day.count)}`}
                        />
                      ) : (
                        <div
                          key={`${month.key}-${wi}-${di}`}
                          className="w-3 h-3 rounded-sm bg-transparent"
                        />
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-[11px] text-gray-500">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((c) => (
          <span key={c} className={`w-3 h-3 rounded-sm ${heatColor(c)}`} />
        ))}
        <span>More</span>
      </div>
    </SectionCard>
  );
}

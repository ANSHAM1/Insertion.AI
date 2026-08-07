import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { CalendarDays } from "lucide-react";
import { SectionCard } from "../UI";
import { buildLast3MonthsHeatmap, heatColor } from "../../utils/heatmap";

const WEEKDAY_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
const LABEL_COL_WIDTH = 22; // px, fixed — just enough for "Sun"/"Tue" etc.
const CELL_GAP = 3; // px, fixed — gap between cells within a month
const MIN_CELL = 7; // px
const MAX_CELL = 14; // px

function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

// `dailyData`: array of { date: "YYYY-MM-DD", attempts: number } covering
// the current month plus the 2 previous months.
export default function ActivityHeatmap({ dailyData }) {
  const [hovered, setHovered] = useState(null); // { date, count, x, y }
  const [containerRef, containerWidth] = useContainerWidth();

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

  // Continuously solve for the cell size + month gap that exactly fill the
  // measured container width, instead of jumping between fixed breakpoints.
  const { cellSize, monthGap } = useMemo(() => {
    if (!containerWidth || !monthsData.length) {
      return { cellSize: MAX_CELL, monthGap: 16 };
    }
    const numMonths = monthsData.length;
    const totalWeeks = monthsData.reduce((sum, m) => sum + m.weeks.length, 0);

    // Two-pass: first estimate month gap proportionally, then solve cellSize,
    // then re-derive month gap from the final cellSize so both scale together.
    const provisionalGap = 16;
    const reserved = LABEL_COL_WIDTH + numMonths * provisionalGap;
    const remaining = containerWidth - reserved;
    const rawCell =
      (remaining - (totalWeeks - numMonths) * CELL_GAP) / totalWeeks;

    const cell = Math.min(MAX_CELL, Math.max(MIN_CELL, rawCell));
    const gap = Math.min(16, Math.max(6, cell)); // gap shrinks with cell size

    return { cellSize: cell, monthGap: gap };
  }, [containerWidth, monthsData]);

  function handleEnter(e, day) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHovered({
      date: day.date,
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }

  return (
    <SectionCard title={title} icon={CalendarDays}>
      {!hasActivity ? (
        <p className="text-sm text-text-faint py-2">No activity yet.</p>
      ) : null}

      <div ref={containerRef} className="relative">
        <div className="flex justify-center">
          <div className="flex items-start" style={{ gap: `${monthGap}px` }}>
            <div
              className="flex flex-col text-[10px] text-text-faint pt-6 shrink-0"
              style={{ gap: `${CELL_GAP}px` }}
            >
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex items-center leading-none"
                  style={{ height: `${cellSize}px`, width: LABEL_COL_WIDTH }}
                >
                  {label}
                </div>
              ))}
            </div>

            {monthsData.map((month) => (
              <div key={month.key} className="flex flex-col shrink-0">
                <p className="text-[11px] text-text-muted mb-2 font-medium whitespace-nowrap">
                  {month.label}
                </p>
                <div className="flex" style={{ gap: `${CELL_GAP}px` }}>
                  {month.weeks.map((week, wi) => (
                    <div
                      key={wi}
                      className="flex flex-col"
                      style={{ gap: `${CELL_GAP}px` }}
                    >
                      {week.map((day, di) =>
                        day.inMonth ? (
                          <div
                            key={day.date}
                            onMouseEnter={(e) => handleEnter(e, day)}
                            onMouseLeave={() => setHovered(null)}
                            className={`rounded-sm transition-colors cursor-default ${heatColor(day.count)}`}
                            style={{ width: cellSize, height: cellSize }}
                          />
                        ) : (
                          <div
                            key={`${month.key}-${wi}-${di}`}
                            className="rounded-sm bg-transparent"
                            style={{ width: cellSize, height: cellSize }}
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

        {hovered && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full -mt-2 rounded-md border border-border bg-surface-alt px-2 py-1 text-[11px] whitespace-nowrap shadow-lg"
            style={{ left: hovered.x, top: hovered.y }}
          >
            <span className="text-text-primary font-medium">
              {hovered.count} attempt{hovered.count === 1 ? "" : "s"}
            </span>
            <span className="text-text-faint"> · {hovered.date}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-text-faint">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((c) => (
          <span
            key={c}
            className={`rounded-sm ${heatColor(c)}`}
            style={{
              width: Math.max(MIN_CELL, cellSize),
              height: Math.max(MIN_CELL, cellSize),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </SectionCard>
  );
}

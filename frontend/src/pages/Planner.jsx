import React, { useState } from "react";
import { CheckCircle2, Circle, Loader2, Check } from "lucide-react";

import { SectionCard } from "../components/UI";

import { useApp } from "../context/AppContext";

const START_HOUR = 12;
const HOUR_COUNT = 12;

const HOURS = Array.from({ length: HOUR_COUNT }, (_, i) => {
  const hour = START_HOUR + i;
  return new Date(2000, 0, 1, hour % 24).toLocaleTimeString("en-IN", {
    hour: "numeric",
    hour12: true,
  });
});

const ROW_HEIGHT = 64; // h-16 = 64px
const WINDOW_START = START_HOUR * 60;
const WINDOW_END = (START_HOUR + HOUR_COUNT) * 60;

function parseTime(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getTimeStyle(task) {
  const start = Math.max(parseTime(task.start_time), WINDOW_START);
  const end = Math.min(parseTime(task.end_time), WINDOW_END);
  const startOffset = start - WINDOW_START;

  return {
    top: (startOffset / 60) * ROW_HEIGHT,
    height: Math.max(((end - start) / 60) * ROW_HEIGHT, 22),
  };
}

function layoutDayTasks(items) {
  const withRange = items
    .map((task) => {
      const start = Math.max(parseTime(task.start_time), WINDOW_START);
      const end = Math.max(
        Math.min(parseTime(task.end_time), WINDOW_END),
        start + 1,
      );
      return { task, start, end };
    })
    .sort((a, b) => a.start - b.start);

  const positioned = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  const flushCluster = () => {
    if (cluster.length === 0) return;

    const columns = []; // columns[i] = end time of last item placed in that column
    const colIndexOf = [];

    cluster.forEach((ev) => {
      let placedCol = -1;
      for (let c = 0; c < columns.length; c++) {
        if (ev.start >= columns[c]) {
          placedCol = c;
          break;
        }
      }
      if (placedCol === -1) {
        placedCol = columns.length;
        columns.push(ev.end);
      } else {
        columns[placedCol] = ev.end;
      }
      colIndexOf.push(placedCol);
    });

    const numCols = columns.length;

    cluster.forEach((ev, i) => {
      positioned.push({ ...ev, col: colIndexOf[i], numCols });
    });

    cluster = [];
  };

  withRange.forEach((ev) => {
    if (ev.start >= clusterEnd) {
      flushCluster();
      clusterEnd = ev.end;
    } else {
      clusterEnd = Math.max(clusterEnd, ev.end);
    }
    cluster.push(ev);
  });
  flushCluster();

  return positioned;
}

function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCurrentWeekDates() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Planner() {
  const [saveState, setSaveState] = useState("idle");
  const { planner, reflection, toggleTask, updateReflection, setReflection } =
    useApp();

  const todayString = toLocalDateString(new Date());

  const weekDays = getCurrentWeekDates().map((date) => {
    const dateString = toLocalDateString(date);
    const existing = planner?.find((d) => d.date === dateString);
    return { date: dateString, items: existing?.items ?? [] };
  });

  const tasks = weekDays.find((d) => d.date === todayString)?.items ?? [];

  const weekTitle = `${new Date(weekDays[0].date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} - ${new Date(weekDays[6].date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const handleSaveReflection = async () => {
    setSaveState("saving");
    try {
      await updateReflection(reflection);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Planner</h1>
          <p className="text-gray-500 text-sm mt-1">
            Plan your week and stay on track.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <SectionCard className="lg:col-span-3" title={null}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 font-medium">
                {weekTitle}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[900px]">
              <div />

              {weekDays.map((day) => {
                const date = new Date(day.date);

                return (
                  <div
                    key={day.date}
                    className={`text-center pb-3 ${
                      day.date === todayString
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  >
                    <p className="text-xs">
                      {date.toLocaleDateString("en-IN", {
                        weekday: "short",
                      })}
                    </p>

                    <p
                      className={`text-sm font-semibold w-7 h-7 mx-auto rounded-full flex items-center justify-center mt-1 ${
                        day.date === todayString
                          ? "bg-orange-600 text-white"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}

              <div className="relative">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 text-[11px] text-gray-600 pr-2 border-t border-[#1c1c1f] flex justify-end pt-2"
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {weekDays.map((day) => {
                const positionedTasks = layoutDayTasks(day.items);

                return (
                  <div
                    key={day.date}
                    className="relative border-l border-[#1c1c1f]"
                    style={{
                      height: ROW_HEIGHT * HOUR_COUNT,
                    }}
                  >
                    {HOURS.map((_, i) => (
                      <div key={i} className="h-16 border-t border-[#1c1c1f]" />
                    ))}

                    {positionedTasks.map(({ task, col, numCols }) => {
                      const { top, height } = getTimeStyle(task);
                      const gap = 4; // px gap between side-by-side columns
                      const colWidthPct = 100 / numCols;
                      const tooltipBelow = top < 50; // not enough room above near the top row

                      return (
                        <div
                          key={task.id}
                          className={`group absolute rounded-lg border px-2 py-1 cursor-default transition-colors ${
                            task.completed
                              ? "bg-emerald-400/15 border-emerald-400/10 text-emerald-300"
                              : "bg-orange-600/15 border-orange-600/40 text-orange-300 hover:bg-orange-600/25"
                          }`}
                          style={{
                            top: `${top + 3}px`,
                            height: `${height - 6}px`,
                            left: `calc(${col * colWidthPct}% + ${
                              col === 0 ? 6 : gap / 2
                            }px)`,
                            width: `calc(${colWidthPct}% - ${
                              numCols === 1
                                ? 12
                                : col === 0 || col === numCols - 1
                                  ? 6 + gap / 2
                                  : gap
                            }px)`,
                          }}
                        >
                          <p className="font-medium text-[11px] leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                            {task.title}
                          </p>

                          {task.note && (
                            <div
                              className={`pointer-events-none absolute z-20 hidden group-hover:block left-1/2 -translate-x-1/2 w-max max-w-[220px] ${
                                tooltipBelow
                                  ? "top-full translate-y-1"
                                  : "-top-1 -translate-y-full"
                              }`}
                            >
                              {tooltipBelow ? (
                                <>
                                  <div className="w-2 h-2 bg-[#141416] border-l border-t border-[#232326] rotate-45 mx-auto -mb-1" />
                                  <div className="bg-[#141416] border border-[#232326] text-gray-200 text-[11px] leading-snug rounded-lg px-2.5 py-1.5 shadow-xl">
                                    <span className="block font-medium text-orange-400 mb-0.5">
                                      {task.title}
                                    </span>
                                    {task.note}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="bg-[#141416] border border-[#232326] text-gray-200 text-[11px] leading-snug rounded-lg px-2.5 py-1.5 shadow-xl">
                                    <span className="block font-medium text-orange-400 mb-0.5">
                                      {task.title}
                                    </span>
                                    {task.note}
                                  </div>
                                  <div className="w-2 h-2 bg-[#141416] border-r border-b border-[#232326] rotate-45 mx-auto -mt-1" />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Today's Plan">
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tasks scheduled for today.
                </p>
              ) : (
                tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTask(t.id, !t.completed)}
                    className="w-full flex items-start gap-3 text-left"
                  >
                    {t.completed ? (
                      <CheckCircle2
                        size={17}
                        className="text-orange-500 shrink-0 mt-0.5"
                      />
                    ) : (
                      <Circle
                        size={17}
                        className="text-gray-600 shrink-0 mt-0.5"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          t.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-200"
                        }`}
                      >
                        {t.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 shrink-0">
                      {`${t.start_time} - ${t.end_time}`}
                    </span>
                  </button>
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard title="Notes">
            <textarea
              className="w-full bg-[#1a1a1c] border border-[#232326] rounded-xl p-3 text-sm text-gray-300 outline-none resize-none h-28"
              value={reflection ?? ""}
              onChange={(e) => {
                setReflection(e.target.value);
                setSaveState("idle");
              }}
            />
            <div className="flex items-center justify-end gap-3 mt-3">
              {saveState === "saved" && (
                <span className="flex items-center gap-1 text-xs text-emerald-500">
                  <Check size={13} /> Saved
                </span>
              )}
              {saveState === "error" && (
                <span className="text-xs text-red-500">Failed to save</span>
              )}
              <button
                onClick={handleSaveReflection}
                disabled={saveState === "saving"}
                className="flex items-center gap-1.5 bg-[#1a1a1c] hover:bg-[#212124] border border-[#232326] text-gray-200 text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveState === "saving" && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {saveState === "saving" ? "Saving..." : "Save"}
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

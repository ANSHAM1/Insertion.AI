import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

import { SectionCard } from "../components/UI";

import { useApp } from "../context/AppContext";

const colorMap = {
  orange: "bg-orange-600/20 border-orange-600/40 text-orange-400",
  blue: "bg-blue-600/20 border-blue-600/40 text-blue-400",
  green: "bg-emerald-600/20 border-emerald-600/40 text-emerald-400",
  purple: "bg-purple-600/20 border-purple-600/40 text-purple-400",
  red: "bg-red-600/20 border-red-600/40 text-red-400",
  yellow: "bg-yellow-600/20 border-yellow-600/40 text-yellow-400",
  pink: "bg-pink-600/20 border-pink-600/40 text-pink-400",
  teal: "bg-teal-600/20 border-teal-600/40 text-teal-400",
  indigo: "bg-indigo-600/20 border-indigo-600/40 text-indigo-400",
  cyan: "bg-cyan-600/20 border-cyan-600/40 text-cyan-400",
  amber: "bg-amber-600/20 border-amber-600/40 text-amber-400",
};

const COLOR_KEYS = Object.keys(colorMap).filter((k) => k !== "green");

function getTaskColorClass(task) {
  if (task.completed) return colorMap.green;
  if (task.color && colorMap[task.color]) return colorMap[task.color];

  const key = String(task.id ?? task.title ?? "");
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return colorMap[COLOR_KEYS[hash % COLOR_KEYS.length]];
}

const START_HOUR = 0;
const HOURS = Array.from({ length: 24 }, (_, i) => {
  return new Date(2000, 0, 1, i).toLocaleTimeString("en-IN", {
    hour: "numeric",
    hour12: true,
  });
});

const ROW_HEIGHT = 64; // h-16 = 64px

function parseTime(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getEventStyle(startTime, endTime) {
  const start = Math.max(parseTime(startTime), START_HOUR * 60);
  const end = Math.min(parseTime(endTime), (START_HOUR + HOURS.length) * 60);
  const startOffset = start - START_HOUR * 60;

  return {
    top: `${(startOffset / 60) * ROW_HEIGHT}px`,
    height: `${Math.max(((end - start) / 60) * ROW_HEIGHT, 24)}px`,
  };
}

// Local (not UTC) date string, so it matches the backend's date keying
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
  const [saved, setSaved] = useState(true);
  const { planner, reflection, toggleTask, updateReflection, setReflection } =
    useApp();

  const todayString = toLocalDateString(new Date());

  // Always render the full current week, even if the API only returned
  // days that have tasks
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

              {weekDays.map((day) => (
                <div
                  key={day.date}
                  className="relative border-l border-[#1c1c1f]"
                  style={{
                    height: ROW_HEIGHT * HOURS.length,
                  }}
                >
                  {HOURS.map((_, i) => (
                    <div key={i} className="h-16 border-t border-[#1c1c1f]" />
                  ))}

                  {day.items.map((task) => (
                    <div
                      key={task.id}
                      className={`absolute left-1 right-1 rounded-lg border px-2 py-1 overflow-hidden ${getTaskColorClass(
                        task,
                      )}`}
                      style={{
                        ...getEventStyle(task.start_time, task.end_time),
                        minHeight: 24,
                      }}
                    >
                      <p className="font-medium text-[11px] leading-tight line-clamp-2">
                        {task.title}
                      </p>

                      <p className="text-[10px] opacity-70 mt-1">
                        {task.start_time} - {task.end_time}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
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
                    className="w-full flex items-center gap-3 text-left"
                  >
                    {t.completed ? (
                      <CheckCircle2
                        size={17}
                        className="text-orange-500 shrink-0"
                      />
                    ) : (
                      <Circle size={17} className="text-gray-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
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
                setSaved(false);
              }}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={async () => {
                  try {
                    await updateReflection(reflection);
                    setSaved(true);
                  } catch {
                    setSaved(false);
                  }
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white text-sm px-4 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
            {saved && <p className="text-xs text-emerald-500 mt-2">Saved</p>}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
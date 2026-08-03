import React, { useState, useEffect } from "react";

import {
  ClipboardList,
  Code2,
  Briefcase,
  Building2,
  Clock,
  CalendarDays,
  BellRing,
  Sparkles,
  ListChecks,
  CheckCircle2,
  Circle,
  Plus,
  PlayCircle,
  Search as SearchIcon,
  ArrowRight,
} from "lucide-react";

import {
  todaysTasks,
  productivityData,
  upcoming,
  aiSuggestions,
  recentActivity,
  user,
} from "../data/mockData";

import { SectionCard } from "../components/UI";

const iconMap = { ClipboardList, Code2, Briefcase, Building2, Clock };

function StatCard({ label, value, unit, sub, icon, ring }) {
  const Icon = iconMap[icon];

  return (
    <div className="card card-hover p-4 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
          <span className="w-7 h-7 rounded-lg bg-orange-600/15 flex items-center justify-center">
            <Icon size={14} className="text-orange-500" />
          </span>
          {label}
        </div>
        <p className="text-2xl font-bold text-white">
          {value}{" "}
          {unit && (
            <span className="text-sm font-normal text-gray-500">{unit}</span>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      </div>
      {ring && (
        <div className="relative w-9 h-9">
          <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#232326"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#ff6a1a"
              strokeWidth="3"
              strokeDasharray={`${(ring / 100) * 97.4} 97.4`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-semibold">
            {ring}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(todaysTasks);
  const [datetime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Tasks Today",
      value: "12",
      sub: "5 completed",
      icon: "ClipboardList",
      ring: 42,
    },
    {
      label: "Coding Streak",
      value: "23",
      unit: "days",
      sub: "Keep it up! 🔥",
      icon: "Code2",
    },
    {
      label: "Jobs Applied",
      value: "18",
      sub: "This Month",
      icon: "Briefcase",
    },
    {
      label: "Drives Registered",
      value: "07",
      sub: "Upcoming",
      icon: "Building2",
    },
    { label: "Focus Time", value: "04h 32m", sub: "Today", icon: "Clock" },
  ];

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const maxVal = Math.max(...productivityData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good Morning, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your productivity today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#141416] border border-[#232326] text-gray-300 text-sm px-4 py-2.5 rounded-xl tabular-nums">
          <CalendarDays size={15} className="text-orange-500" />
          {datetime.toLocaleString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Today's tasks */}
        <SectionCard
          title="Today's Tasks"
          icon={ListChecks}
          action={
            <button className="text-xs text-orange-500 hover:underline">
              View all
            </button>
          }
        >
          <div className="space-y-3">
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="w-full flex items-start gap-3 text-left group"
              >
                {t.done ? (
                  <CheckCircle2
                    size={18}
                    className="text-orange-500 mt-0.5 shrink-0"
                  />
                ) : (
                  <Circle
                    size={18}
                    className="text-gray-600 mt-0.5 shrink-0 group-hover:text-gray-400"
                  />
                )}
                <div>
                  <p
                    className={`text-sm ${t.done ? "text-gray-500 line-through" : "text-gray-200"}`}
                  >
                    {t.title}
                  </p>
                  <p className="text-xs text-gray-600">{t.time}</p>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Productivity chart */}
        <SectionCard
          title="Productivity Overview"
          className="lg:col-span-2"
          action={
            <select className="bg-[#1a1a1c] border border-[#232326] text-xs text-gray-400 rounded-lg px-2 py-1">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          }
        >
          <div className="flex items-end justify-between gap-3 h-52 px-2">
            {productivityData.map((d) => (
              <div
                key={d.day}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="w-full flex items-end justify-center h-40">
                  <div
                    className="w-6 rounded-t-md accent-gradient"
                    style={{ height: `${(d.value / maxVal) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Upcoming */}
        <SectionCard title="Upcoming" icon={BellRing}>
          <div className="space-y-4">
            {upcoming.map((u) => (
              <div key={u.id} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-200">{u.title}</p>
                  <p className="text-xs text-gray-600">{u.time}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Recent activity + quick actions */}
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Recent Activity">
            <div className="space-y-4">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">{a.text}</p>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-3">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Quick Actions">
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
                <Plus size={15} /> New Task
              </button>
              <button className="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#232326] border border-[#232326] text-gray-200 text-sm px-4 py-2.5 rounded-xl transition-colors">
                <PlayCircle size={15} /> Start Coding
              </button>
              <button className="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#232326] border border-[#232326] text-gray-200 text-sm px-4 py-2.5 rounded-xl transition-colors">
                <SearchIcon size={15} /> Find Jobs
              </button>
              <button className="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#232326] border border-[#232326] text-gray-200 text-sm px-4 py-2.5 rounded-xl transition-colors">
                <CalendarDays size={15} /> View Calendar
              </button>
            </div>
          </SectionCard>
        </div>

        {/* AI suggestions */}
        <SectionCard
          title="AI Suggestions"
          icon={Sparkles}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            {aiSuggestions.map((s) => (
              <div
                key={s.id}
                className="flex items-start gap-3 bg-[#1a1a1c] border border-[#232326] rounded-xl p-3"
              >
                <Sparkles
                  size={15}
                  className="text-orange-500 mt-0.5 shrink-0"
                />
                <p className="text-sm text-gray-300">{s.text}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-1 border border-orange-600/40 text-orange-500 hover:bg-orange-600/10 text-sm py-2.5 rounded-xl transition-colors">
            View All Insights <ArrowRight size={14} />
          </button>
        </SectionCard>
      </div>
    </div>
  );
}

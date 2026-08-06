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
  Flame,
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

import ProductivityOverviewCard from "../components/dashboard/ProductivityOverviewCard";
import ArticleStatisticsCard from "../components/dashboard/ArticleStatisticsCard";
import StatCard from "../components/dashboard/StatCard";

import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const {
    planner,

    article,
    articleLoading,
    updateArticleStatus,

    jobs,

    dashboardData,
    dashboardLoading,
  } = useApp();

  const [tasks, setTasks] = useState(todaysTasks);
  const [datetime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function toLocalDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  }

  const todayString = toLocalDateString(new Date());

  const tasksToday = planner?.find((d) => d.date === todayString)?.items ?? [];
  const completedToday = tasksToday.filter((task) => task.completed).length;

  const stats = [
    {
      label: "Tasks Today",
      value: tasksToday.length,
      sub: `${completedToday} of ${tasksToday.length} completed`,
      icon: ClipboardList,
      ring:
        tasksToday.length === 0
          ? 0
          : Math.round((completedToday * 100) / tasksToday.length),
    },
    {
      label: "Task Streak",
      value: dashboardData?.schedule_streaks?.current_streak ?? 0,
      sub: `Best: ${dashboardData?.schedule_streaks?.best_streak ?? 0} days`,
      icon: Flame,
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
  ];

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const maxVal = Math.max(...productivityData.map((d) => d.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good Morning, {"Ansham Maurya".split(" ")[0]}!
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Today's Article */}
        <ArticleStatisticsCard
          article={article}
          articleLoading={articleLoading}
          updateArticleStatus={updateArticleStatus}
          reading_overview={dashboardData?.reading_overview ?? {}}
          top_reading_sources={dashboardData?.top_reading_sources ?? []}
        />

        {/* Productivity chart */}
        <ProductivityOverviewCard
          data={dashboardData?.last_thirty_days_progress ?? []}
        />
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

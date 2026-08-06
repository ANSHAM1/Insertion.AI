import React, { useState, useEffect } from "react";

import {
  ClipboardList,
  Code2,
  Briefcase,
  Building2,
  Clock,
  CalendarDays,
  ListChecks,
  CheckCircle2,
  PlayCircle,
  Flame,
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

const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

const DIFFICULTY_DOT = {
  easy: "bg-emerald-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
};

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

  // --- Data for the two lower sections (Coding Performance / Job Applications) ---
  const codingOverview = dashboardData?.coding_overview_last_30_days;
  const codingStreak = dashboardData?.coding_streak;
  const jobMatchDistribution = dashboardData?.job_match_distribution ?? [];
  const jobMatchByResume = dashboardData?.job_match_quality_by_resume ?? [];

  const maxJobsInBucket = Math.max(
    1,
    ...jobMatchDistribution.map((b) => b.num_jobs),
  );

  const hasDifficultyData =
    codingOverview?.difficulty &&
    Object.keys(codingOverview.difficulty).length > 0;

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
        <ArticleStatisticsCard
          article={article}
          articleLoading={articleLoading}
          updateArticleStatus={updateArticleStatus}
          reading_overview={dashboardData?.reading_overview ?? {}}
          top_reading_sources={dashboardData?.top_reading_sources ?? []}
        />

        <ProductivityOverviewCard
          data={dashboardData?.last_thirty_days_progress ?? []}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <SectionCard
          title="Coding Performance"
          icon={Code2}
          className="lg:col-span-2"
        >
          <div className="space-y-5">
            {/* Streak row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-[#0d0d0f] border border-[#232326] rounded-lg px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Flame size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white leading-none">
                    {codingStreak?.current_streak ?? 0}
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      days
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current Streak</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0d0d0f] border border-[#232326] rounded-lg px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white leading-none">
                    {codingStreak?.best_streak ?? 0}
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      days
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Best Streak</p>
                </div>
              </div>
            </div>

            {/* Overall last-30-days stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-[#0d0d0f] border border-[#232326] rounded-lg py-3">
                <p className="text-base font-semibold text-white">
                  {codingOverview?.overall?.unique_attempts ?? 0}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <PlayCircle size={11} /> Attempts
                </p>
              </div>
              <div className="text-center bg-[#0d0d0f] border border-[#232326] rounded-lg py-3">
                <p className="text-base font-semibold text-white">
                  {codingOverview?.overall?.avg_score ?? 0}%
                </p>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <ListChecks size={11} /> Avg Score
                </p>
              </div>
              <div className="text-center bg-[#0d0d0f] border border-[#232326] rounded-lg py-3">
                <p className="text-base font-semibold text-white">
                  {codingOverview?.overall?.avg_time_taken_minutes ?? 0}m
                </p>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <Clock size={11} /> Avg Time
                </p>
              </div>
            </div>

            {/* Difficulty breakdown */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Last 30 Days by Difficulty
              </p>

              {hasDifficultyData ? (
                DIFFICULTY_ORDER.filter(
                  (level) => codingOverview.difficulty[level],
                ).map((level) => {
                  const d = codingOverview.difficulty[level];
                  return (
                    <div
                      key={level}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-[#232326] bg-[#0d0d0f] hover:border-orange-500/40 hover:bg-[#18181b] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${DIFFICULTY_DOT[level]}`}
                        />
                        <span className="text-sm text-gray-300 capitalize">
                          {level}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{d.unique_attempts} solved</span>
                        <span>{d.avg_score}% score</span>
                        <span>{d.avg_time_taken_minutes}m avg</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-600 italic px-1">
                  No coding activity in the last 30 days.
                </p>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Job Applications"
          icon={Briefcase}
          className="lg:col-span-2"
        >
          <div className="space-y-5">
            {/* Match quality by resume */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Match Quality by Resume
              </p>

              {jobMatchByResume.length === 0 ? (
                <p className="text-xs text-gray-600 italic px-1">
                  No resume match data yet.
                </p>
              ) : (
                jobMatchByResume.map((r) => (
                  <div
                    key={r.resume}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-[#232326] bg-[#0d0d0f] hover:border-orange-500/40 hover:bg-[#18181b] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 size={13} className="text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-300 truncate">
                        {r.resume}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500">
                        {r.total_jobs} jobs
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-[#232326] overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${Math.min(100, r.avg_match_percentage)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-white w-10 text-right">
                        {r.avg_match_percentage}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Match distribution buckets */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Match Distribution
              </p>

              {jobMatchDistribution.length === 0 ? (
                <p className="text-xs text-gray-600 italic px-1">
                  No job match data yet.
                </p>
              ) : (
                jobMatchDistribution.map((b) => (
                  <div
                    key={b.bucket}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0d0d0f] transition-colors"
                  >
                    <span className="text-xs text-gray-500 w-16 shrink-0">
                      Group {b.bucket}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#232326] overflow-hidden">
                      <div
                        className="h-full bg-orange-500/80 rounded-full"
                        style={{
                          width: `${(b.num_jobs / maxJobsInBucket) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-24 text-right shrink-0">
                      {b.min_match_percentage}%–{b.max_match_percentage}%
                    </span>
                    <span className="text-xs text-white w-16 text-right shrink-0">
                      {b.num_jobs} jobs
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
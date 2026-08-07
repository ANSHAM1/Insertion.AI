import React, { useState, useEffect, useMemo } from "react";

import { ClipboardList, Briefcase, CalendarDays, Flame } from "lucide-react";

import { SectionCard } from "../components/UI";

import ProductivityOverviewCard from "../components/dashboard/ProductivityOverviewCard";
import ArticleStatisticsCard from "../components/dashboard/ArticleStatisticsCard";
import StatCard from "../components/dashboard/StatCard";
import CodingPerformanceCard from "../components/dashboard/CodingPerformanceCard";
import JobApplicationsCard from "../components/dashboard/JobApplicationsCard";
import DailyQuestionCard from "../components/dashboard/DailyQuestionCard";

import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const {
    planner,

    article,
    articleLoading,
    updateArticleStatus,

    jobs,
    codingQuestions,

    dashboardData
  } = useApp();

  const [datetime, setDateTime] = useState(new Date());

  const [jobApplied, setJobApplied] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentMonth = new Date().getMonth();

  useEffect(() => {
    if (!Array.isArray(jobs)) return;

    const len = jobs.filter((job) => {
      if (job.status !== "APPLIED") return false;

      const statusDate = new Date(job.status_date);

      return statusDate.getMonth() === currentMonth;
    }).length;

    setJobApplied(len);
  }, [jobs]);

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
      label: "Jobs Applied",
      value: jobApplied,
      sub: `applications this month`,
      icon: Briefcase,
    },
  ];

  const codingOverview = dashboardData?.coding_overview_last_30_days;
  const codingStreak = dashboardData?.coding_streak;
  const jobMatchDistribution = dashboardData?.job_match_distribution ?? [];
  const jobMatchByResume = dashboardData?.job_match_quality_by_resume ?? [];

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
        <DailyQuestionCard codingQuestions={codingQuestions} />
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
        <CodingPerformanceCard
          codingOverview={codingOverview}
          codingStreak={codingStreak}
        />

        <JobApplicationsCard
          jobMatchByResume={jobMatchByResume}
          jobMatchDistribution={jobMatchDistribution}
        />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

import Header from "../components/Header";

import CompletionCard from "../components/dashboard/CompletionCard";
import CompletionTrendCard from "../components/dashboard/CompletionTrendCard";
import TimeLostCard from "../components/dashboard/TimeLostCard";
import WeeklyConsistencyCard from "../components/dashboard/WeeklyConsistencyCard";
import HiringTodayCard from "../components/dashboard/HiringTodayCard";
import SkillPairCard from "../components/dashboard/SkillPairCard";
import SkillGapCard from "../components/dashboard/SkillGapCard";
import ResumeDistributionCard from "../components/dashboard/ResumeDistributionCard";
import ReadingArticleCard from "../components/dashboard/ReadingArticleCard";

import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { refreshAll, plannerLoading, lastRefresh, dashboardData, dashboardLoading, dashboardLoaded } = useApp();

  async function handleRefresh() {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await refreshAll();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Header searchValue={search} onSearchChange={setSearch} />

        <button
          onClick={handleRefresh}
          title={
            lastRefresh
              ? `Last updated ${lastRefresh.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Never refreshed"
          }
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-text-primary"
        >
          <RefreshCw
            size={15}
            className={refreshing || plannerLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Dashboard grid — fixed 12-column layout so cards never drift
          out of alignment, with graceful stacking on small screens. */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-6 lg:grid-cols-12">
        {/* Row 1 — top KPIs */}

        <div className="sm:col-span-3 lg:col-span-3">
          <CompletionCard />
        </div>

        <div className="sm:col-span-6 lg:col-span-6">
          <HiringTodayCard
            jobsAdded={14}
            averageMatch={81}
            highestSalary="48 LPA"
            bestMatch="NVIDIA"
            missingSkill="Docker"
          />
        </div>

        <div className="sm:col-span-3 lg:col-span-3">
          <TimeLostCard plannedHours={7} workedHours={5} />
        </div>

        {/* Row 2 — trend, full width */}

        <div className="sm:col-span-6 lg:col-span-12">
          <CompletionTrendCard data={dashboardData?.last_thirty_days_progress ?? []} />
        </div>

        {/* Row 3 — consistency, resume distribution, reading */}

        <div className="sm:col-span-6 lg:col-span-4">
          <WeeklyConsistencyCard />
        </div>

        <div className="sm:col-span-3 lg:col-span-5">
          <ResumeDistributionCard />
        </div>

        <div className="sm:col-span-3 lg:col-span-3">
          <ReadingArticleCard />
        </div>

        {/* Row 4 — skill insights */}

        <div className="sm:col-span-6 lg:col-span-7">
          <SkillGapCard />
        </div>

        <div className="sm:col-span-6 lg:col-span-5">
          <SkillPairCard />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
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

import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { refreshAll, plannerLoading, lastRefresh } = useApp();

  async function handleRefresh() {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await refreshAll();
    } finally {
      setRefreshing(false);
    }
  }

  const trend = [
    { date: "Jul 1", completed: 5, total: 7 },
    { date: "Jul 2", completed: 6, total: 7 },
    { date: "Jul 3", completed: 4, total: 7 },
    { date: "Jul 4", completed: 7, total: 7 },
    { date: "Jul 5", completed: 3, total: 7 },
    { date: "Jul 6", completed: 6, total: 7 },
    { date: "Jul 7", completed: 5, total: 7 },
    { date: "Jul 8", completed: 7, total: 7 },
    { date: "Jul 9", completed: 6, total: 7 },
    { date: "Jul 10", completed: 4, total: 7 },
    { date: "Jul 11", completed: 2, total: 7 },
    { date: "Jul 12", completed: 7, total: 7 },
    { date: "Jul 13", completed: 5, total: 7 },
    { date: "Jul 14", completed: 6, total: 7 },
    { date: "Jul 15", completed: 7, total: 7 },
  ];

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
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <RefreshCw
            size={15}
            className={refreshing || plannerLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Dashboard */}

      <div className="flex flex-wrap gap-5">
        {/* Top */}

        <div className="min-w-[260px] flex-1">
          <CompletionCard completed={5} total={7} />
        </div>

        <div className="min-w-[620px] flex-[3]">
          <HiringTodayCard
            jobsAdded={14}
            averageMatch={81}
            highestSalary="48 LPA"
            bestMatch="NVIDIA"
            missingSkill="Docker"
          />
        </div>

        <div className="min-w-[260px] flex-1">
          <TimeLostCard plannedHours={7} workedHours={5} />
        </div>

        {/* Trend */}

        <div className="basis-full">
          <CompletionTrendCard data={trend} />
        </div>

        {/* Middle */}

        <div className="min-w-[340px] flex-[1.2]">
          <WeeklyConsistencyCard />
        </div>

        <div className="min-w-[620px] flex-[2.2]">
          <ResumeDistributionCard />
        </div>

        {/* Bottom */}

        <div className="min-w-[520px] flex-[2]">
          <SkillGapCard />
        </div>

        <div className="min-w-[420px] flex-1">
          <SkillPairCard />
        </div>
      </div>
    </div>
  );
}

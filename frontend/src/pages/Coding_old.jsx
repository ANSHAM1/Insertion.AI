import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Trophy,
  Target,
  Timer,
  Play,
  Sparkles,
  Loader2,
  BarChart3,
  Code2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SectionCard } from "../components/UI";

import { useApp } from "../context/AppContext";

// TODO: replace with real solved/total data source later
const MOCK_DIFFICULTY_STATS = {
  Easy: { solved: 18, total: 25 },
  Medium: { solved: 11, total: 30 },
  Hard: { solved: 3, total: 15 },
};

const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"];

const DIFFICULTY_COLOR = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

const DIFFICULTY_ROW_STYLE = {
  Easy: {
    border: "border-l-2 border-l-emerald-500/70",
    bg: "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]",
    dot: "bg-emerald-500",
  },
  Medium: {
    border: "border-l-2 border-l-amber-500/70",
    bg: "bg-amber-500/[0.04] hover:bg-amber-500/[0.07]",
    dot: "bg-amber-500",
  },
  Hard: {
    border: "border-l-2 border-l-red-500/70",
    bg: "bg-red-500/[0.04] hover:bg-red-500/[0.07]",
    dot: "bg-red-500",
  },
};

function difficultyStyle(level) {
  const key = ["Easy", "Medium", "Hard"].find(
    (d) => d.toLowerCase() === String(level || "").toLowerCase(),
  );
  return (
    DIFFICULTY_ROW_STYLE[key] || {
      border: "border-l-2 border-l-[#2a2a2e]",
      bg: "",
      dot: "bg-gray-500",
    }
  );
}

// Builds 3 independent, correctly-bounded calendar grids: the current
// month plus the 2 previous months (matches the "curr + 2 prev" data the
// backend sends). Each month grid is padded to a fixed 6 weeks so the
// three heatmaps line up evenly regardless of how many weeks a given
// month actually spans.
function buildLast3MonthsHeatmap(dailyData) {
  const lookup = new Map((dailyData ?? []).map((d) => [d.date, d.attempts]));
  const today = new Date();
  const months = [];

  for (let offset = 2; offset >= 0; offset--) {
    const monthDate = new Date(
      today.getFullYear(),
      today.getMonth() - offset,
      1,
    );
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - firstDay.getDay());

    const gridEnd = new Date(lastDay);
    gridEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const weeks = [];
    let cursor = new Date(gridStart);

    while (cursor <= gridEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const key = cursor.toISOString().slice(0, 10);
        const inMonth = cursor.getMonth() === month;
        week.push({ date: key, count: lookup.get(key) ?? 0, inMonth });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    // Pad to a fixed 6 weeks so every month block has the same width,
    // keeping the three heatmaps aligned regardless of week count.
    let padIndex = 0;
    while (weeks.length < 6) {
      weeks.push(
        Array.from({ length: 7 }, () => ({
          date: `pad-${year}-${month}-${padIndex++}`,
          count: 0,
          inMonth: false,
        })),
      );
    }

    months.push({
      key: `${year}-${month}`,
      label: firstDay.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      weeks,
    });
  }

  return months;
}

function heatColor(count) {
  if (!count) return "bg-[#1a1a1c]";
  if (count === 1) return "bg-orange-900/50";
  if (count === 2) return "bg-orange-700/60";
  if (count === 3) return "bg-orange-600/80";
  return "bg-orange-500";
}

/* ------------------------------------------------------------------ */

function StatBox({ icon: Icon, value, label }) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <Icon size={16} className="text-orange-500" />
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

// Current streak + best streak combined into a single stat component.
function StreakBox({ current, best }) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <Flame size={16} className="text-orange-500" />
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xl font-bold text-white">{current} days</p>
          <p className="text-xs text-gray-500">Current Streak</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-orange-500" />
          <div>
            <p className="text-xl font-bold text-white">{best} days</p>
            <p className="text-xs text-gray-500">Highest Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeLimit(seconds) {
  if (seconds === undefined || seconds === null) return null;
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `${mins} min` : `${seconds}s`;
}

function MetricRow({ label, displayValue, value, max, colorClass, dotClass }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          {dotClass && <span className={`w-2 h-2 rounded-full ${dotClass}`} />}
          {label}
        </span>
        <span className="text-xs text-gray-500">{displayValue}</span>
      </div>
      <div className="w-full h-1.5 bg-[#232326] rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Fixed-size grid for language stats: always reserves 10 slots (the max
// number of supported languages) so adding new languages down the line
// can never change this component's footprint or push on neighboring UI.
const MAX_LANGUAGE_SLOTS = 10;

function LanguageStatsGrid({ data }) {
  const cells = Array.from(
    { length: MAX_LANGUAGE_SLOTS },
    (_, i) => data[i] || null,
  );

  return (
    <div className="grid grid-cols-2 gap-2 h-[236px] content-start">
      {cells.map((l, i) =>
        l ? (
          <div
            key={l.language}
            className="flex items-center justify-between bg-[#1a1a1c] border border-[#232326] rounded-lg px-3 py-2"
          >
            <span className="text-xs text-gray-400 truncate">{l.language}</span>
            <span className="text-sm font-semibold text-orange-500 shrink-0 ml-2">
              {l.count}
            </span>
          </div>
        ) : (
          <div key={`empty-${i}`} />
        ),
      )}
    </div>
  );
}

const MAX_KEYWORDS = 5;
const PAGE_SIZE = 10;

export default function Coding() {
  const {
    codingQuestions,
    codingLoading,
    generateCodingQuestions,
    dashboardData,
  } = useApp();
  const navigate = useNavigate();
  const [promptInput, setPromptInput] = useState("");
  const [page, setPage] = useState(1);

  const questions = useMemo(() => {
    return (codingQuestions || []).flatMap((group) =>
      (group.questions || []).map((q) => ({
        ...q,
        generated_date: group.generated_date,
      })),
    );
  }, [codingQuestions]);

  // ---- real data ----
  const codingStreak = dashboardData?.coding_streak || {
    current_streak: 0,
    best_streak: 0,
  };

  // Backend now sends the average-failed-attempts figure as a percentage
  // directly, so we use it as-is instead of recomputing a relative max.
  const avgFailedAttempts = useMemo(() => {
    const rows = dashboardData?.average_failed_attempts_by_difficulty || [];
    return DIFFICULTY_ORDER.map((level) => {
      const match = rows.find(
        (d) => String(d.difficulty).toLowerCase() === level.toLowerCase(),
      );
      return { label: level, value: match ? match.avg_failing_attempts : 0 };
    });
  }, [dashboardData]);

  const languageDistribution = (
    dashboardData?.coding_language_distribution ?? []
  ).map((l) => ({
    ...l,
    language: String(l.language).replace("ProgrammingLanguage.", ""),
  }));

  const topScoringSolutions = dashboardData?.top_scoring_solutions || [];

  const monthsData = useMemo(
    () =>
      buildLast3MonthsHeatmap(
        dashboardData?.coding_daily_attempts_last_3_months,
      ),
    [dashboardData],
  );

  const heatmapHasActivity = monthsData.some((m) =>
    m.weeks.some((week) => week.some((day) => day.inMonth)),
  );

  const totalSolved = Object.values(MOCK_DIFFICULTY_STATS).reduce(
    (a, d) => a + d.solved,
    0,
  );
  const totalProblems = Object.values(MOCK_DIFFICULTY_STATS).reduce(
    (a, d) => a + d.total,
    0,
  );

  const keywordCount = promptInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  const handlePromptKeyDown = (e) => {
    if (e.key === "," && keywordCount >= MAX_KEYWORDS) {
      e.preventDefault();
    }
  };

  const handleGenerate = () => {
    if (codingLoading) return;
    setPage(1);
    generateCodingQuestions(promptInput.trim());
  };

  // ---- pagination ----
  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageQuestions = questions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    const span = 5;
    let start = Math.max(1, safePage - Math.floor(span / 2));
    let end = Math.min(totalPages, start + span - 1);
    start = Math.max(1, end - span + 1);
    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [safePage, totalPages]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Coding Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sharpen your skills, one problem at a time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              maxLength={120}
              placeholder="Keywords, e.g. dp, graphs"
              className="bg-[#1a1a1c] border border-[#232326] focus:border-[#3a3a3e] text-sm text-gray-200 placeholder-gray-600 rounded-lg pl-3 pr-12 py-2 outline-none w-56 sm:w-64 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-600">
              {keywordCount}/{MAX_KEYWORDS}
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={codingLoading}
            className="flex items-center gap-1.5 bg-[#1a1a1c] hover:bg-[#212124] border border-[#232326] text-gray-200 text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {codingLoading ? (
              <Loader2 size={14} className="text-orange-500 animate-spin" />
            ) : (
              <Sparkles size={14} className="text-orange-500" />
            )}
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatBox
          icon={Target}
          value={`${totalSolved}/${totalProblems}`}
          label="Solved / Total"
        />
        <StreakBox
          current={codingStreak.current_streak}
          best={codingStreak.best_streak}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Problems" className="lg:col-span-2">
          <div className="h-[1040px] overflow-y-auto space-y-2 pr-1">
            {codingLoading && questions.length === 0 && (
              <p className="text-sm text-gray-500 px-1 py-6 text-center">
                Loading problems...
              </p>
            )}

            {!codingLoading && questions.length === 0 && (
              <p className="text-sm text-gray-500 px-1 py-6 text-center">
                No problems yet. Check back soon.
              </p>
            )}

            {questions.length > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-gray-400 hover:text-white hover:bg-[#1a1a1c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button
                      onClick={() => setPage(1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1c] transition-colors"
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 && (
                      <span className="text-gray-600 text-xs px-0.5">…</span>
                    )}
                  </>
                )}

                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-colors ${
                      n === safePage
                        ? "bg-orange-600 border-orange-600 text-white"
                        : "border-[#232326] text-gray-400 hover:text-white hover:bg-[#1a1a1c]"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <span className="text-gray-600 text-xs px-0.5">…</span>
                    )}
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1c] transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-gray-400 hover:text-white hover:bg-[#1a1a1c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {pageQuestions.map((q) => {
              const style = difficultyStyle(q.difficulty);

              return (
                <button
                  key={q.question_id}
                  onClick={() => navigate(`/coding/${q.question_id}`)}
                  className={`w-full min-h-[76px] flex items-center justify-between gap-4 bg-[#1a1a1c] hover:bg-[#212124] border border-[#232326] ${style.border} ${style.bg} rounded-xl px-4 py-3 text-left transition-colors`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}
                      />

                      <p className="text-sm font-medium text-gray-100 truncate">
                        {q.title}
                      </p>
                    </div>

                    {q.summary && (
                      <p
                        className="text-xs text-gray-500 mt-1 ml-3.5 leading-5 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {q.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-center gap-2 shrink-0">
                    {formatTimeLimit(q.time_limit) && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Timer size={12} />
                        {formatTimeLimit(q.time_limit)}
                      </span>
                    )}

                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Play size={15} className="text-orange-500 ml-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Avg Failed Attempts" icon={BarChart3}>
            <div className="space-y-4">
              {avgFailedAttempts.map((d) => (
                <MetricRow
                  key={d.label}
                  label={d.label}
                  displayValue={`${d.value.toFixed(1)}%`}
                  value={d.value}
                  max={100}
                  colorClass={DIFFICULTY_COLOR[d.label]}
                  dotClass={DIFFICULTY_COLOR[d.label]}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title={
              monthsData.length
                ? `${monthsData[0].label} – ${monthsData[monthsData.length - 1].label}`
                : "Last 3 Months"
            }
            icon={CalendarDays}
          >
            {!heatmapHasActivity ? (
              <p className="text-sm text-gray-500 py-2">No activity yet.</p>
            ) : null}

            <div className="overflow-x-auto">
              <div className="flex items-start gap-8 w-max">
                {/* Weekday labels, shared across all three month blocks
                    since every block has the same 7-row height. */}
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
                <span
                  key={c}
                  className={`w-3 h-3 rounded-sm ${heatColor(c)}`}
                />
              ))}

              <span>More</span>
            </div>
          </SectionCard>

          <SectionCard title="By Language" icon={Code2}>
            {languageDistribution.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No submissions yet.</p>
            ) : (
              <LanguageStatsGrid data={languageDistribution} />
            )}
          </SectionCard>

          <SectionCard title="Top Scoring Solutions" icon={Trophy}>
            {topScoringSolutions.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No solutions yet.</p>
            ) : (
              <div className="space-y-2">
                {topScoringSolutions.map((s) => {
                  const style = difficultyStyle(s.difficulty);
                  return (
                    <div
                      key={s.question_id}
                      className={`flex items-center justify-between gap-3 rounded-lg border border-[#232326] ${style.bg} px-3 py-2`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 text-xs font-semibold text-gray-500 shrink-0">
                          #{s.rank}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}
                        />
                        <span className="text-sm text-gray-200 truncate">
                          {s.title}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-orange-500 shrink-0">
                        {s.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

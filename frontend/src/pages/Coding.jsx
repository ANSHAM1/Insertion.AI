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
  TrendingUp,
  BarChart3,
  Code2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SectionCard } from "../components/UI";

import { useApp } from "../context/AppContext";

const MOCK_STREAK = { current: 6, highest: 14 };

const MOCK_DIFFICULTY_STATS = {
  Easy: { solved: 18, total: 25 },
  Medium: { solved: 11, total: 30 },
  Hard: { solved: 3, total: 15 },
};

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

const MOCK_LANGUAGE_STATS = [
  { language: "Python", solved: 14, total: 20 },
  { language: "C++", solved: 9, total: 18 },
  { language: "JavaScript", solved: 6, total: 12 },
  { language: "Java", solved: 0, total: 8 },
  { language: "Go", solved: 0, total: 5 },
];

function seededDayCount(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++)
    h = (h * 31 + dateStr.charCodeAt(i)) | 0;
  return Math.abs(h) % 5; // 0-4
}

function buildHeatmapWeeks(weeks = 26) {
  const today = new Date();
  const end = new Date(today);
  const start = new Date(today);

  start.setDate(today.getDate() - weeks * 7);
  start.setDate(start.getDate() - start.getDay());

  const columns = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const week = [];

    for (let i = 0; i < 7; i++) {
      if (cursor <= end) {
        const dateStr = cursor.toISOString().slice(0, 10);
        week.push({
          date: dateStr,
          count: seededDayCount(dateStr),
          month: cursor.toLocaleString("en-IN", {
            month: "short",
          }),
          day: cursor.getDay(),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    columns.push(week);
  }
  return columns;
}

function heatColor(count) {
  if (count === 0) return "bg-[#1a1a1c]";
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

function formatTimeLimit(seconds) {
  if (seconds === undefined || seconds === null) return null;
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `${mins} min` : `${seconds}s`;
}

function ProgressRow({ label, solved, total, colorClass, dotClass }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          {dotClass && <span className={`w-2 h-2 rounded-full ${dotClass}`} />}
          {label}
        </span>
        <span className="text-xs text-gray-500">
          {solved}/{total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#232326] rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const MAX_KEYWORDS = 5;
const PAGE_SIZE = 10;

export default function Coding() {
  const { codingQuestions, codingLoading, generateCodingQuestions } = useApp();
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

  const languageStats = useMemo(
    () => MOCK_LANGUAGE_STATS.filter((l) => l.solved > 0),
    [],
  );

  const heatmapWeeks = useMemo(() => buildHeatmapWeeks(14), []);

  const totalSolved = Object.values(MOCK_DIFFICULTY_STATS).reduce(
    (a, d) => a + d.solved,
    0,
  );
  const totalProblems = Object.values(MOCK_DIFFICULTY_STATS).reduce(
    (a, d) => a + d.total,
    0,
  );
  const successRate =
    totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox
          icon={Target}
          value={`${totalSolved}/${totalProblems}`}
          label="Solved / Total"
        />
        <StatBox
          icon={Flame}
          value={`${MOCK_STREAK.current} days`}
          label="Current Streak"
        />
        <StatBox
          icon={Trophy}
          value={`${MOCK_STREAK.highest} days`}
          label="Highest Streak"
        />
        <StatBox
          icon={TrendingUp}
          value={`${successRate}%`}
          label="Success Rate"
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
          <SectionCard title="Difficulty Breakdown" icon={BarChart3}>
            <div className="space-y-4">
              {Object.entries(MOCK_DIFFICULTY_STATS).map(([label, stat]) => (
                <ProgressRow
                  key={label}
                  label={label}
                  solved={stat.solved}
                  total={stat.total}
                  colorClass={DIFFICULTY_COLOR[label]}
                  dotClass={DIFFICULTY_COLOR[label]}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="By Language" icon={Code2}>
            {languageStats.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No submissions yet.</p>
            ) : (
              <div className="space-y-4">
                {languageStats.map((l) => (
                  <ProgressRow
                    key={l.language}
                    label={l.language}
                    solved={l.solved}
                    total={l.total}
                    colorClass="accent-gradient"
                  />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title={new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            icon={CalendarDays}
          >
            <div className="flex items-start gap-3 overflow-x-auto scrollbar-thin pb-1">
              <div className="flex flex-col text-[10px] text-gray-600 pr-2">
                <span className="h-4 flex items-center">Sun</span>
                <span className="h-4" />
                <span className="h-4 flex items-center">Tue</span>
                <span className="h-4" />
                <span className="h-4 flex items-center">Thu</span>
                <span className="h-4" />
                <span className="h-4 flex items-center">Sat</span>
              </div>

              <div className="flex gap-1">
                {heatmapWeeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date} • ${day.count} submission${
                          day.count === 1 ? "" : "s"
                        }`}
                        className={`w-3 h-3 rounded-sm ${heatColor(day.count)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-600">
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
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Code2 } from "lucide-react";

import { useApp } from "../context/AppContext";

import StatBox from "../components/coding/StatBox";
import StreakBox from "../components/coding/StreakBox";
import GenerateBar from "../components/coding/GenerateBar";
import ProblemsList from "../components/coding/ProblemsList";
import AvgSolvedAttempts from "../components/coding/AvgSolvedAttempts";
import ActivityHeatmap from "../components/coding/ActivityHeatmap";
import LanguageDistribution from "../components/coding/LanguageDistribution";

import {
  MOCK_DIFFICULTY_STATS,
  DIFFICULTY_ORDER,
} from "../constants/constants";

export default function Coding() {
  const {
    codingQuestions,
    codingLoading,
    generateCodingQuestions,
    dashboardData,
  } = useApp();
  const navigate = useNavigate();

  const [resetSignal, setResetSignal] = useState(0);

  const questions = useMemo(() => {
    return (codingQuestions || []).flatMap((group) =>
      (group.questions || []).map((q) => ({
        ...q,
        generated_date: group.generated_date,
      })),
    );
  }, [codingQuestions]);

  const codingStreak = dashboardData?.coding_streak || {
    current_streak: 0,
    best_streak: 0,
  };

  const avgSolvedAttempts = useMemo(() => {
    const rows = dashboardData?.solved_attempts_by_difficulty ?? [];

    return DIFFICULTY_ORDER.map((level) => {
      const match = rows.find(
        (d) => String(d.difficulty).toLowerCase() === level.toLowerCase(),
      );

      return {
        label: level,
        value: match
          ? Math.round((match.solved_attempts / match.total_attempts) * 100)
          : 0,
      };
    });
  }, [dashboardData]);

  const languageDistribution = (
    dashboardData?.coding_language_distribution ?? []
  ).map((l) => ({
    ...l,
    language: String(l.language).replace("ProgrammingLanguage.", ""),
  }));

  const topScoringSolutions = dashboardData?.top_scoring_solutions || [];

  const questionStats = useMemo(() => {
    const allQuestions = questions ?? [];

    const total = allQuestions.length;

    const solved = allQuestions.filter((q) =>
      q.solutions?.some((s) => s.metadata?.status === "ACCEPTED"),
    ).length;

    const attempted = allQuestions.filter(
      (q) => q.solutions && q.solutions.length > 0,
    ).length;

    return {
      total,
      solved,
      attempted,
      accuracy: attempted === 0 ? 0 : Math.round((solved * 100) / attempted),
    };
  }, [questions]);

  const handleGenerate = (prompt) => {
    setResetSignal((n) => n + 1);
    generateCodingQuestions(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Coding Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sharpen your skills, one problem at a time.
          </p>
        </div>

        <GenerateBar loading={codingLoading} onGenerate={handleGenerate} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBox
          icon={Target}
          value={`${questionStats.solved}/${questionStats.total}`}
          label="Solved / Total"
          sub={`${questionStats.total - questionStats.solved} remaining`}
        />

        <StatBox
          icon={Code2}
          value={`${questionStats.accuracy}%`}
          label="Accuracy"
          sub={`${questionStats.attempted} attempted`}
        />

        <StreakBox
          current={codingStreak.current_streak}
          best={codingStreak.best_streak}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ProblemsList
          questions={questions}
          loading={codingLoading}
          onSelect={(id) => navigate(`/coding/${id}`)}
          resetKey={resetSignal}
        />

        <div className="space-y-5">
          <AvgSolvedAttempts data={avgSolvedAttempts} />
          <ActivityHeatmap
            dailyData={dashboardData?.coding_daily_attempts_last_3_months}
          />
          <LanguageDistribution data={languageDistribution} />
        </div>
      </div>
    </div>
  );
}

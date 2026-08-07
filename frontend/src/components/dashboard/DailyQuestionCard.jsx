import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Code2 } from "lucide-react";

export default function DailyQuestionCard({ codingQuestions }) {
  const navigate = useNavigate();

  const DIFFICULTY_PRIORITY = ["Hard", "Medium", "Easy"];

  const questionOfTheDay = useMemo(() => {
    if (!codingQuestions || codingQuestions.length === 0) return null;

    const latestGroup = [...codingQuestions].sort(
      (a, b) => new Date(b.generated_date) - new Date(a.generated_date),
    )[0];

    const questions = latestGroup?.questions ?? [];

    for (const level of DIFFICULTY_PRIORITY) {
      const match = questions.find(
        (q) => String(q.difficulty).toLowerCase() === level.toLowerCase(),
      );
      if (match) return match;
    }

    return questions[0] ?? null;
  }, [codingQuestions]);

  return (
    <div
      onClick={() => {
        if (questionOfTheDay) {
          navigate(`/coding/${questionOfTheDay.question_id}`);
        }
      }}
      className="card card-hover group relative flex cursor-pointer items-start justify-between overflow-hidden rounded-xl p-4"
    >
      {questionOfTheDay ? (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-orange-500 font-semibold">
              Question of the Day
            </p>

            <h3 className="mt-2 text-sm font-semibold text-white line-clamp-2">
              {questionOfTheDay.title}
            </h3>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  String(questionOfTheDay.difficulty).toUpperCase() === "EASY"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : String(questionOfTheDay.difficulty).toUpperCase() ===
                        "MEDIUM"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-red-500/10 text-red-400"
                }`}
              >
                {questionOfTheDay.difficulty}
              </span>
            </div>
          </div>

          <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 transition group-hover:bg-orange-500/20">
            <Code2 className="h-5 w-5 text-orange-500" />
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
          No coding question available
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Timer, Play } from "lucide-react";
import Pagination from "../Pagination";
import { difficultyStyle } from "../../utils/difficulty";
import { formatTimeLimit } from "../../utils/format";
import { PAGE_SIZE } from "../../constants/constants";

export default function ProblemsList({
  questions,
  loading,
  onSelect,
  resetKey,
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageQuestions = useMemo(
    () => questions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [questions, safePage],
  );

  return (
    <div className="card lg:col-span-2 rounded-xl overflow-hidden flex flex-col h-[1040px]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#232326] shrink-0">
        <h3 className="text-sm font-semibold text-white">Problems</h3>

        {totalPages > 1 && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 pr-2 space-y-2">
        {loading && questions.length === 0 && (
          <p className="text-sm text-gray-500 px-1 py-6 text-center">
            Loading problems...
          </p>
        )}

        {!loading && questions.length === 0 && (
          <p className="text-sm text-gray-500 px-1 py-6 text-center">
            No problems yet. Check back soon.
          </p>
        )}

        {pageQuestions.map((q) => {
          const style = difficultyStyle(q.difficulty);

          return (
            <button
              key={q.question_id}
              onClick={() => onSelect(q.question_id)}
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
    </div>
  );
}

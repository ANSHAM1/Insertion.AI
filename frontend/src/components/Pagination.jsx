import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  const pageNumbers = useMemo(() => {
    const span = 5;
    let start = Math.max(1, page - Math.floor(span / 2));
    let end = Math.min(totalPages, start + span - 1);
    start = Math.max(1, end - span + 1);
    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-gray-400 hover:text-white hover:bg-[#1a1a1c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
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
          onClick={() => onPageChange(n)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs transition-colors ${
            n === page
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
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1c] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232326] text-gray-400 hover:text-white hover:bg-[#1a1a1c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

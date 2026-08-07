import React from "react";
import { MAX_LANGUAGE_SLOTS } from "../../constants/constants";

export default function LanguageStatsGrid({ data }) {
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
            <span className="text-xs text-gray-400 truncate">
              {l.language}
            </span>
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

import React from "react";
import { Trophy } from "lucide-react";
import { SectionCard } from "../UI";
import { difficultyStyle } from "../../utils/difficulty";

export default function TopScoringSolutions({ solutions }) {
  return (
    <SectionCard title="Top Scoring Solutions" icon={Trophy}>
      {solutions.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">No solutions yet.</p>
      ) : (
        <div className="space-y-2">
          {solutions.map((s) => {
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
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
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
  );
}

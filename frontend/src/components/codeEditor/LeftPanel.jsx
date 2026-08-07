import React from "react";

import DescriptionTab from "./DescriptionTab";
import SubmissionTab from "./SubmissionTab";

export default function LeftPanel({
  tab,
  setTab,
  question,
  metadata,
  lastResultIsCurrent,
}) {
  return (
    <div className="border-r border-[#1c1c1f] flex flex-col min-h-0 h-full">
      <div className="flex items-center gap-4 px-5 pt-6 border-b border-[#1c1c1f] text-sm">
        {["description", "submissions"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-3 capitalize border-b-2 transition-colors ${
              tab === item
                ? "text-orange-500 border-orange-500"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto themed-scrollbar p-5 space-y-5">
        {tab === "description" && <DescriptionTab question={question} />}

        {tab === "submissions" && (
          <SubmissionTab
            solutions={question.solutions}
            metadata={metadata}
            lastResultIsCurrent={lastResultIsCurrent}
          />
        )}
      </div>
    </div>
  );
}

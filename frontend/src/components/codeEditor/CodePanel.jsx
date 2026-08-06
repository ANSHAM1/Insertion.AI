import React from "react";

import LanguageDropdown from "./LanguageDropdown";
import TestcasePanel from "./TestcasePanel";

import { GripHorizontal } from "lucide-react";

export default function CodePanel({
  languageId,
  setLanguageId,

  code,
  setCode,

  startRowResize,

  testcases,
  testTab,
  setTestTab,

  bottomHeight,
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1c1c1f] bg-[#0f0f11]">
        <LanguageDropdown value={languageId} onChange={setLanguageId} />
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="flex-1 bg-[#0b0b0d] text-gray-200 font-mono text-sm p-5 outline-none resize-none leading-relaxed min-h-0"
        style={{ tabSize: 4 }}
      />

      <div
        onMouseDown={startRowResize}
        className="h-1.5 cursor-row-resize hover:bg-orange-600/40 flex items-center justify-center shrink-0 group"
      >
        <GripHorizontal
          size={12}
          className="text-gray-700 group-hover:text-orange-500"
        />
      </div>

      <TestcasePanel
        testcases={testcases}
        testTab={testTab}
        setTestTab={setTestTab}
        height={bottomHeight}
      />
    </div>
  );
}

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Loader2,
} from "lucide-react";

function testCaseInput(tc) {
  return tc?.input ?? tc?.inputs ?? tc?.stdin ?? JSON.stringify(tc);
}

function testCaseOutput(tc) {
  return tc?.output ?? tc?.expected_output ?? tc?.expected ?? tc?.stdout ?? "";
}

export default function TestcasePanel({
  testcases,
  testTab,
  setTestTab,
  height,
}) {
  return (
    <div
      style={{ height }}
      className="border-t border-[#1c1c1f] flex flex-col shrink-0"
    >

      <div className="border-b border-[#1c1c1f] shrink-0">
        <div className="flex items-center gap-1 px-3 pt-2 overflow-x-auto scrollbar-thin">
          <FlaskConical size={13} className="text-orange-500 mr-1 shrink-0" />

          {testcases.map((_, index) => (
            <button
              key={index}
              onClick={() => setTestTab(index)}
              className={`px-3 py-1.5 rounded-t-lg text-xs shrink-0 transition-colors ${
                testTab === index
                  ? "bg-[#141416] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Case {index + 1}
            </button>
          ))}

          {testcases.length === 0 && (
            <span className="text-xs text-gray-600 py-1.5">
              No test cases provided.
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {testcases[testTab] && (
          <div className="px-4 py-3 bg-[#141416] text-xs space-y-1.5">
            <p className="text-gray-300">
              <span className="text-gray-500">Input:</span>{" "}
              {testCaseInput(testcases[testTab])}
            </p>

            <p className="text-gray-300">
              <span className="text-gray-500">Expected:</span>{" "}
              {testCaseOutput(testcases[testTab])}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
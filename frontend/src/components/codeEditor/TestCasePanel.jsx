import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  XCircle,
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
  testCaseResults,
}) {
  const compileError = testCaseResults?.compiletime_error;

  const results = testCaseResults?.results ?? [];

  const currentCase = testcases[testTab];
  const currentResult = results[testTab];

  return (
    <div className="border-t border-[#1c1c1f] flex flex-col flex-1 min-h-0">
      {compileError ? (
        <div className="flex-1 overflow-y-auto themed-scrollbar p-5 bg-[#141416] min-h-0">
          <div className="flex items-center gap-2 text-red-400 mb-4">
            <AlertTriangle size={17} />
            <span className="font-semibold">Compilation Error</span>
          </div>

          <pre className="text-sm whitespace-pre-wrap text-red-300 leading-6">
            {compileError}
          </pre>
        </div>
      ) : (
        <>
          <div className="border-b border-[#1c1c1f] shrink-0">
            <div className="flex items-center gap-1 px-3 pt-2 overflow-x-auto themed-scrollbar">
              <FlaskConical
                size={13}
                className="text-orange-500 mr-1 shrink-0"
              />

              {testcases.map((_, index) => {
                const result = results[index];

                return (
                  <button
                    key={index}
                    onClick={() => setTestTab(index)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-t-lg text-xs shrink-0 transition-colors ${
                      testTab === index
                        ? "bg-[#141416] text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {result &&
                      (result.passed ? (
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      ) : (
                        <XCircle size={12} className="text-red-400" />
                      ))}
                    Case {index + 1}
                  </button>
                );
              })}

              {testcases.length === 0 && (
                <span className="text-xs text-gray-600 py-1.5">
                  No test cases provided.
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto themed-scrollbar bg-[#141416] min-h-0">
            {currentCase && (
              <div className="p-5 space-y-5 text-sm">
                <Section title="Input" value={testCaseInput(currentCase)} />

                <Section
                  title="Expected Output"
                  value={testCaseOutput(currentCase)}
                />

                {currentResult && (
                  <>
                    <Section
                      title="Your Output"
                      value={
                        currentResult.output_from_code ?? "No output produced."
                      }
                    />

                    <div>
                      <div className="text-gray-500 mb-2">Status</div>

                      {currentResult.passed ? (
                        <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
                          <CheckCircle2 size={15} />
                          Passed
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 text-red-400">
                          <XCircle size={15} />
                          Failed
                        </div>
                      )}
                    </div>

                    {currentResult.runtime_error && (
                      <Section
                        title="Runtime Error"
                        value={currentResult.runtime_error}
                        error
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Section({ title, value, error = false }) {
  return (
    <div>
      <div className="text-gray-500 mb-2">{title}</div>

      <pre
        className={`rounded-lg border p-3 whitespace-pre-wrap break-words text-sm leading-6 ${
          error
            ? "border-red-500/20 bg-red-500/5 text-red-300"
            : "border-[#232326] bg-[#101012] text-gray-200"
        }`}
      >
        {value || "None"}
      </pre>
    </div>
  );
}

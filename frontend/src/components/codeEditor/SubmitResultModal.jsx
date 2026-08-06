import React, { useRef } from "react";
import {
  CheckCircle2,
  Clock,
  Cpu,
  Lightbulb,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

function statusColor(status) {
  const s = (status || "").toLowerCase();

  if (s.includes("accept") || s.includes("solved") || s.includes("pass")) {
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  }

  if (s.includes("fail") || s.includes("wrong") || s.includes("error")) {
    return "text-red-400 bg-red-500/10 border-red-500/30";
  }

  if (s.includes("partial") || s.includes("limit")) {
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  }

  return "text-gray-300 bg-white/5 border-[#232326]";
}

export default function SubmitResultModal({ loading, metadata, onClose }) {
  const backdropRef = useRef(null);

  const score = metadata?.score ?? 0;

  const circumference = 276.4;
  const offset = circumference - (circumference * score) / 100;

  const passedTests = Object.values(metadata?.passed_public_tests ?? {});

  const passedCount = passedTests.filter(Boolean).length;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
      onMouseDown={(e) => {
        if (!loading && e.target === backdropRef.current) {
          onClose?.();
        }
      }}
    >
      <div className="p-[2px] rounded-lg bg-[#2a2a30] shadow-2xl">
        <div className="w-[82vw] max-w-5xl h-[70vh] bg-[#0f0f11] rounded-md overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1c1c1f] shrink-0">
            <h2 className="text-white text-sm font-semibold tracking-wide">
              {loading ? "Evaluating Solution..." : "Submission Result"}
            </h2>

            {!loading && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {loading || !metadata ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
              <Loader2 size={34} className="animate-spin text-orange-500" />

              <p className="text-gray-400 text-sm">
                Running hidden test cases...
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto themed-scrollbar p-5">
              <div className="grid grid-cols-[260px_1fr] gap-5">
                <div className="space-y-4">
                  <div className="bg-[#141416] border border-[#232326] rounded-lg p-5 flex flex-col items-center">
                    <div className="relative w-28 h-28">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-28 h-28 -rotate-90"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="#232326"
                          strokeWidth="6"
                        />

                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="#ff6a1a"
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {score}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`mt-4 px-3 py-1 rounded-full border text-xs ${statusColor(
                        metadata.status,
                      )}`}
                    >
                      {metadata.status}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <InfoCard
                      icon={<Cpu size={14} />}
                      title="Time Complexity"
                      value={metadata.time_complexity}
                    />

                    <InfoCard
                      icon={<Cpu size={14} />}
                      title="Space Complexity"
                      value={metadata.space_complexity}
                    />

                    <InfoCard
                      icon={<Clock size={14} />}
                      title="Runtime"
                      value={`${metadata.time_taken}s`}
                    />

                    <InfoCard
                      icon={<CheckCircle2 size={14} />}
                      title="Public Tests"
                      value={`${passedCount}/${passedTests.length}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <SectionCard
                    icon={<Sparkles size={14} className="text-orange-500" />}
                    title="Feedback"
                  >
                    {metadata.feedback || "No feedback available."}
                  </SectionCard>

                  <SectionCard
                    icon={<Lightbulb size={14} className="text-orange-500" />}
                    title="Optimization Hint"
                  >
                    {metadata.optimization_hint ||
                      "No optimization suggestions."}
                  </SectionCard>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-[#141416] border border-[#232326] rounded-lg p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        {icon}
        {title}
      </div>

      <div className="text-sm text-gray-200 break-words">{value}</div>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-[#141416] border border-[#232326] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#232326] flex items-center gap-2 text-sm font-medium text-white">
        {icon}
        {title}
      </div>

      <div className="max-h-[240px] overflow-y-auto themed-scrollbar p-4 text-sm text-gray-300 leading-7 whitespace-pre-wrap break-words">
        {children}
      </div>
    </div>
  );
}

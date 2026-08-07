import React from "react";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Play,
  Sparkles,
  Timer,
  Loader2,
} from "lucide-react";

const difficultyColor = {
  EASY: "#10b981",
  MEDIUM: "#f59e0b",
  HARD: "#ef4444",
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function EditorTopBar({
  question,
  navigate,

  elapsedSeconds,
  totalSeconds,

  onRun,
  onSubmit,
  setTestCaseResults,

  focusMode,
  toggleFullscreen,
  setFocusMode,
  codeIsRunning,
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-[#1c1c1f] bg-[#0f0f11]"
      style={{
        boxShadow: `inset 0 3px 0 ${
          difficultyColor[question.difficulty] || "#ff6a1a"
        }`,
      }}
    >
      {/* Left */}

      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => {
            setFocusMode(false);
            setTestCaseResults(null)
            navigate("/coding");
          }}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm shrink-0 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <span className="text-[#2a2a2e]">|</span>

        <span className="text-[15px] font-semibold text-white truncate">
          {question.title}
        </span>
      </div>

      {/* Right */}

      <div className="flex items-center gap-2 shrink-0">
        {/* Timer */}

        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#141416] border border-[#232326]">
          <Timer size={14} className="text-orange-500" />

          <span className="text-sm font-mono text-gray-200">
            {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
          </span>
        </div>

        {/* Run */}

        <button
          onClick={onRun}
          disabled={codeIsRunning}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border border-[#232326] text-sm transition-all ${
            codeIsRunning
              ? "bg-[#1c1c1f] text-gray-400 cursor-not-allowed"
              : "bg-[#141416] hover:bg-[#1c1c1f] text-gray-200"
          }`}
        >
          {codeIsRunning ? (
            <Loader2 size={14} className="animate-spin text-orange-500" />
          ) : (
            <Play size={14} className="text-emerald-400 fill-emerald-400" />
          )}

          {codeIsRunning ? "Running..." : "Run"}
        </button>

        {/* Evaluate */}

        <button
          onClick={onSubmit}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-orange-600 hover:bg-orange-500 transition-colors text-white text-sm"
        >
          <Sparkles size={14} />
          Evaluate
        </button>

        {/* Fullscreen */}

        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors"
          title={focusMode ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {focusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>
    </div>
  );
}

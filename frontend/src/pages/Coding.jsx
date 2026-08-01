import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import PageTitle from "../components/PageTitle.jsx";

// ---------------------------------------------------------------------------
// Static sample question + starter templates.
// Swap `QUESTION` for real problem data and wire `handleRun` / `handleSubmit`
// up to your judge / Tauri command whenever that's ready — this page is UI
// only for now.
// ---------------------------------------------------------------------------

const QUESTION = {
  title: "Two Sum",
  difficulty: "Easy",
  topics: ["Array", "Hash Table"],
  description:
    "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
  ],
};

const TEST_CASES = [
  { id: 1, input: "nums = [2,7,11,15]\ntarget = 9", output: "[0,1]" },
  { id: 2, input: "nums = [3,2,4]\ntarget = 6", output: "[1,2]" },
  { id: 3, input: "nums = [3,3]\ntarget = 6", output: "[0,1]" },
];

const LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
];

const STARTER_CODE = {
  python: `class Solution:
    def twoSum(self, nums, target):
        # write your code here
        pass
`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // write your code here
        return new int[]{};
    }
}
`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // write your code here
        return {};
    }
};
`,
};

const DIFFICULTY_STYLES = {
  Easy: "bg-success-soft text-success",
  Medium: "bg-warning-soft text-warning",
  Hard: "bg-danger-soft text-danger",
};

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function CodeEditor({ value, onChange }) {
  const gutterRef = useRef(null);
  const lineCount = value.split("\n").length;

  function handleScroll(e) {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const { selectionStart, selectionEnd } = target;
      const next = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd);
      onChange(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = selectionStart + 2;
      });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-bg">
      <div
        ref={gutterRef}
        aria-hidden
        className="select-none overflow-hidden bg-bg px-3 py-4 text-right font-mono-editor text-xs leading-6 text-text-muted"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder="Write your solution here..."
        className="flex-1 resize-none overflow-auto bg-transparent px-4 py-4 font-mono-editor text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted"
      />
    </div>
  );
}

export default function Coding() {
  const [language, setLanguage] = useState("python");
  const [codeByLanguage, setCodeByLanguage] = useState(STARTER_CODE);

  const [activeCase, setActiveCase] = useState(0);
  const [runResults, setRunResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitState, setSubmitState] = useState(null);

  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Fullscreen — try the real Fullscreen API, but fall back gracefully
  // (the fixed overlay below still hides the sidebar and chrome even if
  // the browser/webview refuses the request).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    try {
      if (fullscreen && document.fullscreenElement !== el) {
        el.requestFullscreen?.().catch(() => {});
      } else if (!fullscreen && document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    } catch {
      // Fullscreen API unavailable — ignore, overlay still applies.
    }
  }, [fullscreen]);

  useEffect(() => {
    function handleFsChange() {
      if (!document.fullscreenElement) setFullscreen(false);
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  function handleRun() {
    if (running) return;
    setRunning(true);
    setSubmitState(null);

    // Simulated judge run — replace with a real Tauri command invocation.
    setTimeout(() => {
      setRunResults(
        TEST_CASES.map((tc) => ({ id: tc.id, passed: true, actual: tc.output })),
      );
      setRunning(false);
    }, 700);
  }

  function handleSubmit() {
    if (running) return;
    setRunning(true);

    setTimeout(() => {
      setRunning(false);
      setSubmitState("accepted");
    }, 900);
  }

  const currentCase = TEST_CASES[activeCase];
  const currentResult = runResults?.find((r) => r.id === currentCase.id);

  return (
    <div
      ref={containerRef}
      className={
        fullscreen
          ? "fixed inset-0 z-[999] flex flex-col gap-4 bg-bg p-4 animate-fade-in"
          : "flex flex-col gap-5"
      }
    >
      {!fullscreen && (
        <PageTitle
          title="Coding"
          subtitle="Practice problems with a timed, LeetCode-style workspace"
        />
      )}

      {/* Top bar: problem meta, timer, fullscreen toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Code2 size={14} className="text-accent" />
            Problem
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-text-primary">
              {QUESTION.title}
            </h1>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${DIFFICULTY_STYLES[QUESTION.difficulty]}`}
            >
              {QUESTION.difficulty}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
            <Clock size={15} className="text-accent" />

            <span className="w-[4.5rem] font-mono-editor text-sm tabular-nums text-text-primary">
              {formatTime(seconds)}
            </span>

            <button
              onClick={() => setTimerRunning((r) => !r)}
              title={timerRunning ? "Pause timer" : "Resume timer"}
              className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {timerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
              onClick={() => setSeconds(0)}
              title="Reset timer"
              className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setFullscreen((p) => !p)}
            className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {fullscreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      </div>

      {/* Body: question + test cases | code editor */}
      <div
        className={`grid flex-1 min-h-0 grid-cols-1 gap-5 lg:grid-cols-2 ${
          fullscreen ? "" : "h-[calc(100vh-260px)] min-h-[460px]"
        }`}
      >
        {/* Left column: question + test cases */}
        <div className="flex min-h-0 flex-col gap-5">
          <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              {QUESTION.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-medium text-text-muted"
                >
                  {topic}
                </span>
              ))}
            </div>

            <p className="text-sm leading-7 text-text-secondary">
              {QUESTION.description}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {QUESTION.examples.map((example, index) => (
                <div key={index} className="rounded-xl bg-bg p-4">
                  <div className="mb-2 text-xs font-semibold text-text-primary">
                    Example {index + 1}
                  </div>

                  <div className="space-y-1.5 font-mono-editor text-xs leading-6 text-text-secondary">
                    <div>
                      <span className="text-text-muted">Input: </span>
                      {example.input}
                    </div>
                    <div>
                      <span className="text-text-muted">Output: </span>
                      {example.output}
                    </div>
                    {example.explanation && (
                      <div className="font-sans text-text-muted">
                        Explanation: {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold text-text-primary">
                Constraints
              </div>

              <ul className="list-inside list-disc space-y-1 font-mono-editor text-xs leading-6 text-text-muted">
                {QUESTION.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Test cases — below the question, LeetCode style */}
          <div className="shrink-0 rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              {TEST_CASES.map((tc, index) => {
                const result = runResults?.find((r) => r.id === tc.id);

                return (
                  <button
                    key={tc.id}
                    onClick={() => setActiveCase(index)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeCase === index
                        ? "bg-accent-soft text-accent"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    }`}
                  >
                    {result &&
                      (result.passed ? (
                        <CheckCircle2 size={13} className="text-success" />
                      ) : (
                        <XCircle size={13} className="text-danger" />
                      ))}
                    Case {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-bg p-3">
                <div className="mb-1.5 text-[11px] font-medium text-text-muted">
                  Input
                </div>
                <pre className="whitespace-pre-wrap font-mono-editor text-xs leading-6 text-text-primary">
                  {currentCase.input}
                </pre>
              </div>

              <div className="rounded-xl bg-bg p-3">
                <div className="mb-1.5 text-[11px] font-medium text-text-muted">
                  Expected Output
                </div>
                <pre className="whitespace-pre-wrap font-mono-editor text-xs leading-6 text-text-primary">
                  {currentCase.output}
                </pre>
              </div>
            </div>

            {currentResult && (
              <div
                className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                  currentResult.passed
                    ? "bg-success-soft text-success"
                    : "bg-danger-soft text-danger"
                }`}
              >
                {currentResult.passed ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {currentResult.passed
                  ? `Passed — output: ${currentResult.actual}`
                  : "Failed"}
              </div>
            )}
          </div>
        </div>

        {/* Right column: code editor */}
        <div className="flex min-h-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-lg bg-bg p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    language === lang.id
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:opacity-60"
              >
                {running ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                Run
              </button>

              <button
                onClick={handleSubmit}
                disabled={running}
                className="flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                <Send size={14} />
                Submit
              </button>
            </div>
          </div>

          <CodeEditor
            value={codeByLanguage[language]}
            onChange={(next) =>
              setCodeByLanguage((prev) => ({ ...prev, [language]: next }))
            }
          />

          {submitState === "accepted" && (
            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-success-soft px-4 py-3 text-sm font-medium text-success">
              <CheckCircle2 size={16} />
              Accepted — all {TEST_CASES.length} test cases passed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

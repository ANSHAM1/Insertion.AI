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
  Search,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import PageTitle from "../components/PageTitle.jsx";

// ---------------------------------------------------------------------------
// Static sample question bank + starter templates.
// Swap `QUESTIONS_SEED` / `generateQuestions` for real problem data and wire
// `handleRun` / `handleSubmit` / `loadAttempt` up to your judge / Tauri
// command whenever that's ready — this page is UI only for now.
// ---------------------------------------------------------------------------

const QUESTIONS_SEED = [
  {
    id: "two-sum",
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
    testCases: [
      { id: 1, input: "nums = [2,7,11,15]\ntarget = 9", output: "[0,1]" },
      { id: 2, input: "nums = [3,2,4]\ntarget = 6", output: "[1,2]" },
      { id: 3, input: "nums = [3,3]\ntarget = 6", output: "[0,1]" },
    ],
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    description:
      "Given the `head` of a singly linked list, reverse the list, and return the reversed list's head.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The list is reversed in place.",
      },
    ],
    constraints: [
      "The number of nodes is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    testCases: [
      { id: 1, input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { id: 2, input: "head = [1,2]", output: "[2,1]" },
      { id: 3, input: "head = []", output: "[]" },
    ],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["String", "Stack"],
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid — every open bracket must be closed by the same type, in the correct order.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of bracket characters only."],
    testCases: [
      { id: 1, input: 's = "()"', output: "true" },
      { id: 2, input: 's = "()[]{}"', output: "true" },
      { id: 3, input: 's = "(]"', output: "false" },
    ],
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: ["Array", "Sorting"],
    description:
      "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Intervals [1,3] and [2,6] overlap, so merge to [1,6].",
      },
    ],
    constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2"],
    testCases: [
      {
        id: 1,
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
      },
      { id: 2, input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
  },
  {
    id: "level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "BFS"],
    description:
      "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
    ],
    constraints: ["The number of nodes is in the range [0, 2000]."],
    testCases: [
      {
        id: 1,
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
      { id: 2, input: "root = [1]", output: "[[1]]" },
    ],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["String", "Sliding Window"],
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc".' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b".' },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    testCases: [
      { id: 1, input: 's = "abcabcbb"', output: "3" },
      { id: 2, input: 's = "bbbbb"', output: "1" },
      { id: 3, input: 's = "pwwkew"', output: "3" },
    ],
  },
];

// Extra pool that "Generate New Questions" pulls from — stand-in for a real
// generator/API call.
const EXTRA_QUESTIONS_POOL = [
  {
    id: "median-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Array", "Binary Search"],
    description:
      "Given two sorted arrays `nums1` and `nums2`, return the median of the two sorted arrays in O(log (m+n)) time.",
    examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.0" }],
    constraints: ["nums1.length + nums2.length >= 1"],
    testCases: [
      { id: 1, input: "nums1 = [1,3]\nnums2 = [2]", output: "2.0" },
      { id: 2, input: "nums1 = [1,2]\nnums2 = [3,4]", output: "2.5" },
    ],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    topics: ["Dynamic Programming"],
    description:
      "You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [{ input: "n = 3", output: "3" }],
    constraints: ["1 <= n <= 45"],
    testCases: [
      { id: 1, input: "n = 2", output: "2" },
      { id: 2, input: "n = 3", output: "3" },
    ],
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    topics: ["Graph", "Topological Sort"],
    description:
      "There are `numCourses` courses labeled 0 to numCourses - 1. Given the prerequisite pairs, determine if you can finish all courses.",
    examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }],
    constraints: ["1 <= numCourses <= 2000"],
    testCases: [
      { id: 1, input: "numCourses = 2\nprerequisites = [[1,0]]", output: "true" },
      { id: 2, input: "numCourses = 2\nprerequisites = [[1,0],[0,1]]", output: "false" },
    ],
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    topics: ["Design", "Hash Table"],
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.",
    examples: [{ input: "capacity = 2", output: "—" }],
    constraints: ["1 <= capacity <= 3000"],
    testCases: [{ id: 1, input: "capacity = 2\nput(1,1), put(2,2), get(1)", output: "1" }],
  },
];

const LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
];

const STARTER_CODE = {
  python: `class Solution:
    def solve(self, *args):
        # write your code here
        pass
`,
  java: `class Solution {
    public Object solve(Object... args) {
        // write your code here
        return null;
    }
}
`,
  cpp: `class Solution {
public:
    auto solve() {
        // write your code here
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

// Simulated network/load call for opening an attempt — replace with a real
// question-loading call (e.g. a Tauri `invoke`) when wiring up the backend.
// Includes a small random failure chance purely to exercise the retry/reload
// UI; drop that once real loading logic is in place.
function loadQuestionDetail(question) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.12) {
        reject(new Error("Failed to load the problem workspace."));
      } else {
        resolve(question);
      }
    }, 700);
  });
}

// Simulated "generate new questions" call — replace with a real
// generator/API call when wiring up the backend.
function generateQuestions(existingIds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fresh = EXTRA_QUESTIONS_POOL.filter((q) => !existingIds.has(q.id));
      resolve(fresh.slice(0, 2));
    }, 900);
  });
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

// ---------------------------------------------------------------------------
// Question list — small rectangular cards, each with an "Attempt" button.
// ---------------------------------------------------------------------------

function QuestionCard({ question, onAttempt }) {
  return (
    <div className="flex h-[168px] flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/40">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">
            {question.title}
          </h3>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${DIFFICULTY_STYLES[question.difficulty]}`}
          >
            {question.difficulty}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {question.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-medium text-text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onAttempt(question)}
        className="flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Play size={13} />
        Attempt
      </button>
    </div>
  );
}

function QuestionListView({ questions, onAttempt }) {
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [allQuestions, setAllQuestions] = useState(questions);

  async function handleGenerate() {
    if (generating) return;
    setGenerating(true);

    try {
      const existingIds = new Set(allQuestions.map((q) => q.id));
      const fresh = await generateQuestions(existingIds);
      setAllQuestions((prev) => [...prev, ...fresh]);
    } finally {
      setGenerating(false);
    }
  }

  const filtered = allQuestions.filter((q) => {
    const haystack = `${q.title} ${q.difficulty} ${q.topics.join(" ")}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Coding"
        subtitle="Practice problems with a timed, LeetCode-style workspace"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by title, topic, or difficulty..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {generating ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          {generating ? "Generating..." : "Generate New Questions"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((question) => (
          <QuestionCard key={question.id} question={question} onAttempt={onAttempt} />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border py-10 text-center text-sm text-text-muted">
            No questions match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Attempt view — opens as a full-size overlay, mirrors the previous
// full-page workspace. Shown once the question detail has finished loading.
// ---------------------------------------------------------------------------

function AttemptWorkspace({ question, onClose }) {
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

  const testCases = question.testCases;

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
        testCases.map((tc) => ({ id: tc.id, passed: true, actual: tc.output })),
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

  const currentCase = testCases[activeCase];
  const currentResult = runResults?.find((r) => r.id === currentCase.id);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col gap-4 bg-bg p-4 animate-fade-in"
    >
      {/* Top bar: back button, problem meta, timer, fullscreen toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            title="Back to all questions"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <ArrowLeft size={14} />
            Questions
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Code2 size={14} className="text-accent" />
              Problem
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-lg font-semibold text-text-primary">
                {question.title}
              </h1>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${DIFFICULTY_STYLES[question.difficulty]}`}
              >
                {question.difficulty}
              </span>
            </div>
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
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left column: question + test cases */}
        <div className="flex min-h-0 flex-col gap-5">
          <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              {question.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-medium text-text-muted"
                >
                  {topic}
                </span>
              ))}
            </div>

            <p className="text-sm leading-7 text-text-secondary">
              {question.description}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {question.examples.map((example, index) => (
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
                {question.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Test cases — below the question, LeetCode style */}
          <div className="shrink-0 rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              {testCases.map((tc, index) => {
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
              Accepted — all {testCases.length} test cases passed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Attempt loader — full-size overlay shown the instant "Attempt" is clicked.
// Shows a loading spinner while the workspace prepares, and a reload button
// if that preparation fails.
// ---------------------------------------------------------------------------

function AttemptLoader({ question, onClose }) {
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [loadedQuestion, setLoadedQuestion] = useState(null);

  async function load() {
    setStatus("loading");

    try {
      const result = await loadQuestionDetail(question);
      setLoadedQuestion(result);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  if (status === "ready" && loadedQuestion) {
    return <AttemptWorkspace question={loadedQuestion} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-bg p-4 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Questions
      </button>

      {status === "loading" && (
        <>
          <Loader2 size={32} className="animate-spin text-accent" />
          <div className="text-sm text-text-secondary">
            Loading &ldquo;{question.title}&rdquo;...
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft">
            <AlertTriangle size={26} className="text-danger" />
          </div>

          <div className="text-center">
            <div className="text-sm font-medium text-text-primary">
              Couldn&apos;t load this problem
            </div>
            <div className="mt-1 text-xs text-text-muted">
              Something went wrong while setting up the workspace.
            </div>
          </div>

          <button
            onClick={load}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <RefreshCw size={14} />
            Reload
          </button>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top-level Coding page — switches between the question list and a
// full-size attempt overlay.
// ---------------------------------------------------------------------------

export default function Coding() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  return (
    <>
      <QuestionListView questions={QUESTIONS_SEED} onAttempt={setActiveQuestion} />

      {activeQuestion && (
        <AttemptLoader
          key={activeQuestion.id}
          question={activeQuestion}
          onClose={() => setActiveQuestion(null)}
        />
      )}
    </>
  );
}

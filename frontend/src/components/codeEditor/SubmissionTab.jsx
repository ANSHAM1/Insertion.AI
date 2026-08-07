import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  MessageSquare,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { LANGUAGES } from "../../constants/codeTemplates";

// Adjust keys to match your actual CodingStatus enum values.
// Colors are semantic accents layered on top of the theme's dark surface —
// not raw Tailwind card backgrounds.
const STATUS_STYLES = {
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  WRONG_ANSWER: {
    label: "Wrong Answer",
    icon: XCircle,
    text: "text-rose-400",
    dot: "bg-rose-400",
  },
  PARTIAL: {
    label: "Partial",
    icon: AlertCircle,
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  DEFAULT: {
    label: "Unknown",
    icon: AlertCircle,
    text: "text-text-faint",
    dot: "bg-text-faint",
  },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || { ...STATUS_STYLES.DEFAULT, label: status };
}

function getLanguageLabel(id) {
  return LANGUAGES.find((l) => l.id === id)?.label || id;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SubmissionCard({ entry, onClick, highlighted }) {
  const { label, icon: Icon, text } = getStatusStyle(entry.status);
  return (
    <button
      onClick={onClick}
      className={`card card-hover w-full text-left p-4 flex items-center justify-between gap-4 group ${
        highlighted ? "border-accent/40" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon size={20} className={text} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={text}>{label}</span>
            <span className="text-text-faint">•</span>
            <span className="text-text-primary">{entry.score}/100</span>
          </div>
          <div className="text-xs text-text-muted mt-0.5 truncate">
            {getLanguageLabel(entry.language)} ·{" "}
            {formatDate(entry.submitted_at)}
          </div>
        </div>
      </div>
      <ChevronRight
        size={18}
        className="text-text-faint group-hover:text-text-muted shrink-0 transition-colors"
      />
    </button>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="rounded-card bg-surface-alt border border-border p-3">
      <div className="text-xs text-text-faint">{label}</div>
      <div className="text-sm font-medium text-text-primary mt-1">{value}</div>
    </div>
  );
}

function SubmissionDetail({ entry, onBack }) {
  const { label, icon: Icon, text, dot } = getStatusStyle(entry.status);
  const passed = entry.passed_public_tests?.filter((t) => t.passed).length ?? 0;
  const total = entry.passed_public_tests?.length ?? 0;

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} />
        Back to submissions
      </button>

      <div className="card p-5 relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-0.5 ${dot} opacity-70`} />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Icon size={22} className={text} />
            <span className={`text-lg font-semibold ${text}`}>{label}</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {entry.score}
            <span className="text-sm text-text-faint font-normal">/100</span>
          </div>
        </div>
        <div className="text-xs text-text-faint mt-2">
          Submitted {formatDate(entry.submitted_at)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBlock label="Language" value={getLanguageLabel(entry.language)} />
        <StatBlock
          label="Time Taken"
          value={`${Math.round(entry.time_taken / 60)} min`}
        />
        <StatBlock label="Started" value={formatDate(entry.started_at)} />
        <StatBlock label="Time Complexity" value={entry.time_complexity} />
        <StatBlock label="Space Complexity" value={entry.space_complexity} />
        <StatBlock label="Public Tests" value={`${passed}/${total} passed`} />
      </div>

      {total > 0 && (
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Code2 size={16} className="text-accent" />
            Public Test Cases
          </div>
          <div className="space-y-1.5">
            {entry.passed_public_tests.map((t, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs rounded-card border px-3 py-2 bg-surface-alt ${
                  t.passed
                    ? "border-emerald-400/20 text-emerald-400"
                    : "border-rose-400/20 text-rose-400"
                }`}
              >
                {t.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                Test case {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {entry.feedback && (
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <MessageSquare size={16} className="text-accent" />
            Feedback
          </div>
          <p className="text-sm text-text-muted leading-relaxed bg-surface-alt rounded-card p-3 border border-border">
            {entry.feedback}
          </p>
        </div>
      )}

      {entry.optimization_hint && (
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Lightbulb size={16} className="text-accent" />
            Optimization Hint
          </div>
          <p className="text-sm text-text-muted leading-relaxed bg-surface-alt rounded-card p-3 border border-border">
            {entry.optimization_hint}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SubmissionTab({
  solutions,
  metadata,
  lastResultIsCurrent,
}) {
  const [selected, setSelected] = useState(null);

  const history = useMemo(() => {
    if (!Array.isArray(solutions)) return [];

    return solutions
      .map((solution) => ({
        ...solution.metadata,
        solution_name: solution.name,
      }))
      .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  }, [solutions]);

  const currentSubmission = metadata
    ? {
        ...metadata,
        solution_name: "Current",
      }
    : null;

  const showCurrent = lastResultIsCurrent && currentSubmission;

  if (!showCurrent && history.length === 0) {
    return (
      <div className="text-sm text-text-faint py-6 text-center">
        No submissions yet for this problem.
      </div>
    );
  }

  if (selected) {
    return (
      <SubmissionDetail entry={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <div className="space-y-4">
      {showCurrent && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-accent mb-2">
            <Sparkles size={12} />
            Latest submission
          </div>

          <SubmissionCard
            entry={currentSubmission}
            highlighted
            onClick={() => setSelected(currentSubmission)}
          />
        </div>
      )}

      {history.length > 0 && (
        <div>
          {showCurrent && (
            <div className="text-xs font-medium text-text-faint mb-2">
              Submission history
            </div>
          )}

          <div className="space-y-2.5">
            {history.map((entry, i) => (
              <SubmissionCard
                key={`${entry.solution_name}-${i}`}
                entry={entry}
                onClick={() => setSelected(entry)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

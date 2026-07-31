import { useState } from "react";
import { NotebookPen } from "lucide-react";

import PageTitle from "../components/PageTitle.jsx";

import { useApp } from "../context/AppContext";

function TaskCard({ task, onToggle }) {
  return (
    <div
      className={`
        group rounded-2xl border border-border bg-surface p-5
        transition-all duration-300
        hover:-translate-y-1
        hover:border-accent/30
        hover:bg-surface-hover
        hover:shadow-lg
      `}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 h-5 w-5 shrink-0 accent-accent"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3
              className={`text-base font-semibold transition-colors ${
                task.completed
                  ? "text-text-muted line-through"
                  : "text-text-primary"
              }`}
            >
              {task.title}
            </h3>

            <span className="rounded-full bg-bg px-3 py-1 text-xs font-medium text-text-muted">
              {task.time}
            </span>
          </div>

          {task.note && (
            <p className="mt-3 leading-7 text-sm text-text-muted">
              {task.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Planner() {
  const {
    plannerTasks,
    plannerLoading,
    plannerLoaded,
    updatePlannerTask,
    savePlannerReflection,
  } = useApp();

  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  async function toggleTask(id) {
    const task = plannerTasks.find((t) => t.id === id);

    if (!task) return;

    try {
      await updatePlannerTask(id, !task.completed);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveReflection() {
    try {
      await savePlannerReflection(reflection);

      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  }

  const pendingCount = plannerTasks.filter((task) => !task.completed).length;

  return (
    <div className="space-y-6">
      <PageTitle title="Planner" subtitle="AI generated schedule for today" />

      {!plannerLoaded ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
          Planner has not been generated yet.
          <br />
          Go to the Dashboard and click <strong>Refresh</strong>.
        </div>
      ) : plannerLoading ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
          Generating today's planner...
        </div>
      ) : plannerTasks.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
          No planner available.
        </div>
      ) : (
        <div className="space-y-3">
          {plannerTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <NotebookPen size={16} className="text-accent" />

          <h3 className="text-sm font-semibold text-text-primary">
            Daily Reflection
          </h3>
        </div>

        <p className="mt-2 text-sm text-text-muted">
          {pendingCount > 0
            ? `${pendingCount} ${
                pendingCount === 1 ? "task is" : "tasks are"
              } still pending. Record what prevented completion so tomorrow's planner can improve.`
            : "Excellent work. Capture any notes that may help tomorrow."}
        </p>

        <textarea
          value={reflection}
          onChange={(e) => {
            setReflection(e.target.value);
            setSaved(false);
          }}
          rows={5}
          placeholder="Write your thoughts about today's progress..."
          className="mt-4 w-full resize-none rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />

        <div className="mt-4 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-success">Reflection saved</span>
          )}

          <button
            onClick={handleSaveReflection}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  );
}

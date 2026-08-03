import React from "react";

export function DifficultyBadge({ level }) {
  const styles = {
    Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    Medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    Hard: "text-red-400 bg-red-500/10 border-red-500/30",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border ${styles[level] || ""}`}
    >
      {level}
    </span>
  );
}

export function StatusPill({ status }) {
  const styles = {
    Accepted: "text-emerald-400 bg-emerald-500/10",
    Registered: "text-emerald-400 bg-emerald-500/10",
    Upcoming: "text-orange-400 bg-orange-500/10",
    Completed: "text-gray-400 bg-gray-500/10",
    Unsolved: "text-gray-500 bg-gray-500/10",
    "Wrong Answer": "text-red-400 bg-red-500/10",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${styles[status] || "text-gray-400 bg-gray-500/10"}`}
    >
      {status}
    </span>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className = "",
}) {
  return (
    <div className={`card p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white font-semibold text-[15px]">
            {Icon && <Icon size={17} className="text-orange-500" />}
            {title}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

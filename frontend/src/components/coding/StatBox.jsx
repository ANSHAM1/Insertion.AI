import React from "react";

export default function StatBox({ icon: Icon, value, label, sub }) {
  return (
    <div
      className="
        card group relative overflow-hidden
        rounded-xl p-4
        flex flex-col justify-between
        border border-border
        transition-all duration-300
        hover:border-accent/40
      "
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <div
          className="
            flex items-center justify-center
            w-8 h-8 rounded-lg
            bg-accent/10
          "
        >
          <Icon size={16} className="text-accent" />
        </div>

        <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-border" />

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-text-primary tracking-tight">
          {value}
        </p>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-faint">
          {label}
        </p>

        {sub && (
          <p className="mt-2 text-xs text-text-muted">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
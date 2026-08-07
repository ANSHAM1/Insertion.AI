import React from "react";

export default function StatCard({
  label,
  value,
  unit,
  sub,
  icon: Icon,
  ring,
  trend,
}) {
  const gradientId = React.useId();
  const ringPct =
    ring !== undefined ? Math.max(0, Math.min(100, ring)) : undefined;

  return (
    <div className="card card-hover group relative flex items-start justify-between overflow-hidden rounded-xl p-4">
      <div className="relative min-w-0 flex-1">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-600/20 to-orange-600/5 transition-transform duration-300 group-hover:scale-105">
            <Icon size={18} className="text-orange-500" />
          </div>

          <span className="truncate text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-bold leading-none text-emerald-400">
            {value}
          </span>

          {unit && <span className="mb-0.5 text-sm text-gray-500">{unit}</span>}

          {trend !== undefined && trend !== null && (
            <span
              className={`mb-0.5 ml-1 flex items-center gap-0.5 text-xs font-semibold ${
                trend > 0
                  ? "text-emerald-400"
                  : trend < 0
                    ? "text-red-500"
                    : "text-gray-500"
              }`}
            >
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "–"}
              {Math.abs(trend)}%
            </span>
          )}
        </div>

        {sub && (
          <p className="mx-0 mb-0 mt-2 text-xs leading-normal text-gray-500">
            {sub}
          </p>
        )}
      </div>

      {ringPct !== undefined && (
        <div className="relative z-10 h-12 w-12 shrink-0">
          <svg viewBox="0 0 36 36" className="block h-12 w-12 -rotate-90">
            <defs>
              <linearGradient
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ff8a3d" />
                <stop offset="100%" stopColor="#ff6a1a" />
              </linearGradient>
            </defs>

            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#232326"
              strokeWidth="3"
            />

            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              strokeDasharray={`${(ringPct / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className="transition-[stroke-dasharray] duration-700 ease-out"
            />
          </svg>

          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
            {Math.round(ringPct)}%
          </span>
        </div>
      )}
    </div>
  );
}

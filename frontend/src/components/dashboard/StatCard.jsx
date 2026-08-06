import React from "react";

export default function StatCard({
  label,
  value,
  unit,
  sub,
  icon: Icon,
  ring,
}) {
  return (
    <div className="card card-hover p-4 flex items-start justify-between rounded-xl">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center">
            <Icon size={18} className="text-orange-500" />
          </div>

          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            {label}
          </span>
        </div>

        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-white leading-none">
            {value}
          </span>

          {unit && <span className="text-sm text-gray-500 mb-0.5">{unit}</span>}
        </div>

        {sub && <p className="mt-2 text-xs text-gray-500">{sub}</p>}
      </div>

      {ring !== undefined && (
        <div className="relative shrink-0 w-12 h-12">
          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
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
              stroke="#ff6a1a"
              strokeWidth="3"
              strokeDasharray={`${(ring / 100) * 97.4} 97.4`}
              strokeLinecap="round"
            />
          </svg>

          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
            {Math.round(ring)}%
          </span>
        </div>
      )}
    </div>
  );
}

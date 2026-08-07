import React from "react";

export default function MetricRow({
  label,
  displayValue,
  value,
  max,
  colorClass,
  dotClass,
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          {dotClass && <span className={`w-2 h-2 rounded-full ${dotClass}`} />}
          {label}
        </span>
        <span className="text-xs text-gray-500">{displayValue}</span>
      </div>
      <div className="w-full h-1.5 bg-[#232326] rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

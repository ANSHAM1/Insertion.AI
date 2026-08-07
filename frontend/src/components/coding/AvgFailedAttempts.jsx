import React from "react";
import { BarChart3 } from "lucide-react";
import { SectionCard } from "../UI";
import MetricRow from "./MetricRow";
import { DIFFICULTY_COLOR } from "../../constants/constants";

// `data` items: { label: "Easy" | "Medium" | "Hard", value: <percentage> }
// `value` is already a percentage from the backend — used directly,
// never recomputed against a local max.
export default function AvgFailedAttempts({ data }) {
  return (
    <SectionCard title="Avg Failed Attempts" icon={BarChart3}>
      <div className="space-y-4">
        {data.map((d) => (
          <MetricRow
            key={d.label}
            label={d.label}
            displayValue={`${d.value.toFixed(1)}%`}
            value={d.value}
            max={100}
            colorClass={DIFFICULTY_COLOR[d.label]}
            dotClass={DIFFICULTY_COLOR[d.label]}
          />
        ))}
      </div>
    </SectionCard>
  );
}

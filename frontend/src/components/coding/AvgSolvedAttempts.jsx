import React from "react";
import { BarChart3 } from "lucide-react";
import { SectionCard } from "../UI";
import MetricRow from "./MetricRow";
import { DIFFICULTY_COLOR } from "../../constants/constants";

export default function AvgSolvedAttempts({ data }) {
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

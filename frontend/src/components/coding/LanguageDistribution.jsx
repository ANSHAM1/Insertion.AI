import React from "react";
import { Code2 } from "lucide-react";
import { SectionCard } from "../UI";
import LanguageStatsGrid from "./LanguageStatsGrid";

export default function LanguageDistribution({ data }) {
  return (
    <SectionCard title="By Language" icon={Code2}>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">No submissions yet.</p>
      ) : (
        <LanguageStatsGrid data={data} />
      )}
    </SectionCard>
  );
}

import React, { useMemo } from "react";
import { Briefcase, Building2 } from "lucide-react";

import { SectionCard } from "../UI";

export default function JobApplicationsCard({
  jobMatchByResume,
  jobMatchDistribution,
}) {
  const TOP_RESUME_COUNT = 4;

  const maxJobsInBucket = Math.max(
    1,
    ...jobMatchDistribution.map((b) => b.num_jobs),
  );

  const topResumesByMatches = useMemo(() => {
    return [...jobMatchByResume]
      .sort((a, b) => b.total_jobs - a.total_jobs)
      .slice(0, TOP_RESUME_COUNT);
  }, [jobMatchByResume]);

  return (
    <SectionCard
      title="Job Applications"
      icon={Briefcase}
      className="lg:col-span-2"
    >
      <div className="space-y-5">
        {/* Match quality by resume — top 4 by matched jobs, fixed height */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Match Quality by Resume
          </p>

          {jobMatchByResume.length === 0 ? (
            <p className="text-xs text-gray-600 italic px-1">
              No resume match data yet.
            </p>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: TOP_RESUME_COUNT }).map((_, i) => {
                const r = topResumesByMatches[i];

                if (!r) {
                  return (
                    <div
                      key={`resume-slot-empty-${i}`}
                      className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-dashed border-[#232326] text-xs text-gray-700"
                    >
                      No more resumes
                    </div>
                  );
                }

                return (
                  <div
                    key={r.resume}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-[#232326] bg-[#0d0d0f] hover:border-orange-500/40 hover:bg-[#18181b] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 size={13} className="text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-300 truncate">
                        {r.resume}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500">
                        {r.total_jobs} jobs
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-[#232326] overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${Math.min(100, r.avg_match_percentage)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-white w-10 text-right">
                        {r.avg_match_percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Match distribution buckets */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Match Distribution
          </p>

          {jobMatchDistribution.length === 0 ? (
            <p className="text-xs text-gray-600 italic px-1">
              No job match data yet.
            </p>
          ) : (
            jobMatchDistribution.map((b) => (
              <div
                key={b.bucket}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0d0d0f] transition-colors"
              >
                <span className="text-xs text-gray-500 w-16 shrink-0">
                  Group {b.bucket}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#232326] overflow-hidden">
                  <div
                    className="h-full bg-orange-500/80 rounded-full"
                    style={{
                      width: `${(b.num_jobs / maxJobsInBucket) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-24 text-right shrink-0">
                  {b.min_match_percentage}%–{b.max_match_percentage}%
                </span>
                <span className="text-xs text-white w-16 text-right shrink-0">
                  {b.num_jobs} jobs
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </SectionCard>
  );
}

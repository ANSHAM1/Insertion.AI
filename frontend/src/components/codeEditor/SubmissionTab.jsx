import React from "react";
import { CheckCircle2 } from "lucide-react";

import { LANGUAGES } from "../../constants/codeTemplates";

export default function SubmissionTab({ metadata, lastResultIsCurrent }) {
  if (!lastResultIsCurrent) {
    return (
      <p className="text-sm text-gray-500">
        No submissions yet for this problem.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-emerald-400">
      <CheckCircle2 size={16} />

      {metadata.status}

      <span>•</span>

      <span>{metadata.score}/100</span>

      <span>•</span>

      <span>
        {LANGUAGES.find((language) => language.id === metadata.language)
          ?.label || metadata.language}
      </span>
    </div>
  );
}

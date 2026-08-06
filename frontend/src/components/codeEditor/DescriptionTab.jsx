import React, { useMemo, useState } from "react";
import { ChevronDown, Tags } from "lucide-react";

function cleanText(text = "") {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*\*/g, "")
    .trim();
}

export default function DescriptionTab({ question }) {
  const [showTags, setShowTags] = useState(false);

  const summary = useMemo(
    () => cleanText(question.summary || ""),
    [question.summary],
  );

  const statement = useMemo(
    () => cleanText(question.statement || ""),
    [question.statement],
  );

  return (
    <>
      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
        {statement}
      </p>

      <div className="space-y-3">
        {(question.examples || []).map((example, index) => (
          <div
            key={index}
            className="bg-[#141416] border border-[#232326] rounded-xl p-3 text-sm"
          >
            <p className="text-gray-500 text-xs mb-1">Example {index + 1}</p>

            <p className="text-gray-300">
              <span className="text-gray-500">Input: </span>
              {example.input}
            </p>

            <p className="text-gray-300 mt-1">
              <span className="text-gray-500">Output: </span>
              {example.output}
            </p>
          </div>
        ))}
      </div>

      {question.constraints?.length > 0 && (
        <div className="pt-2 border-t border-[#1c1c1f]">
          <p className="text-gray-500 text-xs mb-2">Constraints</p>

          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
            {question.constraints.map((constraint, index) => (
              <li key={index}>{cleanText(constraint)}</li>
            ))}
          </ul>
        </div>
      )}

      {(question.topics || []).length > 0 && (
        <div className="pt-2 border-t border-[#1c1c1f]">
          <button
            onClick={() => setShowTags((v) => !v)}
            className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Tags size={14} />
              Tags ({question.topics.length})
            </span>

            <ChevronDown
              size={15}
              className={`transition-transform ${showTags ? "rotate-180" : ""}`}
            />
          </button>

          {showTags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {question.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] text-gray-400 bg-white/5 border border-[#232326] px-2.5 py-1 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

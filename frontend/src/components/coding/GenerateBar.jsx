import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { MAX_KEYWORDS } from "../../constants/constants";

export default function GenerateBar({ loading, onGenerate }) {
  const [promptInput, setPromptInput] = useState("");

  const keywordCount = promptInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  const handleKeyDown = (e) => {
    if (e.key === "," && keywordCount >= MAX_KEYWORDS) {
      e.preventDefault();
    }
  };

  const handleClick = () => {
    if (loading) return;
    onGenerate(promptInput.trim());
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={120}
          placeholder="Keywords, e.g. dp, graphs"
          className="bg-[#1a1a1c] border border-[#232326] focus:border-[#3a3a3e] text-sm text-gray-200 placeholder-gray-600 rounded-lg pl-3 pr-12 py-2 outline-none w-56 sm:w-64 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-600">
          {keywordCount}/{MAX_KEYWORDS}
        </span>
      </div>

      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-1.5 bg-[#1a1a1c] hover:bg-[#212124] border border-[#232326] text-gray-200 text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={14} className="text-orange-500 animate-spin" />
        ) : (
          <Sparkles size={14} className="text-orange-500" />
        )}
        Generate
      </button>
    </div>
  );
}

const DIFFICULTY_ROW_STYLE = {
  Easy: {
    border: "border-l-2 border-l-emerald-500/70",
    bg: "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]",
    dot: "bg-emerald-500",
  },
  Medium: {
    border: "border-l-2 border-l-amber-500/70",
    bg: "bg-amber-500/[0.04] hover:bg-amber-500/[0.07]",
    dot: "bg-amber-500",
  },
  Hard: {
    border: "border-l-2 border-l-red-500/70",
    bg: "bg-red-500/[0.04] hover:bg-red-500/[0.07]",
    dot: "bg-red-500",
  },
};

export function difficultyStyle(level) {
  const key = ["Easy", "Medium", "Hard"].find(
    (d) => d.toLowerCase() === String(level || "").toLowerCase(),
  );
  return (
    DIFFICULTY_ROW_STYLE[key] || {
      border: "border-l-2 border-l-[#2a2a2e]",
      bg: "",
      dot: "bg-gray-500",
    }
  );
}

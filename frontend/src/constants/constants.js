export const MOCK_DIFFICULTY_STATS = {
  Easy: { solved: 18, total: 25 },
  Medium: { solved: 11, total: 30 },
  Hard: { solved: 3, total: 15 },
};

export const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"];

export const DIFFICULTY_COLOR = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

export const MAX_KEYWORDS = 5;
export const PAGE_SIZE = 10;

// Fixed number of slots reserved in the language stats grid so the
// component's footprint never changes as new languages are added.
export const MAX_LANGUAGE_SLOTS = 10;

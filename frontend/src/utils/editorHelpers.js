export function difficultyStyle(level) {
  switch (level) {
    case "Easy":
      return {
        dot: "bg-emerald-500",
        border: "border-emerald-500/20",
        bg: "",
        badge:
          "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
      };

    case "Medium":
      return {
        dot: "bg-amber-500",
        border: "border-amber-500/20",
        bg: "",
        badge: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
      };

    case "Hard":
      return {
        dot: "bg-red-500",
        border: "border-red-500/20",
        bg: "",
        badge: "bg-red-500/10 border border-red-500/20 text-red-400",
      };

    default:
      return {
        dot: "bg-gray-500",
        border: "",
        bg: "",
        badge: "bg-gray-500/10 border border-gray-500/20 text-gray-400",
      };
  }
}

export function statusColor(status) {
  switch (status) {
    case "Accepted":
      return "text-emerald-400";

    case "Wrong Answer":
      return "text-red-400";

    case "Compilation Error":
      return "text-orange-400";

    case "Runtime Error":
      return "text-pink-400";

    case "Time Limit Exceeded":
      return "text-yellow-400";

    default:
      return "text-gray-400";
  }
}

export function formatTestInput(testcase) {
  if (!testcase) return "";

  if (typeof testcase.input === "string") {
    return testcase.input;
  }

  return JSON.stringify(testcase.input, null, 2);
}

export function formatTestOutput(testcase) {
  if (!testcase) return "";

  if (typeof testcase.output === "string") {
    return testcase.output;
  }

  return JSON.stringify(testcase.output, null, 2);
}

import React, { useMemo } from "react";
import { Flame } from "lucide-react";

const MOTIVATION_TIERS = [
  {
    min: 0,
    quotes: [
      "Every streak starts with day one. Go start it.",
      "No streak yet — today's the day that changes.",
      "The board is empty. Fill it in.",
    ],
  },
  {
    min: 1,
    quotes: [
      "Day one is done. Don't stop at one.",
      "You started. Now build on it.",
      "One day in — momentum starts here.",
    ],
  },
  {
    min: 3,
    quotes: [
      "3 days in. This is where most people quit — don't.",
      "You're forming a habit. Keep feeding it.",
      "Three days of proof you can do this daily.",
    ],
  },
  {
    min: 7,
    quotes: [
      "A full week. You came this far — no going back now.",
      "7 days straight. That's not luck, that's discipline.",
      "One week down. The habit is real now.",
    ],
  },
  {
    min: 14,
    quotes: [
      "Two weeks strong. Breaking it now would waste all of it.",
      "14 days of showing up. You're not stopping today.",
      "This streak has outlasted your excuses twice over.",
    ],
  },
  {
    min: 30,
    quotes: [
      "A month unbroken. This is who you are now.",
      "30 days in — you didn't come this far to come this far.",
      "This streak is a month old. Protect it.",
    ],
  },
  {
    min: 60,
    quotes: [
      "60 days. Most people never see this number. You did.",
      "Two months straight — this is elite consistency.",
      "60 days of proof. Don't hand it back for one lazy day.",
    ],
  },
  {
    min: 100,
    quotes: [
      "Triple digits. You're not chasing a habit anymore — you built one.",
      "100 days. This streak is bigger than motivation now.",
      "Four figures away from this being a legend. Keep going.",
    ],
  },
];

function getMotivation(streak) {
  const tier =
    [...MOTIVATION_TIERS].reverse().find((t) => streak >= t.min) ||
    MOTIVATION_TIERS[0];
  const idx = streak % tier.quotes.length;
  return tier.quotes[idx];
}

export default function StreakBox({ current = 0, best = 0 }) {
  const motivation = useMemo(() => getMotivation(current), [current]);

  return (
    <div className="card card-hover p-4 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
              <Flame size={15} className="text-orange-500" />
            </span>
            Current Streak
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-white leading-none">
              {current}
            </span>

            <span className="text-xs font-medium text-text-faint">
              day{current === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-[#232326] bg-[#141416] px-2.5 py-1.5 text-right">
          <p className="text-[9px] uppercase tracking-wide text-text-faint">
            Best
          </p>

          <p className="text-lg font-bold text-emerald-400 leading-tight">
            {best}
            <span className="text-xs text-text-faint ml-0.5">d</span>
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-[#232326] pt-3">
        <p className="text-xs text-text-faint leading-snug line-clamp-2">
          {motivation}
        </p>
      </div>
    </div>
  );
}

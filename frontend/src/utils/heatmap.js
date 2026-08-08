export function heatColor(count) {
  if (!count) return "bg-[#1a1a1c]";
  if (count === 1) return "bg-orange-900/50";
  if (count === 2) return "bg-orange-700/60";
  if (count === 3) return "bg-orange-600/80";
  return "bg-orange-500";
}

function toLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function buildLast3MonthsHeatmap(dailyData) {
  const lookup = new Map((dailyData ?? []).map((d) => [d.date, d.attempts]));
  const today = new Date();
  const months = [];

  for (let offset = 2; offset >= 0; offset--) {
    const monthDate = new Date(
      today.getFullYear(),
      today.getMonth() - offset,
      1,
    );
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - firstDay.getDay());

    const gridEnd = new Date(lastDay);
    gridEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const weeks = [];
    let cursor = new Date(gridStart);

    while (cursor <= gridEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const key = toLocalISODate(cursor);
        const inMonth = cursor.getMonth() === month;
        week.push({ date: key, count: lookup.get(key) ?? 0, inMonth });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    let padIndex = 0;
    while (weeks.length < 6) {
      weeks.push(
        Array.from({ length: 7 }, () => ({
          date: `pad-${year}-${month}-${padIndex++}`,
          count: 0,
          inMonth: false,
        })),
      );
    }

    months.push({
      key: `${year}-${month}`,
      label: firstDay.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      weeks,
    });
  }

  return months;
}
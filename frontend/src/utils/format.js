export function formatTimeLimit(seconds) {
  if (seconds === undefined || seconds === null) return null;
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `${mins} min` : `${seconds}s`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function clampPercent(value: number) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function fundingPercent(collected: number, target: number) {
  if (!target || target <= 0) return 0;
  return clampPercent(Math.round((collected / target) * 1000) / 10);
}

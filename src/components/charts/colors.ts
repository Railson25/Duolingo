export const brand = "#007db8";
export const palette = [
  brand,
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#eab308",
  "#10b981",
  "#fb7185",
  "#60a5fa",
];

export function colorForIndex(i: number) {
  return palette[i % palette.length];
}

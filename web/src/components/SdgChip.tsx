const COLORS = [
  "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2",
  "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E",
  "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A",
];

export default function SdgChip({ n }: { n: number }) {
  return (
    <span
      title={`SDG ${n}`}
      className="inline-flex h-6 min-w-6 items-center justify-center rounded px-1 text-xs font-bold text-white"
      style={{ backgroundColor: COLORS[n - 1] ?? "#64748b" }}
    >
      {n}
    </span>
  );
}
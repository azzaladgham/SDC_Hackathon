export default function ScoreRange({ moderate, fast }: { moderate: number; fast: number }) {
  const lo = Math.min(moderate, fast);
  const hi = Math.max(moderate, fast);
  return (
    <div className="w-40">
      <div className="relative h-2 rounded-full bg-slate-200">
        <div
          className="absolute h-2 rounded-full bg-emerald-500"
          style={{ left: `${lo}%`, width: `${Math.max(hi - lo, 2)}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-slate-600">
        {lo}–{hi} <em className="text-slate-400">(estimate)</em>
      </div>
    </div>
  );
}
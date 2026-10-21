type B = { overlap: number; trendBonus: number; exposurePenalty: number; sdgBoost: number };

const PARTS: { key: keyof B; label: string; color: string }[] = [
  { key: "overlap", label: "Skill overlap", color: "bg-sky-500" },
  { key: "trendBonus", label: "Trend bonus", color: "bg-emerald-500" },
  { key: "sdgBoost", label: "SDG boost", color: "bg-violet-500" },
  { key: "exposurePenalty", label: "Automation penalty", color: "bg-rose-500" },
];

export default function BreakdownBar({ b }: { b: B }) {
  const total = PARTS.reduce((sum, p) => sum + b[p.key], 0) || 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200">
        {PARTS.map((p) => (
          <div key={p.key} className={p.color} style={{ width: `${(b[p.key] / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-600">
        {PARTS.map((p) => (
          <li key={p.key} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${p.color}`} />
            {p.label}: {p.key === "exposurePenalty" ? "-" : "+"}{b[p.key]}
          </li>
        ))}
      </ul>
    </div>
  );
}
import type { SkillTrend } from "../../../shared/types";
import SourceBadge from "./SourceBadge";

export default function TrendChart({ trends, date }: { trends: SkillTrend[]; date: string }) {
  if (trends.length === 0) {
    return <p className="text-sm text-slate-400">No trend data for this date.</p>;
  }

  const sorted = [...trends].sort((a, b) => b.momentum - a.momentum);
  const max = Math.max(...sorted.map((t) => Math.abs(t.momentum)), 0.01);
  const sourceName = sorted[0].sources[0]?.name ?? "unknown";

  return (
    <div>
      <div className="mb-2 flex justify-between text-[11px] text-slate-500">
        <span>← Declining</span>
        <span>Rising →</span>
      </div>

      <ul className="space-y-1">
        {sorted.map((t) => {
          const pct = (Math.abs(t.momentum) / max) * 50;
          const rising = t.momentum >= 0;
          return (
            <li key={t.escoUri} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 truncate text-slate-700">{t.label}</span>
              <div className="relative h-4 flex-1">
                <div className="absolute left-1/2 top-0 h-4 w-px bg-slate-300" />
                <div
                  className={`absolute top-0.5 h-3 rounded ${rising ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={rising
                    ? { left: "50%", width: `${pct}%` }
                    : { right: "50%", width: `${pct}%` }}
                />
              </div>
              <span className={`w-12 shrink-0 text-right ${rising ? "text-emerald-700" : "text-rose-700"}`}>
                {rising ? "+" : ""}{Math.round(t.momentum * 100)}%
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-[11px] text-slate-500">
        Change in mentions, last 3 months vs the 3 months before. <em>(estimate)</em>
      </p>
      <div className="mt-1"><SourceBadge source={sourceName} date={date} /></div>
    </div>
  );
}
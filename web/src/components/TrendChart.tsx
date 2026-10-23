import type { SkillTrend } from "../../../shared/types";
import SourceBadge from "./SourceBadge";

export default function TrendChart({ trends, date }: { trends: SkillTrend[]; date: string }) {
  if (trends.length === 0) {
    return <p className="text-base text-slate-400">No trend data for this date.</p>;
  }

  const sorted = [...trends].sort((a, b) => b.momentum - a.momentum);
  const max = Math.max(...sorted.map((t) => Math.abs(t.momentum)), 0.01);
  const sourceName = sorted[0].sources[0]?.name ?? "unknown";

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-slate-500">
        <span>← Declining</span>
        <span>Rising →</span>
      </div>

      <ul className="space-y-2">
        {sorted.map((t) => {
          const pct = (Math.abs(t.momentum) / max) * 50;
          const rising = t.momentum >= 0;
          return (
            <li key={t.escoUri} className="flex items-center gap-3 text-base">
                            <span className="w-40 shrink-0 text-slate-700 md:w-72">{t.label}</span>
              <div className="relative h-5 flex-1">
                <div className="absolute left-1/2 top-0 h-5 w-px bg-slate-400" />
                <div
                  className={`absolute top-1 h-3 rounded ${rising ? "bg-emerald-400" : "bg-rose-400"}`}
                  style={rising
                    ? { left: "50%", width: `${pct}%` }
                    : { right: "50%", width: `${pct}%` }}
                />
              </div>
              <span className={`w-14 shrink-0 text-right font-semibold ${rising ? "text-emerald-700" : "text-rose-600"}`}>
                {rising ? "+" : ""}{Math.round(t.momentum * 100)}%
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-sm text-slate-500">
        Change in mentions, last 3 months vs the 3 months before. <em>(estimate)</em>
      </p>
      <div className="mt-2"><SourceBadge source={sourceName} date={date} /></div>
    </div>
  );
}
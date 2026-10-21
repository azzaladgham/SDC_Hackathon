import type { Pathway } from "../../../shared/types";
import SdgChip from "./SdgChip";

const COST_LABEL = { free: "Free", low: "Low cost", hrdc: "HRD Corp claimable" } as const;
const COST_STYLE = {
  free: "bg-emerald-100 text-emerald-800",
  low: "bg-amber-100 text-amber-800",
  hrdc: "bg-sky-100 text-sky-800",
} as const;

export default function PathwayView({ pathway }: { pathway: Pathway }) {
  if (pathway.steps.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No courses needed. You already have the essential skills for this role.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-slate-600">{pathway.steps.length} steps</span>
        <span className="text-sm font-semibold">
          Total: {pathway.totalHours} hours <em className="font-normal text-slate-400">(estimate)</em>
        </span>
      </div>

      <ol className="mt-3 space-y-2">
        {pathway.steps.map((step, i) => (
          <li key={step.course.id} className="rounded-lg border bg-white p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <a href={step.course.url} target="_blank" rel="noreferrer"
                  className="font-medium text-emerald-700 hover:underline">
                  {step.course.title}
                </a>
                <div className="text-xs text-slate-500">
                  {step.course.provider} · {step.course.hours} hours · teaches {step.course.teaches.join(", ")}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <span className={`rounded px-2 py-0.5 text-xs ${COST_STYLE[step.course.cost]}`}>
                    {COST_LABEL[step.course.cost]}
                  </span>
                  {step.sdgs.map((n) => <SdgChip key={n} n={n} />)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
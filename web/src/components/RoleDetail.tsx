import { useEffect, useState } from "react";
import type { MatchResult, Pathway, Scenario } from "../../../shared/types";
import { getPathway } from "../api";
import PathwayView from "./PathwayView";
import BreakdownBar from "./BreakdownBar";
import ScoreRange from "./ScoreRange";
import SdgChip from "./SdgChip";
import SourceBadge from "./SourceBadge";
import { titleCase } from "../utils";

type Props = { match: MatchResult; scenario: Scenario; onBack: () => void };

export default function RoleDetail({ match, scenario, onBack }: Props) {
  const { role, score, breakdown, haveSkills, gapSkills, snapshotDate } = match;
  const [pathway, setPathway] = useState<Pathway | null>(null);

useEffect(() => {
  setPathway(null);
  getPathway(gapSkills, role.sdgs).then(setPathway);
}, [match]);

  return (
    <div>
      <button onClick={onBack} className="text-sm text-emerald-700 hover:underline">
        ← Back to ranked roles
      </button>

      <h2 className="mt-3 text-2xl font-bold">{titleCase(role.title)}</h2>
      <div className="text-sm text-slate-500">{role.group}</div>

      <section className="mt-4 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-emerald-600">{score[scenario]}</div>
            <div className="text-xs text-slate-500">
              {scenario} scenario <em>(estimate)</em>
            </div>
          </div>
          <ScoreRange moderate={score.moderate} fast={score.fast} />
        </div>
      </section>

      <section className="mt-3 rounded-lg border bg-white p-4">
        <h3 className="mb-2 font-semibold">Why this score</h3>
        <BreakdownBar b={breakdown} />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 font-semibold text-emerald-700">Skills you have</h3>
          {haveSkills.length === 0 ? (
            <p className="text-sm text-slate-400">None matched yet</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {haveSkills.map((s) => <li key={s}>✓ {s}</li>)}
            </ul>
          )}
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 font-semibold text-rose-700">Skills to learn</h3>
          {gapSkills.length === 0 ? (
            <p className="text-sm text-slate-400">No gaps. You're ready.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {gapSkills.map((s) => <li key={s}>+ {s}</li>)}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-3 rounded-lg border bg-white p-4">
        <h3 className="mb-2 font-semibold">Linked UN SDGs</h3>
        {role.sdgs.length === 0 ? (
          <p className="text-sm text-slate-400">SDG mapping pending</p>
        ) : (
          <div className="flex gap-1">{role.sdgs.map((n) => <SdgChip key={n} n={n} />)}</div>
        )}
      </section>
        <section className="mt-3 rounded-lg border bg-white p-4">
            <h3 className="mb-2 font-semibold">Your reskilling pathway</h3>
            {pathway ? <PathwayView pathway={pathway} /> : <p className="text-sm text-slate-400">Loading pathway...</p>}
      </section>
      <div className="mt-3">
        <SourceBadge source="mock data" date={snapshotDate} />
      </div>
    </div>
  );
}
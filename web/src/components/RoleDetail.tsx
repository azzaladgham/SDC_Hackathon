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

const BOX = "rounded-2xl border-2 border-emerald-400/50 bg-amber-50 p-5 shadow-md";
const HEADING = "font-display mb-2 text-2xl text-teal-900";

export default function RoleDetail({ match, scenario, onBack }: Props) {
  const { role, score, breakdown, haveSkills, gapSkills, snapshotDate } = match;
  const [pathway, setPathway] = useState<Pathway | null>(null);

  useEffect(() => {
    setPathway(null);
    getPathway(gapSkills, role.sdgs).then(setPathway);
  }, [match]);

  return (
    <div>
      <button onClick={onBack} className="text-lg font-semibold text-[#FFDE42] hover:underline">
        ← Back to ranked roles
      </button>

      <h2 className="font-display mt-3 text-4xl text-teal-900">{titleCase(role.title)}</h2>
      <div className="text-base text-slate-500">{role.group}</div>

      <section className={`mt-4 ${BOX}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-emerald-700">{score[scenario]}</div>
            <div className="text-sm text-slate-500">
              {scenario} scenario <em>(estimate)</em>
            </div>
          </div>
          <ScoreRange moderate={score.moderate} fast={score.fast} />
        </div>
      </section>

      <section className={`mt-3 ${BOX}`}>
        <h3 className={HEADING}>Why this score</h3>
        <BreakdownBar b={breakdown} />
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={BOX}>
          <h3 className="font-display mb-2 text-2xl text-emerald-700">Skills you have</h3>
          {haveSkills.length === 0 ? (
            <p className="text-base text-slate-400">None matched yet</p>
          ) : (
            <ul className="space-y-1 text-base">
              {haveSkills.map((s) => <li key={s}>✓ {s}</li>)}
            </ul>
          )}
        </div>
        <div className={BOX}>
          <h3 className="font-display mb-2 text-2xl text-rose-700">Skills to learn</h3>
          {gapSkills.length === 0 ? (
            <p className="text-base text-slate-400">No gaps. You're ready.</p>
          ) : (
            <ul className="space-y-1 text-base">
              {gapSkills.map((s) => <li key={s}>+ {s}</li>)}
            </ul>
          )}
        </div>
      </section>

      <section className={`mt-3 ${BOX}`}>
        <h3 className={HEADING}>Linked UN SDGs</h3>
        {role.sdgs.length === 0 ? (
          <p className="text-base text-slate-400">SDG mapping pending</p>
        ) : (
          <div className="flex gap-1">{role.sdgs.map((n) => <SdgChip key={n} n={n} />)}</div>
        )}
      </section>

      <section className={`mt-3 ${BOX}`}>
        <h3 className={HEADING}>Your reskilling pathway</h3>
        {pathway ? <PathwayView pathway={pathway} /> : <p className="text-base text-slate-400">Loading pathway...</p>}
      </section>

      <div className="mt-3">
        <SourceBadge source="mock data" date={snapshotDate} />
      </div>
    </div>
  );
}
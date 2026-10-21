import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { MatchResult, Scenario } from "../../shared/types";
import { getMatches, getSnapshots } from "./api";
import ScoreRange from "./components/ScoreRange";
import SourceBadge from "./components/SourceBadge";
import SdgChip from "./components/SdgChip";
import RoleDetail from "./components/RoleDetail";
import { titleCase } from "./utils";

function App() {
  const [dates, setDates] = useState<string[]>([]);
  const [snapshot, setSnapshot] = useState("2026-10-20");
  const [scenario, setScenario] = useState<Scenario>("moderate");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { getSnapshots().then(setDates); }, []);
  useEffect(() => { getMatches("p1", snapshot).then(setMatches); }, [snapshot]);

  const ranked = [...matches].sort((a, b) => b.score[scenario] - a.score[scenario]);
  const selectedMatch = ranked.find((r) => r.role.title === selected);

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-600">Future Skills Navigator</h1>

      <div className="mt-4 flex gap-3 items-center">
        {(["moderate", "fast"] as Scenario[]).map((s) => (
          <button key={s} onClick={() => setScenario(s)}
            className={`px-3 py-1 rounded-full border ${scenario === s ? "bg-emerald-600 text-white" : "bg-white"}`}>
            {s}
          </button>
        ))}
        <select value={snapshot} onChange={(e) => setSnapshot(e.target.value)}
          className="ml-auto border rounded px-2 py-1 bg-white">
          {dates.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="mt-4">
        {selectedMatch ? (
          <RoleDetail match={selectedMatch} scenario={scenario} onBack={() => setSelected(null)} />
        ) : (
          <>
            <ul className="space-y-2">
              {ranked.map((r, i) => (
                <motion.li layout key={r.role.title}
                  onClick={() => setSelected(r.role.title)}
                  className="bg-white border rounded-lg p-3 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-500">
                  <div>
                    <div className="font-medium">{i + 1}. {titleCase(r.role.title)}</div>
                    <div className="text-xs text-slate-500">{r.role.group}</div>
                    <div className="mt-1 flex gap-1">
                      {r.role.sdgs.map((n) => <SdgChip key={n} n={n} />)}
                    </div>
                  </div>
                  <ScoreRange moderate={r.score.moderate} fast={r.score.fast} />
                </motion.li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="mock data" date={snapshot} /></div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
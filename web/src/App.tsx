import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { MatchResult, Profile, Scenario, SkillTrend } from "../../shared/types";
import { getMatches, getProfiles, getSnapshots, getTrends } from "./api";
import ScoreRange from "./components/ScoreRange";
import SourceBadge from "./components/SourceBadge";
import SdgChip from "./components/SdgChip";
import RoleDetail from "./components/RoleDetail";
import ProfilePicker from "./components/ProfilePicker";
import NameScreen from "./components/NameScreen";
import CountryScreen from "./components/CountryScreen";
import TrendChart from "./components/TrendChart";
import IntakeForm from "./components/IntakeForm";
import { titleCase } from "./utils";

function App() {
  const [dates, setDates] = useState<string[]>([]);
  const [snapshot, setSnapshot] = useState("2026-10-21");
  const [scenario, setScenario] = useState<Scenario>("moderate");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sdgWeight, setSdgWeight] = useState(0);
  const [name, setName] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [trends, setTrends] = useState<SkillTrend[]>([]);

  useEffect(() => { getSnapshots().then(setDates); getProfiles().then(setProfiles); }, []);
  useEffect(() => {
    if (profile) getMatches(profile.id, snapshot).then(setMatches);
  }, [profile, snapshot]);
  useEffect(() => { getTrends(snapshot).then(setTrends); }, [snapshot]);

  const adjusted = (m: MatchResult) => m.score[scenario] + sdgWeight * m.breakdown.sdgBoost;
  const ranked = [...matches].sort((a, b) => adjusted(b) - adjusted(a));
  const selectedMatch = ranked.find((r) => r.role.title === selected);


  if (!name) return <NameScreen onNext={setName} />;
  if (!country)
    return <CountryScreen name={name} onNext={setCountry} onBack={() => setName(null)} />;
  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-xl mx-auto">
      <h1 className="font-display text-4xl text-teal-800">Future Skills Navigator</h1>

      {!profile ? (
        <div className="mt-6 space-y-4">
          <ProfilePicker profiles={profiles} onPick={setProfile} />
          <IntakeForm onSubmit={setProfile} />
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-600">For: <b>{profile.name}</b></span>
            <button onClick={() => { setProfile(null); setSelected(null); }}
              className="text-emerald-700 hover:underline">Change profile</button>
          </div>

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
          <div className="mt-4 rounded-lg border bg-white p-3">
            <h3 className="mb-2 text-sm font-semibold">Future Skills Radar</h3>
            <TrendChart trends={trends} date={snapshot} />
          </div>
                      <div className="mt-4 rounded-lg border bg-white p-3">
            <label className="flex items-center justify-between text-sm font-medium">
              <span>SDG priority</span>
              <span className="text-xs font-normal text-slate-500">
                {sdgWeight === 0 ? "Off" : `x${sdgWeight}`}
              </span>
            </label>
            <input
              type="range" min={0} max={3} step={1}
              value={sdgWeight}
              onChange={(e) => setSdgWeight(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
            />
            <p className="mt-1 text-xs text-slate-500">
              Move right to rank roles that contribute more to the UN SDGs higher.
            </p>
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
        </>
      )}
    </div>
  );
}

export default App;
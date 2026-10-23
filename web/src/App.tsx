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
import SkillsScreen from "./components/SkillsScreen";
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
    if (profile) getMatches(profile.id, snapshot, profile.skills).then(setMatches);
  }, [profile, snapshot]);
  useEffect(() => { getTrends(snapshot).then(setTrends); }, [snapshot]);

  const adjusted = (m: MatchResult) => m.score[scenario] + sdgWeight * m.breakdown.sdgBoost;
  const ranked = [...matches].sort((a, b) => adjusted(b) - adjusted(a));
  const selectedMatch = ranked.find((r) => r.role.title === selected);


    if (!name)
    return (
      <NameScreen
        onNext={setName}
        profiles={profiles}
        onSample={(p) => {
          setName(p.name.split(",")[0]);
          setCountry("MY");
          setProfile(p);
        }}
      />
    );
  if (!country)
    return <CountryScreen name={name} onNext={setCountry} onBack={() => setName(null)} />;
    if (!profile)
    return (
      <SkillsScreen
        name={name}
        country={country}
        onSubmit={setProfile}
        onBack={() => setCountry(null)}
      />
    );
  return (
      <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-4xl text-teal-900 md:text-5xl">
        {name}'s future map
      </h1>

      {!profile ? (
        <div className="mt-6 space-y-4">
          <ProfilePicker profiles={profiles} onPick={setProfile} />
          <IntakeForm onSubmit={setProfile} />
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between text-lg">
            <span className="text-teal-900/80">For: <b>{profile.name}</b></span>
            <button onClick={() => { setProfile(null); setSelected(null); }}
              className="font-semibold text-teal-800 hover:underline">Change profile</button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {(["moderate", "fast"] as Scenario[]).map((s) => (
              <button key={s} onClick={() => setScenario(s)}
                className={`rounded-full border-2 border-teal-900 px-5 py-2 text-lg capitalize ${
                  scenario === s ? "bg-teal-900 text-white" : "bg-amber-50"
                }`}>
                {s}
              </button>
            ))}
            <select value={snapshot} onChange={(e) => setSnapshot(e.target.value)}
              className="ml-auto rounded-xl border-2 border-teal-900 bg-amber-50 px-4 py-2 text-lg">
              {dates.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="mt-6 rounded-2xl border-2 border-teal-900 bg-amber-50 p-5 shadow-md">
            <h3 className="font-display mb-3 text-2xl text-teal-900">Future Skills Radar</h3>
            <TrendChart trends={trends} date={snapshot} />
          </div>
                    <div className="mt-4 rounded-2xl border-2 border-teal-900 bg-amber-50 p-5 shadow-md">
            <label className="flex items-center justify-between text-lg font-bold">
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
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-teal-900 bg-amber-50 p-4 shadow-md hover:bg-white">
                      <div>
                        <div className="font-display text-xl text-teal-900">{i + 1}. {titleCase(r.role.title)}</div>
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
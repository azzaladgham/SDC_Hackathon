import { useState } from "react";
import type { Profile } from "../../../shared/types";
import { INTEREST_OPTIONS, SKILL_OPTIONS } from "../mocks/skills";

type Props = { onSubmit: (p: Profile) => void };

export default function IntakeForm({ onSubmit }: Props) {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const matches = SKILL_OPTIONS.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && !skills.includes(s)
  );

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-semibold">Or enter your own skills</h3>
      <p className="mt-1 text-xs text-slate-500">
        Don't enter real personal data. Pick skills from the list.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search skills, e.g. Python"
        className="mt-3 w-full rounded border px-2 py-1 text-sm"
      />

      <div className="mt-2 flex flex-wrap gap-1">
        {matches.slice(0, 8).map((s) => (
          <button key={s} onClick={() => setSkills(toggle(skills, s))}
            className="rounded border px-2 py-0.5 text-xs hover:border-emerald-500">
            + {s}
          </button>
        ))}
        {matches.length === 0 && (
          <span className="text-xs text-slate-400">No matching skills</span>
        )}
      </div>

      <div className="mt-3 text-xs font-semibold text-slate-600">Your skills</div>
      <div className="mt-1 flex flex-wrap gap-1">
        {skills.length === 0 && <span className="text-xs text-slate-400">None yet</span>}
        {skills.map((s) => (
          <button key={s} onClick={() => setSkills(toggle(skills, s))}
            className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
            {s} ✕
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs font-semibold text-slate-600">Your interests</div>
      <div className="mt-1 flex flex-wrap gap-1">
        {INTEREST_OPTIONS.map((i) => (
          <button key={i} onClick={() => setInterests(toggle(interests, i))}
            className={`rounded-full border px-2 py-0.5 text-xs ${
              interests.includes(i) ? "bg-emerald-600 text-white" : "bg-white"
            }`}>
            {i}
          </button>
        ))}
      </div>

      <button
        disabled={skills.length === 0}
        onClick={() => onSubmit({ id: "custom", name: "Your profile", skills, interests })}
        className="mt-4 w-full rounded bg-emerald-600 py-2 text-sm font-semibold text-white disabled:bg-slate-300">
        See my matching roles
      </button>
    </div>
  );
}
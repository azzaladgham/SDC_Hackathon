import type { Profile } from "../../../shared/types";

type Props = { profiles: Profile[]; onPick: (p: Profile) => void };

export default function ProfilePicker({ profiles, onPick }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold">Who are you today?</h2>
      <p className="mt-1 text-sm text-slate-600">
        Pick a sample profile to see which future roles fit you. These are synthetic
        profiles, not real people.
      </p>
      <ul className="mt-4 space-y-3">
        {profiles.map((p) => (
          <li key={p.id}>
            <button onClick={() => onPick(p)}
              className="w-full rounded-lg border bg-white p-4 text-left hover:border-emerald-500">
              <div className="font-semibold">{p.name}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.skills.map((s) => (
                  <span key={s} className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800">{s}</span>
                ))}
              </div>
              <div className="mt-1 text-xs text-slate-500">Interests: {p.interests.join(", ")}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
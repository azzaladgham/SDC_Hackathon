import { useState } from "react";
import type { Profile } from "../../../shared/types";

type Props = {
  onNext: (name: string) => void;
  profiles?: Profile[];
  onSample?: (p: Profile) => void;
};

export default function NameScreen({ onNext, profiles = [], onSample }: Props)  {
  const [name, setName] = useState("");
  const ready = name.trim().length > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
        A little introduction · 01 / 03
      </p>

      <h1 className="font-display mt-6 text-6xl leading-tight text-teal-900 md:text-7xl">
        A future that <span className="text-teal-600">fits you.</span>
      </h1>
      <p className="mt-4 text-xl text-teal-900/80">
        A friendly little compass for all the things you could do next.
      </p>

      <div className="mt-8 max-w-xl rounded-2xl border-2 border-teal-900 bg-amber-50 p-5 text-lg shadow-md">
        Hey, I'm <b>Scout</b>! I'm here to help you find a next step that feels like{" "}
        <b>you</b>. First, what should I call you?
      </div>

      <label className="mt-6 block text-sm font-bold uppercase tracking-widest text-teal-800">
        What should we call you?
      </label>
      <div className="mt-2 flex max-w-xl gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ready && onNext(name.trim())}
          placeholder="Type your first name"
          className="flex-1 rounded-xl border-2 border-teal-900 bg-amber-50 px-5 py-4 text-xl placeholder:text-teal-900/50"
        />
        <button
          onClick={() => ready && onNext(name.trim())}
          disabled={!ready}
          className="rounded-xl bg-teal-900 px-7 text-2xl text-white disabled:bg-slate-300"
          aria-label="Next"
        >
          →
        </button>
      </div>
      <p className="mt-3 text-sm text-teal-900/70">
                No account needed. Don't enter real personal data. Your profile stays in this browser tab.
      </p>

      {profiles.length > 0 && onSample && (
        <section className="mt-12 rounded-2xl border-2 border-teal-900 bg-amber-50 p-6 shadow-md">
          <div className="text-sm font-bold uppercase tracking-widest text-rose-600">
            Curious? Try a character
          </div>
          <h2 className="font-display mt-1 text-3xl text-teal-900 md:text-4xl">
            Take a peek at someone else's map.
          </h2>
          <p className="mt-2 text-lg text-teal-900/80">
            Explore a sample profile before you make your own. These are synthetic, not real people.
          </p>

          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {profiles.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => onSample(p)}
                  className="h-full w-full rounded-xl border-2 border-teal-900 bg-white p-5 text-left transition hover:-translate-y-1"
                >
                  <div className="font-display text-2xl text-teal-900">{p.name.split(",")[0]}</div>
                  <div className="mt-1 text-base text-teal-900/80">
                    {p.name.split(",").slice(1).join(",").trim()}
                  </div>
                  <div className="mt-3 text-sm text-teal-900/70">{p.skills.join(" · ")}</div>
                  <div className="mt-4 text-base font-bold text-teal-900">Explore their path →</div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
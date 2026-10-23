import { useState } from "react";
import { motion } from "framer-motion";
import type { Profile } from "../../../shared/types";

type Props = {
  onNext: (name: string) => void;
  profiles?: Profile[];
  onSample?: (p: Profile) => void;
};

export default function NameScreen({ onNext, profiles = [], onSample }: Props)  {
  const [name, setName] = useState("");
  const ready = name.trim().length > 0;
    // preload so the swap has no flash
  new Image().src = "/characters/scout2.png";

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

                  <div className="mt-8 flex flex-col items-center gap-1 md:flex-row md:items-center md:gap-2">
        <div className="relative max-w-xl rounded-2xl border-2 border-teal-900 bg-amber-50 p-5 text-lg shadow-md">
          Hey, I'm <b>Scout</b>! I'm here to help you find a next step that feels like{" "}
          <b>you</b>. First, what should I call you?
          <span className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-teal-900 bg-amber-50 md:block" />
        </div>

        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={ready ? "/characters/scout2.png" : "/characters/scout1.png"}
            alt="Scout, your skills sidekick"
            className="h-48 w-auto md:h-56"
          />
                    <span className="relative -mt-5 rounded-full border-2 border-teal-900 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-900">
            Scout · your skills sidekick
          </span>
        </motion.div>
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
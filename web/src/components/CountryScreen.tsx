type Country = { code: string; name: string; note: string };

export const COUNTRIES: Country[] = [
  { code: "MY", name: "Malaysia", note: "HRD Corp courses available" },
  { code: "SG", name: "Singapore", note: "Local data coming soon" },
  { code: "ID", name: "Indonesia", note: "Local data coming soon" },
  { code: "GLOBAL", name: "Global", note: "Worldwide trend data (arXiv + Hacker News)" },
];

type Props = {
  name: string;
  onNext: (countryCode: string) => void;
  onBack: () => void;
};

export default function CountryScreen({ name, onNext, onBack }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
        A little introduction · 02 / 03
      </p>

      <h1 className="font-display mt-6 text-5xl leading-tight text-teal-900 md:text-6xl">
        Where are you based, <span className="text-teal-600">{name}</span>?
      </h1>
      <p className="mt-4 max-w-2xl text-xl text-teal-900/80">
        Job markets and AI disruption differ between countries. Pick yours so the
        results can reflect it.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {COUNTRIES.map((c) => (
          <li key={c.code}>
            <button
              onClick={() => onNext(c.code)}
              className="w-full rounded-2xl border-2 border-emerald-400/50 bg-amber-50 p-6 text-left shadow-md transition hover:-translate-y-1 hover:bg-emerald-900"
            >
              <div className="font-display text-3xl text-[#FFF78D]">{c.name}</div>
              <div className="mt-2 text-base text-teal-900/70">{c.note}</div>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm text-teal-900/70">
        Where we have no local data yet, we say so and use global data instead.
        We never invent numbers.
      </p>

      <button onClick={onBack} className="mt-6 text-lg font-semibold text-teal-800 hover:underline">
        ← Back
      </button>
    </div>
  );
}
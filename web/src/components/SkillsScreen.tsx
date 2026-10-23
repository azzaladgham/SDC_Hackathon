import { useState } from "react";
import type { Profile } from "../../../shared/types";
import { INTEREST_OPTIONS } from "../mocks/skills";

// PLACEHOLDER fields and skills. Replace with ESCO skill groups once Role A provides labels.
const FIELDS: Record<string, string[]> = {
  "ICT": ["Python", "Git", "SQL", "Machine learning", "Cloud deployment", "Software testing", "Networking", "Risk assessment", "Incident response", "Data visualisation", "Statistics"],
  "Finance": ["Excel", "Financial reporting", "Bookkeeping", "Forecasting", "Payroll software", "Statistics"],
  "Education": ["Presentation", "Communication", "Digital pedagogy"],
  "Creative": ["Visual design", "Motion graphics", "Presentation"],
  "Customer & admin": ["Communication", "CRM tools", "Excel"],
};

type Props = {
  name: string;
  country: string;
  onSubmit: (p: Profile) => void;
  onBack: () => void;
};

export default function SkillsScreen({ name, country, onSubmit, onBack }: Props) {
  const [field, setField] = useState<string>("ICT");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [cvName, setCvName] = useState<string | null>(null);
  const [cvText, setCvText] = useState("");

  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
        A little introduction · 03 / 03
      </p>

      <h1 className="font-display mt-6 text-5xl leading-tight text-teal-900 md:text-6xl">
        What are you good at, <span className="text-teal-600">{name}</span>?
      </h1>
      <p className="mt-4 max-w-2xl text-xl text-teal-900/80">
        Pick your field, then tick the skills you already have.
      </p>
            <div className="mt-8 rounded-2xl border-2 border-dashed border-teal-900 bg-white/60 p-5">
        <div className="text-sm font-bold uppercase tracking-widest text-teal-800">
          Or upload a CV
        </div>
        <p className="mt-1 text-base text-teal-900/80">
          Upload a sample CV or paste its text, and we'll fill in your skills for you.
        </p>

        <label className="mt-3 inline-block cursor-pointer rounded-xl border-2 border-teal-900 bg-amber-50 px-5 py-3 text-lg">
          Choose file
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => setCvName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        {cvName && <span className="ml-3 text-base text-teal-900">{cvName}</span>}

        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="...or paste your CV text here"
          rows={4}
          className="mt-3 w-full rounded-xl border-2 border-teal-900 bg-amber-50 px-4 py-3 text-lg placeholder:text-teal-900/50"
        />

        <p className="mt-2 text-sm text-teal-900/70">
          Use synthetic sample CVs only, never a real one. Automatic skill extraction is
          coming soon, so for now please tick your skills below.
        </p>
      </div>
      <div className="mt-8 text-sm font-bold uppercase tracking-widest text-teal-800">Your field</div>
      <div className="mt-2 flex flex-wrap gap-3">
        {Object.keys(FIELDS).map((f) => (
          <button key={f} onClick={() => setField(f)}
            className={`rounded-full border-2 border-teal-900 px-5 py-2 text-lg ${
              field === f ? "bg-teal-900 text-white" : "bg-amber-50"
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 text-sm font-bold uppercase tracking-widest text-teal-800">
        Skills in {field}
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        {FIELDS[field].map((s) => (
          <button key={s} onClick={() => setSkills(toggle(skills, s))}
            className={`rounded-xl border-2 border-teal-900 px-4 py-2 text-lg ${
              skills.includes(s) ? "bg-emerald-600 text-white" : "bg-amber-50"
            }`}>
            {skills.includes(s) ? "✓ " : "+ "}{s}
          </button>
        ))}
      </div>

      <div className="mt-8 text-sm font-bold uppercase tracking-widest text-teal-800">Your interests</div>
      <div className="mt-2 flex flex-wrap gap-3">
        {INTEREST_OPTIONS.map((i) => (
          <button key={i} onClick={() => setInterests(toggle(interests, i))}
            className={`rounded-full border-2 border-teal-900 px-4 py-2 text-lg ${
              interests.includes(i) ? "bg-teal-900 text-white" : "bg-amber-50"
            }`}>
            {i}
          </button>
        ))}
      </div>

      <div className="mt-6 text-lg text-teal-900/80">
        {skills.length} skill{skills.length === 1 ? "" : "s"} selected
      </div>

      <div className="mt-6 flex items-center gap-6">
        <button onClick={onBack} className="text-lg font-semibold text-teal-800 hover:underline">
          ← Back
        </button>
        <button
          disabled={skills.length === 0}
          onClick={() => onSubmit({ id: "custom", name, skills, interests, country } as Profile)}
          className="rounded-xl bg-teal-900 px-8 py-4 text-xl text-white disabled:bg-slate-300">
          See my future roles →
        </button>
      </div>
    </div>
  );
}
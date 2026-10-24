export default function Disclaimer() {
  return (
    <footer className="mx-auto mt-12 max-w-5xl border-t border-emerald-400/30 px-6 py-6 text-sm text-slate-500">
      <p>
        <b className="text-slate-600">AI supports your decision. It doesn't make it.</b>{" "}
        Predictions are estimates based on public data (arXiv, Hacker News, ILO) and may be wrong.
        Scores show a range because nobody knows how fast AI will change jobs.
      </p>
      <p className="mt-2">
        Language model: Claude by Anthropic, used only to explain computed numbers. It never ranks
        roles or invents jobs or courses. Sample profiles are synthetic, not real people.
      </p>
    </footer>
  );
}
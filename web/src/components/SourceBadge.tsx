export default function SourceBadge({ source, date }: { source: string; date: string }) {
  return (
    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
      Source: {source} · {date}
    </span>
  );
}
// scripts/fetch-trends.ts
// Run from the scripts/ folder:
//   npx tsx fetch-trends.ts              -> snapshot "as of" today
//   npx tsx fetch-trends.ts 2026-07-21   -> older snapshot "as of" that date (real data for that window)
//
// For each tracked skill it counts mentions in a RECENT window (3 months up to the as-of date)
// and a PRIOR window (the 3 months before that), from:
//   1. arXiv API   - papers whose text matches any keyword (one OR query per skill)
//   2. HN Algolia  - comments in the "Ask HN: Who is hiring?" threads of each window
// Output: ../data/snapshots/YYYY-MM-DD.json (matches shared/types.ts Snapshot)
//         ../data/raw/trends-YYYY-MM-DD.json (per-source counts, for the README / debugging)

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TRACKED = path.resolve(process.cwd(), "../data/tracked-skills.json");
const SNAP_DIR = path.resolve(process.cwd(), "../data/snapshots");
const RAW_DIR = path.resolve(process.cwd(), "../data/raw");

const MIN_VOLUME = 30; // a source needs at least this many mentions (recent + prior) to count toward momentum
const ARXIV_DELAY_MS = 3100; // arXiv asks for ~1 request per 3 seconds
const HN_DELAY_MS = 150;

type Tracked = { escoUri: string; label: string; keywords: string[] };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- dates ----------
const arg = process.argv[2];
const now = new Date();
const asOf = arg
  ? new Date(`${arg}T00:00:00Z`)
  : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
if (Number.isNaN(asOf.getTime())) {
  console.error(`Bad date "${arg}". Use YYYY-MM-DD.`);
  process.exit(1);
}
const shiftMonths = (d: Date, n: number) => {
  const r = new Date(d);
  r.setUTCMonth(r.getUTCMonth() + n);
  return r;
};
const recentStart = shiftMonths(asOf, -3);
const priorStart = shiftMonths(asOf, -6);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const ymd = (d: Date) => iso(d).replaceAll("-", "");
const secs = (d: Date) => Math.floor(d.getTime() / 1000);

// ---------- http ----------
async function getText(url: string, tries = 3): Promise<string> {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i === tries) throw new Error(`${(err as Error).message} for ${url}`);
      await sleep(1500 * i);
    }
  }
  throw new Error("unreachable");
}

// ---------- arXiv ----------
function arxivUrl(keywords: string[], from: Date, to: Date): string {
  const terms = keywords.map((k) => `all:"${k}"`).join(" OR ");
  const q = `(${terms}) AND submittedDate:[${ymd(from)}0000 TO ${ymd(to)}2359]`;
  return `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(q)}&start=0&max_results=1`;
}

async function arxivCount(keywords: string[], from: Date, to: Date): Promise<number> {
  const xml = await getText(arxivUrl(keywords, from, to));
  const m = xml.match(/<opensearch:totalResults[^>]*>(\d+)</);
  if (!m) throw new Error("arXiv response had no totalResults");
  await sleep(ARXIV_DELAY_MS);
  return Number(m[1]);
}

// ---------- Hacker News ----------
function hnThreadsUrl(from: Date, to: Date): string {
  const filters = `created_at_i>=${secs(from)},created_at_i<${secs(to)}`;
  return (
    "https://hn.algolia.com/api/v1/search_by_date?query=" +
    encodeURIComponent('"Ask HN: Who is hiring"') +
    "&tags=" + encodeURIComponent("story,author_whoishiring") +
    "&numericFilters=" + encodeURIComponent(filters) +
    "&hitsPerPage=50"
  );
}

async function hnThreads(from: Date, to: Date): Promise<{ id: string; title: string }[]> {
  const json = JSON.parse(await getText(hnThreadsUrl(from, to)));
  return (json.hits as any[])
    .filter((h) => /^Ask HN: Who is hiring\?/i.test(h.title ?? ""))
    .map((h) => ({ id: h.objectID as string, title: h.title as string }));
}

async function hnCount(keyword: string, storyId: string): Promise<number> {
  const url =
    "https://hn.algolia.com/api/v1/search?query=" + encodeURIComponent(`"${keyword}"`) +
    "&tags=" + encodeURIComponent(`comment,story_${storyId}`) +
    "&hitsPerPage=0";
  const json = JSON.parse(await getText(url));
  await sleep(HN_DELAY_MS);
  return Number(json.nbHits ?? 0);
}

// A comment that mentions two of a skill's keywords is counted twice. Fine for trends; noted in README.
async function hnSkillCount(keywords: string[], threads: { id: string }[]): Promise<number> {
  let total = 0;
  for (const t of threads) for (const k of keywords) total += await hnCount(k, t.id);
  return total;
}

// ---------- momentum ----------
// Relative change, damped for tiny priors, clamped to [-1, 1].
function relChange(recent: number, prior: number): number {
  const m = (recent - prior) / Math.max(prior, 10);
  return Math.max(-1, Math.min(1, m));
}

function combineMomentum(sources: { recent: number; prior: number }[]): number {
  const usable = sources.filter((s) => s.recent + s.prior >= MIN_VOLUME);
  if (usable.length === 0) return 0;
  const avg = usable.reduce((sum, s) => sum + relChange(s.recent, s.prior), 0) / usable.length;
  return Math.round(avg * 100) / 100;
}

// ---------- main ----------
async function main() {
  const tracked: Tracked[] = JSON.parse(await readFile(TRACKED, "utf8"));
  const fetchedAt = new Date().toISOString();

  console.log(`As of ${iso(asOf)}: recent = ${iso(recentStart)}..${iso(asOf)}, prior = ${iso(priorStart)}..${iso(recentStart)}`);

  const recentThreads = await hnThreads(recentStart, asOf);
  const priorThreads = await hnThreads(priorStart, recentStart);
  console.log(`HN "Who is hiring" threads: ${recentThreads.length} recent, ${priorThreads.length} prior`);
  if (recentThreads.length === 0 || priorThreads.length === 0) {
    console.warn("[warn] Missing HN threads for a window. HN counts will be 0 for that window.");
  }

  const skills: any[] = [];
  const raw: any[] = [];

  for (let i = 0; i < tracked.length; i++) {
    const t = tracked[i];
    process.stdout.write(`[${i + 1}/${tracked.length}] ${t.label} ... `);

    let axRecent = 0, axPrior = 0, hnRecent = 0, hnPrior = 0;
    try {
      axRecent = await arxivCount(t.keywords, recentStart, asOf);
      axPrior = await arxivCount(t.keywords, priorStart, recentStart);
    } catch (err) {
      console.warn(`\n  [arXiv error] ${(err as Error).message}`);
    }
    try {
      hnRecent = await hnSkillCount(t.keywords, recentThreads);
      hnPrior = await hnSkillCount(t.keywords, priorThreads);
    } catch (err) {
      console.warn(`\n  [HN error] ${(err as Error).message}`);
    }

    const momentum = combineMomentum([
      { recent: axRecent, prior: axPrior },
      { recent: hnRecent, prior: hnPrior },
    ]);

    skills.push({
      escoUri: t.escoUri,
      label: t.label,
      momentum,
      mentionsRecent: axRecent + hnRecent,
      mentionsPrior: axPrior + hnPrior,
      sources: [
        { name: "arXiv API (papers matching keywords)", url: arxivUrl(t.keywords, recentStart, asOf), fetchedAt },
        { name: "Hacker News Who is hiring threads (Algolia API)", url: hnThreadsUrl(recentStart, asOf), fetchedAt },
      ],
    });
    raw.push({ label: t.label, keywords: t.keywords, arxiv: { recent: axRecent, prior: axPrior }, hn: { recent: hnRecent, prior: hnPrior }, momentum });

    console.log(`momentum ${momentum} (arXiv ${axRecent}/${axPrior}, HN ${hnRecent}/${hnPrior})`);
  }

  await mkdir(SNAP_DIR, { recursive: true });
  await mkdir(RAW_DIR, { recursive: true });
  const snapPath = path.join(SNAP_DIR, `${iso(asOf)}.json`);
  await writeFile(snapPath, JSON.stringify({ date: iso(asOf), skills }, null, 2));
  await writeFile(
    path.join(RAW_DIR, `trends-${iso(asOf)}.json`),
    JSON.stringify(
      { asOf: iso(asOf), fetchedAt, windows: { recent: [iso(recentStart), iso(asOf)], prior: [iso(priorStart), iso(recentStart)] }, hnThreads: { recent: recentThreads, prior: priorThreads }, skills: raw },
      null,
      2,
    ),
  );
  console.log(`\nWrote ${snapPath}`);
}

main();

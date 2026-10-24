// scripts/parse-ilo-exposure.ts
// Run from the scripts/ folder:
//   npx tsx parse-ilo-exposure.ts                      (reads ~/Downloads/wp140.txt)
//   npx tsx parse-ilo-exposure.ts /path/to/wp140.txt
// Parses ILO Working Paper 140, Table A1 (exposure by 4-digit ISCO-08 occupation)
// into ../data/exposure.json, keyed by ISCO-08 4-digit code.

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "../data/exposure.json");
const input = process.argv[2]
  ? process.argv[2].replace(/^~/, os.homedir())
  : path.join(os.homedir(), "Downloads", "wp140.txt");

// Row example: "Gradient 44132Data Entry Clerks0.70.03"  -> gradient 4, code 4132, mean 0.7, sd 0.03
// Wrapped label example: "Minimal \nExposure2320Vocational Education Teachers0.350.12"
// The mean and SD are glued together, so the lazy match on the mean finds the first valid split.
const ROW = /^(.*?)(\d{4})([A-Za-z].*?)(0\.\d+?|0|1)(0\.\d+|0|1)$/;

type Entry = { title: string; mean: number; sd: number; gradient: string };

async function main() {
  const lines = (await readFile(input, "utf8")).split("\n").map((l) => l.replace(/\r$/, ""));
  const scores: Record<string, Entry> = {};
  const suspicious: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/^(Gradient \d|Exposure)\d{4}/.test(line)) continue;

    // Some occupation names wrap onto the next line(s): glue them back on until the row matches.
    let text = line;
    let m = text.match(ROW);
    for (let j = 1; !m && j <= 2 && i + j < lines.length; j++) {
      if (/^(Gradient \d|Exposure)\d{4}/.test(lines[i + j])) break;
      text += lines[i + j];
      m = text.match(ROW);
    }
    if (!m) {
      suspicious.push(`line ${i + 1}: ${line}`);
      continue;
    }
    const [, prefix, code, titleRaw, meanStr, sdStr] = m;

    let gradient: string;
    if (prefix.startsWith("Gradient")) gradient = prefix.trim(); // "Gradient 4"
    else gradient = `${(lines[i - 1] ?? "").trim()} Exposure`.trim(); // e.g. "Minimal Exposure"

    const mean = Number(meanStr);
    const sd = Number(sdStr);
    if (Number.isNaN(mean) || Number.isNaN(sd) || mean > 1) {
      suspicious.push(`line ${i + 1}: ${line}`);
      continue;
    }
    scores[code] = { title: titleRaw.trim(), mean, sd, gradient };
  }

  const out = {
    source: {
      name: "ILO Working Paper 140 (2025), Generative AI and Jobs: A Refined Global Index of Occupational Exposure, Table A1",
      url: "https://www.ilo.org/node/706766",
      pdfUrl: "https://www.developmentaid.org/api/frontend/cms/file/2025/05/WP140_web.pdf",
      publishedAt: "2025-05",
      note: "mean = mean GenAI exposure score (0..1) for the ISCO-08 4-digit occupation. Exposure is not the same as automation.",
    },
    scores,
  };
  await writeFile(OUT, JSON.stringify(out, null, 2));

  const counts: Record<string, number> = {};
  Object.values(scores).forEach((s) => (counts[s.gradient] = (counts[s.gradient] ?? 0) + 1));
  console.log(`Parsed ${Object.keys(scores).length} occupations -> ${OUT}`);
  console.log("By gradient:", counts);

  // Spot checks against rows you pasted:
  const expect: [string, number][] = [["4132", 0.7], ["4311", 0.64], ["2521", 0.57], ["2320", 0.35], ["2262", 0.33]];
  for (const [code, want] of expect) {
    const got = scores[code]?.mean;
    console.log(`check ${code}: ${got} ${got === want ? "OK" : `MISMATCH (expected ${want})`}`);
  }

  if (suspicious.length) {
    console.warn(`\n${suspicious.length} lines looked like rows but did not parse:`);
    suspicious.slice(0, 15).forEach((s) => console.warn("  " + s));
  }
}

main();

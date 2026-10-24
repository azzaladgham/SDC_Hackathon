// scripts/join-exposure.ts
// Run from the scripts/ folder:
//   npx tsx join-exposure.ts "$HOME/Downloads/ESCO dataset - v1.2.1 - classification - en - csv/occupations_en.csv"
//
// For each role in ../data/esco.json:
//   1. finds its ISCO-08 4-digit code in the ESCO CSV (match by URI, then by title)
//   2. looks up its GenAI exposure score in ../data/exposure.json (ILO WP140)
//      - exact ISCO code if present
//      - otherwise the average of ILO occupations in the same 3-digit (then 2-digit) group, clearly flagged as an estimate
//      - otherwise null
// and writes iscoCode, automationExposure and an exposure{} block (with source + method) back into esco.json.
// Safe to rerun. If you rerun fetch-esco.ts later, rerun this afterwards.

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "csv-parse/sync";

const ESCO = path.resolve(process.cwd(), "../data/esco.json");
const EXPO = path.resolve(process.cwd(), "../data/exposure.json");

type IloEntry = { title: string; mean: number; sd: number; gradient: string };

async function main() {
  const csvArg = process.argv[2];
  if (!csvArg) {
    console.error('Usage: npx tsx join-exposure.ts "<path to occupations_en.csv>"');
    process.exit(1);
  }
  const csvPath = csvArg.replace(/^~/, os.homedir());

  const rows = parse(await readFile(csvPath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const byUri = new Map<string, string>();
  const byLabel = new Map<string, string>();
  for (const r of rows) {
    const isco = (r.iscoGroup ?? "").trim();
    if (!/^\d{4}$/.test(isco)) continue;
    byUri.set(r.conceptUri, isco);
    const label = (r.preferredLabel ?? "").trim().toLowerCase();
    if (label && !byLabel.has(label)) byLabel.set(label, isco);
  }
  console.log(`Read ${rows.length} ESCO occupations from CSV.`);

  const esco = JSON.parse(await readFile(ESCO, "utf8"));
  const expo = JSON.parse(await readFile(EXPO, "utf8")) as {
    source: { name: string; url: string; publishedAt: string };
    scores: Record<string, IloEntry>;
  };
  const codes = Object.keys(expo.scores);

  const summary: string[] = [];
  const counts = { exact: 0, group3: 0, group2: 0, none: 0, noIsco: 0 };

  for (const role of esco.roles) {
    let isco = byUri.get(role.escoUri);
    let iscoMatch = "uri";
    if (!isco) {
      isco = byLabel.get(String(role.title).trim().toLowerCase());
      iscoMatch = "title";
    }

    if (!isco) {
      role.iscoCode = null;
      role.automationExposure = null;
      role.exposure = null;
      counts.noIsco++;
      summary.push(`${role.title} | ISCO: NOT FOUND | exposure: null`);
      continue;
    }

    let value: number | null = null;
    let method = "none";
    let detail = "";
    let gradient: string | null = null;

    const exact = expo.scores[isco];
    if (exact) {
      value = exact.mean;
      method = "ilo-exact";
      gradient = exact.gradient;
      detail = `${exact.title}`;
      counts.exact++;
    } else {
      for (const len of [3, 2]) {
        const prefix = isco.slice(0, len);
        const group = codes.filter((c) => c.startsWith(prefix));
        if (group.length >= 2) {
          const avg = group.reduce((s, c) => s + expo.scores[c].mean, 0) / group.length;
          value = Math.round(avg * 100) / 100;
          method = `ilo-group-average-${len}digit`;
          detail = `average of ${group.length} ILO occupations starting ${prefix}`;
          len === 3 ? counts.group3++ : counts.group2++;
          break;
        }
      }
      if (value === null) counts.none++;
    }

    role.iscoCode = isco;
    role.automationExposure = value;
    role.exposure = {
      value,
      iscoCode: isco,
      iscoMatchedBy: iscoMatch,
      method, // "ilo-exact" is the paper's own score; anything else is an ESTIMATE and should be labelled so in the UI
      detail,
      gradient,
      source: expo.source.name,
      url: expo.source.url,
      publishedAt: expo.source.publishedAt,
    };

    summary.push(`${role.title} | ISCO ${isco} (by ${iscoMatch}) | ${value ?? "null"} | ${method}${detail ? " - " + detail : ""}`);
  }

  esco.iscoSource = {
    name: "ESCO classification v1.2.1 (occupations_en.csv, iscoGroup column)",
    url: "https://esco.ec.europa.eu/en/use-esco/download",
  };

  await writeFile(ESCO, JSON.stringify(esco, null, 2));

  console.log("\n" + summary.join("\n"));
  console.log(
    `\nExact ILO score: ${counts.exact}, 3-digit group estimate: ${counts.group3}, 2-digit group estimate: ${counts.group2}, ` +
      `no score: ${counts.none}, ISCO code not found: ${counts.noIsco}`,
  );
  console.log(`Updated ${ESCO}`);
}

main();

// scripts/swap-roles.ts
// Run from the scripts/ folder:
//   npx tsx swap-roles.ts "$HOME/Downloads/ESCO dataset - v1.2.1 - classification - en - csv"
//
// Removes and adds roles in ../data/esco.json using the ESCO CSV download (no API needed):
//   - occupations_en.csv               -> occupation URI + preferred label
//   - occupationSkillRelations_en.csv  -> essential skills per occupation
// Edit REMOVE and ADD below, then run. Afterwards rerun join-exposure.ts to fill ISCO codes and exposure.

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "csv-parse/sync";

const ESCO = path.resolve(process.cwd(), "../data/esco.json");

// Titles (lowercase) to remove from esco.json:
const REMOVE = ["paper engineer"];

// ESCO preferred labels (exact, case-insensitive) to add:
const ADD: { label: string; group: string }[] = [
  { label: "mechanical engineer", group: "Engineering" },
  { label: "civil engineer", group: "Engineering" },
];

async function readCsv(file: string): Promise<Record<string, string>[]> {
  return parse(await readFile(file, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];
}

async function main() {
  const dirArg = process.argv[2];
  if (!dirArg) {
    console.error('Usage: npx tsx swap-roles.ts "<path to the unzipped ESCO csv folder>"');
    process.exit(1);
  }
  const dir = dirArg.replace(/^~/, os.homedir());

  const occupations = await readCsv(path.join(dir, "occupations_en.csv"));
  const relations = await readCsv(path.join(dir, "occupationSkillRelations_en.csv"));
  console.log(`Read ${occupations.length} occupations and ${relations.length} occupation-skill relations.`);

  const esco = JSON.parse(await readFile(ESCO, "utf8"));
  const fetchedAt = new Date().toISOString();

  // Remove
  const before = esco.roles.length;
  esco.roles = esco.roles.filter((r: any) => !REMOVE.includes(String(r.title).trim().toLowerCase()));
  console.log(`Removed ${before - esco.roles.length} role(s): ${REMOVE.join(", ")}`);

  // Add
  for (const { label, group } of ADD) {
    if (esco.roles.some((r: any) => String(r.title).trim().toLowerCase() === label.toLowerCase())) {
      console.log(`[skip] "${label}" is already in esco.json`);
      continue;
    }
    const occ = occupations.find((o) => (o.preferredLabel ?? "").trim().toLowerCase() === label.toLowerCase());
    if (!occ) {
      const word = label.split(" ").pop()!.toLowerCase();
      const near = occupations
        .map((o) => o.preferredLabel)
        .filter((l) => l && l.toLowerCase().includes(word))
        .slice(0, 12);
      console.warn(`[not found] "${label}". Similar labels:\n  - ${near.join("\n  - ")}`);
      continue;
    }

    const essential = relations.filter((r) => r.occupationUri === occ.conceptUri && r.relationType === "essential");
    for (const r of essential) esco.skillLabels[r.skillUri] = r.skillLabel;

    esco.roles.push({
      escoUri: occ.conceptUri,
      title: occ.preferredLabel,
      group,
      essentialSkills: essential.map((r) => r.skillUri),
      automationExposure: null,
      sdgs: [],
      source: {
        name: "ESCO classification v1.2.1 (CSV: occupations_en, occupationSkillRelations_en)",
        url: "https://esco.ec.europa.eu/en/use-esco/download",
        fetchedAt,
      },
    });
    console.log(`[ok] added "${occ.preferredLabel}" (ISCO ${occ.iscoGroup}) with ${essential.length} essential skills`);
  }

  await writeFile(ESCO, JSON.stringify(esco, null, 2));
  console.log(`\nesco.json now has ${esco.roles.length} roles. Next: rerun join-exposure.ts.`);
}

main();

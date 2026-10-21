// scripts/list-skill-candidates.ts
// Run from the scripts/ folder:  npx tsx list-skill-candidates.ts
// Reads ../data/esco.json and ranks skills by how many occupations list them as essential.
// Prints the top candidates and writes ../data/skill-candidates.json (for reference).

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const IN = path.resolve(process.cwd(), "../data/esco.json");
const OUT = path.resolve(process.cwd(), "../data/skill-candidates.json");
const TOP = 150;

async function main() {
  const esco = JSON.parse(await readFile(IN, "utf8"));
  const counts = new Map<string, { count: number; groups: Set<string> }>();

  for (const role of esco.roles) {
    for (const uri of role.essentialSkills as string[]) {
      const entry = counts.get(uri) ?? { count: 0, groups: new Set<string>() };
      entry.count += 1;
      entry.groups.add(role.group);
      counts.set(uri, entry);
    }
  }

  const ranked = [...counts.entries()]
    .map(([uri, v]) => ({
      escoUri: uri,
      label: esco.skillLabels[uri] ?? uri,
      occupations: v.count,
      groups: [...v.groups].sort(),
    }))
    .sort((a, b) => b.occupations - a.occupations || a.label.localeCompare(b.label));

  console.log(`${ranked.length} unique skills across ${esco.roles.length} occupations. Top ${TOP}:\n`);
  ranked.slice(0, TOP).forEach((s, i) => {
    console.log(`${String(i + 1).padStart(3)}. [${s.occupations}] ${s.label}  (${s.groups.join(", ")})`);
  });

  await writeFile(OUT, JSON.stringify(ranked, null, 2));
  console.log(`\nWrote all ${ranked.length} candidates to ${OUT}`);
}

main();

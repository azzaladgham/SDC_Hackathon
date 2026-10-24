// scripts/fetch-esco.ts
// Run from the scripts/ folder:  npx tsx fetch-esco.ts
// Output: ../data/esco.json  (occupations + essential skill URIs + a uri->label lookup)

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://ec.europa.eu/esco/api";
const OUT = path.resolve(process.cwd(), "../data/esco.json");

// Search terms spread across sectors so all 3 sample profiles have relevant roles.
// ESCO search is fuzzy: we take the top hit and print it so you can eyeball mismatches.
const SEARCH_TERMS: { group: string; term: string }[] = [
  // Tech
  { group: "ICT", term: "software developer" },
  { group: "ICT", term: "web developer" },
  { group: "ICT", term: "data scientist" },
  { group: "ICT", term: "data analyst" },
  { group: "ICT", term: "database administrator" },
  { group: "ICT", term: "ICT security consultant" },
  { group: "ICT", term: "ICT business analyst" },
  { group: "ICT", term: "ICT project manager" },
  { group: "ICT", term: "ICT help desk agent" },
  { group: "ICT", term: "user interface designer" },
  // Finance and shared services
  { group: "Finance", term: "accountant" },
  { group: "Finance", term: "financial analyst" },
  { group: "Finance", term: "auditor" },
  { group: "Finance", term: "accounting clerk" },
  { group: "Finance", term: "payroll clerk" },
  { group: "Finance", term: "credit analyst" },
  { group: "Admin", term: "administrative assistant" },
  { group: "Admin", term: "customer service representative" },
  { group: "Admin", term: "human resources assistant" },
  { group: "Admin", term: "purchasing officer" },
  // Business and operations
  { group: "Business", term: "project manager" },
  { group: "Business", term: "marketing manager" },
  { group: "Business", term: "digital marketing specialist" },
  { group: "Business", term: "supply chain manager" },
  { group: "Business", term: "logistics analyst" },
  // Engineering, health, education, creative
  { group: "Engineering", term: "mechanical engineer" },
  { group: "Engineering", term: "civil engineer" },
  { group: "Health", term: "nurse responsible for general care" },
  { group: "Education", term: "secondary school teacher" },
  { group: "Creative", term: "graphic designer" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string, tries = 3): Promise<any> {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === tries) throw new Error(`Failed ${url}: ${(err as Error).message}`);
      await sleep(1000 * i);
    }
  }
}

const asArray = <T>(x: T | T[] | undefined): T[] => (x === undefined ? [] : Array.isArray(x) ? x : [x]);

async function main() {
  const roles: any[] = [];
  const skillLabels: Record<string, string> = {};
  const fetchedAt = new Date().toISOString();

  for (const { group, term } of SEARCH_TERMS) {
    try {
      const searchUrl = `${BASE}/search?text=${encodeURIComponent(term)}&type=occupation&language=en&limit=1`;
      const search = await getJson(searchUrl);
      const hit = search?._embedded?.results?.[0];
      if (!hit?.uri) {
        console.warn(`[skip] no occupation found for "${term}"`);
        continue;
      }

      const resUrl = `${BASE}/resource/occupation?uri=${encodeURIComponent(hit.uri)}&language=en`;
      const occ = await getJson(resUrl);
      const essential = asArray<any>(occ?._links?.hasEssentialSkill);

      if (essential.length === 0) {
        console.warn(`[warn] "${hit.title}" has no essential skills in the response. Check the JSON shape.`);
      }

      for (const s of essential) {
        if (s.uri) skillLabels[s.uri] = s.title ?? s.uri;
      }

      roles.push({
        escoUri: hit.uri,
        title: occ?.title ?? hit.title,
        iscoCode: String(occ?.code ?? "").split(".")[0], // e.g. "2512.1" -> "2512"
        group,
        essentialSkills: essential.map((s) => s.uri).filter(Boolean),
        // Filled in later by other steps (Day 2 exposure data, SDG map). Not real values yet.
        automationExposure: null,
        sdgs: [],
        source: { name: "ESCO API (resource/occupation)", url: resUrl, fetchedAt },
      });

      console.log(`[ok] "${term}" -> "${occ?.title ?? hit.title}" (${essential.length} essential skills)`);
    } catch (err) {
      console.warn(`[error] "${term}": ${(err as Error).message}`);
    }
    await sleep(300); // be polite to the API
  }


  if (roles.length === 0) {
  console.error("No occupations fetched. Not overwriting existing esco.json.");
  process.exit(1);
}

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ fetchedAt, roles, skillLabels }, null, 2));
  console.log(`\nWrote ${roles.length} occupations and ${Object.keys(skillLabels).length} unique skills to ${OUT}`);
}

main();

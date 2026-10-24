// scripts/build-country-data.ts
// Run from the scripts/ folder:
//   npx tsx build-country-data.ts "<path to EMP_TEMP_SEX_OCU_NB_A....csv>"
//
// Builds ../data/countries.json: employment by ISCO-08 major occupation group (1-digit) per country, latest USABLE year.
//   - Singapore, Philippines, Vietnam (edit COUNTRIES to change): ILOSTAT bulk file EMP_TEMP_SEX_OCU_NB_A
//     (Employment by sex and occupation, thousands), sex = total, ISCO-08.
//     A year is only used if groups 1-9 are all present and (groups + "not classifiable") add up to the total
//     within 1%; otherwise the script tries the previous year.
//   - Malaysia: ILOSTAT's newest ISCO-08 data is 2014, so it is read from ../data/sources/malaysia-dosm.json,
//     filled in by hand from DOSM's Labour Force Report, Table D.
// A role's occupation group is the FIRST DIGIT of its iscoCode in esco.json.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "csv-parse/sync";

const OUT = path.resolve(process.cwd(), "../data/countries.json");
const MALAYSIA = path.resolve(process.cwd(), "../data/sources/malaysia-dosm.json");

// ILOSTAT countries to include (ISO3 code -> display name). Add "IDN": "Indonesia" to include Indonesia (2023 data).
const COUNTRIES: Record<string, string> = {
  SGP: "Singapore",
  PHL: "Philippines",
  VNM: "Vietnam",
};

const GROUP_NAMES: Record<string, string> = {
  "1": "Managers",
  "2": "Professionals",
  "3": "Technicians and associate professionals",
  "4": "Clerical support workers",
  "5": "Service and sales workers",
  "6": "Skilled agricultural, forestry and fishery workers",
  "7": "Craft and related trades workers",
  "8": "Plant and machine operators, and assemblers",
  "9": "Elementary occupations",
  "0": "Armed forces occupations",
  X: "Not classifiable by occupation",
};
const MAIN_GROUPS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const ILOSTAT_PAGE = "https://ilostat.ilo.org/data/bulk/";
const retrievedAt = new Date().toISOString().slice(0, 10);

type GroupRow = { name: string; employed: number; share: number };
type CountryEntry = {
  name: string;
  year: number;
  unit: string;
  totalEmployed: number;
  groups: Record<string, GroupRow>;
  source: { name: string; url: string; retrievedAt: string; note: string };
};

function buildGroups(raw: Record<string, number>, total: number) {
  const groups: Record<string, GroupRow> = {};
  let sum = 0;
  for (const [g, name] of Object.entries(GROUP_NAMES)) {
    const v = raw[g];
    if (v === undefined || Number.isNaN(v)) continue;
    groups[g] = { name, employed: v, share: Math.round((v / total) * 10000) / 10000 };
    sum += v;
  }
  const diff = Math.abs(sum - total) / total;
  return { groups, sum, diff };
}

async function main() {
  const csvArg = process.argv[2];
  if (!csvArg) {
    console.error('Usage: npx tsx build-country-data.ts "<path to EMP_TEMP_SEX_OCU_NB_A csv>"');
    process.exit(1);
  }
  const rows = parse(await readFile(csvArg.replace(/^~/, os.homedir()), "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const countries: Record<string, CountryEntry> = {};

  // ---------- ILOSTAT countries ----------
  for (const [iso, name] of Object.entries(COUNTRIES)) {
    const mine = rows.filter(
      (r) => r.ref_area === iso && r.sex === "SEX_T" && r.classif1.startsWith("OCU_ISCO08_") && r.obs_value !== "",
    );
    const candidates = mine
      .filter((r) => r.classif1 === "OCU_ISCO08_TOTAL")
      .map((r) => ({ year: Number(r.time), source: r.source, total: Number(r.obs_value) }))
      .sort((a, b) => b.year - a.year);

    if (candidates.length === 0) {
      console.warn(`[skip] ${name}: no ISCO-08 data in this file`);
      continue;
    }

    let chosen: { year: number; source: string; total: number; groups: Record<string, GroupRow> } | null = null;
    for (const c of candidates) {
      const raw: Record<string, number> = {};
      for (const r of mine) {
        if (Number(r.time) !== c.year || r.source !== c.source) continue;
        const g = r.classif1.replace("OCU_ISCO08_", "");
        if (g in GROUP_NAMES) raw[g] = Number(r.obs_value);
      }
      const { groups, diff } = buildGroups(raw, c.total);
      const have = MAIN_GROUPS.filter((g) => groups[g]).length;
      if (have === MAIN_GROUPS.length && diff <= 0.01) {
        chosen = { ...c, groups };
        break;
      }
      console.log(`[info] ${name} ${c.year}: not usable (groups 1-9 found: ${have}/9, gap to total ${(diff * 100).toFixed(1)}%), trying earlier year`);
    }

    if (!chosen) {
      console.warn(`[skip] ${name}: no year with a complete set of groups`);
      continue;
    }

    countries[iso] = {
      name,
      year: chosen.year,
      unit: "thousand persons",
      totalEmployed: chosen.total,
      groups: chosen.groups,
      source: {
        name: `ILOSTAT, Employment by sex and occupation (EMP_TEMP_SEX_OCU_NB_A), national Labour Force Survey (source ${chosen.source}), ISCO-08`,
        url: ILOSTAT_PAGE,
        retrievedAt,
        note: "Sex: total. Occupation: ISCO-08 major groups (1-digit). Group X = not classifiable by occupation; shares are of total employment.",
      },
    };
  }

  // ---------- Malaysia (DOSM, entered by hand) ----------
  try {
    const my = JSON.parse(await readFile(MALAYSIA, "utf8"));
    const raw: Record<string, number> = {};
    for (const g of Object.keys(GROUP_NAMES)) if (my.groups?.[g] !== undefined) raw[g] = Number(my.groups[g]);
    const total = Number(my.total ?? Object.values(raw).reduce((a, b) => a + b, 0));
    const { groups, diff } = buildGroups(raw, total);
    if (diff > 0.01) console.warn(`[warn] Malaysia: groups sum differs from total by ${(diff * 100).toFixed(1)}%. Check the numbers you typed.`);
    countries["MYS"] = {
      name: "Malaysia",
      year: Number(my.year),
      unit: my.unit ?? "thousand persons",
      totalEmployed: total,
      groups,
      source: {
        name: my.source?.name,
        url: my.source?.url,
        retrievedAt: my.source?.retrievedAt ?? retrievedAt,
        note: my.source?.note ?? "",
      },
    };
  } catch {
    console.warn(`\n[skip] Malaysia: ${MALAYSIA} not found or unreadable. Create it from DOSM Table D.`);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    note: "Employment by ISCO-08 major occupation group. A role's group is the first digit of its iscoCode in esco.json.",
    countries,
  };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2));

  // Preview: share of employment by group, per country
  console.log(`\nWrote ${Object.keys(countries).length} countries to ${OUT}\n`);
  const order = [...MAIN_GROUPS, "0", "X"];
  console.log("share of employment (%)".padEnd(24) + order.map((g) => `g${g}`.padStart(7)).join(""));
  for (const c of Object.values(countries)) {
    const cells = order.map((g) => (c.groups[g] ? (c.groups[g].share * 100).toFixed(1) : "-").padStart(7));
    console.log(`${(c.name + " " + c.year).padEnd(24)}${cells.join("")}`);
  }
}

main();
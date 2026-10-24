// scripts/validate-data.ts
// Run from the scripts/ folder:  npx tsx validate-data.ts
// Checks the data files in ../data for the problems that would break the engine or the UI.
// Exits with code 1 if any check fails.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DATA = path.resolve(process.cwd(), "../data");
let failures = 0;
let passes = 0;

function check(ok: boolean, message: string) {
  if (ok) passes++;
  else {
    failures++;
    console.error(`  FAIL: ${message}`);
  }
}

async function load(rel: string): Promise<any | null> {
  try {
    return JSON.parse(await readFile(path.join(DATA, rel), "utf8"));
  } catch (err) {
    console.error(`  FAIL: cannot read data/${rel} (${(err as Error).message})`);
    failures++;
    return null;
  }
}

const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

async function main() {
  // ---------- esco.json ----------
  console.log("esco.json");
  const esco = await load("esco.json");
  const tracked = await load("tracked-skills.json");
  const exposure = await load("exposure.json");
  const countries = await load("countries.json");

  if (esco) {
    check(Array.isArray(esco.roles) && esco.roles.length > 0, "roles[] missing or empty");
    check(!!esco.skillLabels && Object.keys(esco.skillLabels).length > 0, "skillLabels missing or empty");
    const uris = new Set<string>();
    for (const r of esco.roles ?? []) {
      const t = r.title ?? "(no title)";
      check(typeof r.escoUri === "string" && r.escoUri.startsWith("http"), `${t}: escoUri missing`);
      check(!uris.has(r.escoUri), `${t}: duplicate escoUri`);
      uris.add(r.escoUri);
      check(Array.isArray(r.essentialSkills) && r.essentialSkills.length > 0, `${t}: no essentialSkills`);
      for (const s of r.essentialSkills ?? []) check(!!esco.skillLabels?.[s], `${t}: skill ${s} has no label in skillLabels`);
      check(/^\d{4}$/.test(String(r.iscoCode ?? "")), `${t}: iscoCode missing or not 4 digits (run join-exposure.ts)`);
      check(r.automationExposure === null || (isNum(r.automationExposure) && r.automationExposure >= 0 && r.automationExposure <= 1), `${t}: automationExposure must be null or 0..1`);
      if (r.automationExposure !== null && r.automationExposure !== undefined) {
        check(!!r.exposure?.method && !!r.exposure?.source && !!r.exposure?.publishedAt, `${t}: exposure block needs method, source and publishedAt`);
      }
    }
    console.log(`  ${esco.roles?.length ?? 0} roles, ${Object.keys(esco.skillLabels ?? {}).length} skill labels`);
  }

  // ---------- tracked-skills.json ----------
  console.log("tracked-skills.json");
  if (tracked && esco) {
    check(Array.isArray(tracked) && tracked.length > 0, "tracked-skills.json is empty");
    for (const t of tracked) {
      check(!!esco.skillLabels?.[t.escoUri], `tracked skill "${t.label}" not found in esco skillLabels`);
      check(Array.isArray(t.keywords) && t.keywords.length > 0, `tracked skill "${t.label}" has no keywords`);
    }
    console.log(`  ${tracked.length} tracked skills`);
  }

  // ---------- snapshots ----------
  console.log("snapshots");
  const snapFiles = (await readdir(path.join(DATA, "snapshots"))).filter((f) => f.endsWith(".json")).sort();
  check(snapFiles.length >= 2, `need at least 2 dated snapshots, found ${snapFiles.length}`);
  const trackedUris = new Set((tracked ?? []).map((t: any) => t.escoUri));
  for (const f of snapFiles) {
    const snap = await load(`snapshots/${f}`);
    if (!snap) continue;
    check(f === `${snap.date}.json`, `${f}: filename does not match date "${snap.date}"`);
    check(Array.isArray(snap.skills) && snap.skills.length === trackedUris.size, `${f}: has ${snap.skills?.length} skills, tracked list has ${trackedUris.size}`);
    let nonZero = 0;
    for (const s of snap.skills ?? []) {
      check(trackedUris.has(s.escoUri), `${f}: skill "${s.label}" is not in tracked-skills.json`);
      check(isNum(s.momentum) && s.momentum >= -1 && s.momentum <= 1, `${f}: "${s.label}" momentum out of range`);
      check(isNum(s.mentionsRecent) && s.mentionsRecent >= 0 && isNum(s.mentionsPrior) && s.mentionsPrior >= 0, `${f}: "${s.label}" mention counts invalid`);
      check(Array.isArray(s.sources) && s.sources.length > 0 && s.sources.every((x: any) => x.name && x.url && x.fetchedAt), `${f}: "${s.label}" sources need name, url, fetchedAt`);
      if (s.momentum !== 0) nonZero++;
    }
    console.log(`  ${f}: ${snap.skills?.length} skills, ${nonZero} with non-zero momentum`);
  }

  // ---------- exposure.json ----------
  console.log("exposure.json");
  if (exposure) {
    const entries = Object.entries(exposure.scores ?? {}) as [string, any][];
    check(entries.length > 0, "no exposure scores");
    check(!!exposure.source?.name && !!exposure.source?.url, "exposure source name/url missing");
    for (const [code, e] of entries) {
      check(/^\d{4}$/.test(code), `exposure code ${code} is not 4 digits`);
      check(isNum(e.mean) && e.mean >= 0 && e.mean <= 1, `exposure ${code}: mean out of range`);
    }
    console.log(`  ${entries.length} ISCO occupations scored`);
  }

  // ---------- countries.json ----------
  console.log("countries.json");
  if (countries) {
    const list = Object.entries(countries.countries ?? {}) as [string, any][];
    check(list.length > 0, "no countries");
    for (const [iso, c] of list) {
      check(isNum(c.year) && c.year >= 2015, `${iso}: year missing or older than 2015`);
      check(!!c.source?.name && !!c.source?.url && !!c.source?.retrievedAt, `${iso}: source name/url/retrievedAt missing`);
      for (const g of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) check(!!c.groups?.[g], `${iso}: group ${g} missing`);
      const sum = Object.values(c.groups ?? {}).reduce((a: number, g: any) => a + g.employed, 0);
      check(Math.abs(sum - c.totalEmployed) / c.totalEmployed < 0.01, `${iso}: groups sum to ${sum.toFixed(1)}, total is ${c.totalEmployed}`);
      const shareSum = Object.values(c.groups ?? {}).reduce((a: number, g: any) => a + g.share, 0);
      check(Math.abs(shareSum - 1) < 0.01, `${iso}: shares add up to ${shareSum.toFixed(3)}, expected about 1`);
      if (esco) {
        for (const r of esco.roles ?? []) {
          const g = String(r.iscoCode ?? "")[0];
          check(!!c.groups?.[g], `${iso}: no group "${g}" for role "${r.title}"`);
        }
      }
      console.log(`  ${iso} ${c.name} ${c.year}: total ${c.totalEmployed} thousand`);
    }
  }

  console.log(`\n${passes} checks passed, ${failures} failed.`);
  process.exit(failures > 0 ? 1 : 0);
}

main();

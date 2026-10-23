import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Course, Profile, Role, Snapshot } from "../../shared/types";

// Loads everything once at startup. Real data in /data wins; server/mocks fills the gaps.
const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(here, "../../data");
const MOCKS = path.resolve(here, "../mocks");

const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, "utf-8"));
const firstExisting = (...files: string[]) => files.find(existsSync);

function loadRoles(): Role[] {
  const esco = readJson<{ roles: Role[] }>(path.join(DATA, "esco.json"));
  const mock = readJson<{ source: Role["source"]; roles: Record<string, Partial<Role>> }>(
    path.join(MOCKS, "role-overrides.json"),
  );
  // Use mock exposure/SDGs only where A and D haven't filled real values yet
  return esco.roles.map((r) => {
    const o = mock.roles[r.title] ?? {};
    return {
      ...r,
      automationExposure: r.automationExposure ?? o.automationExposure ?? null,
      sdgs: r.sdgs.length ? r.sdgs : (o.sdgs ?? []),
      source: r.automationExposure == null ? mock.source : r.source,
    };
  });
}

function loadSkillLabels(): Map<string, string> {
  const esco = readJson<{ skillLabels: Record<string, string> }>(path.join(DATA, "esco.json"));
  const tracked = readJson<{ escoUri: string; label: string }[]>(path.join(DATA, "tracked-skills.json"));
  const labels = new Map(Object.entries(esco.skillLabels));
  for (const t of tracked) if (!labels.has(t.escoUri)) labels.set(t.escoUri, t.label);
  return labels;
}

function loadSnapshots(): Map<string, Snapshot> {
  const dir = firstExisting(path.join(DATA, "snapshots"), path.join(MOCKS, "snapshots"))!;
  const snaps = readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .map((f) => readJson<Snapshot>(path.join(dir, f)));
  return new Map(snaps.map((s) => [s.date, s]));
}

function loadProfiles(): Profile[] {
  return readJson(firstExisting(path.join(DATA, "profiles.json"), path.join(MOCKS, "profiles.json"))!);
}

function loadCourses(): Course[] {
  const file = firstExisting(path.join(DATA, "courses.json"));
  return file ? readJson(file) : [];
}

export const roles = loadRoles();
export const skillLabels = loadSkillLabels();
export const snapshots = loadSnapshots();
export const profiles = loadProfiles();
export const courses = loadCourses();

export const snapshotDates = () => [...snapshots.keys()].sort();
export const latestSnapshot = () => snapshots.get(snapshotDates().at(-1)!)!;

const uriByLabel = new Map([...skillLabels].map(([uri, label]) => [label.toLowerCase(), uri]));

// Accepts ESCO URIs or ESCO labels; returns known URIs plus whatever didn't resolve
export function resolveSkills(input: string[]) {
  const known: string[] = [];
  const unknown: string[] = [];
  for (const s of input) {
    const uri = skillLabels.has(s) ? s : uriByLabel.get(s.trim().toLowerCase());
    if (uri) known.push(uri);
    else unknown.push(s);
  }
  return { known: [...new Set(known)], unknown };
}

export const label = (uri: string) => skillLabels.get(uri) ?? uri;

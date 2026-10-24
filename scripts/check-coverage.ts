// scripts/check-coverage.ts
// Run from the scripts/ folder:
//   npx tsx check-coverage.ts                    (uses the newest snapshot in data/snapshots)
//   npx tsx check-coverage.ts 2026-07-21.json    (a specific snapshot file)
// For each role: live / tracked / total essential skills.
//   tracked = essential skills that are in tracked-skills.json
//   live    = tracked skills whose momentum in the snapshot is not 0 (these can actually move a role's rank)

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function main() {
  const dataDir = path.resolve(process.cwd(), "../data");
  const esco = JSON.parse(await readFile(path.join(dataDir, "esco.json"), "utf8"));
  const tracked: { escoUri: string; label: string }[] = JSON.parse(
    await readFile(path.join(dataDir, "tracked-skills.json"), "utf8"),
  );
  const snapDir = path.join(dataDir, "snapshots");
  const snapFile =
    process.argv[2] ?? (await readdir(snapDir)).filter((f) => f.endsWith(".json")).sort().pop()!;
  const snap = JSON.parse(await readFile(path.join(snapDir, snapFile), "utf8"));

  const trackedUris = new Set(tracked.map((t) => t.escoUri));
  const liveUris = new Set(snap.skills.filter((s: any) => s.momentum !== 0).map((s: any) => s.escoUri));

  const rows = esco.roles
    .map((r: any) => {
      const skills = r.essentialSkills as string[];
      return {
        title: r.title as string,
        total: skills.length,
        tracked: skills.filter((u) => trackedUris.has(u)).length,
        live: skills.filter((u) => liveUris.has(u)).length,
      };
    })
    .sort((a: any, b: any) => a.live - b.live || a.tracked - b.tracked);

  console.log(`Snapshot: ${snapFile} (${snap.skills.length} skills, ${liveUris.size} with non-zero momentum)\n`);
  console.log("live / tracked / total");
  for (const r of rows) {
    const flag = r.live === 0 ? "   <-- NO live trend data" : r.live === 1 ? "   <-- only 1" : "";
    console.log(`${String(r.live).padStart(2)} / ${String(r.tracked).padStart(2)} / ${String(r.total).padStart(2)}  ${r.title}${flag}`);
  }
  const zero = rows.filter((r: any) => r.live === 0).length;
  console.log(`\n${zero} of ${rows.length} roles have no live trend data.`);
}

main();

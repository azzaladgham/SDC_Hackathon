import { describe, expect, it } from "vitest";
import { profiles, roles, snapshotDates, snapshots } from "./data";
import { rankRoles } from "./scoring";

// Guards the demo's money shot on the REAL data (ESCO roles, A's snapshots, ILO exposure).
// If new data breaks it, this fails instead of the live demo.
describe("money shot on real data", () => {
  const siti = profiles.find((p) => p.id === "p4");
  const top = (date: string, s: "moderate" | "fast") =>
    rankRoles(siti!.skills, roles, snapshots.get(date)!).find((r) => r.rank[s] === 1)!.role.title;

  it("has the career-switcher sample profile", () => {
    expect(siti).toBeDefined();
  });

  it.each(snapshotDates())("scenario toggle reorders the top role (%s)", (date) => {
    expect(top(date, "moderate")).not.toBe(top(date, "fast"));
  });

  it("every role has a cited automation exposure", () => {
    for (const r of roles) {
      expect(r.automationExposure).not.toBeNull();
      expect(r.source?.url).toMatch(/^https:\/\//);
    }
  });
});

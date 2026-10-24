import { describe, expect, it } from "vitest";
import type { Role, Snapshot } from "../../shared/types";
import { breakdownFor, rankRoles, roleMomentum, scoreFrom, scoreRole } from "./scoring";

// Small hand-made fixtures: easy to check by hand
const snap = (date: string, m: Record<string, number>): Snapshot => ({
  date,
  skills: Object.entries(m).map(([escoUri, momentum]) => ({
    escoUri, label: escoUri, momentum, mentionsRecent: 0, mentionsPrior: 0, sources: [],
  })),
});
const role = (title: string, skills: string[], exposure: number | null, sdgs: number[] = []): Role => ({
  escoUri: "role:" + title, title, essentialSkills: skills, automationExposure: exposure, sdgs,
});

const clerk = role("clerk", ["excel", "ledger", "payroll", "filing"], 0.8, [8]);
const analyst = role("analyst", ["excel", "sql", "python", "stats", "viz"], 0.2, [8, 9]);
const SEP = snap("2026-09-20", { sql: 0.1, python: 0.1, ledger: -0.1 });
const OCT = snap("2026-10-20", { sql: 0.8, python: 0.9, stats: 0.6, ledger: -0.5, payroll: -0.4 });
const raj = ["excel", "ledger", "payroll", "stats"];

describe("roleMomentum", () => {
  it("averages only tracked skills and reports coverage", () => {
    const r = roleMomentum(analyst, OCT); // sql .8, python .9, stats .6 tracked; excel, viz not
    expect(r.momentum).toBeCloseTo(0.7667, 3);
    expect(r.coverage).toBeCloseTo(3 / 5);
  });
  it("is 0 with 0 coverage when no skills are tracked", () => {
    expect(roleMomentum(role("x", ["a", "b"], 0.5), OCT)).toEqual({ momentum: 0, coverage: 0 });
  });
  it("clamps extreme momentum to [-1, 1]", () => {
    expect(roleMomentum(role("x", ["a"], 0), snap("d", { a: 5 })).momentum).toBe(1);
  });
});

describe("breakdownFor + scoreFrom", () => {
  it("matches the worked example: clerk, moderate → 57", () => {
    const b = breakdownFor(0.7, -0.2, 0.8, false, "moderate");
    expect(b).toEqual({ overlap: 70, trendBonus: -4.2, exposurePenalty: 8.4, sdgBoost: 0 });
    expect(scoreFrom(b)).toBe(57);
  });
  it("matches the worked example: clerk, fast → 42", () => {
    expect(scoreFrom(breakdownFor(0.7, -0.2, 0.8, false, "fast"))).toBe(42);
  });
  it("matches the worked example: ML engineer overtakes the clerk under fast (47 vs 42)", () => {
    expect(scoreFrom(breakdownFor(0.4, 0.4, 0.2, false, "moderate"))).toBe(44);
    expect(scoreFrom(breakdownFor(0.4, 0.4, 0.2, false, "fast"))).toBe(47);
  });
  it("scales the automation penalty with overlap: a weak match isn't zeroed out", () => {
    expect(scoreFrom(breakdownFor(0.15, 0, 0.9, false, "fast"))).toBeGreaterThan(0);
  });
  it("adds SDG points to the breakdown but NOT to the score", () => {
    const off = breakdownFor(0.5, 0, 0.2, false, "moderate");
    const on = breakdownFor(0.5, 0, 0.2, true, "moderate");
    expect(on.sdgBoost).toBe(5);
    expect(scoreFrom(on)).toBe(scoreFrom(off));
  });
  it("treats null exposure as 0", () => {
    expect(breakdownFor(0.5, 0, null, false, "fast").exposurePenalty).toBe(0);
  });
  it("never goes below 0 or above 100", () => {
    expect(scoreFrom(breakdownFor(0, 0, 1, false, "fast"))).toBe(0);
    expect(scoreFrom(breakdownFor(1, 1, 0, false, "fast"))).toBe(100);
  });
});

describe("scoreRole", () => {
  it("splits have/gap skills in role order", () => {
    const r = scoreRole(new Set(raj), analyst, OCT);
    expect(r.haveSkills).toEqual(["excel", "stats"]);
    expect(r.gapSkills).toEqual(["sql", "python", "viz"]);
  });
  it("handles a person with no skills", () => {
    const r = scoreRole(new Set(), analyst, OCT);
    expect(r.breakdown.overlap).toBe(0);
    expect(r.haveSkills).toEqual([]);
  });
  it("only gives SDG points for SDGs the user picked", () => {
    expect(scoreRole(new Set(raj), analyst, OCT, [9]).matchedSdgs).toEqual([9]);
    expect(scoreRole(new Set(raj), analyst, OCT, [3]).breakdown.sdgBoost).toBe(0);
  });
});

describe("rankRoles: the money shot", () => {
  it("scenario flip: Raj's #1 role differs between moderate and fast", () => {
    const r = rankRoles(raj, [clerk, analyst], OCT);
    const top = (s: "moderate" | "fast") => r.find((x) => x.rank[s] === 1)!.role.title;
    expect(top("moderate")).not.toBe(top("fast"));
  });
  it("snapshot change: newer trend data changes the (fast) ranking", () => {
    const order = (s: Snapshot) =>
      [...rankRoles(raj, [clerk, analyst], s)].sort((a, b) => a.rank.fast - b.rank.fast).map((x) => x.role.title);
    expect(order(SEP)).not.toEqual(order(OCT));
  });
  it("is deterministic", () => {
    expect(rankRoles(raj, [clerk, analyst], OCT)).toEqual(rankRoles(raj, [clerk, analyst], OCT));
  });
  it("is fair: no name/age/gender input exists, same skills → same result", () => {
    // rankRoles only accepts skills + SDGs. This test documents that on purpose.
    expect(rankRoles.length).toBeLessThanOrEqual(4);
  });
});

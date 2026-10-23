import { describe, expect, it } from "vitest";
import type { Course } from "../../shared/types";
import { planPathway } from "./pathway";

const course = (id: string, hours: number, teaches: string[], cost: Course["cost"] = "free"): Course => ({
  id, title: id, url: "https://example.com/" + id, provider: "test", hours, cost, teaches,
});

const catalogue = [
  course("sql-101", 10, ["sql"]),
  course("python-big", 40, ["python", "stats", "sql"]),
  course("python-short", 12, ["python"]),
  course("viz", 6, ["viz"], "low"),
];

describe("planPathway", () => {
  it("covers every gap skill a course exists for, and every step adds something new", () => {
    const p = planPathway(["sql", "python", "viz"], catalogue);
    const covered = p.steps.flatMap((s) => s.covers);
    expect(new Set(covered)).toEqual(new Set(["sql", "python", "viz"]));
    expect(covered.length).toBe(new Set(covered).size); // no skill covered twice
    expect(p.uncoveredSkills).toEqual([]);
  });

  it("totals hours and tracks cumulative hours per step", () => {
    const p = planPathway(["sql", "python", "viz"], catalogue);
    expect(p.totalHours).toBe(p.steps.reduce((sum, s) => sum + s.course.hours, 0));
    expect(p.steps.at(-1)!.cumulativeHours).toBe(p.totalHours);
  });

  it("prefers value per hour: short focused courses beat one long bundle", () => {
    const p = planPathway(["sql", "python"], catalogue);
    expect(p.steps.map((s) => s.course.id)).toEqual(["sql-101", "python-short"]);
  });

  it("reports skills no course teaches instead of inventing one", () => {
    const p = planPathway(["sql", "quantum knitting"], catalogue);
    expect(p.uncoveredSkills).toEqual(["quantum knitting"]);
    expect(p.steps.every((s) => catalogue.includes(s.course))).toBe(true);
  });

  it("puts rising skills first when value per hour would otherwise tie", () => {
    const tie = [course("a", 10, ["x"]), course("b", 10, ["y"])];
    const p = planPathway(["x", "y"], tie, new Map([["y", 0.8]]));
    expect(p.steps[0].course.id).toBe("b");
  });

  it("breaks ties by cost: free before hrdc", () => {
    const tie = [course("paid", 10, ["x"], "hrdc"), course("free", 10, ["x"], "free")];
    expect(planPathway(["x"], tie).steps[0].course.id).toBe("free");
  });

  it("returns an empty plan when there is no gap or no catalogue", () => {
    expect(planPathway([], catalogue)).toEqual({ steps: [], totalHours: 0, uncoveredSkills: [] });
    expect(planPathway(["sql"], []).uncoveredSkills).toEqual(["sql"]);
  });
});

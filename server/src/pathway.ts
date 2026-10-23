import type { Course } from "../../shared/types";

// PURE, like scoring.ts. Skill lists are ESCO URIs; course.teaches must be URIs too.

export interface PlannedStep {
  course: Course;
  covers: string[];          // gap skills this course closes
  cumulativeHours: number;
}

export interface Plan {
  steps: PlannedStep[];
  totalHours: number;
  uncoveredSkills: string[]; // no course teaches these: shown honestly, never invented
}

const COST_ORDER: Record<Course["cost"], number> = { free: 0, low: 1, hrdc: 2 };

/**
 * Greedy reskilling plan: repeatedly pick the course with the most value per hour
 * until every gap skill is covered or no course can cover what's left.
 *
 * value(course) = Σ over the gap skills it newly covers of (1 + max(0, momentum))
 *   → every new skill counts, rising skills count extra.
 * Ties: cheaper first (free < low < hrdc), then fewer hours, then title.
 */
export function planPathway(gap: string[], courses: Course[], momentum: Map<string, number> = new Map()): Plan {
  const uncovered = new Set(gap);
  const used = new Set<string>();
  const steps: PlannedStep[] = [];
  let hours = 0;

  while (uncovered.size > 0) {
    let best: { course: Course; covers: string[]; ratio: number } | null = null;

    for (const course of courses) {
      if (used.has(course.id)) continue;
      const covers = course.teaches.filter((s) => uncovered.has(s));
      if (covers.length === 0) continue;

      const value = covers.reduce((sum, s) => sum + 1 + Math.max(0, momentum.get(s) ?? 0), 0);
      const ratio = value / Math.max(course.hours, 1);

      if (!best || ratio > best.ratio || (ratio === best.ratio && isCheaper(course, best.course))) {
        best = { course, covers, ratio };
      }
    }
    if (!best) break; // nothing left can be taught by our catalogue

    used.add(best.course.id);
    best.covers.forEach((s) => uncovered.delete(s));
    hours += best.course.hours;
    steps.push({ course: best.course, covers: best.covers, cumulativeHours: hours });
  }

  // keep the role's original skill order for the leftovers
  return { steps, totalHours: hours, uncoveredSkills: gap.filter((s) => uncovered.has(s)) };
}

function isCheaper(a: Course, b: Course) {
  const diff = COST_ORDER[a.cost] - COST_ORDER[b.cost] || a.hours - b.hours || a.title.localeCompare(b.title);
  return diff < 0;
}

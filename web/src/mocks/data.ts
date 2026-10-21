import type { MatchResult } from "../../../shared/types";

export const SNAPSHOT_DATES = ["2026-09-20", "2026-10-20"];

function m(
  snap: string, title: string, moderate: number, fast: number,
  sdgs: number[], have: string[], gap: string[],
  b: [number, number, number, number]
): MatchResult {
  return {
    role: { escoUri: "mock:" + title, title, essentialSkills: [...have, ...gap],
            automationExposure: 0.3, sdgs },
    score: { moderate, fast },
    breakdown: { overlap: b[0], trendBonus: b[1], exposurePenalty: b[2], sdgBoost: b[3] },
    haveSkills: have, gapSkills: gap, snapshotDate: snap,
  };
}

// Two snapshots that rank roles DIFFERENTLY on purpose
export const MOCK_MATCHES: Record<string, MatchResult[]> = {
  "2026-09-20": [
    m("2026-09-20", "Data Analyst", 78, 64, [8, 9], ["SQL", "Excel"], ["Python"], [60, 12, 5, 3]),
    m("2026-09-20", "AI Ethics Officer", 55, 70, [10, 16], ["Policy writing"], ["AI governance", "Risk assessment"], [40, 18, 2, 6]),
    m("2026-09-20", "Prompt Engineer", 62, 58, [9], ["Writing"], ["LLM tooling"], [45, 15, 8, 0]),
    m("2026-09-20", "Renewable Energy Planner", 50, 52, [7, 13], ["Excel"], ["GIS", "Energy modelling"], [35, 10, 2, 8]),
    m("2026-09-20", "Data Entry Clerk", 40, 15, [8], ["Excel"], [], [55, 0, 30, 0]),
  ],
  "2026-10-20": [
    m("2026-10-20", "AI Ethics Officer", 68, 80, [10, 16], ["Policy writing"], ["AI governance", "Risk assessment"], [40, 22, 2, 8]),
    m("2026-10-20", "Prompt Engineer", 70, 66, [9], ["Writing"], ["LLM tooling"], [45, 24, 8, 0]),
    m("2026-10-20", "Data Analyst", 72, 55, [8, 9], ["SQL", "Excel"], ["Python"], [60, 10, 9, 3]),
    m("2026-10-20", "Renewable Energy Planner", 58, 62, [7, 13], ["Excel"], ["GIS", "Energy modelling"], [35, 14, 2, 8]),
    m("2026-10-20", "Data Entry Clerk", 32, 8, [8], ["Excel"], [], [55, 0, 38, 0]),
  ],
};
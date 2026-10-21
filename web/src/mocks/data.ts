import type { MatchResult } from "../../../shared/types";

export const SNAPSHOT_DATES = ["2026-09-20", "2026-10-20"];

function m(
  snap: string, title: string, group: string,
  moderate: number, fast: number,
  sdgs: number[], have: string[], gap: string[],
  b: [number, number, number, number]
): MatchResult {
  return {
    role: {
      escoUri: "mock:" + title, title, group,
      essentialSkills: [...have, ...gap],
      automationExposure: 0.3, sdgs,
    },
    score: { moderate, fast },
    breakdown: { overlap: b[0], trendBonus: b[1], exposurePenalty: b[2], sdgBoost: b[3] },
    haveSkills: have, gapSkills: gap, snapshotDate: snap,
  };
}

const S = "2026-09-20";
const O = "2026-10-20";

export const MOCK_MATCHES: Record<string, MatchResult[]> = {
  [S]: [
    m(S, "data analyst", "ICT", 74, 60, [8, 9], ["SQL", "Excel", "Data visualisation"], ["Python"], [60, 12, 5, 3]),
    m(S, "software developer", "ICT", 70, 66, [8, 9], ["Python", "Git"], ["Cloud deployment", "Software testing"], [52, 14, 4, 3]),
    m(S, "ICT security consultant", "ICT", 60, 72, [9, 16], ["Networking"], ["Risk assessment", "Incident response"], [38, 20, 3, 5]),
    m(S, "data scientist", "ICT", 58, 68, [3, 9], ["Statistics", "SQL"], ["Machine learning", "Python"], [40, 22, 3, 4]),
    m(S, "financial analyst", "Finance", 64, 54, [8], ["Excel", "Financial reporting"], ["Forecasting"], [55, 8, 6, 2]),
    m(S, "graphic designer", "Creative", 56, 40, [8, 9], ["Visual design"], ["Motion graphics"], [48, 6, 12, 2]),
    m(S, "bookkeeper", "Finance", 52, 30, [8], ["Excel", "Bookkeeping"], [], [50, 2, 22, 2]),
    m(S, "secondary school teacher", "Education", 50, 58, [4], ["Presentation"], ["Digital pedagogy"], [34, 12, 1, 6]),
    m(S, "customer service representative", "Admin", 48, 28, [8], ["Communication"], ["CRM tools"], [46, 3, 24, 2]),
    m(S, "payroll clerk", "Finance", 45, 22, [8], ["Excel"], ["Payroll software"], [44, 1, 28, 0]),
  ],
  [O]: [
    m(O, "data scientist", "ICT", 70, 78, [3, 9], ["Statistics", "SQL"], ["Machine learning", "Python"], [40, 28, 3, 5]),
    m(O, "ICT security consultant", "ICT", 68, 80, [9, 16], ["Networking"], ["Risk assessment", "Incident response"], [38, 26, 3, 7]),
    m(O, "software developer", "ICT", 72, 62, [8, 9], ["Python", "Git"], ["Cloud deployment", "Software testing"], [52, 12, 6, 3]),
    m(O, "data analyst", "ICT", 66, 50, [8, 9], ["SQL", "Excel", "Data visualisation"], ["Python"], [60, 8, 11, 3]),
    m(O, "financial analyst", "Finance", 60, 48, [8], ["Excel", "Financial reporting"], ["Forecasting"], [55, 6, 9, 2]),
    m(O, "secondary school teacher", "Education", 54, 60, [4], ["Presentation"], ["Digital pedagogy"], [34, 16, 1, 7]),
    m(O, "graphic designer", "Creative", 52, 34, [8, 9], ["Visual design"], ["Motion graphics"], [48, 4, 18, 2]),
    m(O, "bookkeeper", "Finance", 44, 22, [8], ["Excel", "Bookkeeping"], [], [50, 1, 30, 2]),
    m(O, "customer service representative", "Admin", 40, 20, [8], ["Communication"], ["CRM tools"], [46, 2, 31, 2]),
    m(O, "payroll clerk", "Finance", 36, 14, [8], ["Excel"], ["Payroll software"], [44, 0, 36, 0]),
  ],
};
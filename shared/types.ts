export type Scenario = "moderate" | "fast";

export interface SkillTrend {
  escoUri: string; label: string;
  momentum: number;
  mentionsRecent: number; mentionsPrior: number;
  sources: { name: string; url: string; fetchedAt: string }[];
}
export interface Snapshot { date: string; skills: SkillTrend[]; }

export interface Role {
  escoUri: string; title: string;
  essentialSkills: string[];
  automationExposure: number | null;
  sdgs: number[];
  group?: string;
  source?: { name: string; url: string; fetchedAt: string };
}
export interface Profile {
  id: string; name: string; skills: string[]; interests: string[];
}
export interface MatchResult {
  role: Role;
  score: { moderate: number; fast: number };
  breakdown: { overlap: number; trendBonus: number; exposurePenalty: number; sdgBoost: number };
  haveSkills: string[]; gapSkills: string[];
  snapshotDate: string;
}
export interface Course {
  id: string; title: string; url: string; provider: string;
  hours: number; cost: "free" | "low" | "hrdc"; teaches: string[];
}

// PROPOSED ADDITIONS (UI needs these, confirm with B)
export interface PathwayStep { course: Course; sdgs: number[]; }
export interface Pathway { steps: PathwayStep[]; totalHours: number; }
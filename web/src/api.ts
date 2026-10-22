import type { MatchResult, Pathway, Profile, SkillTrend } from "../../shared/types";
import { MOCK_MATCHES, MOCK_PROFILES, MOCK_TRENDS, SNAPSHOT_DATES, mockPathway } from "./mocks/data";
import snap0721 from "./data/2026-07-21.json";
import snap1021 from "./data/2026-10-21.json";

// true = use Role A's real snapshots, false = use mock trends
export const USE_REAL_TRENDS = true;

const REAL_SNAPSHOTS: Record<string, SkillTrend[]> = {
  "2026-07-21": snap0721.skills as SkillTrend[],
  "2026-10-21": snap1021.skills as SkillTrend[],
};
const REAL_DATES = Object.keys(REAL_SNAPSHOTS);
// Flip to false on Day 2 when Role B's API is ready
export const USE_MOCK = true;

export async function getSnapshots(): Promise<string[]> {
  if (USE_REAL_TRENDS) return REAL_DATES;
  if (USE_MOCK) return SNAPSHOT_DATES;
  const res = await fetch("/snapshots");
  return res.json();
}

export async function getMatches(profileId: string, snapshot: string): Promise<MatchResult[]> {
  if (USE_MOCK) return MOCK_MATCHES[snapshot] ?? [];
  const res = await fetch(`/match?snapshot=${snapshot}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId }),
  });
  return res.json();
}export async function getProfiles(): Promise<Profile[]> {
  if (USE_MOCK) return MOCK_PROFILES;
  const res = await fetch("/profiles");
  return res.json();
}
export async function getPathway(gapSkills: string[], sdgs: number[]): Promise<Pathway> {
  if (USE_MOCK) return mockPathway(gapSkills, sdgs);
  const res = await fetch("/pathway", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gapSkills }),
  });
  return res.json();
}
export async function getTrends(snapshot: string): Promise<SkillTrend[]> {
  if (USE_REAL_TRENDS) return REAL_SNAPSHOTS[snapshot] ?? [];
  if (USE_MOCK) return MOCK_TRENDS[snapshot] ?? [];
  const res = await fetch(`/snapshots/${snapshot}`);
  const data = await res.json();
  return data.skills;
}
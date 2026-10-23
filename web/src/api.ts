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
// Role B's API is ready (server/, routes under /api)
export const USE_MOCK = false;

export async function getSnapshots(): Promise<string[]> {
  if (USE_REAL_TRENDS) return REAL_DATES;
  if (USE_MOCK) return SNAPSHOT_DATES;
  const res = await fetch("/api/snapshots");
  return res.json();
}

export async function getMatches(profileId: string, snapshot: string, skills?: string[]): Promise<MatchResult[]> {
  if (USE_MOCK) return MOCK_MATCHES[snapshot] ?? [];
  const res = await fetch(`/api/match?snapshot=${snapshot}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // skills let the server score profiles built on the skills screen (id "custom")
    body: JSON.stringify({ profileId, skills }),
  });
  return res.ok ? res.json() : [];
}export async function getProfiles(): Promise<Profile[]> {
  if (USE_MOCK) return MOCK_PROFILES;
  const res = await fetch("/api/profiles");
  return res.json();
}
export async function getPathway(gapSkills: string[], sdgs: number[]): Promise<Pathway> {
  if (USE_MOCK) return mockPathway(gapSkills, sdgs);
  const res = await fetch("/api/pathway", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gapSkills, sdgs }),
  });
  return res.json();
}
export async function getTrends(snapshot: string): Promise<SkillTrend[]> {
  if (USE_REAL_TRENDS) return REAL_SNAPSHOTS[snapshot] ?? [];
  if (USE_MOCK) return MOCK_TRENDS[snapshot] ?? [];
  const res = await fetch(`/api/snapshots/${snapshot}`);
  const data = await res.json();
  return data.skills;
}
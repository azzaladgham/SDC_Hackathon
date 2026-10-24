import type { MatchResult, Pathway, Profile, SkillTrend } from "../../shared/types";
import { MOCK_MATCHES, MOCK_PROFILES, MOCK_TRENDS, SNAPSHOT_DATES, mockPathway } from "./mocks/data";
import snap0724 from "./data/2026-07-24.json";
import snap1024 from "./data/2026-10-24.json";

import escoData from "./data/esco.json";
import exposureData from "./data/exposure.json";

export const EXPOSURE_SOURCE = {
  name: "ILO Working Paper 140 (2025)",
  date: exposureData.source.publishedAt,
  url: exposureData.source.url,
};

// role title (lowercase) -> real ILO exposure score (0..1)
const EXPOSURE_BY_TITLE: Record<string, number> = {};
for (const r of escoData.roles as { title: string; automationExposure: number | null }[]) {
  if (r.automationExposure != null) EXPOSURE_BY_TITLE[r.title.toLowerCase()] = r.automationExposure;
}

export function getExposure(title: string): number | null {
  return EXPOSURE_BY_TITLE[title.toLowerCase()] ?? null;
}
// true = use Role A's real snapshots, false = use mock trends
export const USE_REAL_TRENDS = true;

const REAL_SNAPSHOTS: Record<string, SkillTrend[]> = {
  "2026-07-24": snap0724.skills as SkillTrend[],
  "2026-10-24": snap1024.skills as SkillTrend[],
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

async function getMatchesLive(profileId: string, snapshot: string, skills?: string[]): Promise<MatchResult[]>  {
  if (USE_MOCK) return MOCK_MATCHES[snapshot] ?? [];
  const res = await fetch(`/api/match?snapshot=${snapshot}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // skills let the server score profiles built on the skills screen (id "custom")
    body: JSON.stringify({ profileId, skills }),
  });
  return res.ok ? res.json() : [];
}

export async function getProfiles(): Promise<Profile[]> {
  // Sample profiles are synthetic and live in the frontend, no server needed
  return MOCK_PROFILES;
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
// Uses Role B's server when it answers; falls back to the mock roles so the list is never empty
export async function getMatches(
  profileId: string,
  snapshot: string,
  skills?: string[]
): Promise<MatchResult[]> {
  try {
    const live = await getMatchesLive(profileId, snapshot, skills);
    if (Array.isArray(live) && live.length > 0) return live;
  } catch (e) {
    console.warn("Match API unavailable, using mock matches", e);
  }
  return MOCK_MATCHES[snapshot] ?? [];
}
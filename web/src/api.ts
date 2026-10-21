import type { MatchResult, Profile } from "../../shared/types";
import { MOCK_MATCHES, MOCK_PROFILES, SNAPSHOT_DATES } from "./mocks/data";
// Flip to false on Day 2 when Role B's API is ready
export const USE_MOCK = true;

export async function getSnapshots(): Promise<string[]> {
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
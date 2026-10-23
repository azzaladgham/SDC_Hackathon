import type { MatchResult, Role, Scenario, Snapshot } from "../../shared/types";
import { MOMENTUM_CAP, SCENARIOS, SDG_POINTS } from "./config";

// Everything in here is PURE: no Express, no file reads. Same input → same output.
// All skill lists are ESCO URIs. The route layer turns them into labels for the UI.

export type Breakdown = MatchResult["breakdown"];

// What the server returns: the shared MatchResult plus a few optional extras
export interface ScoredRole extends MatchResult {
  breakdownByScenario: Record<Scenario, Breakdown>;
  rank: Record<Scenario, number>; // 1 = best
  roleMomentum: number;           // avg momentum of the role's tracked skills
  coverage: number;               // 0..1, share of role skills with trend data
  matchedSdgs: number[];
}

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
export const round1 = (x: number) => Math.round(x * 10) / 10;

/**
 * Average momentum of the role's essential skills that appear in the snapshot.
 *
 * TODO (you):
 *  1. Build a Map from snapshot skill URI → momentum
 *  2. Keep only the role's essentialSkills that are in that map ("tracked")
 *  3. If none are tracked → return { momentum: 0, coverage: 0 }
 *  4. momentum = average of the tracked momentums, each clamped to [-MOMENTUM_CAP, MOMENTUM_CAP]
 *  5. coverage = tracked count / essentialSkills count
 */
export function roleMomentum(role: Role, snap: Snapshot): { momentum: number; coverage: number } {
  // 1. A lookup table: skill URI → momentum
  const lookup = new Map(snap.skills.map((s) => [s.escoUri, s.momentum]));

  // 2. The role's skills that have trend data
  const tracked = role.essentialSkills.filter((uri) => lookup.has(uri));

  // 3. Nothing tracked → we know nothing
  if (tracked.length === 0) return { momentum: 0, coverage: 0 };

  // 4. Add up the tracked momentums, each clamped to [-MOMENTUM_CAP, MOMENTUM_CAP]
  let sum = 0;
  for (const uri of tracked) {
    sum += clamp(lookup.get(uri)!, -MOMENTUM_CAP, MOMENTUM_CAP);
  }

  // 5. Average, and the share of skills we had data for
  return {
    momentum: sum / tracked.length,
    coverage: tracked.length / role.essentialSkills.length,
  };
}

/**
 * The score explained in POINTS (this is what the UI's "Why this score" bar shows).
 *
 *   overlap         = 100 × overlapShare
 *   trendBonus      = 100 × overlapShare × w × momentum      (negative if skills are declining)
 *   exposurePenalty = 100 × overlapShare × p × exposure      (positive number, the UI shows it with "−")
 *
 * Trend and exposure both scale with overlapShare, so the whole thing is
 *   score = 100 × overlapShare × (1 + w·momentum − p·exposure)
 * A role you barely match can't be pushed to 0 by automation alone.
 *   sdgBoost        = SDG_POINTS if sdgHit, else 0
 *
 * w and p come from SCENARIOS[scenario]. Treat a null exposure as 0.
 * Round each part with round1.
 */
export function breakdownFor(
  overlapShare: number, momentum: number, exposure: number | null,
  sdgHit: boolean, scenario: Scenario,
): Breakdown {
  // 1. Get this scenario's weights
  const { w, p } = SCENARIOS[scenario];

  // 2. Unknown exposure counts as 0
  const exp = exposure ?? 0;

  return {
    overlap: round1(100 * overlapShare),
    trendBonus: round1(100 * overlapShare * w * momentum),
    exposurePenalty: round1(100 * overlapShare * p * exp),
    sdgBoost: sdgHit ? SDG_POINTS : 0,
  };
}

/**
 * score = overlap + trendBonus − exposurePenalty, clamped to 0..100 and rounded.
 * sdgBoost is NOT added: the UI's SDG slider adds it on top.
 */
export function scoreFrom(b: Breakdown): number {
  return Math.round(clamp(b.overlap + b.trendBonus - b.exposurePenalty, 0, 100));
}

/**
 * Score one role for one person.
 *
 * TODO (you):
 *  - haveSkills = role skills the person has, gapSkills = the rest (keep role order)
 *  - overlapShare = have / essentialSkills (0 if the role has no skills)
 *  - momentum + coverage from roleMomentum
 *  - matchedSdgs = role.sdgs the user picked
 *  - breakdown for both scenarios, then score for both
 *  - rank: put { moderate: 0, fast: 0 } here; rankRoles fills it in
 */
export function scoreRole(
  skills: Set<string>, role: Role, snap: Snapshot, sdgs: number[] = [],
): ScoredRole {
  // 1. Which of the role's skills the person has, and which are missing
  const have = role.essentialSkills.filter((uri) => skills.has(uri));
  const gap = role.essentialSkills.filter((uri) => !skills.has(uri));

  // 2. Share of the job the person already knows (guard against a role with 0 skills)
  const overlapShare = role.essentialSkills.length ? have.length / role.essentialSkills.length : 0;

  // 3. The job's trend
  const { momentum, coverage } = roleMomentum(role, snap);

  // 4. SDGs of this role that the user picked
  const matchedSdgs = role.sdgs.filter((g) => sdgs.includes(g));
  const sdgHit = matchedSdgs.length > 0;

  // 5. Breakdown for both futures, then a score from each
  const moderate = breakdownFor(overlapShare, momentum, role.automationExposure, sdgHit, "moderate");
  const fast = breakdownFor(overlapShare, momentum, role.automationExposure, sdgHit, "fast");

  return {
    role,
    score: { moderate: scoreFrom(moderate), fast: scoreFrom(fast) },
    breakdown: moderate,
    breakdownByScenario: { moderate, fast },
    rank: { moderate: 0, fast: 0 },
    roleMomentum: momentum,
    coverage,
    haveSkills: have,
    gapSkills: gap,
    matchedSdgs,
    snapshotDate: snap.date,
  };
}

/**
 * Score every role, rank them per scenario, return sorted by moderate rank.
 *
 * TODO (you):
 *  - scoreRole for each role
 *  - for each scenario: sort by score desc, tie-break by title (so output is deterministic),
 *    then rank = position + 1
 *  - return sorted by rank.moderate
 */
export function rankRoles(
  skills: string[], roles: Role[], snap: Snapshot, sdgs: number[] = [],
): ScoredRole[] {
  const set = new Set(skills); // a Set makes "does the person have X?" fast
  const scored = roles.map((r) => scoreRole(set, r, snap, sdgs));

  for (const s of ["moderate", "fast"] as Scenario[]) {
    // highest score first; ties broken by title so the output is deterministic
    const sorted = [...scored].sort(
      (a, b) => b.score[s] - a.score[s] || a.role.title.localeCompare(b.role.title),
    );
    sorted.forEach((r, i) => { r.rank[s] = i + 1; });
  }

  return scored.sort((a, b) => a.rank.moderate - b.rank.moderate);
}

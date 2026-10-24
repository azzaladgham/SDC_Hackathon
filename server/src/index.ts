import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import { SCENARIOS, SDG_POINTS } from "./config";
import {
  courses, label, latestSnapshot, profiles, resolveSkills, roles, skillLabels, snapshotDates, snapshots,
} from "./data";
import { planPathway } from "./pathway";
import { rankRoles, scoreRole } from "./scoring";

const app = express();
app.use(express.json({ limit: "100kb" }));
const api = express.Router();

// ?snapshot=YYYY-MM-DD, default latest. Sends a 404 and returns null if the date doesn't exist.
function pickSnapshot(req: Request, res: Response) {
  const date = req.query.snapshot;
  if (date === undefined) return latestSnapshot();
  const snap = typeof date === "string" ? snapshots.get(date) : undefined;
  if (!snap) res.status(404).json({ error: `No snapshot for ${date}`, available: snapshotDates() });
  return snap ?? null;
}

api.get("/health", (_req, res) => res.json({ ok: true }));

api.get("/snapshots", (_req, res) => res.json(snapshotDates()));

api.get("/snapshots/latest", (_req, res) => res.json(latestSnapshot()));

api.get("/snapshots/:date", (req, res) => {
  const snap = snapshots.get(req.params.date);
  if (!snap) return res.status(404).json({ error: "No such snapshot", available: snapshotDates() });
  res.json(snap);
});

api.get("/profiles", (_req, res) => res.json(profiles));

api.get("/skills", (_req, res) =>
  res.json([...skillLabels].map(([escoUri, label]) => ({ escoUri, label }))));

api.get("/methodology", (_req, res) =>
  res.json({
    formula: "score = 100·overlap · (1 + w·momentum) − 100·p·exposure, clamped 0..100",
    scenarios: SCENARIOS,
    sdgPoints: SDG_POINTS,
    notes: "Deterministic code ranks roles. The language model never ranks or names jobs/courses.",
  }));

const MatchBody = z.object({
  profileId: z.string().optional(),
  skills: z.array(z.string()).max(300).optional(),
  sdgs: z.array(z.number().int().min(1).max(17)).optional(),
}).refine((b) => b.profileId || b.skills, { message: "Send profileId or skills" });

api.post("/match", (req, res) => {
  const body = MatchBody.safeParse(req.body ?? {});
  if (!body.success) return res.status(400).json({ error: body.error.issues[0].message });

  const snap = pickSnapshot(req, res);
  if (!snap) return;

  let input = body.data.skills ?? [];
  if (body.data.profileId) {
    const p = profiles.find((x) => x.id === body.data.profileId);
    // A profile built in the UI has its own id, so only fail when no skills came with it
    if (p) input = [...p.skills, ...input];
    else if (!body.data.skills) {
      return res.status(404).json({ error: "Unknown profileId", available: profiles.map((x) => x.id) });
    }
  }
  const { known, unknown } = resolveSkills(input);

  const results = rankRoles(known, roles, snap, body.data.sdgs).map((r) => ({
    ...r,
    haveSkills: r.haveSkills.map(label),
    gapSkills: r.gapSkills.map(label),
  }));
  if (unknown.length) res.setHeader("X-Unknown-Skills", encodeURIComponent(unknown.join("|")));
  res.json(results);
});

const PathwayBody = z.object({
  gapSkills: z.array(z.string()).max(300).optional(), // what the UI sends today
  roleUri: z.string().optional(),                     // with profileId/skills → score after each step
  profileId: z.string().optional(),
  skills: z.array(z.string()).max(300).optional(),
  sdgs: z.array(z.number().int().min(1).max(17)).optional(),
}).refine((b) => b.gapSkills || b.roleUri, { message: "Send gapSkills or roleUri" });

// Courses may list skills as ESCO labels or URIs; normalise once to URIs
const catalogue = courses.map((c) => ({ ...c, teaches: resolveSkills(c.teaches).known }));

api.post("/pathway", (req, res) => {
  const body = PathwayBody.safeParse(req.body ?? {});
  if (!body.success) return res.status(400).json({ error: body.error.issues[0].message });

  const snap = pickSnapshot(req, res);
  if (!snap) return;

  const role = body.data.roleUri ? roles.find((r) => r.escoUri === body.data.roleUri) : undefined;
  if (body.data.roleUri && !role) return res.status(404).json({ error: "Unknown roleUri" });

  const profile = profiles.find((x) => x.id === body.data.profileId);
  const have = resolveSkills([...(profile?.skills ?? []), ...(body.data.skills ?? [])]).known;
  const canScore = role && (profile || body.data.skills);

  const requested = resolveSkills(body.data.gapSkills ?? role?.essentialSkills ?? []);
  const gap = canScore ? scoreRole(new Set(have), role, snap).gapSkills : requested.known;

  const momentum = new Map(snap.skills.map((s) => [s.escoUri, s.momentum]));
  const plan = planPathway(gap, catalogue, momentum);

  // Re-run the scoring engine after each course: the score climbs step by step
  const learned = new Set(have);
  const steps = plan.steps.map((step) => {
    step.covers.forEach((s) => learned.add(s));
    return {
      course: { ...step.course, teaches: step.course.teaches.map(label) },
      sdgs: role?.sdgs ?? body.data.sdgs ?? [],
      covers: step.covers.map(label),
      cumulativeHours: step.cumulativeHours,
      ...(canScore && { scoreAfter: scoreRole(learned, role, snap).score }),
    };
  });

  res.json({
    roleUri: role?.escoUri,
    snapshotDate: snap.date,
    ...(canScore && { scoreBefore: scoreRole(new Set(have), role, snap).score }),
    steps,
    totalHours: plan.totalHours,
    // unrecognised skill names can't be planned for either, so report them too
    uncoveredSkills: [...plan.uncoveredSkills.map(label), ...(canScore ? [] : requested.unknown)],
  });
});

app.use("/api", api);
app.use("/api", (_req, res) => res.status(404).json({ error: "Unknown API route" }));

// In production the server also serves the built frontend, so the whole app is one URL
const webDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../web/dist");
if (existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(webDist, "index.html")));
}

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}/api — ${roles.length} roles, ` +
    `${snapshots.size} snapshots (${snapshotDates().join(", ")}), ${profiles.length} profiles, ${courses.length} courses`);
});

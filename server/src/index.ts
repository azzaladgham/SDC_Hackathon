import express, { type Request, type Response } from "express";
import { z } from "zod";
import { SCENARIOS, SDG_POINTS } from "./config";
import {
  courses, label, latestSnapshot, profiles, resolveSkills, roles, skillLabels, snapshotDates, snapshots,
} from "./data";
import { rankRoles } from "./scoring";

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

app.use("/api", api);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}/api — ${roles.length} roles, ` +
    `${snapshots.size} snapshots (${snapshotDates().join(", ")}), ${profiles.length} profiles, ${courses.length} courses`);
});

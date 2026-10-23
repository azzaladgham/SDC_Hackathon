# Matching engine + API (`/server`)

Ranks future roles for a person, explains every score, and builds a reskilling pathway.
Deterministic code does all ranking. No language model ranks roles or names jobs or courses.

## How scoring works

For each role, the score starts from how many of the role's **ESCO essential skills** the person already has,
then is adjusted by **skill trends** and **automation exposure**:

```
score = 100 × overlap × (1 + w·momentum − p·exposure)      clamped to 0..100
```

| Term | Meaning | Source |
|---|---|---|
| `overlap` | share of the role's essential skills the person has (0..1) | ESCO (`data/esco.json`) |
| `momentum` | average trend of the role's tracked skills: mentions in the last 3 months vs the 3 before, capped to [-1, 1] | dated snapshots in `data/snapshots/` (arXiv API + HN "Who is hiring") |
| `exposure` | how automatable the role is (0..1) | per role, cited in `role.source` |
| `w`, `p` | scenario weights | `src/config.ts` |

**Two scenarios instead of one prediction:**

| Scenario | `w` (trend weight) | `p` (automation weight) |
|---|---|---|
| Moderate AI disruption | 0.3 | 0.15 |
| Fast AI disruption | 0.6 | 0.35 |

Every role gets both scores, shown as a range and labelled as an estimate.

**Explainable:** the API returns the score as points that add up:
`overlap + trendBonus − exposurePenalty` (e.g. `70 − 4.2 − 8.4 = 57`).
Trend and automation scale with overlap, so a role you barely match can't be pushed to 0 by automation alone.

**SDGs:** roles serving an SDG the user picked get `sdgBoost` (5 points), which the UI's SDG slider multiplies.
It's kept separate from the score so the user can see the effect.

**Coverage:** `coverage` is the share of a role's skills that have trend data. Low coverage means the trend
part of the score rests on little data.

## Reskilling pathway

Greedy plan over `data/courses.json`: repeatedly pick the course with the best
*value per hour*, where value = number of gap skills it newly covers, with rising skills counting extra.
Ties go to free, then low-cost, then HRD Corp-claimable courses, then shorter ones.
After each course the scoring engine re-runs, so each step shows the score climbing.
Skills that no course teaches are listed in `uncoveredSkills`. The system never invents a course.

## Fairness and guardrails

- The engine only receives skills and SDG choices: no name, age, gender or background.
- Same input → same output (ties are broken alphabetically), covered by tests.
- Every response carries the snapshot date; snapshots carry source URLs and fetch times.

## API

All routes are under `/api`. `?snapshot=YYYY-MM-DD` is optional (default: latest).

| Route | Body | Returns |
|---|---|---|
| `GET /health` | | `{ ok: true }` |
| `GET /snapshots` | | available snapshot dates |
| `GET /snapshots/latest`, `/snapshots/:date` | | the snapshot with sources |
| `GET /profiles` | | sample (synthetic) profiles |
| `GET /skills` | | every known ESCO skill `{ escoUri, label }` |
| `GET /methodology` | | formula and weights |
| `POST /match` | `{ profileId?, skills?, sdgs? }` | all roles with scores, ranks, breakdown, have/gap skills |
| `POST /pathway` | `{ roleUri, profileId? \| skills?, sdgs? }` or `{ gapSkills }` | ordered courses, hours, score after each step, uncovered skills |

Skills can be sent as ESCO URIs or exact ESCO labels.

## Run

```bash
cd server
npm install
npm run dev      # http://localhost:3001/api
npm test         # 24 tests
```

Real files in `/data` are used when present; `server/mocks/` fills the gaps (marked `MOCK`).
In production `start.sh` builds `web/` and the server serves it, so the app is a single URL.

## Known limitations

- Trend data comes from research papers and Hacker News job threads, which skew toward global tech roles.
- Many non-tech roles have few tracked skills (low coverage), so their trend term is weak.
- Scenario weights are transparent assumptions, not fitted to outcome data.

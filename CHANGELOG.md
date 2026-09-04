# Changelog

Dated releases, newest first. `vYYYY.MM.DD`. Repository tests and runtime
evidence outrank anything written here; where this file and `TASKS.md` disagree,
`TASKS.md` and the `.delivery/` run records are authoritative.

## v2026.09.04

Twenty-eight commits at the tag. A ten-task queue (TASK-047..058) carried end to end with
eight independent reviews across two model routes. Five of the ten produced
corrections to claims the implementer had made — recorded here because that is
the useful part.

### The theme

Every defect fixed this release is the same shape: **a guard that did not guard.**
None was found by reading. All were found by breaking something and checking
whether anything noticed.

### Added

- **`mutation-sweep`** — replaces `bin/<name>` with a stub that exits 0, runs
  `bin/<name>-test`, and reports whether the test noticed. The stub records its
  own invocation, so a test that passes without running it is `UNSWEEPABLE` by
  name rather than counted healthy. Result on this repository: 41 pairs,
  **0 SURVIVED** — no test here is wholly empty.
- **`skill-map`** — renders `skills/local/README.md` from frontmatter: 66 skills
  in 11 domains, each with its first registry sentence and the siblings it
  mentions. `--check` fails a stale map by name; `ai-policy-lint` runs it.
- **Ten tests for commands that had none**, including `ai-doctor` — 658 lines,
  the health command every other gate defers to, itself judged by nothing.
- **`README.md`**, which had been 0 bytes on `origin/main` since 2026-08-30.

### Fixed

- **`ai-memory-hygiene` had a branch that could not execute.** Its size check
  returned at the advisory limit (20,000) before consulting the router budget
  (12,000), so "this file can NEVER be selected" was unreachable for every
  project file between them. Two were in that gap while the gate reported zero
  issues.
- **`skill-check` measured with a different ruler than it validated with** —
  an awk scan over by 188 characters across 36 skills. That number is the one
  figure a task can be held to.
- **`resume-brief` could not see a contract with no run.** A freshly accepted
  queue of eight reported "0 ready to start" — the command whose job is
  answering "where am I" saying "nowhere to go" at the moment there was most
  to do.
- **The memory router reached 26 of 69 project-memory files.** A project key may
  now name a list with per-file triggers; `ai-policy-lint` fails by name on any
  file no route reaches. Review caught that the first draft let a trigger-matched
  memory file outrank `STATUS.md` and `.delivery/current.json` — inverting the
  router's own rule that repository evidence is authoritative.
- **Payment work routed only to Stripe**, which no project uses, while DOKU,
  AutoLaris and Mengantar appeared in no routing table at all.
- **The multi-account Claude switcher was retired in 2026-07-29 but never
  removed.** A second profile survived on this device, still taking session
  writes with no `settings.json` — no `.env` deny, no hooks. Both installers now
  retire it; `device-register` reports it so the committed device record answers
  "is this machine clean?" without logging in.
- **`task.isolation.mode`** pinned a name OMP no longer prints. Behaviour was
  never affected; the gate's view of it was.

### Also fixed after the tag

- **`shopify-content-helper` shipped the CTA text `CLAUDE.md` forbids.** Its meta
  templates offered "Buy Online at [Brand]", "Shop … at [Brand]" and "order online
  today", and asserted "Free Shipping & Best Price" about a shop the command knows
  nothing about — so the tool made the breach the path of least effort. Six
  templates replaced with descriptive ones. Found by reviewing the test written
  for the command, whose own header promised a CTA check and made none.
- **Its `≤60` and `≤155` headers were labels, not checks.** A 35-character keyword
  produced titles of 63, 70 and 73 characters under a header still claiming the
  limit. Each template now reports its length and names an overrun. Same defect
  shape as the CTA, found only because the first one was.

### Removed

- `cloudflare-one-migrations` — the one skill with no basis here after auditing
  all 67. Everything else that looked droppable was load-bearing.
- `config/omp/config.yml.lock`, `docs/dev-setup.md`, `docs/preview/` — verified
  by independent search to have no reader.

### Corrected in the record

- **Repository visibility is no longer recorded in memory at all.** Commit
  messages this cycle called it public, taken from a memory line instead of the
  `gh api` check `CLAUDE.md` names for exactly that claim. The line was corrected
  to private at 05:0x on 2026-09-04 — and by 06:34 the same morning `gh api`
  reported public again. A state written down is a claim with an expiry nobody
  sees, so the memory now carries only the command to run at the moment of the
  claim. The commit messages stand as written.
- TASK-049's original targets were unmeasured guesses and were **dropped, not
  renegotiated** after review showed the justification for dropping them was
  falsified by the artifact itself.

### Known limits

- `mutation-sweep`'s single operator finds wholly empty tests, not partially
  vacuous ones. It would **not** have caught the defect that motivated it.
- Four commands still have no test: `dotpush`, `vps-pgdump`, `tmux-setup`,
  `pi-update-safe`. The first wording here said they have "no safe seam"; review
  showed that is false — each is testable behind a shim, and `pi-update-safe`
  already exposes `PI_RUNTIME_SKILL_DIRS` for exactly that. "No seam" was doing
  work that "needs a shim" should do.
- **The ten tests shipped with escapes.** The review that returned after the tag
  found a plausible bug slipping past nine of them, including an `ai-doctor-test`
  that pinned this machine's health rather than the subject's contract and would
  have failed on any device reporting a single finding. Fixed after the tag.
- Two memory files exceed the router budget and can never be selected. They are
  now reported on every hygiene run instead of passing in silence.

## v2026.08.17

Prior baseline. See `docs/archive/` for the task contracts of that cycle.

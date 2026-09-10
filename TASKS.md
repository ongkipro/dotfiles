# Tasks — dotfiles

Updated: 2026-09-08

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## In progress

_None._

## Recently completed

- **TASK-070 / REQ-TASK-ID-UNIQUENESS (R1).** `ai-policy-lint` now fails when one
  `TASK-nnn` carries two different requirements, naming the number and both. Two
  collisions exist and are kept as a named baseline rather than repaired — `docs/archive`
  is immutable and `.delivery` runs reference those IDs — and the check fails on them
  the moment the baseline is emptied, so it is an exemption rather than decoration.
  The work was in the false positives: the first version reported **12** hazards, all
  its own definition being too loose. A heading like `## TASK-015 decisions` in a build
  log is prose about a task, not a record; and two blank records inside one file are a
  single entry continued, as `TASK-052` "superseded"/"(original)" is. Ten numbers repeat
  on disk and only **two** are collisions — a check reporting ten would have been noise
  and been switched off. Eight fixtures, three mutations bite.

- **TASK-069 / REQ-OMP-PERFORMANCE (R2, reviewed).** Native delegation
  exposed that enabling isolation does not request it: omitted task-item flags
  allowed direct parent edits. Confirmed against version-pinned 18.1.13 source,
  then verified an explicit-isolation run with retained patches and parent
  integration. Serial, shared-workspace delegation, and explicit isolation each
  passed 100 external checks plus the immutable integration test. The playbook
  now requires `isolated: true` per editing task and artifact/path inspection,
  and keeps small fixes in the parent. Corrected misleading routing claims;
  retained model/eager settings because the probes do not justify changing them.
  Policy lint and independent evidence review passed. TASK-068 work preserved.
  Evidence: RUN-20260907T174139Z-2a1123c8.

- **TASK-068 / REQ-OMP-PERFORMANCE (R2, reviewed).** Reviewed community
  experiments and measured native OMP 18.1.13: four Sol/high workspace runs
  passed 112 external checks each; seven JSON probes confirmed exact requested
  model routes. Catalog docs saved initial tokens but showed no task-time
  benefit in this small sample, so native routing and builtins remain unchanged.
  Fixed false runtime-report OK on an empty registry, restored isolation status
  from the current schema, and documented measurement limits and native
  ownership in `config/omp/PERFORMANCE.md`. Focused positive/negative regression
  passed; independent review approved the code and evidence.
  Evidence: RUN-20260907T173432Z-07cbc6a1.

- **TASK-067 / REQ-TEST-PORTABILITY (R1).** Two Claude-profile states `ai-doctor` can
  report were asserted by nothing, and neither is hypothetical: a `settings.json` that
  exists but carries no `.env` deny, and a revived `~/.claude-accounts` — the second
  profile that took session writes unguarded for weeks in August. The CI fixture from
  TASK-063 proves the satisfied path from one HOME; these need their own, so a per-case
  `profile` helper adds them without disturbing the healthy baseline. Eleven cases, zero
  skips. Renumbered from 063 on integration: that number was taken by the OMP update sync,
  the second colliding allocation this cycle.

- **TASK-066 / REQ-PROMOTION-CORPUS-RACE (R2, reviewed).** Directory discovery
  now excludes ai-learn's private probe/preview/write files, so another writer
  cannot remove a discovered preview before canonical indexing. Explicit preview
  arguments remain validated. Regression fails without the filter and passes
  with it; concurrent promotion passes with a corrected barrier that proves
  both writers reached preview validation. No actual memory content changed.
  Evidence: RUN-20260907T171741Z-934cb927.

- **TASK-065 / REQ-CROSS-DEVICE-INTEGRATION (R2).** Integrated origin/main
  764c40c with the verified local update. Retained remote queue archives and
  physical-path assertions, and the local synthetic Claude fixture. Kept all
  historical runs; assigned TASK-064 to the model-policy work after detecting
  two independent TASK-062 allocations. Merged fixture checks passed.
  Evidence: RUN-20260907T170943Z-633c7170.

- **TASK-063 / REQ-OMP-UPDATE-SYNC (R2, reviewed).** Updated rich's native OMP
  from 18.1.10 to 18.1.13 and verified native routing, shared context, 66 skills,
  and local runtime health. CI fixtures now use a synthetic Claude profile and
  launcher, and normalize temporary paths for macOS. The full suite passed;
  the final launcher-isolation refinement passed its focused rerun. Independent
  negative deny/hook fixtures and symlinked-TMPDIR checks passed. Previously reviewed model-policy
  changes were preserved for the authorized publication.
  Evidence: RUN-20260907T170125Z-c0d35e3d.

- **TASK-064 / REQ-MODEL-AGNOSTIC (R3).** Owner-authorized removal of model/provider
  eligibility locks from shared capability instructions, OMP orchestration,
  delivery-ledger and policy lint. Separate actual-agent review, truthful
  provenance, self-review rejection, stale-evidence checks and live-operation
  approvals remain. Same-route R3 approval/finish/verify and policy fixtures pass;
  canonical policy lint passes. Native runtime defaults and historical runs were
  not rewritten. Contract and retained TASK-058 history: [archive](docs/archive/DOTFILES_TASKS_2026-09-07_CONTEXT_RETENTION.md).
  Historical run uses TASK-062; canonical ID is TASK-064 after the cross-device
  collision with REQ-TEST-PORTABILITY. Evidence: RUN-20260907T163715Z-9766f188.


- **TASK-062 / REQ-TEST-PORTABILITY (R1).** The Claude-profile skip approach
  is superseded by TASK-063 synthetic fixtures; its portable path checks remain.
  CI had been red since `dce20b5` on
  2026-09-04 — my commit — and I never looked after pushing. Three tests failed, two
  mine, all for one reason: they asserted the environment they were written in.
  `ai-doctor-test` required three lines `ai-doctor` emits only when Claude Code is
  installed, which CI was not; that revision skipped those cases explicitly and
  printed `PASS (2 skipped)` rather than counting silence as health. `inspect-project-test`
  and `skill-map-test` compared a `mktemp` path against what `git`/`cd -P` report,
  which differs on macOS where `/var` resolves to `/private/var`; both now ask for
  the resolved path instead of assuming it. Both failure shapes were reproduced
  locally before being fixed. `mutation-sweep` reported BITES for all three,
  and stubbing each subject with the skips active still failed — the skips did not
  hollow the tests out.

- **TASK-061 / REQ-LOCAL-SYNC (R2, reviewed).** Added mise-managed ripgrep,
  verified it outside AI-injected PATH, corrected toolchain references, and
  refreshed rich's device snapshot. GNU timeout's SIGKILL exit 137 now reports
  ERROR in mutation-sweep; errors also fail the command. The doctor timeout
  fixture no longer scans the real repository. Replaced unavailable Codex-only
  selectors and checked overlay visual primaries/fallbacks for image support.
  Full repository self-test passed; independent negative visual fixtures passed.
  Evidence: RUN-20260907T160155Z-6c558cf6.

- **TASK-060 / REQ-RUNTIME-COMMAND-SYMLINK (R1).** After the 2026-09-04 pull,
  the newly installed `~/.local/bin/skill-map-test` link ran nine fixture cases
  successfully but failed its real-repository check because it derived `ROOT`
  from the symlink directory (`~/.local`) instead of the command target. Root
  discovery now follows relative and absolute symlinks. Both repository-direct
  and installed invocations pass all eleven cases; the full repository self-test
  and the live runtime-command manifest check also pass.

## Done

Archived under `docs/archive/`, newest `DOTFILES_TASKS_2026-09-04_QUEUE.md`
(TASK-047..059), then `DOTFILES_TASKS_2026-09-01_DEVICE_VERIFICATION.md`
(TASK-038–041, 044; prose closures for TASK-013/022/027/028).

## Pending


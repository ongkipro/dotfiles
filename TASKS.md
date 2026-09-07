# Tasks — dotfiles

Updated: 2026-09-07

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## In progress

_None._

## Recently completed

- **TASK-062 / REQ-TEST-PORTABILITY (R1).** CI had been red since `dce20b5` on
  2026-09-04 — my commit — and I never looked after pushing. Three tests failed, two
  mine, all for one reason: they asserted the environment they were written in.
  `ai-doctor-test` required three lines `ai-doctor` emits only when Claude Code is
  installed, which CI is not; those cases now SKIP aloud and the suite prints
  `PASS (2 skipped)` rather than counting silence as health. `inspect-project-test`
  and `skill-map-test` compared a `mktemp` path against what `git`/`cd -P` report,
  which differs on macOS where `/var` resolves to `/private/var`; both now ask for
  the resolved path instead of assuming it. Both failure shapes were reproduced
  locally before being fixed. `mutation-sweep` still reports BITES for all three,
  and stubbing each subject with the skips active still fails — the skips did not
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


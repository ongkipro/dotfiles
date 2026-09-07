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

### TASK-062: Three tests that pin the machine they were written on
- **Requirement:** REQ-TEST-PORTABILITY
- **Risk Level:** R1
- **Allowed Paths:** `bin/ai-doctor-test`, `bin/inspect-project-test`, `bin/skill-map-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** `bin/ai-doctor`, `bin/inspect-project`, `bin/skill-map`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** every case asserts the subject's contract, not the environment the test happened to run in; a case that cannot be judged where it runs SKIPs aloud rather than failing or passing silently; each keeps at least one mutation that bites
- **Regression Checks:** `ai-doctor-test`, `inspect-project-test`, `skill-map-test`, `mutation-sweep`, `ai-policy-lint`
- **Runtime Evidence:** CI has been red since `dce20b5` (2026-09-04) and I never looked. `ai-doctor-test` requires three lines `ai-doctor` only emits when Claude Code is installed, which CI is not — reproduced locally by removing `claude` from PATH. `inspect-project-test` greps `Repo root: $R` where `$R` comes from `mktemp`, but git reports the resolved path, so macOS `/var` versus `/private/var` fails it — reproduced locally through a symlinked root. `skill-map-test`'s root-resolution case fails the same way. All three pass on the machine that wrote them and nowhere else
- **Reopen Conditions:** a test asserts a line only one platform or one installed runtime produces
- **Non-Scope:** changing any of the three subjects; the CI workflow
- **Verification:** `bin/ai-doctor-test` passes with `claude` absent from PATH, and all three pass from a symlinked root
- **Escalation Conditions:** a contract genuinely cannot be asserted without the runtime present


The 2026-09-04 queue (TASK-047..056) is complete; see Recently completed.

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until five immutable delivery records exist for one skill; then `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`. Never fabricate attribution.

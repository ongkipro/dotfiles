# Tasks — dotfiles

Updated: 2026-08-28

This is the sole executable queue. Historical detail through TASK-016 is
archived in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Repository
tests and runtime evidence outrank prose.

## Task contract

Every implementation task records: Requirement, Risk Level, Job, Capability,
Execution Class, resolved Model/Provider/Reasoning, Change Surface, Protected
Surface, Accepted Invariants, Shared Owner, Regression Checks, Reopen
Conditions, Non-Scope, Verification, and Escalation Condition.

R0 may infer one obvious documentation path. R1 must remain bounded. R2 needs
an explicit affected surface. R3/R4 need explicit protected surfaces and
independent review evidence. Parallel children with a shared semantic owner do
not run concurrently even when their file globs are disjoint.

## In progress

_None._

## Recently completed

### TASK-025: Executed evidence for delivery checks
- **Requirement:** REQ-EXECUTABLE-EVIDENCE
- **Risk Level:** R2
- **Allowed Paths:** `bin/delivery-ledger`, `bin/delivery-ledger-test`, `docs/task-change-boundary.md`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `delivery.verification-event`
- **Accepted Invariants:** a recorded status is either derived from an exit code or explicitly declared, never both
- **Regression Checks:** `delivery-ledger-test`, `ai-policy-lint`
- **Runtime Evidence:** this run's own verification events carry `executed.exitCode`
- **Reopen Conditions:** a PASS is recorded for a check that has an exit code but was not run
- **Non-Scope:** child-run recording, browser evidence
- **Verification:** `bash bin/delivery-ledger-test`
- **Escalation Conditions:** the flag cannot derive a status without shelling out unsafely

`record --command` runs the check and derives the status from its exit code;
`--status` alongside it is refused, because an agent that may both run a check and
name its result can skip the first half. Motivated by this repository accepting
`installer-link-test PASS` detailed "pending run below" earlier the same day —
recorded before the check ran, by the session building these gates.

The first attempt at this run was finished `BLOCKED`: the new flag was exercised
inside the live run, and a deliberate `exit 3` probe recorded a real FAIL that
correctly barred `PASS`. The ledger behaved exactly as designed; the run did not.

### TASK-022: Register every owned test command in the runtime manifest
- **Requirement:** REQ-DELIVERY-CONTRACT-GAPS
- **Risk Level:** R1
- **Allowed Paths:** `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.command-manifest`
- **Accepted Invariants:** every manifest entry resolves to an executable under `bin/`
- **Regression Checks:** `installer-link-test`, `ai-policy-lint`, `skill-surface-check`
- **Runtime Evidence:** `installer-link-test` reports "runtime command manifest and hook wiring"
- **Reopen Conditions:** a `bin/*-test` exists that the manifest does not list
- **Non-Scope:** installer behaviour, hook wiring
- **Verification:** `installer-link-test`
- **Escalation Conditions:** manifest and `bin/` disagree after one repair attempt

Four commands were unregistered, not the one the pending entry named:
`ai-memory-link-test`, `project-check-test`, `vendored-refresh-test`, and
`omp-runtime-report-test` — the last added earlier the same day by the session
that then found the gap. `ai-doctor --self-test` discovers tests through its own
`bin/*-test` glob, so nothing was broken; the manifest is what every installer
links into `~/.local/bin`, so an unregistered command simply never arrives on a
new device.

### TASK-024: Restore upstream-native OMP ownership and autonomous goal orchestration
- **Status:** DONE (2026-08-28)
- **Requirement:** REQ-OMP-UPSTREAM-DEFAULT, REQ-OMP-AUTO-ORCHESTRATION
- **Risk Level:** R3
- **Job:** implementation
- **Capability:** `continuous-learning`, `testing-engineering`
- **Execution Class:** precision
- **Model / Provider / Reasoning:** root-codex, codex-runtime, openai, adaptive.
- **Allowed Paths:** `config/shell-tools.sh`, `config/tmux.conf`, `install.sh`, `install-macos.sh`, `bin/{ai-doctor,ai-policy-lint,installer-link-test,shell-wrapper-test,omp-workspace-test,omp-routing-test,omp-effective-routing-test}`, `config/ai/{AGENTS.md,README.md,runtime-commands.txt,memory/skills.md,memory/environment-ai-runtimes.md,memory/decisions.md}`, `config/pi/README.md`, `config/omp/**`, `devices/{README.md,rich.md}`, `docs/{linux-dev-setup.md,DOTFILES_AI_ENGINEERING_MASTER_BLUEPRINT.md,DOTFILES_AI_ENGINEERING_CONTROL_PLANE.md}`, `TASKS.md`
- **Protected Paths:** `config/ai/AGENTS.md`, `config/shell-tools.sh`
- **Canonical Contract Owners:** `operations.omp-native-runtime`, `operations.shared-context`, `operations.omp-regression`
- **Producers:** installers, shared context/skill adapters, and OMP boundary checks.
- **Consumers:** native OMP sessions, fresh-device installs, and repository health checks.
- **Depends On:** TASK-023 (superseded by this task).
- **Runtime Evidence:** native OMP 18.0.9 installed with release checksum verification; no dotfiles `PI_CONFIG_FILES`; no live links to retired `config/omp/{config.yml,models.yml,agents}`; native config and the tracked reference are semantically equal after update; shared `AGENTS.md` and owned-skill links still resolve to dotfiles; every role and fallback selector resolves; live JSON probes show `@orchestrator` selecting Fable 5 and `@advisor` selecting Opus 5; existing direct Anthropic authentication was used without reading or changing credentials; Terra is the default parent, Fable is the native planning model plus an explicit orchestration alias, Gemini only handles lightweight work, Sol owns all development and database implementation, and Opus owns visual/review judgment; the passive advisor runtime is off while reviewer agents still resolve independently to Opus High/XHigh; interactive Goal Mode auto-continuation, preferred task/todo orchestration, batch dispatch, per-task effort, model badges, bounded isolated children, and the shared autonomous-goal contract are active.
- **Accepted Invariants:** OMP owns its command, runtime config, bundled agents, model/provider catalog, routing, updates, workspace behavior, authentication, and session state; the secret-free dotfiles reference records capability tiers without becoming an installed runtime override; explicit repository goals use `TASKS.md` as the execution queue and repository evidence as completion authority; Terra is the default conductor, Fable is explicit escalation for hard long-horizon planning/orchestration, Gemini is restricted to lightweight work, Sol owns implementation, and Opus owns expert judgment; non-trivial cross-module R2 gets Opus review and R3/R4 requires independent Opus/security review plus ledger approval; parent sessions own integration; child isolation is automatic, patches do not auto-apply, concurrency is four, recursion depth is one, and prewalk cannot silently downgrade an executor to Gemini; approval gates remain mandatory; dotfiles supplies OMP with shared `AGENTS.md` context and owned skills; no credential is read or changed.
- **Regression Checks:** `bin/shell-wrapper-test`, `bin/omp-workspace-test`, `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `bin/installer-link-test`, `bin/ai-policy-lint`, `bin/ai-doctor --self-test`, `git diff --check`
- **Reopen Conditions:** a shell wrapper or `PI_CONFIG_FILES` injection returns, an installer links tracked OMP runtime state, a live runtime path points into retired `config/omp/` state, or memory/docs again claim dotfiles owns OMP routing.
- **Rollback/Migration State:** exact legacy OMP model/agent links are retired; native config, auth, sessions, cache, and unmanaged files are preserved. Historical routing artifacts are not linked or auto-loaded; `config/omp/config.yml` remains the maintained secret-free reference used only when explicitly requested and by regression tests.
- **Non-Scope:** Anthropic login, credential inspection or migration, creating MCP configuration without a concrete requirement, deleting historical evidence, production actions, commits, and pushes.
- **Verification:** PASS — OMP 18.0.9 update, post-update links, configuration
  parity, model selectors, native goal/task settings, focused regressions, live
  Terra/Fable probes, full repository self-test, independent Opus review, and
  the final R3 delivery boundary all passed.
- **Escalation Conditions:** native OMP differs from a pristine upstream config, or final boundary review is required for the protected/pre-existing change surface.


## Done

Completed task contracts through TASK-023 are archived in:

- `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
- `docs/archive/DOTFILES_TASKS_2026-08-18_THROUGH_2026-08-23.md`

## Pending

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.
- **TASK-013 / AUDIT-CI-01 — restore hosted GitHub Actions execution (R2).** Human billing owner must remove the external Actions block, then a fresh Ubuntu/macOS matrix must start and conclude normally. AI must not change billing or weaken CI.
- **TASK-021 / REQ-DELIVERY-CONTRACT-GAPS — fix the broken `start-child` example in `docs/task-change-boundary.md` (R1).** TASK-020's routing-provenance guard broke the canonical parallel-child example; deferred because the file carried unaccepted pre-existing dirty work at TASK-020's `start`. New run must `--accept-dirty` it.
- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — wire `project-check-test` into `config/ai/runtime-commands.txt` (R1).** Same deferral reason as TASK-021, same file class. Cosmetic only: `ai-doctor --self-test` already discovers the test via its `bin/*-test` glob.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.

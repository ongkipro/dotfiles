# Archived Tasks — Whole-System Reliability and CI Repair (2026-10-24)

Archived from `TASKS.md` verbatim after completion; evidence stays in the referenced delivery runs.

### TASK-135: Whole-system reliability and community evidence

- **Requirement:** REQ-WHOLE-SYSTEM-HARDENING (owner authorizes implementation and review of the 2026-10-24 whole-system audit, with community experience, updated docs, log, and system map).
- **Risk Level:** R3.
- **Allowed Paths:** precise parent/child boundaries in `RUN-20261024T093836Z-08b11229`; installer/shell/backup, memory/MCP/Pi, release/project/resume checks, Meta state, secret scanner, vendored refresh, Node pin, CI, runtime manifest, and their tests and documentation.
- **Protected Paths:** unrelated pre-existing edits, credentials, provider choices, live APIs and services.
- **Canonical Contract Owners:** system migration -> installers/linker; memory -> existing memory commands; delivery evidence -> ledger; Meta workflow -> `dotads-meta`; sources -> research evidence document.
- **Accepted Invariants:** preserve foreign/user data; distinguish failure from no-op; bind state to account and parents; serialize apply; preserve private file permissions; verify canonical evidence; no false success from missing checks; community claims require official corroboration or local reproduction.
- **Regression Checks:** affected command suites, negative fixtures, syntax/workflow/policy checks, complete core self-test, independent review and final boundary.
- **Runtime Evidence:** final Linux aggregate 77/77 PASS under Node24.22.1/Pillow13.0.0, focused review regressions and independent reviews PASS; parent run `RUN-20261024T093836Z-08b11229`. Hosted CI/macOS and live operations remain unverified.
- **Non-Scope:** checkpoint/mobile access, Google/TikTok operations, automatic services, production calls, credentials, commit/push.
- **Reopen Conditions:** regression of findings F1–F9 or W1–W16; documentation claims exceed executed evidence.
- **Escalation Conditions:** unrelated user work, system or production changes become necessary.

### TASK-136: Repair hosted Linux/macOS CI after whole-system hardening

- **Requirement:** REQ-CROSS-PLATFORM-CI-REPAIR (owner requests investigation, fixes and refinement for failing hosted gates on remote f96b8d5).
- **Risk Level:** R3.
- **Allowed Paths:** memory telemetry, workflow evaluation/toolchain helper and tests; Meta/link/recall regression suites; Core runtime workflow; TASKS/STATUS/CHANGELOG/system map/reliability evidence docs; exact parent and child boundaries in the delivery run.
- **Protected Paths:** unrelated local memory/design edits and config/tmux.conf; credentials, providers, services and live advertising.
- **Canonical Contract Owners:** telemetry -> ai-memory-access; execution evidence -> ai-workflow-eval; runtime discovery -> _toolchain-path.sh; regression portability -> existing suites.
- **Accepted Invariants:** identical Linux/macOS semantics, symlink/hardlink guards retained, actual errors remain failures, no optional dependency masquerades as product failure, user edits survive synchronization.
- **Regression Checks:** failing suites, negative trust-boundary fixtures, real Git-index snapshot checks, policy/workflow/syntax, aggregate self-test and independent review; hosted results only when actually observed.
- **Runtime Evidence:** local Linux aggregate 77/77 PASS; real browser workflow30/30 PASS; independent portability review PASS; run `RUN-20261024T110436Z-6716ffde`. Hosted confirmation is checked separately after publication.
- **Non-Scope:** weakening security or assertions, secrets, runtime/provider changes, services, checkpoint/mobile features.
- **Reopen Conditions:** a runner-specific regression returns or a skipped check is called verified.
- **Escalation Conditions:** an unrelated user edit, system install or live action becomes necessary.

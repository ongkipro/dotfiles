# Project Instructions — {{PROJECT_NAME}}

## Scope

This file contains repository-specific rules only. Global safety, Git, secret-handling, native-first, and verification policy comes from the user's canonical AI policy.

## Project

- Purpose: {{DESCRIPTION}}
- Category: {{CATEGORY}}
- Expected stack: {{STACK}}

## Sources of truth

- Accepted product behavior: `PRD.md`
- Executable work queue: `TASKS.md`
- Current implementation handoff + delivery state: `STATUS.md`
- Durable implementation notes: `BUILD-LOG.md`
- Architecture: `docs/architecture.md`

Inspect the repository's actual configuration before adding stack-specific rules. Disk and executable behavior override stale documentation.

## Delivery enforcement

- A task is not complete until its declared verification passes.
- Use `project-check --changed` while iterating and `project-check --full` before integration/release.
- Browser-visible work requires `project-check --ui` when the repository exposes a runnable UI/E2E check; absence of one is `UNVERIFIED`, never a silent pass.
- `project-check` exit `2` means `UNVERIFIED`; do not reinterpret it as success.
- Run `diff-risk` after implementation. Effective risk is the highest credible risk from the task contract, deterministic diff classification, and review findings.
- R3/R4 changes require an independent strong review recorded as `Independent-Review: PASS` in `STATUS.md` before production readiness can pass.
- `production-gate` is the authoritative readiness aggregator. It never grants permission to deploy; production/live approval remains a separate human gate.
- Do not skip delivery states in `STATUS.md` to make a gate pass.

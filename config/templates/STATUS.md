# Status — {{PROJECT_NAME}}

Updated: {{DATE}}
Status: {{STATUS}}
State: PLANNED
Review-Risk: R0
Independent-Review: PENDING

## Delivery state machine

Allowed forward path:

`PLANNED -> READY -> IMPLEMENTING -> VERIFYING -> REVIEWING -> INTEGRATING -> PRODUCTION_READY -> AWAITING_DEPLOY_APPROVAL -> DEPLOYED -> SMOKE_TESTING -> VERIFIED`

Use `BLOCKED` only as an interruption state. Record the blocker and exact state to resume. Do not skip verification/review/integration states. `production-gate` proves the transition from `INTEGRATING` to `PRODUCTION_READY`; it never deploys.

`RELEASE.md` owns release-specific truth: release ID, base, declared risk, rollback reference/command, backup proof, and readiness status. `Review-Risk` is the highest semantic risk found during review. `production-gate` computes effective release risk as max(`RELEASE.md` Declared-Risk, deterministic `diff-risk`, `Review-Risk`). R3/R4 require `Independent-Review: PASS`.

`OBSERVABILITY.md` owns post-deploy verification probes. After deployment, transition to `SMOKE_TESTING` and run `release-check`. Every configured observability probe must pass before transition to `VERIFIED`.

## Current state

Repository-local development contract initialized. No implementation claim is recorded until verified against the repository.

Bootstrap evidence: {{GENERATED_STATE}}. Selected stack: `{{STACK}}`.
Database `{{DATABASE}}`, authentication `{{AUTH}}`, and deployment target
`{{DEPLOY}}` are decisions only until their future tasks pass executable checks.

## Active work

No active implementation task is recorded.

## Blockers

None recorded.

## Verification evidence

None recorded.

## Next verified action

Inspect the repository, accept requirements, create bounded tasks, then transition `State` to `READY` before implementation begins.

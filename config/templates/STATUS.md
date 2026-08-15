# Status — {{PROJECT_NAME}}

Updated: {{DATE}}
Status: {{STATUS}}
State: PLANNED
Review-Risk: R0
Independent-Review: PENDING

## Delivery state machine

Allowed forward path:

`PLANNED -> READY -> IMPLEMENTING -> VERIFYING -> REVIEWING -> INTEGRATING -> PRODUCTION_READY -> AWAITING_DEPLOY_APPROVAL -> DEPLOYED -> SMOKE_TESTING -> VERIFIED`

Use `BLOCKED` only as an interruption state. Record the blocker and the exact state to resume. Do not skip verification/review/integration states. `production-gate` is allowed to prove the transition from `INTEGRATING` to `PRODUCTION_READY`; it never deploys.

`Review-Risk` is the highest semantic risk found during review (`R0`–`R4`). `production-gate` computes effective risk as the maximum of declared task risk, deterministic `diff-risk`, and `Review-Risk`. R3/R4 require `Independent-Review: PASS`.

## Current state

Repository-local development contract initialized. No implementation claim is recorded until verified against the repository.

## Active work

No active implementation task is recorded.

## Blockers

None recorded.

## Verification evidence

None recorded.

## Next verified action

Inspect the repository, accept requirements, create bounded tasks, then transition `State` to `READY` before implementation begins.

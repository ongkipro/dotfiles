# Status — {{PROJECT_NAME}}

Updated: {{DATE}}
Status: {{STATUS}}
State: PLANNED
Release-Base: UNSET
Release-Risk: R0
Review-Risk: R0
Independent-Review: PENDING
Smoke-URL: TBD
Smoke-Contains: TBD

## Delivery state machine

Allowed forward path:

`PLANNED -> READY -> IMPLEMENTING -> VERIFYING -> REVIEWING -> INTEGRATING -> PRODUCTION_READY -> AWAITING_DEPLOY_APPROVAL -> DEPLOYED -> SMOKE_TESTING -> VERIFIED`

Use `BLOCKED` only as an interruption state. Record the blocker and exact resume state. Do not skip verification/review/integration states.

Before `production-gate`:

- `Release-Base` = last deployed/accepted commit SHA or ref.
- `Release-Risk` = highest declared risk of tasks included in the current release only.
- `Review-Risk` = highest semantic risk found during review.
- `Independent-Review` = `PASS` for effective R3/R4 releases.

`production-gate` computes effective risk as `max(Release-Risk, diff-risk(Release-Base..HEAD), Review-Risk)`. It requires a clean committed tree and never deploys.

After deployment, transition through `DEPLOYED -> SMOKE_TESTING -> VERIFIED`. Record a real `Smoke-URL`; optionally set `Smoke-Contains` to a stable marker expected in the response.

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

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
- Current implementation handoff and semantic review state: `STATUS.md`
- Current release boundary, declared release risk, rollback evidence: `RELEASE.md`
- Post-deploy runtime health contract: `OBSERVABILITY.md`
- Execution evidence and resume projection: `.delivery/`
- Durable implementation notes: `BUILD-LOG.md`
- Architecture: `docs/architecture.md`

`STATUS.md` is the only workflow-state authority. `.delivery/current.json` is a projection/evidence index and must never override `STATUS.md`. Do not hand-edit `.delivery/runs/*.jsonl` or `.delivery/releases/*.json`; their integrity is verified by hash chains/self-hashes. Use `delivery-ledger` to start runs, record verification, checkpoint handoffs, finish runs, and snapshot releases.

Inspect the repository's actual configuration before adding stack-specific rules. Disk and executable behavior override stale documentation. Production readiness must be proven by the repository gates; never infer it from prose alone. `production-gate` also requires `delivery-ledger verify` to pass before a release is production-ready.

# Tasks — {{PROJECT_NAME}}

Updated: {{DATE}}

Every implementation task must trace to one accepted requirement, declare its risk class, define explicit boundaries, and include a runnable completion check (`project-check` or specific test).

## Task Execution Contract Template

```markdown
### TASK-001: [Short Task Title]
- **Requirement:** REQ-001 (from PRD.md)
- **Risk Level:** R1 (R0=negligible, R1=low/bounded, R2=moderate, R3=correctness/sensitive, R4=architecture/critical)
- **Job:** implementation (or review, research, migration, release)
- **Capability:** [Owning skill or specialist capability]
- **Execution Class:** volume / precision / judgment
- **Model / Provider / Reasoning:** [Resolved route; do not ask the user when orchestration owns selection]
- **Change Surface:** [Exact repository-relative paths/globs passed to `delivery-ledger start --allow`]
- **Protected Surface:** [Optional higher-risk paths/globs passed with `--protect`; otherwise `None`]
- **Accepted Invariants:** [Observable behavior that must remain true]
- **Shared Owner:** [Semantic owner(s) used to detect cross-worker overlap]
- **Regression Checks:** [Named executable checks required before integration]
- **Reopen Conditions:** [Evidence that invalidates Done and reopens the task]
- **Non-Scope:** [Explicitly untouched paths or systems]
- **Verification:** `project-check` or `npm test -- path/to/test.ts`
- **Escalation Condition:** Fail verification after 1 repair attempt, or require auth/payment/migration contract changes.
```

R0 documentation/mechanical work may infer one obvious requested file. R1 must
remain explicitly or safely inferably bounded. R2 requires an explicit affected
surface. R3/R4 require an explicit change surface, protected surfaces where
applicable, and independent review evidence.

## In progress

No task is in progress.

## Pending

No implementation task has been accepted.

### Bootstrap decision queue

| Capability | Selected decision | Implementation state |
|---|---|---|
| Database | `{{DATABASE}}` | Decision only; not proven operational |
| Authentication | `{{AUTH}}` | Decision only; not proven operational |
| Deployment | `{{DEPLOY}}` | Decision only; not proven operational |

Before implementing any selected database, authentication, or deployment
capability, create a requirement-linked task that defines its schema or trust
boundary, secret provisioning outside the repository, rollback path, and an
executable verification command. A selection in the bootstrap is not proof that
the capability is operational.

## Done

No completed task is recorded.

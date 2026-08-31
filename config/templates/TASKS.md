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
- **Allowed Paths:** [Exact repository-relative paths; only exact paths or `subtree/**` for parallel work]
- **Protected Paths:** [Optional higher-risk paths; otherwise `None`]
- **Canonical Contract Owners:** [Owner names as `<domain>.<contract>[.<subcontract>]`]
- **Change Surface:** [Compatibility alias for Allowed Paths]
- **Protected Surface:** [Compatibility alias for Protected Paths]
- **Shared Owner:** [Compatibility alias for Canonical Contract Owners]
- **Accepted Invariants:** [Observable behavior that must remain true]
- **Producers:** [State/API/event producers or `None`]
- **Consumers:** [State/API/event consumers or `None`]
- **Depends On:** [Prior integrated task/child or `None`]
- **Regression Checks:** [Named executable checks required before integration]
- **Runtime Evidence:** [Browser, CLI, or service scenario; `None` only when inapplicable]
- **Visual Contract:** [Required when Allowed Paths touch `.tsx/.jsx/.vue/.svelte/.astro/.css/.scss/.html`. Name: surface type, primary user and their job, visual direction and its token source, density, desktop and mobile behaviour, the states that must exist (loading/empty/error/success/disabled), and what would be rejected. "Modern UI" is not a contract — it cannot be failed, so it cannot be reviewed. Use `Not applicable` for non-visual work.]
- **Reopen Conditions:** [Evidence that invalidates Done and reopens the task]
- **Rollback/Migration State:** [Rollback boundary or `Not applicable`]
- **Non-Scope:** [Explicitly untouched paths or systems]
- **Verification:** `project-check` or `npm test -- path/to/test.ts`
- **Escalation Conditions:** Fail verification after one repair attempt, or require auth/payment/migration contract changes.
- **Escalation Condition:** [Compatibility alias for Escalation Conditions; singular in some older tasks]
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

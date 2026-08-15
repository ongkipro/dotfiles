# Tasks — {{PROJECT_NAME}}

Updated: {{DATE}}

Every implementation task must trace to one accepted requirement, declare its risk class, define explicit boundaries, and include a runnable completion check (`project-check` or specific test).

## Task Execution Contract Template

```markdown
### TASK-001: [Short Task Title]
- **Requirement:** REQ-001 (from PRD.md)
- **Risk Level:** R1 (R0=negligible, R1=low/bounded, R2=moderate, R3=correctness/sensitive, R4=architecture/critical)
- **Execution Class:** volume / cheap-dev (or precision / judgment)
- **Scope:** [Exact files or components to touch]
- **Non-Scope:** [Explicitly untouched paths or systems]
- **Verification:** `project-check` or `npm test -- path/to/test.ts`
- **Escalation Condition:** Fail verification after 1 repair attempt, or require auth/payment/migration contract changes.
```

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

# Requirements and Evidence Traceability

Use permanent identifiers. Core namespaces include `BR`, `PR`, `NFR`, `TD`, `ADR`, `ARCH`, `DATA`, `TEN`, `IAM`, `DOM`, `API`, `UX`, `BILL`, `SEC`, `PRIV`, `CTRL`, `SLI`, `SLO`, `DR`, `DEL`, `MIG`, `OBS`, `RATE`, `CTX`, `OVR`, `JUR`, `XFER`, `LOC`, `T`, `TEST`, and `EVID`.

Every normative requirement contains status, owner, source, testable statement, acceptance/evidence, constraints, and change history. Each implementation task has exactly one primary requirement; cross-cutting requirements are constraints.

```markdown
### PR-12 — <observable behavior>
- Status: Proposed | Accepted | Implemented | Verified | Superseded
- Owner: <role>
- Source: BR-3
- Statement: When <condition>, the system shall <observable behavior>.
- Acceptance: Given/When/Then scenarios
- Constraints: TEN-6, IAM-8, SEC-14, LOC-2
- Evidence: TEST-22, EVID-9

### T-18 — <implementation slice>
- Primary requirement: PR-12
- Constraints: TEN-6, IAM-8, SEC-14
- Done when: <runnable command and negative/security checks>
```

Validation must find duplicate IDs, broken references, orphan requirements/tasks, tasks without one primary, active references to superseded IDs, overlay decisions without downstream coverage, cross-border flows without role/location/mechanism evidence, and verified requirements without evidence. Approved non-code dispositions must be explicit.

Plans, diagrams, examples, and unchecked checklists are not runtime evidence. Evidence is a reproducible test/report, build/deployment record, signed approval, restore exercise, security assessment, or runtime observation; store safe references only.

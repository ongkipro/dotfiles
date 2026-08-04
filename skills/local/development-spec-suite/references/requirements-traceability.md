# Requirements and Evidence Traceability

Use permanent identifiers. Core namespaces include `BR`, `PR`, `NFR`, `DS` (suite-maintenance requirements), `TD`, `ADR`, `ARCH`, `DATA`, `TEN`, `IAM`, `DOM`, `API`, `UX`, `BILL`, `SEC`, `PRIV`, `CTRL`, `SLI`, `SLO`, `DR`, `DEL`, `MIG`, `OBS`, `RATE`, `CTX`, `OVR`, `JUR`, `XFER`, `LOC`, `T`, `TEST`, and `EVID`.

## Normative declaration

Every non-placeholder normative declaration contains status, exactly one accountable owner, source, a testable statement, acceptance/evidence, constraints, and change history. Never reuse or renumber an accepted ID.

```markdown
### PR-12 — Export a report
- Status: Accepted
- Owner: Product owner
- Source: BR-3
- Statement: When an authorized user requests an export, the system shall create it in the selected supported format.
- Acceptance: Given/When/Then scenarios
- Constraints: TEN-6, IAM-8, SEC-14, LOC-2
- Evidence: TEST-22, EVID-9

### T-18 — Implement report export
- Primary requirement: PR-12
- Constraints: TEN-6, IAM-8, SEC-14
- Dependencies: T-17
- Done when: `python3 -m unittest tests.test_export` exits 0 and its unauthorized case returns the documented denial.
```

Each implementation task has exactly one primary `PR-*` or `TD-*`. Cross-cutting requirements belong under constraints, not as additional primaries. Setup or deployment work must trace to an accepted requirement; a task with no requirement is either YAGNI or evidence that the specification is incomplete.

## Ownership

One canonical fact has one accountable owner. Contributors, reviewers, operators, and approvers may be separate roles, but they do not create multiple canonical owners. A table can use `Owner`, `Accountable owner`, `System owner`, `Implementation owner`, or a more specific qualified-owner label.

Unresolved fields use this exact form:

```text
[TBD owner=<role>; due=<YYYY-MM-DD|before named gate>]
```

Do not use bare `[TBD]`, `[Owner]`, or `[Date]` in an established pack. Template rows may retain visibly generic placeholder syntax until instantiated.

## Supersession

A declaration with `Status: Superseded` must name exactly one live replacement:

```markdown
- Status: Superseded
- Superseded by: PR-27
```

Historical/change-log references are allowed; active requirements and tasks must not depend on the superseded ID.

## Context and regional coverage

- Every active `OVR-*` names at least one non-unknown triggering `CTX-*` fact and a downstream artifact/requirement namespace.
- Every `JUR-*` records trigger facts, authority/source, source status, publication/effective/retrieval dates, decision, qualified owner, engineering impact, and next review.
- Every `XFER-*` records exporter/importer roles and locations, subjects/categories, purpose, storage/access, mechanism-review status, safeguards, onward transfers, retention/deletion, evidence, owner, and status.
- Every active `LOC-*` names regional `TEST-*` or `EVID-*` coverage.

## Runtime evidence boundary

Plans, diagrams, examples, generated templates, and unchecked checklists are not runtime evidence. Evidence is a reproducible test/report, build/deployment record, signed approval, restore exercise, security assessment, or runtime observation. Store safe references only; never put secrets, authentication sessions, production personal data, or payment records into the pack.

## Validator

```bash
python3 scripts/check-traceability.py /path/to/project/docs/spec
python3 scripts/check-traceability.py /path/to/project/docs/spec --format json
```

Validator v2 ignores generated `.spec-update/` and `.spec-backups/` sidecars, then emits stable finding codes and a non-zero exit for duplicate substantive declarations, unresolved numeric references, broken local links, ownership/TBD errors, invalid task primaries, orphan accepted requirements, evidence gaps, supersession errors, overlay coverage gaps, incomplete jurisdiction/transfer records, locale test gaps, malformed Markdown tables/fences, or credential-like assignments. Example and placeholder rows are recognized so they do not create false unresolved-reference findings.

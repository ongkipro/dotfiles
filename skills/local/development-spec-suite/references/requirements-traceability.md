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

Each implementation task has exactly one primary `PR-*` or `TD-*`; the suite's own maintenance tasks may instead use `DS-*`. Cross-cutting requirements belong under constraints, not as additional primaries. Setup or deployment work must trace to an accepted requirement; a task with no requirement is either YAGNI or evidence that the specification is incomplete.

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

## Claim, source, and decision semantics

Use the suite's canonical claim statuses exactly: `Observed`, `Evidence`,
`Proposal`, `Assumption`, `Decision`, or `Unknown`. Requirement lifecycle
values such as `Accepted`, `Verified`, and `Superseded` remain requirement
metadata; they are not a second claim vocabulary.

`Evidence kind` is separate from status and uses this closed mapping:

| Status | Evidence kind | Structural meaning |
|---|---|---|
| `Observed` | `direct-observation` | A bounded repository, runtime, interview, transaction, or other direct observation |
| `Evidence` | `external-publication` or `calculated-result` | An external source or reproducible calculation within stated limits |
| `Proposal` | `inference` | A recommendation or inference derived from named evidence |
| `Assumption` | `hypothesis` | An unverified hypothesis that needs research or a test |
| `Decision` | `human-policy` | An accountable human choice, policy, threshold, appetite, or scope constraint |
| `Unknown` | `none` | Material information is absent or unresolved |

Record product context and material assumptions as `CTX-*`; do not create a
parallel claim or assumption namespace. `Observed` and externally sourced
`Evidence` claims name `Source`, `Source locator`, and a safe `Source excerpt`.
Calculated results name formula lineage. Proposals and assumptions use
`Source` or `Derived from`. Reuse the suite source-ledger JSON record IDs and
audit path rather than copying a citation into a second ledger. A `Decision`
must retain exactly one accountable human owner. Search snippets, inaccessible
citations, and model output are discovery leads, not source evidence.

Security remains the canonical owner of threats and controls through `SEC-*`
and `CTRL-*`. Architecture diagrams use their existing `ARCH-*` or `ADR-*`
owner plus review metadata. An activated OpenAPI contract resolves to an
`API-*` owner and a preserved contract reference. Activation requires these
links, not an otherwise-unneeded extra document.

## Stage gates and change impact

Stage checking is opt-in:

| Stage | Structural gate | Runtime EVID |
|---|---|---|
| `research` | Claim provenance, owners, source locators/excerpts, and declared market inputs resolve | Not required |
| `planning` | Research invariants plus accepted decisions/requirements and activated ownership as applicable | Not required |
| `ready` | Planning invariants plus resolved activated diagram/OpenAPI/security links and executable tasks | Release evidence is not required |
| `verified` | Ready invariants plus fresh TEST/EVID target/ref/test linkage for every declaration claiming `Status: Verified` | Required |

`Acceptance` describes observable success. A task's `Done when` is its
completion check. `TEST-*` declares the executable target and reproducible
command/ref. Runtime-only `EVID-*` records the matching target, `TEST-*`,
report/ref, passing outcome, and observation date. A plan, diagram, example,
template, generated file, unchecked checklist, task text, build-only result,
or lint-only result is not runtime EVID.

For a verified declaration, use the existing metadata-row grammar:

```markdown
### PR-12 — Export a report
- Status: Verified
- Owner: Product owner
- Changed at: 2026-08-11
- Target ref: export-v3
- Evidence: TEST-22, EVID-9

### TEST-22 — Exercise report export
- Target: PR-12
- Ref: python3 -m unittest tests.test_export

### EVID-9 — Report export result
- Target: PR-12
- Test: TEST-22
- Ref: reports/export-2026-08-11.txt
- Outcome: Passed
- Observed at: 2026-08-11
- Target ref: export-v3
```

`EVID-*` is stale when its observation predates the target's `Changed at`
value or its `Target ref` differs. Derive reverse change impact from `Source`,
`Constraints`, `Primary requirement`, `Dependencies`, `Target`, `Test`,
`Evidence`, and `Superseded by` links. Do not maintain a second editable
traceability matrix: when an upstream declaration changes, query those links,
invalidate affected EVID, and review the derived downstream set.

## Market-input extraction

Stage-aware validation accepts flat `INPUT-*` rows in Markdown tables or JSON
under `market_inputs`. Each non-example input declares `layer` (`TAM`, `SAM`,
or `SOM`), `factor`, `boundary`, `unit`, `period`, `geography`,
`overlap_rule`, canonical `status`, matching `evidence_kind`, and source or
formula lineage. A declared conversion also records currency, conversion date,
and method. A material uncertain forecast uses an interval, named scenario, or
explicit deterministic assumption. SOM must not be a bare TAM percentage
without operational drivers or a named scenario. These are structural checks;
source entailment, arithmetic meaning, uncertainty quality, CAGR
compatibility, and output precision require deterministic calculation and
human review.

## Runtime evidence and privacy boundary

For a behavior claim, `EVID-*` is only a safe reference to an executed
test/runtime/browser observation tied to its declared target and `TEST-*`.
Source evidence, calculations, and owner approvals retain their source,
formula, or decision records; they must not be relabelled as runtime EVID.
Never put secrets, authentication sessions, production personal data, or
payment records into the pack. Credential-like assignment detection is
deliberately high-signal and not exhaustive secret, PII, payment-data, or
confidential-content detection.

## Validator

```bash
python3 scripts/check-traceability.py /path/to/project
python3 scripts/check-traceability.py /path/to/project --format json
python3 scripts/check-traceability.py /path/to/project --stage research
python3 scripts/check-traceability.py /path/to/project --stage planning
python3 scripts/check-traceability.py /path/to/project --stage ready
python3 scripts/check-traceability.py /path/to/project --stage verified --format json
```

Without `--stage`, validator v2 preserves its legacy validation surface. The
stage-aware extension is read-only, offline, Python-stdlib-only, and emits
stable finding codes with the offending ID and path. It checks structure, not
source credibility or entailment, arithmetic correctness, privacy
completeness, product or UI quality, runtime conformance, or backward
compatibility.

Validator v2 ignores generated `.spec-update/` and `.spec-backups/` sidecars,
then emits a non-zero exit for applicable duplicate declarations, unresolved
references, broken links, ownership/TBD errors, invalid task primaries,
orphan accepted requirements, evidence gaps, supersession errors, overlay
coverage gaps, incomplete jurisdiction/transfer records, locale test gaps,
malformed Markdown tables/fences, credential-like assignments, or opted-in
stage findings.

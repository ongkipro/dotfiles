# Compliance and Data Privacy Specification

> **Boundary:** this is an engineering specification, responsibility map, and evidence plan. It is not legal advice, a legal opinion, an audit report, or certification of GDPR, SOC 2, UU PDP, or any other framework. Qualified legal/privacy/audit owners must determine applicability and approve interpretations. Never infer compliance from a completed checklist.

## Document Control

| Field | Value |
|---|---|
| Privacy/compliance owner | [Name/role] |
| Engineering owner | [Name/role] |
| Legal/audit approver | [Name/role or Not applicable with reason] |
| Status | Draft / In review / Approved / Superseded |
| Version / updated | [Version] / [YYYY-MM-DD] |
| Jurisdictions/frameworks assessed | [TBD after applicability review] |
| Applies to | [Entities, products, processing, environments] |
| Required when | Personal/sensitive data, regulated processing, contractual controls, cross-border transfers, or formal assurance obligations apply. |

## Purpose, Inputs, and Outputs

**Purpose:** translate approved privacy/compliance obligations into testable system requirements, controls, ownership, and evidence without duplicating legal source text.

**Inputs:** `BR-*`, product/data flows, `DATA-*`, `TEN-*`, `IAM-*`, `SEC-*`, vendors/subprocessors, contracts, approved legal interpretations, and current official primary sources.

**Outputs:** `PRIV-*` privacy requirements, `CTRL-*` control mappings, data inventory/flow records, retention/deletion schedule, rights-request procedures, evidence plan, gaps, and approved risk treatment.

Use the suite's `CONTEXT-MODEL.md` and `JURISDICTION-OVERLAYS.md` references to derive candidate overlays and register official sources. Geography is multi-dimensional: record entities/establishments, people and markets, storage/processing regions, remote access, processors/subprocessors, and onward transfers separately. An AI agent identifies triggers; qualified owners decide legal applicability.

## Applicability and Primary-Source Register

| Regime/framework | Why applicable or not | Entity/data/territory | Primary official source and section | Version/effective date | Interpretation owner | Review date |
|---|---|---|---|---|---|---|
| GDPR | [Determination] | [Scope] | [EUR-Lex official URL + article] | [Date] | [Qualified owner] | [Date] |
| Indonesia UU PDP | [Determination] | [Scope] | [Official government source + article] | [Date/amendments checked] | [Qualified owner] | [Date] |
| SOC 2 Trust Services Criteria | [Contractual/audit scope determination] | [Scope] | [AICPA licensed/official reference] | [Version] | [Audit owner] | [Date] |
| [Other] | [Determination] | [Scope] | [Primary source] | [Version] | [Owner] | [Date] |

Do not reproduce licensed control text without permission. Record local requirement wording and a precise reference.

For every source, distinguish `proposed`, `adopted/enacted`, `in force`, `superseded`, and `unknown`. Record publication/effective date, retrieval date, and recheck trigger. Never treat “global,” hosting region, UI language, vendor certification, or consent as a complete applicability or transfer decision.

### Jurisdiction and sector applicability

| ID | Territory/sector | Triggering facts | Official source/status | Decision and owner | Requirements | Recheck trigger |
|---|---|---|---|---|---|---|
| `JUR-*` | [Country/state/sector] | `CTX-*` | [Authority, version/effective/retrieval dates] | [Applies/no/unknown + qualified owner] | `PRIV-*`, `SEC-*`, `LOC-*` | [Date/event] |

### Cross-border transfer ledger

| ID | Data/subjects | Exporter role/location | Importer role/location | Storage/remote access | Purpose | Mechanism review | Safeguards | Onward transfers | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| `XFER-*` | `DATA-*` | [Entity/role/country] | [Entity/role/country] | [Regions/access] | [Purpose] | [Qualified owner/status] | `SEC-*` | [Processors] | [Reference] |

## Roles and Responsibility

| Processing/activity | Data controller/business role | Processor/service provider | Subprocessor | Data owner | System owner | Approval basis |
|---|---|---|---|---|---|---|
| [Activity] | [Entity/TBD] | [Entity/TBD] | [Vendor] | [Role] | [Role] | [Contract/legal decision] |

Define tenant/customer responsibilities, data-processing terms, support access, government request handling, and responsibility boundaries. Do not assume legal roles solely from hosting topology.

## Data Inventory and Processing Register

| Data category | Data subjects | Purpose | Collection source | Approved legal basis | Systems/locations | Recipients | Retention | Classification | Owner |
|---|---|---|---|---|---|---|---|---|---|
| [Category] | [Subjects] | [Specific purpose] | [Source] | [Legal-approved basis/ref] | [Stores/regions] | [Recipients] | PRIV-[N] | [Class] | [Owner] |

Map collection → use → sharing → storage → backup → deletion. Include telemetry, support exports, derived data, training/AI use, cookies/device data, billing data, and disaster-recovery copies where applicable.

## Privacy and Control Requirements

| ID | Requirement | Obligation/risk source | System owner | Verification/evidence |
|---|---|---|---|---|
| PRIV-1 | [Testable privacy requirement] | [Official source/article or approved interpretation] | [Owner] | [Test/report] |
| CTRL-1 | [Testable technical/organizational control] | [Framework/control reference] | [Owner] | [Evidence] |

Requirements should cover purpose limitation, minimization, accuracy, transparency, consent where selected, access control, retention, deletion, portability, objection/restriction where applicable, breach handling, vendor management, and accountability.

## Notice, Choice, and Consent

| Processing purpose | Notice location/version | Choice/consent model | Proof captured | Withdrawal effect | Downstream propagation |
|---|---|---|---|---|---|
| [Purpose] | [Reference] | [Legal-approved model] | [Evidence] | [Behavior] | [Systems/time] |

Specify versioning, localization, accessibility, consent independence/granularity, withdrawal, and non-consent behavior. Do not use consent as a default legal basis without approved analysis.

## Data Subject/Principal Rights Workflow

| Request | Identity verification | Scope/discovery | Review/redaction | Fulfilment channel | Deadline source | Audit evidence |
|---|---|---|---|---|---|---|
| Access/correction/deletion/export/[other] | [Proportionate process] | [Systems] | [Owner] | [Secure method] | [Approved obligation] | [Event/report] |

Cover tenant-admin versus end-user authority, conflicting obligations/legal holds, backups, subprocessors, retries, rejection/appeal path, and test data. Avoid collecting more identity data than necessary to verify a request.

## Retention, Deletion, and Legal Hold

| Data class/system | Retention trigger/period | Basis/owner | Active deletion | Backup expiry | Legal hold override | Verification |
|---|---|---|---|---|---|---|
| [Class/system] | [Rule] | [Approved source] | [Mechanism/SLA] | [Mechanism/time] | [Controlled process] | [Deletion test/report] |

Define tenant closure, account deletion, log retention, derived/aggregated data, provider deletion, cryptographic erasure if used, and evidence that deletion completed.

## International Transfers and Vendors

| Vendor/subprocessor | Purpose/data | Region/transfer | Approved mechanism | Security/privacy review | Contract | Change notice | Exit/deletion evidence |
|---|---|---|---|---|---|---|---|
| [Vendor] | [Purpose/data] | [Location] | [Legal-approved mechanism] | [Reference] | [Reference] | [Process] | [Evidence] |

## Incident and Breach Decision Path

Reference `SEC-*`, `OBS-*`, and `DR-*`. Define detection intake, privacy assessment, evidence preservation, affected data/subjects analysis, decision authority, regulator/customer/data-subject notification determination, approved timelines by regime, communication review, and lessons learned. Engineering MUST NOT independently declare a legally reportable breach.

## Control and Evidence Matrix

| Control ID | Objective | Implementation | Requirement links | Evidence | Collection frequency | Evidence owner | Reviewer |
|---|---|---|---|---|---|---|---|
| CTRL-[N] | [Objective] | [Process/system] | SEC-/PRIV-/IAM-[N] | [Immutable artifact] | [Frequency] | [Owner] | [Reviewer] |

Evidence must be authentic, time-bound, access-controlled, reproducible where possible, and retained under an approved schedule; screenshots alone are weak evidence unless contextualized.

## Decisions, Gaps, and Risks

| Decision/gap | Obligation/control | Impact | Treatment/compensating control | Owner | Due/expiry | Approval |
|---|---|---|---|---|---|---|
| [Item] | PRIV-/CTRL-[N] | [Impact] | [Action] | [Owner] | [Date] | [Evidence] |

| Risk | Trigger | Data subjects/business impact | Treatment | Owner | Residual risk | Acceptance evidence |
|---|---|---|---|---|---|---|
| [Privacy/compliance risk] | [Observable condition] | [Impact] | [Mitigation/avoidance/transfer] | [Owner] | [Rating and rationale] | [Qualified approval or not accepted] |

## Traceability and Validation

| Obligation/risk | Requirement | Control | System/test | Evidence/task |
|---|---|---|---|---|
| [Official reference] | PRIV-[N] | CTRL-[N] | [Test/report] | [Evidence]/T[N] |

- [ ] Applicability and legal roles are explicitly approved; unknowns remain `TBD`, not assumptions.
- [ ] Every data category, purpose, recipient, location, retention rule, and owner is recorded.
- [ ] Every `PRIV-*`/`CTRL-*` maps to a primary source or approved risk/contract requirement and repeatable evidence.
- [ ] Rights, consent/choice, deletion, retention, legal-hold, transfer, vendor, and incident workflows have exercised tests.
- [ ] Data-flow inventory reconciles with architecture, databases, logs, backups, providers, and exports.
- [ ] Production personal data and credentials are absent from documentation/test fixtures.
- [ ] Gaps, exceptions, owners, deadlines, and risk approvals are visible.
- [ ] Primary sources/amendments and licensed framework versions were checked on the recorded review date.
- [ ] The document makes no legal, audit, or certification claim.

## Cross-Document References

[01-BRD.md](01-BRD.md) · [02-PRD.md](02-PRD.md) · [04-SYSTEM-ARCHITECTURE.md](04-SYSTEM-ARCHITECTURE.md) · [05-DATA-MODEL.md](05-DATA-MODEL.md) · [06-TENANT-ISOLATION.md](06-TENANT-ISOLATION.md) · [07-IAM-RBAC-ABAC.md](07-IAM-RBAC-ABAC.md) · [11-BILLING-PAYMENTS.md](11-BILLING-PAYMENTS.md) · [12-SECURITY-ARCHITECTURE.md](12-SECURITY-ARCHITECTURE.md) · [14-SLA-DRP.md](14-SLA-DRP.md) · [15-DEVOPS-CICD-MIGRATIONS.md](15-DEVOPS-CICD-MIGRATIONS.md) · [16-OBSERVABILITY-RATE-LIMITING.md](16-OBSERVABILITY-RATE-LIMITING.md)

## Open Questions and Change Log

| Item | Decision owner | Due | Gate |
|---|---|---|---|
| [TBD] | [Owner] | [Date] | G0/G4 |

| Date | Version | Change | Author | Approval |
|---|---|---|---|---|
| [Date] | [Version] | [Summary] | [Name] | [Reference] |

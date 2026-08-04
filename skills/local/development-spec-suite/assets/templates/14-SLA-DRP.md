# Service Level Agreement and Disaster Recovery Plan

> Template note: separate internal targets (SLIs/SLOs) from contractual commitments (SLAs). Values remain `TBD` until measured, economically reviewed, and approved. This plan does not prove recoverability; exercise evidence does.

## Document Control

| Field | Value |
|---|---|
| Service owner | [Name/role] |
| Reliability/DR owner | [Name/role] |
| Business approver | [Name/role] |
| Security/privacy approver | [Name/role] |
| Status | Draft / In review / Approved / Superseded |
| Version / updated | [Version] / [YYYY-MM-DD] |
| Applies to | [Services, regions, tiers, customers] |
| Required when | The service has contractual availability, critical business processes, material recovery obligations, or approved continuity targets. |

## Purpose, Inputs, and Outputs

**Purpose:** define measurable reliability, approved external commitments, business impact, recovery objectives, recovery procedures, and exercise evidence.

**Inputs:** `BR-*`, `NFR-*`, architecture/dependencies, `DATA-*`, `SEC-*`, `PRIV-*`, delivery and observability design, customer contracts, incident history, measured baselines, and business-impact analysis.

**Outputs:** `SLI-*`, `SLO-*`, and `DR-*` requirements; SLA terms; error-budget policy; BIA; RTO/RPO; backup/restore/failover runbooks; exercise schedule and evidence.

## Service and Dependency Scope

| Service/user journey | Customers/tier | Critical dependencies | Owner | Hours/time zone | Exclusions |
|---|---|---|---|---|---|
| [Journey] | [Tier] | [Dependencies] | [Owner] | [Window] | [Explicit exclusions] |

State system boundary, maintenance treatment, dependency attribution, partial degradation behavior, and source of truth for service status.

State service regions, customer timezones, support languages/hours, maintenance-window timezone, data/backup/failover locations, and region-specific commitments. Do not silently apply one region's SLA, recovery path, or support calendar worldwide.

## Service Level Indicators

| ID | User outcome | Good event | Valid/total events | Data source | Measurement window | Missing/late data behavior |
|---|---|---|---|---|---|---|
| SLI-1 | [Outcome] | [Precise predicate] | [Denominator/exclusions] | OBS-[N] | [Window] | [Rule] |

Prefer user-observable request, workflow, freshness, durability, and correctness indicators. Infrastructure utilization is diagnostic, not automatically an SLI.

## Objectives, Commitments, and Error Budgets

| ID | SLI | Internal SLO | Contractual SLA | Window | Error budget | Eligible tiers | Approval |
|---|---|---|---|---|---|---|---|
| SLO-1 | SLI-1 | [TBD after baseline] | [None/TBD/approved value] | [Rolling/calendar] | [Formula] | [Tiers] | [Reference] |

Define burn-rate thresholds, budget accounting, release freeze/exception policy, ownership, and recovery criteria. Never advertise an SLO as an SLA.

## SLA Terms

| Topic | Approved term |
|---|---|
| Availability calculation | [Numerator, denominator, rounding, time source] |
| Planned maintenance | [Notice/window/treatment] |
| Exclusions | [Specific, reviewed exclusions] |
| Customer claim process | [Evidence, channel, deadline] |
| Service credits/remedies | [Approved commercial rule/reference] |
| Status/incident communication | [Channels and cadence] |

Contract/legal owners must approve external wording and conflict resolution among contract, status page, and this engineering document.

## Business Impact Analysis

| Capability/data | Impact of outage/loss | Maximum tolerable downtime/data loss | Dependency | Manual workaround | Priority | Owner |
|---|---|---|---|---|---|---|
| [Capability] | [Operational/financial/legal/customer] | [Approved result] | [Dependencies] | [Procedure/capacity] | [Tier] | [Owner] |

## Recovery Objectives and Scenarios

| ID | Scenario/scope | RTO | RPO | Recovery point/source | Recovery strategy | Invocation authority |
|---|---|---|---|---|---|---|
| DR-1 | [Region/service/data corruption/vendor/account compromise] | [Approved value] | [Approved value] | [Verified source] | [Strategy] | [Role] |

RTO/RPO must derive from BIA and be validated by exercises. Cover infrastructure loss, logical corruption, credential/control-plane compromise, provider outage, dependency failure, malicious deletion, and unavailable personnel where applicable.

## Backup and Restore Contract

| Dataset/config | Backup method | Frequency | Retention | Isolation/immutability | Encryption/key recovery | Restore procedure | Last verified |
|---|---|---|---|---|---|---|---|
| [Asset] | [Mechanism] | [Schedule] | [Policy] | [Boundary] | SEC-[N] | [Runbook] | [Evidence date] |

Define coverage discovery, failed-backup alerting, consistency, dependency order, tenant-granular recovery if supported, restore target, integrity checks, and disposal. Replication is not automatically a backup.

## Recovery Runbook

1. Detect and classify; preserve evidence.
2. Declare incident/disaster through [authority and criteria].
3. Contain and select a verified recovery point.
4. Restore dependencies and data in documented order.
5. Validate integrity, security, tenant isolation, and critical user journeys.
6. Approve traffic restoration and communicate status.
7. Reconcile missed/duplicate work and monitor closely.
8. Close, review, remediate, and update the plan.

For each step link executable commands/runbooks without embedding secrets. Define decision points, rollback/abort criteria, owners, alternates, communications, and vendor escalation.

## Exercise Program

| Exercise | Scope | Frequency | Success criteria | Participants | Evidence | Remediation owner/due |
|---|---|---|---|---|---|---|
| [Tabletop/restore/failover] | [Scenario] | [Schedule] | [RTO/RPO/integrity criteria] | [Roles] | [Immutable report] | [Owner/date] |

## Decisions and Risks

| Decision ID | Decision | Alternatives | Rationale | Consequence | Status |
|---|---|---|---|---|---|
| ADR-[N] | [Decision] | [Options] | [Evidence] | [Trade-off] | Proposed/Accepted |

| Risk | Trigger | Impact | Mitigation | Owner | Residual risk |
|---|---|---|---|---|---|
| Restore not viable | Backup succeeds but restore fails | Extended outage/data loss | Automated checks and exercises | [Owner] | [Assessment] |
| Target exceeds capability | SLA/RTO lacks measured proof | Contract breach | Baseline, capacity test, approval gate | [Owner] | [Assessment] |

## Traceability and Validation

| Business/NFR source | SLI/SLO/DR ID | Telemetry/runbook | Exercise/test | Task |
|---|---|---|---|---|
| NFR-[N] | SLI-[N], SLO-[N], DR-[N] | OBS-[N]/[Runbook] | DR-T[N] | T[N] |

- [ ] Every SLI formula is reproducible from retained telemetry and handles missing/late data.
- [ ] Every SLO/SLA value has measured baseline, capacity evidence, owner, and approval.
- [ ] Contractual calculation, exclusions, credits, and communication terms are unambiguous.
- [ ] BIA covers critical capabilities, dependencies, data loss, workaround capacity, and decision owners.
- [ ] RTO/RPO are exercised end-to-end, including integrity and security validation.
- [ ] Backup coverage, failures, isolation, encryption, key recovery, retention, and restore are tested.
- [ ] Runbooks are executable by designated alternates without undocumented knowledge or embedded secrets.
- [ ] Exercise findings become owned tasks and are retested.
- [ ] `SLI-*`, `SLO-*`, and `DR-*` references resolve across observability, security, delivery, and tasks.

## Cross-Document References

[01-BRD.md](01-BRD.md) · [02-PRD.md](02-PRD.md) · [04-SYSTEM-ARCHITECTURE.md](04-SYSTEM-ARCHITECTURE.md) · [05-DATA-MODEL.md](05-DATA-MODEL.md) · [12-SECURITY-ARCHITECTURE.md](12-SECURITY-ARCHITECTURE.md) · [13-COMPLIANCE-PRIVACY.md](13-COMPLIANCE-PRIVACY.md) · [15-DEVOPS-CICD-MIGRATIONS.md](15-DEVOPS-CICD-MIGRATIONS.md) · [16-OBSERVABILITY-RATE-LIMITING.md](16-OBSERVABILITY-RATE-LIMITING.md)

## Primary Reference Placeholders

- [NIST SP 800-34 Rev. 1 official publication, verified version/date/section]
- [Google SRE SLI/SLO guidance, verified page/date]
- [Approved contractual/legal source for SLA terms]

## Open Questions and Change Log

| Item | Owner | Due | Gate |
|---|---|---|---|
| [TBD] | [Owner] | [Date] | G5 |

| Date | Version | Change | Author | Approval |
|---|---|---|---|---|
| [Date] | [Version] | [Summary] | [Name] | [Reference] |

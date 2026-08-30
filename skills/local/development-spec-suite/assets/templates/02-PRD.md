# Product Requirements Document (PRD)

> Template instruction: ground requirements in repository and research evidence. Replace every `<placeholder>` and mark unresolved decisions with owner and due date. Requirements describe observable behavior, not implementation.

## Document Control

| Field | Value |
|---|---|
| Purpose | Define the user problem, product outcomes, bounded scope, functional behavior, non-functional expectations, and release acceptance contract. |
| Required when | Always. For a small bounded change, keep only applicable sections. |
| Accountable owner | `<product owner>` |
| Responsible author | `<product manager/analyst>` |
| Reviewers | `<design, engineering, security, operations, business>` |
| Status | `Draft / In Review / Approved / Superseded` |
| Version / updated | `<version> / <YYYY-MM-DD>` |
| Upstream | `01-BRD.md: <BR-* or Not applicable>` |

**Inputs:** approved `BR-*`, user research, analytics, support evidence, current-system behavior, architecture constraints.
**Outputs:** stable `PR-*` and `NFR-*`, acceptance scenarios, release boundaries, analytics requirements, and inputs for design, architecture, API, security, and `TASKS.md`.
**ID namespaces:** `PR-<number>` for product behavior and `NFR-<number>` for cross-cutting quality constraints. Never reuse or renumber accepted IDs.

## 1. Product Decision Summary

- Product/problem: `<name and concise problem>`
- Target users: `<roles/personas>`
- Desired outcome: `<observable outcome>`
- Release boundary: `<MVP/phase/release>`
- Success signal: `<primary metric and window>`
- Recommendation/status: `<decision or TBD>`

## 2. Problem and Evidence

| Evidence ID | User/segment | Source/date | Observed problem | Frequency/severity | Confidence |
|---|---|---|---|---|---|
| `E-1` | `<segment>` | `<source>` | `<observation>` | `<measure>` | `High/Medium/Low` |

Distinguish user evidence, analytics, assumptions, and proposed solutions.

## 3. Users, Actors, and Context

Reference applicable `CTX-*`, `OVR-*`, `JUR-*`, and `LOC-*`. Distinguish intended market, user/data-subject location, interface locale, organization/tenant, device/surface, accessibility needs, age group, and sector role instead of collapsing them into one persona or country field.

| Actor | Goal | Current behavior | Pain/risk | Access context | Tenant relationship |
|---|---|---|---|---|---|
| `<actor>` | `<goal>` | `<today>` | `<problem>` | `<device/channel>` | `<global/member/admin/none>` |

## 4. Outcomes, Metrics, and Guardrails

| Outcome | Metric/formula | Baseline | Target/window | Instrumentation | Guardrail |
|---|---|---|---|---|---|
| `<outcome>` | `<metric>` | `<value>` | `<target>` | `<event/source>` | `<must not regress>` |

## 5. Scope

### In scope

- `<capability or journey>`

### Non-goals

- `<explicit exclusion and reason>`

### Constraints and dependencies

- `<platform, policy, timeline, integration, migration, or upstream ID>`

## 6. Journeys and Use Cases

| Journey | Primary actor | Trigger | Happy-path outcome | Alternate/failure path | Requirements |
|---|---|---|---|---|---|
| `<journey>` | `<actor>` | `<event>` | `<outcome>` | `<behavior>` | `<PR-*>` |

## 7. Functional Requirements

| ID | Requirement | Source | Priority | Acceptance evidence | Dependencies | Status |
|---|---|---|---|---|---|---|
| `PR-1` | `<Actor MUST be able to ... under ...>` | `<BR-*/E-*>` | `Must/Should/Could` | `<scenario/test/metric>` | `<IDs>` | `Proposed` |

Each requirement must be atomic, observable, solution-neutral where possible, and cover relevant error/empty/loading/permission states.

## 8. Acceptance Scenarios

```gherkin
Scenario: <behavior mapped to PR-1>
  Given <precondition and actor context>
  When <single action/event>
  Then <observable result>
  And <security, tenant, audit, or failure constraint if applicable>
```

## 9. Non-Functional Requirements

| ID | Quality attribute | Measurable requirement | Conditions/load | Evidence method | Owner | Constraint refs |
|---|---|---|---|---|---|---|
| `NFR-1` | `<availability/performance/accessibility/security/etc.>` | `<threshold or explicit policy>` | `<environment/window>` | `<test/telemetry/review>` | `<role>` | `<SEC-*/SLO-*/OBS-*>` |

Do not use “fast,” “secure,” “scalable,” or “user-friendly” without a measurable criterion.

## 10. UX and Content Contract

- Required user outcomes and surfaces: `<list or UX-* references>`
- Accessibility target and evidence: `<standard/level/test>`
- Localization/content ownership: `<languages, source, fallback>`
- White-label and visual-system boundaries: `<UI-* references or Not applicable>`
- Destructive/irreversible action safeguards: `<confirmation, recovery, audit>`

Journeys and screen behavior belong in UX Flows and Screen Contracts. Visual
tokens and shared component behavior belong in the Design System; only required
user outcomes belong here.

## 11. Data, Analytics, and Privacy Needs

| Need | Purpose | Data class | Retention expectation | Event/report owner | Contract refs |
|---|---|---|---|---|---|
| `<data/event>` | `<why needed>` | `<classification>` | `<period/TBD>` | `<role>` | `<DATA-*/PRIV-*/OBS-*>` |

Never use analytics as authorization or billing truth unless the owning contract explicitly permits it.

## 12. Rollout and Release Acceptance

| Phase | Population | Entry criteria | Success gate | Stop/rollback trigger | Owner |
|---|---|---|---|---|---|
| `<phase>` | `<cohort/tenant>` | `<evidence>` | `<metric/test>` | `<threshold>` | `<role>` |

Include migration, compatibility, support, documentation, feature-flag retirement, and deprecation expectations where applicable.

## 13. Risks and Open Questions

| ID | Question/risk | Impact | Owner | Resolution evidence | Due | Blocks gate |
|---|---|---|---|---|---|---|
| `Q-1` | `<unknown>` | `<impact>` | `<role>` | `<decision/test/research>` | `<date>` | `<G0-G5>` |

## 14. Cross-Document Contract

- Business purpose and KPI ownership: `01-BRD.md` (`BR-*`).
- Component and implementation decisions: `03-TECHNICAL-DESIGN.md` (`TD-*`, `ADR-*`).
- Runtime boundary: `04-SYSTEM-ARCHITECTURE.md` (`ARCH-*`).
- Persistent data, tenancy, identity, and domains: `05-DATA-MODEL.md`, `06-TENANT-ISOLATION.md`, `07-IAM-RBAC-ABAC.md`, `08-DOMAIN-ROUTING.md`.
- Endpoint payloads belong in OpenAPI; UI tokens belong in the Design System; controls belong in Security/Privacy.
- Each implementation task has one primary `PR-*` or `TD-*` plus applicable constraint IDs.

## 15. Validation and Approval Checklist

- [ ] Problem, users, evidence, desired outcomes, scope, and non-goals are explicit.
- [ ] Every `PR-*` and `NFR-*` is unique, atomic, unambiguous, testable, and owned.
- [ ] Happy, alternate, failure, empty, loading, unauthorized, and cross-tenant behaviors are addressed where relevant.
- [ ] Metrics define formulas, windows, segmentation, source, and guardrails.
- [ ] Accessibility, privacy, security, migration, observability, and operability constraints are identified early.
- [ ] Requirements reference upstream `BR-*` when a BRD exists.
- [ ] No schema, endpoint payload, role matrix, or infrastructure fact is duplicated from its owning document.
- [ ] Every Must requirement has acceptance evidence and no unresolved release-blocking question.
- [ ] Product, design, engineering, security, and operations recorded approval or explicit non-applicability.

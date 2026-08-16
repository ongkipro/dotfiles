# Software / Technical Design Document

> Template instruction: describe the smallest design that satisfies accepted requirements. Verify existing code and runtime behavior before proposing change. Record costly-to-reverse choices as ADRs; do not invent APIs or infrastructure.

## Document Control

| Field | Value |
|---|---|
| Purpose | Define component behavior, boundaries, key flows, failure handling, trade-offs, migration, rollout, and validation for a bounded technical change. |
| Required when | Architecture, database, integration, security boundary, public contract, or material runtime behavior changes. |
| Accountable owner | `<engineering owner>` |
| Responsible author | `<technical lead>` |
| Reviewers | `<product, architecture, security, data, operations, QA>` |
| Status / version / updated | `<Draft/In Review/Approved/Superseded> / <version> / <date>` |
| Scope | `<feature/system/release>` |

**Inputs:** accepted `PR-*`/`NFR-*`, current code/runtime evidence, `ARCH-*`, `DATA-*`, `TEN-*`, `IAM-*`, `DOM-*`, security and operations constraints.
**Outputs:** accepted `TD-*` decisions, `ADR-*` records, flow contracts, delivery/migration approach, risks, and runnable validation plan.
**ID namespaces:** `TD-<number>` for design requirements/decisions and sequential `ADR-NNNN` for architectural decisions with standalone records. Preserve IDs and supersession links.

## 1. Design Summary

- Problem and boundary: `<what this design changes and does not change>`
- Requirements: `<PR-*, NFR-*>`
- Current state evidence: `<paths, versions, runtime observations>`
- Proposed approach: `<concise design>`
- Primary trade-off: `<benefit accepted versus cost/risk>`
- Release strategy: `<incremental/flagged/migration/big bang with justification>`

## 2. Goals, Non-Goals, and Constraints

| Type | Statement | Source/ID | Validation |
|---|---|---|---|
| Goal | `<technical outcome>` | `<PR-*/NFR-*>` | `<evidence>` |
| Non-goal | `<excluded behavior>` | `<decision>` | `<review>` |
| Constraint | `<platform/security/compatibility/cost>` | `<ID/source>` | `<check>` |

## 3. Current State

Document only verified facts:

- Relevant entry points and callers: `<paths/functions>`
- Data flow and ownership: `<current flow>`
- External dependencies and versions: `<manifest/lock/runtime evidence>`
- Known limitations/incidents: `<links>`
- Compatibility commitments: `<clients/data/contracts>`

## 4. Proposed Design and Responsibility Map

| ID | Component/module | Responsibility | Inputs | Outputs | Owned state | Failure contract |
|---|---|---|---|---|---|---|
| `TD-1` | `<component>` | `<single responsibility>` | `<typed input/event>` | `<output/event>` | `<state/none>` | `<error, retry, fallback>` |

Reuse existing helpers, stdlib, platform features, and installed dependencies before adding new abstractions or packages.

## 5. Key Flows

### Flow: `<name>`

1. `<actor/component>` receives `<validated input>`.
2. `<authorization/tenant resolution>` evaluates `<IAM-*/TEN-*>`.
3. `<component>` performs `<operation>` under `<DATA-*/API operationId>`.
4. `<result/failure>` is returned and `<OBS-*>` evidence is emitted.

Cover success, validation failure, denial, dependency timeout, duplicate/retry, partial failure, and recovery where applicable. Link Mermaid diagrams by `ARCH-*`; do not duplicate topology.

## 6. Interface and Contract Changes

| Interface | Change | Compatibility | Version/deprecation | Owner contract | Contract test |
|---|---|---|---|---|---|
| `<HTTP/event/job/module>` | `<change>` | `<backward/forward/breaking>` | `<policy>` | `<OpenAPI/DATA-*/TD-*>` | `<test>` |

Machine-readable HTTP schemas belong in OpenAPI. Database constraints belong in `05-DATA-MODEL.md` and migrations.

## 7. Data, Consistency, and Transactions

- Records read/written: `<DATA-* references>`
- Transaction boundary and isolation: `<explicit boundary>`
- Idempotency/deduplication: `<key, scope, retention, conflict behavior>`
- Concurrency control: `<constraint/lock/version/retry>`
- Cache semantics: `<owner, key, TTL, invalidation, tenant scope>`
- Event delivery semantics: `<at-most/at-least/effectively-once and compensation>`
- Deletion/retention: `<PRIV-*/DATA-* references>`

## 8. Security and Privacy

| Concern | Boundary/asset | Required control IDs | Design response | Verification |
|---|---|---|---|---|
| `<threat>` | `<asset/flow>` | `<SEC-*, IAM-*, TEN-*, PRIV-*>` | `<mechanism>` | `<test/review>` |

Never place credentials or production data in this document. Identify validation, least privilege, audit, encryption, redaction, abuse, and supply-chain implications.

## 9. Reliability, Performance, and Capacity

| Requirement | Workload assumption | Budget/target | Mechanism | Degradation behavior | Evidence |
|---|---|---|---|---|---|
| `<NFR-*/SLO-*>` | `<volume/concurrency/size>` | `<threshold>` | `<design>` | `<bounded failure>` | `<load/fault test>` |

Avoid capacity claims without a model and measured evidence.

## 10. Alternatives and ADRs

| ID | Decision | Options considered | Selected | Rationale | Consequences | Revisit trigger |
|---|---|---|---|---|---|---|
| `ADR-1` | `<decision>` | `<A/B/C>` | `<option>` | `<evidence/trade-off>` | `<positive/negative>` | `<condition>` |

## 11. Delivery, Migration, and Rollback

| Phase | Change | Preconditions | Validation | Rollback/forward fix | Data compatibility | Owner |
|---|---|---|---|---|---|---|
| `<phase>` | `<artifact/config/schema>` | `<gate>` | `<check>` | `<action>` | `<old/new readers>` | `<role>` |

Reference `DEL-*` and `MIG-*` for environment/release policy. Destructive migrations require explicit approval, backup/restore evidence, and a defined irreversibility point.

## 12. Test and Evidence Plan

| Requirement/decision | Layer | Scenario | Command/probe | Expected evidence | Environment |
|---|---|---|---|---|---|
| `TD-1` | `unit/contract/integration/e2e/load/security` | `<scenario>` | `<runnable check>` | `<assertion/artifact>` | `<local/staging>` |

## 13. Risks and Open Decisions

| ID | Risk/unknown | Impact | Owner | Mitigation/experiment | Due | Gate |
|---|---|---|---|---|---|---|
| `Q-1` | `<unknown>` | `<impact>` | `<role>` | `<evidence>` | `<date>` | `<G2-G5>` |

## 14. Cross-Document Contract

- `02-PRD.md` owns behavior (`PR-*`, `NFR-*`); this document explains how it is realized.
- `04-SYSTEM-ARCHITECTURE.md` owns system boundaries/topology; `05-DATA-MODEL.md` owns schema constraints.
- Tenancy, identity, and routing decisions must reference `TEN-*`, `IAM-*`, and `DOM-*` rather than restating policy.
- OpenAPI owns HTTP shapes; Security owns controls; Delivery owns promotion/migration policy; Observability owns telemetry.
- `TASKS.md` maps one primary `PR-*` or `TD-*`, constraint IDs, dependencies, and runnable “Done when” evidence.

## 15. Validation and Approval Checklist

- [ ] Current state, callers, dependencies, and versions were verified against disk/runtime.
- [ ] Proposed components have one clear responsibility and explicit failure contracts.
- [ ] All accepted `PR-*`/`NFR-*` are satisfied or explicitly deferred with approval.
- [ ] Transactions, concurrency, idempotency, retries, timeouts, cache, and partial failures are defined where relevant.
- [ ] Tenant, authorization, security, privacy, migration, observability, and rollback constraints reference owning IDs.
- [ ] Alternatives and costly-to-reverse decisions have `ADR-*` rationale and consequences.
- [ ] No invented API, schema, capacity, provider, or runtime fact remains.
- [ ] Non-trivial logic has at least one runnable regression check.
- [ ] Architecture, security, data, operations, and product reviewers recorded disposition.

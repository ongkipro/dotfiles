# Tenant Isolation Strategy

> Template instruction: define tenant boundaries end to end. A `tenant_id` column alone is not an isolation strategy. Verify every ingress, storage, cache, job, search, file, analytics, and administrative path.

## Document Control

| Field | Value |
|---|---|
| Purpose | Define tenant identity, isolation model, propagation, enforcement, lifecycle, privileged access, testing, and noisy-neighbor controls. |
| Required when | Any product stores or processes data for more than one tenant/customer boundary. |
| Accountable owner | `<security/platform/product owner>` |
| Responsible author | `<technical lead>` |
| Reviewers | `<application, database, IAM, security, operations, support>` |
| Status / version / updated | `<status> / <version> / <date>` |

**Inputs:** tenant business definition, `PR-*`, `ARCH-*`, `DATA-*`, `IAM-*`, runtime and support workflows.
**Outputs:** stable `TEN-*` isolation requirements, tenant-context contract, enforcement matrix, lifecycle and privileged-access controls, test evidence.
**Primary ID namespace:** `TEN-<number>`.

## 1. Tenant Definition and Boundaries

- Tenant represents: `<customer/organization/workspace/store/etc.>`
- Tenant owner and administrators: `<roles>`
- Global identities/resources: `<explicit list>`
- Tenant-owned resources: `<DATA-* list>`
- Shared resources and justification: `<list or none>`
- Nested, parent/child, reseller, or cross-tenant relationships: `<model or not supported>`

| ID | Isolation requirement | Rationale/threat | Enforced by | Evidence | Owner |
|---|---|---|---|---|---|
| `TEN-1` | `<The system MUST ...>` | `<risk>` | `<layers>` | `<test/control>` | `<role>` |

## 2. Isolation Model Decision

| Option | Isolation strength | Operational complexity | Cost/scale | Migration impact | Decision |
|---|---|---|---|---|---|
| Shared DB/shared schema + tenant key | `<assessment>` | `<assessment>` | `<assessment>` | `<assessment>` | `<selected/rejected>` |
| Shared DB/schema per tenant | `<assessment>` | `<assessment>` | `<assessment>` | `<assessment>` | `<selected/rejected>` |
| Database/account per tenant | `<assessment>` | `<assessment>` | `<assessment>` | `<assessment>` | `<selected/rejected>` |
| Hybrid by tier/risk | `<assessment>` | `<assessment>` | `<assessment>` | `<assessment>` | `<selected/rejected>` |

Selected model: `<option>`
Decision/ADR: `<ADR-*>`
Revisit triggers: `<tenant count, regulation, size, geography, acquisition, incident>`

## 3. Tenant Context Resolution and Propagation

| Entry point | Untrusted hint | Authoritative resolution | Membership/policy check | Context carrier | Missing/conflict behavior |
|---|---|---|---|---|---|
| `<host/path/token/job/event/admin>` | `<value>` | `<mapping/source>` | `<IAM-*>` | `<request scope/message field>` | `<deny/quarantine>` |

Rules:

1. Treat headers, hostnames, route parameters, body fields, and client claims as untrusted until mapped and authorized.
2. Establish one immutable tenant context before business/data access.
3. Propagate tenant identity explicitly across async jobs/events; consumers revalidate scope.
4. Reject absent, ambiguous, mismatched, disabled, or stale tenant contexts; never fall back to another/default tenant.
5. Bind idempotency keys, caches, locks, quotas, audit events, and telemetry to tenant context.

## 4. Enforcement Matrix

| Surface | Tenant key/boundary | Primary enforcement | Defense in depth | Cross-tenant exception | Test |
|---|---|---|---|---|---|
| Database | `<DATA-*>` | `<RLS/schema/DB/constraint>` | `<repository/query guard>` | `<approved workflow/none>` | `<negative test>` |
| Object storage | `<prefix/account/bucket>` | `<signed policy>` | `<metadata validation>` | `<none>` | `<test>` |
| Cache | `<key namespace>` | `<tenant-prefixed key>` | `<typed helper>` | `<none>` | `<collision test>` |
| Search/vector | `<index/filter>` | `<mandatory filter>` | `<post-filter forbidden/allowed>` | `<none>` | `<leak test>` |
| Queue/job | `<message field>` | `<producer+consumer check>` | `<dead-letter quarantine>` | `<none>` | `<tamper test>` |
| Analytics/export | `<partition/row>` | `<scoped query/export authorization>` | `<review/redaction>` | `<approved aggregate>` | `<test>` |
| Logs/traces | `<attribute>` | `<classification/redaction>` | `<access controls>` | `<operations policy>` | `<scan>` |

## 5. Authorization and Privileged Access

- Tenant membership and roles: `<IAM-* references>`
- Cross-tenant roles: `<explicitly supported or prohibited>`
- Platform/operator support access: `<just-in-time grant, purpose, expiry, approval>`
- Impersonation: `<prohibited or consent/banner/audit/expiry rules>`
- Break-glass: `<conditions, approvers, logging, review>`
- Background/service identities: `<tenant scope derivation and least privilege>`

Support convenience must never bypass the same tenant boundary silently.

## 6. Tenant Lifecycle

| State/transition | Trigger/actor | Allowed operations | Data action | Identity/domain action | Audit/evidence |
|---|---|---|---|---|---|
| Provisioning → Active | `<trigger>` | `<operations>` | `<create/seed>` | `<membership/domain>` | `<event>` |
| Active → Suspended | `<trigger>` | `<read/write behavior>` | `<preserve/freeze>` | `<session/domain>` | `<event>` |
| Active → Deleted | `<trigger>` | `<grace/recovery>` | `<PRIV-*/DATA-*>` | `<revoke/release>` | `<certificate/report>` |

Define import/export, clone/sandbox, merge/split, ownership transfer, restore, and tenant-ID reuse policy. Tenant IDs SHOULD NOT be reused.

## 7. Resource Isolation and Noisy-Neighbor Controls

| Resource | Limit dimension | Scope/tier | Enforcement point | Over-limit behavior | Observability |
|---|---|---|---|---|---|
| `<CPU/jobs/storage/API/etc.>` | `<rate/concurrency/bytes>` | `<tenant/plan>` | `<component>` | `<queue/throttle/reject>` | `<RATE-*/OBS-*>` |

Specify fairness, priority, backpressure, bulkhead, per-tenant concurrency, and large-tenant exceptions based on measured workloads.

## 8. Isolation Failure and Incident Response

| Failure | Detection | Immediate containment | Evidence preservation | Notification/escalation | Recovery |
|---|---|---|---|---|---|
| `<cross-tenant read/write/cache/log leak>` | `<signal/test>` | `<disable path/revoke>` | `<audit/snapshot>` | `<SEC/PRIV process>` | `<repair/verify>` |

Never automatically “repair” ownership ambiguity by reassigning data without reviewed evidence.

## 9. Isolation Test Matrix

| Test ID | Surface | Tenant A setup | Tenant B/adversarial action | Expected result | Evidence |
|---|---|---|---|---|---|
| `TEN-T1` | `<API/DB/cache/job/etc.>` | `<fixture>` | `<tamper/enumerate/replay>` | `<deny/not found/no side effect/no leak>` | `<automated test/log>` |

Include horizontal/vertical authorization, identifier enumeration, host/header mismatch, stale membership, cache collision, job tampering, export, backup/restore, search, support access, rate isolation, and deletion tests.

## 10. Cross-Document Contract

- `04-SYSTEM-ARCHITECTURE.md` owns trust/runtime boundaries; this document owns tenant context and isolation policy.
- `05-DATA-MODEL.md` realizes `TEN-*` through keys, constraints, partitions/RLS, and lifecycle schema.
- `07-IAM-RBAC-ABAC.md` determines who may act within established tenant context.
- `08-DOMAIN-ROUTING.md` resolves hosts to candidate tenants but does not authorize the actor.
- Security owns threat/control requirements; Billing owns entitlements; Observability owns per-tenant signals/limits.

## 11. Validation and Approval Checklist

- [ ] Tenant, global, shared, nested, and privileged boundaries are unambiguous.
- [ ] Isolation-model decision includes alternatives, trade-offs, evidence, and revisit triggers.
- [ ] Every ingress establishes immutable authoritative context or fails closed.
- [ ] Database, storage, cache, search, jobs, analytics, exports, logs, backups, and restores are covered.
- [ ] Cross-tenant access is prohibited by default and every exception is purpose-bound, expiring, and audited.
- [ ] Tenant lifecycle defines suspension, transfer, deletion, restore, export, and ID reuse.
- [ ] Noisy-neighbor limits have scopes, enforcement, behavior, and telemetry.
- [ ] Automated negative tests prove tenant A cannot observe or mutate tenant B across every surface.
- [ ] `TEN-*` IDs are unique and all `DATA-*`, `IAM-*`, `DOM-*`, `SEC-*`, and `PRIV-*` references resolve.
- [ ] Security, data, IAM, platform, operations, and support owners approved.

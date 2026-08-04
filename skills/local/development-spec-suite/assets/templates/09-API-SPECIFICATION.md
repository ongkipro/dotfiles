# API Specification

> Template note: the normative API contract is `docs/api/openapi.yaml`. This document records governance and decisions that do not belong in OpenAPI. Replace every bracketed placeholder with repository evidence or an explicit `TBD`; never invent an endpoint or behavior.

## Document Control

| Field | Value |
|---|---|
| Owner | [API/platform owner] |
| Approvers | [Product, security, consumer representatives] |
| Status | Draft / In review / Approved / Superseded |
| Version | [SemVer or revision] |
| Last updated | [YYYY-MM-DD] |
| Applies to | [Services, consumers, API versions] |
| Required when | A public/internal HTTP contract has multiple consumers, independent release cadence, or compatibility obligations. |
| Canonical contract | `docs/api/openapi.yaml` |

## Purpose and Boundary

Define the machine-readable HTTP contract, compatibility policy, and consumer obligations. Payload schemas, status codes, parameters, and security schemes MUST be owned by OpenAPI and referenced here by stable `operationId`; do not duplicate them in prose.

### Inputs

- Product behaviors: `PR-*`, `NFR-*` from [02-PRD.md](02-PRD.md).
- Data ownership and constraints: `DATA-*`.
- Tenant, identity, and domain constraints: `TEN-*`, `IAM-*`, `DOM-*`.
- Billing and security constraints: `BILL-*`, `SEC-*`.

### Outputs

- Valid OpenAPI 3.1 contract with stable `operationId` values.
- Compatibility, lifecycle, error, pagination, idempotency, and webhook policies.
- Contract-test and consumer-validation evidence.

## Scope and Consumers

| Consumer | Trust level | Authentication | Supported operations | Owner |
|---|---|---|---|---|
| [Web application] | [First party] | [IAM scheme reference] | [operationIds] | [Team] |
| [External integration] | [Third party] | [IAM scheme reference] | [operationIds] | [Team] |

## Requirements

Use `API-N` for prose requirements and stable lowerCamelCase `operationId` values for operations.

| ID | Requirement | Source | Verification |
|---|---|---|---|
| API-1 | [Observable contract requirement using MUST/SHOULD/MAY] | [PR-/IAM-/TEN- ID] | [Contract test/lint] |
| API-2 | [Compatibility or lifecycle requirement] | [NFR-/BR- ID] | [Consumer test] |

## Contract Conventions

### Resource and URL Model

- Base URLs and environments: [reference; never place credentials here].
- Versioning strategy: [path/header/media type] and deprecation window [TBD].
- Tenant context source: [reference `TEN-*`; reject ambiguous or conflicting context].
- Naming, time, currency, locale, and identifier formats: [rules].

### Authentication and Authorization

Reference OpenAPI `securitySchemes` and `IAM-*`. Define behavior for absent, invalid, expired, revoked, and insufficient credentials. State whether existence-sensitive resources return `403` or `404` and why.

### Request Semantics

Where regional behavior exists, define locale negotiation/fallback, timezone semantics, ISO currency and minor-unit representation, language-independent machine fields, localized human-readable fields, and canonical timestamps. Never infer authorization, tenant identity, residence, tax jurisdiction, or legal applicability from `Accept-Language` alone.

| Concern | Policy | Evidence |
|---|---|---|
| Validation | [Boundary, unknown fields, size limits] | [Negative tests] |
| Idempotency | [Required operations, key scope, retention, replay result] | [Concurrency/replay tests] |
| Concurrency | [ETag/version/precondition strategy] | [Conflict test] |
| Pagination | [Cursor contract, deterministic order, limits] | [Traversal tests] |
| Filtering/sorting | [Allowlist and invalid behavior] | [Contract tests] |

### Response and Error Model

Define one shared error schema with stable code, human-safe message, correlation ID, and field errors where relevant. Map validation, authentication, authorization, absence, conflict, rate limit, dependency, and internal failures without leaking tenant existence or sensitive internals.

### Asynchronous Operations and Webhooks

Document acceptance response, status lookup, terminal states, retry behavior, deduplication, ordering guarantees, signature verification, replay window, endpoint rotation, and dead-letter handling. Reference `SEC-*`, `OBS-*`, and `RATE-*`.

## Compatibility and Lifecycle

| Change | Classification | Required action |
|---|---|---|
| Add optional response field | [Compatible/conditional] | [Consumer tolerance test] |
| Remove/rename/change meaning | Breaking | [New version and migration plan] |
| Deprecate operation | [Policy] | [Notice, telemetry, removal gate] |

Record actual decisions:

| Decision ID | Decision | Alternatives | Rationale | Consequence | Status |
|---|---|---|---|---|---|
| ADR-[N] | [Decision] | [Options] | [Evidence] | [Trade-off] | Proposed/Accepted |

## Risks

| Risk | Trigger | Impact | Mitigation | Owner | Residual risk |
|---|---|---|---|---|---|
| Contract drift | Implementation differs from OpenAPI | Consumer failure | Generated validation and contract tests | [Owner] | [Assessment] |
| Cross-tenant access | Tenant context is missing or overridden | Data exposure | `TEN-*` enforcement and negative tests | [Owner] | [Assessment] |

## Traceability

| Product requirement | operationId / API ID | Constraints | Tests | Task |
|---|---|---|---|---|
| PR-[N] | [operationId] | TEN-[N], IAM-[N], SEC-[N] | API-T[N] | T[N] |

## Validation and Evidence Checklist

- [ ] OpenAPI 3.1 validates with the repository's existing validator.
- [ ] Every operation has a unique, stable `operationId` and explicit security behavior.
- [ ] Request and response examples validate against schemas; no secrets or personal production data are embedded.
- [ ] Tenant, authorization, idempotency, pagination, concurrency, error, and rate-limit negative paths are tested.
- [ ] Implementation-to-contract and backward-compatibility checks run in CI.
- [ ] Webhook signature, replay, duplicate, reordering, and retry cases are tested where applicable.
- [ ] All `API-*` and cross-document references resolve; no behavior is owned twice.
- [ ] Evidence links point to immutable CI runs, test reports, or reviewed artifacts.

## Cross-Document References

[02-PRD.md](02-PRD.md) · [05-DATA-MODEL.md](05-DATA-MODEL.md) · [06-TENANT-ISOLATION.md](06-TENANT-ISOLATION.md) · [07-IAM-RBAC-ABAC.md](07-IAM-RBAC-ABAC.md) · [08-DOMAIN-ROUTING.md](08-DOMAIN-ROUTING.md) · [11-BILLING-PAYMENTS.md](11-BILLING-PAYMENTS.md) · [12-SECURITY-ARCHITECTURE.md](12-SECURITY-ARCHITECTURE.md) · [16-OBSERVABILITY-RATE-LIMITING.md](16-OBSERVABILITY-RATE-LIMITING.md)

## Open Questions and Change Log

| Item | Owner | Due | Blocking gate |
|---|---|---|---|
| [Question/TBD] | [Owner] | [Date] | G3 |

| Date | Version | Change | Author | Approval |
|---|---|---|---|---|
| [Date] | [Version] | [Summary] | [Name] | [Reference] |

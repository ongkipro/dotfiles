# Document Activation and Ownership

Start with the pack's `02-PRD.md` and add only triggered artifacts. After requirements/contracts are accepted, `prd-taskbreaker` writes `TASKS.md` beside it. When no suite pack exists, `prd-taskbreaker` keeps its standalone root-level `PRD.md`/`TASKS.md` convention. Never maintain both `PRD.md` and `02-PRD.md` as competing canonical requirements.

| Artifact | Activate when | Canonical owner |
|---|---|---|
| BRD | Multiple business owners, enterprise/commercial/regulatory commitments | Business outcomes and commercial constraints |
| PRD | Always for a product/feature decision | Observable behavior and NFRs |
| Technical Design | Component, flow, integration, migration, or material behavior change | Component behavior and trade-offs |
| Architecture | Product/platform depth, multiple components, external trust/runtime boundary | System/container/deployment boundaries |
| Data Model | Persistent state, related entities, retention, migration, or analytics | Schema, constraints, lifecycle |
| Tenant Isolation | More than one customer/workspace boundary | Tenant context and isolation |
| IAM | Human/service authentication or authorization | Identity lifecycle and policy |
| Domain Routing | Subdomains, custom domains, or white-label hosts | DNS/TLS/host resolution |
| API/OpenAPI | Independent HTTP consumers, SDKs, webhooks, compatibility | Machine-readable HTTP contract |
| Design System | Shared UI, multiple surfaces, localization, accessibility, branding | Tokens/UI/localization contract |
| Billing | Prices, subscriptions, payments, tax, refunds, payouts | Entitlements, money, ledger, reconciliation |
| Security | Product/platform risk, identity, data, public API, commerce, AI, sector, cross-border | Threats and controls |
| Privacy/Compliance | Personal/sensitive data, regulated processing, contracts, cross-border | Applicability, data rights, retention, controls |
| SLA/DRP | Critical service, contractual target, material recovery obligation | SLI/SLO/SLA and recovery |
| Delivery/Migrations | Maintained deployment, infrastructure, release, schema/data change | CI/CD, promotion, rollback, migration |
| Observability/Rate Limits | Production service, abuse/capacity control, tenant quotas | Telemetry, alerts, quotas, runbooks |
| UX Flows and Screen Contracts | Maintained product UI, multi-screen workflows, role/state-dependent interactions, or mobile/desktop transformations | Journeys, screen inventory, state/permission visibility, responsive transformations, UX acceptance |

Omitted artifacts require `Not applicable`, reason, owner, and review gate. Keep one source of truth; report divergence instead of duplicating stale values.

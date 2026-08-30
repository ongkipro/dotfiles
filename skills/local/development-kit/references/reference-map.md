# Development Kit Reference Map

Use this as an ownership map for a canonical pack or an explicitly supplied
worked example. File names describe suite artifacts, not a requirement to
generate every file. Open only the smallest activated artifact.

| Concern | Reference artifact | Canonical operating owner |
|---|---|---|
| Business outcomes and commercial constraints | `01-BRD.md` | business sponsor; `product-intelligence` when facts are unresolved |
| Product behavior and NFRs | `02-PRD.md` | product owner; `prd-taskbreaker` for standalone accepted planning |
| Component behavior and technical trade-offs | `03-TECHNICAL-DESIGN.md` | framework/domain specialist |
| System and trust boundaries | `04-SYSTEM-ARCHITECTURE.md` | architecture owner; `development-spec-suite` for pack governance |
| Relational model and lifecycle | `05-DATA-MODEL.md` | `postgres-drizzle` when PostgreSQL/Drizzle is selected |
| Tenant isolation | `06-TENANT-ISOLATION.md` | `application-security` plus data owner |
| Identity and authorization | `07-IAM-RBAC-ABAC.md` | `application-security`; `better-auth-security` only in a Better Auth project |
| Hostname and custom-domain routing | `08-DOMAIN-ROUTING.md` | selected platform/framework owner plus `application-security` |
| REST contract | `09-API-SPECIFICATION.md` | `openapi-spec` |
| Design tokens, components, accessibility, brand, and white-label primitives | `10-DESIGN-SYSTEM-WHITELABEL.md` | `design-taste` or `admin-dashboard` for direction; `shadcn-ui` for React implementation |
| Billing and payments | `11-BILLING-PAYMENTS.md` | exact provider owner; `stripe-best-practices` for Stripe |
| Security architecture | `12-SECURITY-ARCHITECTURE.md` | `application-security` |
| Privacy and compliance | `13-COMPLIANCE-PRIVACY.md` | qualified privacy/legal owner; engineering controls via relevant specialist |
| Reliability and recovery | `14-SLA-DRP.md` | service owner plus `observability-engineering` |
| CI/CD and migrations | `15-DEVOPS-CICD-MIGRATIONS.md` | `github-actions` for GitHub CI; `postgres-drizzle` for database migration |
| Telemetry and rate limits | `16-OBSERVABILITY-RATE-LIMITING.md` | `observability-engineering` plus `application-security` |
| User journeys, screen inventory/contracts, states, permissions, responsive transformations, and UX acceptance | `17-UX-FLOWS-SCREEN-CONTRACTS.md` | `admin-product-ux` for admin/CMS; `storefront-ux` for commerce; relevant product owner otherwise |
| Indonesia worked example and Indonesia/Malaysia applicability | `INDONESIA-MARKET-ENGINEERING-GUIDE.md` plus [adaptive market overlay](market-engineering.md) | qualified domain owner plus current official sources, only for activated concerns |
| Pack applicability | `CONTEXT-RECORD.md` | `development-spec-suite` |
| Execution trace | `TASKS.md` | `prd-taskbreaker` for task contracts; repository delivery owner after promotion |

## Extraction labels

Label each extracted item before reuse:

- **Invariant** — technology-neutral safety or correctness property; still verify against the target threat model.
- **Candidate** — plausible pattern requiring a project decision and specialist review.
- **Illustrative** — fictional or arbitrary value; do not copy.
- **Current-source required** — law, tax, vendor API, regional availability, pricing, quota, certification, or market fact; retrieve again for the target context.

If a request spans several concerns, route the top-level accepted implementation through `full-stack-development`. Do not use this map to bypass product acceptance, repository authority, or specialist review.

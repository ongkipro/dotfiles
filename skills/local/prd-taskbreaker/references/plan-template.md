# PLAN.md template — architectural features only

Read only when the feature touches new architecture, a DB schema, or an external integration.

Create `PLAN.md` ONLY when the feature touches **new architecture, a DB schema, or an external integration**. Small/linear CRUD: skip it, go PRD→TASKS directly (forcing three files on a small feature is the over-engineering this skill exists to prevent).

```markdown
# PLAN: [Feature Name]

## Architecture
Components + how they talk. Embed a diagram when a trigger is met.

## Platforms & Hosting
Runtime(s), hosting target, region, and the platform limits that bind the design.

## Auth, Roles & Authorization
| Role | May | May not | Enforced at |
|---|---|---|---|
| Buyer | create own order, read own order | read other orders | server route + DB predicate |
Authorization rules are server-side; a hidden control is not authorization.

## Security & Privacy
Trust boundaries, sensitive fields and their handling, secrets location (names only), abuse controls.

## Performance & Reliability Targets
| Target | Value | Linked requirement | How measured |
|---|---|---|---|
| Checkout submit p95 | < 800 ms | REQ-001 | k6 / server timing on staging |

## Environments & Delivery
Local/staging/production, how config differs, deploy path, rollback.

## Data Schema
Mermaid ERD when ≥2 related tables.
| Table.field | Type | Required | Default | Index | Notes |
|---|---|---|---|---|---|
| orders.status | text | yes | `pending` | yes (status, created_at) | enum: pending, paid, cancelled |

## Data Ownership, Retention & Deletion
| Entity | Owner (role/tenant) | Retention | Deletion/anonymization |
|---|---|---|---|

## Migration & Seed
Migration order and reversibility; seed/fixture data for dev/test/demo only — idempotent, never production data.

## Integrations & Contracts
Endpoints/webhooks/third parties. Internal API → delegate to the openapi-spec skill.

## Risks & Mitigations
What can fail, and the handling (rate limit, retry, fallback).
```

Every block between Architecture and Integrations is **conditional**: include it
only when the feature touches that concern, and write
`Not applicable — <reason>` instead of an empty heading when a reader would
otherwise expect it (e.g. no auth in a public read-only site). Performance and
reliability targets must link to a requirement; an unlinked target is a goal
without an owner. Deep security, tenancy, or IAM design still routes to
`application-security`, `adr-record`, or `development-spec-suite`.

Before accepting a costly-to-reverse technical decision, compare the real
alternatives found in the repository or current primary documentation. Record
why the selected option fits and why rejected options do not. Do not manufacture
alternatives for a decision already fixed by accepted repository evidence.

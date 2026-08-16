---
name: Notification tenant backfill invariant
description: Tenant-scope notifications at write and read boundaries, then backfill legacy rows from authoritative relations.
type: project
---

Notification isolation requires the tenant identifier at creation, listing, and
bulk mutation boundaries. Context-derived defaults are acceptable only where the
request context is guaranteed; background jobs must pass the tenant explicitly.

Backfill legacy rows from authoritative related entities, classify unresolved
orphans explicitly, and verify isolation with cross-tenant regression tests.
Store production counts, tenant identifiers, backup tables, and executable SQL in
the repository-owned migration record.

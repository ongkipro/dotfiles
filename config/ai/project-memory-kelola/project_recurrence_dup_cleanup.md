---
name: Recurrence duplicate cleanup invariant
description: Repair recurring-template forks only after the creation race is closed and a scoped backup exists.
type: project
---

Recurring work can multiply when concurrent close handlers both create the next
template. Fix the creation path with an atomic claim before cleaning existing
rows; otherwise cleanup only hides the ongoing defect.

For cleanup, scope by tenant, identify the canonical template deterministically,
preserve related records, take a restorable backup, and verify that no duplicate
active template groups remain. Keep customer names, workspace identifiers,
production counts, backup-table names, and raw SQL in the repository-owned
incident record rather than cross-device memory.

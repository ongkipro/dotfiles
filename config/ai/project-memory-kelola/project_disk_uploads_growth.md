---
name: Upload storage boundary
description: Keep upload storage independent from deploy-managed source paths and verify capacity plus durability.
type: project
---

User uploads must live outside paths replaced by source checkout or deployment.
A symlinked upload path is safe only when no descendant remains tracked by Git;
verify that invariant before every storage migration.

Monitor capacity and renewal through repository-owned operations, maintain a
tested backup, and plan object storage or retention controls before local volume
growth reaches its ceiling. Keep live IPs, device names, file counts, billing
dates, and destructive recovery commands outside tracked memory.

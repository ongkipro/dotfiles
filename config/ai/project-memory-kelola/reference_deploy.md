---
name: Deployment reference boundary
description: Repository deployment and recovery truth belongs in the Kelola repository, not global memory.
type: reference
---

Before deployment, read the current Kelola repository workflow, release
manifest, observability contract, and repository-owned runbook. They own the
current domain, service topology, environment names, health probes, and recovery
commands.

Stable invariant: use one deploy owner, stop processes that read generated build
output while replacing that output, validate every referenced asset before
restart, and verify the released revision through the repository health contract.
Never infer production permission from this memory.

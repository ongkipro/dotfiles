---
name: Single deploy owner
description: Prevent concurrent automated and manual deployments from writing the same release workspace.
type: feedback
---

The repository-owned deployment workflow is the canonical deploy owner. A push
or commit does not grant standing production authority: inspect the repository
workflow, obtain the required production approval, then use exactly one deploy
path.

Do not start a manual deploy while automation is running. Concurrent builds can
race on generated output and dependencies even when the source revision is the
same. Verify completion through repository-owned CI and health contracts. Keep
live hosts, credentials, service names, and recovery commands outside tracked
cross-device memory.

---
name: bukalaris-docs-phase
description: "Bukalaris (~/Projects/bukalaris, public GitHub ongkipro/bukalaris): documents-only phase ended; development resumed 2026-11-16 via PRs into main; resume point lives in the repo STATUS.md"
metadata:
  node_type: memory
  type: project
---

The owner's 2026-11-01 "documents only" direction is **no longer current**. On 2026-11-16 the owner resumed
development in parallel streams: tasks land on `main` through pull requests with green CI (`verify`, `image`).
Etalashop and TokoΦ were studied as references; they are lessons, not templates.

**How to apply:** read the repository, not this note. Resume point: top of `STATUS.md` ("Next") and the open-task
index at the top of `docs/TASKS.md`. `main` is protected since 2026-11-23 (PR + checks `verify` and `image`, admins
included). On a device without Docker, a user-space Postgres and Playwright Chromium give a local loop (see the device
note in `~/.config/ai-local/device.md`); CI stays the authority. Do not start a new task without a fresh owner instruction.

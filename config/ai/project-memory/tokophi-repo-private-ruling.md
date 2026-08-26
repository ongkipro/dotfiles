---
name: tokophi-repo-private-ruling
description: "TokoΦ repo visibility: owner ruled 2026-08-24 the repo STAYS PRIVATE — this reversed his same-day go-public instruction; do not flip without a fresh explicit order"
metadata: 
  node_type: memory
  type: project
  originSessionId: 00774a47-a5ec-43cc-b9b9-411602e05952
  modified: 2026-08-24T03:37:53.496Z
---

`ongkipro/tokophi` is **PRIVATE and must stay private** — owner ruling 2026-08-24 ("repo kamu buat private dulu"), which **reversed his earlier same-day instruction** to make it public after the day's work. Context: the KiriminAja UAT (pre-production-IP) and AutoLaris rework are being done "local dulu"; docs also contain VPS/infra details.

**Why:** the two instructions arrived hours apart in one session; a future session seeing only the earlier "buat public aja dulu" message (or a stale summary) could publish the repo against the owner's current intent.

**How to apply:** never run `gh repo edit ongkipro/tokophi --visibility public` unless the owner freshly and explicitly orders it in that session. Related: [[tokophi-project]], [[kiriminaja-integration]].

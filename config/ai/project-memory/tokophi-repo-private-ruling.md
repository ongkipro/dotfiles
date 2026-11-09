---
name: tokophi-repo-private-ruling
description: "TokoΦ repo visibility: PUBLIC during development (owner 2026-11-05, superseding the 2026-08-24 stay-private ruling); keep vendor-private docs (Mengantar Partner) OFF the repo"
metadata:
  node_type: memory
  type: project
  originSessionId: 384e0521-26c5-449c-9cc8-a956c39c9dda
  modified: 2026-11-05T00:00:00.000Z
---

`ongkipro/tokophi` is **PUBLIC during development** — owner ruling 2026-11-05 ("tetap public dulu — ketika development"), after a session found it public while this memory still said private. It supersedes the 2026-08-24 ruling ("repo kamu buat private dulu").

**Why:** because the repo is public, anything a vendor marks private must never land in it. On 2026-11-05 the Mengantar Partner docs page ("private, do not share outside your team") and the analysis built on it were moved to `~/Documents/work/research/mengantar-partner-business-api/` (0600).

**Planned flip:** owner 2026-11-05: "jika development selesai atau kita off baru di buat private" — make it PRIVATE when development is finished or work goes off/paused. Raise it at that moment, and run `gh repo edit ongkipro/tokophi --visibility private` only when the owner confirms that the moment has come.

**How to apply:** apart from that planned flip, do not change visibility in either direction without a fresh explicit order from the owner. Before committing, check that no vendor-private doc, secret, or infra detail is in the diff. Cite private docs as "kept off-repo". Related: [[tokophi-project]].

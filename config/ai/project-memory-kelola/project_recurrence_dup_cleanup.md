---
name: project-recurrence-dup-cleanup
description: "2026-06-19 cleanup of multiplied recurring-task templates in Aussie's Official + prod backup tables to delete later"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7db23205-0566-4ac3-8753-5f2059f8a026
---

Workspace **Aussie's Official** (`ws_23i3dtGvt7J7`) had recurring tasks spawning duplicates. Root cause: recurrence *template* rows multiplied (one title had up to 10 templates), each spawning independently — caused by a pre-2026-06-18 race in the `on_close` re-spawn (a raced close created 2 recurrence-carrying copies → template forked, compounding each cycle). The CAS/atomic-claim fix (`d514e78`, live in prod since 2026-06-18) prevents new forking but didn't clean existing data.

Manual cleanup run 2026-06-19 via `psql` on prod (piped SQL over SSH, scoped to that workspace):
- **Phase A:** kept 1 template per (project,title) — preferring non-done then newest — set `recurrence=NULL` on the other **116**. Result: 0 task groups with >1 active template.
- **Phase B:** deleted **134** duplicate `status='done'` copies (kept richest-comment copy per project/title/day). The duplicates' comments were carry-forward duplicate threads, not unique work.

**Backup tables in prod (DELETE once user confirms all good):** `_bkp_recurrence_20260619` (274 original recurrence values), `_bkp_deltask_20260619` + `_bkp_delmsg_20260619` (1354) + `_bkp_delassignee_/dellabel_/delchecklist_/delattach_20260619`. `_bkp_deltask_ids_20260619` holds the deleted ids. Fully restorable.

**Why:** stops the daily duplication immediately; code-side already hardened.
**How to apply:** if user reports a recurring task stopped spawning, the kept template may be a `done` on_close instance (on_close only respawns on close→done). Don't re-run blanket cleanup without re-checking dup groups. NOTE: a bare `SELECT col FROM other_table` inside a subquery silently resolves `col` to the OUTER query (correlated) if absent in the inner table — burned me into a false "35 duplicate WA schedules" alarm (they're 1-per-workspace, fine). See [[reference_deploy]], [[project_parallel_dev]].

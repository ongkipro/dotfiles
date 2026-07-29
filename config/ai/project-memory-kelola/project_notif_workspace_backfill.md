---
name: project_notif_workspace_backfill
description: Notif diberi kolom workspace_id; backfill prod + tabel backup to delete
metadata: 
  node_type: memory
  type: project
  originSessionId: 870b6145-c08c-4c8e-977c-8b5e01adcffd
---

2026-06-25: Bug Inbox lintas-workspace diperbaiki — tabel `notification` dapat kolom `workspace_id` (migrasi 0110). `notifyUser` mengisi workspaceId: default dari request-context ALS (`runWithWorkspace` di-set middleware rbac → ~40 route handler otomatis), ~11 call-site lib (cron/agent/automation) pass eksplisit. Endpoint `/notifications` + `mark-all-read` filter `?workspaceId`; client `notifApi.list/markAll(wsId)`.

Notif LAMA (workspace_id NULL) di-backfill dari relatedId via join: tk_/tsk_→task→project→space, gl_→project_goal, sg_→space_goal, grp_/dm_→channel, ann_→announcement, form_→form, br_→budget_request, rc_→review_cycle, rv_→review, rb_→reimbursement, sp_→space, ws_→workspace. 9482 terisi, 1213 sisa NULL = orphan (entity dihapus, sudah disembunyikan inbox).

**Tabel backup prod `_bkp_notif_nullws_20260625`** (snapshot id yang di-backfill) — HAPUS setelah user konfirmasi beres. Lihat pola [[project_recurrence_dup_cleanup]].

---
name: task-handoff-md-always
description: "Selalu tulis file .md handoff di repo SEBELUM mulai dan SETELAH selesai satu task, biar sesi yang mati mendadak bisa dilanjut presisi"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a8ea18a1-6786-469c-8136-85af8962d96c
  modified: 2026-07-22T04:00:42.302Z
---

Setiap mau **memulai** dan setiap **selesai** mengerjakan sesuatu, tulis/perbarui file `.md`
handoff **di dalam repo** (bukan di chat, bukan di scratchpad) dan **commit** — supaya kalau
laptop mati atau sesi terputus, sesi berikutnya bisa melanjutkan dengan presisi, bukan menebak.

**Why:** laptop Paduka pernah mati di tengah sesi (2026-07-22). Handoff yang hanya ada di chat
ikut hilang; handoff yang di-commit selamat. TokoΦ `AGENTS.md` sudah menyebut prinsipnya —
*"Hand off in the repo, not in chat. A fact only you know is a fact the next agent will re-break."*
— aturan ini menaikkannya jadi kebiasaan per-task, bukan cuma per-sesi.

**How to apply:**
- **Sebelum mulai:** buat `specs/docs/tasks/<tanggal>-<slug>.md` (atau padanan folder docs repo itu)
  berisi: task apa + kenapa, scope IN/OUT, commit & branch awal, rencana ber-checkbox, dan cara
  verifikasinya. Commit file ini **sebelum** ngoding.
- **Selama jalan:** centang checkbox + tulis "NEXT: …" tiap selesai satu langkah bermakna, lalu commit.
  Yang penting bukan prosa, tapi **langkah berikutnya yang eksplisit**.
- **Setelah selesai:** tutup file itu (status DONE + commit hash hasilnya), lalu ringkas ke
  `CHANGELOG.md` / `WORKLOG.md` / `BACKLOG.md` repo seperti biasa.
- Repo yang dipakai banyak agen sekaligus: **satu file per task** (nama ber-tanggal + slug), jangan
  satu `TASK.md` bersama — itu bakal tabrakan. Lihat [[tokophi-project]].

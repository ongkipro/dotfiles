---
name: prd-taskbreaker
description: >-
  Ubah ide atau permintaan fitur menjadi PRD spec-driven (goals, non-goals, requirements
  EARS ber-ID, keputusan teknis) lalu pecah jadi task bernomor yang tiap-nya menunjuk balik
  ke satu requirement dan punya "Done bila" yang runnable — siap dikerjakan AI coding agent
  tanpa over-build. Output: PRD.md (+PLAN.md untuk fitur arsitektural) + TASKS.md. Gunakan saat
  memulai fitur/project baru atau saat perlu planning terstruktur sebelum coding. Triggers:
  'buat PRD', 'tulis PRD untuk fitur ini', 'pecah jadi task', 'breakdown jadi task', 'planning
  fitur baru', 'spec fitur ini', 'rencanakan sebelum coding'. Untuk DIAGRAM (ERD/sequence/C4)
  delegasi ke mermaid-diagram; untuk API contract ke openapi-spec; untuk MENULIS ULANG/rapikan
  PRD yang sudah ada ke volumx-writer. NOT untuk menulis kode itu sendiri, dan NOT untuk copy
  marketing/landing (content, copywriting).
---

# PRD Taskbreaker

Ide mentah → PRD spec-driven → numbered tasks yang bisa langsung dikerjakan AI coding **tanpa over-build**.

Pengikatnya: **setiap task menunjuk balik ke satu requirement, dan setiap requirement testable dengan "Done bila" yang runnable.** Task tanpa requirement = YAGNI, buang. Itu yang secara struktural mencegah agent menambah fitur yang tak diminta — sejalan disiplin lazy-senior-dev di `AGENTS.md`.

## Alur

```
[Ide] → [1. Clarify — GATE, resolusi ambiguitas dulu]
      → [2. PRD.md — goals + non-goals + Requirements ber-ID (EARS)]
      → [3. PLAN.md — HANYA jika menyentuh arsitektur/DB/integrasi]
      → [4. TASKS.md — tiap task → REQ-x, deps, Done-bila]
      → (per task) implement → jalankan check → commit additive
```

## Mode

- **`prd`** — hanya PRD dari deskripsi
- **`plan`** — PLAN teknis dari PRD yang ada (untuk fitur arsitektural)
- **`tasks`** — pecah PRD/PLAN yang ada jadi task
- **`full`** *(default)* — clarify → PRD → (plan bila perlu) → tasks dalam satu run
- **`update`** — update artefak yang ada; jaga penomoran REQ/task tetap stabil

## 1. Clarify — ini gate, bukan basa-basi

Jangan menebak requirement yang belum jelas. Tanyakan dulu (lewati yang sudah jelas dari konteks):
- Stack? (frontend / backend / DB / deploy target) — kalau sudah ada `AGENTS.md`/`STATUS.md` di repo, baca itu dulu, jangan tanya ulang.
- Siapa user-nya, dan apa yang berubah untuk mereka?
- Ada sistem/DB/integrasi eksisting yang harus disambung?
- Prioritas fase / deadline?
- Apa yang **di luar** scope (non-goals)?

Kalau ada jawaban yang menentukan arah, **berhenti dan tanya** — jangan lanjut menulis PRD di atas asumsi.

## 2. Format PRD

Draft ke `~/Documents/work/prd/<slug>/PRD.md` dulu; PRD final → root project (lihat Output Files).

```markdown
# PRD: [Nama Fitur/Project]

## Overview
Satu paragraf: apa yang dibangun, untuk siapa, mengapa sekarang.

## Goals
- Goal terukur 1
- Goal terukur 2

## Non-Goals
- Apa yang TIDAK dicakup (scope boundary — sama pentingnya dengan goals)

## Requirements
Requirement testable, ber-ID, gaya EARS (lihat cheatsheet di bawah). ID dipakai task untuk traceability.
- **REQ-1** (event) When user submit form checkout, the system shall membuat order berstatus `pending`.
- **REQ-2** (unwanted) If nomor HP tidak valid, then the system shall menolak submit dan menampilkan pesan.
- **REQ-3** (state) While provinsi COD-disabled, the system shall menyembunyikan opsi COD.
- **REQ-4** (ubiquitous) The system shall mencatat setiap perubahan status order.

## Stack & Constraints
- Frontend / Backend / DB / Deploy / Constraint. (Jangan ulang aturan global `AGENTS.md`.)

## Keputusan Teknis  *(opsional — hanya untuk yang mahal-dibalik)*
Format ADR-lite, satu blok per keputusan. File ADR terpisah (`docs/adr/NNNN-*.md`) HANYA untuk project besar.
- **Keputusan:** pakai Cloudflare D1, bukan Postgres.
  **Alasan:** storefront read-heavy, edge-local, gratis di tier Workers.
  **Konsekuensi:** tak ada `pg`-only feature; migrasi manual via wrangler.

## Diagram  *(opsional — hanya bila trigger terpenuhi, lihat "Kapan diagram")*
Sisipkan ```mermaid``` (delegasi cara buat ke skill mermaid-diagram).

## Milestones
- [ ] v0.1 MVP: ...
- [ ] v0.2: ...
```

### EARS cheatsheet (Easy Approach to Requirements Syntax)
Tulis requirement testable dengan salah satu pola ini, bukan prosa "sistem harus bagus". Pakai untuk yang benar-benar bisa gagal (auth, pembayaran, form by-geo, webhook) — **jangan** paksakan untuk copy/UI sederhana.

| Pola | Template |
|---|---|
| Ubiquitous | `The system shall <response>` |
| State-driven | `While <precondition>, the system shall <response>` |
| Event-driven | `When <trigger>, the system shall <response>` |
| Unwanted | `If <trigger>, then the system shall <response>` |
| Optional | `Where <feature included>, the system shall <response>` |

Kombinasi: `While <precondition>, When <trigger>, the system shall <response>`.

## 3. Format PLAN — hanya untuk fitur arsitektural

Buat `PLAN.md` HANYA kalau fitur menyentuh **arsitektur baru, skema DB, atau integrasi eksternal**. Fitur kecil/CRUD linear: lompati, PRD→TASKS langsung (memaksa 3 file untuk fitur kecil = over-engineering).

```markdown
# PLAN: [Nama Fitur]

## Arsitektur
Komponen + bagaimana mereka bicara. Sisipkan diagram bila trigger terpenuhi.

## Skema Data
Tabel/kolom/relasi. ERD Mermaid bila ≥2 tabel berrelasi.

## Integrasi & Kontrak
Endpoint/webhook/pihak ketiga. API internal → delegasi ke skill openapi-spec.

## Risiko & Mitigasi
Apa yang bisa gagal, dan penanganannya (rate limit, retry, fallback).
```

## 4. Format Tasks

`TASKS.md` di root project. Tiap task **atomic, context-complete, dan menunjuk balik ke requirement**.

```markdown
# Tasks: [Nama Project]

## Rules untuk AI
- Satu task per request. Tandai `[x]` sebelum lanjut.
- Kerjakan HANYA scope task. Butuh sesuatu di luar task → tanya, jangan asumsi.
- Hormati `AGENTS.md`: YAGNI, native-first, jangan tambah abstraksi tak diminta.
- 1 task ≈ 1 commit yang lulus check-nya.

## Phase 1: Setup
- [ ] **T1** — Init [stack]. Output: struktur folder siap dev.
      → REQ: — · deps: [] · Done bila: `pnpm dev` jalan tanpa error.
- [ ] **T2** — Skema DB: tabel `orders(id, status, phone, province)` + migration.
      → REQ: REQ-1 · deps: [T1] · Done bila: `wrangler d1 migrations apply` sukses; tabel muncul.

## Phase 2: Core
- [ ] **T3** — Endpoint POST /api/order: validasi + insert status `pending`.
      → REQ: REQ-1, REQ-2 · deps: [T2] · Done bila: test kirim payload valid→201, HP invalid→400.

## Phase 3: Polish & Deploy
- [ ] **T4** — Deploy ke [target] via [metode].
      → REQ: — · deps: [T3] · Done bila: URL live merespons 200.
```

## Aturan Task yang Baik

1. **Traceable** — tiap task menyebut `→ REQ-x`. **Task tanpa requirement = YAGNI → buang atau tanya kenapa ada.**
2. **DoD runnable** — "Done bila" harus sesuatu yang benar-benar dijalankan (perintah, test, cek UI), bukan "selesai". Selaras aturan "ONE runnable check" di `AGENTS.md`.
3. **Deps eksplisit** — `deps: [T1, T3]` supaya urutan & paralelisasi jelas untuk agent.
4. **Context-complete** — sebut nama file/tabel/endpoint konkret, jangan "buat sesuatu".
5. **Sized right** — 1 task ≈ 1 sesi coding (30–90 mnt), cukup kecil untuk direview sekali duduk. Terasa besar → pecah dulu.
6. **Ordered** — setup sebelum feature, dependency sebelum dependent.

## Kapan diagram (delegasi ke skill `mermaid-diagram`)

Diagram bukan wajib — sisipkan HANYA saat memicu ini, selebihnya gold-plating:
- **ERD** — begitu ada ≥2 tabel berrelasi (D1/Postgres/Drizzle). ROI tertinggi.
- **Sequence** — alur multi-aktor/async: checkout COD, webhook Shopify/Scalev, auth, pipeline ingest.
- **Flowchart** — hanya logika bercabang non-trivial (mis. form hybrid by-geo).
- **C4 Context** — hanya kalau banyak sistem eksternal terintegrasi.
- **Skip** untuk CRUD tunggal linear.

## Integrasi skill lain (reuse, jangan reinvent)

- **Diagram apa pun** → `mermaid-diagram` (native render di GitHub & Claude, tanpa install).
- **API contract internal** → `openapi-spec` (OpenAPI 3.1, siap code-gen Hono/tRPC).
- **Menulis ulang / merapikan / menerjemahkan PRD yang sudah ada** → `volumx-writer` (preservasi makna). Skill ini untuk MENYUSUN dari nol, bukan rewrite.

## Output Files (portable — Mac & Linux `cuan`)

Ikuti Output discipline `AGENTS.md`, pakai `~` (jangan hardcode `/Users/...` atau `/home/...`):
- **Draft/iterasi** → `~/Documents/work/prd/<slug>/` (PRD.md, PLAN.md).
- **Final** `PRD.md` + `TASKS.md` (+ `PLAN.md` bila ada) → **root project**, biar ikut ter-commit ke GitHub bersama kodenya.
- ADR terpisah (kalau dipakai) → `docs/adr/NNNN-<slug>.md` di repo.

## Tips

- PRD baik cukup 1–2 halaman. Overspec di awal = menebak; biarkan detail muncul saat implementasi.
- Non-goals mencegah scope creep sekuat goals mendorongnya.
- Tiap task harus bisa dikerjakan agent tanpa membaca seluruh PRD — konteksnya lengkap di task itu sendiri.
- Requirement dulu, baru task. Kalau sebuah task muncul tanpa requirement, itu sinyal scope diam-diam melebar.

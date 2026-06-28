---
name: prd-taskbreaker
description: Ubah ide atau permintaan fitur menjadi PRD ringkas lalu pecah menjadi task bernomor yang siap dikerjakan AI coding agent. Gunakan saat memulai fitur baru, project baru, atau saat perlu planning terstruktur sebelum coding. Triggers: 'buat PRD', 'pecah jadi task', 'planning fitur', 'task breakdown', 'prd', 'taskbreaker', 'breakdown tasks', 'create tasks', 'write prd'.
---

# PRD Taskbreaker

Ubah ide mentah → PRD terstruktur → numbered tasks yang bisa langsung dikerjakan AI coding.

## Alur Utama

```
[Ide / Request] → [Klarifikasi singkat] → [PRD.md] → [TASKS.md]
```

## Mode

- **`prd`** — hanya buat PRD dari deskripsi yang diberikan
- **`tasks`** — pecah PRD yang sudah ada menjadi task
- **`full`** *(default)* — PRD + task dalam satu run
- **`update`** — update PRD atau task yang sudah ada

## Format PRD

Hasilkan `PRD.md` dengan struktur ini:

```markdown
# PRD: [Nama Fitur/Project]

## Overview
Satu paragraf: apa yang dibangun, untuk siapa, mengapa.

## Goals
- Goal 1 (measurable)
- Goal 2

## Non-Goals
- Apa yang TIDAK dicakup (penting untuk scope control)

## User Stories
- Sebagai [user], saya ingin [aksi] agar [hasil].

## Fitur & Spesifikasi
### Fitur 1: [nama]
- Deskripsi
- Input/output
- Edge cases

## Stack & Constraints
- Frontend: ...
- Backend: ...
- DB: ...
- Deploy: ...
- Constraint: ...

## Milestones
- [ ] v0.1 MVP: ...
- [ ] v0.2: ...
```

## Format Tasks

Hasilkan `TASKS.md` dengan task bernomor, atomic, dan AI-executable:

```markdown
# Tasks: [Nama Project]

## Rules untuk AI
- Kerjakan satu task per request
- Tandai selesai sebelum lanjut
- Jangan asumsi requirement di luar task — tanya dulu

## Phase 1: Setup
- [ ] Task 1: Init project dengan [stack]. Output: struktur folder siap dev.
- [ ] Task 2: Setup DB schema — tabel [X, Y, Z] dengan relasi [...]

## Phase 2: Core Features
- [ ] Task 3: Buat endpoint POST /api/[x] yang menerima [...] dan returns [...]
- [ ] Task 4: Buat komponen [X] dengan props [...]

## Phase 3: Polish & Deploy
- [ ] Task 5: Tambah validasi input di [...]
- [ ] Task 6: Deploy ke [target] via [metode]
```

## Aturan Task yang Baik

1. **Atomic** — satu task = satu deliverable yang jelas
2. **Verifiable** — ada output konkret (file, endpoint, UI, test)
3. **Context-complete** — sebutkan nama file, tabel, endpoint — jangan "buat sesuatu"
4. **Ordered** — urutkan berdasarkan dependency (setup dulu, feature kemudian)
5. **Sized right** — 1 task ≈ 1 coding session (30–90 menit manusia); jangan terlalu besar

## Klarifikasi Sebelum Mulai

Tanyakan ini kalau belum jelas:
- Stack yang dipakai? (frontend / backend / DB / deploy target)
- Siapa user-nya?
- Ada deadline atau prioritas fase?
- Ada sistem yang sudah ada yang perlu diintegrasikan?

## Output Files

- Simpan ke root project: `PRD.md` dan `TASKS.md`
- Kalau project belum ada direktori, simpan ke working directory

## Tips

- PRD yang baik cukup 1–2 halaman; jangan overspec di awal
- Non-goals sama pentingnya dengan goals — cegah scope creep
- Setiap task harus bisa dikerjakan AI tanpa membaca seluruh PRD

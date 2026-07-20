---
name: kamus-almanak
description: "Kamus = almanak/memori kedua Ongki di kamus.ongki.pro (repo ongkipro/kamus) — markdown di-render jadi dashboard Astro, punya kontrak AGENTS.md"
metadata: 
  node_type: memory
  type: project
  originSessionId: 175472a6-0990-4f5a-a737-847321f1963f
---

**Kamus** (`ongkipro/kamus`, private → `kamus.ongki.pro`, di-gate Cloudflare Access sehingga anonim dapat 401) adalah **sistem memori kedua** Ongki, terpisah dari memori CLI ini. File markdown di root repo di-render jadi dashboard Astro. Clone lokal: `~/Projects/kamus` (dibuat 2026-07-10; sebelumnya belum ada di Mac).

Folder = koleksi: `journal/` (per hari, `YYYY-MM-DD.md`), `tasks/`, `projects/`, `memory/`, `skills/`, `sessions/`, `summaries/`.

**Why:** kalau update memori Ongki, ini sering kali tempat yang dia maksud — bukan cuma `~/.claude/…/memory` atau `~/.config/ai/memory`. Ketiganya bisa desinkron (kamus sempat 6 hari tertinggal dari rebrand TokoΦ).

**How to apply:**
- **Baca `AGENTS.md` di repo dulu.** Frontmatter dipaksa zod di `src/content.config.ts` — format salah = **build gagal**. Jalankan `pnpm build` sebelum commit.
- Satu fakta / satu hari / satu task = **satu file**. Bahasa Indonesia.
- Push memicu deploy (`.github/workflows/deploy.yml`). `AGENTS.md` bilang jangan push otomatis kecuali diminta.
- Commit **tanpa** trailer `Co-Authored-By` — lihat `memory/no-ai-commit-trailer.md` di repo itu.
- **Gotcha:** wikilink `[[x]]` hanya resolve ke koleksi `memory/` (`src/pages/kamus/[...id].astro` cuma `getCollection("memory")`). Link ke `projects/`/`tasks/` seperti `[[dotfiles]]` atau `[[tokophi]]` **mati** — bug lama, bukan regresi.
- **JEBAKAN saat rename project:** `projects:` di frontmatter journal/sessions/summaries dan `project:` di tasks adalah **kunci indeks**, bukan teks bebas. `src/pages/projects/[id].astro` memfilter `data.projects.includes(name)` — cocok persis dengan field `name:` di `projects/*.md`. Rename project tanpa mengganti frontmatter itu = seluruh riwayatnya yatim dan hilang dari halaman project, **tanpa error dan build tetap hijau**. Verifikasi: `grep -o 'href="/journal/' dist/projects/<slug>/index.html | wc -l` setelah build.

Saat mencatat kerjaan, tulis journal hari itu di sini. Terkait [[tokophi]].

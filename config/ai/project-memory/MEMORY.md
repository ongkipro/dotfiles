# Memory Index

> ⚠️ **Mac (`ongkis-MacBook-Air`), sejak 2026-07-14: `~/Projects/` awalnya cuma `volumform`; kini juga `petanisejahtera` (clone 2026-07-18).** Sisanya sengaja dihapus setelah dipastikan utuh di GitHub. Path `~/Projects/<lain>` di bawah = **nama repo, bukan folder yang ada** → `git clone` dulu, lalu salin `.env`-nya dari `~/Documents/work/secrets/projects-env-2026-07-14/` (tidak ada di GitHub; project dibuat setelah snapshot ini tidak punya entri — mis. `petanisejahtera`). Dokumen `.md` semua project: `~/Documents/work/notes/projects-md-archive-2026-07-14/`.

- [AUSSIE Sawit Malaysia](aussie-sawit-malaysia.md) — COD e-dagang sawit MY (Astro/CF Workers/D1). Admin+storefront siap. Repo `ongkipro/aussiemalaysia`; status terkini ada di `STATUS.md` **di dalam repo** — jangan percaya status di memori ini.
- [Volumform ID-market UX](volumform-id-market-ux.md) — DR-funnel SaaS; Indonesian COD UX conventions + deferred features (status bayar, retur, auto-FU). Ter-checkout di Mac (`~/Projects/volumform`).
- [Petani Sejahtera](petanisejahtera.md) — LP funnel ads COD (Astro/CF Workers, backend Scalev). Repo `ongkipro/petanisejahtera`, ter-checkout di Mac (`~/Projects/petanisejahtera`, sejak 2026-07-18). Form middle/hybrid by-geo; **baca `DEV_NOTES.md` di repo dulu**. Env tidak ada di arsip secrets.
- [Volumup](volumup.md) — multi-store dropship US. **KODE ADA + jauh:** `~/Projects/volumup` (satu worktree, branch `main` — dikonsolidasi 2026-07-20, worktree phase1/phase3 dihapus), repo `ongkipro/volumup`. Admin+superadmin+storefront jalan di browser; superadmin cockpit 100% live-data; CI hijau. **Resume dari repo `STATUS.md` "RESUME HERE"** (next: in-app store provisioning). Konteks bisnis/legal (PE, entity, Printify) di memori; progres kode di repo BUILD-LOG (disk menang).
- [TokoΦ](tokophi.md) — commerce SaaS ID. Repo `ongkipro/tokophi`; repo lama `indostore` dorman, jangan dipakai. Dev utama di mesin lain — pull dulu.
- [Kamus (almanak)](kamus-almanak.md) — `kamus.ongki.pro`, repo `ongkipro/kamus`. Memori kedua Ongki; markdown → dashboard Astro. Ada kontrak `AGENTS.md`.
- [Skill plumbing](skill-plumbing.md) — 35 skill (2026-07-20), sumber tunggal `~/dotfiles/skills/local`, symlink SATU-DIREKTORI ke claude & pi. `git pull` sudah cukup — jangan hapus output "Backed up existing path". Plugin resmi vendor (vercel, stripe) DIIZINKAN.
- [Skill vs memori](skills-vs-memory-boundary.md) — konteks project TETAP di memori, jangan pernah dijadikan skill. Skill = reusable lintas-project.
- [Biasakan git worktree](prefer-git-worktree.md) — kerja repo lewat worktree terpisah, jangan checkout/commit langsung di `main`.
- [Commit menambah, bukan menimpa](additive-commits-no-history-rewrite.md) — jangan force-push/rewrite history. Identitas commit = noreply, jangan pakai email asli.
- [Antigravity CLI = `agy`](antigravity-cli-agy.md) — binary `agy`, BUKAN `gemini`; subcommand `plugin` bukan `extensions`. Gemini CLI sengaja tidak dipasang.
- [worktrunk (`wt`)](worktrunk-worktree-tooling.md) — tooling worktree. Plugin agy butuh binary `brew install worktrunk` dulu, kalau tidak hook-nya error.

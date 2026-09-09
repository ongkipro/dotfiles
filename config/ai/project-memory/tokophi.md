---
name: tokophi
description: "TokoΦ commerce SaaS — repo di ~/Projects/tokophi, dokumentasi .md di-symlink ke ~/Documents/work/tokophi"
metadata: 
  node_type: memory
  type: project
  originSessionId: d80df881-dc15-46ed-8d1a-e20e2834efbf
---

TokoΦ (`ongkipro/tokophi`, **PUBLIC lagi sejak 2026-09-09** (perintah eksplisit owner — flip KELIMA). Riwayat: private → public 27–28 Agu → private 28 Agu → public 1–4 Sep → private 4 Sep → public 9 Sep. Tuasnya selalu sama: menit GitHub Actions (public gratis, private dibebankan), dan CI sekarang mem-build empat surface tiap PR. Isi repo dianggap terindeks publik sejak jendela 27–28 Agu, jadi fase private menutup akses BARU dan tidak menarik yang sudah tersebar. Aturan tetap: JANGAN flip tanpa perintah eksplisit baru — verifikasi dengan `gh api repos/ongkipro/tokophi --jq .visibility`, jangan percaya catatan ini dianggap terindeks publik sejak jendela 27–28 Aug) — Shopify-style commerce SaaS for Indonesia. Monorepo: `apps/{admin,super-admin,storefront}`, `packages/{db,data,lib,ui,sections}`, `specs/`.

This project's old name was `indostore`; rebranded 2026-07-08. The repo `ongkipro/indostore` **still exists on GitHub but is dormant** — don't use it, don't push to it. All 94 of its commits are already contained in the `tokophi` history (old HEAD `e95b71f`). If you read an old note mentioning "Indostore", that's the same project, not a separate one.

The repository may not exist on every device. Inspect local disk and Git before acting; do not infer clone state, branch freshness, or deployment status from this reference memory. Git-tracked `.md` files may be **symlinked** (not copied) into `~/Documents/work/tokophi/` with the structure `prd/`, `architecture/`, `decisions/`, `ops/`, `notes/`, `agent-config/` when the repo is present.

**Business/ops gotchas that are NOT readable from the code** (moved from `projects.md` 2026-07-20):
- **KiriminAja** (shipping) + **AutoLaris** (payment VA/QRIS) integration — platform-managed & **white-label**: the provider brand is hidden from the client, only the super-admin sees it. COD exists.
- **`KIRIMINAJA_ENV` defaults to `sandbox`** (`tdev.kiriminaja.com`) — an unset env silently talks to sandbox; real rates but not production. This is the last step before real money.
- **E-wallet/retail acceptance is an AUTOLARIS fact, not a code fact — probe it, don't trust this note.** A direct probe (~2026-07) got `rc=07` for OVO/GoPay/DANA/ShopeePay/LinkAja + retail, so only QRIS + 5 VA (BCA/Mandiri/BNI/BRI/Permata) were treated as live. **As of 2026-08-27 production has OVO enabled in `platform_payment_channels`** — either AutoLaris opened it or a buyer picking OVO dies at the final step. Before relying on any e-wallet channel, re-probe `create_payment` for that channel; the DB toggle proves nothing about the PSP side.
- **`npm run audit:responsive -w @tokophi/storefront`** = the responsive gate (10 routes × 11 widths 320→1920). Run it before claiming "responsive".
- **Multiple agents in one worktree = lost work** (lost twice already). Read the repo `AGENTS.md` before coding: don't `pkill astro/next` (it kills another agent's server), don't `git add -A` (use an explicit pathspec), commit as often as possible.
- **Storefront tenant preview in a real browser without hosts edits**: `http://<slug>.127.0.0.1.sslip.io:<port>` (public DNS resolves to localhost; the first label is the store slug). Dev server port is `4327` (`astro dev --port 4327` in package.json), not Astro's default. A store whose primary host is set (e.g. the batik demo → `toko-demo.test`) 301s away from the sslip URL — drive it with Chrome's `--host-resolver-rules`, or use a store without a primary domain.
- **Local `main` di `~/projects/tokophi` BUKAN lagi stale fork** (dikoreksi 2026-09-02: ia leluhur bersih origin/main dan sudah di-FF ke `d39f5aa`). Catatan lama "276-behind, jangan push" usang — tapi kebiasaannya tetap: kerja via worktree + PR, `main` lokal hanya cermin baca; sinkronkan dengan `merge --ff-only origin/main`, jangan pernah commit langsung di situ.
- **Verify the PID that owns the port before trusting any browser measurement** (`ss -ltnp`). The EADDRINUSE trap has now graded a STALE build as current at least five times across sessions — a new server silently binds the next port up and the old process keeps serving the old code.

**Why:** those .md files are part of the repo — moving them out would break the repo. Symlinks keep `~/Documents` tidy without a duplicate that can go stale.

**How to apply:** editing via either path is the same — they're the same file. Don't "tidy up" `~/Documents/work/tokophi` by deleting/overwriting; that touches repo files. When a new `.md` is added in the repo, its symlink needs to be created manually.

Current implementation, deployment, infrastructure, and migration status belong in the repository and live systems, not here. Read the repository's `AGENTS.md`, status documents, and disk state before working. See also [[kamus-almanak]].

Operational findings measured on 2026-08-05, including Coolify access behavior, environment parity,
Compose validation constraints, and local mirror details, are device-specific. Read
`~/.config/ai-local/tokophi-access.md` and `~/.config/ai-local/coolify-local.md` on the relevant machine.

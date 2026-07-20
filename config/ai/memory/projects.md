# Memori: Projects — fakta per-project
> Bagian dari memori bersama. Tambah/aktualkan saat kerja di sebuah project.
> Format: `## <nama project>` lalu bullet fakta penting (path, stack, catatan).

## ⚠️ BACA DULU — soal PATH (path itu PER-DEVICE, cek disk dulu)

- `/home/fantastico/...` → user itu **TIDAK ADA** di mesin manapun sekarang. Itu mesin Linux LAMA. Abaikan.
- **Di `cuan` (Linux, user `ongki`), per 2026-07-14: HANYA `~/Projects/kamus` yang ter-checkout** (repo `ongkipro/kamus`, branch `main`) — diverifikasi `ls ~/Projects`. Project lain belum di-clone; path `~/Projects/<lain>` di file ini **tidak berlaku di sana**. (Catatan dari Mac yang bilang `~/Projects/` cuan KOSONG itu **salah** — Mac menebak tentang mesin yang bukan miliknya. Jangan menulis fakta disk mesin lain tanpa mengeceknya.)
- **Di Mac (`ongkis-MacBook-Air`): isi `~/Projects/` BERUBAH-UBAH — jangan hafalkan daftarnya, jalankan `ls ~/Projects`.** Riwayat: 2026-07-14 sengaja disisakan `volumform` saja (bersih-bersih, sisanya dipastikan utuh di GitHub); sejak itu bertambah lagi (per 2026-07-20: `landing-page`, `petanisejahtera`, `volumform`, `volumup`). Project yang TIDAK muncul di `ls` = belum di-clone → `git clone` dulu.
  - Kredensial yang di-gitignore (9 `.env` + sqlite dev) diamankan ke `~/Documents/work/secrets/projects-env-2026-07-14/` (mode 700). **Sesudah clone, salin `.env`-nya balik dari sana** — GitHub tidak menyimpannya.
  - Dokumen `.md` semua project diarsipkan ke `~/Documents/work/notes/projects-md-archive-2026-07-14/`.

**Sumber kebenaran project = repo GitHub-nya** (`github.com/ongkipro/<nama>`). Kalau memori dan disk bertentangan → **disk menang**, lalu perbaiki memorinya.
Mau kerja di sebuah project? `git clone` dulu ke **`~/Projects/<nama>/`** (konvensi resmi), baru mulai. Cek fakta, jangan tebak: `ls ~/Projects`.

## Konvensi folder

- **Source code → `~/Projects/<nama-project>/`** (semua di dalam: config, node_modules, .git).
- Output AI (PRD, research, konten, catatan) → `~/Documents/work/{prd,research,content,notes}/`.
- Memori AI → **`~/.config/ai/memory/`** (symlink → dotfiles). Catatan lama yang menyebut `~/Documents/memori ai/` atau `~/dotfiles/memori-ai/` **SALAH** — dua-duanya tidak ada.
- Mesin utama: Linux. macOS = device kedua untuk mobile/sync.

## macOS — Projects Aktif

### dotfiles
- `~/dotfiles` → backup semua config, repo private `github.com/ongkipro/dotfiles`.
- `install.sh` untuk setup device baru (idempotent).
- `bin/dotsync` = helper semi-auto sync lintas Linux/macOS untuk review → commit → push opsional pada shared memory/config.
- `install-macos.sh` = bootstrap ringan macOS untuk shared memory, skill linking, dan workflow sync dasar.
- tmux stack di dotfiles memakai prefix `Ctrl+a`, theme plain-font-friendly Catppuccin-inspired, dan plugin: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Setup di-handle `bin/tmux-setup`; helper battery lintas macOS/Linux ada di `bin/tmux-battery`.
- GSAP skills resmi dari `greensock/gsap-skills` telah di-vendor ke `~/dotfiles/skills/local/` sebagai: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`, lalu disebarkan lintas CLI via `skill-update`.

> Catatan: repo/project lama `social-dashboard` sudah DIHAPUS (GitHub + digantikan
> total oleh `social-autopilot` pada 3 Juli 2026). Repo GitHub baru: `github.com/ongkipro/social-autopilot` (private).

### social-autopilot (macOS dev) — brand: **Volum**
- Path `~/Projects/social-autopilot` (repo `ongkipro/social-autopilot` private; PRODUK/brand = **Volum** — "Sosmed auto by AI", tagline "Turn up your social presence."). Rebuild dari nol dari `social-dashboard` (3 Juli 2026): autopilot-first, tanpa Twitter (hanya FB/IG/Threads/Pinterest). Demo login `demo@volum.app` / `password123`.
- Stack: Next.js 16 (App Router, Turbopack) + React 19 + shadcn/ui + Tailwind v4 + better-auth + PostgreSQL 16 + Drizzle. Postgres lokal Homebrew `postgresql@16`, DB `social_autopilot`, dev :3000. Engine autopilot `src/lib/autopilot/engine.ts` `runTick()` (fire due autopilots + publish due posts) via `/api/cron` (Bearer CRON_SECRET) atau `pnpm autopilot:tick`; demo accounts → publish disimulasikan.
- **AI lewat 9router** (`src/lib/ai/ninerouter.ts`), model via env. Gotcha yang menyelamatkan: teks & image punya **fallback chain** karena tunnel remote (Cloudflare quick-tunnel) **sering 530/down** — `NINEROUTER_*_FALLBACK_URL` + fallback lokal/Pollinations. **Model teks = `cx/gpt-5.4`** (user minta GPT 5.4, BUKAN 5.5). **CAVEAT: Gemini/OpenAI balas base64 (data URI)** — oke buat preview, TAPI publish IG/Pinterest asli butuh URL publik → perlu hosting gambar (R2/Supabase) nanti.
- Security-hardened (IDOR cross-tenant scope-by-userId, cron Bearer CRON_SECRET, atomic-claim anti double-publish, OAuth CSRF + state-parse `meta:instagram` colon) — ada regression test; detail di kode.
- Status: pipeline TERBUKTI jalan lokal (generate AI+gambar → auto-publish demo → job log). Belum deploy; belum uji OAuth ke akun sosmed asli (butuh app Meta/Threads/Pinterest + review). Isi kredensial di `.env.local` untuk uji OAuth asli; deploy target Vercel + Neon + Vercel Cron.


## Linux — Projects (referensi dari mesin utama)


### pesantren-tholabie (pesantrentholabie.com)
- Repo: `github.com/ongkipro/pesantren-tholabie-compro` (belum di-clone di `cuan`)
- Stack: Astro, TailwindCSS, Lucide Icons, TypeScript.
- Pondok Pesantren THOLABIE CIBS Malang. Makkah & Madinah Theme (hijau, hitam, emas).
- 6 halaman: Beranda, Tentang, Beasiswa, Asrama, Kurikulum, Kontak & FAQ.

### landing-page (Mac, `~/Projects/landing-page`)
- Stack: Next.js 16 + React 19 + Drizzle ORM + Cloudflare Worker (`@cloudflare/vite-plugin`, runner `vinext`). `package.json` name = `site-creator-vinext-starter`. Script: `dev`/`build`/`test`/`lint`/`db:generate`.
- 🚨 **NOL COMMIT dan TIDAK PUNYA REMOTE** (diverifikasi 2026-07-20: `git log` → "does not have any commits yet", `git remote -v` kosong, 19 entri untracked). Semua kerjaan di sini **cuma ada di disk Mac ini** — hilang kalau disk mati atau folder terhapus.
- Aksi yang belum dilakukan: `git add` + commit pertama, bikin repo `ongkipro/<nama>`, `git remote add origin` + push. Sampai itu dilakukan, jangan jalankan apa pun yang destruktif di folder ini.

### AUSSIE Sawit Malaysia → lihat [[aussie-sawit-malaysia]] di project-memory
- COD e-dagang rawatan sawit MY (`aussiesawit.my`). Astro 6 + Tailwind 4 + Cloudflare Workers/D1/R2. Repo aktif `ongkipro/aussiemalaysia` (folder `~/Projects/aussiemalaysia`), backend order = **D1 sendiri, TIADA Scalev** (keputusan v3, 2026-07-08). Fulfillment = EasyParcel. Status terkini di repo `STATUS.md` — jangan percaya status di memori.
- ⚠️ Entri/repo lama `aussie-malaysia` + catatan "Scalev + Meta CAPI" **USANG dan SALAH** — dua folder berbeda (lihat "Jebakan repo lokal" di bawah).

### petanisejahtera → lihat [[petanisejahtera]] di project-memory
- LP funnel ads COD (`petanisejahtera.com`). Astro v6 SSR + Cloudflare Workers, backend order = Scalev API. Repo `ongkipro/petanisejahtera`, ter-clone `~/Projects/petanisejahtera` (sejak 2026-07-18). `.env` TIDAK ada di arsip secrets. Baca `DEV_NOTES.md` + `GEOFORM_HYBRID_MIDDLE_ENV.md` di repo dulu.

### mahad-nurul-haromain-lin-nisa
- Repo: `github.com/ongkipro/mahad-nurul-haromain-lin-nisa-compro` (belum di-clone di `cuan`)
- Stack: Astro, Tailwind v4, TypeScript, Lucide. Website pesantren putri.

## SEO Knowledge Base
- ⚠️ Arsip riset SEO lama (`Documents/SEO`) TIDAK ADA di mesin manapun sekarang. Skill `seo-website-builder` berdiri sendiri lewat `references/`-nya. On 2026-06-30 created active local skill `seo-website-builder` at `~/dotfiles/skills/local/seo-website-builder` and synced via `skill-update` to pi/agents/claude/codex/gemini. Skill uses compact references copied from Documents/SEO; original 100+ SEO OS export remains in Documents for deep reference. Existing skills mined into the playbooks: `seo-local-business`, `shopify-listing`, and `astro-development`. Multi-engine docs cover Google/Bing/Yandex/Pinterest/AI search using official/trusted sources.
- Public standalone SEO skill repo created: `https://github.com/ongkipro/seo-website-builder-skill` (public). Dotfiles remain private; public repo contains sanitized `seo-website-builder` Agent Skill only.

## report-petani-next (Next.js 16 SaaS Dashboard, report.petanisejahtera.com)
- Repo `github.com/ongkipro/report-petani-next` (belum di-clone di Mac). Next.js 16 (App Router) + shadcn/ui + Tailwind v4 + Recharts, deploy Vercel. **Versi production** (report-petani-sejahtera = versi awal Astro).
- Pola: data registry di `src/data/index.ts` (tambah laporan: copy `mei-2026.ts`, isi, daftarkan di registry); `MonthlyReport` reusable props-based untuk semua bulan. Guide lengkap di `GUIDE.md`.

## report-petani-sejahtera (Astro, report.petanisejahtera.com)
- Repo: `github.com/ongkipro/report-petani-sejahtera` (belum di-clone di `cuan`)
- Stack: Astro, Tailwind v4, shadcn/ui, React islands
- Catatan: Versi awal dashboard. Next.js version di report-petani-next adalah versi production.

## petcue (Petcue.co — Astro + Shopify Storefront)
- Repo `github.com/ongkipro/petcue` (private, belum di-clone di Mac). Astro + Tailwind v4 + Shopify Storefront API + Cloudflare Workers.
- Brand: premium pet travel gear (teal `#007C78`, mint, amber, charcoal). Clone dari `pixsgo`, rebranded untuk niche pet travel.

## pixsgo (Pixs&Go — Astro + Shopify Storefront, pixsgo.com)
- Repo `github.com/ongkipro/pixsgo` (private, belum di-clone di Mac). Astro + Tailwind v4 + Shopify Storefront API + Cloudflare Workers; deploy CF Workers domain pixsgo.com.
- Brand: Pixs&Go / "Play & Go" — screen-free toys (coral, warm cream). Playful, minimalist; aksesibilitas senior (font ≥16px). 125 products, 9 collections, Judge.me reviews, blog/journal.

## homelook (HOME LOOK — Astro + Shopify Storefront, homelook.shop)
- Repo `github.com/ongkipro/homelook` (private, belum di-clone di Mac). Astro + Tailwind v4 + Shopify Storefront API + Cloudflare Workers.
- Brand: HOME LOOK — premium architectural fittings (pine green, warm sand, muted brass). Clone dari homeimprovement (RIVA HOME). (Rebrand terkait `babyfits` → lihat "Jebakan repo lokal" di bawah.)

### volumecms (macOS dev) — PLATFORM CMS multi-tenant
> Repo `github.com/ongkipro/volumecms` (private) **TIDAK ter-clone di Mac** (`ls ~/Projects` tak ada) → memori ini satu-satunya salinan lokal konteks bisnis/arsitektur. Progres & detail komponen bisa direkonstruksi dari repo (README + docs/{PRD,FEATURES,ARCHITECTURE,AGENTS}.md + CHANGELOG); di sini hanya keputusan & gotcha yang TIDAK terbaca dari kode.
- Path (bila di-clone) `~/Projects/volumecms` (**P besar** — case-sensitive di Linux). Stack: Next.js 16 (App Router) + TS + Tailwind v4 + shadcn (Base UI) + GSAP + Drizzle + PostgreSQL + better-auth. Deploy Vercel.
- **Produk:** CMS ala WordPress + SaaS dashboard (Posts/Pages/Products katalog→CTA WhatsApp, Categories/Tags/Media/Banners/Menu/Settings/Users) + frontend publik company-profile (hero GSAP, katalog+filter, detail produk+WA, blog, `/[slug]` dinamis, SEO sitemap/robots/metadata, dark mode).
- **Keputusan besar: jadi PLATFORM multi-tenant — 1 repo → banyak Vercel** (beda konten via DB masing-masing, beda skin). Arsitektur skin di `src/themes/` (interface `SiteTheme` + `registry.ts` `getActiveTheme()`): route `(site)/*` = data + metadata + JSON-LD (SEO shared), skin = presentasi. Skin: `standard` + `madinah` (Islami). Pemilih skin: env `NEXT_PUBLIC_SITE_THEME` (deploy-time per Vercel, menang) → fallback DB `settings.themeSkin`. **Skin di-scope ke wrapper `(site)/layout` → admin selalu NETRAL** apa pun skin. Admin `/admin/theme` = galeri + customize per-skin.
- **RBAC:** `admin` (penuh) + `publisher` (konten saja, TANPA Settings/Users); maks 5 user (`MAX_USERS`); kuota media 128 MB (`MAX_STORAGE_BYTES`, ditegakkan di `/api/upload`, per-file 2 MB). Storage adapter `lib/storage.ts`: local (dev) / Vercel Blob (prod). Seed admin `admin@volumecms.test` / `password123`.
- **Pola nambah fitur (feature-flagged):** schema+enum → `db:push` ke SEMUA DB → server action (`lib/actions/<entity>.ts`, 'use server' + zod + requireUser/requireAdmin) → public page (token-styled, `notFound()` bila flag off) → admin page + DataTable → nav-config `flag` → settings toggle → seed. Fitur ber-flag yang ada: PPDB/pendaftaran, Galeri, Agenda. `CLIENTS.md` = playbook nambah client.
- **DEPLOY DEMO:** LIVE `https://volumecms.vercel.app` (skin `standard`), DB Neon (Vercel Marketplace), Blob `volumecms-media`. Env prod: DATABASE_URL, BLOB_READ_WRITE_TOKEN, BETTER_AUTH_SECRET/URL, NEXT_PUBLIC_APP_URL, STORAGE_DRIVER=blob.
- **DEPLOY CLIENT — Tholabie LIVE `https://pesantrentholabie.com`** (skin madinah, konten pesantren, env `NEXT_PUBLIC_SITE_THEME=madinah`, flag PPDB/Galeri/Agenda on). Vercel project `tholabie` (project Astro lama di-repoint ke repo volumecms, git-connect). **Tiap client = instance Neon DEDICATED** (Tholabie = `neon-gray-notebook`@`ep-solitary-scene`, demo = shared `ep-fragrant-mountain`); Blob `tholabie-media`. Seed `db:seed:tholabie` + `db:seed:tholabie-content`.
- **Gotcha deploy/ops (TIDAK terbaca dari kode):**
  - **Git author email HARUS = email member team Vercel**, kalau tidak deploy BLOCKED ("Git author must have access to the team"). Email Vercel `ongkiardiansyah@gmail.com`.
  - Neon dedicated per-client **tak bisa full-otomatis**: provisioning butuh `authorizationId` dari flow Marketplace interaktif (browser consent). Blob store BISA otomatis via API.
  - `vercel deploy --prod` = deploy **WORKING TREE** (bukan git HEAD) → WIP uncommitted ikut tayang; git bisa divergen dari production. `git push` (kedua project git-connected) auto-deploy.
  - Deploy CLI hang streaming log di non-TTY → `nohup … &`, pantau state via REST API v6/v13 deployments (bukan `vercel ls`). `drizzle-kit push` butuh TTY → pakai `drizzle-kit migrate`; DDL/seed pakai UNPOOLED, runtime pooled. ssoProtection Vercel default nge-wall preview → matikan via PATCH api v9/projects.
  - Framework project lama (Astro) → deploy gagal "No Output Directory dist"; fix PATCH Vercel `/v9/projects/{id}` `{framework:"nextjs", outputDirectory:null, buildCommand:null}`.
  - **BUG jsonb `settings.value`:** jangan update via raw postgres.js template (`sql\`… ${obj}\`` / `::jsonb`) → double-encode → jsonb jadi string korup, app baca default. Pakai Drizzle (`updateSiteSettings`) atau `sql.json(obj)`. Cek `select jsonb_typeof(value)` HARUS `object`.
  - Query DB dari script: driver = **postgres.js** (bukan neon-serverless), `node --env-file=.env.local dbq.cjs`.
- `nextpress` = prototipe awal konsep ini (DIARSIPKAN) — lihat bawah. `~/Projects/volumecms-tholabie-fe` = git-worktree volumecms (lihat "Jebakan repo lokal").
- **CAVEAT MEMORI: projects.md ada di `~/dotfiles` (git). JANGAN pakai Write untuk edit (nimpa file!), pakai Edit.**

## TokoΦ → lihat [[tokophi]] di project-memory
- Commerce SaaS Indonesia (`tokophi.com`), monorepo `ongkipro/tokophi`, Next.js 16 + Astro + Drizzle + PostgreSQL 16 + RLS/RBAC. Nama lama `indostore` (repo dorman, jangan dipakai). **Tidak ada clone di Mac** — dev utama di Linux, `git pull` dulu. Gotcha bisnis (KiriminAja/AutoLaris white-label, e-wallet mati `rc=07`, `KIRIMINAJA_ENV=sandbox`, multi-agen-satu-worktree) → **`[[tokophi]]`**. Histori sesi di repo `CHANGELOG.md` + `specs/docs/`.

## kamus (almanak / memori kedua) → lihat [[kamus-almanak]] di project-memory
- `kamus.ongki.pro` (repo `ongkipro/kamus`, private, di-gate Cloudflare Access → anonim 401). Astro merender markdown root repo jadi dashboard. **Tidak ada clone di Mac.** Sering "memori" yang user maksud (bukan `~/.config/ai/memory` atau memori CLI); ketiganya bisa desinkron. Kontrak AGENTS.md, jebakan rename-project, status wikilink → **`[[kamus-almanak]]`**.

## volumform → lihat [[volumform-id-market-ux]] di project-memory
- DR-funnel SaaS multi-tenant Indonesia (COD + CRM + Meta tracking + shipping KiriminAja/Mengantar). Repo `ongkipro/volumform` (dibuat 2026-07-10), `~/Projects/volumform`. Monorepo `apps/{admin,superadmin,edge}` + `packages/db` (Drizzle); client admin & super admin = 2 SPA terpisah.

## fiverr-clone (macOS dev — GigFlow freelance marketplace)
- Path: `~/Projects/fiverr-clone` → repo privat `github.com/ongkipro/fiverr-clone` (dibuat 2026-07-11; **remote baru dibuat 2026-07-14** — sebelumnya 33 commit cuma hidup di satu mesin).
- Stack: Next.js 16 + React 19 + Tailwind v4 + shadcn/ui + Better-Auth + Drizzle ORM + Stripe.
- Dokumentasi UI/UX: `~/Documents/UIUX/fiverr-clone/` (karena masih prototype)
- ⚠️ **`.venv` (playwright driver 114 MB) pernah ter-commit** → GitHub menolak push (batas 100 MB/file). Sudah dibuang dari history + masuk `.gitignore`. Jangan taruh virtualenv Python di dalam repo Next.js ini lagi.

## Jebakan repo lokal yang sudah dibereskan (2026-07-14, Mac)
Sebelum ini, **4 project tak punya cadangan di mana pun**. Semua sudah di-push. Fakta yang tidak terbaca dari kode:
- **`~/Projects/volumecms-tholabie-fe` itu GIT WORKTREE** dari `volumecms` (branch `tholabie-frontend`), bukan project terpisah. `.git`-nya **file**, bukan direktori — cek `-d .git` akan bilang "bukan repo git" dan itu SALAH. Jangan `git init` di sana. Branch-nya kini sudah ada di remote `volumecms`.
- **`~/Projects/babyfits` = rebrand dari `homelook`**, tapi remote-nya dulu masih menunjuk `homelook.git` → push = menimpa isi repo homelook. Sekarang punya repo sendiri (`ongkipro/babyfits`); remote lama disimpan sebagai `homelook-upstream`.
- **`aussiemalaysia` (aktif, Astro+CF+D1) ≠ `aussie-malaysia` (repo lama)** — dua folder, dua project. Yang aktif kini repo `ongkipro/aussiemalaysia`.
- Arsip dokumen: 278 file `.md` dari semua project → `~/Documents/work/notes/projects-md-archive-2026-07-14/`.

## nextpress — DIARSIPKAN (jangan dilanjutkan)
- Prototipe CMS ala WordPress (Next.js 16 + shadcn + GSAP), ditinggalkan 2026-07-03. **Digantikan total oleh `volumecms`** — konsep sama, ditulis ulang dari nol, history tidak berhubungan (root commit beda).
- Repo `github.com/ongkipro/nextpress` privat + **archived** (read-only) pada 2026-07-10 sekadar arsip. Folder lokal `~/Projects/nextpress` boleh dihapus kapan saja.


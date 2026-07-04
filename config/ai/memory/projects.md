# Memori: Projects — fakta per-project
> Bagian dari memori bersama. Tambah/aktualkan saat kerja di sebuah project.
> Format: `## <nama project>` lalu bullet fakta penting (path, stack, catatan).

## Konvensi Baru (2 Juli 2026)

- **Semua project development → `~/Projects/<nama-project>/`**
- Source code, config, node_modules, .git semua di dalam folder project.
- Dokumentasi (PRD, UML, konten, research) → `~/Documents/ai-artifacts/<kategori>/`.
- Memori AI → `~/Documents/memori ai/`.
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
- Path: `~/Projects/social-autopilot` (repo GitHub tetap `social-autopilot`; PRODUK/brand = **Volum**).
- Brand: **Volum** — "Sosmed auto by AI", hero tagline "Turn up your social presence." Logo = volume-bars (violet), favicon `app/icon.svg`. Demo login: `demo@volum.app` / `password123`. package.json name=`volum`.
- Rebuild dari nol dari repo `social-dashboard` (3 Juli 2026). Fokus: autopilot-first, tanpa Twitter (hanya FB/IG/Threads/Pinterest).
- Stack: Next.js 16 (App Router, Turbopack) + React 19 + shadcn/ui (new-york, Radix) + Tailwind v4 + Recharts + better-auth + PostgreSQL 16 (timestamptz) + Drizzle ORM.
- **AI lewat 9router** (bukan Minimax langsung): `src/lib/ai/ninerouter.ts` → `/v1/chat/completions` + `/v1/images/generations`, model via env `AI_TEXT_MODEL`/`AI_IMAGE_MODEL`. Parser tahan trailing `data: [DONE]` + SSE.
- **Model teks: `cx/gpt-5.4`** (ChatGPT via tunnel remote berbayar — user minta GPT 5.4, BUKAN 5.5). Kualitas jauh > pool gratis. NINEROUTER_URL kini = tunnel `https://rbq97ts.abc-tunnel.us` (butuh key). Fallback historis pool gratis `oc/mimo-v2.5-free` (hindari `*-flash-free` = reasoning → kosong). 9router LOKAL (`~/.9router/db/data.sqlite`) providerConnections/apiKeys SEMUA 0 (cuma pool gratis) — makanya pindah ke tunnel. **Tunnel = Cloudflare quick-tunnel (`*.trycloudflare.com`) → SERING 530/down.** Karena itu `chat()` punya **fallback teks**: `NINEROUTER_TEXT_FALLBACK_URL`+`AI_TEXT_MODEL_FALLBACK` (default local `oc/mimo-v2.5-free`) — terbukti nyelametin generate saat tunnel 530.
- **Image: endpoint terpisah + fallback.** Teks & image bisa beda instance 9router: `NINEROUTER_IMAGE_URL`/`NINEROUTER_IMAGE_KEY` (fallback ke `NINEROUTER_URL`). Sekarang image pakai **tunnel remote** (base `https://rbq97ts.abc-tunnel.us`, key di .env.local — JANGAN commit) yang punya provider **Gemini/OpenAI(cx)/Antigravity(ag)**. **Image chain** `createImage()`: `AI_IMAGE_MODEL=ag/gemini-3.1-flash-image` (default, cepat ~12s) → `AI_IMAGE_MODEL_FALLBACK=cx/gpt-5.4-image` (backup, GPT 5.4 image, lambat ~48s) → keyless **Pollinations/FLUX** (`IMAGE_FALLBACK=pollinations`). (`gemini/*-pro/2.5` sering 429 quota — hindari.) **CAVEAT: Gemini/OpenAI balas base64 (data URI)** — oke buat preview/demo, TAPI publish IG/Pinterest asli butuh URL publik → perlu hosting gambar (R2/Supabase) nanti.
- DB 8 tabel: user/session/account/verification + social_account, post, autopilot, job. `autopilot` = rule (topic, tone, target accounts, cadence timesOfDay/daysOfWeek+timezone, autoPublish). Engine `src/lib/autopilot/engine.ts` `runTick()` = fire due autopilots (generate) + publish due posts; dipanggil `/api/cron` (Bearer CRON_SECRET) atau `pnpm autopilot:tick`.
- Demo accounts (metadata.demo=true) → publish disimulasikan di `dispatchPublish`. Seed: `demo@autopilot.dev` / `password123` (brand "Brew & Co").
- Postgres lokal via Homebrew `postgresql@16` (brew services). DB `social_autopilot`. Dev di :3000 (kadang :3002 kalau bentrok).
- **OAuth di-hardening (belum diuji app asli, tapi benar per docs):** CSRF-safe (nonce httpOnly cookie via `oauth-state.ts`, identity dari session bukan URL), Threads dipisah ke `threads.ts` (endpoint `threads.net`/`graph.threads.net` — sebelumnya salah pakai dialog FB), Meta short→long-lived token, `tokens.ts` `ensureFreshToken()` auto-refresh Threads/Pinterest. Route jadi 19 (threads start/callback). Login app (better-auth email/password) SUDAH teruji.
- **OAuth state gotcha (fixed):** cookie state = `<label>:<nonce>`, label bisa punya colon (`meta:instagram`). `consumeOAuthState` HARUS ambil semua kecuali segment terakhir (`parseStateLabel`) — dulu ambil segment pertama saja → IG connect salah kesimpan jadi Facebook. Ada regression test.
- **Security-hardened (adversarial scan → fix → verified):** ditutup IDOR cross-tenant publishing (createPost/publishNow/engine semua scope by userId; targetAccountIds divalidasi ownership), cron wajib Bearer CRON_SECRET (deny bila unset), atomic-claim anti double-publish/double-fire (guard status / due-condition — JANGAN guard equality timestamptz, microsecond ≠ JS Date ms), DST 2-pass di schedule.ts, generateDraft throw bila konten kosong.
- **Content skill masuk app:** `src/lib/ai/playbook.ts` (SYSTEM_PROMPT + framework per-platform) diadaptasi dari skill `social-media-posts` — hook depan, struktur, hashtag strategy, char limit; dipakai `generate.ts`.
- **UI/UX:** `SocialPreview` (preview post native per-platform) di Compose (tab Edit/Preview), stat cards bertint, loading skeleton, favicon `app/icon.svg`. 20 route.
- Status: Full pipeline TERBUKTI jalan lokal (generate AI nyata + gambar → auto-publish demo → job log). Build+lint bersih, TS hijau. Belum deploy. Belum diuji OAuth ke akun sosmed asli (butuh app Meta/Threads/Pinterest + review platform).
- Catatan lanjut: isi kredensial app Meta/Threads/Pinterest di .env.local untuk uji OAuth asli; provider image 9router opsional (fallback Pollinations sudah jalan); deploy Vercel + Neon + Vercel Cron.

### toko-online (macOS dev)
- Path: `~/Projects/toko-online`
- Stack: Astro (minimal starter), TypeScript.
- Status: Fresh from `npm create astro@latest -- --template minimal`. Belum ada PRD/spec.

## Linux — Projects (referensi dari mesin utama)

### pixsgo (Play & Go)
- Path: `/home/fantastico/Projects/pixsgo`
- Stack: Astro, TailwindCSS, Shopify Storefront API, Cloudflare Workers.
- Catatan: Toys & Hobbies store. Playful, Minimalist, Modern. Senior accessibility (font >= 16px).

### pesantren-tholabie (pesantrentholabie.com)
- Path: `/home/fantastico/Projects/pesantren-tholabie-compro`
- Stack: Astro, TailwindCSS, Lucide Icons, TypeScript.
- Pondok Pesantren THOLABIE CIBS Malang. Makkah & Madinah Theme (hijau, hitam, emas).
- 6 halaman: Beranda, Tentang, Beasiswa, Asrama, Kurikulum, Kontak & FAQ.

### aussie-malaysia (aussiesawit.my)
- Path: `/home/fantastico/projects/aussie-malaysia`
- Stack: Astro 6 + Cloudflare Workers. API Scalev + Meta CAPI.
- Fertilizer e-commerce untuk Malaysia.

### petanisejahtera (petanisejahtera.com)
- Path: `/home/fantastico/projects/petanisejahtera`
- Stack: Astro + Cloudflare Workers. Dynamic sitemap, BreadcrumbList schema.

### mahad-nurul-haromain-lin-nisa
- Path: `/home/fantastico/projects/mahad-nurul-haromain-lin-nisa-compro`
- Stack: Astro, Tailwind v4, TypeScript, Lucide. Website pesantren putri.

## SEO Knowledge Base
- Path: `/home/fantastico/Documents/SEO` — SEO Website Builder Skill/SEO OS canonical research/archive base. On 2026-06-30 created active local skill `seo-website-builder` at `/home/fantastico/dotfiles/skills/local/seo-website-builder` and synced via `skill-update` to pi/agents/claude/codex/gemini. Skill uses compact references copied from Documents/SEO; original 100+ SEO OS export remains in Documents for deep reference. Existing skills mined into the playbooks: `seo-local-business`, `shopify-listing`, and `astro-development`. Multi-engine docs cover Google/Bing/Yandex/Pinterest/AI search using official/trusted sources.
- Public standalone SEO skill repo created: `https://github.com/ongkipro/seo-website-builder-skill` (public). Source path: `/home/fantastico/Projects/seo-website-builder-skill`. Dotfiles remain private; public repo contains sanitized `seo-website-builder` Agent Skill only.

## report-petani-next (Next.js 16 SaaS Dashboard, report.petanisejahtera.com)
- Path: `/home/fantastico/projects/report-petani-next`
- Stack: Next.js 16 (App Router), shadcn/ui, Tailwind v4, Recharts, Geist font, Vercel deploy
- Struktur: Dashboard summary `/`, Reports list `/reports`, Monthly report `/reports/[month]`, Plugins `/plugins`, Settings `/settings`
- Data registry di `src/data/index.ts` — tambah laporan baru: copy file data mei-2026.ts, isi, daftarkan di registry
- MonthlyReport component props-based reusable untuk semua bulan
- Guide lengkap di `GUIDE.md`
- Theme: clean white/black, dark mode ready
- 18 source files, TypeScript strict, 0 unused deps

## report-petani-sejahtera (Astro, report.petanisejahtera.com)
- Path: `/home/fantastico/projects/report-petani-sejahtera`
- Stack: Astro, Tailwind v4, shadcn/ui, React islands
- Catatan: Versi awal dashboard. Next.js version di report-petani-next adalah versi production.

## petcue (Petcue.co — Astro + Shopify Storefront)
- Path: `/home/fantastico/projects/petcue`
- Stack: Astro, Tailwind v4, Shopify Storefront API, Cloudflare Workers
- Brand: Petcue.co — premium pet travel gear (teal `#007C78`, mint, amber, charcoal)
- GitHub: `ongkipro/petcue` (private)
- Catatan: Clone dari pixsgo, rebranded untuk niche pet travel gear.

## pixsgo (Pixs&Go — Astro + Shopify Storefront, pixsgo.com)
- Path: `/home/fantastico/projects/pixsgo`
- Stack: Astro, Tailwind v4, Shopify Storefront API, Cloudflare Workers
- Brand: Pixs&Go / "Play & Go" — screen-free toys (coral, warm cream, soft shadows)
- GitHub: `ongkipro/pixsgo` (private)
- 125 products, 9 collections, Judge.me reviews, blog/journal
- Deploy: Cloudflare Workers, custom domain pixsgo.com

## homelook (HOME LOOK — Astro + Shopify Storefront, homelook.shop)
- Path: `/home/fantastico/projects/homelook`
- Stack: Astro, Tailwind v4, Shopify Storefront API, Cloudflare Workers
- Brand: HOME LOOK — premium architectural fittings (pine green, warm sand, muted brass)
- GitHub: `ongkipro/homelook` (private)
- Catatan: Clone dari homeimprovement (RIVA HOME), brand diganti ke HOME LOOK.

### volumecms (macOS dev)
- Path: `~/projects/volumecms`
- Stack: Next.js 16 (App Router) + TS + Tailwind v4 + shadcn (Base UI) + GSAP + Drizzle ORM + PostgreSQL + better-auth. Deploy target Vercel.
- CMS ala WordPress + SaaS dashboard: Posts, Pages, Products (katalog → CTA WhatsApp wa.me), Categories, Tags, Media Library (image/video), Banners, Menu builder, Site Settings, Users. Frontend publik: landing/sales page (hero GSAP), katalog+filter kategori, detail produk+tombol WA, blog, halaman dinamis `/[slug]`, SEO (sitemap/robots/metadata Next), dark mode, floating WhatsApp.
- DB: 16 tabel (auth user/session/account/verification + categories/tags/media/posts/posts_tags/pages/products/products_tags/banners/menus/menu_items/settings). `settings` = key/value JSON (key 'site' → SiteSettings di lib/settings.ts).
- Auth: better-auth email/password, role admin/editor/author. Seed admin: admin@volumecms.test / password123 (via `pnpm db:seed`). createUser hindari signUpEmail (pakai auth.$context.password.hash + insert account) supaya tak menimpa sesi admin.
- Storage adapter lib/storage.ts: STORAGE_DRIVER=local (dev, /public/uploads) / blob (Vercel Blob). Upload POST /api/upload, list GET /api/media.
- Konvensi Base UI (shadcn v4): pakai `render={<Link/>}` BUKAN `asChild`; native `<select>` via NativeSelect (components/admin/form-fields); Switch pakai checked/onCheckedChange bukan register.
- Next 16: proteksi admin di `src/proxy.ts` (konvensi baru, bukan middleware) export fn `proxy`; db client lazy-proxy di db/index.ts biar `next build` tanpa DB tak crash; semua page admin/site `force-dynamic`.
- Pola CRUD: server actions di lib/actions/<entity>.ts ('use server', zod, requireUser/requireAdmin, ensureUniqueSlug, revalidatePath, return {ok, error?, id?}); form client react-hook-form; list pakai shadcn Table + DeleteButton(action.bind).
- Status 3 Juli 2026: kode LENGKAP, `tsc` 0 error, `next build` sukses (30 route). BLOCKER: butuh DATABASE_URL Neon/Vercel Postgres utk `pnpm db:push && pnpm db:seed && pnpm dev`. Belum migrate/seed/run.
- `~/projects/nextpress` = prototipe awal konsep ini (storage JSON), digantikan volumecms.
- DEPLOYED 3 Juli 2026: LIVE di https://volumecms.vercel.app (Vercel, team `ongki-project`/team_oedvGqADXZCN2dKYe6vl0lTg). GitHub: github.com/ongkipro/volumecms (private). DB Neon (Vercel Marketplace integration), Blob store `volumecms-media`. Env prod: DATABASE_URL, BLOB_READ_WRITE_TOKEN, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL, STORAGE_DRIVER=blob.
- GOTCHA deploy Vercel (penting): project di TEAM → deploy `BLOCKED` dgn readyStateReason "Git author <email> must have access to the team". FIX: git commit author email HARUS = email akun Vercel yg jadi member team. Re-author: `git config user.email ongkiardiansyah@gmail.com` + filter-branch re-author + force push + redeploy. (Email git lama `get@ongki.pro` diblok; email Vercel `ongkiardiansyah@gmail.com`.)
- OVERHAUL FRONT-END (4 Juli 2026, sesi terpisah dari admin/T1): Hero beranda **full-bleed bg-image** + cinematic (Ken Burns/parallax GSAP/mask-reveal/grain/scroll-cue, respect reduced-motion) via komponen bersama `HeroMedia` (art-direction mobile `mobileImageUrl` vs desktop `imageUrl`). Homepage de-monotoni: Services panel hairline, Process timeline, Testimoni asimetris, **FAQ dihapus**, CTA minimalist+ornamen; **FAB WhatsApp mengambang dihapus**. **Produk = Shopify-style pasar ID**: galeri kiri sticky, buy-box (rating+harga+Hemat, trust inline, **tanpa qty**, CTA WA pesan berisi nama+harga+link), detail **accordion tertutup borderless** (`<details>`: Deskripsi/Spesifikasi/Cara Memesan&Pengiriman), **mobile sticky order bar**. ProductCard frameless 1:1 + rating deterministik (`lib/rating.ts`, hash slug 4.3–5.0). Blog artikel: reading-progress + share + **cover full-width 3:2** + related. `PageHeader` interior = bg-image **center** cinematic (dari coverImage/`ogImage`; Blog/Katalog dari **Banner** — enum `banner_position` DITAMBAH `blog`+`katalog`, fallback cover konten). Footer **7 ikon sosial** (IG/FB/TikTok/YT/X/Pinterest/Threads). Header: nav desktop pindah **`lg`** (768–1023 hamburger; fix overflow 42px), active/hover **underline animasi**; mobile menu modern (7 sosial + theme toggle). **Breadcrumb 1-baris truncate**. Audit responsif: **0 overflow** 320–1280. **SEO**: `buildMetadata` async → fallback og:image & description ke Settings (featured → settings.ogImage → logo), + siteName + `locale id_ID`; metadata statis blog/katalog → `generateMetadata`. **Sitemap auto** disempurnakan (hormati feature-flag, skip `isHome`, priority/changefreq per tipe, lastmod dari updatedAt); robots +host. De-rounding 2 tier (panel 2xl, card xl). Komponen dipecah: HeroMedia, SocialLinks, StarRating, ProductPrice/Trust/Specs, Accordion, MobileOrderBar, ReadingProgress, ShareButtons. Settings + fields sosial baru (twitter/pinterest/threads) — form admin (T1) perlu input-nya; `gaMeasurementId` ditambah (analytics, T1). CATATAN: kerjaan admin (T1) di working-tree bersama sempat ada TS error WIP (page-form/post-form) — bukan dari front-end.
- GOTCHA: `vercel deploy` CLI hang streaming log di non-TTY → jalankan `nohup ... &` (background), pantau state via REST API v6/deployments (bukan `vercel ls` yg nampilin UNKNOWN keliru). Cek readyState asli: GET api.vercel.com/v13/deployments/<id>.
- GOTCHA: `drizzle-kit push` butuh TTY → pakai `drizzle-kit migrate` (non-interaktif) utk otomasi. DDL/seed pakai koneksi UNPOOLED (DATABASE_URL_UNPOOLED), runtime pakai pooled.
- ssoProtection Vercel default `all_except_custom_domains` (URL preview kena wall SSO 302) — dimatikan via PATCH api v9/projects {ssoProtection:null}.
- UI/UX polish (3 Juli 2026): Rich text editor Tiptap v3 (StarterKit sudah termasuk link+underline; tambah Image+Placeholder) di post/page/product form via components/admin/rich-text-editor.tsx; CSS placeholder `.tiptap p.is-editor-empty` di globals.css. ImageField kini punya prop `aspect` (video/square/wide) — logo=wide, favicon=square di settings. Reveal (site) diberi failsafe gsap.delayedCall(4s) biar konten tak pernah ketutup permanen kalau ScrollTrigger gagal + reduced-motion eksplisit. Demo images Unsplash via src/db/backfill-images.ts + sudah difold ke seed.ts (map PRODUCT_IMG/POST_IMG/PAGE_IMG by-slug). GOTCHA slug: slugFromString ubah `&`→"and" (mis. "Banner Manager & Media" → "...manager-and-media"). Verifikasi UI pakai Playwright chromium (di scratchpad) + reducedMotion:'reduce' untuk lihat layout tanpa animasi.
- Frontend compro redesign (3 Juli 2026): design system di globals.css (.text-gradient, .bg-grid, .bg-dots, .glow, .card-glass, .animate-marquee/.marquee-mask). Primitive components/site/section.tsx (Section/SectionHeader/Eyebrow). Home (site)/page.tsx sekarang full company-profile: Hero premium (dual CTA, trust row, floating cards, GSAP intro+float), Partners (marquee), Services (6 kartu), WhyUs (2-col + panel dekoratif CSS), Stats (counter GSAP), Process (4 langkah), Testimonials (3 kartu), Faq (accordion useState), CTA (band gelap). SiteHeader scroll-aware. ProductCard + footer di-premium-kan. getFeaturedProducts kini isi grid dgn produk published lain kalau featured<limit. Semua pakai semantic token → dark-mode aman. Verifikasi via Playwright (reducedMotion untuk lihat layout, colorScheme dark untuk dark mode).
- **v1.0.0 RILIS STABIL (4 Juli 2026, sesi admin)** — LIVE di volumecms.vercel.app, `package.json`+`APP_VERSION`=1.0.0 (tampil di sidebar admin), label grup sidebar "Umum" dihapus. **RBAC 2 peran fungsional**: `admin` (manajer global, akses penuh) + `publisher` (konten saja: posts/produk/pages/banner/menu/kategori/tag/media — TANPA Pengaturan/Users); enum role `admin/editor/author/publisher` (editor/author tampil "Publisher"); **maks 5 user** (`MAX_USERS` di `src/lib/constants.ts`); Users dikelola DI DALAM Pengaturan → seksi "Pengguna" (`/admin/users` redirect ke settings); guard `requireAdmin`. **Status & Storage**: halaman `/admin/status` (grup sidebar "Sistem", admin-only) = bar pemakaian media vs **kuota 128 MB** (`MAX_STORAGE_BYTES`) + dot warna hijau/amber/merah; ditegakkan di `/api/upload` (413 bila lewat, per-file tetap 2 MB); helper `src/lib/storage-usage.ts` `getStorageUsage()`; komponen `StorageCard`; widget storage di dashboard.
- **v1.0.0 komponen & list ala WordPress**: `DataTable` (components/admin/data-table.tsx) tab filter status+count (`STATUS_LABELS`/`STATUS_ORDER` di status-badge.tsx; **`scheduled` dihapus dari UI** tapi masih di pgEnum `content_status`) + `meta.className` per-kolom untuk sembunyikan kolom di mobile (`hidden sm:table-cell`/`md:table-cell`); judul 2-baris `TitleCell` (di ui.tsx, `line-clamp-2` + **`whitespace-normal`** — WAJIB karena `TableCell` shadcn punya `whitespace-nowrap`); aksi baris `RowActions`/`ICON_BTN` (row-actions.tsx) = ikon **tanpa background**, adaptif (muted-foreground), warna saat hover (lihat=primary/edit=foreground/hapus=destructive); tanggal+jam **WIB** (`formatDate`+`formatTime`+`formatDateTime` di lib/utils, TZ Asia/Jakarta, **tanpa kata "pukul"**). Reusable admin lain: **`TwoColumn`** (ui.tsx, responsif via **container query `@xl`** bukan viewport — pakai `@container` di parent), `SidebarClock` (jam WIB live). **Favicon**: `app/icon.svg` + **`app/favicon.ico`** (kubus multi-size 16/32/48, di-generate via `sharp` + wrapper ICO manual) + `app/apple-icon.png` — perlu favicon.ico karena `/favicon.ico` 404 bikin browser pakai ikon Vercel/cache lama.
- **v1.0.0 GOTCHA (penting)**: (1) **Auto-deploy dari `git push` TIDAK jalan** (repo terhubung ke Vercel tapi tak trigger) → deploy manual `vercel --prod --yes`; ini deploy **WORKING TREE** (bukan git HEAD) jadi WIP frontend uncommitted IKUT tayang & git bisa divergen dari production. (2) **dev & prod share DB Neon yang SAMA** → perubahan data/DDL langsung live di prod (hati-hati; tambah enum via raw SQL `ALTER TYPE`). (3) Query DB dari script: driver = **postgres.js** (bukan neon-serverless); jalankan `node --env-file=.env.local dbq.cjs` dari root project (require('postgres')). (4) **Mobile admin responsif**: input 16px (`text-base md:text-sm`, termasuk NativeSelect) cegah zoom iOS; overflow editor diperbaiki dgn `min-w-0` pada crumb SEO (`truncate` di flex butuh ancestor `min-w-0`) + kolom utama editor. (5) Verifikasi mobile via Playwright 390px: cek `document.documentElement.scrollWidth == innerWidth` (no overflow). Docs lengkap: README + docs/{PRD,FEATURES,ARCHITECTURE,AGENTS}.md + CHANGELOG (semua 1.0.0).
- Frontend v2 presisi (3 Juli 2026): komponen struktur shared di components/site — Container (max-w-6xl px-4 sm:px-6, dipakai Section & semua halaman), PageHeader (hero band interior: eyebrow/title/subtitle/breadcrumb + bg-grid/glow), Breadcrumb, ArticleCard (kartu blog reusable). Semua halaman interior (katalog, katalog/[slug], blog, blog/[slug], [slug]) dirombak pakai komponen ini → antar-halaman konsisten. Hero home jadi FULL-BLEED: image absolute inset-y-0 right-0 w-1/2 (lg) dengan gradient fade `from-background via-background/30 to-transparent`, mobile fallback image di bawah; headline pakai settings.aboutHeadline (copy compro, bukan judul banner promo). Section spacing py-16 md:py-24. Product detail punya "Produk Lainnya" + trust row; blog detail punya "menit baca" + cover max-w-4xl + prose max-w-3xl.

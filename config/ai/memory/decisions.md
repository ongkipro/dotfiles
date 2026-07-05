# Decision Memory
> Durable decisions and working assumptions. Update when a decision changes. Do not treat uncertain notes as final facts.

## Development stack decisions

### Linux-first workflow
- Status: active preference.
- Decision: prefer Ubuntu/Linux, terminal-first workflow, tmux, Helix, mise/npm/pipx, and CLI tools.
- Reason: better fit for AI terminal, server/dev workflow, speed, reproducibility, and reduced GUI dependency.
- Avoid: suggesting GUI-heavy workflow as default unless user asks.

### Public frontend direction
- Status: active preference.
- Decision: Astro + Tailwind is preferred for public frontend, SEO blog, content site, affiliate portal, and headless storefront when static/SEO speed matters.
- Reason: performance, SEO, simplicity, static-first architecture, Cloudflare fit.
- Tradeoff: less ideal for very interactive admin dashboards.

### Admin/client dashboard direction
- Status: active preference.
- Decision: Next.js + React + TypeScript + Tailwind + shadcn/ui is preferred for admin panel and client dashboard when interaction complexity is high.
- Reason: component ecosystem, dashboard patterns, stateful UI, auth/admin flows.
- Tradeoff: heavier than Astro for public SEO pages.

### Shopify development direction
- Status: active preference.
- Decision: use Shopify CLI/theme workflow when working with Shopify themes, but user prefers local-dev clarity similar to Astro.
- Reason: Shopify preview/sync can feel less precise than modern Astro dev flow.
- AI should provide concrete commands, preview logic, file mapping, and safe sync instructions.

## Business decisions / preferences

### Tools directory vs broad portal
- Status: prior chosen direction for software/tools affiliate.
- Decision: tools directory/comparison/review approach is preferred over broad unfocused portal/search-engine approach.
- Reason: clearer monetization, easier topical authority, better buyer intent.

### Germany affiliate direction
- Status: active strategic focus.
- Decision: Germany-first affiliate content is a serious track, especially SaaS/tools, productivity, AI office, and Amazon DE office/home-office products.
- Avoid: low-trust ClickBank-style claims, fake income, weird spiritual/magic-cure positioning for German audience.

### KIHeute content positioning
- Status: active decision.
- Decision: KIHeute is for practical AI in office/business workflows, not AI news, AI art, crypto, programming, gaming, student content, or general AI trend commentary.
- Reason: clearer audience pain, stronger affiliate fit, less trend dependency.

### Build systems, not one-offs
- Status: durable preference.
- Decision: favor repeatable systems, SOPs, prompts, AI skills, workflow automation, and reusable assets.
- Reason: user frequently delegates to interns/admins/AI agents and wants compounding leverage.

## Memory governance decisions
- Do not store credentials, API keys, auth tokens, private keys, or raw secrets.
- Do not store family/children biodata in GitHub memory unless user explicitly confirms exact details to store.
- Do not treat conflicting Human Design/personality readings as final facts without verification.
- Prefer separating facts, assumptions, opinions, and unknowns when uncertainty matters.

## Product / deployment decisions

### VolumCMS multi-client deployment (model "CMS jasa website")
- Status: active decision (5 Juli 2026). Berlaku untuk VolumCMS dan produk CMS compro/katalog sejenis.
- Konteks: dijual sebagai JASA WEBSITE (bikin situs klien), BUKAN SaaS multi-tenant. Domain diurus manual sendiri. Pixel/analytics belum perlu.
- Keputusan inti: **1 GitHub repo → banyak Vercel Project (semua import repo yang sama) → tiap klien punya 1 Neon DB + 1 Blob store + env sendiri.** JANGAN 1 repo/1 Vercel per klien.
  - Yang beda per klien = ENV saja: `DATABASE_URL` (Neon), `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_APP_URL` (domain), `BETTER_AUTH_SECRET`/`URL`. Kode 100% identik.
  - Bisa karena semua konten & branding VolumCMS ada di DB (tabel `settings` + posts/products/pages), bukan di kode.
- Deploy coupling: semua Vercel klien menarik dari SATU branch → 1 push = SEMUA klien re-deploy (1 bug bisa kena semua). Mitigasi WAJIB: klien track branch stabil **`release`**; ngoding di `main`/feature, merge ke `release` hanya setelah teruji.
- Skala: cocok belasan–puluhan klien. Multi-tenant beneran (1 DB + `tenant_id` + 1 Vercel) = overkill & risiko bocor antar klien; baru worth kalau ratusan klien.
- UI/UX "beda per klien" lewat SISTEM, bukan kode terpisah (analogi WordPress: 1 software, beda tema+warna+konten). 4 level: (1) branding — logo/`primaryColor` token/foto/konten dari DB (SUDAH ada; ganti 1 warna → seluruh situs ikut, nol coding); (2) theme tokens — font/radius/densitas (tambah field settings); (3) template/layout preset A/B/C (pilih via settings, semua preset ada di kode); (4) custom 100% dari nol = keluar sistem, hindari.
- Gap yang harus disiapkan sebelum jual: (a) seed "fresh install" minimal (1 admin + settings kosong, bukan konten demo PT Volume) atau wizard setup; (b) migration-runner yang loop semua `DATABASE_URL` klien saat schema berubah; (c) white-label literal ("Dibuat dengan VolumCMS" di footer + favicon `icon.svg`) jadi settings-driven / opsi sembunyikan credit.
- Provisioning klien baru (~5–10 mnt, bisa di-script via Vercel + Neon API): buat Neon DB + Blob → buat Vercel project (import repo) → isi env → `drizzle-kit migrate` → seed admin → arahkan domain.

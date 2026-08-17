---
name: dealerhinoofficial-project
description: "Dealer Hino landing site — Astro 6 + Cloudflare Workers, deploy flow, GTM via .env"
metadata: 
  node_type: memory
  type: project
  originSessionId: a4eb6aa8-a153-40d8-9ed9-19dd6de089ea
---

`dealerhinoofficial` (repo ongkipro/dealerhinoofficial, private) = situs dealer Hino Jawa Timur (sales Elgin Marchlouis). Clone lokal di `~/projects/dealerhinoofficial`.

- **Stack:** Astro `^6.4.2` + Tailwind v4 (`@tailwindcss/vite`), output static. **251 halaman** (series 300/500/700 + varian produk + provinsi/kota Indonesia). Tailwind v4 perlu `@config "../../tailwind.config.mjs";` di global.css.
- **Hosting:** Cloudflare Workers static assets (`wrangler.toml` → `[assets] directory=./dist`). Domain `dealerhinoofficial.com` (www→apex), workers.dev = `dealerhinoofficial.ongki.workers.dev`.
- **Deploy:** `npm run cf:deploy` (= `astro build && wrangler deploy`). Push GitHub ke `main` manual (bukan auto-deploy). Setelah deploy, edge cache apex bisa serve versi lama beberapa menit — redeploy/tunggu; verifikasi via workers.dev `?x=$RANDOM`.
- **GTM:** `GTM-W8TLMGCH` di-inject di `BaseLayout.astro`, di-gate `import.meta.env.PUBLIC_GTM_ID`. `.env` (gitignored) harus berisi `PUBLIC_GTM_ID` + `SITE_URL=https://dealerhinoofficial.com`, kalau tidak GTM hilang dari build. GTM pakai lazy-load on-interaction + CTA click-tracking (click_call/whatsapp/email ke dataLayer).
- **Data lokasi:** `src/data/location-pages.ts` — hanya kota dengan dealer nyata (`generatedFromDealers`) yang ke-generate; entri `surabaya`/`sidoarjo` di rawLocationPages = data mati (dilayani cabang `kletek-sidoarjo`). Alias/redirect kota lama di `src/data/slug-aliases.ts` + `public/_redirects`.
- Sitemap (`src/pages/sitemap.xml.ts`) = 234 URL (kecualikan 16 redirect-source + 404). SEO higienis: semua halaman ada title/desc/canonical/h1.

Konvensi repo yang berlaku di sini: [[no-ai-commit-trailer]], [[title-separator-convention]], [[folder-convention-dev]].

# Memori: Projects — fakta per-project
> Bagian dari memori bersama. Tambah/aktualkan saat kerja di sebuah project.
> Format: `## <nama project>` lalu bullet fakta penting (path, stack, catatan, jangan-lupa).

## dotfiles
- `~/dotfiles` → backup semua config, repo private `github.com/ongkipro/dotfiles`.
- `install.sh` untuk setup device baru (idempotent).
- `bin/dotsync` = helper semi-auto sync lintas Linux/macOS untuk review → commit → push opsional pada shared memory/config.

## pixsgo
- path: `/home/fantastico/Projects/pixsgo`
- stack: Astro, TailwindCSS, Shopify Storefront API, Cloudflare Workers / Wrangler
- catatan: Rebranded to "Play & Go" (Toys & Hobbies). Visual guidelines are Playful, Minimalist, Modern, and Fun. Avoid retro arcade, console hacking, or brutalist boxes. Ensure senior accessibility (font >= 16px, labels on icons).
- Rethemed all pages and layout components (Header, Footer, 404, FAQ, cart, filter sidebar) to sand borders (`border-border`) and soft rounded elements, eliminating all retro slate/gray borders and brutalist shadows.
- Updated `getStaticPaths` in `src/pages/products/[handle].astro` to combine live Shopify handles with mock fallback handles, resolving the isolated scope build constraint in Astro and preventing 404 errors on internal fallback links.
- Rethemed and modernized the homepage categories grid (`src/components/home/Categories.astro`) to render collections dynamically from Shopify, utilizing curated badge mappings (emojis, warm colors, short labels), and added desktop & mobile "View All Collections" call-to-actions.
- Replaced all raw inline SVGs on the homepage sections (Hero sliders, category icons, features, verified buyer tags) with `@lucide/astro` utility components (Activity, ShieldCheck, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight).
- Confirmed that `@lucide/astro` v1.x has dropped brand/social icons (Facebook, Instagram, GitHub) to focus on utility icons. Handled brand links using raw inline SVGs in `Footer.astro` to ensure successful compilation.
- Standardized all contact form borders (`src/pages/contact.astro`), dynamic cart shimmers (`src/components/Header.astro`), and product detail thumbnail outlines (`src/pages/products/[handle].astro`) to design system border tokens (`border-border`).
- Locked the homepage categories grid (`src/components/home/Categories.astro`) and collection hero banners (`src/pages/collections/[handle].astro`) strictly to a `3:2` aspect ratio (landscape), fixing the `静态src` typo.

## aussie-malaysia (Astro 6 + Cloudflare Workers, aussiesawit.my)
- Deploy: Cloudflare Workers via `@astrojs/cloudflare` (adapter hanya saat build; `astro dev` pakai adapter `undefined` → tak ada `locals.runtime`).
- Env API Scalev/Meta: production via `locals.runtime.env` (fallback `process.env` nodejs_compat). DEV tak ada `.env` auto → export shell: `SCALEV_API_KEY=... SCALEV_STORE_UNIQUE_ID=... npm run dev`. JANGAN pakai `import.meta.env` dinamis (crash di Vite dev module-runner).
- API `src/pages/api/submit-lead.ts` POST → buat order Scalev v2 (`/v2/order`) + Meta CAPI Purchase. Uji curl: UA mengandung "curl" mem-bypass submit_token. Tanpa creds → `STORE_CONFIG_MISSING`; creds invalid → `UPSTREAM_ERROR` 401 (pipa terbukti tersambung).
- Rate limiter `ORDER_SUBMIT_LIMITER` dideklarasi di `wrangler.jsonc` (`ratelimits`, limit 8/60s), diakses via `locals.runtime.env` di `src/middleware.ts` (bukan globalThis).
- Script live ada di `public/scripts/` (di-load via `/scripts/...`). Duplikat stale di `src/scripts/` sudah dihapus — jangan dibuat lagi.

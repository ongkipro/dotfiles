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

### social-dashboard (macOS dev)
- Path: `~/Projects/social-dashboard`
- Stack: Next.js 16 + shadcn/ui v4 (Base UI) + Tailwind v4 + Recharts + Minimax AI + better-auth + PostgreSQL 16 + Drizzle ORM.
- Deskripsi: SaaS dashboard social media automation — posting ke Threads, Instagram, Facebook, Pinterest, Twitter.
- DB: 8 tabel (user, session, account, verification, social_account, post, template, generated_content) di `postflow` DB.
- 19 route: auth pages, dashboard analytics, accounts CRUD, AI content generator, calendar real-data, posts CRUD, settings, OAuth callbacks, cron API.
- Auth: better-auth v1.6 — email/password signup/login, forgot/reset password, email verification ready.
- Platform API clients: Meta (FB/IG/Threads), Twitter v2, Pinterest v5 — OAuth + publishing functions.
- Server Actions: 15 actions (CRUD posts/accounts/templates, AI content save, analytics, scheduled posting, password reset).
- Status: Production-ready MVP. 1 user test (ongki@postflow.dev). Daftar di /register.
- Docs: `~/Documents/ai-artifacts/social-dashboard/` (PRD, API).

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

# Memori: Projects — fakta per-project
> Bagian dari memori bersama. Tambah/aktualkan saat kerja di sebuah project.
> Format: `## <nama project>` lalu bullet fakta penting (path, stack, catatan).

## Konvensi Baru (2 Juli 2026)

- **Semua project development → `~/Projects/<nama-project>/`**
- Source code, config, node_modules, .git semua di dalam folder project.
- Dokumentasi (PRD, UML, konten, research) → `~/Documents/ai-artifacts/<kategori>/`.
- Memori AI → `~/Documents/memori ai/`.
- Mesin utama: Linux (`/home/fantastico/`). macOS (`/Users/feriromansyah/`) = device kedua untuk mobile/sync.

## macOS — Projects Aktif

### dotfiles
- `~/dotfiles` → backup semua config, repo private `github.com/ongkipro/dotfiles`.
- `install.sh` untuk setup device baru (idempotent).
- `bin/dotsync` = helper semi-auto sync lintas Linux/macOS untuk review → commit → push opsional pada shared memory/config.
- `install-macos.sh` = bootstrap ringan macOS untuk shared memory, skill linking, dan workflow sync dasar.
- tmux stack di dotfiles memakai prefix `Ctrl+a`, theme plain-font-friendly Catppuccin-inspired, dan plugin: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Setup di-handle `bin/tmux-setup`; helper battery lintas macOS/Linux ada di `bin/tmux-battery`.
- GSAP skills resmi dari `greensock/gsap-skills` telah di-vendor ke `~/dotfiles/skills/local/` sebagai: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`, lalu disebarkan lintas CLI via `skill-update`.

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

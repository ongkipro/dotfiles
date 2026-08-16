# Memory: Sites, commerce projects, reports, and repository history

> Project-specific advisory facts split from [projects.md](projects.md). Load this file only for a named site or repository below; each repository remains authoritative.

## Linux — Projects (reference from the main machine)


### pesantren-tholabie (pesantrentholabie.com)
- Repo: `github.com/ongkipro/pesantren-tholabie-compro` (not yet cloned on `cuan`)
- Stack: Astro, TailwindCSS, Lucide Icons, TypeScript.
- Pondok Pesantren THOLABIE CIBS Malang. Makkah & Madinah Theme (green, black, gold).
- 6 pages: Beranda, Tentang, Beasiswa, Asrama, Kurikulum, Kontak & FAQ.

### landing-page (Mac, `~/Projects/landing-page`)
- Stack: Next.js 16 + React 19 + Drizzle ORM + Cloudflare Worker (`@cloudflare/vite-plugin`, runner `vinext`). `package.json` name = `site-creator-vinext-starter`. Scripts: `dev`/`build`/`test`/`lint`/`db:generate`.
- 🚨 **ZERO COMMITS and NO REMOTE** (verified 2026-07-20: `git log` → "does not have any commits yet", `git remote -v` empty, 19 untracked entries). All the work here **only exists on this Mac disk** — lost if the disk dies or the folder is deleted.
- Actions not yet done: `git add` + first commit, create repo `ongkipro/<name>`, `git remote add origin` + push. Until that's done, don't run anything destructive in this folder.

### AUSSIE Sawit Malaysia → see [[aussie-sawit-malaysia]] in project-memory
- COD e-commerce for palm care MY (`aussiesawit.my`). Astro 6 + Tailwind 4 + Cloudflare Workers/D1/R2. Active repo `ongkipro/aussiemalaysia` (folder `~/Projects/aussiemalaysia`), order backend = **its own D1, NO Scalev** (v3 decision, 2026-07-08). Fulfillment = EasyParcel. Latest status in the repo `STATUS.md` — don't trust the status in memory.
- ⚠️ The old entry/repo `aussie-malaysia` + the note "Scalev + Meta CAPI" are **STALE and WRONG** — two different folders (see "Local repo traps" below).

### petanisejahtera → see [[petanisejahtera]] in project-memory
- COD ads funnel LP (`petanisejahtera.com`). Astro v6 SSR + Cloudflare Workers, order backend = Scalev API. Repo `ongkipro/petanisejahtera`, cloned `~/Projects/petanisejahtera` (since 2026-07-18). `.env` NOT in the secrets archive. Read `DEV_NOTES.md` + `GEOFORM_HYBRID_MIDDLE_ENV.md` in the repo first.

### mahad-nurul-haromain-lin-nisa
- Repo: `github.com/ongkipro/mahad-nurul-haromain-lin-nisa-compro` (not yet cloned on `cuan`)
- Stack: Astro, Tailwind v4, TypeScript, Lucide. Girls' pesantren website.

## SEO Knowledge Base
- ⚠️ The old SEO research archive (`Documents/SEO`) DOES NOT EXIST on any machine now. The `seo-website-builder` skill stands on its own via its `references/`. On 2026-06-30 created active local skill `seo-website-builder` at `~/dotfiles/skills/local/seo-website-builder` and synced via `skill-update` to pi/agents/claude/codex/gemini. Skill uses compact references copied from Documents/SEO; original 100+ SEO OS export remains in Documents for deep reference. Existing skills mined into the playbooks: `seo-local-business`, `shopify-listing`, and `astro-development`. Multi-engine docs cover Google/Bing/Yandex/Pinterest/AI search using official/trusted sources.
- Public standalone SEO skill repo created: `https://github.com/ongkipro/seo-website-builder-skill` (public). Dotfiles remain private; public repo contains sanitized `seo-website-builder` Agent Skill only.

## report-petani-next (Next.js 16 SaaS Dashboard, report.petanisejahtera.com)
- Repo `github.com/ongkipro/report-petani-next` (not yet cloned on Mac). Next.js 16 (App Router) + shadcn/ui + Tailwind v4 + Recharts, deploy Vercel. **Production version** (report-petani-sejahtera = the initial Astro version).
- Pattern: a data registry in `src/data/index.ts` (add a report: copy `mei-2026.ts`, fill it, register it in the registry); `MonthlyReport` is reusable props-based for all months. Full guide in `GUIDE.md`.

## report-petani-sejahtera (Astro, report.petanisejahtera.com)
- Repo: `github.com/ongkipro/report-petani-sejahtera` (not yet cloned on `cuan`)
- Stack: Astro, Tailwind v4, shadcn/ui, React islands
- Note: The initial dashboard version. The Next.js version in report-petani-next is the production version.

## petcue (Petcue.co — Astro + Shopify Storefront)
- Repo `github.com/ongkipro/petcue` (private, not yet cloned on Mac). Astro + Tailwind v4 + Shopify Storefront API + Cloudflare Workers.
- Brand: premium pet travel gear (teal `#007C78`, mint, amber, charcoal). Cloned from `pixsgo`, rebranded for the pet travel niche.

## pixsgo (Pixs&Go — Astro + Shopify Storefront, pixsgo.com)
- Repo `github.com/ongkipro/pixsgo` (private, not yet cloned on Mac). Astro + Tailwind v4 + Shopify Storefront API + Cloudflare Workers; deploy CF Workers domain pixsgo.com.
- Brand: Pixs&Go / "Play & Go" — screen-free toys (coral, warm cream). Playful, minimalist; senior accessibility (font ≥16px). 125 products, 9 collections, Judge.me reviews, blog/journal.

## tradecar (TRADE CAR — Astro + Shopify Storefront, tradecar.shop)
- Repo `github.com/ongkipro/tradecar` is private and is **not checked out on this Mac** (verified 2026-07-29). Clone before use.
- Stack from the repository `package.json`: Astro 7, Tailwind CSS 4, Shopify Storefront API, and Cloudflare Workers. Brand: premium architectural fittings with pine green, warm sand, and muted brass.

## TokoΦ → see [[tokophi]] in project-memory
- Indonesia commerce SaaS (`tokophi.com`), monorepo `ongkipro/tokophi`, Next.js 16 + Astro + Drizzle + PostgreSQL 16 + RLS/RBAC. Old name `indostore` (dormant repo, don't use). **No clone on Mac** — main dev on Linux, `git pull` first. Business gotchas (KiriminAja/AutoLaris white-label, e-wallet down `rc=07`, `KIRIMINAJA_ENV=sandbox`, multi-agent-one-worktree) → **`[[tokophi]]`**. Session history in the repo `CHANGELOG.md` + `specs/docs/`.

## kamus (almanac / second memory) → see [[kamus-almanak]] in project-memory
- `kamus.ongki.pro` (repo `ongkipro/kamus`, private, anonymous HTTP 401). Astro renders root Markdown into a dashboard. Cloned on Mac at `~/Projects/kamus` on 2026-08-04. Often the "memory" the user means (not `~/.config/ai/memory` or CLI memory); the systems can desync. AGENTS.md contract, security/history warning, rename-project trap, wikilink status, and current deployment status → **`[[kamus-almanak]]`**.

## fiverr-clone (macOS dev — GigFlow freelance marketplace)
- Path: `~/Projects/fiverr-clone` → private repo `github.com/ongkipro/fiverr-clone` (created 2026-07-11; **the remote was just created 2026-07-14** — before that 33 commits lived only on one machine).
- Stack: Next.js 16 + React 19 + Tailwind v4 + shadcn/ui + Better-Auth + Drizzle ORM + Stripe.
- UI/UX documentation: `~/Documents/UIUX/fiverr-clone/` (because it's still a prototype)
- ⚠️ **`.venv` (playwright driver 114 MB) once got committed** → GitHub rejected the push (100 MB/file limit). Already removed from history + added to `.gitignore`. Don't put a Python virtualenv inside this Next.js repo again.

## Local repo traps that have been sorted out (2026-07-14, Mac)
Before this, **4 projects had no backup anywhere**. All have been pushed. Facts not readable from the code:
- **`~/Projects/volumecms-tholabie-fe` is a GIT WORKTREE** of `volumecms` (branch `tholabie-frontend`), not a separate project. Its `.git` is a **file**, not a directory — a `-d .git` check will say "not a git repo" and that is WRONG. Don't `git init` there. Its branch is now in the `volumecms` remote.
- **`~/Projects/babyfits` = a rebrand of `homelook`**, but its remote used to still point at `homelook.git` → pushing = overwriting the homelook repo's contents. It now has its own repo (`ongkipro/babyfits`); the old remote is kept as `homelook-upstream`.
- **`aussiemalaysia` (active, Astro+CF+D1) ≠ `aussie-malaysia` (old repo)** — two folders, two projects. The active one is now the repo `ongkipro/aussiemalaysia`.
- Document archive: 278 `.md` files from all projects → `~/Documents/work/notes/projects-md-archive-2026-07-14/`.

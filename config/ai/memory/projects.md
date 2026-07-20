# Memory: Projects — per-project facts
> Part of shared memory. Add/update when working on a project.
> Format: `## <project name>` then bullets of important facts (path, stack, notes).

## ⚠️ READ FIRST — about PATHS (paths are PER-DEVICE, check disk first)

- `/home/fantastico/...` → that user **DOES NOT EXIST** on any machine now. That's an OLD Linux machine. Ignore it.
- **On `cuan` (Linux, user `ongki`), as of 2026-07-14: ONLY `~/Projects/kamus` is checked out** (repo `ongkipro/kamus`, branch `main`) — verified with `ls ~/Projects`. Other projects not yet cloned; the `~/Projects/<other>` paths in this file **don't apply there**. (The note from Mac saying `~/Projects/` on cuan is EMPTY is **wrong** — Mac guessed about a machine that isn't its own. Don't write another machine's disk facts without checking them.)
- **On Mac (`ongkis-MacBook-Air`): the contents of `~/Projects/` CHANGE — don't memorize the list, run `ls ~/Projects`.** History: 2026-07-14 deliberately left only `volumform` (cleanup, the rest confirmed intact on GitHub); since then it has grown again (as of 2026-07-20: `landing-page`, `petanisejahtera`, `volumform`, `volumup`). A project that does NOT appear in `ls` = not yet cloned → `git clone` first.
  - The gitignored credentials (9 `.env` + dev sqlite) were secured to `~/Documents/work/secrets/projects-env-2026-07-14/` (mode 700). **After cloning, copy the `.env` back from there** — GitHub does not store them.
  - The `.md` docs of all projects were archived to `~/Documents/work/notes/projects-md-archive-2026-07-14/`.

**The source of truth for a project = its GitHub repo** (`github.com/ongkipro/<name>`). When memory and disk conflict → **disk wins**, then fix the memory.
Want to work on a project? `git clone` it first into **`~/Projects/<name>/`** (the official convention), then start. Check facts, don't guess: `ls ~/Projects`.

## Folder convention

- **Source code → `~/Projects/<project-name>/`** (everything inside: config, node_modules, .git).
- AI output (PRD, research, content, notes) → `~/Documents/work/{prd,research,content,notes}/`.
- AI memory → **`~/.config/ai/memory/`** (symlink → dotfiles). Old notes mentioning `~/Documents/memori ai/` or `~/dotfiles/memori-ai/` are **WRONG** — neither exists.
- Main machine: Linux. macOS = secondary device for mobile/sync.

## macOS — Active Projects

### dotfiles
- `~/dotfiles` → backup of all config, private repo `github.com/ongkipro/dotfiles`.
- `install.sh` for new-device setup (idempotent).
- `bin/dotsync` = a semi-auto helper to sync across Linux/macOS for review → commit → optional push of shared memory/config.
- `install-macos.sh` = lightweight macOS bootstrap for shared memory, skill linking, and basic workflow sync.
- The tmux stack in dotfiles uses prefix `Ctrl+a`, a plain-font-friendly Catppuccin-inspired theme, and plugins: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Setup is handled by `bin/tmux-setup`; the battery helper cross-macOS/Linux is in `bin/tmux-battery`.
- Official GSAP skills from `greensock/gsap-skills` have been vendored into `~/dotfiles/skills/local/` as: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`, then distributed across CLIs via `skill-update`.

> Note: the old repo/project `social-dashboard` has been DELETED (GitHub + fully replaced
> by `social-autopilot` on 3 July 2026). New GitHub repo: `github.com/ongkipro/social-autopilot` (private).

### social-autopilot (macOS dev) — brand: **Volum**
- Path `~/Projects/social-autopilot` (repo `ongkipro/social-autopilot` private; PRODUCT/brand = **Volum** — "Sosmed auto by AI", tagline "Turn up your social presence."). Rebuilt from scratch from `social-dashboard` (3 July 2026): autopilot-first, without Twitter (only FB/IG/Threads/Pinterest). Demo login `demo@volum.app` / `password123`.
- Stack: Next.js 16 (App Router, Turbopack) + React 19 + shadcn/ui + Tailwind v4 + better-auth + PostgreSQL 16 + Drizzle. Local Postgres Homebrew `postgresql@16`, DB `social_autopilot`, dev :3000. Autopilot engine `src/lib/autopilot/engine.ts` `runTick()` (fire due autopilots + publish due posts) via `/api/cron` (Bearer CRON_SECRET) or `pnpm autopilot:tick`; demo accounts → publishing is simulated.
- **AI through 9router** (`src/lib/ai/ninerouter.ts`), model via env. The gotcha that saved us: text & image have a **fallback chain** because the remote tunnel (Cloudflare quick-tunnel) is **often 530/down** — `NINEROUTER_*_FALLBACK_URL` + a local/Pollinations fallback. **Text model = `cx/gpt-5.4`** (user asked for GPT 5.4, NOT 5.5). **CAVEAT: Gemini/OpenAI return base64 (data URI)** — fine for preview, BUT real IG/Pinterest publishing needs a public URL → image hosting (R2/Supabase) needed later.
- Security-hardened (IDOR cross-tenant scope-by-userId, cron Bearer CRON_SECRET, atomic-claim anti double-publish, OAuth CSRF + state-parse `meta:instagram` colon) — there are regression tests; details in the code.
- Status: the pipeline is PROVEN working locally (generate AI+image → auto-publish demo → job log). Not deployed yet; OAuth to real social accounts not yet tested (needs a Meta/Threads/Pinterest app + review). Fill credentials in `.env.local` to test real OAuth; deploy target Vercel + Neon + Vercel Cron.


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

## homelook (HOME LOOK — Astro + Shopify Storefront, homelook.shop)
- Repo `github.com/ongkipro/homelook` (private, not yet cloned on Mac). Astro + Tailwind v4 + Shopify Storefront API + Cloudflare Workers.
- Brand: HOME LOOK — premium architectural fittings (pine green, warm sand, muted brass). Cloned from homeimprovement (RIVA HOME). (Rebrand related to `babyfits` → see "Local repo traps" below.)

### volumecms (macOS dev) — multi-tenant CMS PLATFORM
> Repo `github.com/ongkipro/volumecms` (private) is **NOT cloned on Mac** (`ls ~/Projects` doesn't have it) → this memory is the only local copy of the business/architecture context. Progress & component details can be reconstructed from the repo (README + docs/{PRD,FEATURES,ARCHITECTURE,AGENTS}.md + CHANGELOG); here only the decisions & gotchas that are NOT readable from the code.
- Path (if cloned) `~/Projects/volumecms` (**capital P** — case-sensitive on Linux). Stack: Next.js 16 (App Router) + TS + Tailwind v4 + shadcn (Base UI) + GSAP + Drizzle + PostgreSQL + better-auth. Deploy Vercel.
- **Product:** a WordPress-style CMS + SaaS dashboard (Posts/Pages/Products catalog→CTA WhatsApp, Categories/Tags/Media/Banners/Menu/Settings/Users) + a public company-profile frontend (GSAP hero, catalog+filter, product detail+WA, blog, dynamic `/[slug]`, SEO sitemap/robots/metadata, dark mode).
- **Big decision: become a multi-tenant PLATFORM — 1 repo → many Vercel** (different content via each DB, different skin). Skin architecture in `src/themes/` (interface `SiteTheme` + `registry.ts` `getActiveTheme()`): route `(site)/*` = data + metadata + JSON-LD (shared SEO), skin = presentation. Skins: `standard` + `madinah` (Islamic). Skin selector: env `NEXT_PUBLIC_SITE_THEME` (deploy-time per Vercel, wins) → fallback DB `settings.themeSkin`. **Skin is scoped to the `(site)/layout` wrapper → admin is always NEUTRAL** regardless of skin. Admin `/admin/theme` = gallery + per-skin customize.
- **RBAC:** `admin` (full) + `publisher` (content only, WITHOUT Settings/Users); max 5 users (`MAX_USERS`); media quota 128 MB (`MAX_STORAGE_BYTES`, enforced at `/api/upload`, per-file 2 MB). Storage adapter `lib/storage.ts`: local (dev) / Vercel Blob (prod). Seed admin `admin@volumecms.test` / `password123`.
- **Add-a-feature pattern (feature-flagged):** schema+enum → `db:push` to ALL DBs → server action (`lib/actions/<entity>.ts`, 'use server' + zod + requireUser/requireAdmin) → public page (token-styled, `notFound()` if flag off) → admin page + DataTable → nav-config `flag` → settings toggle → seed. Existing flagged features: PPDB/registration, Gallery, Agenda. `CLIENTS.md` = the playbook for adding a client.
- **DEMO DEPLOY:** LIVE `https://volumecms.vercel.app` (skin `standard`), DB Neon (Vercel Marketplace), Blob `volumecms-media`. Prod env: DATABASE_URL, BLOB_READ_WRITE_TOKEN, BETTER_AUTH_SECRET/URL, NEXT_PUBLIC_APP_URL, STORAGE_DRIVER=blob.
- **CLIENT DEPLOY — Tholabie LIVE `https://pesantrentholabie.com`** (skin madinah, pesantren content, env `NEXT_PUBLIC_SITE_THEME=madinah`, flags PPDB/Gallery/Agenda on). Vercel project `tholabie` (the old Astro project repointed to the volumecms repo, git-connect). **Each client = a DEDICATED Neon instance** (Tholabie = `neon-gray-notebook`@`ep-solitary-scene`, demo = shared `ep-fragrant-mountain`); Blob `tholabie-media`. Seed `db:seed:tholabie` + `db:seed:tholabie-content`.
- **Deploy/ops gotchas (NOT readable from code):**
  - **The Git author email MUST = a Vercel team member's email**, otherwise deploy is BLOCKED ("Git author must have access to the team"). Vercel email `ongkiardiansyah@gmail.com`.
  - Per-client dedicated Neon **can't be fully automated**: provisioning needs an `authorizationId` from the interactive Marketplace flow (browser consent). The Blob store CAN be automated via API.
  - `vercel deploy --prod` = deploys the **WORKING TREE** (not git HEAD) → uncommitted WIP goes live too; git can diverge from production. `git push` (both projects git-connected) auto-deploys.
  - The deploy CLI hangs streaming logs in a non-TTY → `nohup … &`, monitor state via REST API v6/v13 deployments (not `vercel ls`). `drizzle-kit push` needs a TTY → use `drizzle-kit migrate`; DDL/seed use UNPOOLED, runtime pooled. Vercel ssoProtection defaults to walling the preview → disable via PATCH api v9/projects.
  - Old framework project (Astro) → deploy fails "No Output Directory dist"; fix PATCH Vercel `/v9/projects/{id}` `{framework:"nextjs", outputDirectory:null, buildCommand:null}`.
  - **jsonb `settings.value` BUG:** don't update via a raw postgres.js template (`sql\`… ${obj}\`` / `::jsonb`) → double-encode → jsonb becomes a corrupt string, the app reads the default. Use Drizzle (`updateSiteSettings`) or `sql.json(obj)`. Check `select jsonb_typeof(value)` MUST be `object`.
  - Querying the DB from a script: driver = **postgres.js** (not neon-serverless), `node --env-file=.env.local dbq.cjs`.
- `nextpress` = the early prototype of this concept (ARCHIVED) — see below. `~/Projects/volumecms-tholabie-fe` = a git-worktree of volumecms (see "Local repo traps").
- **MEMORY CAVEAT: projects.md is in `~/dotfiles` (git). DO NOT use Write to edit it (it overwrites the file!), use Edit.**

## TokoΦ → see [[tokophi]] in project-memory
- Indonesia commerce SaaS (`tokophi.com`), monorepo `ongkipro/tokophi`, Next.js 16 + Astro + Drizzle + PostgreSQL 16 + RLS/RBAC. Old name `indostore` (dormant repo, don't use). **No clone on Mac** — main dev on Linux, `git pull` first. Business gotchas (KiriminAja/AutoLaris white-label, e-wallet down `rc=07`, `KIRIMINAJA_ENV=sandbox`, multi-agent-one-worktree) → **`[[tokophi]]`**. Session history in the repo `CHANGELOG.md` + `specs/docs/`.

## kamus (almanac / second memory) → see [[kamus-almanak]] in project-memory
- `kamus.ongki.pro` (repo `ongkipro/kamus`, private, gated by Cloudflare Access → anonymous 401). Astro renders the repo root markdown into a dashboard. **No clone on Mac.** Often the "memory" the user means (not `~/.config/ai/memory` or CLI memory); the three can desync. AGENTS.md contract, rename-project trap, wikilink status → **`[[kamus-almanak]]`**.

## volumform → see [[volumform-id-market-ux]] in project-memory
- Multi-tenant DR-funnel SaaS for Indonesia (COD + CRM + Meta tracking + shipping KiriminAja/Mengantar). Repo `ongkipro/volumform` (created 2026-07-10), `~/Projects/volumform`. Monorepo `apps/{admin,superadmin,edge}` + `packages/db` (Drizzle); the client admin & super admin = 2 separate SPAs.

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

## nextpress — ARCHIVED (do not continue)
- WordPress-style CMS prototype (Next.js 16 + shadcn + GSAP), abandoned 2026-07-03. **Fully replaced by `volumecms`** — same concept, rewritten from scratch, unrelated history (different root commit).
- Repo `github.com/ongkipro/nextpress` private + **archived** (read-only) on 2026-07-10 merely as an archive. The local folder `~/Projects/nextpress` can be deleted anytime.

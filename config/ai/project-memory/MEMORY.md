# Memory Index

> Checkout state is device-local and changes. On the Mac, verify it with `find ~/Projects -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort`; never infer that an indexed project is locally available. Read code progress from the repository's `STATUS.md`, `BUILD-LOG.md`, `TASKS.md`, or handover file rather than this index.

- [Dealer Hino Official](dealerhinoofficial.md) — `dealerhinoofficial.com` lead generation (Astro 6, Tailwind 4, Cloudflare Workers), private repo `ongkipro/dealerhinoofficial`. Current status is in the repository's `SESSION_HANDOVER.md`.
- [AUSSIE Sawit Malaysia](aussie-sawit-malaysia.md) — COD palm-oil e-commerce MY (Astro/CF Workers/D1). Admin+storefront ready. Repo `ongkipro/aussiemalaysia`; current status is in `STATUS.md` **inside the repo** — don't trust the status in this memory.
- [Volumform ID-market UX](volumform-id-market-ux.md) — DR-funnel SaaS; Indonesian COD UX conventions + deferred features (payment status, retur, auto-FU). Checked out on the Mac (`~/Projects/volumform`).
- [Pesantren](pesantren.md) — `pesantren.shop` COD storefront and landing-page system, private repo `ongkipro/pesantren`. Design rules live in the repository's `design-tokens.md`; current blockers and status live in `TASKS.md`.
- [Petani Sejahtera](petanisejahtera.md) — LP ads funnel COD (Astro/CF Workers, Scalev backend). Repo `ongkipro/petanisejahtera`, checked out on the Mac (`~/Projects/petanisejahtera`, since 2026-07-18). Form middle/hybrid by-geo; **read `DEV_NOTES.md` in the repo first**. Env is not in the secrets archive.
- [Volumup](volumup.md) — multi-store dropship US. **CODE EXISTS + far along:** `~/Projects/volumup` (single worktree, branch `main` — consolidated 2026-07-20, the phase1/phase3 worktrees deleted), repo `ongkipro/volumup`. Admin+superadmin+storefront run in the browser; superadmin cockpit 100% live-data; CI green. **Resume from the repo `STATUS.md` "RESUME HERE"** (next: in-app store provisioning). Business/legal context (PE, entity, Printify) in memory; code progress in the repo BUILD-LOG (disk wins).
- [Formalin](formalin.md) — VolumX engine monorepo. Canonical repo `irwansyah10/formalin`; the current implementation status lives in `docs/STATUS.md`. Pull before working because development also happens on another machine.
- [TokoΦ](tokophi.md) — commerce SaaS ID. Repo `ongkipro/tokophi`; the old `indostore` repo is dormant, don't use it. Main dev on another machine — pull first.
- [Kamus (almanak)](kamus-almanak.md) — `kamus.ongki.pro`, repo `ongkipro/kamus`. Ongki's second memory; markdown → Astro dashboard. Has an `AGENTS.md` contract.
- [Skill plumbing](skill-plumbing.md) — 38 owned/vendored skills as of 2026-07-29, with `~/dotfiles/skills/local` as the single source linked to Claude and Pi. Codex and Antigravity use `skill-list` plus direct `SKILL.md` reading.
- [Skill vs memori](skills-vs-memory-boundary.md) — project context STAYS in memory, never turn it into a skill. Skills = reusable across projects.
- [Biasakan git worktree](prefer-git-worktree.md) — work on repos via a separate worktree, don't checkout/commit directly on `main`.
- [Commit menambah, bukan menimpa](additive-commits-no-history-rewrite.md) — don't force-push/rewrite history. Commit identity = noreply, don't use the real email.
- [Antigravity CLI = `agy`](antigravity-cli-agy.md) — binary `agy`, NOT `gemini`; subcommand `plugin` not `extensions`. Gemini CLI is deliberately not installed.
- [worktrunk (`wt`)](worktrunk-worktree-tooling.md) — worktree tooling. The agy plugin needs the `brew install worktrunk` binary first, otherwise its hook errors.
- [JASAWEBSITE.co brand](jasawebsite-co-brand.md) — web agency by VOLUM, 7 services, ID+MY market, spec in PRD v4.0.
- [SF-Theme Shopify store](sf-theme-shopify-store.md) — store `yn80fb-mb`, theme `olivia-16-6-0a` (#186432061760, unpublished); permanent handle for all CLIs.
- [PetCue Dawn rebuild](petcue-dawn-rebuild.md) — legal Dawn-based theme (a licensed Olivia alternative) for store `2mpt3p-xv`, paused mid-build.

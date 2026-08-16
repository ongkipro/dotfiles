# Memory Index

> Checkout state is device-local and changes. On the Mac, verify it with `find ~/Projects -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort`; never infer that an indexed project is locally available. Read code progress from the repository's `STATUS.md`, `BUILD-LOG.md`, `TASKS.md`, or handover file rather than this index.

- [Dealer Hino Official](dealerhinoofficial.md) — `dealerhinoofficial.com` lead generation; private repository `ongkipro/dealerhinoofficial`. Execution truth lives in its repository handover and task documents.
- [Dealer Truk Hino](dealertrukhino.md) — `dealertrukhino.com` product-intent catalogue; private repository `ongkipro/dealertrukhino`. It is distinct from Dealer Hino Official.
- [AUSSIE Sawit Malaysia](aussie-sawit-malaysia.md) — Malaysian COD palm-care storefront; repository `ongkipro/aussiemalaysia`. Repository contracts own execution truth.
- [Volumform ID-market UX](volumform-id-market-ux.md) — Indonesian direct-response funnel and COD UX reference; repository `ongkipro/volumform`. Verify device checkout before use.
- [Petani Sejahtera](petanisejahtera.md) — COD landing-page funnel; repository `ongkipro/petanisejahtera`. Read repository contracts before implementation.
- [CMSAds (fisik)](cmsads-fisik.md) — self-hosted COD order-management and landing-page CMS; expected checkout `~/Projects/cmsads-fisik`. A same-named tenant content pack is not the standalone Petani Sejahtera repository.
- [Volumup](volumup.md) — multi-store US dropshipping product; repository `ongkipro/volumup`. This memory retains business and legal context only.
- [TravelOS](travelos.md) — AI-native travel discovery, planning, and affiliate platform; repository `ongkipro/travelos`. Repository specifications and task records are authoritative.
- [Formalin](formalin.md) — VolumX engine monorepo; canonical repository `irwansyah10/formalin`. Repository documents own implementation truth.
- [TokoΦ](tokophi.md) — Indonesian commerce SaaS; repository `ongkipro/tokophi`. The older `indostore` repository is not the active product.
- [Linux `rich` maintenance](linux-rich-maintenance.md) — boot and service failure cases for the OptiPlex desktop, plus the host facts that decide whether a fix is safe there. `cuan` is a different machine with its own file.
- [pi-src](pi-src.md) — upstream CLI source repository; keep no permanent local checkout and clone it again when needed.
- [Kamus (almanak)](kamus-almanak.md) — `kamus.ongki.pro`, repo `ongkipro/kamus`. Ongki's second memory; markdown → Astro dashboard. Has an `AGENTS.md` contract.
- [Skill plumbing](skill-plumbing.md) — `~/dotfiles/skills/local` is the single owned source. Claude, Pi, OMP, and Antigravity use directory links; Codex uses managed per-skill links beside its native `.system` skills.
- [Skill vs memory](skills-vs-memory-boundary.md) — personal project reference may stay in memory; authoritative project truth stays in the repository; reusable methodology belongs in skills.
- [Pages deployment mode](cloudflare-pages-direct-upload-lock.md) — Direct Upload and Git integration are distinct setup paths; do not improvise with `wrangler pages deploy` when push-to-deploy is required.
- [`CF_API_TOKEN` membajak wrangler](cf-api-token-hijacks-wrangler.md) — a stale zone-scoped variable can override OAuth and fake 403s; unset both token variables for interactive OAuth checks instead of assigning empty values.
- [Biasakan git worktree](prefer-git-worktree.md) — work on repos via a separate worktree, don't checkout/commit directly on `main`.
- [Commit menambah, bukan menimpa](additive-commits-no-history-rewrite.md) — don't force-push/rewrite history. Commit identity = noreply, don't use the real email.
- [Pemilihan model Claude Code](claude-code-model-selection.md) — the `/model` picker is server-curated per account, not the availability list; unlisted models stay callable by full ID. Settings pin no `model`, so sessions run the default Opus 5.
- [Antigravity CLI = `agy`](antigravity-cli-agy.md) — binary `agy`, NOT `gemini`; subcommand `plugin` not `extensions`. Gemini CLI is deliberately not installed. Also: the "⚠ Eligibility Check / profile picture TLS timeout" is cosmetic — restart, don't re-login.
- [worktrunk (`wt`)](worktrunk-worktree-tooling.md) — worktree tooling. The agy plugin needs the `brew install worktrunk` binary first, otherwise its hook errors.
- [JASAWEBSITE.co brand](jasawebsite-co-brand.md) — web agency by VOLUM, 7 services, ID+MY market, spec in PRD v4.0.
- [SF-Theme Shopify store](sf-theme-shopify-store.md) — store `yn80fb-mb`, theme `olivia-16-6-0a` (#186432061760, unpublished); permanent handle for all CLIs.
- [PetCue Dawn rebuild](petcue-dawn-rebuild.md) — legal Dawn-based theme (a licensed Olivia alternative) for store `2mpt3p-xv`, paused mid-build.
- [Batas permission matcher Claude Code](claude-code-permission-matcher-limits.md) — a denied directory admits no carve-out (extglob negation was tested and fails), and prefix rules cannot see flags; use `ssh -G` and a PreToolUse hook.

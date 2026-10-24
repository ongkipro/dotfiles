# Archived Tasks — UI/UX Skill Suite Perfection (2026-10-14)

Archived from `TASKS.md` after verification and completion.

### TASK-123: UI/UX skill suite perfection and control-plane hygiene

- **Requirement:** REQ-UI-UX-SKILL-SUITE-REFINEMENT (owner requests research-validated perfection of the UI/UX skill ecosystem and dotfiles screening fixes).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** design-taste, admin-dashboard, admin-product-ux, storefront-ux.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-12_ADAPTIVE_AND_MEMORY.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `bin/ai-doctor`, `skills/local/design-taste/**`, `skills/local/admin-dashboard/**`, `skills/local/admin-product-ux/**`, `skills/local/storefront-ux/**`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** public visual direction & color/asset craft -> `design-taste`; operator IA/charts/print -> `admin-dashboard`; operator workflow/onboarding/HITL -> `admin-product-ux`; commerce post-purchase/WA/conversational UX -> `storefront-ux`; runtime skill count -> `bin/ai-doctor`.
- **Accepted Invariants:** all `SKILL.md` files stay under 500 lines and keep front-loaded `Not` boundaries; `contrast.py` preserves existing `#hex`/`rgb()` CLI behavior while adding CSS Color 4 `oklch()` and `hsl()`/`hsla()`; `admin-dashboard` resolves its broken `dataviz` delegation to a concrete local reference; new references and niche patterns are grounded in repository/portfolio evidence (`adsbookcms`, agri, leather/fashion, logistics); unrelated dirty memory remains untouched.
- **Regression Checks:** `test-contrast.py`, `test-design-gate.py`, `test-portfolio-scan.py`, `test-tells-scan.py`, `skill-check`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check and independent review.
- **Non-Scope:** live project code edits outside `~/dotfiles`, git commit/push, touching pre-existing dirty memory files.
- **Reopen Conditions:** `contrast.py` rejects valid `oklch()`/`hsl()` tokens, `SKILL.md` exceeds 500 lines, broken reference links appear, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires runtime hook changes, external dependencies, or modifying unrelated user files.

### TASK-124: UI/UX reviewer rubric alignment and Supabase full-spectrum skill suite

- **Requirement:** REQ-UI-REVIEWER-AND-SUPABASE-SKILL-SUITE (owner requests completing UI/UX reviewer rubrics for TASK-123 contracts and implementing full Supabase skill coverage from `supabase/agent-skills`).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** supabase-stack, admin-product-ux, design-taste, storefront-ux, postgres-drizzle.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `docs/DOTFILES_SITEMAP.md`, `config/ai/memory/skills.md`, `config/mise-config.toml`, `skills/local/README.md`, `skills/local/admin-product-ux/references/review-rubric.md`, `skills/local/design-taste/references/design-evaluation.md`, `skills/local/storefront-ux/references/journeys-and-states.md`, `skills/local/supabase-stack/**`, `skills/local/postgres-drizzle/**`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** Supabase platform & Postgres best-practices references -> `supabase-stack`; operator UX review rubric -> `admin-product-ux`; public UI design evaluation -> `design-taste`; storefront UX delivery gate -> `storefront-ux`.
- **Accepted Invariants:** all `SKILL.md` files stay under 500 lines and keep front-loaded `Not`/`NOT` boundaries; `supabase-stack` remains the single canonical Supabase skill owner (no duplicate upstream skill folders) while covering all `supabase/agent-skills` (`supabase` + `supabase-postgres-best-practices`) capabilities via modular `references/*.md`; `TASKS.md` stays under 12,288 bytes; pre-existing dirty memory files stay untouched.
- **Regression Checks:** `skill-map --check`, `skill-check`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check and independent review.
- **Non-Scope:** live project code edits outside `~/dotfiles`, git commit/push unless requested, touching pre-existing dirty memory files.
- **Reopen Conditions:** `SKILL.md` exceeds 500 lines, broken reference links appear, `skill-map` drifts from `skills/local/README.md`, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires runtime hook changes, external dependencies, or modifying unrelated user files.

### TASK-125: Shopify Hydrogen 2026.10 and Online Store 2.0 skill suite perfection

- **Requirement:** REQ-SHOPIFY-HYDROGEN-2026-10-AND-THEME-2-0-SKILL-SUITE (owner requests official-source research and perfection of the Shopify/Hydrogen skill suite covering `@shopify/hydrogen@2026.10.1`, packaged skills, Online Store 2.0 / Metaobjects Dynamic Sections in Hydrogen, and Liquid Theme 2.0 blocks/performance).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** hydrogen-development, headless-shopify, hydrogen-headless-tracking, storefront-development.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `skills/local/hydrogen-development/**`, `skills/local/headless-shopify/**`, `skills/local/hydrogen-headless-tracking/**`, `skills/local/storefront-development/**`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** Hydrogen 2026.10 & Classic Hydrogen implementation -> `hydrogen-development`; headless Shopify architecture & custom data boundaries -> `headless-shopify`; Hydrogen consent/analytics & WebMCP signal engine -> `hydrogen-headless-tracking`; Liquid Theme 2.0 & storefront engineering -> `storefront-development`.
- **Accepted Invariants:** all `SKILL.md` files stay under 500 lines and keep front-loaded `Not`/`NOT` boundaries; `hydrogen-development` covers both Hydrogen `>= 2026.10.0` (`2026.10.1` latest, framework-agnostic server-handler SDK, 20 packaged skills, `gql()` + `@shopify/hydrogen/ts-plugin`) and Classic Hydrogen (`<= 2026.4.7`) plus migration (`migrate-to-hydrogen-2026-10`) and Metaobject Dynamic Section CMS (Online Store 2.0 parity); `storefront-development` covers Liquid Theme 2.0 blocks (`blocks/*.liquid`, `{% content_for 'blocks' %}`, `{% doc %}`, `{% stylesheet %}` subsetting) and the 7 essential theme performance rules; `TASKS.md` stays under 12,288 bytes; pre-existing dirty memory files stay untouched.
- **Regression Checks:** `skill-map --check`, `skill-check`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check and independent review.
- **Non-Scope:** live project code edits outside `~/dotfiles`, git commit/push unless requested, touching pre-existing dirty memory files.
- **Reopen Conditions:** `SKILL.md` exceeds 500 lines, broken reference links appear, `skill-map` drifts from `skills/local/README.md`, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires runtime hook changes, external dependencies, or modifying unrelated user files.

### TASK-126: Meta Ads official CLI (`meta-ads`) per-project workflow, `dotads-meta`, and `meta-ads-cli` skill

- **Requirement:** REQ-META-ADS-CLI-WORKFLOW-AND-SKILL (owner requests official-source research and dotfiles integration for setting up Meta Ads video/image/copy campaigns from laptop across all AI CLIs and devices via Business Manager while keeping campaign assets per-project).
- **Risk Level:** R2.
- **Job:** implementation.
- **Capability:** meta-ads-cli, meta-ads-signal-engine.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `bin/dotads-meta`, `bin/dotads-meta-test`, `config/ai/runtime-commands.txt`, `bin/skill-map`, `skills/local/README.md`, `skills/local/meta-ads-cli/**`, `skills/local/meta-ads-signal-engine/SKILL.md`, `config/ai/memory/skills.md`, `docs/DOTFILES_SITEMAP.md`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** Meta Ads CLI campaign/adset/creative operations -> `meta-ads-cli` + `bin/dotads-meta`; Meta Pixel/CAPI signal engine -> `meta-ads-signal-engine`.
- **Accepted Invariants:** zero secrets in repository files or CLI argv (`ACCESS_TOKEN` injected via `secrets-env get` into child process environment); `dotads-meta deploy` is dry-run by default and forces `PAUSED` status unless `--activate` is passed; `.meta-state.json` caches created entity IDs and SHA-256 media `image_hash`/`video_id` for idempotent resume; `SKILL.md` stays under 500 lines with a front-loaded `Not for` boundary before character 240; `TASKS.md` stays under 12,288 bytes.
- **Regression Checks:** `dotads-meta-test`, `installer-link-test`, `skill-map --check`, `skill-map-test`, `skill-check meta-ads-cli`, `skill-check-test`, `skill-surface-check`, `git diff --check`, boundary check.
- **Non-Scope:** live Meta Ad Account mutations without approval, git commit/push unless requested, touching pre-existing dirty memory files.
- **Reopen Conditions:** `dotads-meta-test` fails, `skill-map` drifts from `skills/local/README.md`, `SKILL.md` exceeds 500 lines, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires modifying runtime hooks, live secrets, or unrelated user files.

### TASK-127: `black-magic` reverse-engineering skill (`morluto/rea` v6.7.0) and deterministic `rea-skill-sync` auto-sync

- **Requirement:** REQ-BLACK-MAGIC-REA-SKILL-AND-AUTOSYNC (owner requests `black-magic` reverse-engineering skill integrating `https://github.com/morluto/rea` across all targets with deterministic upstream auto-sync, sibling handoffs, and capability benchmark).
- **Risk Level:** R3 (large explicit change surface > 10 files).
- **Job:** implementation.
- **Capability:** black-magic, codebase-navigation, openapi-spec, development-kit.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `docs/DOTFILES_SITEMAP.md`, `config/ai/memory/skills.md`, `config/ai/runtime-commands.txt`, `bin/rea-skill-sync`, `bin/rea-skill-sync-test`, `bin/skill-map`, `skills/local/README.md`, `skills/local/black-magic/**`, `skills/local/codebase-navigation/SKILL.md`, `skills/local/openapi-spec/SKILL.md`, `skills/local/development-kit/references/ecosystem-adoption.md`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** shipped-artifact & runtime reverse-engineering -> `black-magic` + `bin/rea-skill-sync`; owned source-tree AST/call navigation -> `codebase-navigation`; OpenAPI specification synthesis -> `openapi-spec`.
- **Accepted Invariants:** `skills/local/black-magic/` preserves 100% of upstream `morluto/rea/.agents/skills/reverse-engineer-anything/` (`SKILL.md` body + all 6 `references/*.md` files) while adding the `black-magic` frontmatter (`Not for` boundary before character 240) and `references/dotfiles-integration.md`; `bin/rea-skill-sync` deterministically syncs from `--upstream-dir` or `--remote`, discovers new upstream reference files automatically, supports read-only `--check` / `--json`, and maintains `.source` + `.local-fork` so `_refresh-vendored.sh` preserves the managed fork; no global `rea setup` MCP bloat; `SKILL.md` stays under 500 lines; `TASKS.md` stays under 12,288 bytes.
- **Regression Checks:** `rea-skill-sync-test`, `vendored-refresh-test`, `installer-link-test`, `skill-map --check`, `skill-map-test`, `skill-check black-magic`, `skill-check-test`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check and independent review.
- **Non-Scope:** global `rea setup` MCP registration on host, git commit/push unless requested, touching pre-existing dirty memory files.
- **Reopen Conditions:** `rea-skill-sync-test` fails, `skill-map` drifts from `skills/local/README.md`, `SKILL.md` exceeds 500 lines, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires modifying runtime hooks, live secrets, or unrelated user files.


Command references are normalized to `dotads-meta` by TASK-131. Original execution evidence remains under `.delivery/`.

### TASK-129: Rename the Meta Ads helper to dotads-meta

- **Requirement:** REQ-DOTADS-RENAME.
- **Risk Level:** R3.
- **Allowed Paths:** `TASKS.md`, `bin/dotads-meta`, `bin/dotads-meta-test`, `config/ai/runtime-commands.txt`, `config/ai/memory/skills.md`, `skills/local/README.md`, `skills/local/meta-ads-cli/SKILL.md`, `skills/local/meta-ads-cli/references/rules-and-tutorial.md`, `docs/DOTFILES_SITEMAP.md`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated work and live accounts.
- **Canonical Contract Owners:** command implementation -> `bin/dotads-meta`; operational guidance -> `meta-ads-cli`; device command installation -> runtime command manifest.
- **Accepted Invariants:** Canonical `dotads-meta` and migration aliases worked; TASK-131 retires those aliases. Existing workspace/state and deployment behavior remain compatible.
- **Regression Checks:** `dotads-meta-test`, `installer-link-test`, `skill-map --check`, `skill-check meta-ads-cli`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check and independent review.
- **Non-Scope:** live APIs, credentials, unrelated work, commit/push.
- **Reopen Conditions:** entry points or workspace compatibility regress.
- **Escalation Conditions:** live access or unrelated user changes required.

### TASK-130: Protect Meta Ads state and brand selection

- **Requirement:** REQ-DOTADS-META-RELIABILITY (owner requests Meta-only refinement).
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/SKILL.md`, `skills/local/meta-ads-cli/references/rules-and-tutorial.md`, `.delivery/**`.
- **Canonical Contract Owners:** CLI -> `dotads-meta`; guidance -> `meta-ads-cli`.
- **Accepted Invariants:** reject corrupt state before API calls; save atomically; explicit brand overrides inherited account defaults; preserve valid version-1 state.
- **Regression Checks:** `dotads-meta-test`, `ai-policy-lint`, `git diff --check`, boundary and independent review.
- **Non-Scope:** live APIs, credentials, Google/TikTok, unrelated work, commit/push.
- **Reopen Conditions:** state loss or wrong account selection recurs.
- **Escalation Conditions:** requires live access.


### TASK-128: Conditional inbound routing to `black-magic` for deep reference extraction and `rea-skill-sync` hint in `_refresh-vendored.sh`

- **Requirement:** REQ-BLACK-MAGIC-REFERENCE-ORCHESTRATION (owner authorizes wiring `black-magic` into `development-kit`, `full-stack-development`, `design-taste`, and `_refresh-vendored.sh` where it genuinely maximizes reference extraction and sync discoverability without adding bloat to ordinary tasks).
- **Risk Level:** R2.
- **Job:** implementation.
- **Capability:** black-magic, development-kit, full-stack-development, design-taste.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `skills/local/README.md`, `skills/local/_refresh-vendored.sh`, `skills/local/development-kit/SKILL.md`, `skills/local/full-stack-development/SKILL.md`, `skills/local/design-taste/references/design-discovery.md`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** reference discovery & workflow routing -> `development-kit`; cross-layer orchestration -> `full-stack-development`; public UI reference evidence -> `design-taste`; vendored/fork refresh reporting -> `skills/local/_refresh-vendored.sh`.
- **Accepted Invariants:** ordinary source-repo and static-screenshot tasks remain fast and lightweight (no mandatory REA execution on routine edits); `black-magic` is invoked automatically when a supplied reference or integration target is a `.har`/`.saz` capture, shipped bundle/binary/APK/SQLite snapshot, or live interactive flow whose computed tokens/motion/API state are not resolved by static screenshot capture; `_refresh-vendored.sh` surfaces `sync_tool:` from `.local-fork` without breaking offline `vendored-refresh-test`; all `SKILL.md` files stay under 500 lines; `TASKS.md` stays under 12,288 bytes.
- **Regression Checks:** `vendored-refresh-test`, `skill-map --check`, `skill-map-test`, `skill-check development-kit`, `skill-check full-stack-development`, `skill-check design-taste`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check.
- **Non-Scope:** forcing REA on ordinary source or static UI tasks, git commit/push unless requested, touching pre-existing dirty memory files.
- **Reopen Conditions:** `vendored-refresh-test` fails, `skill-map` drifts from `skills/local/README.md`, any `SKILL.md` exceeds 500 lines, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires modifying runtime hooks, live secrets, or unrelated user files.

### TASK-131: Retire the previous Meta Ads helper name

- **Requirement:** REQ-DOTADS-META-CANONICAL (owner requests removal of old aliases and complete reference replacement).
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `bin/dotads-meta`, `bin/dotads-meta-test`, retired command links under `bin/`, `config/ai/runtime-commands.txt`, `skills/local/meta-ads-cli/SKILL.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `.delivery/**`.
- **Canonical Contract Owners:** command -> `dotads-meta`; operations -> `meta-ads-cli`.
- **Accepted Invariants:** only canonical entry points remain; maintained references use the canonical name; regression guard prevents retired naming; immutable execution evidence remains unchanged; installers already prune removed managed links.
- **Regression Checks:** `dotads-meta-test`, `installer-link-test`, `ai-policy-lint`, `git diff --check`, boundary and independent review.
- **Non-Scope:** live APIs, credentials, unrelated files, commit/push.
- **Reopen Conditions:** retired command or reference returns.
- **Escalation Conditions:** a retired device path contains an unrelated file instead of the expected managed symlink.

### TASK-132: Migrate device command links during sync

- **Requirement:** REQ-DOTSYNC-COMMAND-MIGRATION.
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `bin/ai-memory-link`, `bin/ai-memory-link-test`, `bin/dotsync`, `bin/dotsync-test`, `docs/ai-memory-sync.md`, `config/ai/README.md`, `.delivery/**`.
- **Canonical Contract Owners:** links -> `ai-memory-link`; sync -> `dotsync`.
- **Accepted Invariants:** first pull installs manifest commands and prunes dangling owned links; preserve user files/foreign links; check mode stays read-only; autopull retries reconciliation when up to date.
- **Regression Checks:** linker, sync, installer and canonical command suites; policy lint; boundary review.
- **Non-Scope:** packages, credentials, live APIs, commit/push.
- **Reopen Conditions:** upgrade or safe retry regresses.
- **Escalation Conditions:** unrelated user files need replacement.

### TASK-133: Verified learning, curated recall, read-only scheduling, and skill audit

- **Requirement:** REQ-VERIFIED-AI-AUTOMATION (owner accepts research priorities 1–3, parallel implementation, whole-skill audit, update log, Markdown documentation, and system map).
- **Risk Level:** R3.
- **Allowed Paths:** `TASKS.md`, `README.md`, `STATUS.md`, `CHANGELOG.md`, `config/ai/runtime-commands.txt`, `config/ai/README.md`, `docs/adaptive-ai-system.md`, `docs/DOTFILES_SITEMAP.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `bin/delivery-learning*`, `bin/ai-memory-harvest*`, `bin/delivery-ledger*`, `bin/ai-recall*`, `bin/ai-schedule*`, `skills/local/continuous-learning/SKILL.md`, `skills/local/development-kit/references/adaptive-execution.md`, `skills/local/shadcn-ui/SKILL.md`, `skills/local/postgres-drizzle/SKILL.md`, `skills/local/cloudflare-one/**`, `skills/local/cloudflare-one-migrations/**`, `skills/local/workers-best-practices/**`, `skills/local/README.md`, `.delivery/**`.
- **Protected Paths:** Unrelated dirty files, credentials, CORE, runtime/provider settings, live APIs and system services.
- **Canonical Contract Owners:** verified lessons -> `delivery-learning` / `ai-memory-harvest`; completion -> `delivery-ledger`; recall -> `ai-recall`; schedule -> `ai-schedule`; methodology -> existing skills.
- **Accepted Invariants:** explicit structured lessons only; verified PASS finalization preserving failures; private reviewable candidates without promotion; scoped curated FTS5 recall with provenance/stale refresh; allowlisted offline checks with private state, no shell or implicit service; skill updates preserve upstream provenance.
- **Regression Checks:** learning/harvest/ledger, recall, schedule, skill/manifest suites; negative trust-boundary fixtures; policy lint; independent review/boundary.
- **Non-Scope:** checkpoint, mobile gateway, raw chat indexing, paid models, credentials, live jobs, services, commit/push.
- **Reopen Conditions:** evidence/data leakage, stale recall, duplicate candidate/job execution, unsafe commands or broken discovery.
- **Escalation Conditions:** unrelated user work or system/production access is needed.

### TASK-134: Refresh the system map after verified automation

- **Requirement:** REQ-SYSTEM-MAP-CURRENT (owner requests updated system map alongside implementation docs and log).
- **Risk Level:** R1.
- **Allowed Paths:** `TASKS.md`, `docs/DOTFILES_SITEMAP.md`, `.delivery/**`.
- **Canonical Contract Owners:** navigation/inventory -> system map; behavior -> existing tools and adaptive workflow.
- **Accepted Invariants:** preserve prior canonical naming edits; show actual tool ownership, counts and verified learning/recall/scheduler flow; private device data stays separate; OMP remains native.
- **Regression Checks:** inventory assertions, Markdown links, policy lint, diff and independent review.
- **Non-Scope:** implementation, runtime settings, jobs, services, commit/push.
- **Reopen Conditions:** map contradicts implementation or inventory.
- **Escalation Conditions:** implementation changes become necessary.

# Changelog

Dated releases, newest first. `vYYYY.MM.DD`. Repository tests and runtime
evidence outrank anything written here; where this file and `TASKS.md` disagree,
`TASKS.md` and the `.delivery/` run records are authoritative.

## Unreleased — 2026-10-28

### `dotuiux` UI/UX loop (TASK-165, TASK-167) — 2026-10-31

- Add the `dotuiux` command and skill: `init` scaffolds `design/brief.md` and
  `DESIGN.md` without overwriting, `teardown` captures live sites at
  360/768/1440 and refuses gallery hosts, `check` reports fail / warn /
  allowed / not checked (13 harm-only floor rules; warns overridable by
  `allow: <id> — <reason>`), `validate` checks the project files. Zero
  dependencies; reuses `design-taste/scripts/ui-ref.mjs`; output stays in the
  client repository. `bin/dotuiux-test` runs in the full design-tool CI job.
- TASK-167 brings it to the same integration level as `dotads-meta`: system-map
  lookup rows locked in `system-map-test`, a routed skills-memory pointer, this
  changelog entry, and the skill's brief and reference-count wording aligned
  with the scaffold and the research brief.
- TASK-168 closes what the research left open: accepted decision D2 becomes the
  warn rule `display-tracking` (display text ≥ 24 px tighter than −0.02em;
  tighter only via `allow: display-tracking — <reason>`); `teardown` removes a
  ref directory it created when a gallery is reached after the first capture;
  a browser fixture now proves contrast still PASSES on a fully measured page.
  Both new behaviours were mutation-checked (reverting each fails its test).
- TASK-169 fixes what a run on four real built pages and a primary-source
  check found. Contrast was NOT CHECKED on all four; it is now bounded over
  gradients (fail only if the best case fails, pass only if the worst case
  passes), the scan scrolls instantly (smooth scrolling hid a whole 84k px page)
  over up to 120 screens within a time budget, thin pseudo-element lines (≤ 4 px
  underline bars) and off-page skip links no longer distort results; every
  other painted pseudo-element band on the page (background, border, shadow;
  positioned or grid-placed) keeps text in its containing block NOT CHECKED. `lcp-entrance` fails only on a hidden start
  (web.dev LCP), including a fading hero that hands LCP to a paragraph;
  `target-size` gains the WCAG 2.5.8 user-agent exception; `ease-in` is
  labelled owner decision D1; new warn `heading-skip`. Evidence and the D8
  sandbox trial: `~/Documents/work/research/dotuiux/04-*.md`, `05-*.md`.

### Repository entry points and discovery

- Keep the root README short and neutral; setup, operating contracts and
  verification guidance remain in their existing documentation owners.
- Remove repository discovery topics. Public files and repository names remain
  searchable; this is reduced discovery metadata, not an indexing or access block.
- Use the Git commit as the installed revision. This documentation update does
  not create a release tag or a separate version file.
- The system-map inventory check, 72-query lookup regression and focused
  documentation link checks passed for these entry-point edits.
- The preceding implementation snapshot `b70a227` passed the hosted Linux,
  macOS and full design-tool jobs in
  [Core runtime run 40555479199](https://github.com/ongkipro/dotfiles/actions/runs/40555479199).
  This is historical evidence for that commit, not a result for later changes.

### On-demand Meta knowledge and campaign learning — 2026-10-28

- Add a small routed Meta knowledge card linking the existing algorithm, market,
  campaign, economics and terminal references; private account data stays outside
  dotfiles. Reusable findings require evidence and review before skill updates.
- Clarify the campaign decision procedure with dated Meta Performance 5 support,
  conditional structure examples, backend economics and explicit uncertainty.
  Memory routing regression and six focused inclusion/exclusion probes passed.

### Scoped Meta account reporting runtime (TASK-155)

- Read account inventory and explicit Insights scopes through the installed
  official SDK, with pure pre-credential planning, bounded pagination/retries,
  declared fields/status filters and sanitized failures. Existing CLI writes
  remain behind their own dry-run/approval gates.
- Add account registry, private immutable snapshots, per-scope complete-success
  pointers, reproducible Markdown/CSV report revisions and offline export input.
  Partial/failed refreshes never become measured zero or replace complete data.
- Add journaled local asset copy/move and hash-bound reference-only adoption;
  explicitly selected legacy root folders preserve their files/deployment state.
- Real-account access, effective server settings, scheduled backfill,
  network checkpoints, remote downloads/captures and full operational cutover
  remain separate verification or implementation work.

### Verified Meta workspace bootstrap and review provenance (TASK-154)

- Reject symlink report roots on both installers and fail when private `0700`
  permissions cannot be verified. CLI init rejects symlink scaffold destinations.
- Resolve bare workspace names consistently under Documents; explicit `./` and
  absolute paths retain their own destinations and existing files/state.
- Query pipx's effective shared environment, stop failed recovery steps, retry
  installation at most once, and verify the requested executable afterward.
- Retain historical approval hashes and record fresh reviews separately. Local
  folder creation remains distinct from account export and report automation.

### Cross-device `dotads-meta-report` workspace bootstrap (TASK-153)

- `install.sh`, `install-macos.sh`, and `dotads-meta setup`/`init` create
  `~/Documents/dotads-meta-report/` with mode `0700` across Linux and macOS.
- `dotads-meta init <act_id--slug>` resolves bare account/brand names under
  `~/Documents/dotads-meta-report/` and populates `ad_account_id` and `brand`
  while preserving explicit directory arguments.
- `dotads-meta setup` recovers automatically when Ubuntu/Debian `pipx` lacks
  `ensurepip` and a user-space `pipx-bootstrap` exists; `SKILL.md` and
  `rules-and-tutorial.md` examples now point to `~/Documents/dotads-meta-report/`.

### System map as a measured dictionary (TASK-145)

- `--find` federates project-memory, Kelola, and skill indexes; each link is a
  candidate, each entry one result; stopwords, substring names, stable stems,
  test and historical-page demotion.
- Coverage gate 371 -> 517 members plus a catch-all: environment, CI, OMP/Pi, hooks, evals,
  skill commands, helpers, tests, research; Kelola checked against its index;
  same-page anchors validated.
- Six wrong and more than a dozen vague command notes, five memory notes, rewritten from
  their sources. A 72-query owner set is locked in `system-map-test`
  (100% top 3, >=90% first). The page gained usage notes, contents, and a
  reliability section.

### Queryable system map (TASK-144)

- `system-map --find <terms>` ranks sitemap entries (name and path over section
  over note, curated intents first, each page once; `--limit`, `--json`).
- The sitemap opens with 21 `Quick find` intents and states eight architecture
  invariants; `--check` rejects an entry without a note.
- References studied (llms.txt, aider repo map, rust-analyzer ARCHITECTURE.md,
  Backstage catalog, Diátaxis, repomix) and what was adopted or deferred:
  [system-map references](docs/research/system-map-references-2026-10-25.md).

### Generated system-map inventory and coverage gate (TASK-141)

- `system-map` renders the sitemap inventory and `--check` (run by
  `ai-policy-lint`) fails on an unlinked tracked memory, skill, command,
  device, template or top-level doc, a project memory missing from
  `MEMORY.md`, or a broken relative link. Hand-kept counts were removed.
- Linked the 9 commands, 2 templates, 13 documents and 1 skill the first run
  found, indexed 5 routed but unindexed project memories, and corrected the
  FormalinADS gateway summary (senangPay is a DOKU company).

### Decision-trial guidance provenance (TASK-138)

- `ai-workflow-eval` accepts optional self-reported `guidanceRead` and labels each
  failed case `expected-owner-read` or `expected-owner-unread`; results are
  unchanged; paths are normalized, deduplicated, and traversal, absolute, home,
  drive, or URL forms fail closed.
- `development-kit` states pinning, scope, regression checks, and independent
  review for skill-system changes after one read-labeled trial per revision
  pointed to that gap (self-reported, not a reliability rate).

### Development-kit completeness audit (TASK-137)

- Standalone templates gain conditional sections instead of new files: `PRD.md`
  Quality attributes, `ARCHITECTURE.md` Threats and controls, `AGENTS.md` Test
  strategy and Definition of done, `OBSERVABILITY.md` Runbook.
- `development-kit` description names skill-system improvement, CLI onboarding,
  upstream adoption, and research-only questions; `full-stack-development`
  covers cross-layer repair and checks both authorization and persistence.
- Sources, decision trials, and open items:
  `docs/research/development-kit-audit-2026-10-25.md`.

### Cross-platform CI repair (TASK-136)

- Integrated remote WSL/device updates while preserving all unrelated local edits.
- Meta naming checks use native Git search, including untracked maintained files,
  without requiring ripgrep on CI runners. Fatal search errors still fail.
- Linker/recall fixtures canonicalize temporary roots so macOS `/var` aliases
  do not produce false path mismatches.
- Telemetry uses exclusive first creation followed by plain existing-file append,
  avoiding the Darwin create/open race while retaining descriptor/link guards.
- Synthetic workflow servers bind numeric loopback without reverse DNS. Oracle
  SQLite handles close after each operation; mutation checks remain unchanged.
- Toolchain probes use unique private temporary homes and preserve pre-existing
  PID-named paths. WSL shell edits now trigger CI and receive Bash syntax checks.
- Local aggregate passed 77/77; full browser workflow passed 30/30. Independent
  portability review and symlinked temporary-root fixtures passed. Hosted
  Linux/macOS confirmation is recorded only after an actual run.

### Added

- Explicit staged lessons through `delivery-learning stage`, automatic verified
  PASS finalization, private candidate harvesting, and idempotent `finalize`
  recovery. New signals bind verification event hashes without copying logs.
- `ai-recall`: private SQLite FTS5 recall over selected repository contracts and
  verified historical learning/run metadata, with source citations, provenance,
  refresh deletion, and sensitive-source exclusion.
- `ai-schedule`: allowlisted offline `repo-status` and `dotads-validate` jobs,
  due ticks, foreground scheduling, pause/resume/removal, run history, exclusive
  execution, and visible UNKNOWN results for interrupted attempts.

### Changed

- The Meta Ads helper is now `dotads-meta`. Retired aliases are removed and a
  regression guard prevents their return. Deployment state writes are atomic;
  invalid state blocks execution, and selected brands override inherited account
  defaults. Live account operations were not exercised.
- Existing devices reconcile executable links through the post-pull
  `ai-memory-link` entry point. Up-to-date autopull retries reconciliation;
  owned dangling links are pruned while personal files and foreign links survive.
- Whole-corpus skill audit covers 77 entrypoints and 22 upstream provenance
  sources. Shadcn guidance now fits the 500-line budget; Postgres scope is visible
  within the discovery budget; learning and execution guidance use the new tools.
- Three Cloudflare entrypoints received verified upstream updates with explicit
  local-fork provenance where missing sibling links need external references.
  Cloudflare One no longer recommends Audit SSH after its documented EOL;
  see [API deprecations](https://developers.cloudflare.com/fundamentals/api/reference/deprecations/#2026-05-13)
  and [DLP Passive Detection](https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/passive-detection/).

### Whole-system hardening (TASK-135)

- Meta deployment state binds account and parent identities, detects effective
  brand-default drift, rejects duplicate keys, and serializes local apply with
  explicit recovery for uncertain remote outcomes.
- Installers preserve malformed shell files and foreign launchers, and bootstrap
  Claude/Codex hooks on fresh homes. Context collisions fail reconciliation.
- Backup names include container identity; discovery and partial dump failures
  are visible. Installed tmux paths, sysfs batteries, bounded shell completion,
  and JSON/HTML/CSS language-server mappings are corrected.
- MCP sync compares managed values and preserves private modes. Learning checks
  final retrieval budgets, telemetry rejects unsafe links, status routing keeps
  execution references, and Pi falls back on failed/incomplete compaction.
- Release probes pin validated destinations with hostname/TLS checks. Fenced
  examples stay inactive; cross-stack UI requirements and canonical resume and
  skill-statistics evidence cannot silently pass missing/invalid checks.
- Secret scans fail on fatal Git errors; vendored refresh stages all downloads
  before replacement and distinguishes network failures from missing files.
- Node pin advances to 24.22.1; adopting devices must migrate version-local npm
  globals. The audited device retained all 21 package versions and 36 executable
  names, with real CLI/LSP checks and the old runtime preserved.
- Five existing design-tool suites join automatic
  checks; maintained documentation triggers Core runtime CI.
- [Research and adoption notes](docs/research/dotfiles-reliability-sources.md)
  retain community/thread/video references, corroboration, recovery, and limits.

### Verification

- TASK-135: final Linux core aggregate **77/77 PASS** under Node 24.22.1 and
  Pillow 13.0.0, including real browser fixtures. The initial Shopify failure
  remains recorded; exact-version npm-global migration repaired it without
  weakening the test. Focused review regressions, syntax/workflow/policy checks,
  and independent integration review passed. Final code/config matched the
  tested snapshot; 11 unrelated dirty files remained byte-identical.

- TASK-133 focused gates passed: learning lifecycle and harvest, full
  delivery-ledger regression, recall (15 scenarios), scheduler (10 scenarios),
  all 77 skill checks (zero warnings), command/installer/device-sync integration,
  policy lint, and an independent review. Exact commands and results belong to
  `.delivery/`; these counts describe local fixtures, not fleet reliability.

### Boundaries and adoption

- Candidates require review before canonical memory/skill changes. Recall is
  advisory full-text search and does not ingest raw chat or verification output.
- No real scheduled job, cron entry, system service, paid model call, or mobile
  gateway is enabled. Checkpoints and phone access remain deferred.
- After publication, existing devices use `dotsync pull` (or normal autopull)
  to receive the commands. Plain Git pulls need `ai-memory-link && skill-update`.
- Focused regression suites use isolated homes, local Git remotes, synthetic
  evidence and credentials. This audit does not recertify every vendor API
  example or establish reliability across all native AI runtimes.

## v2026.10.09

design-taste: independent cross-family visual review, enforced by the gate.
After v2026.10.08.6 agy passed the gate with self-praising critiques, a
same-family subagent review, then its own leading prompt with a prefilled
`Verdict: PASS` and a `touch`ed review file. With this release the same
fixed demo prompt produced a clean, specific page: Claude reviewed it through
the script, agy fixed findings each round, and the gate passed with no edits
to the review.

### Added

- `scripts/visual-review.py`: slices full-page screenshots to viewport height,
  sends the canonical prompt from `references/visual-review.md` through
  `ai-ask` to another model family (refuses the author's family), writes
  `design/review.md` with prompt, image, and output hashes, and stops at five
  rounds (`design/review-rounds.log`).
- `design-gate.py`: `review` check (script-written, hash-verified, other
  family, same screenshots as the critique, `Verdict: PASS`), `headline`
  (colored word in h1/h2), and `stat` (placeholder set as a big figure).
- `references/visual-review.md`: reviewer prompt with the generic-look list,
  unsourced-claim and owner-photo rules.
- CORE and `ui-validation`: a new or redesigned public page is done only when
  `design-gate.py` exits 0.

## v2026.10.08.6

design-taste: executable delivery gate. Two agy runs (an ads report and a
fresh company profile) read the skill, then wrote a reference table from
memory, never opened their own screenshots, and shipped the same tech-mono
look; the text rules already banned it, nothing enforced them.

### Added

- `scripts/design-gate.py` (+ `test-design-gate.py`): exit 1 unless the design
  artifact cites two `ui-ref` capture dirs and a `## Render critique` with
  narrow/wide screenshots newer than the source, and unless monospace, `//`
  separators, numbered labels, tracked uppercase labels, and Tailwind default
  blue/indigo stay under limits. `gate-allow: <check> - <reason>` records a
  look the brief asks for. Both observed projects fail it; a clean fixture
  passes.
- SKILL.md: research step requires `ui-ref` captures; polish step requires
  opening the screenshots and writing the critique; §8 requires the gate's
  final line; §4.3.1 names the tech-mono template; §4.5 bans drawn "project
  photos" and asks for reader-level vocabulary.
- `design-discovery.md` template: capture-dir column, Render critique and
  gate line.

### Removed

- design-taste: 11 navigation-only pointer files under `references/`.

## v2026.10.08.5

Motion: researched trends and sources, corrected vendored GSAP skills.

### Fixed

- `gsap-*` (checked against gsap.com docs; logged in each `.local-fork`):
  `refreshPriority` higher refreshes first (was inverted); Observer default
  `type` is `"wheel,touch,pointer"`; Flip `nested`/`scale`; ScrollTo has no
  `element` option; `MotionPathHelper.create` signature; `easeReverse`
  (GSAP 3.15) with `yoyoEase` deprecated; timeline default position is the
  end of the timeline. Upstream `greensock/gsap-skills` is unchanged since
  2026-04-21 with these issues open.
- `motion-craft.md` reduced motion: drop movement, keep opacity/color
  feedback; the blanket `0.01ms` reset is a last-resort floor only.

### Added

- `motion-craft.md`: tool precedence (CSS → `@starting-style` → CSS
  animation → WAAPI → Motion → GSAP → Rive/dotLottie; GSAP license is
  non-OSI), M3/SwiftUI spring tokens and the CSS `linear()` caveat, View
  Transition rules, smooth-scroll stance, Motion library notes, gesture
  rules, performance/accessibility gate, generated-motion tells, motion
  policy per surface. Sources: Emil Kowalski skills, Motion AI Kit, ibelick
  ui-skills, Vercel guidelines (all MIT), NN/g, WCAG, Material 3, Apple HIG.
- `motion-platform-support.md`: dated Baseline table (same-document View
  Transitions Baseline 2025-10-14; cross-document and scroll-driven
  animations lack Firefox), re-verify quarterly.
- Astro: native `@view-transition` by default, `ClientRouter` only when
  needed; WAAPI in the motion ladder. Next.js/shadcn: Motion lookups via
  `mcp.motion.dev`; vaul is unmaintained and the shadcn Drawer moved to
  Base UI. Admin: motion policy; the `motion ^11` pin marked historical.

## v2026.10.08.4

### Changed

- `preferences.md` (owner decision): style rules are now research-driven
  per project instead of a fixed house look. Shape language (radius,
  surfaces, gradients, references) and section dividers follow the surface
  catalog, inspected references, brand, and the distinctness check, recorded
  in the design artifact; flat/micro-radius is one valid direction, not the
  default. Quality rules stay fixed: no decorative Sparkles, no invented
  meters, one contact CTA, solid star ratings.
- Star-rating color: the old ambers fail WCAG 1.4.11 on white (`#f59e0b`
  2.14:1); light-surface default is now `#d97706` (3.18:1).
- `design-taste` §1.5, §2.1, §4.3.1 aligned with the change.

## v2026.10.08.3

### Added

- `design-taste` §2.1 cross-project distinctness and
  `scripts/portfolio-scan.py` (+ test): lists fonts, radius, accent, and
  direction of the owner's recent projects and flags recurring choices and
  shared templates. Evidence: of the 15 latest projects, Inter in 9, Inter +
  Cinzel in 8, shadcn default `0.625rem` radius in 9; seven are separate
  brands on one `adsbookcms` engine with an unchanged theme layer. New work
  avoids recurring choices and differs from recent projects on two or more
  axes; brands on a shared template get their own theme layer.

## v2026.10.08.2

### Fixed

- `astro-development`: `astro check` needs `@astrojs/check` + `typescript`;
  when missing it opens an interactive prompt that hangs agents (`--yes` skips
  it); with TypeScript 7 it errors out, so use `@astrojs/ts-content-mapper`
  or report type-checking as not run (verified in Astro 7.3.7 source).
- `design-taste` delivery gate: new work is rendered twice (after the macro
  composition pass and at the end), both captures recorded; found by the
  e2e company-profile build.

### Other devices

- Nothing beyond the normal autopull. If a device ever needs
  `mise install node@<v> --force`, record and reinstall its global npm CLIs
  first: the forced reinstall deletes them (lesson candidate captured).

## v2026.10.08.1

Surface catalog for every public web surface type, admin contradictions
fixed against primary sources, and instruction conflicts found by an
end-to-end company-profile build.

### Added

- `design-taste/references/surface-catalog.md`: job, anatomy, evidence, and
  Indonesia/Malaysia compliance for compro, landing, sales page, advertorial
  (EPI 2020 4.13 and 4.6.3 "#sponsor", Dewan Pers 2012, Content Code 2022 6.3,
  FTC), lead magnet, donation, government, portfolio, waitlist, storefront,
  marketplace, directory, booking, news, docs, customer portal; component
  taxonomy and state baseline. Routed from `design-taste` §0 and §9.
- `admin-dashboard/references/operator-surfaces.md`: Indonesian marketplace
  order queues, inventory ledger, finance presentation, audit-log UI.

### Fixed

- Admin baseline colors failed WCAG: error text `#ef4444` 3.76:1 → `#b91c1c`
  6.47:1; success/warning/info marks and placeholder replaced (all ≥4.5:1);
  Okabe-Ito no longer called accessible by default (most hues <3:1 on white).
- `Intl` IDR is display-only (it rounds silently); impersonation exit is
  authenticated and CSRF-protected; order status uses four axes; disabled
  reasons are visible text, not tooltips; three destructive tiers; Carbon
  density 24/32/40/48/64.
- Conflicts from the e2e build: `copywriting` meta title/description follow
  the owner SEO invariant (55–70 with ` - Brand`, 120–155); the compro niche
  respects the contact-CTA invariant; placeholder logos are preview-only;
  `ui-validation` has a runner fallback for projects without Playwright.

### Other devices

- Shell autopull or `dotsync pull` applies it; nothing else to do.

### Verification

- Contrast re-measured with `contrast.py`; EPI clauses checked verbatim in
  the primary PDF text; e2e company-profile build: DESIGN.md before code,
  references captured, owner content marked pending, 24/24 browser checks.
- `skill-check` 74 skills 0 failures 0 warnings; `skill-map-test`,
  `ai-policy-lint`, `skill-surface-check`, `skill-check-test`,
  `skill-update-test`, `dotsync-test`, `test-tells-scan.py`,
  `test-contrast.py` passed.

## v2026.10.08

Removed `impeccable`; rebuilt the UI/UX route around sourced, checkable rules;
patched backend and security skills from verified upstream sources.

### Removed

- `impeccable` skill, its mandatory critique step in `CORE.md` and every
  sibling route, and its `skill-map` entry (`f145ebb`). Visual critique stays
  with `design-taste` / `admin-dashboard`; browser proof with `ui-validation`.

### Changed

- `design-taste`: generated-look calibration and plan check (Anthropic
  `frontend-design`, Apache-2.0); decision record written before the first
  visual edit, with page anatomy; real-product reference sources; Indonesian
  triggers; new niche `professional-services.md` (B2B service firms);
  `tells-scan.py` adds `arrow-label`, `middot-meta`, `default-look-palette`.
- `design-taste/references/accessibility-notes.md`: 14 more web interface
  checks (Vercel Web Interface Guidelines, MIT); `ui-validation` runs them as
  a `file:line` pre-flight.
- `shadcn-ui`: missing official composition/color rules (official `shadcn`
  skill, MIT), style choice as a density decision (Mira/Rhea dense, Lyra/Sera
  sharp), KPI recipe moved to semantic tokens.
- `admin-dashboard`, `admin-product-ux`: table and filter craft (Pencil &
  Paper, 2026), MIT table registries, AGPL and stock-template guardrails,
  reference sources.
- `application-security`: `references/supply-chain.md` (pnpm/npm install
  hardening with verified versions, package-existence gate), pre-commit
  scanner gate, prototype-pollution and whole-object serialization sinks.
- `supabase-stack`: anonymous-role RLS trap, token validity after user
  deletion, RLS on every exposed table, pgTAP RLS tests, incident rationale.
- `openapi-spec`: RFC 9457 problem details, cursor pagination with bounded
  `limit`, 429 + `Retry-After`; `references/http-api-design.md` (Zalando
  rules, CC-BY-4.0).
- `better-auth-security`: organization RBAC in `references/auth-flows.md`
  (server `hasPermission`, last-owner and deletion guards).
- `native-first`, `postgres-drizzle`, `testing-engineering`,
  `prd-taskbreaker`, `github-actions`: package-existence check,
  `pg_stat_statements` and N+1, Testcontainers vs PGlite vs pgTAP, vague-term
  spec check, optional zizmor.
- `dotsync pull` / `autopull` now also run `skill-update`, so a pulled skill
  add or remove reaches every runtime (Codex per-skill links) on other devices.

### Other devices

- `dotsync pull` (or the shell-start autopull) applies this release, including
  the skill sync. Then delete the leftover CLI cache outside the repository:
  `rm -rf ~/.impeccable`. Details: `docs/ai-memory-sync.md` § Another device.

### Verification

- Claims checked against primary sources (vendor docs, source code, papers);
  unverifiable ones dropped. `skill-check` 74 skills 0 failures 0 warnings;
  `skill-map-test`, `ai-policy-lint`, `skill-surface-check`,
  `skill-check-test`, `skill-update-test`, `dotsync-test`,
  `test-tells-scan.py`, `test-contrast.py` passed.

## v2026.09.29.1

Memory-only follow-up to the morning tag: three facts learned in the day's
AdsBookCMS and UI work, no skill or runtime change.

### Changed

- `projects-platforms.md`: zvarashop rejoined the AdsBookCMS product line
  (install `cdc2d6c`, merge parent product `cf665db`) after its store-authored
  `0055`–`0057` migrations left the chain; how to import a `wrangler d1 export`
  dump locally (tables first, then rows, then indexes, with
  `PRAGMA defer_foreign_keys = true`).
- `preferences.md`: UI invariant — at most one WhatsApp/contact call to action
  per page, placed after the user's task is done.
- `workflow.md`: when directing another AI terminal, write prompts as the lead
  developer's direct technical instructions, without relay attribution.

### Verification

- `ai-memory-check`, `ai-memory-check-test` and `ai-policy-lint` passed;
  `ai-doctor` OK (notes: three lesson candidates awaiting `ai-learn` review).

## v2026.09.29

A full skill audit: every owned and vendored skill validated, every managed fork
re-diffed against its upstream, and hand-written skills checked against the
vendors' own published Agent Skills. 72 owned skills (was 67 at the last tag).

### Added

- `impeccable` (vendored, pbakaus/impeccable), `threejs`, `chain-of-thought`,
  `sandbox-migrate-to-next` and `cloudflare-one-migrations` (vendored; sibling
  skills already routed to them by name).
- `impeccable` runs automatically after UI is built or changed, before
  `ui-validation`. The rule lives in `CORE.md`, so every runtime carries it, and
  in the workflow of each UI skill.
- `_refresh-vendored.sh` reports, read-only, which files of a managed fork now
  differ from upstream. It used to print only "skip", which is how nine forks
  drifted unnoticed.
- Vendor-sourced corrections and gotchas in `supabase-stack`,
  `better-auth-security`, `vercel`, `nextjs-development`, `shadcn-ui`,
  `postgres-drizzle`, `hydrogen-development`, `headless-shopify`,
  `testing-engineering` and `github-actions`. Each item was checked against
  the cited source; unconfirmed survey claims were dropped (for example,
  shadcn CLI 4.21.0 still has `init --base`).
- Tokophi pull-first rule in project memory; pi 9router catalog refresh;
  `docs/DOTFILES_SITEMAP.md`.

### Changed

- Forks reconciled with current upstream: `cloudflare`, `wrangler` (manual
  split retired), `durable-objects`, `stripe-best-practices`,
  `cloudflare-email-service`. Local divergences are now limited to defects
  upstream still carries, each recorded in `.local-fork` with evidence.
- `web-perf` and `turnstile-spin` are recorded as forks of cloudflare/skills.
- The six UI/UX skill descriptions name one owner per concern within the
  first ~240 characters.

### Fixed

- `ai-memory-check` scanned git-ignored directories, so `ai-policy-lint` failed
  on a link inside the claude.ai-synced skill copy.
- `supabase-stack` RLS examples: missing `TO authenticated` and `WITH CHECK`,
  an admin check that read the Postgres role, `SECURITY DEFINER` without
  `search_path`.

### Verification

- `skill-check`: 72 skills, 0 failures, 0 warnings. `skill-surface-check`
  clean. `ai-policy-lint` passed. `ai-doctor` OK (local-changes notes only).
- `vendored-refresh-test`, `ai-memory-check-test`, `security-check-test` and the
  other repository tests passed; the fork-drift and git-ignore guards were each
  shown to fail when the new code is removed.

### Known limitations

- `omp-effective-routing-test` still fails for the optional `codex-only.yml`
  reference: `openai-codex/gpt-5.6-sol` selectors are unusable on this device.
  OMP config was not changed in this release.
- `nextjs-on-cloudflare` is not vendored: its body tells the agent to run a
  skill installer that would write into `skills/local` through the runtime links.

## v2026.09.11

Local setup on `rich` was synchronized with `775873d`. The installer refreshed
runtime command links, canonical AI rules and hooks, managed skill adapters,
tmux configuration, and the device registry. `mise install` confirmed that the
tracked toolchain was already present.

OMP was subsequently updated from 18.1.16 to 18.1.17 through its native updater,
with the release SHA-256 verified. OMP versions are device-local, not pinned by
dotfiles; shared context and all 67 owned skills remain linked to the repository.

### Added

- `vercel` skill and React performance reference for repository-aware Vercel
  releases and Next.js performance work.
- Regression coverage for policy linting, mutation sweeping, safe Pi updates,
  tmux setup, and PostgreSQL backup handling.
- Terminal-dialogue guidance and twelve synthetic evaluation cases for informal
  intent, language, authorization, and evidence preservation. These are fixtures,
  not a claim of cross-provider behavioral validation.
- Public UI research and review guidance, including reference-backed design
  decisions and checks against repetitive generated layouts.
- Python subject mutation support in `mutation-sweep`.

### Fixed

- macOS portability in the mutation and gate scripts by avoiding Bash 4-only
  associative arrays.
- OMP isolation reporting, runtime command mapping, and policy checks so their
  observed state matches the current runtime contract.

### Verification

- After the OMP update, `ai-doctor` passed with a pending local-changes warning.
- Skill surface check reports 67 available local skills and no stale command
  references.
- `omp-routing-test` and `omp-workspace-test` passed on OMP 18.1.17.

### Known limitations

- `omp-effective-routing-test` failed for the optional `codex-only.yml` reference:
  two selectors use `openai-codex/gpt-5.4-mini:low`, unavailable on `rich`.
  Hosted provider selectors without local authentication remain unjudged.
  These reference overlays are not loaded automatically by native OMP.

## v2026.09.04

Twenty-eight commits at the tag. A ten-task queue (TASK-047..058) carried end to end with
eight independent reviews across two model routes. Five of the ten produced
corrections to claims the implementer had made — recorded here because that is
the useful part.

### The theme

Every defect fixed this release is the same shape: **a guard that did not guard.**
None was found by reading. All were found by breaking something and checking
whether anything noticed.

### Added

- **`mutation-sweep`** — replaces `bin/<name>` with a stub that exits 0, runs
  `bin/<name>-test`, and reports whether the test noticed. The stub records its
  own invocation, so a test that passes without running it is `UNSWEEPABLE` by
  name rather than counted healthy. Result on this repository: 41 pairs,
  **0 SURVIVED** — no test here is wholly empty.
- **`skill-map`** — renders `skills/local/README.md` from frontmatter: 66 skills
  in 11 domains, each with its first registry sentence and the siblings it
  mentions. `--check` fails a stale map by name; `ai-policy-lint` runs it.
- **Ten tests for commands that had none**, including `ai-doctor` — 658 lines,
  the health command every other gate defers to, itself judged by nothing.
- **`README.md`**, which had been 0 bytes on `origin/main` since 2026-08-30.

### Fixed

- **`ai-memory-hygiene` had a branch that could not execute.** Its size check
  returned at the advisory limit (20,000) before consulting the router budget
  (12,000), so "this file can NEVER be selected" was unreachable for every
  project file between them. Two were in that gap while the gate reported zero
  issues.
- **`skill-check` measured with a different ruler than it validated with** —
  an awk scan over by 188 characters across 36 skills. That number is the one
  figure a task can be held to.
- **`resume-brief` could not see a contract with no run.** A freshly accepted
  queue of eight reported "0 ready to start" — the command whose job is
  answering "where am I" saying "nowhere to go" at the moment there was most
  to do.
- **The memory router reached 26 of 69 project-memory files.** A project key may
  now name a list with per-file triggers; `ai-policy-lint` fails by name on any
  file no route reaches. Review caught that the first draft let a trigger-matched
  memory file outrank `STATUS.md` and `.delivery/current.json` — inverting the
  router's own rule that repository evidence is authoritative.
- **Payment work routed only to Stripe**, which no project uses, while DOKU,
  AutoLaris and Mengantar appeared in no routing table at all.
- **The multi-account Claude switcher was retired in 2026-07-29 but never
  removed.** A second profile survived on this device, still taking session
  writes with no `settings.json` — no `.env` deny, no hooks. Both installers now
  retire it; `device-register` reports it so the committed device record answers
  "is this machine clean?" without logging in.
- **`task.isolation.mode`** pinned a name OMP no longer prints. Behaviour was
  never affected; the gate's view of it was.

### Also fixed after the tag

- **`skill-map-test` failed only through its installed command link.** Direct
  repository execution passed, but `~/.local/bin/skill-map-test` treated
  `~/.local` as the repository root. Root discovery now follows relative and
  absolute symlinks, with a regression case for the installed invocation.
- **`shopify-content-helper` shipped the CTA text `CLAUDE.md` forbids.** Its meta
  templates offered "Buy Online at [Brand]", "Shop … at [Brand]" and "order online
  today", and asserted "Free Shipping & Best Price" about a shop the command knows
  nothing about — so the tool made the breach the path of least effort. Six
  templates replaced with descriptive ones. Found by reviewing the test written
  for the command, whose own header promised a CTA check and made none.
- **Its `≤60` and `≤155` headers were labels, not checks.** A 35-character keyword
  produced titles of 63, 70 and 73 characters under a header still claiming the
  limit. Each template now reports its length and names an overrun. Same defect
  shape as the CTA, found only because the first one was.

### Removed

- `cloudflare-one-migrations` — the one skill with no basis here after auditing
  all 67. Everything else that looked droppable was load-bearing.
- `config/omp/config.yml.lock`, `docs/dev-setup.md`, `docs/preview/` — verified
  by independent search to have no reader.

### Corrected in the record

- **Repository visibility is no longer recorded in memory at all.** Commit
  messages this cycle called it public, taken from a memory line instead of the
  `gh api` check `CLAUDE.md` names for exactly that claim. The line was corrected
  to private at 05:0x on 2026-09-04 — and by 06:34 the same morning `gh api`
  reported public again. A state written down is a claim with an expiry nobody
  sees, so the memory now carries only the command to run at the moment of the
  claim. The commit messages stand as written.
- TASK-049's original targets were unmeasured guesses and were **dropped, not
  renegotiated** after review showed the justification for dropping them was
  falsified by the artifact itself.

### Known limits

- `mutation-sweep`'s single operator finds wholly empty tests, not partially
  vacuous ones. It would **not** have caught the defect that motivated it.
- Four commands still have no test: `dotpush`, `vps-pgdump`, `tmux-setup`,
  `pi-update-safe`. The first wording here said they have "no safe seam"; review
  showed that is false — each is testable behind a shim, and `pi-update-safe`
  already exposes `PI_RUNTIME_SKILL_DIRS` for exactly that. "No seam" was doing
  work that "needs a shim" should do.
- **The ten tests shipped with escapes.** The review that returned after the tag
  found a plausible bug slipping past nine of them, including an `ai-doctor-test`
  that pinned this machine's health rather than the subject's contract and would
  have failed on any device reporting a single finding. Fixed after the tag.
- Two memory files exceed the router budget and can never be selected. They are
  now reported on every hygiene run instead of passing in silence.

## v2026.08.17

Prior baseline. See `docs/archive/` for the task contracts of that cycle.

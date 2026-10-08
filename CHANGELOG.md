# Changelog

Dated releases, newest first. `vYYYY.MM.DD`. Repository tests and runtime
evidence outrank anything written here; where this file and `TASKS.md` disagree,
`TASKS.md` and the `.delivery/` run records are authoritative.

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

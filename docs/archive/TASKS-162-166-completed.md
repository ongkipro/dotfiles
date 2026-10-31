# TASK-162 to TASK-166 — completed

Moved verbatim from `TASKS.md` when each task finished (2026-10-31).
TASK-162 was committed in 43fdc01; its independent audit findings are fixed by TASK-166.

### TASK-162: SEO skill family refresh (Google 2026, executable checks)
- **Requirement:** REQ-SEO-SKILLS-2026 (owner request 2026-10-31; evidence in `~/Documents/work/research/seo-audit-2026-10/`).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/{seo-website-builder,ai-traffic-os,automated-traffic-pipeline}/**`, `skills/local/content/SKILL.md`, `skills/local/copywriting/SKILL.md`, `skills/local/writer/references/seo.md`, `skills/local/README.md`, `docs/DOTFILES_SITEMAP.md`, `TASKS.md`.
- **Canonical Contract Owners:** `seo-website-builder` owns classic SEO, IndexNow, sitemap, robots; owner conventions stay in `~/.config/ai/memory/preferences.md`.
- **Accepted Invariants:** owner metadata rules unchanged and never presented as Google rules; each changed external fact cites a primary source read 2026-10-31; no new dependency; SKILL.md under 12 288 bytes; scripts zero-dependency with a test that can fail.
- **Regression Checks:** `skill-check`, `skill-map-test`, `system-map-test`, `ai-policy-lint`, `ai-memory-check`, `ai-doctor --self-test`, `node skills/local/seo-website-builder/scripts/seo.test.mjs`.
- **Runtime Evidence:** Astro 7.4.4 and Next.js 16.4.3 builds checked by `check-page.mjs` (audit report Part 6).
- **Reopen Conditions:** a cited Google page changes the fact; a skill exceeds its ceiling.
- **Non-Scope:** Shopify or live-site changes, Search Console actions, other skills, commit/push.
- **Escalation Conditions:** a change would alter an owner convention or need a dependency.

### TASK-163: UI skills — correct stale and wrong facts
- **Requirement:** REQ-UI-SKILL-ACCURACY (owned UI skills state current, verifiable facts; inventory `~/Documents/work/research/dotuiux/sources/internal-inventory.md`, re-verified 2026-10-30).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/design-taste/references/motion-platform-support.md`, `skills/local/design-taste/references/motion-craft.md`, `skills/local/native-first/references/astro.md`, `skills/local/admin-dashboard/references/clean-light-cms-baseline.md`, `skills/local/shadcn-ui/references/component-examples.md`, `skills/local/hydrogen-development/references/hydrogen-2026-10-architecture.md`, `skills/local/hydrogen-development/references/official-integrations.md`, `config/ai/memory/ui-lessons.md`, `TASKS.md`.
- **Canonical Contract Owners:** ui.browser-support and ui.motion -> `design-taste`; admin.visual-contract -> `admin-dashboard`.
- **Accepted Invariants:** each changed fact cites a primary source with a retrieval date; scroll-driven animations stay progressive enhancement; no rule loosened beyond the corrected fact. Items: Firefox 159 ships scroll-driven animations (2026-10-27, MDN BCD); `#525252` on `#ffffff` is 7.81:1; no `design-taste` §4.2.1 exists; `<dialog closedby>` needs the light-dismiss fallback; admin viewports 390/1366/1536.
- **Regression Checks:** `design-tools-test`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-hygiene`.
- **Runtime Evidence:** `contrast.py "#525252 on #ffffff"` output; MDN BCD `animation-timeline` with retrieval date.
- **Reopen Conditions:** a browser-support row or quoted ratio disagrees with its source again.
- **Non-Scope:** new rules or gates, vendored `gsap-*` text, motion policy (TASK-164), commit/push.
- **Escalation Conditions:** a fix would change a policy, not only a fact.

### TASK-164: UI skills — one motion policy
- **Requirement:** REQ-UI-SKILL-CONSISTENCY (one motion policy across owned and vendored UI skills; owner accepted D1–D4 on 2026-10-31; research `~/Documents/work/research/dotuiux/02-round2-synthesis.md` §3, §11).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/design-taste/SKILL.md`, `skills/local/design-taste/references/{motion-craft,color-scales-and-skinning}.md`, `skills/local/admin-dashboard/references/admin-visual-contract.md`, `skills/local/native-first/references/browser.md`, `skills/local/shadcn-ui/references/component-examples.md`, `skills/local/gsap-{core,react,performance}/**` (incl. `.local-fork`), expanded to `skills/local/gsap-timeline/{SKILL.md,.local-fork}` after review (D1 easeReverse example), `skills/local/README.md`, `docs/DOTFILES_SITEMAP.md`, `docs/archive/TASKS-162-166-completed.md`, `TASKS.md`.
- **Canonical Contract Owners:** ui.motion -> `design-taste` (`motion-craft.md`); ui.theme -> `design-taste` §2; skills.provenance -> `.local-fork`.
- **Accepted Invariants:** D1 entries and exits ease-out, no ease-in on UI; D2 display tracking −0.02em max (admin page title `tracking-[-0.02em]`); D3 vendored `gsap-*` keep upstream sentences, local policy only as `> **Local (dotfiles):**` blockquotes recorded in `.local-fork` (gsap-scrolltrigger has no overlay: at its `.size-debt` cap); reduced motion by substitution; transient `will-change`; D4 animated blur warn >8 px, fail >10 px; theme toggle three-state only when both themes ship.
- **Regression Checks:** `design-tools-test`, `skill-surface-check`, `skill-upstream-test`, `vendored-refresh-test`, `ai-policy-lint`, `skill-map --check`.
- **Runtime Evidence:** None (documentation; dry-run port evidence in `~/Documents/work/research/dotuiux/patches/PORT.md`).
- **Reopen Conditions:** an owned or vendored skill again prescribes a motion rule that contradicts `motion-craft.md`.
- **Non-Scope:** the `dotuiux check` gate runner (TASK-165), commit/push.
- **Escalation Conditions:** an overlay would change vendored refresh semantics or skill frontmatter.

### TASK-165: `dotuiux` command and skill (with shadcn MCP rules and CI)
- **Requirement:** REQ-DOTUIUX (owner 2026-10-31: one UI/UX loop — brief, live-site teardown, `DESIGN.md` direction, rendered check, owner review — that UI tasks route through; research `~/Documents/work/research/dotuiux/03-dotuiux-brief.md`). Includes REQ-UI-DOC-DEFAULTS (shadcn MCP optional, CLI stays the source of truth) because `shadcn-ui/SKILL.md` carries both hunks.
- **Risk Level:** R2.
- **Allowed Paths:** `bin/dotuiux`, `bin/dotuiux-test`, `config/ai/runtime-commands.txt`, `skills/local/dotuiux/**`, `skills/local/{design-taste,admin-dashboard,storefront-ux,ui-validation,shadcn-ui,development-kit}/SKILL.md`, `bin/skill-map`, `skills/local/README.md`, `docs/DOTFILES_SITEMAP.md`, `.github/workflows/core-runtime.yml`, `docs/archive/TASKS-162-166-completed.md`, `TASKS.md`.
- **Protected Paths:** `skills/local/design-taste/scripts/**`, `skills/local/admin-dashboard/scripts/**` (reused, not changed).
- **Canonical Contract Owners:** ui.loop -> `dotuiux`; ui.direction -> `design-taste` / `admin-dashboard`; ui.capture -> `design-taste/scripts/ui-ref.mjs`; ui.proof -> `ui-validation`; storefront contact CTA -> `storefront-ux` (D9: one per page, checkout-handoff exception); components.shadcn -> `shadcn-ui`.
- **Accepted Invariants:** zero dependencies; `init` never overwrites; `teardown` refuses gallery hosts; `check` reports fail / warn / allowed / not checked, never a pass for an unmeasured item; warns overridable by `allow: <id> — <reason>` in `DESIGN.md`; fail floor of 13 harm-only rules; output goes to the client repo; `config/ai/CORE.md` not edited; no SEO rule or gate; shadcn MCP project-scope, version-pinned, registries explicit, tokens via env only.
- **Regression Checks:** `DESIGN_TEST_REQUIRE_FULL=1 dotuiux-test`, `design-tools-test`, `skill-check`, `skill-surface-check`, `skill-map --check`, `system-map --check`, `ai-policy-lint`, `actionlint`, `ai-doctor --self-test`.
- **Runtime Evidence:** `dotuiux check` on a public and an admin fixture page and `teardown` on live sites (dotuiux-test fixtures + the session check); `skill-update` discovery per device stays an owner step.
- **Reopen Conditions:** a check passes an unmeasured item; a warn cannot be overridden; a UI task skips the skill when no brief/`DESIGN.md` exists.
- **Non-Scope:** npm dependencies (axe-core, `impeccable`, `@google/design.md`), MCP installs, D7 Motion AI Kit copy, D8 sandbox trial, D12 copy-slop list, any SEO change.
- **Escalation Conditions:** the runner needs an npm dependency; skill routing proves insufficient in a runtime (then a CORE edit within its byte budget).

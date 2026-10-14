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

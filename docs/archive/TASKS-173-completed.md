# TASK-173 — completed

Moved from `TASKS.md` when it finished (2026-11-01).

### TASK-173: CI cost on a private repository
- **Requirement:** REQ-CI-DETERMINISM (owner 2026-11-01: make `ongkipro/dotfiles` private and keep CI within the Actions minute quota).
- **Risk Level:** R2.
- **Allowed Paths:** `.github/workflows/core-runtime.yml`, `.github/workflows/development-spec-suite.yml` (scope expansion after review), `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-173-completed.md`, `docs/DOTFILES_SITEMAP.md`.
- **Done:**
  - Pushes and pull requests run the Ubuntu self-test and the design-tool fixtures.
  - The macOS self-test runs weekly (Monday 02:17 UTC) and on `workflow_dispatch`, because macOS minutes bill at 10x on a private repository.
  - The repository visibility changed to private after this commit.
- **Review:** independent review PASS; its two notes were applied: a missing secret on a scheduled or manual run now fails instead of passing with a notice, and `development-spec-suite.yml` got the same macOS policy.
- **Accepted Invariants:** every push still verifies the locked-rule signature on Ubuntu; macOS coverage is weekly, not per push.
- **Regression Checks:** `actionlint`; `bin/ai-policy-lint-test`; the first push runs only the Ubuntu jobs.
- **Reopen Conditions:** a macOS-only regression lands and is first seen by a weekly run; the Actions quota is still exceeded.
- **Non-Scope:** GitHub plan changes. Branch protection on a private repository needs GitHub Pro.

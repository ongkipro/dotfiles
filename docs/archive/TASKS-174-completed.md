# TASK-174 — completed

Moved from `TASKS.md` when it finished (2026-11-02).

### TASK-174: `dotuiux` — reference guide, side-by-side compare, independent visual review
- **Requirement:** REQ-DOTUIUX (owner 2026-11-02: UI/UX builds still miss on taste; run the review recommendations — sharper reference guide, render-vs-reference comparison, independent visual review, new-generation slop signals, DESIGN.md and section budgets, recorded owner pick).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotuiux`, `bin/dotuiux-test`, `skills/local/dotuiux/**`, `skills/local/design-taste/SKILL.md`, `skills/local/ui-validation/SKILL.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-174-completed.md`, `docs/DOTFILES_SITEMAP.md`.
- **Protected Paths:** `skills/local/design-taste/scripts/**`, `skills/local/admin-dashboard/scripts/**`.
- **Accepted Invariants:** floor (fail) set unchanged; new rules enter as warn; zero dependencies; unmeasurable stays NOT CHECKED; `validate` additions are warnings so existing projects keep passing.
- **Regression Checks:** `bin/dotuiux-test`; `skill-check`; `bin/system-map --check`; a real run of `dotuiux compare` and `check` on `~/Projects/winninghouse`.
- **Non-Scope:** fixing client pages; commit/push.
- **Done:** `dotuiux compare` (side-by-side sheets scaled to ≤ 1400 px and cut into parts, outline report, C-item checklist, independent-review prompt with coverage limits); section outline in `teardown`/`check`; warn rules `section-count`, `eyebrow-overuse`, `numbered-labels`, `mono-overuse`; `validate` warnings for DESIGN.md > 150 lines, a Direction without `Picked-by: owner <date>` (per Direction section), and missing C-items; skills `dotuiux` (compare + independent verdict, `references/reference-reading.md`), `design-taste` (one capture path, owner pick, one C-item per line), `ui-validation` (verdict on compare sheets).
- **Real page:** `~/Projects/winninghouse` (dist build, before another session's edits): 0 fail and 3 new warns, all true positives (kicker on 6/8 headings, index labels in 3–4 sections, 12–16 % monospace text); compare against ShipBob showed 14 vs 11 sections; an independent Claude review on the sheets returned REVISE (buried simulator, "9 brands" showing 4, no Dual Hub block, fake system-status card; C1–C3 REVISE).
- **Review:** codex REVISE (4 findings: below-sample PASS, single index label missed, `## Direction — <page>` unread, C-items on one line) → fixed with regression cases. Claude re-review REVISE (month-name dates and spaced times counted, one Direction's pick vouching for another, unquoted printed shell paths, dead test write) → fixed with regression cases; own finding: sheet height double-scaled by zoom cut 1440 sheets short → fixed with a coverage test.
- **Ledger:** `RUN-20261102T075213Z-3563f614` finished **BLOCKED**, not PASS: the boundary failed only because a concurrent session edited the unrelated `config/ai/project-memory/beauty-clinic-saas.md` after the run started; every TASK-174 path was ALLOWED.

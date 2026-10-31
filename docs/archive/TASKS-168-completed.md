# TASK-168 — completed

Moved from `TASKS.md` when it finished (2026-10-31).

### TASK-168: `dotuiux` — close the open research items
- **Requirement:** REQ-DOTUIUX (owner 2026-10-31: scan and review `~/Documents/work/research/dotuiux/`, use it to finish `dotuiux`).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotuiux`, `bin/dotuiux-test`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-168-completed.md`, `docs/DOTFILES_SITEMAP.md`.
- **Protected Paths:** `skills/local/design-taste/scripts/**`, `skills/local/admin-dashboard/scripts/**`.
- **Scan result:** Task A/B, docs, CI and the CLI/skill from `patches/` and `staging/` are already ported (TASK-163–165). Open items in dotuiux scope: D2 accepted with no gate; two non-blocking follow-ups from the TASK-165 re-review (partial ref dir after a late gallery hop; no browser fixture for a contrast PASS).
- **Done:** warn rule `display-tracking` (D2, ≥ 24 px, tighter than −0.02em, overridable); teardown removes a ref dir it created when the render fails; clean-page contrast PASS asserted in the browser.
- **Accepted Invariants:** floor (fail) set unchanged at 13; new rule enters as warn (§17 rule 5); zero dependencies; output stays in the client repository.
- **Deliberately not added:** subhead/card-line/button-word warns and the 44 px target warn from synthesis §4/§16 — not in the accepted brief §3 gate list, and §17 requires a real failure case before a rule enters. D7 (Motion AI Kit text), D8 (sandbox trial), D10 (SEO lane), D12 (copy slop, `copywriting`/`writer`) are owned elsewhere.
- **Regression Checks:** `bin/dotuiux-test` (plus two mutation runs that fail as expected), `bin/system-map --check`, `bin/system-map-test`, `skill-check`.
- **Non-Scope:** commit/push.

# TASK-167 — completed

Moved from `TASKS.md` when it finished (2026-10-31).

### TASK-167: `dotuiux` integration parity with `dotads-meta`
- **Requirement:** REQ-DOTUIUX (owner 2026-10-31: scan, review and finish `dotuiux` inside dotfiles to the level of the `dotads-meta` tooling).
- **Risk Level:** R1.
- **Allowed Paths:** `TASKS.md`, `CHANGELOG.md`, `bin/dotuiux` (header comment only), `bin/system-map-test`, `skills/local/dotuiux/SKILL.md`, `config/ai/memory/skills.md`, `docs/archive/TASKS-167-completed.md`.
- **Protected Paths:** `skills/local/design-taste/scripts/**`, `skills/local/admin-dashboard/scripts/**`.
- **Canonical Contract Owners:** ui.loop -> `dotuiux`; lookup -> `system-map`; changelog -> `CHANGELOG.md`.
- **Accepted Invariants:** no gate, threshold, or behaviour change in `bin/dotuiux`; skill wording matches the `init` scaffold and `validate` headings; no installer workspace (dotuiux writes only into the client repository).
- **Findings fixed:** no CHANGELOG entry for TASK-165; no locked system-map lookup rows (dotads-meta has one); no memory pointer (dotads-meta has one in `skills.md`); `bin/dotuiux` cited `research/dotuiux/…` as if in-repo; SKILL §1 listed brief items that did not match the scaffold headings; SKILL §2 said 3–8 URLs while the scaffold, `init` output and research brief say 3–5.
- **Regression Checks:** `bin/dotuiux-test`, `bin/system-map-test`, `bin/system-map --check`, `skill-check`, `ai-memory-check`.
- **Non-Scope:** new gates, installer changes, commit/push.

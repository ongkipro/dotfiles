# TASK-191 — completed

Moved from `TASKS.md` on 2026-11-05 (TASK-192).

### TASK-191: Policy lint and system map green
- **Requirement:** REQ-POLICY-LINT-GREEN (owner 2026-11-05: archive finished history, complete legacy fields, ignore `.pi/`, all gates exit 0).
- **Risk Level:** R1.
- **Allowed Paths:** `TASKS.md`, `docs/archive/TASKS-177-190-completed.md`, `.gitignore`, `docs/DOTFILES_SITEMAP.md`.
- **Protected Paths:** `config/ai/project-memory/tokophi-repo-private-ruling.md`.
- **Canonical Contract Owners:** `TASKS.md`; `docs/archive/`; lint and system-map (unchanged).
- **Accepted Invariants:** archived text verbatim; no ID reuse; open tasks stay here; lint rules not weakened.
- **Regression Checks:** `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** `TASKS.md` over budget again, or an archived record loses its text.
- **Non-Scope:** lint/system-map code; open task contracts; commit/push.
- **Escalation Conditions:** green requires weakening a rule or editing another device's file.
- **Ledger:** RUN-20261105T092529Z-2b426792 PASS.

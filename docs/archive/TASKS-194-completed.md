# TASK-194 — completed 2026-11-05

Shipped in `6dbeaea`; ledger run `RUN-20261105T111427Z-de67b57b` PASS; independent review APPROVE after six fixes; CI green.

## TASK-194: Commerce insight, CPAS cpas_v1, history supersede and offline learning refresh
- **Requirement:** REQ-META-LEARNING-REFRESH (owner 2026-11-05: improve dotads-meta learning and insight for e-commerce/web conversion and CPAS phase 1; supersede partial history; offline refresh for real accounts later; dummy accounts removed; no CTWA).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/_dotads-workspace.mjs`, `bin/_dotads-workspace-test.mjs`, `bin/dotads-meta`, `bin/dotads-meta-test`, `bin/_dotads-meta-provider.py`, `bin/_dotads-meta-provider-test.py`, `skills/local/meta-ads-cli/**`, `TASKS.md`, `CHANGELOG.md`.
- **Protected Paths:** `config/ai/project-memory/tokophi-repo-private-ruling.md`.
- **Canonical Contract Owners:** `_dotads-workspace.mjs` (commerce insight, learning memory); `_dotads-meta-provider.py` (metric profiles); runtime reference.
- **Accepted Invariants:** snapshots and snapshot hashes never change; legacy requests/scopes byte-identical; learning IDs content-addressed; superseded entries kept for audit and never resurrected by import; parents never superseded; no live calls in refresh; no profit or causal claims.
- **Regression Checks:** `_dotads-workspace-test.mjs`, `_dotads-meta-provider-test.py`, `dotads-meta-test`, syntax, `skill-check`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a refresh changes snapshot bytes, a superseded entry reappears, or aliases are summed.
- **Non-Scope:** WhatsApp/CTWA features; CPAS catalog-observation file and product query; live account reads; commit/push before owner review.
- **Escalation Conditions:** a change needs live Meta access or rewriting existing snapshots.

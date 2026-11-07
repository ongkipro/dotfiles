# TASK-197 — completed 2026-11-07

Shipped in `f1bc9ce`; ledger run `RUN-20261106T195102Z-56cb7d27` PASS; independent review APPROVE (Fable 5.1, two rounds; GPT unavailable at the time, recorded as a limit).

## TASK-197: Review and harden the MacBook CPAS 1-1-1 commit (08480c6)
- **Requirement:** REQ-CPAS-REVIEW (2026-11-07: review `08480c6`; dotfiles stays public).
- **Risk Level:** R3.
- **Allowed Paths:** `bin/_dotads-meta-provider.py`, `bin/_dotads-meta-provider-test.py`, `bin/_dotads-workspace.mjs`, `bin/_dotads-workspace-test.mjs`, `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/**`, `config/ai/memory/meta-ads.md`, `config/ai/memory/preferences.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-196-completed.md`.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md`, `config/ai/README.md`, `config/ai/project-memory/**`, `skills/local/development-kit/**`.
- **Canonical Contract Owners:** `_dotads-meta-provider.py`; `cpas-collaborative-ads.md`; `meta-ads-cli/SKILL.md` §1.
- **Accepted Invariants:** default inventory request/hashes match `6e38288`; CPAS fields only with `cpas_v1`; deploy dry-run/`PAUSED`/lock retained/no token printed; live mutations require owner approval; no client figures in public files.
- **Regression Checks:** `workspace`, `provider`, `dotads-meta-test`, `skill-check meta-ads-cli`, `ai-policy-lint`, `ai-memory-link --check`, `system-map --check`, `security-check`.
- **Reopen Conditions:** default request changes without profile, SDK activates without `--activate`, or client figures enter public files.
- **Non-Scope:** making repo private; history rewrite; live Meta reads.
- **Escalation Conditions:** live account call or history rewrite.

## Pending

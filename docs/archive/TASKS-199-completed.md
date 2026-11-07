# TASK-199 — completed 2026-11-07

Shipped in `6e2cf00`; CI green on that SHA; GPT-6.1 Sol review round 2 APPROVE; ledger `RUN-20261107T053719Z-0c70a9d4` PASS.

## TASK-199: Parallel AI development machine guide, research memory and CI fix
- **Requirement:** REQ-PARALLEL-GUIDE (owner 2026-11-07). Full contract: [TASKS-199-contract-full](TASKS-199-contract-full.md).
- **Risk Level:** R2.
- **Allowed Paths:** `docs/parallel-ai-dev-machine.md`, `docs/research/parallel-ai-dev-machine-2026-11-07.md`, `config/ai/memory/{parallel-research,preferences,meta-ads}.md`, `config/ai/memory-router.json`, `config/mise-config.toml`, `docs/linux-dev-setup.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, `config/ai/project-memory/**`, `skills/local/development-kit/**`.
- **Accepted Invariants:** `preferences.md` inside the router budget; moved Meta Ads rules keep every sentence and authorise no unapproved live change; no private figures or identifiers in public files; no macOS support claim; scraping defaults stay a labelled proposal.
- **Regression Checks:** `ai-doctor --self-test`, `ai-memory-route-test`, `ai-policy-lint`, `system-map --check`, `ai-memory-link --check`, `security-check`.
- **Reopen Conditions:** CI memory-budget failure; a moved rule stops loading under its trigger; a guide claim shown false elsewhere.
- **Canonical Contract Owners:** the guide (profile, rules, reproduction); `parallel-research.md` (research/scraping defaults); `meta-ads.md` (owner Meta Ads rules).
- **Non-Scope:** `AGENTS.md`/`llms.txt` (owner decision), macOS ports, off-machine backups, any `bin/` change.
- **Escalation Conditions:** a change needs sudo, a live account, or another session's files.


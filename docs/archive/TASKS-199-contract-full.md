# TASK-199 full contract (kept verbatim; TASKS.md carries the short form)

## TASK-199: Parallel AI development machine guide, research memory and CI fix
- **Requirement:** REQ-PARALLEL-GUIDE (owner 2026-11-07: turn the researched setup of this machine into a reference other devices can follow; add research and scraping rules; keep CI green).
- **Risk Level:** R2.
- **Allowed Paths:** `docs/parallel-ai-dev-machine.md`, `docs/research/parallel-ai-dev-machine-2026-11-07.md`, `config/ai/memory/parallel-research.md`, `config/ai/memory-router.json`, `config/ai/memory/preferences.md`, `config/ai/memory/meta-ads.md`, `config/mise-config.toml`, `docs/linux-dev-setup.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-197-completed.md`.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md`, `config/ai/README.md`, `config/ai/project-memory/**`, `skills/local/development-kit/**` (other sessions).
- **Canonical Contract Owners:** the guide (profile, rules, reproduction, labelled measured/sourced/assumption); `parallel-research.md` (research and scraping defaults, a proposal until the owner confirms); `meta-ads.md` (owner Meta Ads rules, moved verbatim from `preferences.md`).
- **Accepted Invariants:** `preferences.md` stays inside the memory router budget; the moved Meta Ads rules keep every sentence and no sentence authorises an unapproved live ad-account change; the public files carry no private business figures, account identifiers or project names beyond what the repo already publishes; macOS support is not claimed; scraping defaults stay labelled as a proposal.
- **Regression Checks:** `ai-doctor --self-test` (the CI suite), `ai-memory-route-test`, `ai-policy-lint`, `system-map --check`, `ai-memory-link --check`, `security-check`.
- **Reopen Conditions:** CI fails on memory budget again; a rule moved out of `preferences.md` stops loading under its trigger; a claim in the guide is shown false on another device.
- **Non-Scope:** an `AGENTS.md` or `llms.txt` (owner decision pending; research shows context files can raise cost without raising success); macOS ports of `heavy-run` and `dev-freeze`; off-machine backups; any change to `bin/`.
- **Escalation Conditions:** a change needs sudo, a live account, or another session's files.


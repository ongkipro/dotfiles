# TASKS index — archived 2026-11-12

Moved verbatim from `TASKS.md` to keep the hot file under its budget; earlier archives stay as they were.

## TASK-213: Inbox triage and the two lessons from this week
- **Requirement:** REQ-INBOX-TRIAGE (owner 2026-11-12: "audit dan sempurnakan").
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/postgres-drizzle/references/queries-and-concurrency.md`, `config/ai/memory/ops-lessons.md`, `config/ai/memory/development-lessons.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/**`; scope expansions recorded in the ledger: `config/ai/memory-router.json`, `bin/ai-memory-route-test`, `docs/DOTFILES_SITEMAP.md`.
- **Canonical Contract Owners:** `postgres-drizzle` skill; shared lesson memory.
- **Accepted Invariants:** a candidate already encoded in a repo or skill is closed as such, not duplicated; promoted facts cite an official source; memory files stay within the router budget.
- **Regression Checks:** `skill-check`, `ai-policy-lint`, `ai-memory-route-test`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a closed candidate turns out not to be encoded where its reason says.
- **Non-Scope:** project repositories.
- **Escalation Conditions:** none expected (documentation and memory only).
- **Outcome (2026-11-12):** see CHANGELOG 2026-11-12 (TASK-213). Run `RUN-20261112T112930Z-7af6ebf4`; independent review Gemini 4 Carbon high (round 1 FAIL: MVCC snapshot gap, lesson promotion path, archive placement, missing router tests; round 2 FAIL: `FOR KEY SHARE` does not conflict with a non-key update, sitemap scope; all fixed).

## TASK-214: `$HOME` stray `.git` wording after its removal on rich
- **Requirement:** REQ-HOME-GIT-WORDING (owner 2026-11-12: "sempurnakan … cek update dotfiles terbaru, config ke local, baru commit push").
- **Risk Level:** R0.
- **Allowed Paths:** `config/ai/CORE.md`, `config/ai/context/*.md`, `config/ai/hooks/memory-usage.sh`, `bin/memory-usage-hook-test`, `bin/dotsync-test`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/**`.
- **Canonical Contract Owners:** CORE (shared policy).
- **Accepted Invariants:** the rule ("never `git add -A` from `~`; check `git rev-parse --show-toplevel`") and the `$HOME` guards stay; only the claim that every device has the stray `.git` changes; CORE stays within its byte budget.
- **Regression Checks:** `ai-policy-lint`, `ai-memory-link --check`, `memory-usage-hook-test`, `dotsync-test`.
- **Reopen Conditions:** a guard that depends on `$HOME/.git` existing is found.
- **Non-Scope:** device-local files (done outside the repository).
- **Escalation Conditions:** none.
- **Outcome (2026-11-12):** see CHANGELOG 2026-11-12 (TASK-214).

## TASK-215: Astro 7.4 skill refresh and Astro AI tooling (docs MCP, Pi LSP)
- **Requirement:** REQ-ASTRO-AI-TOOLING (owner 2026-11-12: "skill astro … kebutuhan ai cli/terminal development astro … kerjakan dan sempurnakan 4 point").
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/astro-development/**`, `config/ai/mcp-servers.json`, `bin/ai-mcp-sync-test`, `config/pi/pi-lsp.json`, `config/pi/README.md`, `docs/DOTFILES_SITEMAP.md`, `skills/local/README.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/**`; ledger scope expansions: `bin/pi-9router-restore`, `bin/pi-9router-restore-test`, `install.sh`, `docs/linux-install-step-by-step.md` (the Astro LSP needs a device-specific `typescript.tsdk`).
- **Protected Paths:** `bin/ai-mcp-sync`, `bin/delivery-ledger`.
- **Canonical Contract Owners:** `astro-development` skill; `ai-mcp-sync` manifest; Pi LSP config.
- **Accepted Invariants:** every Astro claim is checked against the official docs or a run of astro 7.4.11; the docs MCP is a pinned stdio bridge with npx isolated like Playwright (`--prefix /tmp`), so every runtime gets it through the existing sync; no credential is involved; the Pi LSP entry only maps `.astro` files.
- **Regression Checks:** `skill-check`, `ai-mcp-sync-test`, `ai-mcp-sync --check`, `pi-9router-restore-test`, `ai-policy-lint`, `system-map --check`, `skill-map --check`, `security-check`.
- **Reopen Conditions:** an agent starts a second Astro dev server or cannot stop one; the docs MCP fails to start in a runtime.
- **Non-Scope:** project repositories; HTTP transport support in `ai-mcp-sync`.
- **Escalation Conditions:** a runtime rejects the new MCP entry.
- **Outcome (2026-11-12):** see CHANGELOG 2026-11-12 (TASK-215). Run `RUN-20261112T182130Z-edc58fd1`; independent review Gemini 4 Carbon high, two rounds (round 1: eight findings incl. `set -e` abort on a failing `npm`; all fixed), PASS.

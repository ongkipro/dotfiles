# TASKS index — archived 2026-11-15

Moved verbatim from `TASKS.md` to keep the hot file under its budget; earlier archives stay as they were.

## TASK-211: Retired MCP servers leave every device (FigCraft)
- **Requirement:** REQ-RETIRE-FIGCRAFT (owner 2026-11-11: FigCraft cleanup reaches every device); review of the Shopify session's skill work (`c10cdc2`).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/{ai-mcp-sync,dotsync}{,-test}`, `config/ai/mcp-servers.json`, `CHANGELOG.md`, `TASKS.md`, `skills/local/{shopify-development,hydrogen-development,github-actions}/**`.
- **Canonical Contract Owners:** `config/ai/mcp-servers.json` (`retiredMcpServers`), `ai-mcp-sync`.
- **Accepted Invariants:** only listed server names and listed `$HOME`-relative paths are removed; links are unlinked, never followed; a name cannot be both active and retired; unrelated servers, settings and files are preserved; user documents are never listed.
- **Regression Checks:** `ai-mcp-sync-test`, `dotsync-test`.
- **Runtime Evidence:** on each device after its next pull: `ai-mcp-sync --check` shows `Retired files: none present` and no `figcraft` key in any runtime config.
- **Reopen Conditions:** a device keeps a FigCraft entry or file after a successful autopull.
- **Non-Scope:** FigCraft documents (`*.figcraft`), session logs and transcripts.
- **Escalation Conditions:** a retired path outside `$HOME`, or a request to delete user documents.
- **Outcome (2026-11-11):** see CHANGELOG 2026-11-11 (TASK-211).

## TASK-210: Gemini 4 Carbon replaces Argon as the Pi Gemini reviewer
- **Requirement:** REQ-PI-REVIEW-CARBON (owner 2026-11-10: review that used Argon uses Carbon in Pi on `rich` and `dot`; record in dotfiles and push).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/pi-9router-sync.js`, `bin/pi-9router-restore-test`, `config/pi/README.md`, `config/pi/settings.json`, `config/ai/adapters/pi.md`, `config/ai/context/pi.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `pi.review-pairing` (`config/pi/README.md`), `pi.9router.catalog` (`pi-9router-sync.js`).
- **Accepted Invariants:** the reviewer never shares the implementer's family (Carbon and Argon are one Gemini family); 9Router's unlisted `ag/gemini-4-carbon-*` rows are added only while their Argon sibling is listed and are replaced by the gateway's own row once it lists them; no other model row changes.
- **Regression Checks:** `pi-9router-restore-test`, `ai-policy-lint`.
- **Runtime Evidence:** on `dot` and `rich`: `pi --list-models` shows `ag/gemini-4-carbon-*`; a `reviewer` subagent on `ag/gemini-4-carbon-high` returns a review.
- **Reopen Conditions:** 9Router stops serving Carbon, or lists it with different limits that the sync fails to adopt.
- **Non-Scope:** OMP routing, other CLIs, 9Router itself.
- **Escalation Conditions:** a change to `models.json` providers or auth.
- **Outcome (2026-11-10):** see CHANGELOG 2026-11-10 (TASK-210).

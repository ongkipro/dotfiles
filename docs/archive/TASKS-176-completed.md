# TASK-176 — completed

Moved from `TASKS.md` when it finished (2026-11-03).

### TASK-176: Pi package stack for full-stack development
- **Requirement:** REQ-PI-PACKAGE-STACK (owner 2026-11-02: install the scanned pi.dev package recommendations for full-stack work, web access, and Pi runtime enforcement; keep the tracked dotfiles the source of that list).
- **Risk Level:** R1.
- **Allowed Paths:** `config/pi/settings.json`, `config/pi/README.md`, `config/ai/adapters/pi.md`, `config/ai/context/pi.md`, `docs/DOTFILES_SITEMAP.md`, `docs/archive/TASKS-176-completed.md`, `TASKS.md`, `CHANGELOG.md`.
- **Protected Paths:** `skills/local/**`.
- **Canonical Contract Owners:** `config/pi/settings.json` (the tracked package baseline); `config/ai/adapters/pi.md` (Pi runtime facts); `~/.config/ai-local/device.md` (device-local package and MCP choices).
- **Accepted Invariants:** one owner per Pi capability (no duplicate web/scraper extensions, one MCP implementation per device); MCP servers still come from `ai-mcp-sync`; codemode stays explicitly enabled on a device that runs `pi-mcp-adapter`; the tracked baseline is additive and never removes a device's local packages; no package with a postinstall that pollutes `skills/local` is allowed.
- **Regression Checks:** `bin/system-map --check`; `ai-policy-lint`; `pi --version` loads every declared extension without a conflict.
- **Reopen Conditions:** two declared packages register the same tool name or a package postinstall writes into `skills/local`.
- **Non-Scope:** publishing packages, changing the 9Router model route, changing the MCP server manifest, commit/push.
- **Escalation Conditions:** a package needs credentials, a live remote resource, or a change to the owned-skill source layout.
- **Done:** the tracked `config/pi/settings.json` keeps the pulled baseline (ten packages, `enabledModels`, `quietStartup`, a bounded `rewind.retention`); a device may keep local packages the baseline does not carry, and `pi-9router-restore` never removes them, so each device records its own set in `~/.config/ai-local/device.md`; `config/pi/README.md` states the rule for a device that installs `pi-mcp-adapter` (`-builtin:mcp` plus `+codemode`); `config/ai/adapters/pi.md` records that rule for the Pi runtime.
- **Rejected candidates:** `@civitas-cerebrum/achilles` (transitive `@civitas-cerebrum/wasapi` postinstall pollutes linked `skills/local`); `@underactive/pi-topping-web-tools`, `pi-ketch`, `@pi-stef/web`, `@bacnh85/pi-web`, `pi-web-toolkit`, and `pi-smart-fetch` (duplicate web/scraper tools that overlap `pi-web-access` and bloat context); `@postman/postman-plugin`, `@neon/skills`, `@plannotator/pi-extension`, `pi-agent-ide`, and `@narumitw/pi-usage` (unrequested niche extensions per YAGNI).
- **Ledger:** `RUN-20261102T184923Z-484b54bf` (blocked while the owner decided about the tracked change); the reconciled state after the pull is recorded by the follow-up run.

# TASK-190 — completed

Moved from `TASKS.md` on 2026-11-05 (TASK-192) after its follow-up run passed.

### TASK-190: rich multi-AI and database isolation docs and tool review
- **Requirement:** REQ-RICH-DB-ISOLATION-DOCS (owner 2026-11-05).
- **Risk Level:** R1.
- **Allowed Paths:** `config/ai/project-memory/linux-rich-maintenance.md`, `docs/linux-maintenance-log.md`.
- **Protected Paths:** `config/ai/project-memory/tokophi-repo-private-ruling.md`.
- **Canonical Contract Owners:** `linux-rich-maintenance.md`; maintenance log; device-local rich tools.
- **Accepted Invariants:** no `RemoteCommand`/`RequestTTY` in `Host rich`; bulk SSH `-S none`; reaper keeps live/unknown-age resources; worktree backups never collide.
- **Regression Checks:** rich self-tests, `ai-mcp-sync --check`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** snippet breaks scp/sshfs, or the reaper removes a live or unknown-age resource.
- **Non-Scope:** `~/Projects/*` compose migrations; `~/.ssh/config`; commit/push.
- **Escalation Conditions:** a fix needs an active project's compose file or a credential file.
- **Ledger:** RUN-20261105T083548Z-66f225c6 BLOCKED (content APPROVED; gates failed on debt fixed by TASK-191); follow-up RUN-20261105T093756Z-6bfe7d4e PASS.

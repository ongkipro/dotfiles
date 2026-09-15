# Archived task contracts — native-first runtime context

Moved out of `TASKS.md` on 2026-09-15 to stay inside the hot-context budget.
The entry has ledger evidence ending in PASS.

- **TASK-084 / REQ-NATIVE-FIRST-CONTEXT (R3, reviewed).** One shared core, one
  adapter per runtime: `config/ai/AGENTS.md` (20 KB, identical in every CLI)
  became `CORE.md` plus `adapters/<runtime>.md`, rendered by `ai-memory-link`
  into `config/ai/context/<runtime>.md`; dead Antigravity links removed
  (strace: agy 1.2.0 reads only `~/.gemini/GEMINI.md`); OMP orchestration policy
  confined to the OMP adapter; lint enforces byte budgets, render freshness, and
  the Git/secrets/attribution anchors. `config/ai/AGENTS.md` remains a
  compatibility symlink until every device has relinked. First run
  `RUN-20260914T200000Z-4c71dc92` BLOCKED on external conditions; completed by
  `RUN-20260915T025808Z-17662dad` (PASS; independent review rounds 1–3).
  Commit `6b3f7b9`. Report: `docs/DOTFILES-NATIVE-FIRST-AUDIT.md`.

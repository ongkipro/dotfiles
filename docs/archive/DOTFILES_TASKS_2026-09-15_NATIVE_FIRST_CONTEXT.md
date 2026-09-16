# Archived task contracts — native-first runtime context

Moved out of `TASKS.md` on 2026-09-15 and 2026-09-16 to stay inside the hot-context
budget. Every entry has ledger evidence ending in PASS.

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

- **TASK-085 / REQ-NATIVE-FIRST-RESIDUALS (R3, reviewed).** Codex cuts every
  skill description to ~250 characters (measured with `codex debug prompt-input`,
  Codex 0.154, 72 entries), hiding the "Not for" clauses that separate sibling
  skills. 23 owned descriptions were reordered so purpose and boundary land in
  the first ~240 characters, with skill-map relations unchanged; `skill-check`
  now warns when a boundary starts later (mutation-tested). OMP context trimmed
  to 9,972 B. `RUN-20260915T040646Z-1de96a46` PASS; independent review rounds
  1-2. Commit `2c55457`.

- **TASK-086 / REQ-SPEC-SOURCE-FRESHNESS (R1).** Three regulator sources were
  past review and failing CI (SRC008). FTC and ICO were re-verified live on
  2026-09-15; the CPPA page was unreachable from the verification network, so it
  was re-verified from the Wayback snapshot of 2026-09-09 — recorded as such,
  with next review shortened to 2026-09-29 to retry live retrieval. No dependent
  requirement or legal conclusion changed. `RUN-20260915T052613Z-38720dd7` PASS.
  Commit `cef3b7f`.

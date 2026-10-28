---
name: omp-9router-claude-wire
description: Verified success record for the OMP Claude-through-9router transport fix (chat-compatible endpoint, reasoning and tools kept); no live catalog or account data
metadata:
  node_type: memory
  type: project
---

# OMP Claude Wire Through 9router: Success Record

Codex delivery run `RUN-20261028T203549Z-2e1c5b55` finished with `result=PASS` in the
dotfiles repository. Its independent reviewer, `root.claude_sync_review`, returned
`BOUNDARY APPROVED`.

## Root cause

The Claude request transport used by OMP did not match what 9router accepts. Pi already
worked against the same gateway, so the comparison pointed at the transport shape, not
the models.

## Fix

- The OMP Claude path calls the chat-compatible 9router endpoint instead of the
  native one.
- Reasoning and tool-call handling are kept on that path.
- Compat overrides for reasoning effort live in `config/omp/9router-compat.yml`
  (secret-free, never auto-loaded).

## Evidence

- Live test against 9router with fallback disabled: 7/7 passed.
  - Sonnet 5.5, Sonnet 5
  - Opus 5.5, Opus 5
  - Fable 5.1, Fable 5
  - Haiku 4.5
- Delivery ledger recorded `omp-role-reference=PASS`, `omp-native-boundary=PASS`,
  `diff-whitespace=PASS`, `reasoning-off-regression=PASS` (declared observation), and
  `independent-review=PASS` (declared observation).
- The boundary check first returned `REVIEW_REQUIRED` for a pre-existing dirty path,
  then `APPROVED` after review.

This record was written from the codex run output. It was not re-executed in the
session that wrote it.

## How to apply

- Before reusing the fix, rerun the 9router test set (`bin/omp-9router-claude-test`)
  against the current gateway. Model availability and the 9router catalog drift.
- Do not treat the test list above as a current catalog. See [[pi-9router-models-compaction]]
  and [[pi-9router-setup]] for the gateway setup.

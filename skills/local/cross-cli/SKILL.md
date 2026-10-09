---
name: cross-cli
description: >-
  Hand one lane of work (research, review, second opinion, bulk drafting) to
  another installed AI CLI — claude, codex, agy, pi, omp — through `ai-ask`,
  read-only by default. Not model routing or OMP configuration (OMP stays
  upstream-native) and not a reason to stop working alone: every CLI already has
  the same policy, memory, and skills. Use for cross-vendor review of R2+ work,
  mandatory independent review of R3/R4 delivery runs, a second opinion on an
  architecture or UI decision, large-context reading, or cheap bulk drafts; also
  when a CLI is out of quota and a lane needs a fallback.
---

# Cross-CLI lanes

Every runtime receives the same `CORE.md`, routed memory, and skills, so each
one can finish a task **alone**. This skill adds the ability to borrow another
runtime for one lane. Roles are **lanes**, never fixed to a CLI; strengths below
are defaults, not locks.

## Lanes

| Lane | Use for | Good candidates (any capable CLI may serve) |
|---|---|---|
| Conductor | Decompose, integrate, verify, report | the CLI the user opened |
| Discovery / research | Read-only exploration, large documents | agy, codex, claude |
| Implementation / data | Edits — only in a linked worktree | codex or claude via `ai-ask --write`; OMP children through OMP's own isolated tasks |
| Visual design | UI direction; needs an image-capable model | claude, agy |
| Correctness review | Independent diff review | a separate capable context; vendor diversity may help |
| Sensitive review (R3/R4) | Auth, payments, secrets, migrations, infra | a separate actual reviewer, then the ledger review |
| Bulk / cheap | Summaries, conversions, content batches | pi, omp |

OMP keeps its own native agents; when OMP is the conductor it maps them onto
these lanes in its session. Dotfiles never installs OMP routing or agents.

## `ai-ask`

```bash
ai-ask RUNTIME [--cwd DIR] [--attach FILE]... [--timeout SEC] [--write] [--dry-run] -- PROMPT
```

| Runtime | Read-only mode used | Can run tools headless? |
|---|---|---|
| claude | `claude -p --permission-mode plan` | yes (read-only) |
| codex | `codex exec -s read-only -C DIR` | yes (read-only sandbox) |
| agy | `agy --sandbox --mode plan --print-timeout Ns -p=…` | **no** — tools needing approval are soft-denied (exit 0, notice on stderr), so a clean exit does not prove it read anything; attach files |
| pi | `pi -p --no-tools` | no — attach files |
| omp | `omp -p --no-tools` | no — attach files |

- `--attach` inlines files (60 KB total) so tool-less runtimes can review them.
  Attach the diff: `git diff > /tmp/d.patch; ai-ask agy --attach /tmp/d.patch -- "review"`.
- `--write` is allowed only for claude and codex, and only inside a **linked git
  worktree** (`git worktree add`); the main checkout is refused.
- Default timeout 600 s; a timeout exits 124. stdin is closed, so nothing can
  prompt.
- Check wiring without calling a model: `ai-ask codex --dry-run -- test`.
- `codex exec` refuses to run outside a git repository, so point `--cwd` at a
  repository (or attach files to another runtime).

## Rules

1. **Delegated output is a proposal.** The conductor reads it, verifies claims
   against the code, and integrates; it never pastes results in unchecked.
2. **Review independently for R2+.** Select a separate actual reviewer with the
   required tools and expertise. Same model/provider is eligible; use vendor
   diversity when it adds useful perspective, not as an approval requirement.
   For R3/R4 delivery runs this is the independent review;
   record it with `delivery-ledger review-boundary` and the reviewer's real
   runtime/model, or `unavailable: <reason>` when the CLI does not report it.
3. **Fallback, never a silent skip.** If a runtime fails (quota, expired login,
   401), use the next capable candidate and say so. A separate same-vendor agent
   is eligible immediately. Never replace independent review with self-review.
4. **Give the reviewer the contract.** Include the task's requirement,
   invariants, and the exact files or diff; ask for APPROVE / CHANGES REQUIRED
   with `file:line` and a failing scenario. Fix, then re-review the fix.
5. **Keep secrets out.** Never attach `.env`, credential files, or customer
   data; `ai-ask` sends the prompt to the other vendor.
6. **Smallest useful delegation.** Do not fan out for a one-line change; R0–R1
   work stays in one CLI unless a second opinion is requested.

## Readiness

A runtime can be installed but unusable (expired login, revoked token, gateway
down). Before relying on a lane, run a one-word probe:

```bash
ai-ask codex --timeout 60 -- "Reply with the single word OK."
```

Fix login problems in that CLI itself (`codex login`, provider settings); this
skill does not manage credentials.

## Source notes (2026-10-02)

The read-only flags above are what `~/dotfiles/bin/ai-ask` passes; the
installed CLIs' `--help` confirmed them (codex-cli 0.159.3, agy 1.2.14, pi
0.99.2, omp 18.4.9). Vendor docs: `codex exec` defaults to a read-only sandbox,
`--sandbox workspace-write` allows edits, and a git repository is required
unless `--skip-git-repo-check`
(https://learn.chatgpt.com/docs/non-interactive-mode); Antigravity headless
mode soft-denies unapproved tools and exits 0
(https://antigravity.google/docs/cli/headless/). If a runtime's flags change,
fix `ai-ask` first, then this table.

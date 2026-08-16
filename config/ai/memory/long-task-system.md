# Memory: Long-task development, debugging, and security

> Load this reference for multi-turn implementation, difficult debugging, AI-runtime repair, or security-sensitive work. Repository-local files remain the source of truth; this memory defines the protocol, not project status.

## Operating invariants

1. **Disk beats conversation.** Requirements, status, evidence, and recovery instructions live in the repository. Chat history, OMP job state, and cross-project memory are caches.
2. **The parent owns integration.** OMP specialists return bounded work; the main session resolves conflicts, reviews changes, and runs final verification.
3. **Evidence precedes completion.** A task moves to done only after its stated observable check passes.
4. **Repair the cause, not the symptom.** Reproduce, locate the earliest divergence, fix the shared source, and trace every affected caller.
5. **Safety is not optional optimization.** Secret boundaries, approval gates, and non-destructive defaults remain in force even when a tool permission is broad.

## 1. Long-task continuity

### Durable state contract

Use repository-local artifacts for work that can span turns, agents, or machines:

| Artifact | Owns | Must not become |
|---|---|---|
| `TASKS.md` | Accepted executable queue: requirement, scope, dependencies, state, and runnable completion check | Session narration, speculative backlog, or unverifiable “done” claims |
| `BUILD-LOG.md` | Append-only durable implementation facts: changed behavior, exact validation evidence, decisions, and gotchas | A transcript, scratchpad, duplicate task list, or future-tense plan |
| `STATUS.md`, when the repository already uses it | One compact current handoff: active work, blockers, and next verified action | A second build log or permanent history |
| OMP `task`/`hub` state | Live coordination and bounded agent results | Cross-session persistence or the canonical project record |

The canonical starter shapes are [TASKS.md](../../templates/TASKS.md), [BUILD-LOG.md](../../templates/BUILD-LOG.md), and [STATUS.md](../../templates/STATUS.md). Do not create this document set for trivial one-turn work. For substantial projects, initialize it with `project-init`; existing files are never overwritten.

### Start or resume

Before editing:

1. Read the repository `AGENTS.md` and the smallest relevant requirement/architecture sections.
2. Read `TASKS.md`; select one accepted, unblocked task and confirm its completion command or scenario.
3. Read only the latest relevant `BUILD-LOG.md` entry and the current `STATUS.md` handoff when present. Do not replay the full history.
4. Inspect the real code path and current worktree before trusting a stale handoff. Disk and executable behavior win; correct stale documentation in the same slice.
5. Restate the active contract internally: goal, expected behavior, owned files/symbols, dependencies, safety constraints, and proof required.

### Checkpoint protocol

Checkpoint at a meaningful durability boundary: a verified task completion, a blocker, a handoff, before expected compaction/session exit, or after integrating an async result. Do not checkpoint every tool call.

1. Stop at a coherent state; never describe an unverified partial implementation as complete.
2. Update `TASKS.md` atomically: current state, remaining dependency/blocker, and the still-runnable completion check. Keep exactly one state for each task.
3. Append one concise `BUILD-LOG.md` entry only for durable facts:
   - task or requirement identifier;
   - behavior and files changed;
   - exact command/scenario run and observed result;
   - unresolved risk or recovery note, if any.
4. If `STATUS.md` exists, keep one “next verified action” that a fresh session can execute without reconstructing chat.
5. Leave the worktree safe. Do not commit, push, deploy, discard changes, or expose secrets merely to create a checkpoint.

A good resume packet is a set of paths plus a verified next action, not a pasted transcript. Never persist OMP job IDs, peer names, model output, hidden reasoning, credentials, or volatile process state as project truth.

### OMP async jobs

Follow the orchestration policy in [OMP Development Routing](../../omp/ROUTING.md):

1. Decompose by real independence. Define shared interfaces, ownership, inputs, and acceptance evidence before dispatch.
2. Launch two or more independent slices together in one `task` batch. Keep dependent slices sequential; do not invent parallel work.
3. Give each specialist bounded files/symbols and explicit non-goals. Avoid overlapping ownership even when isolation is available.
4. Continue parent-owned work while jobs run. `hub` results deliver asynchronously; do not poll. Use `hub wait` only when no useful work remains and a result is a hard dependency.
5. Treat `hub jobs`, messages, and job IDs as transient coordination. A completed job means the specialist returned, not that its artifact is accepted.
6. On delivery, inspect the claimed files and evidence, integrate, run the parent-owned changed-contract check, then update `TASKS.md` and `BUILD-LOG.md`.
7. If a job fails or expires, preserve the durable task state and evidence already obtained; re-dispatch from the repository contract rather than reconstructing from chat.

## Detailed references

Load only the protocol needed for the active work:

- [Advanced system debugging](long-task-debugging.md)
- [Token, prompt, and minimal-diff discipline](long-task-efficiency.md)
- [Security enforcement and non-destructive gates](long-task-security.md)

These references remain advisory methodology. Repository contracts and executable evidence own project state.

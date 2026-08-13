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

## 2. Advanced system debugging

### Root-cause protocol

Use this sequence for a defect, regression, or failing system check:

1. **Reproduce.** Capture the smallest deterministic command or user flow, actual result, expected result, environment boundary, and first observable failure. If the defect cannot be reproduced, gather evidence; do not patch a guess.
2. **Map the flow.** Use LSP definition, references, implementations, type information, and call hierarchy when supported. Search text only for configuration, dynamic registration, generated names, or languages without a usable server. Trace all callers before editing shared behavior.
3. **Locate the earliest divergence.** Follow input → transformation → state → output. Compare a working path or invariant and identify where state first becomes wrong, not where the final error is displayed.
4. **Test one hypothesis at a time.** Prefer a targeted observation, breakpoint, existing diagnostic, or temporary local instrumentation. Remove temporary instrumentation after proof.
5. **Fix the owning boundary.** Change the smallest shared source that restores the invariant. Do not scatter guards across callers, suppress the exception, weaken validation, or special-case only the reported input.
6. **Prove the repair.** Re-run the original reproduction, then the smallest existing changed-contract check. Add a permanent test only when the observable regression was previously uncovered and repository conventions support it.
7. **Escalate deliberately.** After one reasonable path fails or evidence shows a hard defect, route a bounded reproduction and collected evidence to the OMP `debugger`; do not make it rediscover the entire project.

### DAP with `xd://debug`

Use the Debug Adapter Protocol when runtime state, timing, stack flow, or mutation order cannot be established cheaply from code and deterministic output.

1. Prefer `launch` for a controlled reproduction; use `attach` only to a verified process. Only one debug session is active at a time.
2. Set the first breakpoint at the earliest suspected invariant boundary, not at the final exception handler. Conditional and hit-count breakpoints reduce noise in loops or high-traffic paths.
3. Inspect `stack_trace`, then the relevant `scopes` and `variables`. Use `evaluate` for non-mutating observations. Use data breakpoints/watchpoints when the question is “who changed this value?” and the adapter supports them.
4. Step over known framework code, step in only at the suspected boundary, and compare actual state with the expected invariant.
5. Never modify live/production state, write process memory, or attach to a sensitive process without the applicable approval. Do not print secrets while inspecting variables.
6. Terminate the session after the reproduction. Record the causal finding and verification, not raw debugger dumps.

### LSP navigation

- Start with symbol definition and references; it preserves semantic identity better than filename guessing or global text replacement.
- Inspect implementations for interfaces/traits and all references before signature or behavior changes.
- Use semantic rename only after reviewing its scope; generated code, string keys, templates, and external consumers may still require targeted search.
- If navigation is empty or suspicious, run `hx --health` and verify the language server from `config/helix/languages.toml`. Do not interpret an unavailable LSP as “no callers.”

### `ai-doctor` diagnosis and recovery

[`ai-doctor`](../../../bin/ai-doctor) is read-only in default mode. `ai-doctor --self-test` adds isolated repository regression fixtures; neither mode is a blanket auto-repair command.

1. Run `ai-doctor` and classify each result as repository defect, broken runtime link, device drift, missing optional runtime, or external auth/provider failure.
2. Follow the named narrow repair path in its output (for example `ai-memory-link`, `skill-update`, or the installer) only when it matches the diagnosed class. Inspect scripts before any system-affecting action.
3. Re-run the failed focused check first, then `ai-doctor`. Use `ai-doctor --self-test` after changing runtime wiring, memory links, hooks, or their validation logic.
4. Never “heal” by deleting unknown files, overwriting regular files, weakening a deny rule, installing unrequested software, or copying secrets into managed paths.
5. A warning is not automatically a failure. Report optional-runtime or unrelated worktree warnings accurately; do not claim a clean device unless the observed output is clean.

## 3. Token and prompt optimization

### Progressive disclosure

- Keep always-loaded policy short: invariant, trigger, and pointer. Put detailed reusable method in a matching skill `references/` file or this on-demand memory reference.
- Load the matching `SKILL.md` first, then only the named reference required for the current mode. Do not read an entire reference tree preemptively.
- Read code by symbol and bounded section. Search to locate; then read the complete relevant construct and its callers. Avoid whole-repository dumps.
- Link to canonical contracts instead of duplicating them. One rule has one owner; consumers carry a short pointer.
- Give delegated prompts only the slice contract: target, change, acceptance, constraints, and shared interface. Exclude unrelated conversation and speculative advice.
- GitHub-harvested architecture patterns belong in skill `references/`, not in memory. Current pattern references: `admin-dashboard/references/github-admin-patterns.md` and `next-shadcn-starter-patterns.md` (admin table/form/RBAC contracts from Refine, Payload CMS, Medusa, next-shadcn-dashboard-starter); `storefront-development/references/next-commerce-patterns.md` (commerce catalog/cart/checkout contracts from Next Commerce). These are loaded on demand by the owning skill; do not duplicate their content into memory or always-loaded policy.

### Minimal-diff discipline

Use the repository’s existing convention and stop at the first rung that holds: no change, existing helper, standard library, native platform, installed dependency, one line, then minimum new code.

- Prefer surgical or syntax-aware edits. Do not reformat untouched code, add wrappers with one caller, introduce configuration for fixed values, or scaffold hypothetical reuse.
- A small diff is only good after tracing the real flow. Migrate every affected caller and remove obsolete aliases, comments, and dead branches in the same cutover.
- Validate with the smallest executable evidence that would fail for the plausible bug. A broad suite cannot replace reproducing the changed behavior.
- Compress checkpoints into durable facts and paths. Do not preserve verbose tool output when the command, observed result, and causal conclusion are sufficient.

## 4. Security enforcement

### Secret isolation

- Detect secret-bearing files by name or metadata only; do not read `.env*`, private keys, tokens, auth sessions, payment/customer exports, or secret backups without explicit approval.
- Never place secret values in prompts, task payloads, logs, memory, screenshots, fixtures, commits, or generated documentation. Use placeholders and existing secret bindings.
- Keep private keys and secret archives outside dotfiles. Global ignore rules are defense in depth, not proof that a credential is absent from Git history.
- Before an authorized commit, run [`security-check`](../../../bin/security-check) against the intended repository/staged content. A removed leaked credential still requires rotation and history assessment.

### Deny rules and Git guard

- Permission allowlists express capability, not approval. The approval gates in [AGENTS.md](../AGENTS.md) still govern secrets, destructive operations, system-wide changes, production, and scope expansion.
- Keep sensitive directories denied as whole paths. Claude permission denies take precedence over allows and cannot safely carve exceptions from a protected directory; use a non-secret interface such as `ssh -G <host>` instead of reading `~/.ssh/**`.
- Prefix allow rules cannot distinguish dangerous Git flags. [`git-guard.sh`](../hooks/git-guard.sh) is the Claude `PreToolUse` boundary: it denies force-push and amend, and asks before mirror/prune, ref deletion, or forced refspecs.
- The hook does not inspect Git subprocesses launched inside Lazygit and does not protect other CLIs by itself. All agents must still obey additive-history and approval policy. Run [`git-guard.test.sh`](../hooks/git-guard.test.sh) after changing the hook.

### Non-destructive safety gates

1. Begin with read-only inspection and the smallest target scope.
2. Show or inspect the affected set before bulk mutation; prefer dry-run or reversible operations when the platform provides them.
3. Preserve unrelated worktree changes. Never use destructive Git reset/clean, mass deletion, or history rewrite as cleanup.
4. Require explicit user approval immediately before secrets access, destructive action, system-wide change, production/live mutation, or expanded scope. Prior broad permission does not satisfy this gate.
5. Verify backup/rollback viability before an approved destructive migration; a command that merely claims to create a backup is not proof it can be restored.
6. After the change, run the focused security/integrity check and report the exact observed result. Do not weaken a gate to make the check green.

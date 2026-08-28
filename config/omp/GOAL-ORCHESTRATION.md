# OMP Goal Orchestration

This playbook is loaded on demand from the shared `AGENTS.md` contract when an
OMP user explicitly starts a goal in a repository containing `TASKS.md`.

1. Read the nearest repository `AGENTS.md`, accepted product/specification
   source, `TASKS.md`, current status/build evidence, and active delivery-ledger
   state. The goal is the destination; `TASKS.md` is the canonical execution
   queue. Never replace either with chat narration or transient OMP task state.
2. Select the next accepted, unblocked task that advances the goal. Confirm its
   requirement, risk, allowed/protected surface, dependencies, and runnable
   completion evidence before editing. Do not silently broaden the goal.
3. Keep the active parent as conductor: it owns decomposition, routing, context,
   integration, completion audit, and user communication. Terra is the normal
   cost-aware parent. Fable is the native `plan` model and `@orchestrator` is an
   explicit alias for genuinely hard, long-horizon sessions. OMP does not
   dynamically replace the parent model from a task spawn.
4. Route bounded work by bundled capability: `sonic` / Gemini for trivial,
   mechanical work; `scout` or `librarian` / Terra for discovery and research;
   `task` / Sol for development, tests, refactors, difficult debugging, schema,
   queries, migrations, transactions, locking, and PostgreSQL/Drizzle changes;
   `designer` / Opus before browser-visible visual or UX edits; `reviewer` /
   Opus for independent correctness and architecture review; and
   `security-reviewer` / Opus XHigh for auth, authorization, payments,
   migrations, secrets, cryptography, tenant isolation, concurrency,
   infrastructure, and production-sensitive review.
5. Delegate only genuinely independent slices. Never run children with a shared
   semantic owner concurrently. Give each child explicit paths, constraints,
   acceptance evidence, and non-scope. Treat child results as proposals; inspect
   and integrate one isolated result at a time.
6. Run repository verification after integration. R0/R1 may finish with parent
   verification. Non-trivial cross-module R2 work gets an Opus reviewer. R3/R4
   and every sensitive trigger above require independent Opus or security review
   plus recorded delivery-ledger boundary approval; `DONE` requires `PASS`.
7. Secret access, destructive operations, system-wide changes, production/live
   mutations, and material scope expansion stop for explicit user approval even
   while Goal Mode continues. Commit and push only when the user explicitly
   requests them.
8. Update repository task/build evidence at meaningful boundaries. Complete the
   goal only when every deliverable maps to current repository evidence, relevant
   tests and reviews pass, and the final task boundary is clean. Continue while
   in-scope work remains; never report partial success as completion.

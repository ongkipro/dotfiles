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
   integration, completion audit, and user communication. Use the runtime's
   available model/provider choices; no particular model or reasoning level is
   mandatory and no parent switch is required to satisfy a model-name rule.
4. Route bounded work by capability: discovery/research; implementation and data;
   visual design before browser-visible edits; correctness review; and sensitive
   review for authorization, payments, migrations, secrets, cryptography, tenant
   isolation, concurrency, infrastructure and production. Any available capable
   model/provider may serve a lane, including the same route as another agent.
5. Delegate independent slices large enough to justify worker startup and
   integration. Keep small adjacent fixes local unless a capability or separate
   review requires another agent. Never run children with a shared
   semantic owner concurrently. Give each child explicit paths, constraints,
   acceptance evidence, and non-scope. Treat child results as proposals; inspect
   and integrate one isolated result at a time. For every native `task` item
   that will edit files, explicitly pass `isolated: true`. On OMP 18.1.13,
   `task.isolation.enabled: true` makes isolation available; it does not make
   an omitted item flag isolated. `task.isolation.apply: false` only withholds
   application for tasks that actually requested isolation. Require the
   actual emitted item flag and returned patch/branch artifact, inspect their
   paths and the parent diff before
   applying it, and verify integration. Never retry a failed isolation setup
   as a writable shared-workspace child. If an editing child ran without
   isolation, report the boundary failure and review its actual changes;
   never label those direct workspace edits an isolated proposal. Read-only
   discovery does not need a copied workspace.
6. Run repository verification after integration. R0/R1 may finish with parent
   verification. Non-trivial cross-module R2 work gets a separate reviewer. R3/R4
   and every sensitive trigger above require separate-agent correctness/security review
   plus recorded delivery-ledger boundary approval; `DONE` requires `PASS`.
7. Secret access, destructive operations, system-wide changes, production/live
   mutations, and material scope expansion stop for explicit user approval even
   while Goal Mode continues. Commit and push only when the user explicitly
   requests them.
8. Update repository task/build evidence at meaningful boundaries. Complete the
   goal only when every deliverable maps to current repository evidence, relevant
   tests and reviews pass, and the final task boundary is clean. Continue while
   in-scope work remains; never report partial success as completion.

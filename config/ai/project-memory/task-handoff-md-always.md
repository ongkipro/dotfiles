---
name: task-handoff-md-always
description: "Use repository-owned task state for non-trivial work without forcing per-step commits or duplicate handoff documents"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a8ea18a1-6786-469c-8136-85af8962d96c
  modified: 2026-07-22T04:00:42.302Z
---

For non-trivial work, persist resumable state in the repository's existing
canonical execution system: usually `TASKS.md`, `STATUS.md`, `BUILD-LOG.md`, or
`.delivery/`. Do not create a parallel handoff file when the repository already
has an owner for that information.

Record scope, the next action, and verification evidence at meaningful
boundaries. A chat-only fact is not durable, but neither is an automatically
generated document useful when it splits the source of truth.

Commits remain an explicit user action. Never commit before coding, after every
step, or at task completion unless the user requested that Git action. Multiple
agents use isolated runs or task-owned files defined by the repository contract;
they do not concurrently edit a shared ad-hoc handoff document.

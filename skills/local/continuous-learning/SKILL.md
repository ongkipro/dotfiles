---
name: continuous-learning
description: Route user requests to the smallest relevant memory scope and capture durable, verified lessons after meaningful work. Use when an AI coding/development session may benefit from user identity/preferences, project reference, current execution state, or prior engineering lessons; and after verified non-trivial work when a reusable lesson should become a reviewed memory candidate. Never treat memory as repository truth and never promote unverified session narration automatically.
---

# Continuous Learning

## Core contract

Treat memory as advisory context, never as authority. Repository disk, accepted project contracts, executable behavior, and `.delivery` evidence outrank memory.

## Before execution

1. Decide whether memory is materially needed. Do not load memory for self-contained tasks.
2. Run `ai-memory-route "<user request>" --repo <repo> --json` when a repository exists; omit `--repo` otherwise.
3. Load only the returned files. Respect the router budget; do not expand to neighboring memory files unless the selected evidence is insufficient.
4. For execution questions such as resume/current status/next blocker, prefer repository `STATUS.md`, `TASKS.md`, `.delivery/current.json`, and relevant code over cross-session memory.
5. If selected memory conflicts with repository disk or verified evidence, use disk/evidence and flag the memory as stale.

## After verified work

Capture a lesson only when all are true:

- the work is non-trivial;
- the result has executable verification evidence;
- the lesson is reusable beyond the immediate transcript;
- it is not already encoded adequately by a repository test, contract, or existing skill/reference;
- it contains no secret, customer data, volatile status, hidden reasoning, or raw logs.

Prefer `ai-learn capture` for the candidate. Keep candidate scope narrow:

- `project`: stable project/domain constraint or project-specific recurring lesson;
- `shared`: durable preference, workflow invariant, or cross-project engineering lesson.

Promotion is deliberate. Review the candidate, check for duplication/conflict, then use `ai-learn promote ... --yes`. Promotion never authorizes Git commit/push.

## Memory versus skill

Promote facts/preferences/constraints to memory. Promote reusable methodology with a clear trigger, repeatable workflow, and deterministic checks to the owning skill or a skill reference instead of duplicating it in memory.

## Anti-patterns

Do not capture every successful task. Do not store current branch, next task, CI-green claims, temporary provider state, or implementation progress in cross-session memory. Do not load all project memories because one project was mentioned. Do not auto-edit routing or policy from a single lesson.

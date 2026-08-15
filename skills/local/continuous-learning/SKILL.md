---
name: continuous-learning
description: Route user requests to the smallest relevant memory scope, protect memory quality, and capture durable verified lessons after meaningful work. Use when an AI coding/development session may benefit from identity/preferences, project reference, current execution state, or prior engineering lessons; before promoting memory candidates; and after verified non-trivial work when a reusable lesson should become reviewed memory or reusable skill methodology. Never treat memory as repository truth and never promote unverified session narration automatically.
---

# Continuous Learning

## Core contract

Treat memory as advisory context, never as authority. Repository disk, accepted project contracts, executable behavior, and `.delivery` evidence outrank memory.

## Before execution

1. Decide whether memory is materially needed. Do not load memory for self-contained tasks.
2. Run `ai-memory-route "<user request>" --repo <repo> --json` when a repository exists; omit `--repo` otherwise.
3. Load only the returned files. Respect the router budget; do not expand to neighboring memory files unless selected evidence is insufficient.
4. For resume/current status/next blocker, prefer repository `STATUS.md`, `TASKS.md`, `.delivery/current.json`, and relevant code over cross-session memory.
5. If selected memory conflicts with repository disk or verified evidence, use disk/evidence and treat the memory as stale.

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

## Before promotion

1. Review the candidate content and its verification evidence.
2. Run `ai-memory-hygiene`; fix relevant duplicate, volatile-state, scope, stale-claim, or oversize findings instead of copying them forward.
3. Decide whether the lesson belongs in memory at all. Reusable methodology with a repeatable workflow belongs in the owning skill/reference.
4. Use `ai-learn promote ... --yes` only after the candidate survives this review. Promotion never authorizes Git commit or push.

`ai-memory-hygiene` is advisory by default. Use `--strict` only in deterministic validation/CI contexts where warnings are intentionally treated as failures.

## Memory versus skill

Promote facts, preferences, stable constraints, and durable project reference to memory. Promote reusable methodology with a clear trigger, repeatable workflow, and deterministic checks to the owning skill or a skill reference instead of duplicating it in memory.

## Learning loop

Use this order:

`request -> scoped retrieval -> execution -> verification -> lesson candidate -> hygiene -> classify memory|skill|discard -> reviewed promotion`

Do not bypass verification or hygiene because a lesson sounds plausible.

## Anti-patterns

Do not capture every successful task. Do not store current branch, next task, CI-green claims, temporary provider state, or implementation progress in cross-session memory. Do not load all project memories because one project was mentioned. Do not auto-edit routing, policy, or permanent memory from a single lesson.

---
name: continuous-learning
description: Route user requests to the smallest relevant memory scope, protect memory quality, and convert verified delivery evidence into reviewed reusable learning. Use when a coding/development session may benefit from identity/preferences, project reference, current execution state, or prior engineering lessons; after verified non-trivial work when a reusable lesson should be captured; and before promoting a memory candidate or evolving reusable methodology into a skill. Never treat memory as repository truth and never auto-promote unverified session narration.
---

# Continuous Learning

## Core contract

Treat repository contracts, executable behavior, and `.delivery` evidence as authority. Treat memory as advisory context. Treat skills as reusable methodology.

## Before execution

1. Decide whether memory is materially needed. Do not load memory for self-contained tasks.
2. Run `ai-memory-access "<request>" --repo <repo> --json` when a repository exists; omit `--repo` otherwise. This delegates selection to `ai-memory-route` and records only a query hash plus selected durable-memory paths in device-local telemetry.
3. Load only returned files and respect the retrieval budget. Never persist raw user prompts or memory contents in usage telemetry.
4. For resume/current status/next blocker, prefer `STATUS.md`, `TASKS.md`, `.delivery/current.json`, and current code over cross-session memory.
5. If memory conflicts with repository/evidence, use repository/evidence and treat the memory as stale.

## After verified work

Capture a learning signal only when the result is non-trivial, reusable, and machine-verified.

1. Complete verification and finish the delivery run with `PASS`.
2. Record a structured immutable learning signal with `delivery-learning record --repo <repo> --run <RUN-ID> ...`.
3. Choose the narrowest scope:
   - `project`: stable project/domain constraint or recurring project-specific lesson;
   - `shared`: durable cross-project preference or engineering invariant;
   - `methodology`: repeatable workflow or technique that should evolve into a skill/reference.
4. Never copy secrets, customer data, raw logs, hidden reasoning, volatile status, or speculative root causes into the signal.

`delivery-learning` must refuse runs that are unfinished, non-PASS, have no verification, or contain FAIL/UNVERIFIED verification events.

## Automatic candidate harvest

Run `ai-memory-harvest --repo <repo> --run <RUN-ID>` or `--all` after a verified learning signal exists.

The harvester must:

- verify the learning sidecar and source run before use;
- create only a local candidate, never tracked memory;
- preserve provenance: run, head, task, requirement, risk, worker/model, and verification checks;
- compute advisory novelty and reusability scores;
- recommend `memory`, `project-memory`, `skill`, `discard-or-merge`, or `review-conflict`;
- remain idempotent for the same run.

Scores are review aids, not truth. Never auto-delete, auto-merge, auto-promote, or rewrite policy from a score.

## Before promotion

1. Review the candidate and provenance.
2. Run `ai-memory-hygiene --candidate <candidate.md>`.
3. Resolve `MEMORY_CONFLICT` against repository/evidence or explicit user direction before promotion.
4. For `SEMANTIC_DUPLICATE`, prefer the existing canonical owner and merge deliberately rather than append another copy.
5. Reject authority claims that make memory outrank repository truth.
6. Decide the durable owner:
   - facts/preferences/stable constraints -> memory;
   - project-specific stable reference -> project memory;
   - repeatable methodology -> owning skill/reference;
   - temporary or redundant information -> discard.
7. Use `ai-learn promote ... --yes` only after review. Promotion never authorizes Git commit or push.

## Memory lifecycle

Use `ai-memory-lifecycle` to review retention only after enough telemetry has accumulated.

- `ACTIVE`: retain.
- `LOW_USE`: retain-review; low frequency alone is not deletion evidence.
- `COLD`: archive-review only after the configured inactivity window.
- `NEVER_USED`: archive-review only after the minimum observation window.
- `merge-review`: semantic duplicate plus lower observed use; manually choose the canonical owner.

Lifecycle recommendations are advisory. Never auto-delete, auto-archive, or rewrite memory from usage counts. A memory can be important even when rarely retrieved.

## Skill attribution and evolution

When one or more reusable skills materially influenced a finished delivery run, record immutable attribution with:

`delivery-skill-usage --repo <repo> record --run <RUN-ID> --skill <skill-name> [--skill <skill-name> ...]`

Record attribution for PASS, FAIL, and BLOCKED finished runs so future effectiveness reports are not success-only. Do not attribute skills that were merely available but not materially used.

Use `ai-skill-evolution` only as an advisory report. It combines:

- finished-run skill attribution to calculate sample count, success rate, and verification-failure rate;
- recurring `methodology` learning signals to detect reusable patterns;
- current `skills/local/*/SKILL.md` content to decide whether a recurring pattern overlaps an existing owner.

Interpret recommendations conservatively:

- `INSUFFICIENT_DATA`: collect more real runs; do not conclude the skill is good or bad.
- `STABLE`: observed evidence is acceptable; this does not prove causality.
- `REVIEW_WEAK_EVIDENCE`: inspect failures and methodology before changing or removing the skill.
- `IMPROVE_EXISTING_SKILL`: prefer extending the closest existing methodology owner.
- `CREATE_SKILL_CANDIDATE`: create a new skill only after reviewing concrete examples and ownership boundaries.
- `INSUFFICIENT_PATTERN`: do not promote a one-off lesson into a skill.

Never auto-delete, auto-disable, auto-rewrite, or auto-create a skill solely from aggregate statistics or lexical similarity.

## Learning evolution

Use this progression:

`observation -> verified lesson -> recurring pattern -> methodology -> skill -> deterministic automation`

Do not promote a one-off fix into a new skill. Prefer improving an existing owner skill when the methodology overlaps.

## Anti-patterns

Do not capture every successful task. Do not store current branch, next task, CI-green claims, temporary provider state, or implementation progress in durable memory. Do not infer root cause from raw logs when no verified structured lesson exists. Do not load all memories because one project is mentioned. Do not let an LLM own workflow state or permanent truth.

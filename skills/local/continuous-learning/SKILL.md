---
name: continuous-learning
description: >-
  Route relevant memory and curated recall into a session, and turn verified evidence into reviewed memory or skill candidates. Not a source of repository status or truth; never auto-promotes unverified narration. Use before work and after a fix.
---

# Continuous Learning

Repository contracts, executable behavior, and `.delivery` evidence are
authority. Memory is advisory context. Skills are reusable methodology. When
memory and disk disagree, disk wins and the memory is stale.

Command flags and the semantics of each tool (recall, staging, harvest,
hygiene, lifecycle, skill attribution and evolution) are in
[tooling.md](references/tooling.md); open the section the path names.

**Pick the path first:**
- Starting work → §1 only.
- Earlier decisions matter → §1 + `tooling.md` § Curated cross-session
  recall.
- A verified non-trivial fix just landed → §2.
- Reviewing or promoting a candidate → §3.
- Skill effectiveness or memory retention question → `tooling.md`
  § Memory lifecycle / § Skill attribution.

## 1. Before execution

1. Decide whether memory is materially needed; self-contained tasks load
   none.
2. `ai-memory-access "<request>" --repo <repo> --json` (omit `--repo`
   without a repository). Load only the returned files within the budget.
3. For resume, current status, or next blocker read `STATUS.md`, `TASKS.md`,
   `.delivery/current.json`, and the code — not cross-session memory.

## 2. After verified work

Capture only a non-trivial, reusable, machine-verified lesson that no
repository test or document already preserves. Scope: `project` (stable
project constraint), `shared` (cross-project invariant), `methodology`
(repeatable workflow for its owning skill).

- Inside an active delivery run: `delivery-learning stage` before
  `delivery-ledger finish`; only a finished `PASS` run with every check
  green finalizes it into a signal and a local review candidate.
- Outside a run: `ai-learn capture` (the core's path); result is a
  device-local candidate.

English only; no secrets, customer data, raw logs, hidden reasoning,
volatile status, or speculative root cause. No staged lesson → no inference.

## 3. Before promotion

Review the candidate and its provenance; run
`ai-memory-hygiene --candidate <file>`; resolve `MEMORY_CONFLICT` against
repository evidence or explicit direction; merge a `SEMANTIC_DUPLICATE` into
the canonical owner instead of appending. Decide the durable owner — facts
and preferences → shared memory; project-specific reference → project
memory; repeatable methodology → the owning skill; temporary or redundant →
discard. `ai-learn promote … --yes` only after that review. Promotion never
authorizes commit or push.

Progression: observation → verified lesson → recurring pattern →
methodology → skill → deterministic automation. A one-off fix never becomes
a skill; extend the closest existing owner. Lifecycle and evolution reports
are advisory: never auto-delete, archive, rewrite, or create from a score.

## Anti-patterns

Capturing every successful task · branch, next task, CI-green claims, or
provider state in durable memory · root cause inferred from raw logs · all
memories loaded because a project was mentioned · an LLM owning workflow
state or permanent truth.

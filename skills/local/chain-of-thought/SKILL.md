---
name: chain-of-thought
description: >-
  Apply structured chain-of-thought and deep reasoning to complex engineering problems: step-by-step problem decomposition, invariant identification, hypothesis testing, and edge-case exploration. Not for trivial edits or simple lookups. Use when the user asks for chain of thought, reasoning, deep thinking, complex problem analysis, root-cause deduction, architecture trade-offs, or systematic decision-making.
---

# Chain of Thought & Deep Reasoning

Apply disciplined, step-by-step reasoning to untangle complex systems, diagnose elusive bugs, evaluate high-stakes architecture decisions, and design robust algorithms.

Stop the reflex to generate code immediately. Understand the system state, separate facts from inferences, explore branches systematically, and verify invariants before touching code.

## Trigger Boundary

Use this skill when:
- Analyzing multi-variable regressions, race conditions, memory leaks, or concurrency bugs.
- Evaluating architectural trade-offs with irreversible consequences (DB schema, auth, payment, data consistency).
- Designing non-trivial algorithms, state machines, or parsing logic.
- The user explicitly asks for "chain of thought", "reasoning", "deep thinking", "pikirkan bertahap", or "analisis mendalam".
- An existing fix attempt failed and a fresh, systematic breakdown is required.

Do not use this skill for:
- Simple syntax queries, straightforward one-line edits, or mechanical refactors.
- Standalone PRD creation (owned by [`prd-taskbreaker`](../prd-taskbreaker/SKILL.md)).
- Product/market discovery (owned by [`product-intelligence`](../product-intelligence/SKILL.md)).
- Pure code bloat/YAGNI removal (owned by [`lean-code-review`](../lean-code-review/SKILL.md)).

## The 5-Step Reasoning Protocol

### 1. Deconstruct & Anchor Facts
- **Collect Ground Truth**: Inspect repository disk, configs, logs, and executable checks. Disk truth beats memory and assumptions.
- **Separate Fact vs. Inference**:
  - `Fact`: Observed outputs, compiler errors, file content, timestamps, exact diffs.
  - `Inference`: Hypotheses about why something happened, expected behavior, or unverified claims.
- **Identify Invariants**: What MUST remain true under all conditions (e.g. idempotency, balance consistency, auth boundaries, zero data loss)?
- **Pin the Earliest Divergence**: Locate the exact point where actual system state diverged from expected invariant, not just where the crash was reported.

### 2. State & Branch Exploration (Tree of Thoughts)
- Frame the problem as a state machine or execution timeline.
- Generate at least 2 distinct hypotheses or solution paths:
  - **Path A (Direct/Conservative)**: Smallest touch to existing mechanism.
  - **Path B (Structural/Fundamental)**: Resolves underlying flaw or removes fragility.
- For each path, identify the exact state transition where it succeeds or fails.
- Define explicit **Falsification Criteria**: What observable evidence or test would definitively prove each hypothesis FALSE?

### 3. Stress Testing & Counter-Examples
- Actively seek counter-examples to disprove each hypothesis:
  - **Concurrency & Re-entrancy**: What if two requests arrive simultaneously?
  - **Partial Failures**: What happens if network drops mid-transaction?
  - **Boundary Inputs**: Empty sets, huge payloads, Unicode/escaped inputs, null/undefined, stale tokens.
  - **Blast Radius**: What existing callers or consumers break if this changes? Grep every caller before editing shared code.

### 4. Synthesis & Lazy Senior Selection
- Select the path that holds at the lowest sufficient rung:
  1. Does this need to exist? (YAGNI)
  2. Already in codebase or stdlib/native platform? (Reuse)
  3. Smallest change with highest invariant preservation.
- Document deliberate ceilings with clear rationale (e.g. `// lazy: <ceiling and upgrade path>`).
- Never simplify away: trust-boundary validation, data-loss prevention, security controls, or accessibility.

### 5. Verification Ledger
- Define the exact verification command or test scenario *before* implementing.
- Every non-trivial reasoning step requires a falsifiable check (unit test, curl command, or reproducible script).
- Verify independently: never claim "it works" without executing the project's own test or verification command.

## Circuit Breaker (Anti-Thrashing)

If a proposed fix or verification fails:
- **Max 2 Iterations**: Do NOT proceed with a 3rd speculative tweak or blind retry.
- **Halt and Step Back**: Immediately stop making edits. Return to Phase 1 (Deconstruct & Anchor Facts).
- **Audit Assumptions**: Re-read the runtime logs, inspect current disk state, and identify which assumption in the hypothesis was flawed before making another change.

## Output Format

When presenting reasoned analysis to the user, keep explanations in casual Bahasa Indonesia (per user core preferences) while technical terms, code symbols, and architecture remain English:

```markdown
### 1. Problem Deconstruction & Invariants
- **Observed Facts**: [Disk/runtime evidence]
- **Earliest Divergence**: [Where expected state deviated from actual state]
- **Core Invariant**: [What must never break]

### 2. Hypotheses & Solution Branches
- **Branch A**: [Description, mechanism, trade-offs, falsification test]
- **Branch B**: [Description, mechanism, trade-offs, falsification test]

### 3. Stress-Testing & Counter-Examples
- [Edge cases, concurrency, failure modes evaluated]

### 4. Recommended Path (Root-Cause Fix)
- [Smallest robust solution + why it wins]

### 5. Executable Verification Plan
- [Exact command or scenario to prove correctness]
```

## Cognitive Guardrails

- **Never guess identifiers or destructive targets**: Grep disk before naming files or functions.
- **Beware the local fix**: If an edit only masks the symptom (e.g. adding `try-catch` around a null pointer instead of fixing why the pointer is null), reject it.
- **No speculative scaffolding**: Do not write code for "future extensibility" that was not explicitly requested.
- **Respect Approval Gates**: Deep reasoning never bypasses user authorization for secrets, destructive commands, or production deploys.

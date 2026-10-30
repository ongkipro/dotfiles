---
name: chain-of-thought
description: >-
  Structured reasoning for hard engineering problems: decomposition, invariants, hypothesis tests, edge cases, root-cause deduction, architecture trade-offs. Not for trivial edits or lookups. Triggers: chain of thought, deep thinking.
---

# Chain of Thought

Stop the reflex to write code. Establish what is observed, what is inferred,
and what must stay true, then test hypotheses against evidence before
touching the system.

**Use for:** multi-variable regressions, races, leaks, concurrency bugs;
irreversible architecture trade-offs (schema, auth, payment, consistency);
non-trivial algorithms, state machines, parsers; a failed fix that needs a
fresh breakdown; an explicit request ("chain of thought", "pikirkan
bertahap", "analisis mendalam"). **Not for:** one-line edits, mechanical
refactors, PRDs (`prd-taskbreaker`), product discovery
(`product-intelligence`), bloat removal (`lean-code-review`).

## Protocol

1. **Anchor facts.** Inspect disk, configs, logs, executable checks. Label
   each statement `Fact` (observed output, file content, diff, timestamp) or
   `Inference`. Name the invariants that must hold (idempotency, balance,
   auth boundary, no data loss). Pin the **earliest divergence** between
   expected and actual state, not the point where the crash surfaced.
2. **Hypotheses.** Frame the problem as a state machine or timeline. Compare
   plausible causes or paths only when the evidence leaves a material choice
   — a direct reproduction may already name the cause; never invent a second
   branch to fill a template. For each path, write the **falsification
   criterion**: the observation that would prove it wrong.
3. **Counter-examples.** Concurrency and re-entrancy (two requests at once),
   partial failure (network drops mid-transaction), boundary inputs (empty,
   huge, Unicode, null, stale token), blast radius (every caller of the code
   you would change).
4. **Select.** The smallest change that preserves the invariants, chosen on
   the core's ladder (need → reuse → native → minimal). Reject a fix that
   masks the symptom (a `try/catch` around a null instead of the reason it is
   null).
5. **Verify.** Define the check before implementing; one falsifiable check
   per material claim (a test, a `curl`, a reproducible script), reused where
   it covers several. Run it.

**On a failed fix or check:** a retry that adds no evidence is thrashing.
Return to step 1, re-read the logs and disk, and find which assumption broke.
Deterministic failures need diagnosis; only a transient one earns a bounded
retry.

## Output

Conclusion, decisive evidence, trade-offs, and executed verification, in the
user's language and sized to the problem. Do not paste internal deliberation;
reasoning length is not a verification result. A concluded costly-to-reverse
trade-off goes to `adr-record`; a state machine worth keeping goes to
`mermaid-diagram`.

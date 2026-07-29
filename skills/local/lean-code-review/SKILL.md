---
name: lean-code-review
description: >-
  Review a code diff or, when explicitly requested, a whole repository for
  unnecessary complexity: dead flexibility, duplicated helpers, speculative
  abstractions, avoidable dependencies, hand-written stdlib/platform features,
  wrappers that only delegate, and code that can be safely deleted or inlined.
  Use when the user asks for an over-engineering review, lean review, deletion
  pass, simplification audit, bloat audit, YAGNI review, or asks what code or
  dependencies can be removed. Return evidence-backed findings only; do not
  apply fixes unless asked. This complements correctness, security, performance,
  and accessibility review rather than replacing them.
---

# Lean Code Review

Find the smallest safe implementation without confusing fewer lines with better
code. Review the current diff by default. Scan the whole repository only when
the user explicitly requests a repo-wide audit.

## Workflow

1. Read the task and the changed flow end to end. Identify the behavior that
   must remain true.
2. Search every caller before judging a helper, wrapper, or abstraction.
3. Check the codebase, standard library, native platform, and installed
   dependencies before proposing new code or packages.
4. Separate measurable complexity from taste. Report only findings with a
   concrete deletion or smaller replacement.
5. Rank findings by maintenance reduction, dependency removal, and blast radius.
6. If the replacement depends on a stack-specific native feature, consult
   `native-first` for that stack.

## Finding tags

- `delete:` dead code, unused flexibility, or speculative functionality.
- `reuse:` logic already implemented elsewhere in the repository.
- `stdlib:` custom logic replaced by a standard-library feature.
- `native:` dependency or code replaced by a platform feature.
- `dependency:` package whose value does not justify its maintenance surface.
- `inline:` wrapper, interface, factory, or config layer with one real consumer.
- `shrink:` same behavior and edge-case correctness with materially less code.

## Output

Return one line per finding:

```text
<file>:<line> — <tag> <what to remove>. Replace with <specific smaller path>. <caveat or trigger, if any>
```

Do not invent savings. State line or dependency reduction only when it can be
calculated from the inspected change. If there are no defensible findings,
return:

```text
Lean already. Ship.
```

## Boundaries

- Never recommend removing trust-boundary validation, data-loss prevention,
  security controls, accessibility, or explicitly requested behavior.
- A small runnable check for non-trivial logic is not bloat.
- Do not report correctness, security, or performance defects as lean findings;
  route them to the appropriate review.
- Do not replace robust code with a shorter but weaker algorithm.
- Do not apply findings during a review-only request.
- When asked to fix findings, implement the smallest approved set and run the
  repository's own validation commands.

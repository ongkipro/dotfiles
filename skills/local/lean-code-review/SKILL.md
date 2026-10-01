---
name: lean-code-review
description: >-
  Review a code diff or, when explicitly requested, a whole repository for
  unnecessary complexity and safe deletions. Not correctness, security,
  performance, or accessibility review (code-review, application-security,
  web-perf, ui-validation). Use for an over-engineering review, lean review,
  deletion pass, simplification audit, bloat audit, YAGNI review, or when
  asked what code or dependencies can be removed: dead flexibility, duplicated
  helpers, speculative abstractions, avoidable dependencies, hand-written
  stdlib/platform features, wrappers that only delegate, and narrating
  comments. Return evidence-backed findings only; do not apply fixes unless
  asked.
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
   For a repo-wide audit, run an unused-code tool the project already has
   configured (for example a `knip` script, which reports unused files,
   exports, and dependencies: https://knip.dev, verified 2026-10-02) and treat
   each hit as a lead to confirm by caller search, not a finding: dynamic
   imports, framework entry points, and public package exports produce false
   positives. Do not install one for a diff review.
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
- `comment:` a comment that restates the code, narrates steps, decorates
  (banners, emoji, end-of-block markers), or promises vague future work. Delete
  or shorten it to one line; keep comments that record a why, a constraint, or a
  deliberate ceiling (`// lazy:`). Never touch code under this tag.

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

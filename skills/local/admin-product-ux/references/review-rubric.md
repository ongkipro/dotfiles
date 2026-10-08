# Admin Product UX Review Rubric

Block implementation when a critical unknown would materially change the
product.

## Product correctness

- Can every primary actor complete the named job?
- Are objects, ownership, lifecycle, and transitions explicit?
- Are stored states separated from derived conditions?
- Are exceptions, conflicts, retries, and partial failures recoverable?

## Interaction correctness

- Does every screen have one dominant job and action?
- Are list-detail context, filters, saved views, and bulk semantics explicit?
- Are applicable async, empty, stale, error, permission, and terminal states covered?
- Do forms preserve input and explain field/server failures?

## Governance and adaptation

- Are role and tenant/object scope enforced server-side?
- Are approval, impersonation, destructive actions, and audit evidence defined?
- Are timezone, currency, freshness, and aggregation semantics explicit?
- Does the implementation mapping fit the installed framework without changing
  the product contract?
- When the accepted visual system includes dark mode, do both themes preserve
  hierarchy, semantics, focus, and contrast? (The clean-light baseline is
  light-only by stated deferral; a dark theme is added on request.)
- Are posted/immutable records, period locks, maker-checker separation, and
  timer-driven auto-transitions modelled where money or deadlines are involved?
- Does each destructive action have its tier (high / medium / low) and does
  each settings form use a single save model?
- Does every composite control (dialog, combobox, menu, tabs, editable grid)
  name its WAI-ARIA APG pattern, so the keyboard contract is decided before
  implementation?

## Scale and handoff

- Does behavior remain coherent at realistic record volume and concurrency?
- Can downstream skills implement without inventing business rules?
- Are assumptions, unresolved decisions, and acceptance criteria visible?

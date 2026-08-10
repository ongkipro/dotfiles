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
- Do light and dark themes preserve hierarchy, semantics, focus, and contrast?

## Scale and handoff

- Does behavior remain coherent at realistic record volume and concurrency?
- Can downstream skills implement without inventing business rules?
- Are assumptions, unresolved decisions, and acceptance criteria visible?

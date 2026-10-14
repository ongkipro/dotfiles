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
- Are **First-Use Empty** states (progressive onboarding checklist driven by live DB state, deep-linking to each setup action, and dismissible once core setup is complete) explicitly separated from **Filtered-Zero Empty** states (echoing active filter/query with a 1-click `Reset Filters` action)?
- Do forms preserve input and explain field/server failures?

## Governance and adaptation

- Are role and tenant/object scope enforced server-side?
- Are approval, impersonation, destructive actions, and audit evidence defined?
- For **AI/agentic operator actions** (copilot drafts, automated anomaly triage, bulk categorizations, campaign/ad adjustments), is **Human-in-the-Loop (HITL)** enforced so the agent never silently executes high-blast-radius mutations (`Approve Refund`, `Publish Ad Campaign`, `Adjust Ledger`)? Does the UI show a before/after diff preview, confidence/evidence citations, 1-click reject/manual fallback, and dual audit attribution (`Drafted by AI Agent (<model/rule>) · Approved by <User>`)?
- Are timezone, currency, freshness, and aggregation semantics explicit?
- Does the implementation mapping fit the installed framework without changing
  the product contract?
- When the accepted visual system includes dark mode, do both themes preserve
  hierarchy, semantics, focus, and contrast? (The clean-light baseline is
  light-only by stated deferral; a dark theme is added on request.)
- Are posted/immutable records, period locks, maker-checker separation, and
  timer-driven auto-transitions modelled where money or deadlines are involved?
- Where workflows produce physical or legal documents (shipping labels/AWB,
  packing slips, invoices, purchase orders), are printable state boundaries and
  `@media print` layout rules delegated to `admin-dashboard/references/dataviz-and-print-specs.md`?
- Does each destructive action have its tier (high / medium / low) and does
  each settings form use a single save model?
- Does every composite control (dialog, combobox, menu, tabs, editable grid)
  name its WAI-ARIA APG pattern, so the keyboard contract is decided before
  implementation?

## Scale and handoff

- Does behavior remain coherent at realistic record volume and concurrency?
- Can downstream skills implement without inventing business rules?
- Are assumptions, unresolved decisions, and acceptance criteria visible?

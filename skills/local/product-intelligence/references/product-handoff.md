# Product and UX Handoff

This is a field-level interface, not a UX method or visual-design template. Apply the [Evidence and Claim Contract](evidence-contract.md) and pass canonical IDs rather than copying source narratives.

## Product-intelligence to product-workflow specialist

Select one primary workflow owner:

- [`admin-product-ux`](../../admin-product-ux/SKILL.md) for SaaS, CRM, ERP, internal tools, seller/operator consoles, approvals, permissions, audit history, and other operational product workflows;
- [`storefront-ux`](../../storefront-ux/SKILL.md) for customer-facing commerce journeys, product discovery, product detail, variants, cart, checkout handoff, account, localization, and direct-order/COD behavior.

If both surfaces exist, give each specialist a non-overlapping surface boundary and retain one canonical owner for every shared fact. The handoff contains:

- pending decision, accountable owner, horizon, appetite, go/hold/stop thresholds, goals, non-goals, exclusions, and unresolved owner-held decisions;
- actors/roles and goals, separating user, buyer, approver, administrator, operator, and external/system actor where applicable;
- domain entities, relationships, ownership, business invariants, and authoritative data boundaries;
- lifecycle/state matrix, allowed transitions/commands, preconditions, terminal states, and recovery paths;
- permissions for allowed and denied actions, approval owner/rules, destructive-action confirmation, audit requirements, and authorization boundary;
- primary and alternate workflows, entry/exit conditions, partial completion, conflict, failure, retry/recovery, and external dependencies;
- current alternatives/workarounds, frequency/urgency, channel/client, and product/platform boundaries such as authentication, checkout, or external integration;
- constraints for privacy/security, data sensitivity, locale, timezone, currency, accessibility, responsiveness, and supported environments;
- evidence IDs, canonical status and separate evidence kind, confidence with reason, counterevidence, limitation/applicability, and review trigger for each material input;
- known policy plus every unresolved policy as `Unknown` or an accountable `Decision`, with options, recommended default, trade-offs, and consequence.

The specialist owns its methodology for roles, lifecycle, permissions, workflows, information architecture, list/detail/create/edit relationships, screen states, accessibility, responsive behavior, and localization. This interface does not restate those rules.

## Product-workflow specialist result

The specialist returns an evidence-linked contract containing:

- resolved role/job and domain ownership map;
- entity/state/transition and permission decisions, including denied behavior and audit/approval obligations;
- journey and workflow IDs, entry points, navigation/view hierarchy, and list/detail/create/edit relationships;
- screen inventory with purpose, authorized actions, required data, and owning workflow/state;
- state matrix covering relevant default, loading, empty, success, validation, error, conflict, partial, recovery, destructive-confirmation, permission-denied, and offline states;
- for every UI action: initiating role, job, entity and source state, permission/precondition, command/transition, observable success behavior and resulting state, observable failure/denial behavior, recovery, audit/analytics event where required, and linked acceptance/evidence IDs;
- semantic/keyboard/focus/assistive-technology behavior, responsive/adaptive rules, locale/text direction, timezone/currency/number/date behavior, and any unresolved implementation validation needs;
- unresolved product-policy decisions with one owner and gate; exclusions and explicitly unsupported states;
- evidence links, confidence/limitations, contradictions, and recommended next evidence.

UI visibility is never the sole authorization contract. A screen or action cannot exist only because a generic layout contains it. Any proposed action that lacks a role, job, domain state, permission, and observable success/failure behavior is incomplete and cannot pass to visual design.

## Product contract to visual specialist

Only after policy, workflow, permissions, and state behavior are sufficient, pass the specialist result to:

- [`admin-dashboard`](../../admin-dashboard/SKILL.md) for data-dense admin/dashboard information hierarchy and operator surfaces; or
- [`design-taste`](../../design-taste/SKILL.md) for customer-facing or marketing visual direction where product behavior is already settled.

The visual handoff includes the accepted screen/journey contract IDs; roles and jobs; screen purpose and hierarchy; required data and actions; complete state/validation/error behavior; responsive and accessibility constraints; localization/timezone/currency constraints; existing design tokens/components; content constraints; acceptance criteria; and unresolved implementation-only questions.

Visual specialists own presentation, visual hierarchy, layout, and their specialist visual methods. They must not invent or change roles, permissions, lifecycle, pricing, approval rules, product policy, business invariants, error semantics, or canonical domain facts. Any missing policy returns to the named product owner as `Unknown` or `Decision`; it is not silently resolved in a mockup. Executable/browser validation remains later runtime work and is not proven by the handoff or design artifact.

See [Evidence and Claim Contract](evidence-contract.md), [Market Intelligence](market-intelligence.md), and [Adaptive Artifact Routing](artifact-routing.md), or return to the [Product Intelligence skill](../SKILL.md).
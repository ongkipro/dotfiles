# Adaptive Artifact Routing

This contract selects the smallest artifact set after decision framing and evidence review. It does not create a second tier engine. Product-intelligence owns pre-specification synthesis and the human gates; established skills own artifacts and domain methodology.

## Pre-specification handoff

Before artifact selection, provide:

- decision brief ID, owner, horizon, risk if wrong, scope, appetite, exclusions, acceptable uncertainty, and go/hold/stop thresholds;
- relevant repository/runtime observations and locators, current behavior, constraints, and preserved behavior;
- source/claim links under the [Evidence and Claim Contract](evidence-contract.md), including conflicts, limitations, and unresolved `Unknown`/`Decision` rows;
- applicable [market](market-intelligence.md) boundary/results and [product/UX](product-handoff.md) contracts;
- proposed delta and activated product, technical, data, identity, API, security/privacy, operational, localization, and jurisdiction concerns;
- impact, uncertainty, reversibility, blast radius, data/security sensitivity, operating cost, and plausible near-horizon changes;
- recommended route, included and omitted artifacts with reasons, one canonical owner per fact, review gates, and blockers.

Prepare only low-cost seams for high-probability changes. Record speculative abstractions as exclusions rather than generating artifacts for them.

## Human gates

1. **Decision gate:** the accountable owner resolves or explicitly gates material policy, threshold, scope, appetite, market boundary, pricing, permissions, and costly-to-reverse choices. Evidence cannot choose these.
2. **Artifact gate:** the owner accepts the proposed profile/route, fact-triggered overlays, included artifacts, omitted-artifact rationale, canonical owners, and brownfield delta.
3. **Readiness gate:** accepted requirements, decisions, activated contracts, dependencies, tasks, acceptance criteria, and unresolved blockers are traceable; structural checks and separate semantic contradiction/coverage review are complete.
4. **Implementation gate:** explicit approval is required before implementation or repository/runtime mutation. Research or planning approval is not enough.
5. **Proof gate:** after implementation, only fresh, scoped evidence from executed verification supports a verified behavior claim.
   `TEST-*`/`EVID-*` is the product-intelligence/development-spec-suite naming convention, not a schema imposed on specialist skills. A downstream specialist's own scoped verification evidence (for example, `ui-validation` screenshot evidence) satisfies this gate; link or map that evidence when reconciling the canonical artifacts.

Without implementation approval, stop after returning the reviewed specification route and remaining owned gates.

## Route selection

### Bounded work

Use [`prd-taskbreaker`](../../prd-taskbreaker/SKILL.md) when the work is a bounded product/feature decision whose requirements can live coherently in its standalone `PRD.md`, optional `PLAN.md`, and post-acceptance `TASKS.md`. Accepted decision/evidence context stays in the PRD. Do not initialize a specification suite or duplicate the same requirements elsewhere.

### Research-heavy or multi-domain work

Use [`development-spec-suite`](../../development-spec-suite/SKILL.md) for research-heavy, multi-domain, product/platform, high-risk, regulated, or broad brownfield work. Reuse its existing:

- [`lean`, `product`, and `platform` profile selection and fact-driven overlays](../../development-spec-suite/references/context-resolution.md);
- canonical `CONTEXT-RECORD.md` for `CTX-*` facts, assumptions, decisions, and applicability;
- [document activation and ownership map](../../development-spec-suite/references/document-map.md);
- [requirements, task, evidence, and canonical ownership rules](../../development-spec-suite/references/requirements-traceability.md).

Profiles set depth; facts activate overlays and artifacts. Labels such as “SaaS,” “enterprise,” “global,” or “AI” do not activate contracts by themselves. Reuse only existing overlays such as `multi-tenant`, `identity`, `public-api`, `custom-domain`, `localized-ui`, `commerce`, `personal-data`, `cross-border`, `regulated-sector`, `ai-system`, `high-availability`, `mobile-desktop`, `extension-plugin`, and `data-analytics`. An explicit overlay override remains an owned context decision that repository evidence must confirm.

Market, UX, API, security, and diagrams remain sections until the existing profile/overlay rules or independent ownership/lifecycle justify separate artifacts. Omitted suite artifacts record `Not applicable`, reason, owner, and review gate.

## Canonical owner boundaries

Use the suite's document map rather than reproducing domain content. In particular:

- PRD owns observable product behavior and NFRs; BRD owns business outcomes and commercial constraints.
- Technical Design owns bounded component/integration/migration behavior; Architecture owns system, runtime, deployment, and trust boundaries.
- Data Model owns schema and lifecycle; IAM owns identity and authorization policy.
- Machine-readable HTTP contracts belong to [`openapi-spec`](../../openapi-spec/SKILL.md); product intent remains in the PRD and runtime conformance remains `TEST-*`/`EVID-*`.
- Product workflows belong to the appropriate specialist named in [Product and UX Handoff](product-handoff.md); visual specialists do not own product policy.
- Security owns threats and controls; Privacy/Compliance owns applicability, inventory, rights, retention, and transfers; qualified humans retain legal conclusions.
- Delivery/Migrations, Observability/Rate Limits, Billing, Design System, and SLA/DRP own only the facts assigned by the canonical document map.

A canonical fact appears normatively in one owner artifact. Other artifacts link to its ID. Duplicate or divergent declarations are reported, not reconciled by creating a second owner.

## Brownfield delta

For an existing system, do not regenerate the pack. Record observed current behavior and locators, proposed delta, affected accepted IDs/artifacts, compatibility implications, migrations and rollback, reconciliation steps, and behavior that must remain unchanged. Preserve accepted identifiers and history. Update only activated owners; link downstream changes and stale proof back to the changed canonical fact.

## Owner scenarios

These scenarios are routing decisions, not artifact templates.

### Bounded feature

A settled single-surface feature with no new trust, data, API, or operational boundary uses `prd-taskbreaker`: PRD owns behavior/NFRs, optional PLAN owns material implementation decisions, and TASKS owns implementation work after acceptance. Existing IAM or data facts are linked if relevant, not copied. No suite is created.

### Brownfield workflow change

An existing maintained application changes an approval lifecycle and persistent state. Select the smallest applicable suite profile from observed scope, preserve `CONTEXT-RECORD.md`, and activate only PRD, Technical Design, Data Model, IAM/Security when authorization changes, and Delivery/Migrations for schema rollout. PRD owns the observable workflow delta; Data Model owns state/schema; IAM owns authorization policy; Technical Design owns component flow; Delivery owns migration/rollback. Unrelated accepted artifacts remain untouched.

### UI-heavy product

A maintained multi-role operational UI uses the applicable suite route when domain and permissions span artifacts. PRD owns observable behavior; Data Model owns entity lifecycle if persistent; IAM owns authorization; the product-workflow specialist owns journey/screen contracts; Design System owns shared UI/accessibility/localization contract when triggered. `admin-dashboard` or `design-taste` receives the accepted contract only after policy is resolved and owns visual presentation, not roles, permissions, or lifecycle.

### Independent API

A feature with independent HTTP consumers, SDKs, webhooks, or compatibility commitments activates the `public-api` overlay and applicable Architecture, Security, Observability, and Technical Design contracts. PRD owns product intent; OpenAPI owns request/response schemas and compatibility; IAM owns authorization policy; Security owns threats/controls; Observability owns quotas/telemetry. Runtime conformance is proven separately and no prose schema competes with OpenAPI.

### High-risk multi-domain change

A platform change involving identity, personal data, commerce, cross-border processing, and availability uses the `platform` profile with only evidence-triggered overlays. `CONTEXT-RECORD.md` owns applicability facts and unresolved decisions; BRD owns commercial/regulatory goals when activated; PRD owns behavior; Architecture owns boundaries; IAM, Data Model, Billing, Security, Privacy/Compliance, Delivery/Migrations, Observability, and SLA/DRP each own their canonical domain facts. Jurisdiction applicability and residual-risk acceptance remain qualified human decisions. No artifact is activated merely to make the pack look complete.

In every scenario, one owner holds each canonical fact, specialists update that owner artifact, and the main session retains synthesis, contradiction resolution, final validation, and approval-boundary ownership.

Return to the [Product Intelligence skill](../SKILL.md).
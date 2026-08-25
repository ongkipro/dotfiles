---
name: development-kit
description: Navigate the reusable development-kit worked example and route each requested concern to its canonical planning, product, architecture, security, UI, implementation, or promotion owner. Use when the user mentions the development-kit folder, asks to reuse its 21-artifact reference pack, or wants to extract safe patterns from that pack. Not for creating or auditing a specification suite, deciding implementation readiness, promoting staged files, authoring a PRD, coding, deployment, or release.
---

# Development Kit Reference Router

Treat `~/Documents/work/prd/development-kit/` as a reusable worked example, never as product truth. This skill owns only safe navigation and handoff. It does not own specifications, approvals, readiness, promotion, implementation, or runtime evidence.

## Trigger boundary

Use this skill when the request explicitly concerns:

- the staged `development-kit` folder or its 21 reference artifacts;
- finding which artifact contains a concern;
- extracting a generic pattern without copying fictional facts;
- deciding which installed specialist should handle the next operation.

Route the operation itself to:

- idea, market, pricing, or product discovery: `product-intelligence`;
- standalone PRD and executable task breakdown: `prd-taskbreaker`;
- multi-document pack selection, initialization, applicability, traceability, or readiness audit: `development-spec-suite`;
- ADR authoring: `adr-record`;
- API contract authoring or validation: `openapi-spec`;
- admin workflow: `admin-product-ux`, then `admin-dashboard`;
- customer commerce workflow: `storefront-ux`;
- visual direction: `design-taste`; component implementation: `shadcn-ui`;
- application security or threat review: `application-security`;
- accepted cross-layer implementation: `full-stack-development`;
- browser-visible proof: `ui-validation`;
- staged-document promotion: the repository `project-init` contract, only after explicit development authorization.

Do not reproduce those skills' methodology here.

## Reference workflow

1. Read the pack `README.md` and `CONTEXT-RECORD.md`.
2. Use [Reference map](references/reference-map.md) to open only the artifact and specialist needed for the request.
3. Classify every extracted value as one of:
   - reusable invariant;
   - candidate pattern requiring project decision;
   - illustrative value that must not be copied;
   - current-source claim requiring retrieval and qualified review.
4. For Indonesia or Malaysia market work, apply the [adaptive market overlay](references/market-engineering.md). Activate only the locale, payment, tax, privacy, logistics, or regulatory concern triggered by the actual product; never turn the overlay into a global development gate.
5. Hand the operation to the canonical owner. The owner decides required documents, evidence, and approval gates.

## Safe reuse contract

- Preserve accepted identifiers only inside the project where they were accepted. Example IDs are teaching aids, not globally reusable requirements.
- Never copy fictional organizations, people, domains, customer research, financials, prices, quotas, vendors, regions, SLOs, RTO/RPO values, expiry windows, or approval records.
- Never turn `Example`, `Proposed`, `Unknown`, or `TBD` into `Accepted`, `Approved`, `Applicable`, `Compliant`, or `production-ready`.
- Reuse invariants only after checking the target stack and threat model. Examples: deny-by-default authorization, authenticated tenant context, transactional financial posting, replay-safe webhooks, expand-contract migration, schema-allowlisted telemetry, and restore evidence.
- A Markdown diagram proves intent only. A validator proves only its implemented structural checks. Runtime evidence requires executing the target system.
- Before a repository exists, authoritative planning belongs in `~/Documents/work/prd/<slug>/`. After approved promotion, the repository copy is canonical and the staged copy is only a snapshot.

## Output contract

Return:

1. exact reference artifact(s) consulted;
2. what is safely reusable versus project-specific;
3. canonical specialist/command owner for the requested next action;
4. blockers that need project facts, current official sources, qualified review, or explicit authorization.

Do not create a `DEVELOPMENT-KIT.md`, second PRD, second task queue, duplicate architecture, or shadow readiness report.

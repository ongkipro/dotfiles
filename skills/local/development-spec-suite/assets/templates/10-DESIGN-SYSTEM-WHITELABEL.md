# UI/UX Design System and White-labeling Guidelines

> Template note: document verified product and brand decisions only. Design tokens and component code remain their own runtime sources of truth; this document defines their contract and governance.

## Document Control

| Field | Value |
|---|---|
| Owner | [Design system owner] |
| Approvers | [Product, design, frontend, accessibility, brand] |
| Status | Draft / In review / Approved / Superseded |
| Version / updated | [Version] / [YYYY-MM-DD] |
| Applies to | [Products, surfaces, tenant tiers] |
| Required when | A product has shared UI components, multiple branded surfaces, accessibility commitments, or tenant-controlled branding. |

## Purpose, Inputs, and Outputs

**Purpose:** define consistent, accessible UI behavior and the safe boundary of tenant branding.

**Inputs:** `PR-*`, `NFR-*`, `IAM-*`, `DOM-*`, `BILL-*`, supported platforms, approved brand assets, and repository component evidence.

**Outputs:** `UX-*` requirements, token and component contracts, white-label capability matrix, accessibility gates, and visual-regression evidence.

## Experience Principles and Scope

| Principle | Observable implication | Requirement source |
|---|---|---|
| [Principle] | [Testable behavior] | PR-[N] |

In scope: [surfaces/components/themes]. Out of scope: [explicit exclusions]. Supported viewport, input, locale, and assistive-technology matrix: [TBD from evidence].

## Requirements

| ID | Requirement | Source | Verification |
|---|---|---|---|
| UX-1 | [Testable design-system or accessibility requirement] | PR-/NFR-[N] | [Story/automated/manual test] |
| UX-2 | [Testable white-label requirement] | BR-/BILL-/DOM-[N] | [Theme isolation test] |

## Token Architecture

| Layer | Examples | Owner | Tenant-overridable? | Validation |
|---|---|---|---|---|
| Primitive | [color scale, spacing] | [System] | No | [Token lint] |
| Semantic | [surface, text, action] | [System] | [Policy] | [Contrast/theme test] |
| Component | [button background] | [Component] | No direct override | [Visual test] |
| Tenant brand | [logo, accent, font allowlist] | [Tenant within policy] | Yes | [Upload/runtime validation] |

Define canonical token format, fallback behavior, dark/high-contrast themes, motion preferences, typography loading, and invalid-configuration behavior. Never allow tenant input to become arbitrary CSS or executable markup unless a separately reviewed sandbox is specified.

## Component Contract

For each shared component record: name, purpose, anatomy, variants, states, keyboard interaction, focus management, content rules, responsive behavior, localization behavior, and linked implementation/story.

| Component | States/variants | Accessibility contract | Owner | Evidence |
|---|---|---|---|---|
| [Component] | [States] | [Keyboard/name/role/state] | [Team] | [Story/test] |

## White-label Capability Matrix

| Capability | Allowed values | Plan/entitlement | Validation | Fallback | Audit event |
|---|---|---|---|---|---|
| Logo | [Formats, dimensions, size] | BILL-[N] | [Malware/content/dimension checks] | [Default] | [Event] |
| Color/theme | [Semantic inputs] | BILL-[N] | [Contrast and format] | [Safe theme] | [Event] |
| Custom domain | DOM-[N] | BILL-[N] | [Ownership/TLS state] | [Platform domain] | [Event] |

Define preview, publish, rollback, cache invalidation, asset lifecycle, tenant isolation, and who may change branding (`IAM-*`).

## Accessibility and Inclusive Design

State the selected conformance target and version only after approval. Cover semantic structure, keyboard-only operation, visible focus, contrast, zoom/reflow, reduced motion, screen-reader names/status, errors, time limits, touch targets, captions/transcripts, and localization. Record exceptions with owner, impact, workaround, and remediation date.

## Content, Responsive, and Performance Rules

### Localization and regional behavior

| `LOC-*` area | Required contract |
|---|---|
| Language/script | BCP 47 locales, fallback chain, Unicode behavior, pluralization, text expansion, RTL/bidirectional layout |
| Identity/contact | Flexible names, scripts, addresses, postcodes, province/state, phone formats, validation ownership |
| Time/number | Business timezone, user timezone, DST/calendar/week-start behavior, number/date formatting |
| Money/units | Currency, minor units, rounding, tax display, FX source/time, measurement units |
| Content | Regional availability, legal copy, SEO metadata, notifications, support channels, translation review |

For Indonesian product content, use Bahasa Indonesia rather than Malay and preserve approved technical English terminology. Do not use interface language alone as proof of residence or applicable jurisdiction. Accessibility targets must name both the selected WCAG conformance scope and any separate legal or contractual requirement.

- Content hierarchy, empty/error/loading/success states: [rules].
- Breakpoints derive from content behavior, not device brand: [rules].
- Asset budgets and font/image strategy reference `NFR-*` and performance evidence.
- Analytics MUST avoid sensitive field values and respect `PRIV-*` consent/collection rules.

## Decisions and Risks

| Decision ID | Decision | Alternatives | Rationale | Consequence | Status |
|---|---|---|---|---|---|
| ADR-[N] | [Decision] | [Options] | [Evidence] | [Trade-off] | Proposed/Accepted |

| Risk | Trigger | Impact | Mitigation | Owner | Evidence |
|---|---|---|---|---|---|
| Inaccessible tenant theme | Low-contrast override | Exclusion/compliance risk | Semantic constraints and pre-publish check | [Owner] | [Test] |
| Cross-tenant asset leakage | Cache or key lacks tenant scope | Brand/data exposure | Tenant-scoped keys and negative tests | [Owner] | [Test] |

## Traceability and Validation

| Requirement | Component/token/capability | Constraints | Tests | Task |
|---|---|---|---|---|
| UX-[N] | [Reference] | IAM-[N], DOM-[N], BILL-[N], SEC-[N] | UX-T[N] | T[N] |

- [ ] Every `UX-*` requirement has an observable acceptance test and owner.
- [ ] Token schemas, allowed overrides, defaults, and invalid-state behavior are executable or testable.
- [ ] Keyboard, screen-reader, contrast, zoom/reflow, reduced-motion, and localization checks cover supported surfaces.
- [ ] Tenant branding cannot inject executable content or access another tenant's assets/configuration.
- [ ] Visual regression covers default and representative valid/invalid tenant themes.
- [ ] Entitlements match `BILL-*`; permissions match `IAM-*`; domains match `DOM-*`.
- [ ] Performance checks validate font, image, CSS, and layout-shift budgets.
- [ ] Exceptions have an owner, expiry/remediation date, and approval evidence.

## Cross-Document References

[02-PRD.md](02-PRD.md) · [07-IAM-RBAC-ABAC.md](07-IAM-RBAC-ABAC.md) · [08-DOMAIN-ROUTING.md](08-DOMAIN-ROUTING.md) · [09-API-SPECIFICATION.md](09-API-SPECIFICATION.md) · [11-BILLING-PAYMENTS.md](11-BILLING-PAYMENTS.md) · [12-SECURITY-ARCHITECTURE.md](12-SECURITY-ARCHITECTURE.md) · [13-COMPLIANCE-PRIVACY.md](13-COMPLIANCE-PRIVACY.md)

## Open Questions and Change Log

| Item | Owner | Due | Gate |
|---|---|---|---|
| [TBD] | [Owner] | [Date] | G3/G4 |

| Date | Version | Change | Author | Approval |
|---|---|---|---|---|
| [Date] | [Version] | [Summary] | [Name] | [Reference] |

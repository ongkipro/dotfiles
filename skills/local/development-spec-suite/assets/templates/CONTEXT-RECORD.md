# Context Record

> Replace placeholders with repository evidence or an owned decision. This record selects the depth profile and overlays; it does not make legal or tax determinations.

## Document Control

| Field | Value |
|---|---|
| Owner | [Product/architecture owner] |
| Status | Draft / In Review / Approved / Superseded |
| Version / reviewed | [Version] / [YYYY-MM-DD] |
| Depth profile | lean / product / platform |
| Decision approvers | [Roles] |

## Context Facts

| ID | Dimension | Observed fact | Source/evidence | Confidence | Owner |
|---|---|---|---|---|---|
| `CTX-1` | Product surface | [Web/mobile/desktop/CLI/API/data/AI/plugin/etc.] | [Repository/source] | High/Medium/Low | [Role] |
| `CTX-2` | Entity and market | [Entity, establishment, target market] | [Source] | [Level] | [Role] |
| `CTX-3` | Data flow | [Subjects, categories, storage/processing/access regions] | [Data-flow/source] | [Level] | [Role] |
| `CTX-4` | Sector/commitment | [Sector, age group, SLA, contract] | [Source] | [Level] | [Role] |

## Overlay Decisions

| ID | Overlay | Status | Trigger facts | Selected artifacts | Owner | Recheck trigger |
|---|---|---|---|---|---|---|
| `OVR-1` | [multi-tenant/identity/cross-border/etc.] | Active / Inactive / Unknown | `CTX-*` | [IDs] | [Role] | [Event/date] |

## Jurisdiction and Transfer Handoffs

| ID | Territory/flow | Decision | Official source/status | Qualified owner | Engineering impact |
|---|---|---|---|---|---|
| `JUR-1` | [Territory/sector] | Applies / Does not / Unknown | [URL, status, dates] | [Legal/privacy/tax] | `PRIV-*`, `SEC-*`, `LOC-*` |
| `XFER-1` | [Exporter/importer/data flow] | [Assessment status] | [Reference] | [Owner] | `DATA-*`, `SEC-*` |

## Locale Contract

| ID | Locale/region | Language/script | Timezone/currency/units | Accessibility | Fallback/test evidence |
|---|---|---|---|---|---|
| `LOC-1` | [id-ID/en-US/etc.] | [BCP 47] | [Rules] | [Scope] | [Evidence] |

## Approval Gate

- [ ] Repository/runtime facts verified.
- [ ] Unknowns have owners and due dates.
- [ ] Overlay activation is explicit.
- [ ] Jurisdiction/sector applicability has qualified review.
- [ ] Cross-border flows and locale behavior have downstream requirements.

# Context Resolution

Collect facts before selecting documents. Keep product labels separate from capability and operating facts. A repository being called “SaaS,” “global,” “enterprise,” or “AI-powered” is not enough to activate billing, localization, compliance, or availability artifacts.

## Context input

The initializer accepts an optional UTF-8 JSON context file. JSON is used because Python ships with a parser and the suite must stay dependency-free on Linux and macOS.

```json
{
  "owner": "Architecture owner",
  "facts": [
    {
      "id": "CTX-1",
      "dimension": "Product surface",
      "statement": "Authenticated CRUD web application",
      "status": "Observed",
      "confidence": "High",
      "evidence": "src/routes and migrations",
      "owner": "Engineering owner",
      "recheck_trigger": "Routes or actors change"
    }
  ],
  "capabilities": {
    "identity": {
      "status": "active",
      "trigger_facts": ["CTX-1"],
      "owner": "Security owner",
      "reason": "Human actors authenticate",
      "review_gate": "Identity model changes"
    },
    "persistence": true
  },
  "jurisdictions": [
    {
      "code": "ID",
      "trigger_facts": ["CTX-1"],
      "source_status": "in-force",
      "publication_date": "2022-10-17",
      "effective_date": "2022-10-17",
      "decision": "Unknown",
      "owner": "Privacy owner"
    }
  ],
  "sectors": [{"code": "ecommerce", "trigger_facts": ["CTX-1"], "decision": "Unknown"}],
  "transfers": [],
  "locales": [
    {
      "id": "LOC-1",
      "locale": "id-ID",
      "fallback": "en",
      "regional_rules": "Intl-based date, number, and currency formatting",
      "accessibility": "Approved WCAG scope",
      "test_evidence": "TEST-1",
      "owner": "Design owner",
      "status": "Proposed"
    }
  ]
}
```

Every fact records `id`, `dimension`, `statement`, `status`, `confidence`, `evidence`, `owner`, and `recheck_trigger`. `CTX-*`, `JUR-*`, `XFER-*`, and `LOC-*` IDs must be unique and match their namespace; every supplied trigger must resolve to a declared `CTX-*` fact. Missing triggers on structured jurisdiction, sector, transfer, and locale records produce explicit owned decision facts rather than an invalid generated pack. Allowed statuses are `Observed`, `Decision`, `Assumption`, `Proposal`, `Unknown`, and `Evidence`. Do not convert a low-confidence or unknown statement into an observed fact.

When no context file is supplied, the initializer writes owned `Unknown` rows for these dimensions: product surface; operating entities; target markets; users/data subjects; storage, processing, backup, and support locations; processors; sector/age groups; commerce/payment/tax roles; AI role; locales; accessibility; and contractual commitments.

## Depth

| Profile | Typical scope | Default artifact behavior |
|---|---|---|
| `lean` | Bounded feature, library, CLI, automation, prototype, small internal tool | PRD only; facts add contracts |
| `product` | Maintained user-facing web/mobile/desktop product or service | PRD only; identity, persistence, deployment, UI, and other facts are independent triggers |
| `platform` | Multi-component/public/multi-tenant/marketplace/critical service | PRD + Technical Design + Architecture; other contracts remain fact-driven |

`saas` is a compatibility alias for `platform + multi-tenant + identity` only. It does not imply commerce, custom domains, localized UI, privacy applicability, or high availability.

## Capability and overlay triggers

Use the smallest fact that explains the contract:

| Fact/capability | Selected contract(s) |
|---|---|
| `component-change` | Technical Design |
| `external-integration`, `multiple-components` | Technical Design, Architecture |
| `persistence` | Data Model |
| `identity` | IAM, Security |
| `multi-tenant` | Tenant Isolation, Security, Observability |
| `public-api` | API, Architecture, Security, Observability |
| `custom-domain` | Domain Routing, Security |
| `shared-ui`, `localized-ui` | Design System |
| `product-ui` | Design System, UX Flows and Screen Contracts |
| `commerce` | Billing, Security, Privacy |
| `personal-data`, `cross-border` | Privacy, Security |
| `regulated-sector` | BRD, Privacy, Security |
| `ai-system` | Technical Design, Security, Privacy |
| `high-availability` | Architecture, SLA/DRP, Delivery, Observability |
| `mobile-desktop` | Technical Design, Design System, UX Flows and Screen Contracts |
| `extension-plugin` | Technical Design, Security |
| `data-analytics` | Data Model, Privacy, Observability |
| `maintained-deployment`, `schema-migration` | Delivery; schema migration also selects Data Model |
| `production-service` | Observability |

`--overlay` is an explicit operator override. The initializer creates a `CTX-*` decision record for it, but the pack must still confirm repository evidence before approval.

## Structured jurisdiction, sector, transfer, and locale records

Starter jurisdiction codes: `ID`, `EU`, `US`, `US-CA`, `UK` (alias `GB`), `SG`, `CA`, `BR`, `AU`, and `JP`. Codes identify candidate review scopes; they are not legal conclusions. Unsupported codes fail with an actionable error and require an official source before use.

Supported sector codes: `general`, `finance`/`financial-services`, `health`/`healthcare`, `education`, `children`, `government`, `telecom`/`telecommunications`, `ecommerce`, and `employment`. Sector activation remains a candidate applicability record owned by a qualified reviewer.

Each jurisdiction record preserves `proposed`, `adopted`, `enacted`, `in-force`, `superseded`, or `unknown` source state. Transfer records independently capture exporter/importer role and location, subjects/categories, purpose, storage/access, mechanism review, safeguards, onward transfers, retention/deletion, evidence, owner, and status. An EU conclusion cannot be reused for the UK, Indonesia, or another territory.

## Commands

```bash
python3 scripts/init-doc-suite.py \
  --profile product \
  --context-file /path/to/context.json \
  --jurisdiction ID,EU \
  --sector ecommerce \
  --output /path/to/project/docs/spec \
  --dry-run
```

Re-run resolution after a new market, entity, data type, processor, storage/support region, AI model, payment/tax role, locale, contract, or source-status change. Unknown is not “not applicable.”

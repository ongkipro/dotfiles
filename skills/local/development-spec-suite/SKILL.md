---
name: development-spec-suite
description: Select, initialize, and audit a traceable multi-document development specification pack across product, architecture, data, IAM, API, security, privacy, operations, UI, localization, and jurisdiction concerns. Use when several specification domains must stay consistent or an existing pack needs traceability/applicability audit. NOT for a PRD/TASKS-only request, a standalone contract/diagram, implementation, or legal conclusions.
---

# Adaptive Development Specification Suite

Select the smallest evidence-backed pack; delegate content to specialists.

## Token-efficient loading

Inspect evidence, then load only the triggered reference:

- context/profile/overlay selection → [context-resolution.md](references/context-resolution.md)
- artifact activation/ownership → [document-map.md](references/document-map.md)
- requirement IDs/tasks/evidence or pack audit → [requirements-traceability.md](references/requirements-traceability.md)
- geography, sector, personal data, AI, commerce, or transfers → [jurisdiction-overlays.md](references/jurisdiction-overlays.md)
- suite maintenance/release status only → [implementation-tasks.md](references/implementation-tasks.md)

Never load `assets/templates/*`, the source ledger, or maintenance backlog to answer a bounded planning question. Use scripts for deterministic selection and validation rather than reproducing their rules in the prompt.

## Operating contract

- Treat repository code, migrations, OpenAPI, infrastructure, design tokens, runtime configuration, and executed checks as stronger implementation evidence than stale prose.
- Label every statement as `Observed`, `Decision`, `Assumption`, `Proposal`, `Unknown`, or `Evidence`; never turn an assumption into a fact.
- Write artifact content in English unless the repository has an explicit content-language convention. Conversation stays Indonesian; Indonesian product content uses Bahasa Indonesia, not Malay, with technical terms kept in English.
- Keep legal, tax, privacy, security, compliance, and certification boundaries
  explicit: generic legal claims never establish applicability. Documents map
  triggers and controls; final conclusions require current official sources and
  qualified review.
- Never request, print, copy, or store credentials, tokens, payment data, customer records, sessions, or production secrets.
- Preserve existing files. Initialize missing files only; require explicit update mode before changing an established pack. Do not commit, push, merge, deploy, publish, or touch production without explicit user authorization.
- Before `~/Projects/<slug>/` exists, this skill's pack stages under the mandatory `~/Documents/work/prd/<slug>/` directory (detected by `CONTEXT-RECORD.md`) and is never authoritative alone. `project-init --from-docs` copies the accepted pack into `docs/spec/` once authorized; the repository copy is then canonical.

## Workflow

### 1. Discover before drafting

Inspect project instructions (`AGENTS.md`), repository status, package scripts, source layout, existing docs, migrations, API contracts, deployment configuration, and runtime evidence. Check available skills with `skill-list`; read only the relevant specialist `SKILL.md`.

When evidence does not resolve selection, read [context-resolution.md](references/context-resolution.md). Keep product surface, entities, markets/data subjects, processing locations, processors, sector, commerce, AI role, locales/accessibility, and contracts separate.

### 2. Select depth and overlays

Choose the smallest depth profile:

- `lean`: bounded feature, library, CLI, automation, prototype, or small internal tool.
- `product`: maintained user-facing web/mobile/desktop product or service.
- `platform`: public/multi-component/multi-tenant/marketplace/critical service.

Activate only evidence-backed overlays listed in the context-resolution
reference. `product-ui` means a
maintained browser flow needing durable journey and visual-system contracts.
`saas` aliases only `platform + multi-tenant + identity`.

Read [jurisdiction-overlays.md](references/jurisdiction-overlays.md) when its
triggers apply. Record `JUR-*`, `XFER-*`, and `LOC-*` with source, status,
dates, owner, and recheck trigger. Unknown is not not-applicable.

### 3. Select artifacts and owners

For artifact selection or ownership, read [document-map.md](references/document-map.md). Keep one owner per canonical fact:

- PRD owns observable product behavior and NFRs.
- BRD owns business outcomes, commercial constraints, and applicability goals.
- Technical Design owns component behavior and bounded flows.
- Architecture owns system/container/deployment boundaries.
- Data Model owns schema, constraints, lifecycle, and migration truth.
- IAM owns identity and authorization policy.
- OpenAPI owns machine-readable HTTP contracts via the local `openapi-spec` skill.
- Design System owns reusable visual, component, accessibility, brand, and
  white-label contracts through `UI-*`.
- UX Flows owns journeys, screens, states, permission visibility, responsive
  behavior, content needs, and browser acceptance through `UX-*`.
- Billing owns plans, entitlements, money/ledger/reconciliation, and provider-account roles.
- Security owns threats, controls, encryption/key lifecycle, and security evidence.
- Compliance/Privacy owns applicability, data inventory, rights, retention, transfers, and control mapping.
- SLA/DRP owns SLI/SLO/SLA distinction, recovery objectives, and exercise plans.
- Delivery/Migrations owns CI/CD, release, rollback, and schema-change safety.
- Observability owns telemetry, redaction, alerts, quotas, and rate limits.

When drafting tasks or auditing a pack, read [requirements-traceability.md](references/requirements-traceability.md). Each task has one primary requirement; list cross-cutting constraints separately.

### 4. Draft or initialize safely

Before `~/Projects/<slug>/` exists, initialize in the staging directory per the operating contract, never inside a nonexistent project:

```bash
python3 scripts/init-doc-suite.py --profile product --context-file /path/to/context.json --output ~/Documents/work/prd/<slug> --dry-run
python3 scripts/init-doc-suite.py --profile platform --overlay multi-tenant,public-api --jurisdiction ID,EU --output ~/Documents/work/prd/<slug>
```

`project-init --from-docs ~/Documents/work/prd/<slug>/` promotes the accepted pack into `~/Projects/<slug>/docs/spec/` once authorized. For a feature in an already-existing repository, skip staging and pass `--output ~/Projects/<slug>/docs/spec` to the same command directly.

The initializer creates `CONTEXT-RECORD.md` and never overwrites normally;
jurisdiction/sector flags create review candidates, not legal conclusions. `--update`
previews proposals; reviewed `--update --force` hash-checks and applies safely.

### 5. Delegate specialist work

This suite owns selection, canonical ownership, cross-document consistency, and traceability. A specialist updates the canonical artifact rather than create a competing source of truth. For a single-artifact request, route directly to the specialist; do not initialize a suite.

Use existing local skills when available:

- `prd-taskbreaker` for numbered requirements, PLAN/TASKS, dependencies, and runnable Done-when checks.
- `adr-record` owns full standalone ADRs; Technical Design retains only the `ADR-NNNN` index row and traceability link, never a competing register.
- `mermaid-diagram` for architecture, ERD, data-flow, and sequence diagrams.
- `openapi-spec` for the machine-readable API contract and compatibility checks.
- The provider skill that matches the project for payment-specific behavior: `stripe-best-practices`, `doku-malaysia-integration`, or `autolaris-h2h`; `mengantar-api` for shipping, rates, and COD.
- UI route: `admin-product-ux`/`storefront-ux` for behavior,
  `design-taste`/`admin-dashboard` for presentation, `shadcn-ui` for React
  implementation, and `ui-validation` for evidence. New or materially
  redesigned surfaces record proportional research and a direction decision.
- `native-first`, `web-perf`, `lean-code-review`, `application-security`, and platform/provider skills for implementation validation.

If a specialist is unavailable, state the capability gap and continue with a bounded, evidence-labelled draft; do not copy another skill's instructions into this one.

### 6. Validate and report

Validate a project pack with the deterministic checker; use JSON only for automation:

```bash
python3 scripts/check-traceability.py /path/to/project/docs/spec
python3 scripts/check-traceability.py /path/to/project/docs/spec --format json
```

When maintaining this skill itself, additionally run:

```bash
python3 -m py_compile scripts/*.py
python3 scripts/test-suite.py
python3 scripts/audit-sources.py
```

Run project-native checks before claiming behavior works; separate planning from runtime proof. Report profile/overlays, included/omitted artifacts with reasons, unresolved owners, source freshness, validation results, and remaining risk.

Only for suite maintenance or release-status claims, read [implementation-tasks.md](references/implementation-tasks.md). It is `v2 audit-ready` only while P0 fixtures pass, and `Cross-platform validated` only once the repository CI matrix passes on Ubuntu and macOS — not from a local run or workflow file alone.

## Cross-CLI and platform contract

The canonical source is `~/dotfiles/skills/local/development-spec-suite/`.

- Claude and Pi discover it through their established `skills/local` symlinks.
- Codex and Agy use `skill-list`, then read the canonical `SKILL.md` directly; never wrap it in a second plugin or copy.
- Linux and macOS run through Python 3, UTF-8 Markdown, and POSIX-safe paths; do not assume Homebrew, macOS apps, GNU-only flags, or a particular shell.
- Validate active symlinks with `skill-list` and `ai-doctor` after integration; a Git commit alone does not prove every CLI has refreshed its view.

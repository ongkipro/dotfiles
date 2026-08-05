---
name: development-spec-suite
description: Context-aware orchestrator for selecting, initializing, and auditing a traceable multi-document development specification pack across product, architecture, data, IAM, API, security, privacy, operations, localization, and jurisdiction concerns. Use when several specification domains must stay consistent or an existing pack needs traceability/applicability audit. NOT for a PRD/TASKS-only request (prd-taskbreaker), a standalone API contract (openapi-spec), a standalone diagram (mermaid-diagram), prose rewriting (volumx-writer), implementation, or a final legal/compliance determination.
---

# Adaptive Development Specification Suite

Select and audit the smallest evidence-backed pack; delegate artifact content to specialist skills.

## Token-efficient loading

Start here, inspect repository evidence, then load only the triggered reference:

- context/profile/overlay selection → [context-resolution.md](references/context-resolution.md)
- artifact activation/ownership → [document-map.md](references/document-map.md)
- requirement IDs/tasks/evidence or pack audit → [requirements-traceability.md](references/requirements-traceability.md)
- geography, sector, personal data, AI, commerce, or transfers → [jurisdiction-overlays.md](references/jurisdiction-overlays.md)
- suite maintenance/release status only → [implementation-tasks.md](references/implementation-tasks.md)

Never load `assets/templates/*`, the source ledger, or maintenance backlog merely to answer a bounded planning question. Use scripts for deterministic selection and validation rather than reproducing their rules in the prompt.

## Operating contract

- Treat repository code, migrations, OpenAPI, infrastructure, design tokens, runtime configuration, and executed checks as stronger implementation evidence than stale prose.
- Label every statement as `Observed`, `Decision`, `Assumption`, `Proposal`, `Unknown`, or `Evidence`; never turn an assumption into a fact.
- Write artifact content in English unless the target repository has an explicit content-language convention. Conversation with the user remains Indonesian; Indonesian product content uses Bahasa Indonesia, not Malay, while approved technical English remains precise.
- Keep legal, tax, privacy, security, compliance, and certification boundaries explicit. Identify triggers and map engineering controls, but do not make final legal applicability decisions or claim compliance from a document. Domain/design skills may contribute requirements, but their generic legal claims never establish applicability; record those as `Proposal` or `Unknown` pending official-source and qualified-owner review.
- Never request, print, copy, or store credentials, tokens, payment data, customer records, authentication sessions, or production secrets.
- Preserve existing files. Initialize missing files only; require explicit update mode before changing an established pack. Do not commit, push, merge, deploy, publish, or mutate production unless the user explicitly authorizes that action.

## Workflow

### 1. Discover before drafting

Inspect project instructions (`AGENTS.md` and equivalents), repository status, package scripts, source layout, existing docs, migrations, API contracts, deployment configuration, and runtime evidence. Check the available shared skills with `skill-list`; read only the relevant specialist `SKILL.md` files.

When evidence does not resolve selection, read [context-resolution.md](references/context-resolution.md). Keep product surface, entities, markets/data subjects, processing locations, processors, sector, commerce, AI role, locales/accessibility, and contracts separate.

### 2. Select depth and overlays

Choose the smallest depth profile:

- `lean`: bounded feature, library, CLI, automation, prototype, or small internal tool.
- `product`: maintained user-facing web/mobile/desktop product or service.
- `platform`: public/multi-component/multi-tenant/marketplace/critical service.

Then activate only evidence-backed overlays: `multi-tenant`, `identity`, `public-api`, `custom-domain`, `localized-ui`, `commerce`, `personal-data`, `cross-border`, `regulated-sector`, `ai-system`, `high-availability`, `mobile-desktop`, `extension-plugin`, and `data-analytics`. `saas` is accepted only as a compatibility alias for `platform + multi-tenant + identity`; it does not imply billing, domains, or white-labeling.

Read [jurisdiction-overlays.md](references/jurisdiction-overlays.md) when geography, sector, personal data, AI, commerce, or cross-border processing is present. Record `JUR-*`, `XFER-*`, and `LOC-*` decisions with official source, status, effective/publication date, retrieval date, owner, and recheck trigger. Unknown is not equivalent to not applicable.

### 3. Select artifacts and owners

For artifact selection or ownership, read [document-map.md](references/document-map.md). Keep one owner per canonical fact:

- PRD owns observable product behavior and NFRs.
- BRD owns business outcomes, commercial constraints, and applicability goals.
- Technical Design owns component behavior and bounded flows.
- Architecture owns system/container/deployment boundaries.
- Data Model owns schema, constraints, lifecycle, and migration truth.
- IAM owns identity and authorization policy.
- OpenAPI owns machine-readable HTTP contracts; use the local `openapi-spec` skill.
- Design System owns tokens, UI behavior, localization, and accessibility contract.
- Billing owns plans, entitlements, money/ledger/reconciliation, and provider-account roles.
- Security owns threats, controls, encryption/key lifecycle, and security evidence.
- Compliance/Privacy owns applicability, data inventory, rights, retention, transfers, and control mapping.
- SLA/DRP owns SLI/SLO/SLA distinction, recovery objectives, and exercise plans.
- Delivery/Migrations owns CI/CD, release, rollback, and schema-change safety.
- Observability owns telemetry, redaction, alerts, quotas, and rate limits.

When drafting tasks or auditing a pack, read [requirements-traceability.md](references/requirements-traceability.md). Each task has one primary requirement; list cross-cutting constraints separately.

### 4. Draft or initialize safely

Use the bundled initializer for a new flat specification pack:

```bash
python3 scripts/init-doc-suite.py --profile product --context-file /path/to/context.json --output /path/to/project/docs/spec --dry-run
python3 scripts/init-doc-suite.py --profile platform --overlay multi-tenant,public-api --jurisdiction ID,EU --output /path/to/project/docs/spec
```

The initializer creates `CONTEXT-RECORD.md` and never overwrites in normal mode. Selection uses optional UTF-8 JSON; jurisdiction/sector flags create review candidates, not legal conclusions. `--update` writes proposals, hashes, and diffs; reviewed `--update --force` confines paths, hash-checks files, creates unique backups, and applies each file atomically.

### 5. Delegate specialist work

This suite owns selection, canonical ownership, cross-document consistency, and traceability. A specialist owns the content of its artifact; it must update the selected canonical artifact rather than create a competing source of truth. For a single-artifact request, route directly to the specialist and do not initialize a suite.

Use existing local skills when available:

- `prd-taskbreaker` for numbered requirements, PLAN/TASKS, dependencies, and runnable Done-when checks.
- `mermaid-diagram` for architecture, ERD, data-flow, and sequence diagrams.
- `openapi-spec` for the machine-readable API contract and compatibility checks.
- `stripe-best-practices` or the current provider skill for payment-specific behavior.
- `design-taste`, `shadcn-ui`, or `admin-dashboard` for UI/design-system implementation context.
- `native-first`, `security-check`, `web-perf`, and relevant platform/provider skills for implementation validation.

If a specialist is unavailable, state the exact capability gap and continue with a bounded, evidence-labelled draft. Do not copy another skill's instructions into this one.

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

Run project-native checks before claiming behavior works. Separate planning from runtime proof. Report profile/overlays, included and omitted artifacts with reasons, unresolved owners, source freshness, validation results, and remaining risk.

Only for suite maintenance or release-status claims, read [implementation-tasks.md](references/implementation-tasks.md). The package may be called `v2 audit-ready` only while its P0 fixtures pass. `Cross-platform validated` additionally requires the repository CI matrix to pass on Ubuntu and macOS; a local run or workflow file alone is not that evidence.

## Cross-CLI and platform contract

The canonical source is `~/dotfiles/skills/local/development-spec-suite/`.

- Claude and Pi discover the shared `skills/local` source through their established symlinks.
- Codex and Agy use `skill-list`, then read the canonical `SKILL.md` directly; do not wrap this skill into a second plugin or copy.
- Linux and macOS are supported through Python 3, UTF-8 Markdown, POSIX-safe paths, and repository-native commands. Do not assume Homebrew, macOS applications, GNU-only flags, or a particular shell.
- Validate the active symlinks/registry with `skill-list` and `ai-doctor` after integration. A Git commit is not proof that every CLI has refreshed its local view.

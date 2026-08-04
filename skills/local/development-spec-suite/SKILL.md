---
name: development-spec-suite
description: Context-aware development specification and audit for libraries, CLIs, automation, web/mobile/desktop products, APIs, data/AI systems, SaaS, marketplaces, and regulated platforms. Use when work needs a traceable document pack, architecture/data/IAM/API/security/operations contracts, localization, cross-border or jurisdiction analysis, or a consistency audit across existing specifications.
---

# Adaptive Development Specification Suite

Produce the smallest evidence-backed specification pack for the repository at hand. Coordinate existing specialist skills instead of duplicating them.

## Token-efficient loading

Do not read every reference or template. Start with this file, inspect repository evidence, then load only the triggered reference:

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
- Keep legal, tax, privacy, security, compliance, and certification boundaries explicit. Identify triggers and map engineering controls, but do not make final legal applicability decisions or claim compliance from a document.
- Never request, print, copy, or store credentials, tokens, payment data, customer records, authentication sessions, or production secrets.
- Preserve existing files. Initialize missing files only; require explicit update mode before changing an established pack. Do not commit, push, merge, deploy, publish, or mutate production unless the user explicitly authorizes that action.

## Workflow

### 1. Discover before drafting

Inspect project instructions (`AGENTS.md` and equivalents), repository status, package scripts, source layout, existing docs, migrations, API contracts, deployment configuration, and runtime evidence. Check the available shared skills with `skill-list`; read only the relevant specialist `SKILL.md` files.

When selection is not already obvious from repository evidence, read [context-resolution.md](references/context-resolution.md) and record context. Keep product surface, entities, markets/data subjects, processing locations, processors, sector, commerce, AI role, locales/accessibility, and contracts separate.

### 2. Select depth and overlays

Choose the smallest depth profile:

- `lean`: bounded feature, library, CLI, automation, prototype, or small internal tool.
- `product`: maintained user-facing web/mobile/desktop product or service.
- `platform`: public/multi-component/multi-tenant/marketplace/critical service.

Then activate only evidence-backed overlays: `multi-tenant`, `identity`, `public-api`, `custom-domain`, `localized-ui`, `commerce`, `personal-data`, `cross-border`, `regulated-sector`, `ai-system`, `high-availability`, `mobile-desktop`, `extension-plugin`, and `data-analytics`. `saas` is accepted only as a compatibility alias for `platform + multi-tenant + identity`; it does not imply billing, domains, or white-labeling.

Read [jurisdiction-overlays.md](references/jurisdiction-overlays.md) when geography, sector, personal data, AI, commerce, or cross-border processing is present. Record `JUR-*`, `XFER-*`, and `LOC-*` decisions with official source, status, effective/publication date, retrieval date, owner, and recheck trigger. Unknown is not equivalent to not applicable.

### 3. Select artifacts and owners

Read [document-map.md](references/document-map.md) only when artifact selection or ownership is in scope. Activate only relevant artifacts and keep one owner per canonical fact:

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

The initializer always creates `CONTEXT-RECORD.md` and never overwrites an existing file in normal mode. Selection is fact-driven from the optional UTF-8 JSON `--context-file`; `--jurisdiction` and `--sector` create candidate review records, not legal conclusions. `--update` writes proposed sidecars, hashes, and deterministic diffs only; after review, `--update --force` confines manifest paths to the output/sidecar roots, hash-checks established files, creates unique recoverable backups, and applies the reviewed manifest atomically per file. It is portable on supported Python 3 versions on Linux and macOS.

### 5. Delegate specialist work

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

Also run the project's own scripts (`package.json`, Makefile, CI, migration, OpenAPI, or native platform checks) before claiming behavior works. Separate planning truth from runtime proof. Report selected profile/overlays, included and omitted artifacts with reasons, unresolved owners, source freshness, validation commands/results, and remaining legal/security/operational risk.

Only for suite maintenance or release-status claims, read [implementation-tasks.md](references/implementation-tasks.md). The package may be called `v2 audit-ready` only while its P0 fixtures pass. `Cross-platform validated` additionally requires the repository CI matrix to pass on Ubuntu and macOS; a local run or workflow file alone is not that evidence.

## Cross-CLI and platform contract

The canonical source is `~/dotfiles/skills/local/development-spec-suite/`.

- Claude and Pi discover the shared `skills/local` source through their established symlinks.
- Codex and Agy use `skill-list`, then read the canonical `SKILL.md` directly; do not wrap this skill into a second plugin or copy.
- Linux and macOS are supported through Python 3, UTF-8 Markdown, POSIX-safe paths, and repository-native commands. Do not assume Homebrew, macOS applications, GNU-only flags, or a particular shell.
- Validate the active symlinks/registry with `skill-list` and `ai-doctor` after integration. A Git commit is not proof that every CLI has refreshed its local view.

## References

- [context-resolution.md](references/context-resolution.md) — context facts, profile/overlay selection, and re-evaluation triggers.
- [jurisdiction-overlays.md](references/jurisdiction-overlays.md) — official-source resolver and cross-border/localization rules.
- [document-map.md](references/document-map.md) — artifact activation and source ownership.
- [requirements-traceability.md](references/requirements-traceability.md) — IDs, task mapping, and evidence boundary.
- [implementation-tasks.md](references/implementation-tasks.md) — maintenance backlog and release evidence; skip during normal project use.

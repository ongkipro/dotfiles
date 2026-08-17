---
name: observability-engineering
description: "Designs and verifies cross-stack observability from operator decisions and observable user journeys: structured events, OpenTelemetry-aligned logs, metrics, traces, correlation, SLI/SLO/error budgets, alerts, async jobs/webhooks, privacy, cost, dashboards, and bounded telemetry smoke proofs. Use when adding or reviewing diagnostic telemetry, service health, reliability objectives, or emitted evidence. Owns signal contracts and cross-service evidence; not frontend performance diagnosis, vendor selection, incident-response documentation systems, or business audit-log implementation."
---

# Observability Engineering

Make systems answer operational questions with emitted evidence. Start with the decisions an operator must make, not with a vendor, dashboard, or “log everything” mandate.

## Load only what the task needs

- Event schemas, severity, correlation, async boundaries, redaction, or cost controls → [signal-contract.md](references/signal-contract.md)
- SLI/SLOs, error budgets, alerts, dashboards, runbooks, probes, or smoke evidence → [reliability-and-proof.md](references/reliability-and-proof.md)
- Standards, official guidance, and freshness checks → [source-ledger.md](references/source-ledger.md)

Telemetry SDKs, semantic conventions, runtime hooks, exporter configuration, and vendor APIs are volatile. Recheck the installed versions and current official documentation before naming an API, configuration field, limit, or command. Project scripts and the installed stack win.

## Scope and ownership

Use this skill for cross-stack signal contracts, observable user journeys, correlation across components, reliability measurement, diagnostic telemetry safety/cost, and proof that signals actually travel from application boundary to the configured sink.

Do not use it to choose a monitoring vendor or reproduce a provider catalog. It does not own:

- browser performance diagnosis or Core Web Vitals interpretation → `web-perf`;
- Next.js or Astro runtime instrumentation APIs → `nextjs-development` or `astro-development`;
- Cloudflare Workers/runtime configuration → `cloudflare` and `workers-best-practices`;
- Agents SDK lifecycle, workflow, queue, and diagnostics-channel APIs → `agents-sdk`;
- PostgreSQL/Drizzle query and data-layer implementation → `postgres-drizzle`;
- cross-stack AppSec, authentication hardening, or sensitive-data policy → `application-security` and, for Better Auth, `better-auth-security`;
- automated behavioral-test strategy or CI workflow engineering → `testing-engineering` and `github-actions`;
- specification-pack selection and traceability → `development-spec-suite`;
- end-to-end implementation routing → `full-stack-development`.

This skill still owns the signal contract and acceptance evidence when a platform specialist implements the hook. Hand the specialist the journey, event/metric/span names, required attributes, redaction rules, and proof conditions; receive exact emitted evidence back.

## Non-negotiable distinction: audit records versus telemetry

Business/security audit records and diagnostic telemetry are different products.

- **Audit record:** authoritative evidence of an actor, action, target, authorization/result, tenant, and occurrence time. It needs explicit integrity, access, retention, deletion, and failure policy. It must not disappear because traces were sampled or diagnostic logs expired.
- **Diagnostic telemetry:** operational evidence for understanding service behavior. It may be sampled, aggregated, dropped under bounded backpressure, and retained for a shorter period.

Never use sampled traces or ordinary application logs as the only audit trail. Never copy an entire audit payload into telemetry. Route audit-store schema and persistence to the domain/data owner (`postgres-drizzle` when plain PostgreSQL/Drizzle applies), and security/privacy controls to `application-security`; keep only a non-sensitive reference or outcome in diagnostics when it supports an operator decision.

## Inspect-first workflow

### 1. Trace the real operating path

Before editing, inspect the narrow relevant slices of:

1. repository instructions and project scripts;
2. current logger, metrics, tracing, OpenTelemetry, exporter, collector, and health/probe setup;
3. service entry points, shared middleware, error boundaries, deployment/runtime configuration, and shutdown lifecycle;
4. critical user-journey completion points and their database, cache, external API, queue, scheduled-job, and webhook hops;
5. tenant/identity propagation, redaction utilities, audit stores, retention settings, dashboards, alerts, runbooks, and existing specs;
6. `config/templates/OBSERVABILITY.md` or the project copy when the repository uses that probe contract.

Search every affected caller before changing a shared bootstrap or event schema. Prefer existing instrumentation and native runtime hooks. Before proposing a dependency or wrapper, use `native-first`; do not add a second telemetry convention beside the project’s established one.

Record what is **Observed**, **Decision**, **Assumption**, and **Unknown**. A configured exporter is not evidence that a sink receives data.

### 2. Start from decisions and user journeys

For each critical journey, write the smallest decision matrix in the project’s existing observability artifact:

| Operator decision | Observable journey/outcome | Required signal | Action owner |
|---|---|---|---|
| Is the journey failing for users? | accepted → completed, rejected, degraded, or failed | outcome rate and latency/freshness SLI | service owner |
| Where is failure introduced? | boundary and dependency sequence | correlated trace plus one diagnostic event at the handling boundary | component owner |
| Is intervention needed now? | budget burn or queue/webhook staleness | actionable alert with runbook | named responder |

Instrument only signals that answer a named question, defend an SLO, or diagnose a plausible failure. For each journey define entry, success, expected rejection, degraded success, terminal failure, latency/freshness boundary, async continuation, and tenant scope. Measure the user-visible completion, not merely an internal HTTP 200 or successful enqueue.

### 3. Define one portable signal contract

Prefer stable OpenTelemetry semantic conventions for resources, HTTP, database, RPC, messaging, errors, and events. Do not rename well-known attributes into vendor-specific keys. Add project-specific attributes only when no stable convention fits; document type, unit, allowed values, cardinality, sensitivity, and owner.

Use the signals deliberately:

- **Metrics:** rates, ratios, latency/freshness distributions, saturation, queue age/depth, retry/dead-letter counts, and SLI numerators/denominators. Labels must be bounded.
- **Traces:** causal work across service/dependency boundaries and expensive or failure-prone stages. Keep span names low-cardinality; put IDs in attributes, never names.
- **Structured events/logs:** discrete lifecycle/outcome facts and diagnostics that need searchable context. Use stable event names and typed fields, not interpolated prose.

Every service signal identifies service/component and deployment environment through the project’s resource convention. Correlate diagnostics with trace/span context where available and with bounded request/job/message identifiers where useful. Follow [signal-contract.md](references/signal-contract.md) for severity, errors, async propagation, multi-tenancy, and audit separation.

### 4. Define reliability before alerts

Write an SLI as a user-relevant good-event numerator over an eligible-event denominator, or as an explicitly justified freshness/durability measure. State exclusions, measurement point, window, source, missing-data behavior, target, owner, and known blind spots. An SLO is the target; an SLA is a business agreement and is not inferred here.

An error budget is a decision mechanism, not a decorative percentage. Record which delivery or reliability decisions change as budget consumption changes. Prefer symptom- and burn-based alerts tied to user impact. Page only when a named responder can act before meaningful harm; route slow trends and capacity planning to non-page work. Details are in [reliability-and-proof.md](references/reliability-and-proof.md).

### 5. Implement at stable boundaries

1. Reuse the existing telemetry bootstrap, logger, propagator, meter, and tracer. Configure resource identity once.
2. Instrument the journey boundary and critical dependency/async boundaries; avoid a span or log for every function.
3. Emit one terminal outcome per logical attempt at its handling boundary. Do not duplicate the same exception at every layer.
4. Propagate W3C Trace Context through supported transports. Treat inbound trace context and baggage as untrusted metadata, never identity or authorization. Allowlist baggage; ignore invalid trace metadata and start a new local trace as required by the current standard and installed propagator. Never reject a business request solely because diagnostic context is malformed.
5. For queues/jobs/webhooks distinguish receipt/acceptance, enqueue, processing attempt, retry, completion, dead-letter/terminal failure, and end-to-end age. Preserve idempotency outcome without recording raw payloads or secrets. Use span links where work has multiple or non-parent causal inputs.
6. Redact before export. Diagnostic telemetry should not change the business outcome when an exporter is slow or unavailable; use the platform’s supported lifecycle/backpressure behavior. Audit-record failure policy remains a separate explicit business/security decision.
7. Keep health checks cheap and truthful. Liveness must not fail because an optional dependency is down; readiness and dependency checks expose only the minimum safe state. If using the repository probe template, preserve its `Probe: <name>|<url>|<expected-status>|<contains-or-TBD>|<max-latency-ms>` syntax and use stable non-secret endpoints.

## Trust, privacy, and cost gates

Before export, classify attributes and bodies. Never emit credentials, authorization/cookie headers, session tokens, reset links, cryptographic material, raw request/response bodies, payment data, or user-supplied secrets. Minimize personally identifiable information (PII) and other personal data, or transform it only under an approved policy; a hash can still be personal or high-cardinality data.

In multi-tenant systems, use a stable internal tenant identifier only when operational segmentation requires it and access controls support it. Never trust tenant, user, role, or plan values from inbound baggage. Keep tenant/user/job/message/request IDs out of metric labels; place necessary IDs in restricted logs/traces. Verify one tenant’s dashboard/query cannot expose another tenant’s data.

Set cardinality budgets, sampling policy, retention class, and estimated ingestion/storage impact before widening instrumentation. Preserve errors, rare outcomes, and representative traces according to existing capabilities; document head/tail decisions and bias. Sampling must never affect SLI counters or audit records. Drop noisy success details before dropping error context, but never claim complete populations from sampled data.

## Bounded smoke proof

Use the project’s existing local/non-production runtime and configured safe sink. Do not install a new backend merely to prove telemetry.

1. Choose one representative journey and generate a unique synthetic correlation marker.
2. Execute one success and one controlled failure or expected rejection. If the change touches async work, also observe one accepted item through a processing attempt to its terminal state; exercise a retry/duplicate only when that behavior changed.
3. Query or capture the actual configured sink/export endpoint. Prove the terminal event appears once, the trace and diagnostic event correlate, expected metric counters/distribution changed, outcome/severity is correct, and async stage/attempt fields are coherent.
4. Send synthetic canary values shaped like sensitive input and an unallowlisted baggage field; prove they are absent or transformed as designed. Never use real secrets or customer data.
5. If exporter buffering/failure behavior changed, make the safe local sink unavailable and prove the business result remains correct while the telemetry failure is bounded and visible through the supported fallback.
6. If an alert changed, evaluate it with the project’s rule checker or a controlled fixture and prove both firing and non-firing conditions. A valid config file alone is insufficient.

Report exact commands/scenarios, observed sink records or query results, the correlation marker, metric before/after values, and unmeasured gaps. A dashboard screenshot, source inspection, successful build, or SDK initialization alone is not telemetry-path proof.

## Dashboards and runbooks

A dashboard answers a bounded operator question: affected journey, scope/tenant where permitted, current SLI and budget burn, traffic, errors, latency/freshness, saturation/backlog, dependency health, and deploy/config annotations. Prefer a few linked views over card grids of unrelated counts.

Every paging alert links to a maintained runbook with meaning, affected journey, ownership, safe queries, first triage steps, dependency checks, mitigation/rollback boundary, escalation path, and verification of recovery. This skill defines the operational content; it does not build an incident-response documentation system.

## Anti-patterns

- Logging every request body, ORM call, function entry, or retry “just in case.”
- Treating logs, metrics, and traces as interchangeable copies of the same payload.
- Dynamic metric labels or span/event names containing tenant, user, URL, SQL, error text, or IDs.
- Alerting on raw infrastructure thresholds with no user impact, owner, action, or runbook.
- Calling an enqueue/HTTP acceptance a completed user journey.
- Marking expected validation or authorization rejection as a system error without a defined reason.
- Trusting trace/baggage headers for authorization or propagating arbitrary baggage.
- Sampling SLI inputs, relying on sampled diagnostics as an audit trail, or claiming sampled counts are complete.
- Shipping telemetry without redaction, retention, access, cardinality, and cost decisions.
- Adding a vendor wrapper, custom propagation format, or parallel logger when the installed stack already provides the needed primitive.

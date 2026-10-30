---
name: observability-engineering
description: >-
  Cross-stack observability contracts from operator decisions: structured events, OTel logs/metrics/traces, correlation, SLI/SLO/error budgets, alerts, async jobs, LLM telemetry. Not web performance (web-perf), vendor choice, or audit-log storage.
---

# Observability Engineering

Make systems answer operational questions with emitted evidence. Start from
the decisions an operator must make, not from a vendor, a dashboard, or "log
everything". SDKs, semantic conventions, runtime hooks, and exporters are
volatile: installed versions and current docs (`references/source-ledger.md`)
win; project scripts and the existing telemetry bootstrap win over a second
convention.

This skill owns the signal contract and acceptance evidence; the platform
specialist implements the hook (`nextjs-development`, `astro-development`,
`workers-best-practices`, `agents-sdk`, `postgres-drizzle`). Browser
performance → `web-perf`; security/privacy policy → `application-security`;
tests and CI → `testing-engineering`, `github-actions`.

Read only this file up front; open a reference when a step names it.

**Pick the path first:**
- Add or change one event/metric/span → §1 (steps 1–2 only) → §3 →
  `references/signal-contract.md` for schema/severity/redaction → §5.
- Define reliability for a journey (SLI/SLO, alerts, dashboard, runbook) →
  §1 → §2 → §4 → `references/reliability-and-proof.md`.
- Audit trail question → §0 only, then the data owner.

## 0. Audit records are not telemetry

An **audit record** is authoritative evidence of actor, action, target,
result, tenant, time, with explicit integrity, access, retention, deletion
and failure policy; it never disappears because traces were sampled.
**Diagnostic telemetry** may be sampled, aggregated, dropped under
backpressure, and retained briefly. Never use sampled traces or ordinary
logs as the only audit trail, never copy a full audit payload into
telemetry; the audit store belongs to the data owner.

## 1. Trace the real operating path

1. Repository instructions and scripts; the current logger, metrics,
   tracing, exporter, collector, health/probe setup.
2. Entry points, shared middleware, error boundaries, runtime config,
   shutdown lifecycle.
3. Critical journey completion points and their DB, cache, external API,
   queue, scheduled-job and webhook hops.
4. Tenant/identity propagation, redaction utilities, audit stores,
   retention, dashboards, alerts, runbooks, existing specs
   (`OBSERVABILITY.md` when the repo uses the probe template).

Search every caller before changing a shared bootstrap or schema. Record
Observed / Decision / Assumption / Unknown. A configured exporter is not
proof a sink receives data.

## 2. Start from decisions and journeys

Smallest decision matrix in the project's existing observability artifact:

| Operator decision | Observable outcome | Required signal | Owner |
|---|---|---|---|
| Is the journey failing for users? | accepted → completed / rejected / degraded / failed | outcome rate + latency or freshness SLI | service owner |
| Where is failure introduced? | boundary and dependency sequence | correlated trace + one event at the handling boundary | component owner |
| Is intervention needed now? | budget burn, queue/webhook staleness | actionable alert with runbook | named responder |

Instrument only signals that answer a named question, defend an SLO, or
diagnose a plausible failure. Per journey define entry, success, expected
rejection, degraded success, terminal failure, latency/freshness boundary,
async continuation, tenant scope. Measure user-visible completion, not an
internal 200 or a successful enqueue.

## 3. One portable signal contract

OpenTelemetry semantic conventions where stable (check each group's
stability and the `OTEL_SEMCONV_STABILITY_OPT_IN` the installed
instrumentation actually emits); never rename well-known attributes into
vendor keys. **Metrics** for rates, distributions, saturation, queue age,
SLI numerators/denominators with bounded labels. **Traces** for causal work
across boundaries; low-cardinality span names, IDs in attributes. **Events**
for discrete lifecycle/outcome facts with stable names and typed fields. One
terminal outcome per logical attempt at its handling boundary. LLM calls:
operation, provider/model, tokens, latency, finish reason, tool outcome as
bounded attributes; prompt/completion content off by default. Every signal
carries service/component and environment via the resource convention.

## 4. Reliability before alerts

SLI = user-relevant good events / eligible events (or a justified
freshness/durability measure) with exclusions, measurement point, window,
source, missing-data behavior, target, owner, blind spots. The error budget
is a decision mechanism: record which decisions change as it burns. Page
only on symptom/burn alerts a named responder can act on; trends go to
non-page work.

## 5. Gates and proof

**Trust/privacy/cost**: never emit credentials, auth/cookie headers,
tokens, reset links, raw bodies, payment data; minimize PII (a hash can
still be personal); tenant/user/job IDs out of metric labels; inbound
baggage is untrusted and allowlisted; set cardinality, sampling, retention
and cost budgets before widening; sampling never touches SLI counters or
audit records.

**Bounded smoke proof** (`reliability-and-proof.md`): one journey, a unique
correlation marker, one success and one controlled failure, the actual
configured sink queried — terminal event once, trace and event correlated,
counters moved, canary sensitive values absent. A dashboard screenshot, a
green build, or SDK initialization alone is not telemetry-path proof.

## Anti-patterns

Logging every request body, ORM call, or function entry · logs, metrics and
traces as interchangeable copies · IDs in span names or metric labels ·
sampled traces as the audit trail · prompts as attributes · an alert with no
runbook or no responder · a configured exporter claimed as working.

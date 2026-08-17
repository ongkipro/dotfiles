# Portable Signal Contract

Use this reference after the real journey and installed telemetry path are known. Prefer stable OpenTelemetry semantic conventions; check the installed SDK and current convention stability before implementing names or attributes.

## 1. Contract worksheet

Define each custom signal before emission:

| Field | Required decision |
|---|---|
| Operator question | The decision this signal enables |
| Journey and boundary | Entry, logical attempt, and terminal outcome |
| Signal | Metric, span, event/log, or audit record |
| Stable name | Low-cardinality name; established project/semantic convention wins |
| Attributes | Key, type, unit, allowed values, sensitivity, cardinality |
| Correlation | Trace/span plus request, job, message, or audit reference if justified |
| Population | Complete, aggregated, or sampled; sampling bias stated |
| Retention/access | Data class, readers, retention owner |
| Failure behavior | What happens when the sink/exporter is unavailable |
| Owner and evidence | Maintainer and bounded proof query/scenario |

If no operator question, SLI, or plausible diagnostic query consumes a proposed field, do not emit it.

## 2. Structured event envelope

Map to the installed OpenTelemetry log/event model rather than inventing a transport envelope. The logical content is:

| Concern | Contract |
|---|---|
| Occurrence | Event timestamp at source; observation timestamp supplied by the telemetry pipeline where supported |
| Identity | Stable event name describing the event class, never an instance ID |
| Severity | Source text plus normalized severity when the stack supports it |
| Body | Short human diagnostic summary; no required machine semantics hidden only in prose |
| Resource | Service/component identity, version, and deployment environment from central resource configuration |
| Scope | Instrumentation/library scope supplied by the installed SDK |
| Correlation | Trace ID and span ID when the event occurs within a trace |
| Outcome | Bounded value such as success, expected rejection, degraded, retryable failure, terminal failure, or cancellation; reuse a stable convention when available |
| Context | Typed, allowlisted attributes with documented sensitivity and cardinality |

Use lowercase, stable event names following the repository convention and current OpenTelemetry event naming guidance. Names describe classes such as a processing outcome, not values such as `/orders/123`, an exception message, a tenant, or a provider response.

Do not require operators to parse message text for status, duration, attempt, dependency, or outcome. Keep those fields typed and separately queryable.

## 3. Severity semantics

Severity answers how operationally serious the **recorded situation** is; outcome answers what happened to the journey. Do not inflate severity to make dashboards noticeable.

| Range | Use |
|---|---|
| TRACE | Fine-grained local investigation, disabled by default in production |
| DEBUG | Bounded diagnostic detail useful during targeted debugging |
| INFO | Normal lifecycle or terminal business outcome that is operationally relevant |
| WARN | Degradation, retry, approaching limit, recovered anomaly, or condition needing attention but not a failed logical operation |
| ERROR | A logical request/job/operation failed unexpectedly or required error handling |
| FATAL | Process/runtime cannot continue safely or is crashing |

When a backend requires normalized numbers, use the OpenTelemetry Logs Data Model ranges rather than a project-invented scale: TRACE 1–4, DEBUG 5–8, INFO 9–12, WARN 13–16, ERROR 17–20, FATAL 21–24. Preserve the original severity text when mapping an existing logger.

Expected validation, authentication, authorization, conflict, idempotent duplicate, cancellation, or not-found outcomes are not automatically system errors. Classify by the journey contract and security-monitoring requirements. A suspicious security outcome may need a separate protected audit/security signal owned with `application-security`.

## 4. Error recording rules

- Record an error once at the boundary that handles or terminates the logical attempt. Lower layers may enrich/rethrow without emitting duplicate terminal records.
- Follow current OpenTelemetry error semantic conventions for span status and error attributes. Do not invent exception or HTTP status mappings from memory.
- A trace/span error state and a log severity are related but not interchangeable. Preserve both only when each answers a different query.
- Use a bounded error type/category. Do not use exception message, stack trace, SQL text, URL, or user input as a metric label or span name.
- Stack traces belong only in restricted diagnostic storage, subject to redaction and retention. They may include request data and paths.
- Record recovery: if a retry succeeds, distinguish the failed attempt from the final journey outcome. Retry attempts must not inflate logical-journey failure SLIs.
- Preserve cancellation and deadline expiration distinctly from dependency failure when the installed conventions support it.

## 5. Correlation and trace context

Use W3C Trace Context through supported HTTP and message transports. Continue an inbound trace only after the installed propagator validates it. Never use `traceparent`, `tracestate`, baggage, or a correlation ID as proof of identity, tenant, role, authorization, or request integrity.

Correlation layers have different jobs:

- **Trace/span IDs:** causal diagnostic navigation; may be regenerated and sampled.
- **Request ID:** one ingress attempt where the project already uses it.
- **Job/message ID:** durable operational identity for asynchronous processing; restricted, not a metric label.
- **Webhook delivery/event ID:** provider delivery/idempotency correlation after verification; do not emit the raw payload.
- **Audit reference:** non-sensitive pointer to a separately protected authoritative audit record.

Do not copy arbitrary inbound baggage. Define an allowlist, value/type/length bounds, hop lifecycle, and sensitivity for each propagated field. Prefer local attributes over baggage when downstream propagation is unnecessary.

Trace modeling:

- parent/child spans only for a real single causal parent;
- span links for fan-in, fan-out, batch work, retries represented as separate executions, or work resumed outside a valid parent lifetime;
- stable operation names; instance IDs and unbounded routes stay in attributes;
- capture only the critical path and failure-prone/expensive dependencies, not every function.

## 6. Async jobs, queues, schedules, and webhooks

Receipt, scheduling, enqueueing, and processing are different outcomes. Define the state contract before instrumentation:

| Stage | Minimum diagnostic facts |
|---|---|
| received/accepted | bounded source/operation, verification result where applicable, receipt time, correlation |
| enqueued/scheduled | logical job/message reference, destination class, enqueue/schedule result |
| attempt started | attempt number, queue age or scheduled delay, consumer/handler class |
| attempt finished | duration, outcome, retry decision, bounded error category |
| terminal completed | end-to-end age, final logical outcome, processed count where meaningful |
| dead-letter/abandoned | terminal reason category, attempts, age, owner-visible destination |

For batch work, separately measure records expected, processed, succeeded, rejected, and failed when those populations are known. Do not infer correctness from “job exited zero.”

For webhooks:

- instrument verification outcome without recording signatures/secrets;
- distinguish HTTP acknowledgement from business processing completion;
- record duplicate/idempotency outcome as bounded state;
- retain provider delivery identifiers only under the approved data/cardinality policy;
- attribute retry ownership correctly: sender retry, platform retry, and application retry are not the same.

Platform implementation belongs to `cloudflare`, `workers-best-practices`, `agents-sdk`, `nextjs-development`, or `astro-development` as applicable. This contract remains the acceptance boundary.

## 7. Metrics and cardinality

Prefer counters and histograms that preserve populations and distributions. Use asynchronous/current-value instruments only for state observed at collection time. Verify exact instrument semantics in the installed SDK.

For every metric define:

- stable name and unit;
- what increments or observes it, exactly once;
- allowed label keys and complete bounded value sets;
- whether it is a complete population and suitable for an SLI;
- reset/temporality assumptions exposed by the installed exporter/backend;
- aggregation and retention expectations;
- owner and example decision/query.

Good bounded dimensions often include service, operation class, outcome class, dependency class, queue name from a fixed deployment set, or deployment environment. Review even these against the real topology.

Never label metrics with user/tenant/request/job/message/session IDs, URLs, raw routes, SQL, exception messages, email/phone/IP, free text, arbitrary headers, file paths, or dynamic provider payload values. If instance-level lookup is essential, use restricted correlated events/traces, not time-series labels.

Count eligible and good events separately or use another mathematically explicit SLI source. Percentiles are useful views but generally cannot be aggregated back into a trustworthy global distribution; retain histogram/distribution data according to the backend’s supported model.

## 8. Sampling, retention, and cost

Document per signal:

1. expected event/span/measurement volume;
2. attribute cardinality bounds;
3. head, tail, parent, or probability sampling behavior actually supported;
4. which errors/rare outcomes must remain diagnosable and the unavoidable bias;
5. retention tier and access group;
6. ingestion/export limits, backpressure, and drop visibility;
7. cost owner and review trigger.

SLI counters and authoritative audit records require complete populations unless their specification explicitly defines a statistically valid sampled measurement. Never quietly apply trace sampling to them. Tail sampling cannot recover data already discarded upstream and adds pipeline latency/state; verify the real collector path before choosing it.

Prefer aggregate metrics for continuous health, sampled traces for causal detail, and selective structured events for lifecycle/outcomes. Remove or lower-volume noisy success details before sacrificing failure context. Telemetry drop counts or exporter failures need a bounded visibility path that does not recursively depend only on the failing exporter.

## 9. Multi-tenant and privacy boundary

Classify every field as public, internal, personal, sensitive, secret, or prohibited according to project policy. Apply minimization and redaction at the earliest controlled boundary, before buffering/export. Collector-side scrubbing is defense in depth, not permission to emit secrets from the application.

Use an opaque, stable internal tenant identifier only when operational segmentation requires it. Enforce tenant-aware access at the query/dashboard layer and test it. Human tenant names, user IDs, roles, plans, and entitlements must not arrive from untrusted propagation metadata.

A hash is not automatic anonymization: low-entropy inputs can be reversed, stable hashes enable linkage, and hashed values remain high cardinality. Obtain `application-security` guidance before treating transformed personal data as safe.

## 10. Audit-versus-telemetry decision table

| Question | Diagnostic telemetry | Business/security audit record |
|---|---|---|
| Primary use | Operate and diagnose the system | Establish authoritative accountability/history |
| Sampling | May be sampled/aggregated | Must follow explicit completeness policy |
| Mutation/integrity | Normal telemetry pipeline semantics | Explicit append/change, integrity, and correction rules |
| Failure behavior | Must not normally alter business result | Explicit per-action fail-open/fail-closed/deferred policy |
| Retention | Cost/diagnostic horizon | Legal/business/security schedule with owner |
| Access | Operations and engineering roles | Restricted purpose-specific roles and review |
| Payload | Minimized diagnostics | Minimized authoritative actor/action/target/result facts |
| Correlation | Trace/request/job identifiers | Durable audit identifier; optional safe diagnostic reference |

Never solve both with one undifferentiated log stream.

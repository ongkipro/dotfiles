# Primary-Source Ledger

Last checked: 2026-10-02

Use this ledger as a retrieval index, not a frozen API reference. Before implementation, recheck the installed runtime, SDK, instrumentation packages, exporter/collector versions, semantic-convention stability, and current official documentation. Numeric limits, environment variables, package APIs, defaults, schema stability, sampling behavior, and provider capabilities are volatile.

## Open standards and OpenTelemetry

| Topic | Primary source | Status/use |
|---|---|---|
| OpenTelemetry specification index | [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/) | Normative cross-language API/SDK/data-model entry point; check each component’s status |
| Semantic conventions | [Semantic conventions index](https://opentelemetry.io/docs/specs/semconv/) and [General semantic conventions](https://opentelemetry.io/docs/specs/semconv/general/) | Index reported version 1.44.0 (accessed 2026-10-02); stability varies by convention group |
| Event format and naming | [Semantic conventions for events](https://opentelemetry.io/docs/specs/semconv/general/events/) | Event-name and event-structure guidance |
| Error recording | [Recording errors](https://opentelemetry.io/docs/specs/semconv/general/recording-errors/) | Cross-signal error conventions; recheck relevant protocol/database conventions too |
| Logs and severity | [Logs Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/) | Stable logical fields, trace correlation, and normalized severity ranges when checked |
| Metrics data | [Metrics Data Model](https://opentelemetry.io/docs/specs/otel/metrics/data-model/) | Metric streams, temporality, aggregation, and exemplars |
| Tracing and sampling | [Tracing SDK — Sampling](https://opentelemetry.io/docs/specs/otel/trace/sdk/#sampling) | Normative SDK sampling behavior and propagation implications |
| Resource identity | [Resource semantic conventions](https://opentelemetry.io/docs/specs/semconv/resource/) | Service, deployment, cloud, host, and process resource attributes; use only applicable stable groups |
| HTTP conventions | [HTTP semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/), [HTTP spans](https://opentelemetry.io/docs/specs/semconv/http/http-spans/) | HTTP spans Stable (some size/`url.template` attributes still Development); index shows Mixed; pre-1.21 instrumentations migrate via `OTEL_SEMCONV_STABILITY_OPT_IN=http` / `http/dup` (accessed 2026-10-02) |
| Database conventions | [Database semantic conventions](https://opentelemetry.io/docs/specs/semconv/database/), [Database client spans](https://opentelemetry.io/docs/specs/semconv/database/database-spans/) | Client spans Stable (`db.system.name`, `db.namespace`, `db.operation.name`, `db.query.text`, `db.query.summary`); `db.query.parameter.<key>` and `db.response.returned_rows` Development/opt-in; migration via `OTEL_SEMCONV_STABILITY_OPT_IN=database` / `database/dup` (accessed 2026-10-02) |
| GenAI conventions | [semantic-conventions-genai repository](https://github.com/open-telemetry/semantic-conventions-genai) (moved from [semconv/gen-ai](https://opentelemetry.io/docs/specs/semconv/gen-ai/)) | Spans, agent spans, metrics, events, MCP, and provider-specific (Anthropic, OpenAI, Bedrock, Azure AI Inference) conventions; status Development, so attribute names may change (accessed 2026-10-02) |
| OpenTelemetry JavaScript | [JS status](https://opentelemetry.io/docs/languages/js/) and [releases](https://github.com/open-telemetry/opentelemetry-js/releases) | Traces and metrics Stable, logs Development; supports active/maintenance Node.js LTS; stable packages on the 2.x line with experimental packages on 0.2xx (accessed 2026-10-02). Check the installed version in the lockfile |
| Messaging conventions | [Messaging semantic conventions](https://opentelemetry.io/docs/specs/semconv/messaging/) | Producer/consumer/process spans, message attributes, and metrics; Development status when checked 2026-10-02 |
| OTLP transport | [OpenTelemetry Protocol](https://opentelemetry.io/docs/specs/otlp/) | Interoperable export protocol; implementation support still depends on installed components |
| Collector resilience | [OpenTelemetry Collector resiliency](https://opentelemetry.io/docs/collector/resiliency/) | Official guidance for queues, retries, backpressure, and delivery caveats; verify deployed Collector version |
| Distributed trace headers | [W3C Trace Context](https://www.w3.org/TR/trace-context/) | W3C Recommendation defining `traceparent` and `tracestate`; not an authentication mechanism |
| Distributed baggage | [W3C Baggage](https://www.w3.org/TR/baggage/) | Working Draft when checked; treat format/status as volatile and baggage as untrusted propagated metadata |

OpenTelemetry semantic conventions publish per-group stability and migration guidance. Do not cite the overall project as proof that a particular attribute or metric is stable.

## Reliability engineering

| Topic | Primary source | Use |
|---|---|---|
| SLI/SLO design | [Google SRE Workbook: Implementing SLOs](https://sre.google/workbook/implementing-slos/) | User-oriented SLI specifications, implementations, targets, and error budgets |
| SLO alerting | [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) | Burn-rate and multi-window alert design; derive values for the project rather than copy examples blindly |
| Monitoring philosophy | [Google SRE Workbook: Monitoring](https://sre.google/workbook/monitoring/) | Signal usefulness, symptoms versus causes, and operational design |
| Error-budget policy | [Google SRE Workbook: Example Error Budget Policy](https://sre.google/workbook/error-budget-policy/) | Example decision policy, not a universal organizational contract |
| SLI/SLO terminology | [Google SRE Book: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Foundational distinction among indicators, objectives, and agreements |

Google SRE publications are official practitioner guidance, not formal standards. Adapt them to the product’s users, risk, ownership, and measurement quality.

## Security and privacy

| Topic | Primary source | Use |
|---|---|---|
| Application logging security | [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Data exclusion, sanitization, injection, protection, monitoring, and verification guidance |
| Sensitive-data handling in telemetry | [OpenTelemetry Handling Sensitive Data](https://opentelemetry.io/docs/security/handling-sensitive-data/) | Official project guidance for attribute processors, filtering, and data minimization; confirm component support |
| Trace-header threats | [W3C Trace Context — Security Considerations](https://www.w3.org/TR/trace-context/#security-considerations) | Risks from accepting and propagating trace metadata across trust boundaries |
| Baggage threats | [W3C Baggage — Security Considerations](https://www.w3.org/TR/baggage/#security-considerations) | Privacy/security considerations for arbitrary propagated baggage; specification remains a Working Draft when checked |

These sources inform engineering controls but do not establish legal applicability, retention periods, or compliance. Route security policy to `application-security` and specification/jurisdiction traceability to `development-spec-suite`.

## Platform handoff starting points

These sources are intentionally not a product catalog. Load them only after the installed platform has been identified; the corresponding specialist owns implementation details.

| Platform | Official source | Canonical skill owner |
|---|---|---|
| Next.js App Router | [Next.js OpenTelemetry guide](https://nextjs.org/docs/app/guides/open-telemetry) and [Instrumentation guide](https://nextjs.org/docs/app/guides/instrumentation) | `nextjs-development`; the OpenTelemetry guide reported Next.js 16.3.1 and update date 2026-08-06 when checked |
| Cloudflare Workers | [Workers Observability](https://developers.cloudflare.com/workers/observability/) | `cloudflare` and `workers-best-practices`; page updated 2026-08-03 when checked |
| Cloudflare Agents SDK | [Agents observability](https://developers.cloudflare.com/agents/runtime/operations/observability/) | `agents-sdk`; current index links tracing and diagnostics channels and was updated 2026-08-04 when checked |
| Browser experience | [web.dev Web Vitals](https://web.dev/articles/vitals) | `web-perf`; it owns browser performance diagnosis and current thresholds |

Astro, database, authentication, queue, webhook, and other runtime hooks must be retrieved from their current official documentation through their canonical platform skill. Absence from this ledger is not permission to improvise an API.

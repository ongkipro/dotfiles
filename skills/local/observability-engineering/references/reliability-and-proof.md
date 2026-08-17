# Reliability and Emitted-Evidence Playbook

Use this reference to turn observable journeys into SLI/SLO decisions, actionable alerts, operator views, and a bounded proof that telemetry reaches its sink.

## 1. Journey and decision inventory

Start with one critical journey, not every endpoint:

| Field | Decision |
|---|---|
| Users | Who experiences the outcome; exclude internal components unless they are the service customer |
| Entry | The point where an eligible attempt begins |
| Good outcome | User-visible completion/correctness/quality condition |
| Expected rejection | Validation, authorization, conflict, quota, cancellation, or duplicate behavior defined by the product |
| Degraded outcome | Completion with reduced freshness, quality, coverage, or dependency behavior |
| Bad outcome | Terminal failure from the user’s perspective |
| Time boundary | End-to-end latency, queue age, freshness, or deadline |
| Async continuation | Queue/job/webhook stages required for actual completion |
| Dependencies | Components whose state explains impact but does not replace the journey SLI |
| Operator decision | Page, mitigate, stop rollout, spend budget, or plan capacity |
| Owner | Person/team able to act |

A server returning success after merely accepting work is not proof that the asynchronous journey completed. A dependency being healthy is not proof that users succeeded.

## 2. SLI specification

Prefer a user-relevant ratio:

\[
\mathrm{SLI} = \frac{\text{good eligible events}}{\text{all eligible events}}
\]

A freshness, durability, correctness, coverage, or quality SLI may use a different measure when the population and interpretation are explicit.

Every SLI record must state:

- journey and user population;
- specification independent of tooling;
- numerator and denominator, units, and event boundary;
- good/bad/degraded/expected-rejection classification;
- measurement source and why it approximates user experience;
- exclusions and whether they can hide real harm;
- aggregation/window and missing/late/duplicate data handling;
- segmentation needed to expose concentrated harm without unsafe cardinality;
- known blind spots, completeness, and sampling status;
- owner and review cadence.

Measure availability, latency, freshness, durability, correctness, quality, or coverage because users care—not because a dashboard already exposes it. Use multiple latency/quality thresholds only when they correspond to meaningful experience classes.

Keep the SLI specification separate from implementation. For example, “completed journey within its deadline” is the specification; an application event, load-balancer metric, synthetic probe, or client signal is an implementation with distinct coverage and blind spots. `web-perf` owns browser performance and Core Web Vitals diagnosis; do not label backend latency as measured user page performance.

## 3. SLO and error-budget record

An SLO adds:

- target and window;
- rationale based on user/business needs, not current dashboard precision;
- effective/review dates and owner;
- measurement implementation and data-quality gate;
- dependencies and exclusions;
- error-budget policy and decision owners;
- relationship to, but clear distinction from, any SLA.

For a ratio SLO with target \(T\), the allowed bad-event fraction is \(1-T\). An event budget for an eligible population \(N\) is \(N(1-T)\). Do not promise 100% by default; justify targets with product and operational owners.

Budget policy must name decisions, for example:

- when rollout risk is acceptable;
- when reliability work takes precedence over feature work;
- when a launch or risky migration pauses;
- who can approve exceptions;
- how measurement gaps prevent false “healthy” conclusions.

Error budgets are not paging thresholds by themselves. Track consumption and burn relative to the SLO window, then alert on sustained rates that threaten the decision window.

## 4. Alert design record

Every alert needs:

| Field | Required content |
|---|---|
| User symptom | Journey and harm represented |
| Signal/query | Complete source, filters, window, and missing-data behavior |
| Trigger | Sustained condition or burn behavior; rationale |
| Severity/channel | Page only when immediate action can change outcome |
| Scope | Service/environment/region/tenant segment where authorized |
| Owner | Named responder/rotation able to act |
| Runbook | Stable link and first safe diagnostic query |
| Dedupe/inhibition | Related alerts that must not create a notification storm |
| Recovery | Clear resolve condition and evidence of user recovery |
| Test | Controlled firing and non-firing fixture/scenario |

Prefer multiple-window, multiple-burn-rate alerting when the metrics backend and SLO implementation support it: a short window detects fast loss and a longer window prevents transient noise. Derive concrete thresholds from the SLO, notification goal, and current official guidance; do not paste universal numbers blindly.

Use symptom alerts for paging. Infrastructure saturation, queue depth, disk, CPU, or dependency errors may be useful diagnostics or predictive alerts, but must have a demonstrated relationship to user harm and an action before they page. Route slow budget trends, cost/cardinality growth, and capacity forecasts to tickets/review queues.

Handle no-data explicitly. Absence can mean no traffic, broken instrumentation, exporter failure, or failed computation. Pair critical SLIs with telemetry-pipeline/data-freshness checks without making the same failing path the only observer.

## 5. Probes and health endpoints

Black-box probes supplement white-box telemetry by checking a stable externally observable boundary. They do not replace journey outcomes, traces, or metrics.

When the repository uses `config/templates/OBSERVABILITY.md`, preserve its line contract exactly:

```text
Probe: <name>|<url>|<expected-status>|<contains-or-TBD>|<max-latency-ms>
```

Use only stable non-secret public endpoints unless an explicit local/private override exists. Exact status or inclusive status range must match the real endpoint. Response content checks must be stable and reveal no secret, dependency topology, customer data, or internal error detail.

Health semantics:

- **liveness:** the process/runtime can continue; do not couple it to optional dependencies;
- **readiness:** this instance can safely receive the work represented by the endpoint;
- **dependency/deep check:** bounded, access-controlled where necessary, and not invoked at a frequency that harms the dependency;
- **journey synthetic:** a safe representative operation with cleanup and clear test-data identity.

Verify latency expectations against a controlled environment and record that profile. A successful shallow health response does not prove database writes, queues, jobs, or webhooks work end to end.

## 6. Dashboard design

Each dashboard title should state the question and scope. A service/journey view normally includes:

1. SLI and error-budget consumption over decision windows;
2. eligible volume and good/bad/degraded outcome rates;
3. latency/freshness/queue-age distributions, not averages alone;
4. saturation/backlog and telemetry-data freshness;
5. bounded failure categories and dependency contribution;
6. deploy, configuration, and feature-rollout annotations;
7. links from an exemplar/correlation marker to restricted traces/events where supported;
8. owner, timezone, environment, data delay, and last-reviewed date.

Do not create one colorful card per available metric. Avoid charts with incompatible units/aggregations, unbounded tenant selectors, hidden exclusions, or percentiles summed across services. Dashboard access and tenant segmentation must follow privacy/security policy.

## 7. Paging runbook content

Every paging alert links to a concise maintained runbook containing:

- alert meaning, affected journey, SLO, and likely user symptom;
- owner, escalation boundary, and dependencies;
- known-safe queries starting from the alert labels/correlation;
- how to confirm this is user impact rather than telemetry failure;
- bounded triage sequence and expected evidence at each step;
- safe mitigation, rollback boundary, and authorization requirements;
- how to verify recovery from the user journey and alert signal;
- relevant dashboard/config/deploy links and last exercise/review date.

Do not place credentials, customer records, unredacted payload examples, or destructive commands in the runbook. This skill defines these contents but does not create an incident-response documentation system.

## 8. Bounded telemetry smoke proof

The goal is to prove one changed signal path end to end, not to exercise the entire monitoring estate.

### Precondition

Use the project’s installed runtime, existing scripts, and configured local or non-production sink/exporter. Identify the application boundary, exporter/collector hop, and query/capture point. Never point synthetic secrets or customer-like payloads at production merely to test redaction.

Create a unique harmless marker such as `obs-smoke-<timestamp-or-random>` in a field explicitly allowed for non-production correlation. Do not overload a production metric label or span name with it.

### Scenarios

1. **Success:** one representative eligible journey reaches its real completion boundary.
2. **Controlled non-success:** one expected rejection or safely induced failure exercises the changed error path.
3. **Async (only if affected):** one accepted message/job/webhook reaches a processing attempt and terminal state. Exercise retry, duplicate, or dead-letter only when that behavior or instrumentation changed.
4. **Exporter failure (only if affected):** make the safe local/non-production sink unavailable and confirm diagnostic export failure is bounded without changing the business result.
5. **Alert (only if affected):** run the repository’s existing rule checker or controlled fixture through firing and non-firing cases.

### Evidence checks

| Invariant | Proof |
|---|---|
| Terminal semantics | Exactly one logical terminal event per scenario/attempt model, with correct outcome and severity |
| Correlation | Sink trace/event records share the expected trace/span or documented async link and operational identifier |
| Trace shape | Stable names; critical boundary/dependency present; no per-function span explosion |
| Metric movement | Before/after numerator, denominator, count, or distribution movement matches the executed attempts |
| Async coherence | Receipt/enqueue/attempt/terminal order, age, attempt, and final outcome are consistent |
| Redaction | Synthetic canary secret/body/header values and unallowlisted baggage are absent or approved-transformed |
| Cardinality | Marker/IDs are not metric labels or signal names; label values remain in their declared sets |
| Tenant boundary | Synthetic tenant context is derived from the trusted source and restricted in query/view |
| Failure isolation | When exercised, exporter failure does not alter diagnostic journey result and has bounded visibility |
| Alert behavior | Controlled bad data fires as designed; good/no-traffic data follows explicit policy |

Capture actual sink output or query results. Source assertions, a passed build, initialized SDK, collector health, or a dashboard screenshot alone do not prove delivery.

### Evidence report

```text
Journey and environment:
Installed signal path:
Scenario commands/actions:
Correlation marker:
Observed terminal events:
Observed trace/link:
Metric before -> after:
Redaction/baggage result:
Alert firing/non-firing result (if changed):
Exporter-failure result (if changed):
Unmeasured gaps and ownership:
```

Commands are project-specific. Prefer the smallest existing script or actual runtime action; never invent a package-manager command, test target, exporter API, or vendor query.

## 9. Review gates

Before acceptance confirm:

- operator decisions and journey outcomes precede instrumentation;
- audit records remain separate and unsampled;
- semantic conventions and installed APIs were checked current;
- all signal fields have bounded cardinality and sensitivity classifications;
- trace/baggage metadata is never authorization context;
- SLI populations are complete or sampling is explicit and valid;
- retention, access, redaction, exporter failure, and cost owners are named;
- alerts have owners, actions, runbooks, dedupe, recovery, and executable evidence;
- the bounded sink proof was observed and its gaps reported honestly.

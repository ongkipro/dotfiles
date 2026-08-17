# Bounded remediation verification

Prove the changed security invariant with the smallest authorized, harmless scenario. Prefer the application's existing runtime and test commands. `testing-engineering` owns durable automated-test strategy; `ui-validation` owns browser evidence. This reference defines AppSec scenarios and evidence quality.

## Safety envelope

Before exercising a finding, record:

- owned target and environment;
- allowed identities, tenants, files, callbacks, and test data;
- operations that could send messages, charge money, alter approvals, touch real users, or create load;
- rollback/cleanup and stop conditions;
- which secrets must remain outside the agent process and output.

Use disposable local/test accounts and data. Use a controlled local receiver for outbound-request tests and inert marker strings for injection/encoding tests. Never use real credentials as payloads, upload malware, target cloud metadata or third parties, create persistence, bypass human approvals, or run unbounded fuzz/load tests. If the safe environment cannot represent the boundary, finish code review and label runtime proof pending.

## Evidence pattern

For each remediation, capture four cases when applicable:

1. **Allowed baseline:** the intended identity/input/event succeeds and performs exactly one expected effect.
2. **Denied variant:** the unauthorized, cross-boundary, malformed, stale, or over-limit case is rejected before the sensitive sink.
3. **No side effect:** denied/replayed cases do not mutate data, enqueue work, upload/serve content, send messages, or trigger external actions.
4. **Safe failure:** the client response and collected logs contain no secret, stack, query, internal path/host, or unsafe reflected input.

Record command or browser scenario, response/status, relevant state before/after, and sanitized log/correlation evidence. Do not record secret values or full sensitive payloads. Source inspection alone proves code placement, not deployed proxy/header behavior or a provider round trip.

## Scenario matrix

| Boundary | Minimum positive evidence | Minimum negative evidence | State/error evidence |
| --- | --- | --- | --- |
| Authentication/session | Valid sign-in/session reaches the intended surface | Missing, invalid, expired, revoked, and pre-rotation session cannot reach it | Session rotates at the required transition; response/cookie contains no secret beyond its intended channel |
| Object authorization | Actor reads/updates its permitted object | Same-role actor requests another owner's object | Protected object is unchanged; response does not leak sensitive existence/details |
| Function authorization | Authorized role performs the privileged operation | Authenticated lower role calls the handler directly, not only through UI | No job/event/state transition occurs for denied call |
| Tenant isolation | Tenant A accesses its own seeded object | Tenant A uses a valid Tenant B object ID across direct, list/search, export/download, cache, and async paths affected by the change | Tenant B data never appears; storage/cache/job keys and state remain scoped |
| Approval/role transition | Independent permitted approver completes a current request | Self-approval, stale request, unapproved role, client-modified approver/status, or concurrent duplicate is rejected | Exactly one atomic transition and attributable audit event; no gate bypassed for testing |
| Mass assignment | Allowed fields update | Protected owner/tenant/role/price/status fields are added to the same request | Protected fields remain unchanged; unexpected-field behavior matches the contract |
| SQL/query injection | Ordinary values including punctuation round-trip correctly | Inert metacharacter/boolean marker remains data and cannot change result cardinality or query structure | No query/stack detail in response; parameterized path is observed through behavior or safe query instrumentation |
| Command/template injection | Required fixed operation/template handles ordinary data | Inert separator/expression marker is passed as data or rejected | No extra process/template evaluation/output/file is created |
| HTML/URL output | Expected content renders/navigates correctly | Controlled markup/script or disallowed scheme remains text, is sanitized by policy, or is rejected | Browser shows no execution/CSP violation attributable to the path |
| SSRF | Allowlisted controlled endpoint succeeds within bounds | Disallowed scheme/host/port, loopback/private target, confusing hostname form, and redirect to a disallowed destination fail | Controlled receivers show no denied request; timeout/size failure is bounded and sanitized |
| File upload | Small valid file stores and authorized user retrieves it | Oversize, wrong signature/type, traversal filename, archive-limit case, and unauthorized retrieval fail as applicable | No overwrite/execution/public exposure; rejected/quarantined objects are not served |
| Webhook | Officially signed fresh event performs one expected effect | Missing/invalid signature, modified raw bytes, stale timestamp, wrong account/tenant, and duplicate delivery fail or acknowledge safely per provider | Exactly one durable business transition; retry after partial failure is idempotent |
| CSRF/CORS | Allowed origin and valid anti-CSRF mechanism succeed | Cross-site state change without the mechanism fails; disallowed origin receives no credentialed readable response | No state change; preflight/actual headers match the final serving layer |
| Cookies/headers/CSP | Browser receives intended cookie attributes and response headers | Error/static/redirect paths do not omit required policy; forbidden embedding/script source fails | Real browser has no unexpected CSP or mixed-content error; do not infer from config only |
| Secret/crypto rotation | New version/key reads or creates intended data | Missing/wrong/retired key fails explicitly according to migration plan | No fallback default, plaintext, value in logs/args/diffs, or irreversible orphaned data |
| Rate/resource limits | Requests below the agreed bound work | First bounded request above each changed identity/tenant/operation/body/concurrency limit is rejected | Expensive side effect does not start; recovery window/retry behavior is observable and distributed behavior is tested only in a safe environment |
| Error handling/logging | Known and unexpected local failure correlate to protected logs | Malformed/untrusted values cannot inject records or expose internals | Client is minimal; log is useful, access-controlled by existing system, and redacted |
| Dependency remediation | Normal affected feature works on the installed patched dependency | Original vulnerable reachable behavior or version/advisory condition is absent | Lockfile/runtime resolve the intended version; do not claim exploit remediation from audit exit code alone |

Only run cases applicable to the changed flow. Add boundary cases when the threat model identifies them; do not turn the table into a mandatory full-suite checklist.

## Severity and confidence

Use evidence-based labels:

- **Confirmed:** safely reproduced or directly demonstrated through an authoritative execution trace.
- **High confidence:** complete reachable source-to-sink path with a missing/bypassable control, but runtime reproduction is unsafe or unavailable. Mark all runtime assumptions.
- **Defense gap:** a required hardening layer is absent, but no realistic exploit path or impact has been established.
- **Informational:** useful observation without a security defect. Do not present as a vulnerability.

Severity follows realistic preconditions, required privilege/user interaction, exposure, affected asset/tenant, blast radius, detectability, and confidentiality/integrity/availability/financial impact. Scanner severity is input, not the conclusion.

## Remediation completion gate

Do not call a finding fixed until:

- the authoritative boundary contains the control;
- every affected caller and parallel entry point is migrated or intentionally shown unaffected;
- allowed behavior still succeeds;
- the original denied/replay/error case fails without the sensitive side effect;
- secrets and approval gates were not exposed or bypassed during work;
- provider/framework syntax was checked against installed versions and current official docs;
- deployment-only evidence (proxy, browser headers, secret store, provider event) is either exercised or explicitly listed as residual risk.

Report exact observed results. A compile, lint, scanner, or unit-test pass is supporting evidence, not proof of an authorization, browser, webhook, or deployment boundary by itself.

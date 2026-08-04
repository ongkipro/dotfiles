# Authentication, Authorization, and RBAC/ABAC Specification

> Template instruction: authentication establishes an identity; authorization decides an action on a resource in context. Keep these contracts separate and fail closed on ambiguity or dependency failure.

## Document Control

| Field | Value |
|---|---|
| Purpose | Define identity lifecycle, authentication, sessions, service identities, roles, permissions, attributes, policy evaluation, privileged access, and audit. |
| Required when | Any authenticated multi-user, administrative, machine-to-machine, or tenant-scoped product. |
| Accountable owner | `<security/product owner>` |
| Responsible author | `<IAM/security engineer>` |
| Reviewers | `<application, platform, tenancy, privacy, operations, support>` |
| Status / version / updated | `<status> / <version> / <date>` |

**Inputs:** actors and behavior (`PR-*`), tenant context (`TEN-*`), resources (`DATA-*`), architecture boundaries (`ARCH-*`), threats and obligations.
**Outputs:** stable `IAM-*` requirements, identity/session contracts, role-permission matrix, ABAC policy model, decision semantics, lifecycle, audit and tests.
**Primary ID namespace:** `IAM-<number>`.

## 1. Identity and Trust Model

| Principal type | Authority/source | Identifier | Tenant relation | Credential/auth method | Lifecycle owner |
|---|---|---|---|---|---|
| Human user | `<IdP/local/partner>` | `<stable subject>` | `<global membership>` | `<method>` | `<role>` |
| Service/workload | `<issuer>` | `<workload identity>` | `<global/tenant-bound>` | `<short-lived credential>` | `<role>` |
| API client | `<issuer>` | `<client ID>` | `<scope>` | `<key/OAuth/etc.>` | `<role>` |

| ID | Requirement | Threat/rationale | Enforcement | Evidence | Owner |
|---|---|---|---|---|---|
| `IAM-1` | `<The system MUST ...>` | `<risk>` | `<component/policy>` | `<test/audit>` | `<role>` |

## 2. Identity Lifecycle

| Transition | Initiator/approval | Proof/verification | Access effect | Sessions/credentials | Audit/notification |
|---|---|---|---|---|---|
| Invite/provision | `<actor>` | `<proof>` | `<initial access>` | `<none/issue>` | `<event>` |
| Activate/link | `<actor>` | `<proof>` | `<membership>` | `<issue>` | `<event>` |
| Recover | `<actor>` | `<proof>` | `<constraints>` | `<revoke/rotate>` | `<event>` |
| Suspend/delete | `<actor>` | `<approval>` | `<deny>` | `<revoke>` | `<event>` |

Define duplicate identities, email/identifier changes, federation linking, ownership transfer, rehire/reactivation, and deletion without relying on mutable identifiers as authorization keys.

## 3. Authentication Requirements

| Channel/principal | Method | Assurance/MFA | Enrollment/recovery | Rate/abuse control | Failure behavior |
|---|---|---|---|---|---|
| `<web/admin/API/service>` | `<verified method>` | `<required level>` | `<process>` | `<RATE-*/control>` | `<generic error/lock/step-up>` |

Document phishing resistance where needed, credential storage, enumeration resistance, OAuth/OIDC redirect and PKCE rules, clock/skew, key rotation, and dependency outage behavior. Use current provider standards; never invent flow parameters.

## 4. Session and Token Contract

| Artifact | Issuer/audience | Lifetime/idle | Storage/transport | Rotation/revocation | Binding | Failure response |
|---|---|---|---|---|---|---|
| `<session/access/refresh/API key>` | `<values>` | `<policy>` | `<cookie/header/vault>` | `<mechanism/latency>` | `<tenant/device/client>` | `<deny/re-auth>` |

Specify cookie attributes, CSRF protection, replay prevention, signing/encryption algorithms by referenced security policy, session fixation prevention, global/tenant logout, compromised-credential response, and policy-change freshness.

## 5. Resource and Action Vocabulary

| Resource type | Owner/scope | Actions | Sensitive attributes | Source contract |
|---|---|---|---|---|
| `<resource>` | `<global/tenant/user>` | `<read/create/update/delete/admin/etc.>` | `<classification/state>` | `<DATA-*>` |

Use stable action names. UI visibility is not authorization enforcement.

## 6. RBAC Role-Permission Matrix

| Role | Scope | Resource:action permissions | Assignment authority | Separation constraints | Default? |
|---|---|---|---|---|---|
| `<role>` | `<platform/tenant/resource>` | `<explicit actions>` | `<role>` | `<cannot combine/approve own>` | `Yes/No` |

Roles aggregate permissions; code should evaluate permissions/policies, not scatter role-name checks. Default to least privilege and explicit denial.

## 7. ABAC and Policy Evaluation

| Policy ID | Subject attributes | Resource attributes | Context | Decision rule | Missing/stale behavior |
|---|---|---|---|---|---|
| `IAM-2` | `<membership/assurance>` | `<tenant/owner/state>` | `<time/network/action>` | `<allow only when ...>` | `Deny` |

Decision semantics:

1. Establish authenticated principal and authoritative `TEN-*` context.
2. Normalize action/resource and load trusted attributes.
3. Apply explicit deny, suspension, separation-of-duty, and risk constraints.
4. Grant only when an applicable allow policy succeeds; otherwise deny.
5. Emit a redacted decision audit with policy/version and correlation ID.

Define precedence, policy versioning, cache invalidation, consistency, explainability, and maximum revocation latency.

## 8. Privileged, Support, and Break-Glass Access

| Access path | Eligible principals | Approval | Scope/duration | User visibility/consent | Audit/review | Revocation |
|---|---|---|---|---|---|---|
| `<support/admin/break-glass>` | `<role>` | `<two-person/JIT>` | `<tenant/actions/time>` | `<rule>` | `<event/cadence>` | `<automatic/manual>` |

Impersonation, if allowed, must display an unmistakable state, prohibit sensitive actions as defined, expire, and preserve the real operator identity.

## 9. Service-to-Service and API Access

- Workload identity and trust bootstrap: `<mechanism>`
- Audience/scope restriction: `<rules>`
- Tenant context binding: `<TEN-* rule>`
- Key/secret prohibition and exceptions: `<SEC-* refs>`
- Rotation and revocation: `<latency/process>`
- Delegation/on-behalf-of behavior: `<supported flow or prohibited>`

## 10. Audit and Privacy

| Event | Actor/subject | Tenant/resource | Decision/reason | Correlation | Retention/access | Alert |
|---|---|---|---|---|---|---|
| `<login/policy/admin/change>` | `<fields>` | `<IDs>` | `<code, no secrets>` | `<ID>` | `<PRIV-*/SEC-*>` | `<OBS-*>` |

Never log credentials, full tokens, recovery secrets, or unnecessary personal data.

## 11. Authorization Test Matrix

| Test ID | Principal/context | Action/resource | Manipulation | Expected decision/effect | Evidence |
|---|---|---|---|---|---|
| `IAM-T1` | `<role/tenant>` | `<action>` | `<IDOR/stale role/host mismatch/replay>` | `<deny/no side effect/audit>` | `<test>` |

Cover unauthenticated, wrong tenant, wrong role, stale membership, suspended identity, scope escalation, identifier enumeration, CSRF/replay, policy outage, revocation, support access, and separation of duty.

## 12. Cross-Document Contract

- `02-PRD.md` owns actor outcomes; this document owns authentication and authorization semantics.
- `06-TENANT-ISOLATION.md` establishes tenant context; IAM authorizes within that context.
- `05-DATA-MODEL.md` owns resource ownership/schema constraints; OpenAPI declares security schemes and operation requirements.
- Security owns cryptographic/control requirements; Privacy owns identity/audit retention; Observability owns alerts.
- Billing entitlements are inputs to policy only when the Billing contract identifies an authoritative, fresh source.

## 13. Validation and Approval Checklist

- [ ] Human, service, API, support, and break-glass principals have authoritative identifiers and lifecycle owners.
- [ ] Authentication, account recovery, session/token, MFA, revocation, and provider outage behavior fail safely.
- [ ] Resource/action vocabulary and tenant scopes are complete and stable.
- [ ] Role matrix is least-privilege; assignments, default access, separation of duty, and privilege escalation paths are tested.
- [ ] ABAC inputs are trusted, versioned, freshness-bounded, deterministic, and deny on missing/ambiguous data.
- [ ] Authorization is server-side at every entry point; UI checks are convenience only.
- [ ] Privileged/support access is approved, scoped, expiring, visible where required, and audited.
- [ ] Logs exclude credentials/tokens and meet retention/access requirements.
- [ ] Automated negative tests cover horizontal, vertical, tenant, replay, stale-policy, and revocation cases.
- [ ] `IAM-*` IDs are unique and cross-document references resolve.
- [ ] Security, tenancy, application, platform, privacy, and operations owners approved.

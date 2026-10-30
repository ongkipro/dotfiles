---
name: better-auth-security
description: >-
  Harden Better Auth: rate limits, secrets, CSRF, trusted origins, sessions/cookies, OAuth tokens, IP tracking, audit hooks; auth-flow UX. Not cross-stack AppSec (application-security), Supabase Auth, or routing.
---

# Better Auth security

This file owns hardening decisions. Option names and snippets live in
[hardening-config.md](references/hardening-config.md); user-facing flow
contracts (sign-up, verification, reset, invites, OAuth/magic link, account
linking, session-expiry UX, enumeration safety, organization RBAC) in
[auth-flows.md](references/auth-flows.md). Cross-stack threat modelling and
tenant isolation proofs stay with `application-security`.

**Pick the path first:**
- Debugging a login/session/cookie/OAuth failure: §1, then open only the
  matching section of `hardening-config.md`.
- Hardening an existing install: §1 → §2 checklist → fix the failing rows →
  §3.
- New Better Auth setup: §1 → §2 all rows → `auth-flows.md` for the flows the
  product needs → §3.

## 1. Inspect first

Installed `better-auth` version (`package.json`, lockfile) — option names
changed between 1.6 and 1.7 (rate-limit storage `consume` vs `get/set`,
`secrets` rotation). The existing `betterAuth({...})` config, where it is
served (framework route, proxy/edge in front, serverless or long-lived),
`baseURL`/`trustedOrigins`, secondary storage, enabled plugins, and the
project's env-var names. Confirm against the installed version's docs before
changing a surface; this skill is not a substitute for them.

## 2. Production checklist

Each row maps to a section in `hardening-config.md`.

- [ ] **Secret**: 32+ chars, high entropy, never committed; rotation via
      versioned `secrets` (1.7+).
- [ ] **HTTPS**: `baseURL` is https; secure cookies follow automatically.
- [ ] **Trusted origins**: every real frontend/mobile origin listed; wildcards
      only where the host set is genuinely dynamic.
- [ ] **Multi-domain hosts**: fail closed with `baseURL.allowedHosts`; never
      trust arbitrary forwarded hosts.
- [ ] **Rate limiting**: enabled; `/reset-password` and `/forget-password`
      configured explicitly (built-in special rules do not cover reset
      beyond the global limiter); atomic storage in serverless.
- [ ] **CSRF**: `disableCSRFCheck` stays false.
- [ ] **Sessions**: expiry/refresh chosen deliberately; cookie cache delay
      accepted or authoritative reads for sensitive actions.
- [ ] **Password reset**: `revokeSessionsOnPasswordReset: true`, short token
      expiry.
- [ ] **Cookies**: cross-subdomain only when required; custom attributes
      reviewed.
- [ ] **OAuth**: state stored server-side; `encryptOAuthTokens: true` when
      tokens are persisted.
- [ ] **IP boundary**: edge-owned IP header or explicit trusted proxy; raw
      forwarded chains are not trusted.
- [ ] **Credential lifecycle**: 2FA and session storage options match the
      threat model; `storeSessionInDatabase` when sessions must be auditable.
- [ ] **Audit**: `databaseHooks`/`hooks` record security events without
      secrets.
- [ ] **Background tasks**: configured for the serverless platform in use.
- [ ] **Enumeration**: uniform responses on sign-up/reset
      (`auth-flows.md`).
- [ ] **Organizations**: server-side `hasPermission` on mutations, last-owner
      and deletion guards, membership-checked `activeOrganizationId`.

## 3. Prove it

Leave one runnable check per changed control: a test or script that hits the
real route (rate-limit 429 after N requests, rejected foreign origin, revoked
session after password reset, 2FA required where configured). Browser-visible
auth UI goes through `ui-validation`. A config diff alone is not evidence.

---
name: better-auth-security
description: Configure rate limiting, manage auth secrets, set up CSRF protection, define trusted origins, secure sessions and cookies, encrypt OAuth tokens, track IP addresses, and implement audit logging for Better Auth. Automatically use when touching auth code in a Better Auth project (e.g. the kelola backend), debugging login/OAuth/session/cookie issues, or when the user mentions Better Auth, BETTER_AUTH_URL/SECRET, trustedOrigins, brute force, or Indonesian phrases like amankan login, gak bisa login, rate limit auth, harden auth.
---

## Secret Management

### Configuring the Secret

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET, // or via `BETTER_AUTH_SECRET` env
});
```

Better Auth looks for secrets in this order:
1. `options.secret` in your config
2. `BETTER_AUTH_SECRET` environment variable
3. `AUTH_SECRET` environment variable

### Secret Requirements

- Rejects default/placeholder secrets in production
- Warns if shorter than 32 characters or entropy below 120 bits
- Generate: `openssl rand -base64 32`
- Never commit secrets to version control

### Rotating the Secret

Versioned secrets rotate without re-encrypting data or logging users out of encrypted payloads (verified in `better-auth@1.7.6`; confirm the installed version has `secrets`):

```ts
export const auth = betterAuth({
  secrets: [
    { version: 2, value: process.env.AUTH_SECRET_V2! }, // first = current, encrypts new data
    { version: 1, value: process.env.AUTH_SECRET_V1! }, // decrypt-only
  ],
});
```

Or `BETTER_AUTH_SECRETS=2:<base64>,1:<base64>`. When `secrets` is set, `secret`/`BETTER_AUTH_SECRET` is only the fallback for decrypting pre-rotation payloads; data is re-encrypted with the current key on its next write. Remove an old version only after nothing still needs it. Sources: [security reference](https://www.better-auth.com/docs/reference/security#secret-rotation), [`secrets` option](https://www.better-auth.com/docs/reference/options#secrets).

## Rate Limiting

Enabled in production by default. Applies to all endpoints. Plugins can override per-endpoint.

### Default Configuration

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  rateLimit: {
    enabled: true, // Default: true in production
    window: 10, // Time window in seconds (default: 10)
    max: 100, // Max requests per window (default: 100)
  },
});
```

### Storage Options

Options: `"memory"` (resets on restart, avoid on serverless), `"database"` (persistent), `"secondary-storage"` (Redis, default when available).

```ts
rateLimit: {
  storage: "database",
}
```

### Custom Storage

Implement your own rate limit storage with one atomic check-and-increment:

```ts
rateLimit: {
  customStorage: {
    consume: async (key, rule) => {
      // Atomically count one request for `key` in a rule.window-second window
      // (e.g. one Redis Lua script / one SQL upsert ... returning).
      // Return { allowed: false, retryAfter: seconds } once rule.max is reached.
      return { allowed: true, retryAfter: null };
    },
  },
}
```

Version-sensitive: `better-auth@1.7.x` accepts only `consume`; separate `get`/`set` was removed because concurrent requests could all pass one stale read. `1.6.x` still accepts `get`/`set` with optional `consume` (non-atomic fallback without it). Source: [rate limit docs](https://www.better-auth.com/docs/concepts/rate-limit).

### Per-Endpoint Rules

`customRules` keys are matched against the request path **with the auth base path stripped** — `"/sign-in/email"`, not `"/api/auth/sign-in/email"`; a key with the prefix silently never matches. `*` wildcards are supported.

Built-in special rules are path-specific: `/sign-in`, `/sign-up`, `/change-password`, and `/change-email` are limited to 3 requests per 10 seconds, while reset-request paths including `/forget-password` are limited to 3 per 60 seconds. Better Auth also exposes `POST /reset-password`, but its current special-rule list does not tighten that path beyond the global limiter. **House rule:** configure `/reset-password` explicitly, and list `/forget-password` explicitly when the deployment must not rely on built-in defaults. Sources: [rate-limiter rules](https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/api/rate-limiter/index.ts) and [password routes](https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/api/routes/password.ts).

```ts
rateLimit: {
  customRules: {
    "/sign-in/email": {
      window: 60, // 1 minute window
      max: 5, // 5 attempts
    },
    "/forget-password": { window: 60, max: 3 },
    "/reset-password": { window: 60, max: 3 }, // House rule
    "/some-safe-endpoint": false, // Disable rate limiting
  },
}
```

## CSRF Protection

Multi-layer protection: origin header validation, Fetch Metadata checks, and first-login protection.

### Configuration

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  advanced: {
    disableCSRFCheck: false, // Default: false (keep enabled)
  },
});
```

Only disable for testing or with an alternative CSRF mechanism.

## Trusted Origins

### Configuring Trusted Origins

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: "https://api.example.com",
  trustedOrigins: [
    "https://app.example.com",
    "https://admin.example.com",
  ],
});
```

The `baseURL` origin is automatically trusted. Also configurable via env: `BETTER_AUTH_TRUSTED_ORIGINS=https://app.example.com,https://admin.example.com`

### Multi-Domain Base URL

For preview hosts or multiple production domains, prefer Better Auth's documented fail-closed allowlist instead of trusting request headers directly:

```ts
export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "app.example.com",
      "admin.example.com",
      "*.preview.example.com",
    ],
    protocol: "https",
  },
});
```

Unknown hosts fail unless an explicit `fallback` is a deliberate product requirement, and `allowedHosts` are also added to trusted origins. In Better Auth 1.7, forwarded host/protocol headers are ignored by default for this path; enable `advanced.trustedProxyHeaders` only when a trusted proxy owns and sanitizes those headers. For tenant-managed custom domains, resolve the canonical host against the authoritative active-domain registry before adding it to any trusted-origin decision.

### Wildcard Patterns

```ts
trustedOrigins: [
  "*.example.com", // Matches any subdomain
  "https://*.example.com", // Protocol-specific wildcard
  "exp://192.168.*.*:*/*", // Custom schemes (e.g., Expo)
]
```

### Dynamic Trusted Origins

Compute trusted origins based on the request:

```ts
trustedOrigins: async (request) => {
  const requestedHost = resolveCanonicalRequestHost(request); // application-owned, proxy-normalized helper
  const domain = await lookupActiveTenantDomain(requestedHost); // application-owned registry lookup
  return domain ? [domain.canonicalOrigin] : [];
}
```

Validates `callbackURL`, `redirectTo`, `errorCallbackURL`, `newUserCallbackURL`, and `origin` against trusted origins. Invalid URLs receive 403. Returned origins must come from authoritative stored data, not string interpolation of an untrusted host header or tenant slug.

## Session Security

### Session Expiration

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (default)
    updateAge: 60 * 60 * 24, // Refresh session every 24 hours (default)
  },
});
```

### Session Caching Strategies

Cache session data in cookies to reduce database queries:

```ts
session: {
  cookieCache: {
    enabled: true,
    maxAge: 60 * 5, // 5 minutes
    strategy: "compact", // Options: "compact", "jwt", "jwe"
  },
}
```

Strategies: `"compact"` (Base64url + HMAC, smallest), `"jwt"` (HS256, standard), `"jwe"` (encrypted, use when session has sensitive data).

Cookie cache changes revocation semantics: a revoked session can remain usable on another device until `maxAge` expires. Keep `maxAge` short where revocation matters, disable cookie cache, or force an authoritative read for sensitive authorization decisions such as tenant membership/role changes, step-up checks, security settings, and privileged admin actions.

```ts
const session = await auth.api.getSession({
  headers,
  query: { disableCookieCache: true },
});
```

## Cookie Security

Defaults: `secure: true` (HTTPS/production), `sameSite: "lax"`, `httpOnly: true`, `path: "/"`, prefix `__Secure-`.

### Custom Cookie Configuration

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  advanced: {
    useSecureCookies: true, // Force secure cookies
    cookiePrefix: "myapp", // Custom prefix (default: "better-auth")
    defaultCookieAttributes: {
      sameSite: "strict", // Stricter CSRF protection
      path: "/auth", // Limit cookie scope
    },
  },
});
```

### Cross-Subdomain Cookies

```ts
advanced: {
  crossSubDomainCookies: {
    enabled: true,
    domain: ".example.com", // Note the leading dot
    additionalCookies: ["session_token", "session_data"],
  },
}
```

Only enable if you need authentication sharing and trust all subdomains.

## OAuth / Social Provider Security

PKCE is automatic for all OAuth flows. State tokens are 32-char random strings expiring after 10 minutes.

### State Parameter Storage

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  account: {
    storeStateStrategy: "cookie", // Options: "cookie" (default), "database"
  },
});
```

### Encrypting OAuth Tokens

```ts
account: {
  encryptOAuthTokens: true, // Uses AES-256-GCM
}
```

Enable if storing OAuth tokens for API access on behalf of users. Use `skipStateCookieCheck: true` only for mobile apps that cannot maintain cookies.

## IP-Based Security

### IP Address Configuration

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"], // Example: one header overwritten by the trusted edge
      disableIpTracking: false
    },
  },
});
```

Set `ipv6Subnet` (128, 64, 48, 32; default 64) to group IPv6 addresses. Do not trust the leftmost `X-Forwarded-For` value from an appending proxy chain. Either use one edge-owned header clients cannot set directly, or configure trusted proxies so the chain is resolved from trusted hops toward the client. Keep the origin reachable only through those proxies and make them overwrite/sanitize forwarded headers.

## Credential Lifecycle (email/password, 2FA, session storage)

Confirmed against `better-auth@1.7.6` source; re-check option names on other versions.

```ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,      // block sign-in until verified (default false)
    resetPasswordTokenExpiresIn: 60 * 30, // seconds (default 1 hour)
    revokeSessionsOnPasswordReset: true, // default false: a reset leaves other sessions alive
  },
  plugins: [
    twoFactor({
      otpOptions: {
        storeOTP: "hashed",  // default "plain"; also "encrypted" or custom hash/encrypt
        allowedAttempts: 5,  // per code (default 5)
      },
      trustDeviceMaxAge: 60 * 60 * 24 * 7, // seconds (default 30 days)
    }),
  ],
});
```

With `secondaryStorage` (Redis/KV) configured, sessions live **only** there by default; set `session.storeSessionInDatabase: true` if you need them queryable/auditable in the database. Sources: [email & password](https://www.better-auth.com/docs/authentication/email-password), [two-factor](https://www.better-auth.com/docs/plugins/2fa), [session management](https://www.better-auth.com/docs/concepts/session-management), vendor [skills](https://github.com/better-auth/skills).

## Database Hooks for Security Auditing

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  databaseHooks: {
    session: {
      create: {
        after: async ({ data }) => {
          await auditLog("session.created", {
            userId: data.userId,
            // Resolved by Better Auth via advanced.ipAddress — never re-read a
            // raw x-forwarded-for here (see IP-Based Security).
            ip: data.ipAddress,
            userAgent: data.userAgent,
          });
        },
      },
      delete: {
        before: async ({ data }) => {
          await auditLog("session.revoked", { sessionId: data.id });
        },
      },
    },
    user: {
      update: {
        after: async ({ data, oldData }) => {
          if (oldData?.email !== data.email) {
            await auditLog("user.email_changed", {
              userId: data.id,
              oldEmail: oldData?.email,
              newEmail: data.email,
            });
          }
        },
      },
    },
    account: {
      create: {
        after: async ({ data }) => {
          await auditLog("account.linked", {
            userId: data.userId,
            provider: data.providerId,
          });
        },
      },
    },
  },
});
```

Return `false` from a `before` hook to prevent an operation.

## Background Tasks

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  advanced: {
    backgroundTasks: {
      handler: (promise) => {
        // Platform-specific handler
        // Vercel: waitUntil(promise)
        // Cloudflare: ctx.waitUntil(promise)
        waitUntil(promise);
      },
    },
  },
});
```

Ensures operations like sending emails don't affect response timing.

## Account Enumeration Prevention

Built-in: consistent response messages, dummy operations on invalid requests, background email sending. Return generic error messages ("Invalid credentials") rather than specific ones ("User not found").

## Complete Security Configuration Example

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: "https://api.example.com",
  trustedOrigins: [
    "https://app.example.com",
    "https://*.preview.example.com",
  ],
  
  // Rate limiting
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
    },
  },
  
  // Session security
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    freshAge: 60 * 60, // 1 hour for sensitive actions
    cookieCache: {
      enabled: true,
      maxAge: 300,
      strategy: "jwe", // Encrypted session data
    },
  },
  
  // OAuth security
  account: {
    encryptOAuthTokens: true,
    storeStateStrategy: "cookie",
  },

  // Advanced settings
  advanced: {
    useSecureCookies: true,
    cookiePrefix: "myapp",
    defaultCookieAttributes: {
      sameSite: "lax",
    },
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"], // Example when Cloudflare is the trusted edge
      ipv6Subnet: 64,
    },
    backgroundTasks: {
      handler: (promise) => waitUntil(promise),
    },
  },
  
  // Security auditing: see "Database Hooks for Security Auditing" above.
});
```

## Security Checklist

Before deploying to production:

- [ ] **Secret**: Use a strong, unique secret (32+ characters, high entropy); plan rotation via `secrets`
- [ ] **Password reset**: `revokeSessionsOnPasswordReset: true`, short `resetPasswordTokenExpiresIn`
- [ ] **HTTPS**: Ensure `baseURL` uses HTTPS
- [ ] **Trusted Origins**: Configure all valid origins (frontend, mobile apps)
- [ ] **Multi-Domain Hosts**: Fail closed with `baseURL.allowedHosts`; never trust arbitrary forwarded hosts
- [ ] **Session Revocation**: Decide whether cookie-cache delay is acceptable; use authoritative reads for sensitive actions
- [ ] **Proxy/IP Boundary**: Use an edge-owned IP header or explicit trusted-proxy configuration; do not trust raw forwarded chains
- [ ] **Rate Limiting**: Keep enabled with appropriate limits
- [ ] **CSRF Protection**: Keep enabled (`disableCSRFCheck: false`)
- [ ] **Secure Cookies**: Enabled automatically with HTTPS
- [ ] **OAuth Tokens**: Consider `encryptOAuthTokens: true` if storing tokens
- [ ] **Background Tasks**: Configure for serverless platforms
- [ ] **Audit Logging**: Implement via `databaseHooks` or `hooks`
- [ ] **IP Tracking**: Configure headers if behind a proxy

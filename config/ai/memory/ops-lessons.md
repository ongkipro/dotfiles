# Memory: Deploy, database and toolchain lessons

> Split from [development-lessons.md](development-lessons.md) for the router budget. Coolify/Docker deploys, Postgres dumps and migrations, PostgREST, Better Auth and mise toolchain lessons; each states symptom, root cause, durable invariant, fix, and regression check. The repository stays authoritative.


---


## Lesson: Better Auth: auth.api calls in Next.js Server Actions bypass the rate limiter

### Symptom
Sign-in via a Server Action calling auth.api.signInEmail was never throttled; repeated wrong passwords never returned 429.

### Root cause
In better-auth 1.7.x the rate limiter (onRequestRateLimit) and origin check run in the HTTP router's onRequest; direct auth.api.* invocations skip the router.

### Durable invariant
Security-relevant auth flows (sign-in, reset, invite accept) must go through the /api/auth/* HTTP handler, and BETTER_AUTH_URL must equal the serving origin or the origin check returns 403.

### Fix
Client form posts to /api/auth/sign-in/email; e2e sets BETTER_AUTH_URL to its port and retries on 429.

### Regression check
Production build: 3 wrong-password POSTs then 429; e2e login helper passes.

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: Next.js 16 docker build prerenders routes that read env before a dynamic API

### Symptom
docker build (no .env) failed: Export encountered an error on /admin while local builds passed.

### Root cause
auth()/db() needing DATABASE_URL was evaluated before await headers(), so Next tried to prerender the route at build time and threw.

### Durable invariant
In server code, await headers()/cookies() before touching runtime-env-dependent singletons, and keep those singletons lazy; verify builds without a .env (docker build) not only locally.

### Fix
currentUser awaits headers() first; auth() and db() are lazy.

### Regression check
docker build -f apps/web/Dockerfile . succeeds without env.

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: pg_dump --no-owner --no-acl breaks restores of RLS databases

### Symptom
Restore rehearsal passed row counts, but the restored database answered 'permission denied for table product' to the RLS-bound app role.

### Root cause
With RLS split into owner/app/platform roles, table grants and ownership are part of tenant isolation; --no-owner --no-acl drops them and migrations already recorded in the journal never re-grant.

### Durable invariant
Back up RLS databases with owners and ACLs (roles recreated at cluster level first), and make the restore rehearsal assert policy count, zero rows for the app role without a tenant context, and full reads with one.

### Fix
Bukalaris scripts/db-backup.sh keeps owners/ACLs; scripts/db-restore-rehearsal.sh checks policies and app-role reads.

### Regression check
Rehearsal on a --no-acl dump exits 1 with permission denied; on a full dump rls_ok=yes.

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: Postgres: recreated public schema blocks a non-superuser migration owner

### Symptom
Migration creating a function as the schema-owner role failed with 3F000 'no schema has been selected to create in' on an old dev database only.

### Root cause
The public schema had been dropped and recreated by the superuser during a reset, so it was owned by that role and the new owner role lacked CREATE on it; fresh databases (public owned by pg_database_owner) were unaffected.

### Durable invariant
When moving a database to a dedicated owner role, transfer the public schema too (ALTER SCHEMA public OWNER TO …), not only tables, sequences and functions.

### Fix
Bukalaris scripts/db-roles.sh now alters the public schema owner.

### Regression check
db-roles.sh then pnpm db:migrate on the reset dev DB: migrations applied, 26 policies.

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: mise install --force on a Node version wipes its global npm CLIs

### Symptom
After 'mise install node@<v> --force' (to restore a missing npm), every global CLI shim (claude, codex, pi, wrangler, vercel, language servers) fails with 'No version is set for shim'.

### Root cause
Global npm packages live inside the mise Node install (lib/node_modules); --force replaces the whole install directory, so the globals are deleted with it.

### Durable invariant
Before forcing a Node reinstall, record the globals and their versions; a forced reinstall is a full global-CLI reinstall.

### Fix
List globals first (npm ls -g --depth=0, or read another installed Node version's lib/node_modules package.json versions), force-reinstall, then 'npm i -g name@version ...' at the same versions and reshim.

### Regression check
for c in claude codex pi wrangler vercel; do $c --version; done; ai-doctor

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: PostgREST v14.18 hasql-transaction infinite retry on custom SQLSTATE 40001

### Symptom
PostgREST RPC calls that raise custom application concurrency exceptions with errcode = '40001' hang indefinitely at 100% CPU until client timeout (HTTP 499) and continue retrying in Postgres after client disconnect.

### Root cause
PostgREST v14.18 wraps every request in a hasql-transaction session that automatically retries SQLSTATE 40001 (serialization_failure) in an unbounded loop, mistaking deterministic PL/pgSQL optimistic concurrency checks (stale_revision, stale_state) for transient serializable transaction conflicts.

### Durable invariant
Deterministic application-level optimistic concurrency and prerequisite-state errors in PostgreSQL RPCs exposed through PostgREST must never use SQLSTATE 40001; use SQLSTATE 55000 (object_not_in_prerequisite_state) or P0001/P0002 instead.

### Fix
Replace errcode = '40001' with errcode = '55000' across PL/pgSQL RPCs for stale_revision, stale_state, stale_quote, quote_expired, stale_attempt, and batch_digest_mismatch.

### Regression check
vitest run tests/db/contact-archive-and-demo-cleanup.test.ts tests/db/cod-and-payment.test.ts

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: Coolify pre-deployment command runs in the old container

### Symptom
Plan to run DB migrations in Coolify's pre-deployment command would execute the previous release's migrator.

### Root cause
Per Coolify docs: pre-deployment runs in the current (old) container and is skipped on the first deployment; post-deployment runs after the deploy is marked complete and its failure does not fail the deploy.

### Durable invariant
Run migrations as a separate one-off job from the new image (e.g. a Dockerfile 'migrate' target) before deploying the web app; keep migrations expand/contract.

### Fix
Separate migrate image and Coolify app run before the web deploy (Bukalaris docs/DEPLOY-COOLIFY.md).

### Regression check
Re-read coollabsio/coolify-docs applications/builds/dockerfile before relying on it.

> Promoted from a reviewed local candidate on 2026-10-29.

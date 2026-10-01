---
name: vercel
description: Deploy, configure, inspect, and manage Vercel projects via Vercel CLI and git integration. Not Next.js app code (nextjs-development), CI workflow authoring (github-actions), or VPS deploys (kelola-deploy). Use when deploying Next.js/web projects to Vercel, linking repositories, running preview or production deployments, managing environment variables, configuring custom domains, inspecting build/runtime logs, or managing edge configs and crons. Enforces the strict Production Approval Gate.
---

# Vercel Platform & Deployment

Deploy, manage, and inspect web applications and edge infrastructure on Vercel. Standardize deployment workflows across Claude Code, Antigravity, Codex, OMP, and Pi.

**Verify the installed CLI first:** `vercel --version`. Flags below were checked against Vercel CLI 62.1.0 (`vercel <cmd> --help`, 2026-10-02); when a flag is missing or behaves differently, trust the local `--help` and https://vercel.com/docs/cli over this file. Vercel also publishes an agent plugin (`npx plugins add vercel/vercel-plugin`, advertised on every docs page) and `vercel-labs/agent-skills` (`vercel-optimize`, `vercel-deploy-claimable`); prefer this skill's approval gates when they conflict.

## Scope and triggers

Use this skill when:
- Deploying a project or static build to Vercel (`vercel deploy`, preview, or production);
- Linking a local repository or directory to a Vercel project (`vercel link`, `.vercel/repo.json`);
- Managing Vercel project configuration, teams, and scopes (`--scope <team-slug>`);
- Configuring environment variables across environments (`vercel env add`, `vercel env pull`);
- Inspecting deployment status, build logs, and real-time runtime logs (`vercel inspect`, `vercel logs`);
- Managing custom domains and SSL verification (`vercel domains`);
- Operating Vercel native platform services: Vercel Cron, Edge Config, Vercel Blob, Serverless/Fluid compute.

## Ownership and handoffs

| Need | Owner |
|---|---|
| Next.js App Router code, Server Actions, Route Handlers, layouts, components | `nextjs-development` |
| Native platform feature selection & house stack rules | `native-first` |
| Application secrets policy, credential injection (`secrets-env`), CSRF/origin checks | `application-security` |
| CI/CD GitHub Actions workflows targeting Vercel | `github-actions` |
| Self-hosted VPS alternative or Hono/PM2 deployment | `kelola-deploy` |
| Cloudflare Workers/Pages edge deployment | `cloudflare` |

## Strict Security & Approval Gates

> [!CAUTION]
> **Production Deployment Approval Gate is ALWAYS ON.**
> A preview deployment is safe. A **production deployment** (`--prod`, promotion to production, or `git push` to `main`) changes live customer traffic and **REQUIRES EXPLICIT USER APPROVAL** per `AGENTS.md`. Never deploy to production automatically.

1. **Zero Secret Leaks in CLI Flags:**
   - **NEVER** pass tokens via the `--token` flag. Command line flags appear in `ps` process lists, shell history, and agent logs.
   - Credentials MUST be injected natively via environment variables (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) using `secrets-env run -- vercel ...` or exported in the subshell.
   - Never print `.env` files or credentials from `.vercel/project.json` into terminal output or chat.
2. **Preview by Default:**
   - Always default to **preview deployments**. Deliver the preview URL to the user for verification. Only promote to production upon explicit user confirmation.
3. **Destructive Action Gate:**
   - Stop and confirm before `vercel project rm`, `vercel rm`, or `vercel env rm`.

## Step 1: Inspect Project State First

Run non-interactive checks before proposing deployment commands:

```bash
# 1. Check CLI availability and auth status (reports user/team, NOT the linked project)
vercel whoami --format json 2>/dev/null

# 2. Check git remote
git remote get-url origin 2>/dev/null

# 3. Check existing project linkage (either file indicates linked state)
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null

# 4. List available teams (when authenticated)
vercel teams list --format json 2>/dev/null

# 5. Before any consequential read or mutation: confirm the resolved owner + project
vercel project inspect --non-interactive --format json
```

**Guardrail:** Always pass `--non-interactive` to `vercel project inspect` — the bare command can prompt or enter a linking flow; with the flag it only resolves existing context. (CLI 62 makes `--non-interactive` the default when it detects an agent; pass it anyway so behaviour does not depend on detection.) Stop on `link_required` or an owner/project mismatch and ask; never auto-link. Never run bare interactive `vercel link` in an unlinked directory. Being inside an app subdirectory is not proof of the target project (a non-interactive repo link can fall back to the sole configured project).

## Step 2: Project Linking

Vercel supports two linking models:

Linking writes local state; do it only after the user confirms the target team and project.

### A. Single-Project Linking (default, explicit target)
```bash
vercel link --yes --team <team-slug> --project <project-name-or-id>
```
- Creates `.vercel/project.json` with `projectId` and `orgId`. `--project` is required for a non-interactive link to an existing project; without it `-y` may create or guess a project.

### B. Repository-Based Linking (monorepos)
```bash
vercel link --repo --team <team-slug>
```
- Creates `.vercel/repo.json` (`orgId`, `remoteName`, directory→project map) by matching the git remote, which handles several projects in one repo.
- `--repo` is labelled **alpha** in CLI 62 help, and per-directory `.vercel/project.json` links take precedence over it — check which file wins before trusting the resolved project.

## Step 3: Deployment Workflows

### 1. Preview Deployment (Standard CLI)
Run non-blocking deployments so the terminal returns immediately with the URL:
```bash
vercel deploy -y --no-wait --scope <team-slug>
```
Follow up by inspecting status (`--wait` blocks until the deployment finishes, default timeout 3m):
```bash
vercel inspect <deployment-url> --wait
```

### 2. Git-Push Deployment (Recommended for Teams)
When linked with git integration:
1. Push to a feature branch: Vercel automatically generates a Preview Deployment.
2. Retrieve the latest deployment URL:
   ```bash
   sleep 5
   vercel ls --format json --scope <team-slug>
   ```
3. Pushing to `main` triggers a Production Deployment (**Requires user approval gate**).

### 3. Production Deployment (CLI)
**STOP: Confirm with user first.** Once approved:
```bash
vercel deploy --prod -y --no-wait --scope <team-slug>
```
Inspect build and release health:
```bash
vercel inspect <deployment-url>
```

### 4. Staged Production, Promote & Rollback (each step is a production action — approval gate)
```bash
URL=$(vercel deploy --prod --skip-domain)   # production build, no domain assigned
vercel curl / --deployment $URL             # verify the exact build to be released
vercel promote $URL                         # instant, no rebuild
vercel rollback [<deployment-url-or-id>]    # revert production
```
- Promote a staged **production** deployment, not a preview: promoting a preview rebuilds it with production env vars, so the tested build is not the one released.
- **`vercel rollback` turns off auto-assignment:** later production pushes stay unassigned until `vercel promote` restores it. Say so when rolling back.
- `vercel deploy --prebuilt` builds lack Vercel System Environment Variables at build time (and Next.js Skew Protection needs a custom deployment ID).
- `vercel deploy --force` creates a fresh deployment without retaining build cache (unless `--with-cache`); `vercel redeploy` has no no-cache option.

## Environment Variables Management

Manage environment variables through the CLI without opening the dashboard:

```bash
# List environment variables
vercel env ls --scope <team-slug>

# Add a secret from a file (never `echo "value" |` or `--value`: both leak to shell history / process args)
vercel env add VAR_NAME production --type secret < ./secret.txt --scope <team-slug>

# Add for preview; development gets its own command (development-only adds default to Config)
vercel env add VAR_NAME preview --type secret < ./preview-secret.txt --scope <team-slug>
vercel env add VAR_NAME development < ./dev-value.txt --scope <team-slug>

# Pull variables to local .env.local for development
vercel env pull .env.local --scope <team-slug>

# Remove variable (confirm with user first)
vercel env rm VAR_NAME production --scope <team-slug> -y
```

**Discipline:**
- Production, Preview, and custom-environment adds **default to sensitive**; Development cannot be sensitive (`--sensitive` errors), and one command cannot mix Development with Production/Preview. `--no-sensitive` opts out unless team policy enforces sensitive vars. `--type config|secret` exists in recent CLIs (present in 62.1 source; `--visibility` is its deprecated alias) but the public docs only document `--sensitive`/`--no-sensitive` — check `vercel env add --help`. `NEXT_PUBLIC_*`/`VITE_*` are client-exposed, so never store secrets there.
- **Sensitive values are never returned by `vercel env pull`**: the CLI keeps a real value already in the local file or writes a placeholder — a missing value locally is expected, not a bug. Pull merges into an existing file (local-only keys are kept). Re-pull after adding/rotating.
- Prefer `vercel env run -e preview -- <cmd>` over writing a `.env` file when a command only needs the values transiently. `vercel build`/`vercel dev` read `.vercel/` state from `vercel pull`, not `vercel env pull`.
- Source: https://vercel.com/docs/cli/env (accessed 2026-10-02).
- Preview deployments must NOT point to the production database.
- For per-tenant databases (Neon), use separate connection strings scoped per environment.

## Domains & SSL Configuration

```bash
# List domains for the project
vercel domains ls --scope <team-slug>

# Add domain to the linked project
vercel domains add <domain.com> --scope <team-slug>

# Check domain configuration status
vercel domains inspect <domain.com> --scope <team-slug>
```

## Logs & Observability Inspection

Diagnose deployment failures and production errors:

```bash
# View build logs for a deployment
vercel inspect <deployment-url> --logs

# Recent request logs (does not stream; filter instead of scrolling)
vercel logs <deployment-url> --level error --since 1h --json

# Stream runtime logs live (only with --follow; --no-follow is now a no-op)
vercel logs <deployment-url> --follow
```
Useful filters (CLI 62): `--status-code 5xx`, `--request-id <id>`, `--environment production|preview`, `--query "status:500 error"`, `--limit`.

**Cache debugging:** `curl -sSI <url> | grep -iE 'x-vercel-cache|x-matched-path|cache-control|vary|age|set-cookie'` gives the outcome (`HIT`/`MISS`/`STALE`/`BYPASS`/…); a `set-cookie` response forces `BYPASS`. The finer `cacheReason` (e.g. `draft_mode`, `crawler`, `stale_error`) is read from `vercel logs` or the dashboard Logs "Reason" row — the `x-vercel-cache-reason` header is internal and not visible via `curl`.

## Native Platform Services (`native-first`)

| Need | Vercel Native Solution | Implementation Pattern |
|---|---|---|
| Scheduled cron jobs | **Vercel Cron** | Define `crons` in `vercel.json` pointing to a Route Handler. Secure with `CRON_SECRET` header check. `vercel crons list` / `vercel crons run <path>` (beta) trigger on demand. |
| Background work after the response | `after()` (Next.js 15.1+) or `waitUntil()` (`@vercel/functions`) | Shares the function's `maxDuration`; durable multi-step work goes to Vercel Queues/Workflows. |
| Feature flags & dynamic config | **Edge Config** | `@vercel/edge-config` for low-latency reads without redeploying. |
| File / image uploads | **Vercel Blob** | `@vercel/blob` with client upload tokens or server uploads. (Or R2 if on Cloudflare). |
| Image optimization | `next/image` | Native automatic edge optimization. |
| Database connection pooling | Provider pooled URL + `attachDatabasePool` | Use the provider's pooled connection string (e.g. Neon `-pooler` host, `sslmode=require`). For a module-level `pg`/`mysql2`/`ioredis` pool on Fluid compute, call `attachDatabasePool(pool)` from `@vercel/functions` right after creating it so idle clients are released before suspension. |

- **Config file:** `vercel.ts` (typed, `export const config: VercelConfig` from `@vercel/config/v1`; `.js/.mjs/.cjs/.mts` also accepted) or `vercel.json` — only one per project, never both. `vercel.ts` runs at build time. Source: https://vercel.com/docs/project-configuration/vercel-ts (accessed 2026-10-02).

### Fluid compute facts (verify against the linked docs; accessed 2026-10-02)
- Default for new projects since 2025-04-23; toggle per project in Settings → Functions, or per deployment with `"fluid": true`. Multiple invocations share one instance (Node.js/Python), so module-level mutable state leaks across requests — keep no per-user sessions or caches in process memory. https://vercel.com/docs/fluid-compute
- Duration (Node.js/Bun/Python): Hobby 300s default and max; Pro/Enterprise 300s default, 800s max, 1800s extended max in beta (per-function `maxDuration` only). Timeout returns 504 `FUNCTION_INVOCATION_TIMEOUT`. Precedence: function code > `vercel.json` > dashboard > Fluid defaults.
- Memory/CPU: 2 GB / 1 vCPU default; Pro/Enterprise can pick 4 GB / 2 vCPU in the dashboard (Function CPU). `memory` in `vercel.json` is not honoured (build warning). https://vercel.com/docs/functions/configuring-functions/memory
- Request **and** response body max 4.5 MB (413 `FUNCTION_PAYLOAD_TOO_LARGE`) — route large uploads directly to Blob/object storage with client tokens. Bundle 250 MB uncompressed (500 MB Python; up to 5 GB with large functions beta). 1,024 file descriptors shared across concurrent invocations. https://vercel.com/docs/functions/limitations
- Billing: Active CPU (I/O wait not counted) + provisioned memory time + invocations. https://vercel.com/docs/functions/usage-and-pricing
- Node.js: 24.x (default), 22.x, 20.x; `engines.node` in `package.json` overrides the project setting. Node 20 deprecation was announced for 2026-10-01 — check the project's version and upgrade. https://vercel.com/docs/functions/runtimes/node-js/node-js-versions

### Vercel Cron Security Invariant
Every cron route handler (`app/api/cron/.../route.ts`) must enforce authentication:
```ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  // Guard the unset case: otherwise a literal "Bearer undefined" header passes.
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  // Cron work here...
  return NextResponse.json({ ok: true });
}
```
- Delivery is best effort: Vercel does **not retry** failed runs, may skip a run, and may deliver the same run twice; overlapping runs are possible when a job outlasts its interval. Make cron work idempotent and reconciliation-based, plus a lock when overlap matters.
- Crons do not follow redirects; Hobby crons run at most once per day, anywhere within the scheduled hour. Instant Rollback also reverts cron definitions. Source: https://vercel.com/docs/cron-jobs/manage-cron-jobs (accessed 2026-10-02).

## Verification & Delivery Runbook

1. **Local Build First:** Run `npm run build` locally before triggering any deployment. It catches static typing, route segment errors, and bundle issues faster than remote build logs.
2. **Deploy as Preview First:** Deploy with `vercel deploy -y --no-wait`.
3. **Inspect Remote Build:** Run `vercel inspect <deployment-url> --wait` to confirm status is `READY`.
4. **Smoke Check:** Open the preview URL or run `curl -fsS -I <deployment-url>` to verify HTTP 200 response and proper headers. For a protected preview use `vercel curl /path --deployment <deployment-url>` — never disable Deployment Protection.
5. **Production Promotion:** Only promote to production (`--prod` or merging to `main`) after verifying the preview URL and receiving explicit user approval.

## Anti-patterns

- Deploying to production (`--prod`) without user approval.
- Passing sensitive tokens via `--token <secret>` in terminal commands.
- Silently linking unlinked directories with bare `vercel link`, or running `vercel project inspect` without `--non-interactive`.
- Piping a secret with `echo` into `vercel env add` (shell history); disabling Deployment Protection to test a preview.
- Modifying files inside `.vercel/` manually (let the CLI manage them).
- Pointing preview environments to production databases or payment gateways.
- Scraping or load-testing deployment URLs when a simple inspection suffices.
- Storing state or long-running async background work in serverless functions (respect timeouts; use queues/crons).

---
name: vercel
description: Deploy, configure, inspect, and manage applications and edge infrastructure on Vercel using Vercel CLI and git integration. Use when deploying Next.js/web projects to Vercel, linking repositories, running preview or production deployments, managing environment variables, configuring custom domains, inspecting build/runtime logs, or managing edge configs and crons. Enforces the strict Production Approval Gate.
---

# Vercel Platform & Deployment

Deploy, manage, and inspect web applications and edge infrastructure on Vercel. Standardize deployment workflows across Claude Code, Antigravity, Codex, OMP, and Pi.

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
vercel project inspect --non-interactive
```

**Guardrail:** Always pass `--non-interactive` to `vercel project inspect` — the bare command can prompt or enter a linking flow; with the flag it only resolves existing context. Stop on `link_required` or an owner/project mismatch and ask; never auto-link. Never run bare interactive `vercel link` in an unlinked directory. Being inside an app subdirectory is not proof of the target project (a non-interactive repo link can fall back to the sole configured project).

## Step 2: Project Linking

Vercel supports two linking models:

### A. Repository-Based Linking (Preferred)
When a git remote exists, connect via repo linking:
```bash
vercel link --repo --scope <team-slug> -y
```
- Creates `.vercel/repo.json` containing `orgId`, `remoteName`, and directory mapping.
- Much more reliable than directory-name linking: it matches the git remote URL and correctly handles monorepos or mismatched folder names.

### B. Single-Project Linking
When no git remote exists:
```bash
vercel link --scope <team-slug> -y
```
- Creates `.vercel/project.json` with `projectId` and `orgId`.

## Step 3: Deployment Workflows

### 1. Preview Deployment (Standard CLI)
Run non-blocking deployments so the terminal returns immediately with the URL:
```bash
vercel deploy -y --no-wait --scope <team-slug>
```
Follow up immediately by inspecting status:
```bash
vercel inspect <deployment-url>
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
- `--type config|secret` needs CLI 59.6+ (older: `--sensitive` / `--no-sensitive`). `NEXT_PUBLIC_*`/`VITE_*` are always Config.
- Production and Preview **Secrets are never returned by `vercel env pull`** — a missing value locally is expected, not a bug; re-pull after adding/rotating.
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

# View real-time runtime request logs (snapshot without streaming)
vercel logs <deployment-url> --no-follow

# Stream runtime logs live
vercel logs <deployment-url>
```

**Cache debugging:** `curl -sSI <url> | grep -iE 'x-vercel-cache|x-matched-path|cache-control|vary|age|set-cookie'` gives the outcome (`HIT`/`MISS`/`STALE`/`BYPASS`/…); a `set-cookie` response forces `BYPASS`. The finer `cacheReason` (e.g. `draft_mode`, `crawler`, `stale_error`) is read from `vercel logs` or the dashboard Logs "Reason" row — the `x-vercel-cache-reason` header is internal and not visible via `curl`.

## Native Platform Services (`native-first`)

| Need | Vercel Native Solution | Implementation Pattern |
|---|---|---|
| Scheduled cron jobs | **Vercel Cron** | Define `crons` in `vercel.json` pointing to a Route Handler. Secure with `CRON_SECRET` header check. |
| Feature flags & dynamic config | **Edge Config** | `@vercel/edge-config` for sub-millisecond reads without redeploying. |
| File / image uploads | **Vercel Blob** | `@vercel/blob` with client upload tokens or server uploads. (Or R2 if on Cloudflare). |
| Image optimization | `next/image` | Native automatic edge optimization. |
| Database connection pooling | **Neon Serverless** | Use pooled connection string (`?sslmode=require`), never unpooled direct TCP. |

- **Config file:** `vercel.ts` (typed, via `@vercel/config`) or `vercel.json` — only one per project, never both.
- **Fluid Compute (default):** `memory` in `vercel.json` is not honoured (build warns); set Function CPU in the dashboard. Keep no sessions or caches in process memory.

### Vercel Cron Security Invariant
Every cron route handler (`app/api/cron/.../route.ts`) must enforce authentication:
```ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  // Cron work here...
  return NextResponse.json({ ok: true });
}
```

## Verification & Delivery Runbook

1. **Local Build First:** Run `npm run build` locally before triggering any deployment. It catches static typing, route segment errors, and bundle issues faster than remote build logs.
2. **Deploy as Preview First:** Deploy with `vercel deploy -y --no-wait`.
3. **Inspect Remote Build:** Run `vercel inspect <deployment-url>` to confirm status is `READY`.
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

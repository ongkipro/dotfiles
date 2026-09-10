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
# 1. Check CLI availability and auth status (safe in any directory)
vercel whoami 2>/dev/null

# 2. Check git remote
git remote get-url origin 2>/dev/null

# 3. Check existing project linkage (either file indicates linked state)
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null

# 4. List available teams (when authenticated)
vercel teams list --format json 2>/dev/null
```

**Guardrail:** Do NOT run `vercel project inspect` or bare interactive `vercel link` in an unlinked directory — they block waiting for interactive input or silently link with defaults.

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

## Environment Variables Management

Manage environment variables through the CLI without opening the dashboard:

```bash
# List environment variables
vercel env ls --scope <team-slug>

# Add environment variable (production only)
echo "secret_value" | vercel env add VAR_NAME production --scope <team-slug>

# Add variable for preview and development
echo "preview_value" | vercel env add VAR_NAME preview --scope <team-slug>
echo "dev_value" | vercel env add VAR_NAME development --scope <team-slug>

# Pull variables to local .env.local for development
vercel env pull .env.local --scope <team-slug>

# Remove variable (confirm with user first)
vercel env rm VAR_NAME production --scope <team-slug> -y
```

**Discipline:**
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

## Native Platform Services (`native-first`)

| Need | Vercel Native Solution | Implementation Pattern |
|---|---|---|
| Scheduled cron jobs | **Vercel Cron** | Define `crons` in `vercel.json` pointing to a Route Handler. Secure with `CRON_SECRET` header check. |
| Feature flags & dynamic config | **Edge Config** | `@vercel/edge-config` for sub-millisecond reads without redeploying. |
| File / image uploads | **Vercel Blob** | `@vercel/blob` with client upload tokens or server uploads. (Or R2 if on Cloudflare). |
| Image optimization | `next/image` | Native automatic edge optimization. |
| Database connection pooling | **Neon Serverless** | Use pooled connection string (`?sslmode=require`), never unpooled direct TCP. |

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
4. **Smoke Check:** Open the preview URL or run `curl -fsS -I <deployment-url>` to verify HTTP 200 response and proper headers.
5. **Production Promotion:** Only promote to production (`--prod` or merging to `main`) after verifying the preview URL and receiving explicit user approval.

## Anti-patterns

- Deploying to production (`--prod`) without user approval.
- Passing sensitive tokens via `--token <secret>` in terminal commands.
- Silently linking unlinked directories with bare `vercel link`.
- Modifying files inside `.vercel/` manually (let the CLI manage them).
- Pointing preview environments to production databases or payment gateways.
- Scraping or load-testing deployment URLs when a simple inspection suffices.
- Storing state or long-running async background work in serverless functions (respect timeouts; use queues/crons).

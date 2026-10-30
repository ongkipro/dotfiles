---
name: vercel
description: >-
  Deploy, configure, inspect, and manage Vercel projects via the CLI and git integration: linking, preview/production deploys, env vars, domains, logs, edge config, crons. Not Next.js code (nextjs-development), Actions YAML (github-actions), or VPS.
---

# Vercel

`vercel --version` first. Commands and flags in
[cli-runbook.md](references/cli-runbook.md) were checked against CLI 62.7.0;
the local `--help` and https://vercel.com/docs/cli win when they differ.
Vercel's own agent plugin and `vercel-labs/agent-skills` exist; this skill's
gates apply when they conflict.

Hand-offs: Next.js code → `nextjs-development`; CI workflows →
`github-actions`; VPS alternative → `vps-deploy`; Cloudflare → `cloudflare`;
dependency/feature choice → `native-first`.

Read only this file up front; open the runbook section the step names.

**Pick the path first:**
- Inspect / logs / status → §1 → runbook "Logs & Observability".
- Preview deploy of a linked project → §1 → §2 → runbook "Deployment".
- First link or new project → §1 → confirm team + project with the user →
  runbook "Project Linking".
- Env vars, domains, crons, Edge Config, Blob → §1 → matching runbook section.
- Production, promote, rollback → §1 → §2 → explicit approval → runbook
  "Staged Production".

## 1. Inspect first (non-interactive)

`vercel whoami --format json`; `git remote get-url origin`; the existing
`.vercel/project.json` or `.vercel/repo.json`; then
`vercel project inspect --non-interactive --format json` before any
consequential read or mutation. Stop on `link_required` or an owner/project
mismatch and ask; never auto-link, never run bare `vercel link` in an
unlinked directory. Being inside an app subdirectory is not proof of the
target project.

## 2. Gates specific to this tool

- **Production is a live action** (`--prod`, `promote`, `rollback`, or a
  push to a branch with production git integration): explicit approval per
  CORE, every time. Preview by default; hand the preview URL to the user.
- **Promote a staged production build, not a preview** — promoting a preview
  rebuilds it with production env vars, so the tested build is not the one
  released. `rollback` turns off auto-assignment until the next `promote`;
  say so.
- **Token never in a flag.** `secrets-env run -- vercel …`; never `--token`,
  never `echo` a secret into `vercel env add`, never print `.vercel/*.json`
  or `.env` contents.
- **Deployment Protection stays on.** Test a protected preview with
  `vercel curl /path --deployment <url>`.
- **Destructive**: `vercel project rm`, `vercel rm`, `vercel env rm` — stop
  and confirm.
- `.vercel/` is CLI-managed; do not hand-edit it.

## 3. Verify before promotion

1. Local build (`npm run build` or the project script) before any deploy.
2. `vercel deploy -y --no-wait` → `vercel inspect <url> --wait` until
   `READY` (`--wait` exits 124 at its timeout: still building, not failed).
3. Smoke: `curl -fsS -I <url>` or the protected-preview `vercel curl`;
   browser-visible changes go through `ui-validation`.
4. Only then production, with approval.

Previews never point at production databases or payment gateways; serverless
functions hold no state or long background work (queues/crons instead).

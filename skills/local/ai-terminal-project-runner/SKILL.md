---
name: ai-terminal-project-runner
description: Development workflow governor for fantastico's Linux AI terminal setup. Use whenever the user asks to cek project, analisa project/codebase, debug terminal/build, benerin error, jalankan validasi, inspect repo, coordinate Pi.dev/Claude/Codex/AGY/9router, route to the right skill, or safely manage Astro, Cloudflare/Wrangler, Shopify, Node/pnpm, browser preview, or local development work.
---

# AI Terminal Project Runner

Use this skill as the default operating layer for local development work on fantastico's Linux machine. It coordinates the available AI CLIs, applies the user's memory/rules, routes to domain skills, and prevents risky actions from running just because a CLI permission allows them.

## Core rule

**Permission allowed is not user approval.** Claude, Codex, Pi, and AGY may have broad shell permissions; still stop before destructive, production, credential, billing/customer-data, or hard-to-reverse actions.

Prefer concrete local evidence over assumptions. Inspect the actual project/config before advising or editing.

## First-run protocol for development tasks

1. Read relevant durable context before acting:
   - `~/.config/ai/memory/preferences.md` for user preferences.
   - `~/.config/ai/memory/workflow.md` for workflow conventions.
   - `~/.config/ai/memory/environment.md` when tools, commands, install, models, or providers matter.
   - `~/.config/ai/memory/projects.md` when inside or discussing a known project.
2. Inspect the current/project directory before editing:
   - `pwd`
   - `git status --short` if it is a Git repo.
   - Look for `AGENTS.md`, `CLAUDE.md`, package manager lockfiles, `package.json`, framework configs, `wrangler.toml/jsonc`, Shopify TOML, test configs.
   - Use `scripts/inspect_project.sh` from this skill when a quick structured scan helps.
3. Classify the task mode and stack.
4. Route to more specific skills/toolkits when applicable.
5. Execute the smallest safe change.
6. Validate using project-native scripts/config.
7. Report clearly and update memory only for durable, non-secret facts.

## Operating modes

Choose one before action:

- `analyze-only`: inspect and explain; do not edit.
- `plan-only`: produce implementation plan; do not edit.
- `edit-mode`: modify relevant files and validate.
- `debug-mode`: reproduce/read failure, patch minimal cause, rerun validation.
- `build-mode`: run setup/build/dev/preview commands safely.
- `refactor-mode`: restructure only within explicit scope.
- `deploy-mode`: production/live actions require explicit user approval.

When uncertain, choose the safer mode and ask.

## Runner map

- **Pi.dev**: primary local terminal runner for project inspection, file edits, commands, browser/web tools, and longer development workflows. Pi currently routes through 9router; if provider/model matters, inspect `~/.pi/agent/settings.json` rather than assuming.
- **Claude Code**: use for architecture, long-context reasoning, docs, plans, and complex refactor design. Broad permissions do not imply approval for risky commands.
- **Codex**: use for focused code patches, independent code review, tight debugging, and second-opinion implementation checks. Prefer local evidence and project-scoped auth isolation.
- **AGY / Antigravity / Gemini**: use for visual/local workflows, artifacts, quick alternate review, and preview-style tasks. Treat as high power/high risk because local config allows broad access and always-proceed behavior.
- **9router**: AI gateway/integration layer for chat, model discovery, web search/fetch, embeddings, image, TTS, and STT. Do not print keys; route to `9router-*` skills for exact API use.
- **agent_browser**: preferred browser automation for localhost preview, screenshots, QA, visual checks, docs browsing, and web interactions.

## Domain routing

Use this skill to route, not to replace domain skills.

- Cloudflare Workers, Wrangler, Hono, D1, KV, R2, Durable Objects, Queues, bindings, `wrangler.jsonc/toml`, deploy-to-Cloudflare intents → use `cloudflare-worker-toolkit` and relevant Pi Cloudflare skills (`cloudflare`, `wrangler`, `workers-best-practices`, `durable-objects`, etc.). Read `/home/fantastico/.ai/cloudflare-worker-toolkit/` docs before architecture decisions.
- Astro sites/apps, pages/components, content collections, Tailwind in Astro, static/server rendering, SEO/content sites → use `astro-development`.
- Shopify app/dev work, Shopify CLI app flows, extensions, Hydrogen, Functions, Liquid theme code, Admin/Storefront GraphQL, `shopify.app.toml`, `shopify.extension.toml` → use `shopify-ai-toolkit-router` or official Shopify plugin when active.
- Shopify store operations/listings/content/products → use `shopify-listing`, `shopify-products`, `shopify-content`, or `shopify-setup`; do not route listing/content work to app-dev tooling.
- 9router setup/model/API/search/fetch/media tasks → use `9router` plus the specific capability skill (`9router-chat`, `9router-web-search`, `9router-web-fetch`, etc.).
- React/Tailwind/shadcn/performance → use `react-patterns`, `tailwind-theme-builder`, `shadcn-ui`, or `web-perf` as applicable.
- Tests/test infra → use `vitest` when the project uses or should use Vitest.
- Visual QA/responsive/UX/design review → use `agent_browser` with `design-review`, `ux-audit`, or `responsiveness-check` as applicable.
- Git cleanup/PR/release → use `git-workflow` or `github-release`.
- Project docs/health/roadmap → use `project-docs`, `project-health`, or `roadmap`.

## Local development defaults

- Terminal-first. Use existing CLI tools: `rg`, `fd`, `eza`, `bat`, `hx`, `lg`.
- Do not recommend VSCode unless the user asks.
- For web preview: run the project dev server in terminal and open Chromium/agent_browser to `localhost`.
- Detect package manager from lockfiles and existing scripts. Prefer `pnpm` only when the project already uses it or no project convention conflicts.
- Never install before checking `command -v`, `package.json`, lockfiles, and existing docs.
- Install policy: CLI/language tools via `mise use -g`, Node globals via `npm i -g`, Python apps via `pipx`; `sudo` only for system packages and only with approval.
- Do not auto-commit. User prefers lazygit (`lg`) for commits.

## Stop and approval gates

Stop and ask/report before continuing when any of these apply:

- Secrets/credentials/API keys/tokens/passwords, `.env` contents, auth sessions, payment/billing/customer data.
- Destructive commands: `rm -rf`, `git reset --hard`, `git clean -fd`, mass `mv/rm`, database destructive migrations, wiping caches/data that may matter.
- System-wide/admin changes: `sudo`, apt/snap installs, service changes.
- Production/live actions: `wrangler deploy`, live Shopify theme push, app deploy, DNS changes, publish/release commands, remote database writes, bulk Shopify mutations.
- Git status shows unrelated uncommitted changes that your task would overlap.
- Change scope expands beyond the request or touches many unrelated files.
- 9router route/model/auth/input/output is unclear.

Safe detection of secrets is allowed (`fd '^\.env' -H -t f`), but never print secret file contents or store credentials in memory.

## Project inspection checklist

Use the bundled script when useful:

```bash
~/.agents/skills/ai-terminal-project-runner/scripts/inspect_project.sh
```

Manual minimum:

```bash
pwd
git status --short 2>/dev/null || true
fd '^(AGENTS|CLAUDE)\.md$|package\.json|pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb|astro\.config\.|vite\.config\.|wrangler\.(jsonc|toml)|shopify\..*toml|tsconfig\.json|vitest\.config\.' -H -t f -d 3
```

Then read only relevant files. Do not dump huge files or secret files.

## Validation policy

Prefer project-native validation:

1. Inspect `package.json` scripts before choosing commands.
2. Use the smallest relevant validation first: typecheck, lint, unit test, build, framework check.
3. For Cloudflare binding/config changes, consider `wrangler types` and config sanity before deploy.
4. For Astro, prefer build/check scripts if present.
5. For browser-visible changes, use localhost preview + agent_browser screenshot/QA when needed.
6. If validation cannot run, say why and list exact manual follow-up.

## Memory policy

Update `~/.config/ai/memory/` only for durable facts that help future sessions, not temporary task details. Never store secrets/tokens. Avoid duplicates; update or correct existing facts when needed. After important memory/dotfiles changes, remind the user to commit `~/dotfiles` unless they asked you to do it.

## Final report

Keep final answers concise. For development work, end with:

```text
Result:
- Mode:
- Runner/skills:
- Project/stack:
- Changed files:
- Commands run:
- Validation:
- Risks/notes:
- Next:
```

If no files changed, say so explicitly.

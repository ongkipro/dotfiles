# Memory: Workflow & conventions
> Part of shared memory.

- Terminal-first: edit with `hx`, manage Git with `lg`, multiplex with `tmux`,
  and keep OMP as the primary AI control plane. Claude, Codex, Antigravity, and
  Pi are optional standalone handoffs.
- Web preview: run the dev server (`npm run dev` / `shopify theme dev` / `wrangler dev`) then open Chromium to `localhost:<port>` (auto live-reload).
- Use modern tools: `rg` (not grep), `fd` (not find), `eza` (not ls), `bat` (not cat), `z` zoxide (not manual cd).
- Git: quick commit via lazygit; backup = push to remote; DO NOT auto-commit (anti-pattern).
- Dotfiles sync: when there's an update on GitHub (`ongkipro/dotfiles`), pull and deploy locally (especially memory `~/.config/ai/memory/`). Conversely, when there are local changes in `~/dotfiles` that need saving, commit + push to GitHub. Be precise — don't break existing patterns.
- `dotpush ["message"]` = broad explicit fast path: enable driver → refresh machine snapshot → security-check → commit → **fetch+merge remote first (anti-divergence)** → push. Non-snapshot conflict stops for manual resolution. Prefer `lg` for mixed worktrees. `dotsync` with no arguments is read-only `status`; mutating variants require an explicit `commit`, `sync`, `push`, or `pull` verb.
- Machine-specific snapshot files (`home/gitconfig`, `home/bashrc.snapshot`, `home/zshrc.snapshot`, `config/mise-config.toml`, `config/vscode-settings.json`) are marked `merge=ours` in `.gitattributes` → on sync always keep the local machine's version (needs `git config merge.ours.driver true`, set automatically by dotpush + install scripts).
- VSCode optional, not mandatory — don't suggest it unless asked.
- Shopify dev routing: **the official Shopify AI Toolkit is NOT installed** in Claude (verified 2026-07-14 — the only marketplace present is `claude-plugins-official`). The repo map is at `~/dotfiles/docs/shopify-ai-development-repos.md`. Don't clone Shopify support repos (dawn/horizon/hydrogen/cli/liquid/theme-liquid-docs) as duplicate skills; just reference the links unless asked to inspect/base on them.
- Kelola exception: after completing any task in the Kelola repository, commit only the files changed for that task, push to `dev`, wait until the dev PM2 restart count increases, then exercise the changed flow on `dev.kelolatim.com`. Never include unrelated worktree changes. Push or merge to `main` only when explicitly requested.

## Long tasks, debugging, and security

- For work spanning turns, agents, or machines, persist the executable queue in repository `TASKS.md` and verified implementation evidence in `BUILD-LOG.md`; OMP `task`/`hub` state is transient coordination, never project truth.
- Checkpoint only at durable boundaries. Keep one runnable next action, verify specialist output in the parent session, and never mark work done from a returned job or green build alone.
- Debug from a deterministic reproduction to the earliest state divergence. Use LSP symbol navigation before text guessing and `xd://debug` when stack or runtime state is the missing evidence; fix the owning boundary and re-run the reproduction.
- Keep always-loaded prompts concise, use progressive disclosure, prefer surgical minimal diffs and YAGNI, isolate secrets, and preserve approval/non-destructive gates.
- Full protocol: [long-task-system.md](long-task-system.md). Runtime health: `ai-doctor` diagnoses; follow its narrow repair instruction and re-run the check rather than weakening a gate.

## Skills — plumbing (verified 2026-07-14)
- **Single source**: `~/dotfiles/skills/local/`. Consumers via SYMLINK: `~/.claude/skills`, `~/.pi/agent/skills`, and `~/.omp/agent/skills` (all → `dotfiles/skills/local`), plus `~/.agents/local-skills`.
- ⚠️ **`~/.gemini/skills` DOES NOT EXIST** — Gemini CLI was removed (2026-07-13). Don't make it a sync target again. (`~/.gemini/` itself IS still kept: it contains `GEMINI.md` → AGENTS.md, read by Antigravity.)
- `skill-*` scripts are in `~/dotfiles/skills/agents-bin/`, linked into `~/.agents/bin/`.
- On macOS: `skill-update` needs bash 5+ (brew) and BSD `find` compatibility (already patched).
- SEO: use the `seo-website-builder` skill (self-contained, has a full `references/`). ⚠️ The old corpora `~/Documents/seo-research-google/` and `~/Documents/SEO/` DO NOT EXIST — don't look for them. Don't claim secret Google algorithm knowledge.
- Cloudflare and Shopify workflows come from active skills plus current official documentation. Do not restore the deleted `ai-toolkits/` router layer or the old `~/.ai/...` paths.
- GitHub architecture references (harvested 2026-08-13): production patterns from pulled reference repos live in skill `references/` directories — `admin-dashboard` has `github-admin-patterns.md` and `next-shadcn-starter-patterns.md` (TanStack Table v9, Refine, Payload CMS, Medusa Admin, kbar, Clerk, next-shadcn-dashboard-starter); `storefront-development` has `next-commerce-patterns.md` (Next Commerce cart/checkout/catalog architecture). Load via the owning skill, not standalone.

## Folder structure

### `~/Projects/` — Coding
All development projects: web app, SaaS, Shopify, bots, etc. (Created 2026-07-14 on `cuan`; before that this convention was written in memory but the folder never actually existed.)

## Auto-Routing — the AI CLI knows where to put things

**Without being told**, the AI should auto-save to these folders:

| Output | Path |
|---|---|
| PRD, task breakdown, planning | `~/Documents/work/prd/` |
| Research, SEO, competitor analysis | `~/Documents/work/research/` |
| Copywriting, blog, ads, script | `~/Documents/work/content/` |
| Draft, ideas, free-form notes | `~/Documents/work/notes/` |
| Project source code | `~/Projects/<name>/` |

**Filename:** `YYYY-MM-DD - title.md`

> ⚠️ **`~/Documents/work/notes/` is practically DEAD for session logs** (verified 2026-07-20 on Mac: it holds only 2 files, the newest **2026-07-12**, plus the archive folder `projects-md-archive-2026-07-14/`). Real session logs now live in **`BUILD-LOG.md` / `WORKLOG.md` per-repo**, next to the code. Don't assume the "write session notes to `notes/`" convention still runs — for work tied to a repo, write it in that repo. `notes/` is left for loose drafts/ideas that have no repo. Check: `ls -la ~/Documents/work/notes/`.

**Rule:** DO NOT put files directly in `~/Documents/`. Always into a `work/` subfolder. The AI should report the file path at the end of its response.

```
~/Documents/
└── work/
    ├── prd/          ← planning & spec
    ├── research/     ← research & analysis
    ├── content/      ← writing & copy
    └── notes/        ← drafts & ideas

~/Projects/              ← source code
~/.config/ai/memory/     ← memory AI (symlink → dotfiles/config/ai/memory)
```

> ⚠️ **AI memory only exists in `~/.config/ai/memory/`.** The legacy `~/dotfiles/memori-ai/` directory was removed; `~/Documents/memori ai/` does not exist. Do not recreate either path.

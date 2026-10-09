# Memory: Workflow & conventions
> Part of shared memory.

- Terminal-first: edit with `hx`, manage Git with `lg`, multiplex with `tmux`,
  and keep OMP as the primary AI control plane. Claude, Codex, Antigravity, and
  Pi are optional standalone handoffs.
- Directing another AI terminal (e.g. `agy` in a tmux pane): act as the lead senior developer and write prompts as direct technical instructions. Do not prefix them with "from Claude", "on behalf of Paduka", or similar attribution. Keep reviews and specs in neutral engineering voice. **Why:** Paduka Ongki wants the AI to replace him as the professional who drives the worker, not to relay messages. The prompts stay visible in the shared tmux pane.
- Web preview: run the dev server (`npm run dev` / `shopify theme dev` / `wrangler dev`) then open Chromium to `localhost:<port>` (auto live-reload).
- **Order is: run dev → review → only then present.** Never report a server as "running" or hand over a URL from a listening port or an HTTP status code alone. Open the actual `localhost`/IP and confirm the page RENDERS — real content, expected heading, no client-side error. A 200 with a blank or broken shell, a stale Turbopack chunk, or a server bound to the wrong interface all look healthy at the status-code layer. **Why:** reporting "it's ready" on a page that does not render wastes the user's trip to the browser and hides the failure until they find it. A status code proves the process answered; it does not prove the thing works.
- Use modern tools: `rg` (not grep), `fd` (not find), `eza` (not ls), `bat` (not cat), `z` zoxide (not manual cd).
- Git: quick commit via lazygit; backup = push to remote; DO NOT auto-commit (anti-pattern).
- Git workflow (moved from the former always-loaded AGENTS.md, 2026-09-15): `git pull --ff-only` → `git status --short` → `lg`. From an AI tool shell invoke `lazygit` directly (`lg` is an interactive-shell alias) and only with a real TTY. Prefer plain non-interactive Git for deterministic automation. `dotsync status`, `dotsync doctor`, and `security-check` read without intentionally changing tracked content but are not a strict zero-write audit.
- Dotfiles sync: when there's an update on GitHub (`ongkipro/dotfiles`), pull and deploy locally (especially memory `~/.config/ai/memory/`). Conversely, commit + push local changes only when the user explicitly requests those Git actions. Be precise — don't break existing patterns.
- `dotpush ["message"]` = broad explicit fast path: enable driver → refresh machine snapshot → security-check → commit → **fetch+merge remote first (anti-divergence)** → push. Non-snapshot conflict stops for manual resolution. Prefer `lg` for mixed worktrees. `dotsync` with no arguments is read-only `status`; mutating variants require an explicit `commit`, `sync`, `push`, or `pull` verb.
- Machine-specific snapshot files (`home/gitconfig`, `home/bashrc.snapshot`, `home/zshrc.snapshot`, `config/mise-config.toml`, `config/vscode-settings.json`) are marked `merge=ours` in `.gitattributes` → on sync always keep the local machine's version (needs `git config merge.ours.driver true`, set automatically by dotpush + install scripts).
- VSCode optional, not mandatory — don't suggest it unless asked.
- Shopify dev routing: use the active owned skills and current official documentation. Plugin installation is runtime/device-local; inspect it when relevant instead of trusting an old installed-plugin snapshot. Do not clone support repositories as duplicate skills.
- Kelola development delivery has a repository-specific `dev` verification workflow. Read its current repository contract and `kelola-deploy` when relevant; this memory does not independently authorize commit, push, restart, or deployment. Follow any applicable explicit authorization, and never include unrelated changes.


## Long tasks, debugging, and security

- For work spanning turns, agents, or machines, persist the executable queue in repository `TASKS.md` and verified implementation evidence in `BUILD-LOG.md`; OMP `task`/`hub` state is transient coordination, never project truth.
- Checkpoint only at durable boundaries. Keep one runnable next action, verify specialist output in the parent session, and never mark work done from a returned job or green build alone.
- **Verify a stated premise before building on it**, including one the user states as fact. A request framed as "IDs must be min 5 characters" was implemented as padding; neither Google's nor Meta's spec has a minimum length, and the padding itself became the mismatch. Check the vendor spec first, then say plainly which part of the premise held and which did not.
- **Test the two halves against each other, never each against its own fixture.** A producer checked against fixture A and a consumer checked against fixture B both stay green while they disagree with each other — that is how a catalog feed published `10001`, the pixel sent `1`, and the admin showed a third value, with a full suite passing. Where two surfaces must agree byte-for-byte, assert the agreement itself, then mutation-verify by breaking one side.
- **A gate that is never reached is not a gate.** Authorization built correctly can still be bypassed by whatever runs before it: framework path normalization, a proxy rewrite, a route that returns early. Probe the real deployed artifact with hostile inputs, not the unit under test.
- Debug from a deterministic reproduction to the earliest state divergence. Use LSP symbol navigation before text guessing and `xd://debug` when stack or runtime state is the missing evidence; fix the owning boundary and re-run the reproduction.
- Keep always-loaded prompts concise, use progressive disclosure, prefer surgical minimal diffs and YAGNI, isolate secrets, and preserve approval/non-destructive gates.
- Full protocol: [long-task-system.md](long-task-system.md). Runtime health: `ai-doctor` diagnoses; follow its narrow repair instruction and re-run the check rather than weakening a gate.

## Skills and runtime discovery

[Shared AI context](../README.md) owns runtime wiring;
[skill plumbing](../project-memory/skill-plumbing.md) provides the narrow reference.
The generated [skill map](../../../skills/local/README.md) owns the inventory and
capability routing. Use `skill-update` after source additions/removals and
`ai-doctor` to check links. Do not recreate deleted router layers or duplicate
skill sources from a historical setup note.

## Folder structure

### `~/Projects/` — Coding
All development projects: web app, SaaS, Shopify, bots, etc. (Created 2026-07-14 on `cuan`; before that this convention was written in memory but the folder never actually existed.)

## Auto-Routing — the AI CLI knows where to put things

**Without being told**, the AI should auto-save to these folders. This table is a personal routing preference, not a competing source of truth: `config/ai/policies/planning-artifacts.md` owns the binding lifecycle contract — pre-development staging under `~/Documents/work/prd/<slug>/` is mandatory before `~/Projects/<slug>/` exists, `project-init --from-docs` promotes the accepted set into the repository, and the repository copy is canonical from that point. Never treat a `~/Documents/` copy as authoritative after promotion.

| Output | Path |
|---|---|
| PRD, task breakdown, planning | `~/Documents/work/prd/<slug>/` |
| Research, SEO, competitor analysis | `~/Documents/work/research/` |
| Copywriting, blog, ads, script | `~/Documents/work/content/` |
| Draft, ideas, free-form notes | `~/Documents/work/notes/` |
| Project source code | `~/Projects/<slug>/` |

**Filename:** `YYYY-MM-DD - title.md`

> Session progress belongs in repository task/status/evidence owners. The notes
> folder is for drafts; do not infer its activity or contents from an old device
> snapshot.


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

> Shared durable memory lives in `~/.config/ai/memory/`; narrow project reference
> lives in `~/.config/ai/project-memory/`; device-only facts live in `~/.config/ai-local/`.
> Repository execution truth stays in each repository. Do not recreate legacy
> `memori-ai` stores.

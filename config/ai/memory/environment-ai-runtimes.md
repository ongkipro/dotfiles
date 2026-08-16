# Memory: AI runtime environment

> Detailed shared reference for OMP, 9Router, optional Pi, and Antigravity. Machine-local availability and service state must be verified on the relevant device. See [environment.md](environment.md) for the compact environment index.

## OMP, optional Pi, and 9Router
> Runtime installation, active models, provider availability, and service state
> are machine-local. Verify them from the relevant machine instead of recording
> a current snapshot here.

- OMP is the only primary control plane. Its tracked configuration lives under
  `config/omp/`; Pi state is not an OMP configuration or credential source.
- **Aspirational Routing vs Device Reality:** OMP's `config/omp/config.yml` defines the *ideal* orchestration (e.g., assigning `claude-opus-5:max` for `advisor-max`). However, **actual model availability is device-local**, governed by what is registered in `models.yml` and the provider's active API keys. If a requested model (like Opus 5) is absent on a specific device, OMP degrades to the highest available fallback (e.g., Opus 4.6 or Codex Sol). Do not assume all models in `config.yml` are physically available on every machine.
- Pi is optional. When it is installed, inspect its own settings and models only
  for a direct Pi session. Its custom compaction extension is a Pi-only fallback.
- `bin/pi-9router-restore` is an explicitly invoked optional adapter for Pi
  settings, compaction, and remote-catalog sync. It does not install or start a
  local gateway.
- The optional remote credential is
  `~/.config/ai-local/credentials/9router-remote-key`. It is never tracked or
  globally exported; the `omp()` shell wrapper injects it only into the OMP
  child when `NINEROUTER_REMOTE_KEY` is not already set.
- `9router-credential-migrate` may copy a legacy key from Pi auth only when
  explicitly invoked. It does not print the value, delete the source, or
  overwrite an existing neutral credential.
- Image generation belongs to the runtime-neutral `9router` skill/API, not a Pi
  image package.
- 9Router is remote-only in the supported dotfiles topology. OMP and optional Pi
  target the authenticated tunnel declared in their tracked provider configs.
- A local `9router` npm package, `9router.service`, port 20128 gateway, local
  provider database, and local model-sync dependency are deliberately absent.
  Do not reinstall or recreate them as part of generic setup.
- Verify tunnel availability with its unauthenticated `/api/health` endpoint.
  Catalog or inference verification requires the machine-local remote key; use
  the existing wrappers/helpers without printing the credential.
- Native Claude Code, Codex, and Antigravity remain independent runtimes; do not
  redirect them through 9Router based on this memory.
**Claude Code profile:** one native profile at `~/.claude`; run the installed `claude` binary directly. Do not add personal/work launchers or alternate config-directory profiles.

## AI CLI availability
- CLI installation and login state are machine-local. Check `command -v` and
  each runtime's native status before use. Pi is optional; its absence does not
  affect OMP.
- **Gemini CLI: DELIBERATELY REMOVED (2026-07-13)** — user decision: the Gemini stack is used via **Antigravity (`agy`)**, not the `gemini` CLI. The `@google/gemini-cli` package has been `npm uninstall -g`'d. **DO NOT reinstall it.**
- ⚠️ **`~/.gemini/` IS STILL KEPT** even though the `gemini` CLI was removed — it holds `GEMINI.md` (symlink → `~/.config/ai/AGENTS.md`, created by `ai-memory-link`) read by **Antigravity**. **Deleting `~/.gemini` = breaking agy.** Contents as of 2026-07-14: `GEMINI.md`, `projects.json`, `config/`, and **`antigravity-cli/` (STILL PRESENT** — the old note saying this folder is gone is WRONG).
- **agy**: a flat native binary, its name **differs per machine** — on Mac `~/.local/bin/agy` (143M, verified 2026-07-20; there is NO `antigravity` file here), on `cuan` an ELF binary from the official installer. Check: `ls -l ~/.local/bin/ | grep -iE 'agy|antigravity'`. Antigravity config in `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **9Router status:** verify the remote tunnel using the checks in the
  OMP/9Router section above; there is no supported local service.
- Optional Pi provider metadata, credentials, and sync status are independent
  from OMP. Inspect them only while troubleshooting a direct Pi session.
- There is no Pi-owned image-generation path in tracked settings. Use the
  runtime-neutral `9router` skill/API.
- **Claude Code**: local MCP `chrome-devtools` (uses `/usr/bin/chromium-browser`) for the `web-perf` skill. A read-only permission allowlist + a secret deny-rule are in `~/.claude/settings.json`.
- **Supabase CLI deliberately NOT installed** (verified 2026-07-14: `supabase` not in PATH) — the DB stack = PostgreSQL + Drizzle ORM + better-auth, self-hosted via Coolify. Don't install unless a project truly needs it. The `~/.supabase/` folder **DOES NOT EXIST on Mac** (verified 2026-07-20 — the old note saying "EXISTS but leftover/empty" is wrong for this machine). The `supabase-stack` skill is kept for reference, not a sign of adoption.

## Fixes & new tools on `cuan` (2026-07-13)
- `pi-9router-sync.service` is an optional Pi adapter that refreshes Pi's
  machine-local provider metadata from the authenticated remote tunnel. It has
  no local-gateway dependency.
- **PostgreSQL client status changed (disk check 2026-08-07):** `psql` resolves to a mise shim but no PostgreSQL version is configured, so `psql`/`pg_dump`/`pg_restore` are currently unavailable until an explicit mise version is selected. The older claim that client 18.4 was available via apt is stale. Other tools in this section must be rechecked individually before use.
- **Hardware `cuan`**: full specs in the "Device registry" section — don't duplicate. What matters for AI decisions: 4GB swap unused (no OOM), and **the MX150 2GB GPU is too small for a local LLM** → the AI load stays in the cloud.

## 9Router credential and restore boundary
- `bin/pi-9router-restore` owns optional Pi settings, compaction, and
  remote-catalog sync integration. It does not install a gateway.
- OMP and Pi provider configs target the remote tunnel; localhost is not a
  supported 9Router endpoint in this setup.
- OMP's wrapper reads only
  `~/.config/ai-local/credentials/9router-remote-key`, and only when
  `NINEROUTER_REMOTE_KEY` is not already set. The value is scoped to the direct
  OMP child process.
- `config/omp/models.yml` expects the environment-variable name chosen by its
  tracked provider configuration. Consult that file rather than copying a
  selector or endpoint into memory.
- Never read or expose credential contents while diagnosing. Use
  `shell-wrapper-test` for the non-secret fixture contract and the doctor checks
  maintained by the core OMP setup.
- Legacy `~/.9router/` state is not part of the supported runtime topology and
  must not be restored from backups.

## Antigravity (`agy`) — the OFFICIAL install method (2026-07-13, verified)
- **Official installer**: `curl -fsSL https://antigravity.google/cli/install.sh | bash` → then `agy install` (configures PATH + shell). Docs: https://antigravity.google/docs/cli-getting-started
- Verified directly: the URL returns **HTTP 200**, its content is a genuine bash script ("Antigravity CLI - Unix Bootstrapper Script"), `TARGET_DIR="$HOME/.local/bin"`, `BINARY_PATH="$TARGET_DIR/agy"`.
- **Not an npm package**, needs no Node. A flat native binary, directly named `agy`.
- Subcommands: `agy install` · `agy update` · `agy models` · `agy agents` · `agy plugin` · `agy changelog`. **There is no `agy login`** — auth runs when `agy` is first launched (via browser).
- ✅ **The `cuan` machine has been RE-INSTALLED using the official installer (2026-07-13)**: now `~/.local/bin/agy` = the real ELF binary (173MB), NOT a symlink anymore. The old binary `~/.local/bin/antigravity` (166MB) has been DELETED. The "agy symlink silently disappears" problem can't recur.
- ⚠️ **The `agy` installer POLLUTES `~/.profile` + `~/.bashrc`**: it adds `export PATH="/home/ongki/.local/bin:$PATH"` (hardcoded home path). `~/.profile` is a SYMLINK to `dotfiles/home/profile` → that line gets committed & is BROKEN on Mac (`/Users/...`). Dotfiles already handles `~/.local/bin` portably (idempotent guard at .bashrc:166). **After every agy install/update: `git checkout home/profile` + remove the `# Added by Antigravity CLI installer` line from the shell rc.**
- Antigravity **replaces the Gemini CLI** (which has been removed from this machine).

# Memory: AI runtime environment

> Detailed shared reference for OMP, 9Router, optional Pi, and Antigravity. Machine-local availability and service state must be verified on the relevant device. See [environment.md](environment.md) for the compact environment index.

## Pi, OMP, and 9Router

- Owner decision: **Pi and OMP may use 9Router; Claude Code, Codex and
  Antigravity use their own native logins.** Shared dotfiles synchronization
  never copies accounts, tokens or auth stores between runtimes.
- Canonical configuration boundaries: [shared AI context](../README.md),
  [Pi configuration](../../pi/README.md), and [OMP reference](../../omp/README.md).
  Verify actual versions, endpoints and readiness on the current device.
- OMP owns its native settings, provider catalog, sessions and auth. Dotfiles
  provides shared context, skills and an explicitly loaded non-secret reference;
  it does not install a model-provider file or wrap the command.
- Pi is an optional independent runtime. `pi-9router-restore` seeds missing local
  settings and the compaction extension without overwriting existing settings.
  `pi-9router-sync.js` reads the public catalog from each existing Pi 9Router
  provider's configured endpoint; it does not read or migrate credentials.
- The gateway may be local on its designated host or reached remotely by other
  devices. Endpoint, service, tunnel and account facts stay device-local.
  Generic setup must not create a new gateway or change another CLI's auth.
- Provider labels may differ between Pi and OMP. Verify the selected label has
  credentials in that runtime before making it the default; matching model IDs
  and base URLs do not establish matching authentication.
- `9router-credential-migrate` is a legacy explicit migration helper, not part
  of ordinary sync. Never run it merely to make the runtimes use the same account.
- Image generation uses the active runtime's available capability or supplied
  assets; it does not require a Pi image package.
**Claude Code profile:** one native profile at `~/.claude`; run the installed `claude` binary directly. Do not add personal/work launchers or alternate config-directory profiles.
  The single-profile rule dates from 2026-07-29, but removing the switcher scripts did
  not remove the mechanism: on `Fantastico` a second profile at
  `~/.claude-accounts/personal/` survived until 2026-09-04 and still received session
  writes while carrying **no `settings.json` at all** — no `permissions.deny` for `.env`,
  no git-guard, no memory hook. Deleting a launcher is not deleting a profile.
  Cause established, so do not re-investigate: the user launched it by hand from another
  window with an explicit `CLAUDE_CONFIG_DIR`, no automation recreated it, and that
  profile was never logged in — its only transcript reads `Not logged in`, and the one
  session id it held also exists in full under `~/.claude`. Nothing was lost with it.
  What the episode proves is the shape of the hazard, not a breach. `ai-doctor`
  now warns when `CLAUDE_CONFIG_DIR` points away from `~/.claude`, when the active
  profile has no `settings.json`, and when `~/.claude-accounts` reappears.
  The other devices cannot be inspected from here, so the cleanup is carried by the
  repository rather than by hand: `install.sh` and `install-macos.sh` run
  `retire_claude_account_profiles` (deleting the `claude-kerja`/`claude-personal`
  stubs and the `/akun` command, reporting but never deleting a surviving profile
  directory, since it holds session transcripts), and `device-register` records a
  **Profil Claude Code** table so each committed `devices/<host>.md` answers
  "is this machine clean?" on its own. A device is only verified once it has
  re-run the installer and `device-register`.

## AI CLI availability
- CLI installation and login state are machine-local. Check `command -v` and
  each runtime's native status before use. Pi is optional; its absence does not
  affect OMP.
- **Gemini CLI: DELIBERATELY REMOVED** — user decision: the Gemini stack is used via **Antigravity (`agy`)**, not the `gemini` CLI. The `@google/gemini-cli` package has been `npm uninstall -g`'d. **DO NOT reinstall it.**
- ⚠️ **`~/.gemini/` IS STILL KEPT** even though the `gemini` CLI was removed — it holds `GEMINI.md` (symlink → `~/.config/ai/context/antigravity.md`, created by `ai-memory-link`), the only global rules file agy 1.2.0 opens (strace-verified 2026-09-15; `~/.antigravity/AGENTS.md` and `~/.gemini/antigravity-cli/*.md` are never read). **Deleting `~/.gemini` = breaking agy.** Contents: `GEMINI.md`, `projects.json`, `config/`, and **`antigravity-cli/` (STILL PRESENT** — the old note saying this folder is gone is WRONG).
- **agy**: a flat native binary, its name **differs per machine** — on Mac `~/.local/bin/agy` (there is NO `antigravity` file here), on `cuan` an ELF binary from the official installer. Check: `ls -l ~/.local/bin/ | grep -iE 'agy|antigravity'`. Antigravity config in `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **9Router status:** verify the device-configured endpoint for Pi or OMP; do not infer its host or service state from shared memory.
- Optional Pi provider metadata, credentials, and sync status are independent
  from OMP. Inspect them only while troubleshooting a direct Pi session.
- There is no Pi-owned image-generation path in tracked settings. Use the active
  runtime's available image-generation capability; report a missing capability
  instead of installing a gateway.
- **Claude Code**: local MCP `chrome-devtools` for the `web-perf` skill; its browser path is device-local (`rich`: `--headless --executablePath /usr/bin/google-chrome`, verified 2026-09-15 — an earlier note said `chromium-browser`). A read-only permission allowlist + a secret deny-rule are in `~/.claude/settings.json`.
- **Supabase CLI**: the house DB stack = PostgreSQL + Drizzle ORM + better-auth, self-hosted via Coolify. Don't adopt Supabase for new projects unless explicitly requested. The `~/.supabase/` folder **DOES NOT EXIST on Mac** (the old note saying "EXISTS but leftover/empty" is wrong for this machine). The `supabase-stack` skill is kept for reference and explicit Supabase projects.

## Fixes & new tools on `cuan` (2026-07-13)
- `pi-9router-sync.service` is an optional Pi catalog adapter. Its endpoint comes
  from Pi's existing provider config; it does not start or configure the gateway.
- **PostgreSQL client status changed (disk check 2026-08-07):** `psql` resolves to a mise shim but no PostgreSQL version is configured, so `psql`/`pg_dump`/`pg_restore` are currently unavailable until an explicit mise version is selected. The older claim that client 18.4 was available via apt is stale. Other tools in this section must be rechecked individually before use.
- **Hardware `cuan`**: full specs in the "Device registry" section — don't duplicate. What matters for AI decisions: 4GB swap unused (no OOM), and **the MX150 2GB GPU is too small for a local LLM** → the AI load stays in the cloud.

## 9Router credential and restore boundary

- Pi and OMP authenticate through their own native mechanisms. Neither runtime
  imports the other's credential store; native Claude, Codex and Antigravity
  credentials must not be replaced with gateway credentials.
- Pi's local `models.json` and OMP's local `models.yml` are not symlinks into
  dotfiles. Adapt the endpoint per device; do not hard-code another machine's
  tunnel into a synchronization helper.
- Catalog synchronization is metadata-only. A protected or unavailable catalog
  must fail without changing the last working file, exposing credentials or
  silently switching endpoints. An available catalog is not inference proof.
- Use the current OMP reference for role/model IDs; historical TASK-091 selectors
  do not override it. Preserve runtime sessions and local gateway data during
  configuration repair.

## Antigravity (`agy`) — the OFFICIAL install method
- **Official installer**: `curl -fsSL https://antigravity.google/cli/install.sh | bash` → then `agy install` (configures PATH + shell). Docs: https://antigravity.google/docs/cli-getting-started
- Verified directly: the URL returns **HTTP 200**, its content is a genuine bash script ("Antigravity CLI - Unix Bootstrapper Script"), `TARGET_DIR="$HOME/.local/bin"`, `BINARY_PATH="$TARGET_DIR/agy"`.
- **Not an npm package**, needs no Node. A flat native binary, directly named `agy`.
- Subcommands: `agy install` · `agy update` · `agy models` · `agy agents` · `agy plugin` · `agy changelog`. **There is no `agy login`** — auth runs when `agy` is first launched (via browser).
- ✅ **The `cuan` machine uses the official installer**: `~/.local/bin/agy` = the real ELF binary, NOT a symlink anymore. The old binary `~/.local/bin/antigravity` has been DELETED. The "agy symlink silently disappears" problem can't recur.
- ⚠️ **The `agy` installer POLLUTES `~/.profile` + `~/.bashrc`**: it adds `export PATH="/home/ongki/.local/bin:$PATH"` (hardcoded home path). `~/.profile` is a SYMLINK to `dotfiles/home/profile` → that line gets committed & is BROKEN on Mac (`/Users/...`). Dotfiles already handles `~/.local/bin` portably (idempotent guard at .bashrc:166). **After every agy install/update: `git checkout home/profile` + remove the `# Added by Antigravity CLI installer` line from the shell rc.**
- Antigravity **replaces the Gemini CLI** (which has been removed from this machine).

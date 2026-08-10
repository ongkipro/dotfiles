# Memory: Environment — toolchain & install
> Part of shared memory. Update if a tool/setup changes.
> **MULTI-MACHINE — OS-specific facts MUST name the machine. Check `uname -a` first.**
> - Linux (main): hostname **`cuan`** — ThinkPad T480, Ubuntu 26.04, kernel 7.0.0. Old nickname in memory = "fantastico" (the SAME machine).
> - Mac (secondary): hostname **`ongkis-MacBook-Air`** — MacBook Air M1 8GB, macOS 26.5.2 arm64. ("`feriromansyah`" = old nickname in memory, the SAME machine; the real `hostname` is not that.)
> `brew` instructions = MAC ONLY. On `cuan` use mise/apt.

## Installed tools (DO NOT reinstall)
- mise (no-sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv, qsv.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g: pi, 9router, pnpm, typescript-language-server, vscode-langservers-extracted, @tailwindcss/language-server, yaml-language-server, bash-language-server, pyright.
- Native binary: omp v17.2.10 (`~/.local/bin/omp`, installed via `curl -fsSL https://omp.sh/install | sh`).
- pipx: python-lsp-server (pylsp).
- Homebrew (system): gh, tmux, pnpm, chromium, pipx.
- Browser: Chromium (`brew install chromium`), Google Chrome.
- Git + delta diff pager + `~/.gitignore_global`.

## tmux (mandatory part of the dotfiles bootstrap)
- The full tmux setup is handled by `bin/tmux-setup` (idempotent, cross-platform): installs the binary (apt/dnf/pacman/zypper on Linux, brew on macOS) + a clipboard tool (wl-clipboard/xclip on Linux; built-in pbcopy on macOS) + links `~/.tmux.conf`, `~/.local/bin/tmux-clip`, and `~/.local/bin/tmux-battery` + clones TPM + installs/cleans plugins.
- Called automatically from `install.sh` and `install-macos.sh`. Can also be run manually: `tmux-setup`.
- Prefix `Ctrl+a`. Theme: plain-font friendly Catppuccin-inspired palette (no Nerd Font dependency). Plugins: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Clipboard via `bin/tmux-clip`, battery/status helper via `bin/tmux-battery`. Reload: prefix+r. Update plugins: prefix+U / install new plugin: prefix+I. Save session: prefix+S. Restore: prefix+R.

## How to install (when sudo)
- CLI / runtime → `mise use -g <name>` (no sudo); update `mise up`; remove `mise rm <name>`.
- Node tools → `npm i -g <package>`. Python apps → `pipx install <package>`.
- System tools → `brew install <name>`. GUI apps → `brew install --cask <name>`.
- `sudo` ONLY for system files (rarely needed on macOS).

## pi.dev + 9router — THE SINGLE source of truth (2026-07-14)
> This section replaces 4 old contradicting sections. When in doubt: **read disk, not memory.**
> `~/.pi/agent/settings.json` = the truth for the model. `systemctl --user is-enabled 9router.service` = the truth for the service.

- **pi default is PER-MACHINE now — check disk, don't guess.** Check: `jq '.defaultProvider, .defaultModel' ~/.pi/agent/settings.json`.
  - Linux `cuan`: **`minimax` / `MiniMax-M3`** as verified 2026-08-10 from the regular `~/.pi/agent/settings.json`.
  - Mac (`ongkis-MacBook-Air`): **`9router-fantastico` / `cx/gpt-5.6-sol`** as of 2026-08-05. `~/.pi/agent/settings.json` there is a regular file, not a symlink. Full-tunnel mode uses the authenticated remote provider while the local launchd gateway is disabled.
  - OMP is separate from Pi: Linux OMP defaults to **`9router-fantastico/cx/gpt-5.6-sol`** through the authenticated tunnel; `~/.omp/agent/{config.yml,models.yml}` link to `dotfiles/config/omp/`.
  - `9router` availability in Pi is machine-local; inspect `~/.pi/agent/models.json` rather than copying another machine's provider set.
- ☠️ **Old model IDs that are dead — don't bring them back:** `ocg/deepseek-v4-pro` and `opencode-go/minimax-m3`. `cx/gpt-5.4-mini` is available through `9router-fantastico` and is a valid compact fallback, not the default.
- **9router status is per-machine — check, don't guess.** Linux `cuan` is active+enabled with local health OK as verified 2026-08-10. Mac remains full-tunnel with its local launchd gateway disabled as of 2026-08-05.
- ☠️ **TRAP: 9router installs its OWN autostart** (`com.9router.autostart`, `--tray` mode). That job **does not set `HOSTNAME`** → the gateway binds to **`0.0.0.0`**, meaning ALL providers' API keys can be used by anyone on the same WiFi. It also duplicates `com.9router.gateway` (two processes fighting over port 20128, requests land non-deterministically). Since 2026-07-14 `bin/pi-9router-restore` removes it automatically (moved to `~/.local/share/9router-disabled/`). **If `lsof -nP -iTCP:20128` shows `*:20128` and not `127.0.0.1:20128`, it has relapsed — run `pi-9router-restore`.**
- **Routing boundary:** Pi and OMP may use 9router. Native Claude Code, Codex, and agy must not be redirected through it.
- Claude Code through 9router = LEAK: the 9router launcher injects a proxy+CA per-process. Run `claude` normally. The `cc/claude-*` models in the selector = 9router MITM, they have no upstream route (error "may not exist").
- codex was DETACHED from 9router (29 Jun 2026): the `[model_providers.9router]` block in `~/.codex/config.toml` is commented out; codex reverts to native OpenAI. Uncomment to restore.

**pi symlinks (via dotfiles):** `~/.pi/agent/settings.json` → `dotfiles/config/pi/settings.json` · `~/.pi/extensions/compact-free/` → `dotfiles/config/pi/extensions/compact-free/` · `~/.pi/agent/extensions/welcome-screen.ts` → `dotfiles/config/pi/extensions/welcome-screen/index.ts` · `~/.9router/{aliases.json,runtime/package.json}` → `dotfiles/config/9router/`.
**NOT in dotfiles (secret):** `models.json` (API key), `auth.json` (oauth token). Local backup only.
**Editing pi TUI/extension:** use `theme.fg(color, text)` — not curried.
**Claude Code profile:** one native profile at `~/.claude`; run the installed `claude` binary directly. Do not add personal/work launchers or alternate config-directory profiles.

## User machines (multi-machine)
- Memory `~/.config/ai/` is synced via dotfiles to MULTIPLE machines — OS/toolchain facts must name the relevant machine.
- Each machine's identity + specs: the header of this file (brief) and `devices/<hostname>.md` in dotfiles (full). Don't rewrite specs in another section.
- Toolchain differences to remember: Mac has brew; `cuan` **has NO brew** (mise/npm/pipx only). On `cuan` helix `languages.toml` is a symlink → dotfiles.
- The 9router autostart mechanism (launchd on mac vs systemd --user on linux) + its trap: see the "pi.dev + 9router" section — don't duplicate it here.
- When giving OS-specific instructions (launchd vs systemd, brew vs apt, etc.), ALWAYS check the machine first (`uname -a`).

## TokoΦ — Vultr + Coolify server (VERIFIED DIRECTLY from the API, 2026-07-14)
> Re-verify anytime: `vultr-cli instance list` · `vultr-cli account info` · `vultr-cli snapshot list`.
> ☠️ The old notes here were COMPLETELY WRONG for days (server `45.76.146.40`, 8c/16GB, "$96/mo", "credit runs out 9 Aug"). All those numbers are **fictional** — that server no longer exists. This is an example of why **disk/API wins over memory**.

- **THE ONLY instance**: label **`volumdev`** (the name is misleading — it actually holds **TokoΦ + Coolify**).
  - ID `0d341106-34ff-4b5b-8441-9350e1b8ce35` · IP **45.77.33.112** · Singapore (sgp) · Ubuntu 24.04 · created **2026-07-10** · status running.
  - Plan **`vhp-4c-8gb-amd`** = 4 vCPU / 8 GB / 180 GB → **$48.00/month** (NOT $96).
- **The old server `45.76.146.40` (8c/16GB) NO LONGER EXISTS** — probably destroyed 2026-07-10 when `volumdev` was created. The SSH key `tokophi-dev` (`c4d746ce-…`) is still stuck in the account as a leftover; the active key = `volumdev` (`6b68411e-…`).
- **Credit: −$305.00 STILL INTACT.** New pending charges **$12.24** (as of 2026-07-14). Source: $300 "Account Credit" + $5 Visa, both 2026-07-09.
  - Burn rate $48/mo → $305 credit ≈ **~6 months runway**, PROVIDED the credit doesn't expire.
  - ⚠️ **The credit expiry date is NOT exposed by the Vultr API** (billing history only records `payment / Account Credit`). The old claim "valid 1 month" is **not yet verified** — check manually in the Vultr dashboard → Billing. If it really does expire ~9 Aug, the $305 is forfeited and the migration decision becomes urgent.
- ✅ **SSH RECOVERED (2026-07-14).** The old `tokophi_dev` key was LOST (deleted along with the Linux reinstall on `cuan`) → the server briefly couldn't be SSH'd at all. Recovered by pasting `~/.ssh/id_ed25519.pub` (the "laptop" key) into the server's `authorized_keys` via the **Coolify web terminal** (Vultr CANNOT inject a key into a running instance). Now: `ssh root@<IP above>` → gets in.
  - Coolify web UI `http://45.77.33.112:8000` (admin `ongkiardiansyah@gmail.com`) = **the emergency door if SSH dies again**. Ports 22/80/443/8000 open. App `:80` → 404 (domain not yet pointed).
  - 📌 **Lesson**: a server SSH key that only exists on ONE machine = single point of failure, and an OS reinstall wipes it. NEVER put a private key in dotfiles; but note the recovery path (via Coolify/provider console).
- ✅ **FIRST BACKUP SUCCEEDED (2026-07-14, on the `cuan` machine)** — `~/Documents/work/backups/root_<ip>-<stamp>/`, total ~6 MB. ⚠️ This folder **only exists on `cuan`**; on the Mac `~/Documents/work/backups/` DOES NOT EXIST (verified 2026-07-20). Meaning the TokoΦ backup lives on only one machine. Created & verified with **`vps-pgdump root@45.77.33.112`** (`dotfiles/bin/`).
  - `tokophi.dump` (984K, 532 objects) — the app DB.
  - `coolify.dump` (5.1M, 557 objects) — **Coolify's internal DB**: app definitions, env, deploy config. Without it, losing the server = rebuild the entire deploy setup from scratch. **Don't forget this one.**
  - `coolify-config.tar.gz` — the TokoΦ stack's `docker-compose.yaml` + `.env`.
  - All dumps **pass `pg_restore -l`** (not a claim, a test). Restore: `pg_restore -d <db> --clean --if-exists <file>.dump`.
  - 🔒 The backup contains SECRETS → **OUTSIDE the repo**. DO NOT commit.
  - ⚠️ This backup is **one-off, manual**. Not yet scheduled. Repeat before risky changes, and consider a cron.
  - TokoΦ stack on the server (7 containers, all healthy): postgres, admin, super-admin, storefront, landing, cron, backup. Plus `migrate-*` that `Exited (0)` = NORMAL (runs once at deploy, succeeded).
- ☠️ **VULTR SNAPSHOT FAILED — don't waste time repeating it.** Tried 2× (2026-07-14): `f9526f57-…` and `759dc88f-…`. Identical pattern: status `pending` 15–30 minutes → **vanishes**, `snapshot get` returns `404 Invalid snapshot ID`, `snapshot list` is empty. **The Vultr API gives no reason whatsoever.** The instance itself is healthy (`active`/`running`) during and after.
  - Guess (NOT yet verified, don't write it as fact): a new-account restriction / an account running on promo credit. Check notifications & tickets in the Vultr dashboard.
  - **The correct backup route = pull data OUT of the server** (`pg_dump -Fc` + Coolify/compose config → local or R2). It doesn't depend on the Vultr snapshot feature at all.
- **No other billing resources**: block storage 0, load balancer 0, reserved IP 0, DNS 0. So $48/mo is the total.
- **vultr-cli**: v3.10.0 via mise. Auth `~/.vultr-cli.yaml` (chmod 600, in `$HOME` — **NOT** in dotfiles, and **DO NOT** `export VULTR_API_KEY` in `~/.bashrc`: `dotsync refresh_snapshots` copies bashrc into the repo). Already installed & working as of 2026-07-14. Skill: `dotfiles/skills/local/vultr/`.
- **2-phase plan**: dev=Vultr SG (credit) → prod=Hetzner SG. Migration is cheap (Coolify + git + `pg_dump` + swap the origin IP in Cloudflare). Domain `tokophi.com` is on Cloudflare, DNS not yet pointed.

## AI CLI — verified status (2026-07-13, `cuan`)
- **Installed**: `claude` (login OK), `codex` (**NOT logged in** on `cuan` — no `~/.codex/auth.json`), `pi`, `agy` (Antigravity). **Versions deliberately NOT recorded** — they change every update, numbers in memory are guaranteed stale. Check: `claude --version; codex --version; pi --version; agy --version`.
- **Gemini CLI: DELIBERATELY REMOVED (2026-07-13)** — user decision: the Gemini stack is used via **Antigravity (`agy`)**, not the `gemini` CLI. The `@google/gemini-cli` package has been `npm uninstall -g`'d. **DO NOT reinstall it.**
- ⚠️ **`~/.gemini/` IS STILL KEPT** even though the `gemini` CLI was removed — it holds `GEMINI.md` (symlink → `~/.config/ai/AGENTS.md`, created by `ai-memory-link`) read by **Antigravity**. **Deleting `~/.gemini` = breaking agy.** Contents as of 2026-07-14: `GEMINI.md`, `projects.json`, `config/`, and **`antigravity-cli/` (STILL PRESENT** — the old note saying this folder is gone is WRONG).
- **agy**: a flat native binary, its name **differs per machine** — on Mac `~/.local/bin/agy` (143M, verified 2026-07-20; there is NO `antigravity` file here), on `cuan` an ELF binary from the official installer. Check: `ls -l ~/.local/bin/ | grep -iE 'agy|antigravity'`. Antigravity config in `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **9router status**: see the "pi.dev + 9router" section (per-machine, one place). Don't write 9router status here again.
- ✅ **FULL TUNNEL MODE (2026-07-29)** — local 9router service di-stop & disable (`launchctl bootout + disable` of `com.9router.gateway`). Port 20128 free. plist `.plist` masih ada di `~/Library/LaunchAgents/` untuk re-enable nanti.
  - `~/.pi/agent/models.json` sekarang HANYA `9router-fantastico` provider (25 chat models: 6× `cx/gpt-5.6-{sol,terra,luna}+review`, `cx/gpt-5.5`, `cx/gpt-5.4`, `cx/gpt-5.4-mini`, 7× `gc/gemini-*` (3.1-pro/3-pro/3-flash/3.1-flash-lite/2.5-pro/2.5-flash/2.5-flash-lite), 10× `ag/*` agents (gemini-3-flash/3.5-flash-low/extra-low/pro-agent/3.1-pro-low, claude-sonnet-4-6, claude-opus-4-6-thinking, gpt-oss-120b-medium, gemini-3-flash)).
  - `9router` provider (lokal) sudah DIHAPUS dari `models.json` + `auth.json`.
  - `auth.json` keys sekarang: `opencode-go`, `minimax`, `9router-fantastico` (3).
  - `compact-free` extension: `COMPACT_MODELS` di-update pakai `9router-fantastico` (3 model termurah via tunnel) → `minimax` → `opencode-go` sebagai fallback.
  - `~/.9router/` (DB + upstream API keys) **TIDAK dihapus** — masih ada, risk-free dibiarkan (tidak jalan). Hapus hanya kalau user eksplisit mau.
  - pi-image-gen `customProviders.9router` jadi 4 image models dari tunnel: `ag/gemini-3.1-flash-image`, `cx/gpt-5.5-image`, `cx/gpt-5.4-image`, `cx/gpt-5.3-image`. `9router-remote` provider dihapus (duplicate).
- **Claude Code**: local MCP `chrome-devtools` (uses `/usr/bin/chromium-browser`) for the `web-perf` skill. A read-only permission allowlist + a secret deny-rule are in `~/.claude/settings.json`.
- **Supabase CLI deliberately NOT installed** (verified 2026-07-14: `supabase` not in PATH) — the DB stack = PostgreSQL + Drizzle ORM + better-auth, self-hosted via Coolify. Don't install unless a project truly needs it. The `~/.supabase/` folder **DOES NOT EXIST on Mac** (verified 2026-07-20 — the old note saying "EXISTS but leftover/empty" is wrong for this machine). The `supabase-stack` skill is kept for reference, not a sign of adoption.

## Fixes & new tools on `cuan` (2026-07-13)
- **`pi-9router-sync.service` USED TO FAIL every boot** (`9router is not installed or initialized`). Cause: the script required `~/.9router/auth/cli-secret`, but **9router 0.5.30 no longer creates the `auth/` dir** (now `~/.9router/jwt-secret`). The local endpoint `127.0.0.1:20128` **does not check Authorization** (445 models fetched without a header). FIX: `~/dotfiles/bin/pi-9router-sync.js` — the `secretPath` requirement dropped, fallback `apiKey='noauth'`. The service is now `success`.
- The script only syncs providers that are **ACTIVE** in the 9router DB → currently pi gets 4 models (`oc/*` free). Want more: enable providers in the 9router dashboard (`localhost:20128`).
- **PostgreSQL client status changed (disk check 2026-08-07):** `psql` resolves to a mise shim but no PostgreSQL version is configured, so `psql`/`pg_dump`/`pg_restore` are currently unavailable until an explicit mise version is selected. The older claim that client 18.4 was available via apt is stale. Other tools in this section must be rechecked individually before use.
- **Hardware `cuan`**: full specs in the "Device registry" section — don't duplicate. What matters for AI decisions: 4GB swap unused (no OOM), and **the MX150 2GB GPU is too small for a local LLM** → the AI load stays in the cloud.

## 9router current status on `cuan` (verified 2026-08-10)
- `9router.service` is loaded, active, running, and enabled; `http://localhost:20128/api/health` returns `{"ok":true}`.
- The authenticated remote tunnel is reachable. OMP custom provider `9router-fantastico` resolves its key from the environment-variable name `NINEROUTER_REMOTE_KEY` in `models.yml`; do not use shell interpolation syntax such as `${NINEROUTER_REMOTE_KEY}` there.
- `pi-9router-sync.service` is enabled but currently inactive/dead after its oneshot lifecycle; inspect `ExecMainStatus` before treating that as failure.
- **`~/.9router/` remains sensitive:** `db/data.sqlite` contains upstream provider credentials. Never read, copy, delete, or expose it without explicit approval.
- Local and remote model routing are separate. Verify Pi settings/models, OMP `models.yml`, service health, and tunnel authentication independently before diagnosing fallback.

### The OMP tunnel key chain is load-bearing and process-scoped (verified 2026-08-10)

OMP's working path is `9router-fantastico` → the tunnel in `config/omp/models.yml`. The HTTP path was verified end to end on 2026-08-10. Its local launch chain is:

1. The tracked `omp()` wrapper in `config/shell-tools.sh` reads `."9router-fantastico".key` from Pi's local `~/.pi/agent/auth.json` only while launching OMP.
2. Linux `~/.bashrc` sources that tracked helper. `home/bashrc.snapshot` stores the source line, not a copied wrapper or credential loader. Unrelated child processes must not inherit `NINEROUTER_REMOTE_KEY`.
3. `models.yml` stores the **bare variable name** `NINEROUTER_REMOTE_KEY`. Rewriting it as `${NINEROUTER_REMOTE_KEY}` breaks it because that field is not shell-expanded.
4. Re-authenticating Pi refreshes the local source credential automatically. The credential itself must never enter Git, memory, logs, or diagnostics.

Verify routing and scope with `shell-wrapper-test` and `ai-doctor --self-test`. A clean child shell should report `NINEROUTER_REMOTE_KEY` as unset; OMP receives it only through the wrapper.

**Do not "fix" `models.yml` to point at `http://localhost:20128`.** The local instance has zero provider accounts and zero API keys, so it 401s on chat while still listing 679 catalogue models — it looks healthy and serves nothing. The tunnel reaches a *different*, fully configured 9router.

Still pointing at the empty local instance and therefore broken: `pi-image-gen` (default `gemini-flash`) and the Pi provider *named* `9router-remote` (its `${NINEROUTER_REMOTE_URL:-…}` fallback resolves to localhost because that variable is never set). Repointing image-gen at the tunnel also needs new model IDs — the tunnel carries `ag/gemini-3.1-flash-image`, not `gemini/gemini-3.1-flash-image-preview`. (`bin/ico` was the third dependent; deleted 2026-08-10.)

## Device registry + git credential (2026-07-13)
- **`devices/` in dotfiles = the cross-device registry.** One file per machine (`devices/<hostname>.md`): brand/model, CPU, RAM, GPU, disk, AI CLI, toolchain, and **the status of each dotfiles symlink**. Index: `devices/README.md`. Generate/refresh: `device-register` (idempotent, `--dry-run` available; called automatically by install.sh/install-macos.sh, non-fatal).
- **Specs for `cuan` (the only place in this file):** **Lenovo ThinkPad T480** (`20L6S3ED00`), i7-8650U 4c/8t, RAM **14.9 GB** (~12GB free), 4GB swap, NVMe 233GB (8% used), DUAL GPU Intel UHD 620 (`i915`) + NVIDIA MX150 2GB (driver 580.159.03, `nvidia_drm` active).
- **`~/.config/mise/config.toml` is now a SYMLINK to `dotfiles/config/mise-config.toml`** → `mise use -g <tool>` is automatically recorded in dotfiles (already tested: mise writes THROUGH the symlink without breaking it). `node` is deliberately NOT in the shared config (nvm vs mise shim conflict).
- **Another device (Mac) ACTIVELY pushes to this repo.** Always `git pull --rebase` before pushing. A real conflict happened once in `install-macos.sh` (Mac added `pi-9router-restore`, linux added `device-register`) — the resolution is to MERGE, don't pick one.

## Git identity — ONE for all devices (2026-07-13)
- **Standard: `ongkipro <82156528+ongkipro@users.noreply.github.com>`** (GitHub noreply — the real email never enters commit history, but commits still count toward the profile). The ID `82156528` comes from `gh api user`, not a guess.
- Previously there were **4 identities** in circulation: global `ongkiardiansyah@gmail.com`, `install-macos.sh` hardcoding `get@ongki.pro`, the GitHub account `ongkipro`, and — the most deceptive — the dotfiles repo's **LOCAL config** `Ongki Pro <[email protected]>`. Local config ALWAYS wins over global, so commits from this machine were attributed to an unintended identity.
- The local override in `~/dotfiles` has been REMOVED (`git config --local --unset user.name/user.email`) → it follows global. `install-macos.sh` has also been standardized.
- ⚠️ **Old commits (before 2026-07-13) still carry the old email** — not rewritten (already pushed; a rewrite = destructive).
- ⚠️ **Check other repos**: `git config --local --get user.email` in each repo. If there's a similar override, remove it too.
- **`credential.helper` = `!gh auth git-credential`** (WITHOUT an absolute path — so it works on both Linux `/usr/bin/gh` and Mac `/opt/homebrew/bin/gh`). It was once set to the absolute path `/home/ongki/.local/bin/gh` which DOES NOT EXIST → every `git push` failed with `could not read Username`. If a push fails with that message: run `gh auth setup-git`.

## Antigravity (`agy`) — the OFFICIAL install method (2026-07-13, verified)
- **Official installer**: `curl -fsSL https://antigravity.google/cli/install.sh | bash` → then `agy install` (configures PATH + shell). Docs: https://antigravity.google/docs/cli-getting-started
- Verified directly: the URL returns **HTTP 200**, its content is a genuine bash script ("Antigravity CLI - Unix Bootstrapper Script"), `TARGET_DIR="$HOME/.local/bin"`, `BINARY_PATH="$TARGET_DIR/agy"`.
- **Not an npm package**, needs no Node. A flat native binary, directly named `agy`.
- Subcommands: `agy install` · `agy update` · `agy models` · `agy agents` · `agy plugin` · `agy changelog`. **There is no `agy login`** — auth runs when `agy` is first launched (via browser).
- ✅ **The `cuan` machine has been RE-INSTALLED using the official installer (2026-07-13)**: now `~/.local/bin/agy` = the real ELF binary (173MB), NOT a symlink anymore. The old binary `~/.local/bin/antigravity` (166MB) has been DELETED. The "agy symlink silently disappears" problem can't recur.
- ⚠️ **The `agy` installer POLLUTES `~/.profile` + `~/.bashrc`**: it adds `export PATH="/home/ongki/.local/bin:$PATH"` (hardcoded home path). `~/.profile` is a SYMLINK to `dotfiles/home/profile` → that line gets committed & is BROKEN on Mac (`/Users/...`). Dotfiles already handles `~/.local/bin` portably (idempotent guard at .bashrc:166). **After every agy install/update: `git checkout home/profile` + remove the `# Added by Antigravity CLI installer` line from the shell rc.**
- Antigravity **replaces the Gemini CLI** (which has been removed from this machine).

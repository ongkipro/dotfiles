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
- Native OMP binary at `~/.local/bin/omp`; resolve the current version with
  `omp --version` because runtime versions are machine-local and change faster
  than shared memory.
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

## OMP, optional Pi, and 9Router
> Runtime installation, active models, provider availability, and service state
> are machine-local. Verify them from the relevant machine instead of recording
> a current snapshot here.

- OMP is the only primary control plane. Its tracked configuration lives under
  `config/omp/`; Pi state is not an OMP configuration or credential source.
- **Aspirational Routing vs Device Reality:** OMP's `config/omp/config.yml` defines the *ideal* orchestration (e.g., assigning `claude-opus-5:max` for `advisor-max`). However, **actual model availability is device-local**, governed by what is registered in `models.yml` and the provider's active API keys. If a requested model (like Opus 5) is absent on a specific device, OMP degrades to the highest available fallback (e.g., Opus 4.6 or Codex Sol). Do not assume all models in `config.yml` are physically available on every machine.
- Pi is optional. When it is installed, inspect its own settings and models only
  for a direct Pi session. Its custom compaction extension is a Pi-only fallback.
- Generic 9Router config/service restoration is `bin/9router-restore` and does
  not touch `~/.pi`. `bin/pi-9router-restore` is an explicitly invoked optional
  adapter that delegates generic gateway setup.
- The optional remote credential is
  `~/.config/ai-local/credentials/9router-remote-key`. It is never tracked or
  globally exported; the `omp()` shell wrapper injects it only into the OMP
  child when `NINEROUTER_REMOTE_KEY` is not already set.
- `9router-credential-migrate` may copy a legacy key from Pi auth only when
  explicitly invoked. It does not print the value, delete the source, or
  overwrite an existing neutral credential.
- Image generation belongs to the runtime-neutral `9router` skill/API, not a Pi
  image package.
- Check local Linux service state with `systemctl --user is-enabled
  9router.service`, `systemctl --user is-active 9router.service`, and the local
  health endpoint. Use the relevant launchd checks on macOS. Do not infer one
  machine's state from another.
- **Local and remote 9Router are two different instances, and a healthy local one
  may still serve nothing.** The local gateway federates models from the CLIs
  already logged in on that machine, so `/v1/models` can list hundreds while its
  own `apiKeys` table is empty — and an empty key table means
  `/v1/chat/completions` answers `401` to every caller, including the CLI secret
  at `~/.9router/auth/cli-secret`. `systemctl is-active`, `/api/health` returning
  `{"ok":true}`, and a long `/v1/models` list are therefore **not** evidence that
  9Router can serve a request. Probe `/v1/chat/completions` when that is the
  question. The remote host in `config/omp/models.yml` is a separate instance with
  its own curated catalog and its own key; that catalog is what `models.yml`
  describes, which is why the tracked `baseUrl` is the remote and not localhost.
  Do not "fix" it to localhost.
- Native Claude Code, Codex, and Antigravity remain independent runtimes; do not
  redirect them through 9Router based on this memory.
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

## AI CLI availability
- CLI installation and login state are machine-local. Check `command -v` and
  each runtime's native status before use. Pi is optional; its absence does not
  affect OMP.
- **Gemini CLI: DELIBERATELY REMOVED (2026-07-13)** — user decision: the Gemini stack is used via **Antigravity (`agy`)**, not the `gemini` CLI. The `@google/gemini-cli` package has been `npm uninstall -g`'d. **DO NOT reinstall it.**
- ⚠️ **`~/.gemini/` IS STILL KEPT** even though the `gemini` CLI was removed — it holds `GEMINI.md` (symlink → `~/.config/ai/AGENTS.md`, created by `ai-memory-link`) read by **Antigravity**. **Deleting `~/.gemini` = breaking agy.** Contents as of 2026-07-14: `GEMINI.md`, `projects.json`, `config/`, and **`antigravity-cli/` (STILL PRESENT** — the old note saying this folder is gone is WRONG).
- **agy**: a flat native binary, its name **differs per machine** — on Mac `~/.local/bin/agy` (143M, verified 2026-07-20; there is NO `antigravity` file here), on `cuan` an ELF binary from the official installer. Check: `ls -l ~/.local/bin/ | grep -iE 'agy|antigravity'`. Antigravity config in `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **9Router status:** use the checks in the OMP/9Router section above; never
  copy a dated active-model or service snapshot here.
- Optional Pi provider metadata, credentials, and sync status are independent
  from OMP. Inspect them only while troubleshooting a direct Pi session.
- There is no Pi-owned image-generation path in tracked settings. Use the
  runtime-neutral `9router` skill/API.
- **Claude Code**: local MCP `chrome-devtools` (uses `/usr/bin/chromium-browser`) for the `web-perf` skill. A read-only permission allowlist + a secret deny-rule are in `~/.claude/settings.json`.
- **Supabase CLI deliberately NOT installed** (verified 2026-07-14: `supabase` not in PATH) — the DB stack = PostgreSQL + Drizzle ORM + better-auth, self-hosted via Coolify. Don't install unless a project truly needs it. The `~/.supabase/` folder **DOES NOT EXIST on Mac** (verified 2026-07-20 — the old note saying "EXISTS but leftover/empty" is wrong for this machine). The `supabase-stack` skill is kept for reference, not a sign of adoption.

## Fixes & new tools on `cuan` (2026-07-13)
- `pi-9router-sync.service` is an optional Pi adapter. Its provider catalogue and
  lifecycle are machine-local; inspect the unit and Pi model file before drawing
  conclusions. Generic 9Router setup must not depend on this unit.
- **PostgreSQL client status changed (disk check 2026-08-07):** `psql` resolves to a mise shim but no PostgreSQL version is configured, so `psql`/`pg_dump`/`pg_restore` are currently unavailable until an explicit mise version is selected. The older claim that client 18.4 was available via apt is stale. Other tools in this section must be rechecked individually before use.
- **Hardware `cuan`**: full specs in the "Device registry" section — don't duplicate. What matters for AI decisions: 4GB swap unused (no OOM), and **the MX150 2GB GPU is too small for a local LLM** → the AI load stays in the cloud.

## 9Router credential and restore boundary
- `bin/9router-restore` owns shared config and the platform user service. It
  contains no Pi paths.
- `bin/pi-9router-restore` owns optional Pi settings, compaction, and model-sync
  integration, then delegates generic setup to `9router-restore`.
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
- `~/.9router/` can contain sensitive gateway state. Never read, copy, delete, or
  expose its credential-bearing files without explicit approval.

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

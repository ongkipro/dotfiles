# TokoΦ infrastructure record — 2026-07

> Dated project reference split from [shared environment memory](../memory/environment.md). Re-verify provider, billing, backup, SSH, DNS, and deployment state before acting; the TokoΦ repository and live provider state are authoritative.

## TokoΦ — Vultr + Coolify server (VERIFIED DIRECTLY from the API, 2026-07-14)
> Re-verify anytime: `vultr-cli instance list` · `vultr-cli account info` · `vultr-cli snapshot list`.
> ☠️ The old notes here were COMPLETELY WRONG for days (server `45.76.146.40`, 8c/16GB, "$96/mo", "credit runs out 9 Aug"). All those numbers are **fictional** — that server no longer exists. This is an example of why **disk/API wins over memory**.

- **THE ONLY instance**: label **`volumdev`** (the name is misleading — it actually holds **TokoΦ + Coolify**).
  - ID `0d341106-34ff-4b5b-8441-9350e1b8ce35` · IP **<coolify-vps>** · Singapore (sgp) · Ubuntu 24.04 · created **2026-07-10** · status running.
  - Plan **`vhp-4c-8gb-amd`** = 4 vCPU / 8 GB / 180 GB → **$48.00/month** (NOT $96).
- **The old server `45.76.146.40` (8c/16GB) NO LONGER EXISTS** — probably destroyed 2026-07-10 when `volumdev` was created. The SSH key `tokophi-dev` (`c4d746ce-…`) is still stuck in the account as a leftover; the active key = `volumdev` (`6b68411e-…`).
- **Credit: −$305.00 STILL INTACT.** New pending charges **$12.24** (as of 2026-07-14). Source: $300 "Account Credit" + $5 Visa, both 2026-07-09.
  - Burn rate $48/mo → $305 credit ≈ **~6 months runway**, PROVIDED the credit doesn't expire.
  - ⚠️ **The credit expiry date is NOT exposed by the Vultr API** (billing history only records `payment / Account Credit`). The old claim "valid 1 month" is **not yet verified** — check manually in the Vultr dashboard → Billing. If it really does expire ~9 Aug, the $305 is forfeited and the migration decision becomes urgent.
- ✅ **SSH RECOVERED (2026-07-14).** The old `tokophi_dev` key was LOST (deleted along with the Linux reinstall on `cuan`) → the server briefly couldn't be SSH'd at all. Recovered by pasting `~/.ssh/id_ed25519.pub` (the "laptop" key) into the server's `authorized_keys` via the **Coolify web terminal** (Vultr CANNOT inject a key into a running instance). Now: `ssh root@<IP above>` → gets in.
  - Coolify web UI `http://<coolify-vps>:8000` (admin `<cf-account-email>`) = **the emergency door if SSH dies again**. Ports 22/80/443/8000 open. App `:80` → 404 (domain not yet pointed).
  - 📌 **Lesson**: a server SSH key that only exists on ONE machine = single point of failure, and an OS reinstall wipes it. NEVER put a private key in dotfiles; but note the recovery path (via Coolify/provider console).
- ✅ **FIRST BACKUP SUCCEEDED (2026-07-14, on the `cuan` machine)** — `~/Documents/work/backups/root_<ip>-<stamp>/`, total ~6 MB. ⚠️ This folder **only exists on `cuan`**; on the Mac `~/Documents/work/backups/` DOES NOT EXIST (verified 2026-07-20). Meaning the TokoΦ backup lives on only one machine. Created & verified with **`vps-pgdump root@<coolify-vps>`** (`dotfiles/bin/`).
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

> `<coolify-vps>` is redacted — see [[coolify-vps-dev]] for what it stands for.

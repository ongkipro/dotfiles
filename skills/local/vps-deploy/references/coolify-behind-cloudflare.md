# Coolify on a fresh VPS behind Cloudflare

End-to-end runbook for one Ubuntu VPS running Coolify v4 (Traefik) with sites and
the dashboard served through Cloudflare. Provisioning commands live in the `vultr`
skill; live hosts, IDs and credentials live in `~/.config/ai-local/<host>-access.md`
and `secrets-env`, never here.

Verified end to end on 2026-10-30: Ubuntu 24.04, vultr-cli 3.11, Coolify 4.5.3,
Traefik 3.7, Docker 29.9. Re-applied 2026-11-10 on a second host (Coolify 4.7.2,
Traefik 3.7.17): installer `ROOT_USER_*` bootstrap, `DOCKER-USER` guard, and the
SSL-mode ordering below. To update: re-verify the step, change it in place, and
bump the verified line for that step. Do not append a second procedure beside this
one.

## Target state

| Layer | State |
|---|---|
| Provider firewall | 22 public (key-only SSH) or owner `/32` only; 80/443 from Cloudflare only (v4+v6); nothing else |
| Host | sshd key-only drop-in, UFW deny-incoming, fail2ban, unattended-upgrades, `DOCKER-USER` guard, no snapd/ModemManager |
| Coolify | root user created headless, registration off, API on, instance URL on its own domain |
| TLS at origin | Cloudflare Origin CA certs (key generated on the server) loaded by Traefik file config |
| Cloudflare | proxied records, SSL Full (strict) **only after** the Origin CA cert is loaded, Access in front of the dashboard, `/api` + `/webhooks` bypassed |

Per-host deviations from this target (SSH source, tunnel-only API, pending cert)
are recorded in `~/.config/ai-local/fleet-inventory.md`, not here.

## 1. Host baseline (before Coolify)

1. Update, then install only `unattended-upgrades fail2ban ufw`. Purge `snapd` and
   `modemmanager`; disable `multipathd` on a single-disk VM. fail2ban: an `sshd`
   jail in `/etc/fail2ban/jail.d/sshd.local` (4–5 tries / 10 min, 1 h ban) with
   `ignoreip = 127.0.0.1/8 ::1 10.0.0.0/8 172.16.0.0/12` so Coolify's own SSH to
   localhost from its containers is never banned. Unattended-upgrades without an
   automatic reboot; reboots are watched.
2. sshd: write `/etc/ssh/sshd_config.d/10-hardening.conf` (`PasswordAuthentication no`,
   `KbdInteractiveAuthentication no`, `PermitRootLogin prohibit-password`,
   `MaxAuthTries 3`, `X11Forwarding no`) **and delete cloud-init's
   `50-cloud-init.conf`**, which sets `PasswordAuthentication yes` and would win.
   `sshd -t`, restart, open a second SSH session before closing the first.
3. `/etc/sysctl.d/90-coolify.conf`: `vm.swappiness=10`, inotify watches/instances up,
   `net.core.somaxconn=4096`. Cap journald (`SystemMaxUse=500M`). Keep the
   provider's swap file.
4. Attach the provider firewall **before** installing Docker: Docker-published ports
   bypass UFW. Prove enforcement with a probe: open a UFW-allowed, provider-blocked
   port (`python3 -m http.server`), confirm it times out from outside, then remove it.
   Do not trust the provider's group counters (Vultr's API reported 0 instances and
   0 rules for an enforced group). Use `pkill -x`/a PID, not `pkill -f <pattern>`,
   inside the same SSH command, or it kills its own shell.
5. After Docker exists (step 2), add a `DOCKER-USER` guard as defence in depth
   behind the provider firewall: a small script plus a systemd unit ordered
   `After=docker.service` (`PartOf=docker.service` so it re-applies on restart)
   that drops TCP 8000/6001/6002/8080 arriving on the public interface, matched on
   the conntrack original port (`-m conntrack --ctorigdstport`). Loopback stays
   open, so the SSH tunnel keeps working. Prove it with an outside probe.

## 2. Install Coolify and the root user without a browser race

1. Keep 8000/6001/6002 closed at the provider firewall (use an SSH tunnel), review
   the official installer script, then run it. It installs Docker and writes
   `daemon.json` with json-file log rotation (10m x 3); verify rather than
   re-adding it. Disable automatic updates (Settings → Updates → Disabled, or
   `AUTOUPDATE=false` in `/data/coolify/source/.env`, which then overrides the
   dashboard) so upgrades are manual and watched.
2. The first registrant becomes owner, and the installer shows a 10-minute window
   (`docker restart coolify` reopens it). Never open `/register` in a browser.
   Preferred (documented in Coolify's installation page, "Advanced installations
   → Root user"): pass `ROOT_USERNAME`, `ROOT_USER_EMAIL` and `ROOT_USER_PASSWORD`
   to the installer environment so the root user exists before the page is
   reachable. Read the password from stdin in the remote shell (for example
   `read -r ROOT_USER_PASSWORD; export ROOT_USER_PASSWORD`), never from a
   command-line argument or the docs' inline example. Fallback on an existing install: the official
   seeder, again with the password on stdin so it never reaches argv or `.env`:

   ```bash
   secrets-env get <PASSWORD_VAR> | ssh root@<host> \
     "docker exec -i coolify sh -c 'read -r P; ROOT_USER_EMAIL=<email> ROOT_USER_PASSWORD=\"\$P\" php artisan db:seed --class=RootUserSeeder --force'"
   ```

   It creates user id 0 as team-0 owner and disables registration. The password
   must have upper, lower, digit and symbol and pass the breached-password check.
   Confirm with `Auth::validate` in a PHP one-off, not the seeder's SUCCESS line.
3. Recovery is `docker exec -it coolify php artisan root:reset-password` (needs a TTY).
4. Copy `/data/coolify/source/.env` off the host (0600, compare sha256 both sides).

## 3. Dashboard domain and API

1. Set the instance URL the way the Settings page does, so Traefik gets its routes
   (dashboard, `/app` realtime, `/terminal/ws`):

   ```bash
   docker exec coolify php artisan tinker --execute='$s=instanceSettings(); $s->fqdn="https://<dashboard-host>"; $s->save(); App\Models\Server::find(0)->setupDynamicProxyConfiguration();'
   ```

   This writes `/data/coolify/proxy/dynamic/coolify.yaml`; 6001/6002 are no longer
   needed once it works.
2. If Let's Encrypt was attempted while DNS still pointed elsewhere, Traefik does not
   retry: `docker restart coolify-proxy` after DNS is correct.
3. API: set `is_api_enabled`, create a token for user 0 with
   `createToken(<name>, ["root"], now()->addDays(365), 0)` in tinker, and pipe the
   output straight into `secrets.env` without printing it. Drive it through a
   per-instance wrapper (`<account>-coolify`) that passes the token per call.
   A sudden API 401 can mean the row vanished from `personal_access_tokens`; check
   that table before debugging the network.
4. Verify 8000/6001/6002 are still closed from outside (provider firewall,
   `DOCKER-USER` guard; UFW denies them too). If a rule was opened for a
   one-off, remove it now (rule changes take about a minute to apply).
   Emergency access: `ssh -L 8000:localhost:8000 root@<host>`.

## 4. Sites through Cloudflare (Origin CA)

1. Generate the key **on the server** and send only the CSR to the API:

   ```bash
   ssh root@<host> 'cd /data/coolify/proxy/certs && umask 077 && openssl ecparam -name prime256v1 -genkey -noout -out <name>.key && openssl req -new -key <name>.key -subj "/CN=<host>"'
   # POST /client/v4/certificates  {"hostnames":[...],"requested_validity":5475,"request_type":"origin-ecc","csr":...}
   ```

   Install the returned PEM next to the key (0600), check that the cert and key public
   keys match, and load both with a dynamic file:

   ```yaml
   tls:
     certificates:
       - certFile: /traefik/certs/<name>.pem
         keyFile: /traefik/certs/<name>.key
   ```

   `/data/coolify/proxy` is mounted at `/traefik`. While a valid Let's Encrypt cert
   exists for a host, Traefik keeps serving it; the Origin CA cert takes over when
   that one cannot renew, so a DNS-only host is not broken by adding the file.
2. Never point a proxied record at the server before something serves that host:
   Cloudflare answers 526 (no valid origin cert) and the origin answers 503 (no
   router). Create the Coolify app and the cert first, then switch DNS.
3. Static site from a private repo (Coolify GitHub App): Nixpacks, `is_static` true
   (set with PATCH; the create call ignored it), `static_image` `nginx:alpine`,
   `publish_directory`, a build command, and an install command override when
   `devDependencies` only hold dev tooling (for example Playwright). A Cloudflare
   `_headers` file is ignored by nginx; put the same headers in the app's
   `custom_nginx_configuration` (base64 via API), starting from Coolify's
   `defaultNginxConfiguration('static')`, plus `server_tokens off`.
4. Deploys are `POST /api/v1/deploy {"uuid": ...}` (GET is rejected); poll
   `/api/v1/deployments/<uuid>`.

## 5. Cloudflare zone settings

- SSL Full (strict) — **only after** §4's Origin CA cert is installed and Traefik
  serves it. Switching first makes every proxied request that reaches the origin
  answer 526, while the Access login page still loads, so the break shows only
  after login. Order: Full → install cert → verify `/api` through Cloudflare →
  strict, and roll back to Full if that check fails. If the zone must stay Flexible for other hosts, add a
  Configuration Rule (`http_config_settings`, `http.host eq "<host>"`, `ssl: strict`)
  instead of changing the zone. Without it a proxied Coolify host loops on Traefik's
  HTTP→HTTPS redirect. Error 10003 from a phase entrypoint GET means "no ruleset yet",
  not missing permission; a PUT replaces every rule in that phase, so read it first.
- Min TLS 1.2, TLS 1.3, HTTP/3, HSTS about 6 months without subdomains or preload
  until every subdomain is HTTPS-only.
- Cache: Smart Tiered Cache; a cache rule respecting origin headers for immutable
  media and `/_next/image` + `/_next/static/` (extensionless `/_next/image` is not
  cached by default); never cache admin, API, account, cart or checkout paths.
- Reachability across Indonesia: keep Security Level medium; do not enable Under
  Attack, country blocks or Bot Fight Mode (it challenges mobile visitors and breaks
  payment callbacks).

## 6. Dashboard behind Cloudflare Access

- Self-hosted app on the dashboard host with an allow policy for the owner email via
  the One-time PIN IdP; a second app with a **bypass** policy on `<host>/api` and
  `<host>/webhooks` so the CLI token and GitHub App webhooks keep working.
- Coolify Sentinel pushes to `http://coolify:8080` inside Docker, so Access does not
  affect it; re-check `PUSH_ENDPOINT` after upgrades.

## 7. Lock the origin to Cloudflare

- Add the Cloudflare-source rules first, then delete the public 80/443 rules. With
  vultr-cli, `--source cloudflare` still needs `--subnet 0.0.0.0 --size 0`
  (`::`/0 for v6).
- Prove it: direct `nc` to origin 80/443 times out; every hostname answers through
  Cloudflare; the API still answers.
- Consequences: `cf-connecting-ip` is now a trustworthy client IP for apps; HTTP-01
  Let's Encrypt can no longer renew (Origin CA covers it; Traefik logs ACME errors).

## Cloudflare API token for this runbook

One custom token, scoped to the zones involved (check the zone list after creation;
the scope is easy to leave at "all zones"):

| Type | Permission | Access |
|---|---|---|
| Zone | Zone | Read |
| Zone | DNS | Edit |
| Zone | SSL and Certificates | Edit |
| Zone | Zone Settings | Edit |
| Zone | Config Rules | Edit |
| Zone | Cache Rules | Edit |
| Zone | Cache Purge | Purge |
| Account | Workers Scripts | Edit (only to detach a Worker custom domain) |
| Account | Access: Apps and Policies | Edit |
| Account | Access: Organizations, Identity Providers, and Groups | Edit |

Backup buckets (R2/S3) get their own write-only, bucket-scoped credentials, never
this token.

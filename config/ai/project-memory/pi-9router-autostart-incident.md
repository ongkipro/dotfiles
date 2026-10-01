---
name: pi-9router-autostart-incident
description: Why 9router must run only as the systemd user unit: the 2026-08 stale/LAN-exposed/tunneled incident, its real cause (XDG autostart), and the diagnosis rule
metadata:
  node_type: memory
  type: project
---

**2026-08-19 — INCIDENT: 8-day stale instance, LAN-exposed, publicly tunneled.** The
manual restart pattern below (`setsid nohup 9router --tray ...`) launches its own
`next-server` on :20128 **and starts a systemd unit `9router.service` that ALSO
binds :20128** — two independent launch mechanisms racing for one port. On
2026-08-11 19:14 the manual tray process won the race; two minutes later the
systemd unit crash-looped on the port conflict, hit `StartLimitBurst`, and sat in
`failed` state — unnoticed — for 8 days. Worse: the tray instance had
`tunnelEnabled:true` at launch, so a Cloudflare quick tunnel (`cloudflared tunnel
--url http://127.0.0.1:20128`) ran continuously the whole time, exposing this
box's 9Router — with live Codex/Gemini/OpenCode/MiniMax provider credentials
attached — to the public internet, contrary to the "Tunnel = OFF" policy set
2026-07-03. A `npm i -g 9router@latest` on 2026-08-17 replaced the package files
on disk while the stale process kept running from the now-deleted directory
(`cwd -> .../9router/app (deleted)`), so it was also several versions behind
what `npm ls -g` reported. Found and fixed 2026-08-19: killed the orphan tree
(cloudflared → next-server → tray cli), `systemctl --user reset-failed
9router.service`, `systemctl --user restart 9router.service`. Now bound to
`127.0.0.1:20128` only (was `0.0.0.0`), no cloudflared process, `/v1/chat/completions`
verified with a real completion.

**2026-08-27 — SAME INCIDENT RECURRED, and the 2026-08-19 fix note was wrong
about the cause.** Found again: `9router.service` `failed`, port bound to
`0.0.0.0`, a `cloudflared` quick tunnel running publicly — identical shape,
started 2026-08-25 21:49, two days before this was caught. The 2026-08-19 entry
assumed a human re-ran `setsid nohup 9router --tray ...`; nobody did. The real
trigger is **`~/.config/autostart/9router.desktop`**, an XDG autostart entry
(`X-GNOME-Autostart-enabled=true`, `Exec=... cli.js --tray --skip-update`) that
launches tray mode on every desktop login — a mechanism no AI session's memory
note can reach, since the desktop session manager never reads it. This is why a
purely procedural fix ("don't type this command") could not hold: the trigger
was never a typed command.

**Actual fix: disabled the autostart entry.** Copied to
`~/.config/ai-local/9router.desktop.disabled-2026-08-27` (in case the tray icon
was wanted for a reason not yet known) and removed from `~/.config/autostart/`.
Re-killed the orphan tree, `systemctl --user reset-failed && restart
9router.service`, re-verified `127.0.0.1`-only + no `cloudflared` + a real
completion. **If this recurs a third time, check `~/.config/autostart/` and any
other per-user XDG/systemd autostart path again before assuming a human cause**
— the failure mode here was trusting a plausible narrative (someone ran a
command) over checking what actually launched the process (`ps -o ppid`,
`lstart`, then trace the parent to its origin).

**The fix is procedural, not just a restart: `systemctl --user ...` (see
`skills/local/9router/SKILL.md`) is the ONLY sane way to run this now.** The
`setsid nohup 9router --tray ...` command in the two entries below is what
caused this incident — do not run it while `9router.service` exists. If a
manual restart is ever needed, use `systemctl --user restart 9router.service`,
never the tray command.

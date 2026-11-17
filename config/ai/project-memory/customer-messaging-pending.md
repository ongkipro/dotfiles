---
name: customer-messaging-pending
description: Email provider and WhatsApp (WABA) choice for 99ribu and bukalaris is still undecided (geraiexpress-cfv2 decided: Cloudflare Email Sending + click-to-chat WA per DEC-227).
metadata:
  node_type: memory
  type: project
---

# Customer messaging decision — pending

As of 2026-11-17:
- **GeraiExpress (`~/Projects/geraiexpress-cfv2`):** DECIDED in `DECISIONS.md` (`DEC-227` — Cloudflare Email Sending via `send_email` binding on `mail.geraiexpress.com`; WhatsApp uses operator click-to-chat `wa.me`, no third-party WABA gateway at launch). Tenant white-label zone is `geraimitra.com` (`DEC-234`); dedicated Vultr VPS is retired and `partner-relay` co-hosts on `99ribu-prod` (`DEC-235`).
- **99ribu and Bukalaris:** transactional email provider and WhatsApp (WABA) setup remain UNDECIDED. Do not treat any provider as chosen for them.

- Discussion and recommendation (Resend + subdomain SPF/DKIM/DMARC; official WABA Cloud API
  only): `~/Documents/work/notes/2026-10-28-email-whatsapp-delivery.md`.
- Once decided, the outcome is recorded in each repository's `DECISIONS.md`; repositories own
  the decision, this file only points to the open question. Delete this file after that.
- Coolify email alerts on the active hosts (see `~/.config/ai-local/fleet-inventory.md`) wait for the same decision (see [[coolify-vps-dev]]).

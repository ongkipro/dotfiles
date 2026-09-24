---
name: coolify-vps-dev
description: Durable Coolify recovery and access invariants; live host/account details stay device-local and must be re-verified.
metadata:
  node_type: memory
  type: project
---

# Coolify VPS durable reference

## Authority boundary

Do not store live host addresses, account emails, user IDs, passwords, auth state, or provider-specific recovery credentials in tracked memory. Keep current access facts in `~/.config/ai-local/` and verify the running Coolify instance before acting.

## Recovery invariant

If email-based password recovery is intentionally unavailable, preserve a tested console/CLI recovery path. Do not trust a success message alone after changing authentication state; verify the intended account can actually authenticate.

Some Coolify maintenance commands require a real TTY. When a password/reset command is interactive, do not pipe secret input through a non-TTY shell path merely to automate it. Use the supported interactive recovery route and verify the result.

## Operational rule

Current container names, user records, SMTP state, and provider/network details are runtime facts. Inspect them on the target host instead of relying on this memory file.

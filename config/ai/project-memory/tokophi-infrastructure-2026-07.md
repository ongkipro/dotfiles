# TokoPhi infrastructure reference

> Durable infrastructure lessons only. Live provider, billing, host, instance, SSH, DNS, backup, and deployment state must be re-verified from the provider and project repository before acting.

## Authority boundary

Tracked memory must not contain current host addresses, instance/account identifiers, billing balances, access identities, recovery credentials, or secret-bearing backup locations. Keep those facts in `~/.config/ai-local/` or the provider/project system that owns them.

Repository and provider state outrank this note.

## Durable infrastructure invariants

- Never assume an old VPS size, price, balance, or instance still exists; query the provider before making a cost or migration decision.
- A server SSH key that exists on only one device is a recovery risk. Keep private keys outside dotfiles and maintain a provider-console recovery path.
- Backups must leave the server. Database dumps and deployment/config backups should be restorable independently of provider snapshots.
- A successful dump is not enough; verify restore metadata or perform a restore drill appropriate to the project.
- Back up the deployment orchestrator's own internal database (e.g. a self-hosted PaaS), not only application databases; without it, restored apps lose their deployment definitions.
- Provider snapshots are convenience, not the only recovery plan.
- Avoid exporting provider API credentials from shell startup files that are copied into dotfiles.
- Keep application deployment host-agnostic where practical so origin migration does not require product rewrites.

## TokoPhi deployment direction

The durable pattern is Cloudflare at the edge with a self-hosted application/database origin managed through the project's deployment system. Exact provider, region, plan, DNS state, and migration timing are live operational facts and must be checked before use.

# Safety Policy

Stop before secrets, destructive filesystem changes, system-wide sudo, production deploys, publishes, DNS, remote database mutation, bulk Shopify mutation, and overlapping unrelated git changes.

Allowed: detect secret files exist. Not allowed: print their contents or store secret values.

Always check local evidence first; do not force logout/login for account questions. Prefer project-scoped tokens/env isolation.

# Validation Policy

Use project-native scripts after reading `package.json`.

Typical order: typecheck/check -> lint -> focused tests -> build -> preview/QA.

Cloudflare binding/config changes may need `wrangler types`. Deploy only with explicit approval.

Browser-visible changes should be checked via localhost preview and agent_browser when practical.

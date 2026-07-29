---
name: npm-install-needs-sandbox-disabled
description: npm install fails with ENOTFOUND (no network) unless run with dangerouslyDisableSandbox
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 870b6145-c08c-4c8e-977c-8b5e01adcffd
---

In this environment, `npm install <pkg>` (and anything hitting the npm registry / network) **fails with `ENOTFOUND registry.npmjs.org`** when run normally or in `run_in_background` — the sandbox blocks network. Run the install Bash call with `dangerouslyDisableSandbox: true` to get network access.

**Why:** discovered 2026-06-24 installing `three @react-three/fiber @react-three/drei` for the 3D office sim — a background install reported exit 0 but actually failed (ENOTFOUND, masked by `| tail`); re-running with `dangerouslyDisableSandbox: true` succeeded.

**How to apply:** for `npm install`, `npm ci`, or any network fetch, pass `dangerouslyDisableSandbox: true`. Also: don't trust exit code when piping to `tail` — verify the package actually landed (`ls node_modules/<pkg>`).

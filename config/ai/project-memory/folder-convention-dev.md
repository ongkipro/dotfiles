---
name: folder-convention-dev
description: Where specs/docs vs project code live on this machine
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 06f57980-704a-4ea8-b91d-0bb76c175aa4
---

User's folder convention (keep tidy):
- `~/projects/` = **project output / actual built code** only.
- `~/Documents/Development/` = **specs, docs, planning** repos (the thinking, not the build output).

**Why:** separate concept/spec from code output so `~/projects` stays clean.
**How to apply:** put spec/documentation repos under `~/Documents/Development/`; reserve `~/projects/` for the implementation that gets built.

Current: the **affiliate-portal-specs** repo (Medium-style affiliate publishing platform spec, GitHub ongkipro/affiliate-portal-specs) lives at `~/Documents/Development/affiliate-portal-specs`. Its implementation repo (`affiliate-portal-engine`) would go under `~/projects/` when built. See [[affiliate-portal-specs-project]].

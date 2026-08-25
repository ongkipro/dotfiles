---
name: folder-convention-dev
description: Canonical staging and repository locations for development work
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 06f57980-704a-4ea8-b91d-0bb76c175aa4
---

Canonical locations:

- `~/Projects/<slug>/` contains an existing project's source code and
  repository-owned contracts.
- `~/Documents/work/prd/<slug>/` contains accepted planning artifacts only
  before the repository exists or before they are promoted with `project-init`.
- `~/Documents/work/{research,content,notes}/` contains non-authoritative drafts
  and working material.

After promotion, the repository copy is authoritative. Never use an older
`~/Documents/` snapshot to determine current project status.

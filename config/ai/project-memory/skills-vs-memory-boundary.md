---
name: skills-vs-memory-boundary
description: "Keep project reference context out of reusable skills and project truth inside each repository"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5d5ae19e-dfd5-45e1-bce7-c56c1c868e3c
  modified: 2026-08-10T16:47:35.000Z
---

Project-specific business context, legal context, user preferences, and pointers
may remain in project-memory. They must never become skills under
`~/dotfiles/skills/local/`; skills contain reusable cross-project methodology.

Current status, accepted requirements, technical decisions, architecture, tasks,
and build evidence belong in the project repository. Project-memory may point to
those files or retain explicitly historical context, but it is never authoritative.
When memory and repository disk disagree, repository disk wins and the stale
memory must be corrected.

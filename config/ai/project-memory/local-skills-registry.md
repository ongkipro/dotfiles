---
name: local-skills-registry
description: Canonical owned-skill discovery, update boundaries, and executable verification pointers
metadata:
  node_type: memory
  type: project
---

# Local Skills Registry

Owned capabilities live in `~/dotfiles/skills/local/`. The generated
[domain map](../../../skills/local/README.md) owns inventory and routing;
[[skill-plumbing]] owns runtime-link reference. Use `skill-list` or disk before
quoting a count. `skill-update` reconciles links, never downloads upstream code.

Project-specific facts belong in the project's repository and narrow project
memory, not a project-named skill that duplicates implementation truth. Create
a skill only for a reusable methodology gap with clear ownership.

## Verify a skill before claiming completion

Read the selected skill's current entrypoint and run its declared executable
checks. Past test counts, CI run IDs, and line numbers do not establish the
current revision. A workflow file alone does not prove a hosted CI run passed;
match any cited run to the revision it actually tested.

For specification-pack maintenance, start with
[development-spec-suite](../../../skills/local/development-spec-suite/SKILL.md)
and load its implementation-status reference only when that maintenance task
requires it. Do not repeat its changing backlog or CI status here.

The historical linker regression is guarded by `bin/skill-update-test`.
Never replace a path resolving inside the owned source or remove Codex's native
`.system` directory. Check link health with `ai-doctor`.

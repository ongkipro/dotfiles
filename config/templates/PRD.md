# Product Requirements — {{PROJECT_NAME}}

Status: Draft
Updated: {{DATE}}

## Problem

{{DESCRIPTION}}

## Users and current workaround

No users are accepted yet. Name each role, its job, and how it copes today.

| Role | Job to be done | Current workaround | Evidence status |
|---|---|---|---|
| [Role] | [Job] | [What they do today and why it hurts] | Observed / Assumption |

First-use journey: [Entry point] -> [first meaningful action] -> [first observable success].

## Goals

No goals are accepted yet. Define measurable outcomes before implementation begins.

## Success measure

No success measure is accepted yet. Name the metric, baseline, target, and when it is read.

## Non-goals

No non-goals are accepted yet.

## Core features

No core features are accepted yet. Each feature names its priority, the user benefit, and the requirements that realize it.

| Feature | Priority | User benefit | Requirements |
|---|---|---|---|
| [Feature] | Must / Should / Could | [Observable benefit to a named role] | REQ-[N] |

## Requirements

No product requirements are accepted yet. Add stable requirement IDs before creating implementation tasks.

Requirement format (EARS statement, MoSCoW priority, one Given/When/Then per requirement; required for every `Must`):

```markdown
- **REQ-001** (Must, event) When <trigger>, the system shall <response>.
  - Acceptance: Given <precondition>, When <action>, Then <observable result>.
```

## Acceptance criteria

Per-requirement Given/When/Then lives under each `REQ-*` above. Record here only release-level acceptance that spans requirements.

## Open questions

Capture only questions whose answers materially change product behavior or architecture, including contradictions found by the consistency review.

## Bootstrap decisions

These values describe user-selected direction, not completed integrations:

- Stack: `{{STACK}}`
- Database: `{{DATABASE}}`
- Authentication: `{{AUTH}}`
- Deployment target: `{{DEPLOY}}`

Product requirements, data ownership, identity flows, runtime topology, and
operational acceptance criteria remain unresolved until explicitly accepted.

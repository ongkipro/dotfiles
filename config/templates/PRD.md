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

## Quality attributes

No quality targets are accepted yet. The table is a menu: keep only rows that
apply. Accepting a row means writing its target as a ubiquitous `REQ-*` ("The
<surface> shall …") and citing that ID here; the requirement holds the value, this
table only routes it. A target with no enforcing command is a wish, not a requirement.

| Attribute | Candidate target | Measured by | Enforced by | REQ |
|---|---|---|---|---|
| Web vitals (field p75, mobile and desktop) | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | CrUX/RUM; before traffic, lab LCP and CLS with TBT as the INP proxy | [CI step or command] | — |
| JavaScript budget per page type | [KB compressed] | Bundle report | [CI step] | — |
| Backend latency | [pN of <endpoint> < X ms] | [Load test or metrics] | [Command] | — |
| Availability and recovery | [SLO, RPO/RTO] | `OBSERVABILITY.md` probes | [Probe] | — |
| Security verification level | OWASP ASVS L1 baseline; L2 for most production apps with auth or personal data; L3 for high-assurance financial apps (local policy) | `ARCHITECTURE.md` threats | [Tests] | — |
| Accessibility | WCAG 2.2 AA | axe and keyboard pass | [Browser check] | — |

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

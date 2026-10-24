# Architecture — {{PROJECT_NAME}}

Updated: {{DATE}}
Expected stack: {{STACK}}

## Selected capabilities

| Capability | Decision | Proven operational |
|---|---|---|
| Database | `{{DATABASE}}` | No |
| Authentication | `{{AUTH}}` | No |
| Deployment target | `{{DEPLOY}}` | No |

Bootstrap source state: {{GENERATED_STATE}}. These selections constrain future
architecture work but do not create services, credentials, schemas, or remote
resources.

## Current system

Architecture is not documented yet. Inspect the repository and describe only components and data flows proven by code or runtime configuration.

## Boundaries

Record system boundaries, trust boundaries, external integrations, and ownership before adding diagrams.

## Threats and controls

Not assessed yet. Required once the system handles authentication, payments,
personal or tenant data, uploads, webhooks, or server-side fetches of
user-supplied URLs; otherwise state `Not applicable: <reason>`. Answer what can go wrong at each
boundary above and what the system does about it:

| Boundary or component | Threat (STRIDE category) | Response: mitigate / eliminate / transfer / accept | Enforced in, tested by |
|---|---|---|---|
| [Real component] | [What goes wrong] | [Response; accepted risk names reason and owner] | [File and test] |

Each row names a component that exists in this repository. Revisit when a
boundary, data class, or integration changes.

## Data

Record authoritative data stores, invariants, migration constraints, and retention requirements when present.

## Decisions

Record accepted constraints in `DECISIONS.md`. Costly-to-reverse decisions may
also have detailed ADRs; create that directory only when the first ADR exists.

## Verification

List the smallest commands or runtime scenarios that prove architectural changes behave as intended.

# Cloudflare Worker Playbook

## Primary intent

Use this playbook when building, extending, reviewing, or deploying Cloudflare Workers projects.

## First principles

1. Prefer Cloudflare's current docs over memory
2. Prefer `wrangler.jsonc` unless a project is already standardized on something else
3. Prefer TypeScript for new work
4. Prefer small, composable Workers over one giant entrypoint
5. Prefer bindings over manual REST calls where possible
6. Prefer explicit environments for staging and production
7. Never hardcode secrets
8. Run the smallest safe change that solves the task

## Decision tree

### If the task is new project setup
- Confirm whether this is:
  - plain Worker
  - Worker + Hono API
  - Worker + Static Assets
  - Worker + D1
  - Worker + Queues / DO / R2 / KV
- Prefer existing project scaffolds if the team already uses one
- Otherwise create the smallest viable baseline and document the bindings

### If the task is an API change
- inspect current routing first
- preserve the project's existing route style
- if Hono is already present, keep using Hono
- if raw `fetch()` handler is already present, do not force a rewrite without reason

### If the task is data-related
- identify binding type first: D1, KV, R2, DO, Queue, Vectorize
- keep schema and migrations explicit
- document every new binding in config and generated types

### If the task is deployment-related
- verify auth, environment, and target app name first
- prefer dry run / validation before deploy where possible
- separate local fixes from deploy steps in the final summary

## Standard workflow

1. Read the repo structure
2. Read existing `wrangler.jsonc` or equivalent config
3. Read entrypoints and route files
4. Check bindings and generated env/types
5. Make the smallest consistent change
6. Run validation relevant to the stack
7. Summarize changed files, runtime impact, and follow-ups

## Validation minimums

- config sanity check
- TypeScript check when TS exists
- lint if already configured
- tests if already configured
- `wrangler types` after binding changes
- deployment only when explicitly requested

## Default file expectations for new projects

- `src/` for source
- `src/index.ts` or `src/worker.ts` for entry
- `wrangler.jsonc`
- generated worker env/types file when applicable
- `.dev.vars` for local secrets only
- `README.md` with local run + deploy notes

## Binding rules

### D1
- keep migrations in a dedicated directory
- never hide schema changes inside unrelated files
- document local and remote migration commands

### KV
- use for simple key/value and cache-like data
- avoid pretending KV is strongly consistent relational storage

### R2
- use for object/file workflows
- keep upload/download code streaming-aware

### Durable Objects
- use only when coordination or per-entity state is required
- avoid introducing DOs when a simpler binding works

### Queues
- move slow or retryable work off the request path

## Config rules

- keep a recent `compatibility_date`
- use `nodejs_compat` only when needed or already standardized
- use environment sections for staging/prod differences
- keep resource names obvious and stable

## Secrets rules

- never put secrets in source
- never put secrets in committed config
- use Wrangler secret flows or platform-approved secret storage
- mention missing secrets as setup follow-ups, not hidden assumptions

## Review rules

When reviewing Cloudflare Worker code, explicitly check for:

- wrong binding names
- missing generated types
- blocking / non-streaming large payload handling
- floating promises
- accidental Node-only APIs without compatibility support
- request-scoped data stored in globals
- unbounded background work not using the right pattern
- deploy config drift vs source code expectations

## Final-answer contract

When finishing a Worker task, report:

- what changed
- which Cloudflare resources are involved
- whether config or bindings changed
- what validation ran
- what still needs manual action, if any

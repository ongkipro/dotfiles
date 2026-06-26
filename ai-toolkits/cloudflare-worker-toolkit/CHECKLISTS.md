# Cloudflare Worker Checklists

## New feature checklist

- [ ] Read worker entrypoint and config first
- [ ] Confirm existing framework/style before adding code
- [ ] Identify bindings touched
- [ ] Update config if bindings changed
- [ ] Regenerate types if needed
- [ ] Keep secret handling out of source
- [ ] Run validation already used by the project
- [ ] Summarize manual follow-ups

## New project checklist

- [ ] Choose minimal architecture
- [ ] Add `wrangler.jsonc`
- [ ] Set `compatibility_date`
- [ ] Add source entrypoint
- [ ] Define bindings clearly
- [ ] Add local run instructions
- [ ] Add deploy instructions
- [ ] Add `.dev.vars` guidance

## Review checklist

- [ ] Config matches code
- [ ] Binding names match generated types
- [ ] No hardcoded secrets
- [ ] No obvious Cloudflare anti-patterns
- [ ] Async/background work is handled safely
- [ ] Response/body handling is size-aware
- [ ] Environment-specific behavior is explicit

## Deploy checklist

- [ ] Correct account/project target
- [ ] Correct environment target
- [ ] Secrets already set
- [ ] Migrations handled if applicable
- [ ] Validation completed
- [ ] User explicitly asked to deploy

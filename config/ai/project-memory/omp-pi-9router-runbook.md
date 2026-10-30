---
name: omp-pi-9router-runbook
description: What OMP and Pi each need to run Claude/Codex through a device-local 9Router without drops; verified retry ceilings, wire shape, account rotation, and the diagnostic that separates a client problem from a quota problem
metadata:
  node_type: memory
  type: project
---

# OMP and Pi through 9Router: configuration runbook

Device-local facts (URL, key, accounts) stay in each runtime's own files and in
`secrets-env`. This records the shape that works and why, so a future device or
upgrade does not rediscover it.

## How 9Router reports a rate limit (observed 0.5.112)

When Anthropic answers **429**, 9Router locks that account for the model for a
short, doubling window (2 s → 4 s → 8 s → 16 s observed), tries the next
account, and when every account is locked returns **HTTP 503** with the body
`[claude/<model>] [429]: …` and a `retry-after` header equal to the lock. It
also passes the hint in prose: `reset after Ns`. Over seven days of logs the
longest lock was 16 s; 41% of locks were longer than 5 s.

Diagnostic rule: a `503 … [429]` from 9Router is **not** a gateway fault and
not a client bug; it is the upstream rate limit surfacing through the gateway.
`401 Invalid API key` is a different problem (gateway key or expired upstream
token). No 403 appeared in the period reviewed.

## OMP (verified 2026-10-30, OMP 18.13.3)

`~/.omp/agent/config.yml` (device-local, never linked from dotfiles):

```yaml
retry:
  maxRetries: 6
  maxDelayMs: 120000
  rateLimitWalksChain: false
```

Why: OMP honours the gateway's `retry-after` and compares it with
`retry.maxDelayMs`. The value is a **give-up ceiling**, not a sleep cap: when
the gateway asks for a longer wait than the ceiling, OMP fails the request at
once and walks the fallback chain. With the earlier 5000 ms the session looked
"cut off" on every lock longer than 5 s. Measured with a synthetic gateway that
mirrors 9Router's 503/`retry-after` shape, fallback disabled:

| Gateway lock | 5 000 ms | 60 000 ms | 120 000 ms |
|---|---|---|---|
| 12 s | ok | ok | ok |
| 30 s | ok | ok | ok |
| 70 s | fails in 2 s | fails in 2 s | ok, completes at 73 s |

`rateLimitWalksChain: false` keeps the turn on the rate-limited model while the
wait is below the ceiling; `true` switches models immediately, which also reads
as a drop mid-conversation. Upstream OMP defaults are 10 retries and a
5-minute ceiling; 120 s is a deliberate middle: long enough for every lock seen,
short enough that a real quota outage still falls through to the chain.

Provider shape (`~/.omp/agent/models.yml`, device-local):

- `api: openai-completions` against `<9router>/v1` with `authHeader: true`;
  OMP's native `anthropic-messages` path through 9Router failed with 429→503 on
  tool roundtrips while Pi's did not (see [[omp-9router-claude-wire]]).
- `disableStrictTools: true` and per-model `modelOverrides` from
  `config/omp/9router-compat.yml` (reasoning effort mapping, `:off` only on the
  verified disable-capable models).
- `discovery: { type: proxy }` so the model list comes from the gateway.

Live proof with `retry.modelFallback: false` (so success cannot come from native
Anthropic): Sonnet 5.5 tool roundtrip 1/1 and 5 parallel 5/5 with both accounts
rotating; Opus 5.5 10 parallel 10/10 in 8–12 s, zero 429. Repeat this check
after an OMP or 9Router upgrade:

```bash
printf 'retry:\n  modelFallback: false\n' > /tmp/nofb.yml
omp -p --model 9router/cc/claude-sonnet-5-5 --config /tmp/nofb.yml \
  'Read marker.txt with your read tool and reply with only its exact line.'
```

Wire regression without credentials: `omp-9router-claude-test` (skips with
PARTIAL where `omp` or PyYAML is absent).

## Pi (verified 2026-10-30, Pi 1.4.0)

Pi needed no change. Its provider in `~/.pi/agent/models.json` uses the same
`openai-completions` surface on `<9router>/v1`; its default
`retry.provider.maxRetryDelayMs` is 60 000 and `retry.maxAgentDelayMs` 60 000,
so every observed lock fits. Pi still records the same 429/503 events in its
sessions; it simply waits them out. Catalog sync is device-local
(`~/.config/ai-local/bin/pi-9router-local-sync.js`); the tracked seeds are
`config/pi/settings.json` and `models.template.json`, restored by the optional
`pi-9router-restore`.

## Gateway side

- Keep at least **two active Claude accounts** so a lock on one rotates to the
  other; with one account every 429 becomes a client-visible wait. Account
  status lives in the 9Router UI/DB, not in dotfiles. A deactivated account
  shows no error in the gateway log; check `isActive` before blaming clients.
- `providerStrategies.claude.fallbackStrategy: round-robin` with
  `stickyRoundRobinLimit: 1` was in force during the verified runs.
- Local listener `127.0.0.1:20128`, tailnet exposure via `tailscale serve`
  only; never a public tunnel ([[pi-9router-autostart-incident]]).

## What a future device needs

1. 9Router running and reachable; `curl …/v1/models` returns 200.
2. OMP: declare the `9router` provider in its own `models.yml`, merge
   `9router-compat.yml` overrides, set the three `retry.*` values above.
3. Pi: provider entry on `/v1` with `openai-completions`; defaults are fine.
4. Two or more upstream accounts connected in 9Router.
5. Run the live check above with fallback disabled, then
   `omp-9router-claude-test` and `omp-runtime-report`.

Related: [[omp-9router-claude-wire]], [[pi-9router-setup]],
[[pi-9router-models-compaction]].

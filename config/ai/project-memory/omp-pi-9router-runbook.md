---
name: omp-pi-9router-runbook
description: How OMP and Pi connect to a device-local 9Router; OMP needs only a five-line provider on upstream defaults, how 9Router reports rate limits, account rotation, and the check that separates a client problem from a quota problem
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

## OMP (verified 2026-10-31, OMP 18.13.3): upstream defaults plus one provider

Lesson: do not tune OMP. An earlier `~/.omp/agent/config.yml` carried 21 model
roles, 19 fallback chains, `retry.maxDelayMs: 5000` and per-model transport
overrides, each a guess added after a symptom. The drops that prompted them came
from one of those guesses. Upstream defaults are `retry.maxRetries: 10` and
`retry.maxDelayMs: 300000`, and `retry.rateLimitWalksChain: false`.

`retry.maxDelayMs` is a **give-up ceiling**, not a sleep cap. OMP honours the
gateway's `retry-after` and, when the requested wait exceeds the ceiling, fails the
request at once. With the custom 5000 ms every 9Router lock longer than 5 s read
as a dropped session, and 41% of locks were longer than 5 s (longest seen: 16 s).
The default 300 000 ms covers all of them. A synthetic gateway mirroring 9Router's
503/`retry-after` shape confirmed the rule: a 70 s lock failed in 2 s at 5 000 and
60 000 ms and completed at 73 s with 120 000 ms. The device therefore has **no**
`config.yml`; choose models with `/model` and let OMP save them.

The whole provider declaration, in `~/.omp/agent/models.yml` (device-local, mode
0600, never linked):

```yaml
providers:
  9router:
    baseUrl: <device 9Router /v1 URL>
    apiKey: "!secrets-env get NINEROUTER_REMOTE_KEY"
    authHeader: true
    discovery:
      type: proxy
```

This follows OMP's documented custom-provider shape: `discovery: proxy` lists the
gateway's models and derives each one's API from its advertised endpoint types.
Verified with default settings and `retry.modelFallback: false` (so success cannot
come from native Anthropic): `omp models 9router` listed all 14 gateway models; a
file-read tool roundtrip passed on Sonnet 5.5, Opus 5.5, Fable 5.1, Haiku 4.5, Sol
6.1 and Terra 6.1; `:off`, `:minimal` and `:high` efforts all completed; six
parallel Sonnet and Opus requests passed 6/6 in about 5 s. The earlier
`modelOverrides`, `api: openai-completions` per model, `disableStrictTools` and
`supportsStrictMode: false` were not needed (they survive as history in
`config/omp/9router-compat.yml`). `omp-9router-claude-test` stays as a
credential-free wire regression and skips with PARTIAL where `omp` or PyYAML is
absent.

Repeat the live check after an OMP or 9Router upgrade:

```bash
printf 'retry:\n  modelFallback: false\n' > /tmp/nofb.yml
omp -p --model 9router/cc/claude-sonnet-5-5 --config /tmp/nofb.yml \
  'Read marker.txt with your read tool and reply with only its exact line.'
```

Related hazard: `~/.omp` must live on the SSD. It was a symlink to `/data/ai/omp`
and OMP failed to start (`mkdir ~/.omp/natives: ENOENT`) whenever the HDD was not
mounted. Task isolation (`task.isolation.enabled`) copied whole projects into
`~/.omp/wt`, about 1.3 GB each; it is off by default.

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
2. OMP: leave settings at upstream defaults; add only the `9router` provider above
   to its own `models.yml`; run `omp models 9router`.
3. Pi: provider entry on `/v1` with `openai-completions`; defaults are fine.
4. Two or more upstream accounts connected in 9Router.
5. Run the live check above with fallback disabled, then `omp-9router-claude-test`
   and `omp-runtime-report`.

Related: [[omp-9router-claude-wire]], [[pi-9router-setup]],
[[pi-9router-models-compaction]].

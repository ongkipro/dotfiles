---
name: 9router
description: >-
  Entry point for 9Router — local/remote AI gateway with OpenAI-compatible REST
  for chat, image, TTS, STT, embeddings, web search, web fetch. One key, many
  providers, auto-fallback. Triggers: 9router, ninerouter, setup 9router,
  router ai, ai gateway, ninerouter url, ninerouter key, cek model 9router,
  daftar model 9router, 9router models, 9router health. This skill covers
  setup + indexes capability skills; fetch the relevant capability SKILL.md
  when needed.
---

# 9Router

Local/remote AI gateway exposing OpenAI-compatible REST. One key, many providers, auto-fallback.

## Setup

```bash
export NINEROUTER_URL="https://rbq97ts.abc-tunnel.us"   # or machine-configured tunnel URL
export NINEROUTER_KEY="sk-..."                         # from Dashboard / credentials
```
Capability and model requests use `${NINEROUTER_URL}/v1/...` with header `Authorization: Bearer ${NINEROUTER_KEY}` (omit if auth disabled).

Health is the intentional unversioned exception: `curl $NINEROUTER_URL/api/health` → `{"ok":true}`.

## Discover models

```bash
curl $NINEROUTER_URL/v1/models                  # chat/LLM (default)
curl $NINEROUTER_URL/v1/models/image            # image-gen
curl $NINEROUTER_URL/v1/models/tts              # text-to-speech
curl $NINEROUTER_URL/v1/models/embedding        # embeddings
curl $NINEROUTER_URL/v1/models/web              # web search + fetch (entries have `kind` field)
curl $NINEROUTER_URL/v1/models/stt              # speech-to-text
curl $NINEROUTER_URL/v1/models/image-to-text    # vision
```

Use `data[].id` as `model` field in requests. Combos appear with `owned_by:"combo"`.

Response shape:
```json
{ "object": "list", "data": [
  { "id": "openai/gpt-5", "object": "model", "owned_by": "openai", "created": 1735000000 },
  { "id": "tavily/search", "object": "model", "kind": "webSearch", "owned_by": "tavily", "created": 1735000000 }
]}
```

## Status & Health Verification

9router status is **per-machine** and changes. Check it directly — and a
passing health check alone does NOT prove the systemd-managed instance is what
answered it (see the incident below), so verify the bind address too:

```bash
systemctl --user is-enabled 9router.service
systemctl --user is-active 9router.service
curl http://localhost:20128/api/health
ss -ltnp | grep 20128        # must show 127.0.0.1:20128, never 0.0.0.0:20128
pgrep -fa cloudflared        # must be empty — no process, no output at all
```

Should return `{"ok":true}`.

Test chat completion or models with authorization:

```bash
curl -s -H "Authorization: Bearer ${NINEROUTER_KEY}" "${NINEROUTER_URL:-https://rbq97ts.abc-tunnel.us}/v1/models"
```

If the port shows `0.0.0.0` or a `cloudflared` process exists, something other
than `9router.service` is serving it. Trace the real launcher before trusting
the health check:

```bash
fuser 20128/tcp                                  # PID actually bound
ps -o pid,ppid,lstart,cmd -p <pid>               # when/how it started
ps -o pid,ppid,lstart,cmd -p <its ppid>          # its parent, repeat to the root
```

Twice on this device the root was `~/.config/autostart/9router.desktop`, an
XDG autostart entry launching `cli.js --tray` on every desktop login —
independent of any shell history or AI-session memory, so a procedural
"don't run that command" fix does not hold if this is the cause. Check
`ls ~/.config/autostart/` for a 9router entry before assuming a human restarted
it manually.

While 9router is off, any pi feature routed through it — custom models in
`/model`, image generation, and other flows that depend on this local gateway —
will fail. Pi still runs through other providers when configured that way.

## Capabilities

Read the reference file for the endpoint you need — don't load them all:

| Capability | Reference | Endpoint |
|---|---|---|
| Chat / code-gen | `references/chat.md` | `/v1/chat/completions` + `/v1/messages` |
| Image generation | `references/image.md` | `/v1/images/generations` |
| Text-to-speech | `references/tts.md` | `/v1/audio/speech` |
| Speech-to-text | `references/stt.md` | `/v1/audio/transcriptions` |
| Embeddings | `references/embeddings.md` | `/v1/embeddings` |
| Web search | `references/web-search.md` | `/v1/search` |
| Web fetch (URL → markdown) | `references/web-fetch.md` | `/v1/web/fetch` |

## Errors

- 401 → set/refresh `NINEROUTER_KEY` (Dashboard → Keys)
- 400 `Invalid model format` → check `model` exists in `/v1/models/<kind>`
- 503 `All accounts unavailable` → wait `retry-after` or add another provider account

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
export NINEROUTER_URL="http://localhost:20128"      # or VPS / tunnel URL
export NINEROUTER_KEY="sk-..."                      # from Dashboard → Keys (only if requireApiKey=true)
```

All requests: `${NINEROUTER_URL}/v1/...` with header `Authorization: Bearer ${NINEROUTER_KEY}` (omit if auth disabled).

Verify: `curl $NINEROUTER_URL/api/health` → `{"ok":true}`

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

## Capability skills

When the user needs a specific capability, load the relevant skill:

| Capability | Skill name | Deskripsi |
|---|---|---|
| Chat / code-gen | `9router-chat` | `/v1/chat/completions` + `/v1/messages` |
| Image generation | `9router-image` | `/v1/images/generations` |
| Text-to-speech | `9router-tts` | `/v1/audio/speech` |
| Speech-to-text | `9router-stt` | `/v1/audio/transcriptions` |
| Embeddings | `9router-embeddings` | `/v1/embeddings` |
| Web search | `9router-web-search` | `/v1/search` |
| Web fetch (URL → markdown) | `9router-web-fetch` | `/v1/web/fetch` |

## Errors

- 401 → set/refresh `NINEROUTER_KEY` (Dashboard → Keys)
- 400 `Invalid model format` → check `model` exists in `/v1/models/<kind>`
- 503 `All accounts unavailable` → wait `retry-after` or add another provider account

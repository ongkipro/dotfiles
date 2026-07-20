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

## Status: 9router MATI (sejak 2026-07-13, disengaja)

Service di-`stop`+`disable`; port 20128 tutup. Cek: `systemctl --user is-enabled 9router.service`.
Hidupkan: `systemctl --user enable --now 9router.service`.
Konsekuensi saat OFF: pi image-gen & compaction via 9router gagal. **Chat utama pi tetap jalan** (default = provider NATIVE `minimax`/`MiniMax-M3`, tidak lewat 9router).

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

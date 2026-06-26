# Cloudflare Worker Templates

## Minimal Worker skeleton

```ts
export interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("OK")
  },
}
```

## Hono Worker skeleton

```ts
import { Hono } from 'hono'

type Bindings = {}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.text('OK'))

export default app
```

## Minimal wrangler.jsonc

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-06-19"
}
```

## Binding change reminder

After adding or changing bindings:

```bash
wrangler types
```

## Secrets reminder

Use secure secret flows, not committed files:

```bash
wrangler secret put MY_SECRET
```

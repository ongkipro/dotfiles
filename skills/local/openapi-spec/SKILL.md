---
name: openapi-spec
description: 'Generate, review, and validate an OpenAPI 3.1 spec (YAML/JSON) from an endpoint description, a codebase, or existing routes. Output is ready for Redoc, Swagger UI, or Hono/tRPC code-gen. Use when documenting a REST API, creating an API contract before coding, or reviewing an existing API. Triggers: ''buat openapi'', ''build openapi'', ''api spec'', ''dokumentasi api'', ''api documentation'', ''swagger'', ''openapi'', ''api contract'', ''api docs'', ''generate spec''.'
---

# OpenAPI Spec

Generate and validate an OpenAPI 3.1 spec from a description or an existing codebase.

## Modes

- **`generate`** — create a new spec from an endpoint description
- **`review`** — analyze and fix an existing spec
- **`expand`** — add new endpoints to an existing spec
- **`from-code`** — read route files and generate a spec from the code

## Base Template (OpenAPI 3.1)

```yaml
openapi: 3.1.0
info:
  title: [Project Name] API
  version: 1.0.0
  description: |
    API for [short description].

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: http://localhost:3000/api
    description: Local dev

security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
        message:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      tags: [Users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      summary: Create user
      operationId: createUser
      tags: [Users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserInput'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'

components:
  responses:
    Unauthorized:
      description: Missing or invalid token
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    BadRequest:
      description: Validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

## Endpoint Generation Guide

For every endpoint, make sure it has:
- `operationId` — camelCase, unique (used by code-gen)
- `tags` — group related endpoints
- `summary` — one short sentence
- `requestBody` with a full schema (if POST/PUT/PATCH)
- All possible responses: 200/201, 400, 401, 403, 404, 500
- Query/path parameters with type and default

## Rules for Good Schemas

```yaml
# Use $ref for schemas that are reused
# Use required[] for mandatory fields
# Use nullable: true (not type: null) for optional
# Use enum for limited values
# Use format: date-time, email, uuid for special strings

User:
  type: object
  required: [id, email, created_at]
  properties:
    id:
      type: string
      format: uuid
    email:
      type: string
      format: email
    role:
      type: string
      enum: [admin, user, viewer]
    created_at:
      type: string
      format: date-time
    deleted_at:
      type: string
      format: date-time
      nullable: true
```

## Validation

```bash
# Lint with Redocly (no global install)
npx @redocly/cli lint openapi.yaml

# Preview Redoc
npx @redocly/cli preview-docs openapi.yaml

# Validate with swagger-parser
npx swagger-parser validate openapi.yaml
```

## Stack Integration

### Hono (Cloudflare Workers)
```ts
// Generate types from the spec
npx openapi-typescript openapi.yaml -o src/types/api.d.ts
```

### Next.js / Astro API routes
Use the spec as the contract — the endpoint implementation follows the spec, not the other way around.

### Redoc static docs
```bash
npx @redocly/cli build-docs openapi.yaml -o docs/api/index.html
```

## Output

- Save to `docs/openapi.yaml` or `openapi.yaml` at the root
- Include all schemas under `components/schemas`
- Group with consistent `tags`
- If large, split per domain: `openapi/users.yaml`, `openapi/orders.yaml`, merge with `$ref`

For **`review`** mode: if the spec is already valid, consistent, and complete — say so and stop. Don't invent findings or demote style preferences into "problems" to make the review look useful. Zero changes is a valid review outcome.

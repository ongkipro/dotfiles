---
name: openapi-spec
description: 'Generate, review, and validate an OpenAPI 3.1/3.2 spec (YAML/JSON) from an endpoint description, a codebase, or existing routes. Not for API implementation code, auth design, or diagrams (mermaid-diagram). Output feeds Redoc, Swagger UI, or type generation. Use when documenting a REST API, creating an API contract before coding, or reviewing an existing API. Triggers: ''buat openapi'', ''build openapi'', ''api spec'', ''dokumentasi api'', ''api documentation'', ''swagger'', ''openapi'', ''api contract'', ''api docs'', ''generate spec''.'
---

# OpenAPI Spec

Generate and validate an OpenAPI spec from a description or an existing codebase. The spec describes behavior the code has or will have; never invent endpoints, fields, status codes, or auth schemes that the routes or the user did not state.

## Version choice (verified 2026-10-02)

- Published lines: OAS **3.2** (3.2.0 on 2025-09-19, patch 3.2.1 on 2026-09-10) and **3.1** (latest patch 3.1.2, 2025-09-19). Patch releases only clarify text; tooling treats `3.1.0` and `3.1.2` alike, so write the `openapi` field as the patch you validated against.
- **Existing spec:** keep its version. Do not upgrade 3.0 → 3.1 or 3.1 → 3.2 as a side effect of `expand` or `review`.
- **New spec:** default to `3.1.x`, the line most generators, mock servers, and validators support. Choose `3.2.0` only when it is needed and the project's toolchain (linter, docs renderer, code generator) is confirmed to support it.
- 3.2 additions worth choosing it for: the `query` HTTP method and `additionalOperations` for other methods; `itemSchema` for streaming sequential media (SSE, JSON Lines); hierarchical tags (`summary`, `parent`, `kind`); a top-level `$self` base URI; a `querystring` parameter location; OAuth 2.0 device authorization flow plus `oauth2MetadataUrl` and `deprecated` on security schemes; and an optional `summary` on Response Objects. Using any of these makes the document 3.2-only.

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

    User:
      type: object
      required: [id, email]
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email

    CreateUserInput:
      type: object
      required: [email]
      properties:
        email:
          type: string
          format: email

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer

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

```

## Endpoint Generation Guide

For every endpoint, make sure it has:
- `operationId` — camelCase, unique (used by code-gen)
- `tags` — group related endpoints
- `summary` — one short sentence
- `requestBody` with a full schema (if POST/PUT/PATCH)
- Responses: the success response plus every error the code can actually return (OAS: "expected to cover a successful operation response and any known errors"). Do not pad with codes the route never emits; use `default` for an undocumented error shape.
- `security: []` on operations that are intentionally public, so the global scheme does not imply auth that the route does not enforce
- Query/path parameters with type and default

## Rules for Good Schemas

```yaml
# Use $ref for schemas that are reused
# Use required[] for mandatory fields
# Optional and nullable are independent in OpenAPI 3.1:
# omit a property from required[] when it may be absent
# include "null" in the JSON Schema type when an explicit JSON null is valid
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
      type: [string, "null"]
      format: date-time
```

## Validation

OpenAPI 3.1 uses JSON Schema semantics: `nullable` is not an OpenAPI 3.1 Schema Object keyword. Use a type union such as `type: [string, "null"]` for explicit JSON null, and omit a property from `required` when it may be absent. See the current [OpenAPI 3.1 Schema Object specification](https://spec.openapis.org/oas/v3.1.1.html#schema-object).

Use a validator that actually exposes a CLI. Redocly CLI's documented `lint` command validates structure and applies configured API rules:

```bash
# Prefer the repository's installed dependency through its package manager.
npx @redocly/cli lint openapi.yaml

# Bundle a multi-file spec into one document for tools that need it.
npx @redocly/cli bundle openapi.yaml -o dist/openapi.yaml
```

Redocly CLI v2 (npm `latest` 2.57.0 on 2026-10-02) lints OpenAPI 3.0, 3.1, and 3.2; basic 3.2 support landed in 2.3.0. Its old `preview-docs` command is gone; `preview` now previews a Redocly project, and `build-docs` still renders a single HTML file. Retrieve the current [Redocly lint command documentation](https://redocly.com/docs/cli/commands/lint) before adding CI flags. The `@apidevtools/swagger-parser` library does not ship the `swagger-parser` executable previously shown here; use its programmatic API only if the project already depends on it.

## Stack Integration

### TypeScript types (Hono, Workers, any TS client)
```bash
# Only if the project already uses openapi-typescript; confirm it supports the spec's OAS version.
npx --no-install openapi-typescript openapi.yaml -o src/types/api.d.ts
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

For **`review`** mode, check in this order and stop at real findings:

1. Lint passes (structural validity first).
2. Spec matches code: every route exists in the spec and vice versa; methods, path params, required fields, and status codes agree with the handlers.
3. Security: each operation's effective `security` matches what the route enforces.
4. Breaking-change risk when editing a published contract: removed paths or fields, newly required request fields, narrowed enums, or changed types. Call these out instead of folding them into a cleanup.

If the spec is already valid, consistent, and complete — say so and stop. Don't invent findings or demote style preferences into "problems" to make the review look useful. Zero changes is a valid review outcome.

## Sources (accessed 2026-10-02)

- OpenAPI Specification releases: <https://github.com/OAI/OpenAPI-Specification/releases> and version index <https://spec.openapis.org/oas/>
- OAS 3.2.0 text (Path Item `query`, `additionalOperations`, `itemSchema`, Responses Object coverage, Response `summary`, patch-version rule): <https://spec.openapis.org/oas/v3.2.0.html>
- OAS 3.1 Schema Object (no `nullable`): <https://spec.openapis.org/oas/v3.1.1.html#schema-object>
- Redocly CLI commands and changelog: <https://redocly.com/docs/cli/commands>, <https://redocly.com/docs/cli/changelog>

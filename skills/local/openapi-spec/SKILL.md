---
name: openapi-spec
description: Generate, review, dan validasi OpenAPI 3.1 spec (YAML/JSON) dari deskripsi endpoint, codebase, atau route yang ada. Output siap dipakai Redoc, Swagger UI, atau Hono/tRPC code-gen. Gunakan saat mendokumentasikan REST API, membuat API contract sebelum coding, atau mereview API yang sudah ada. Triggers: 'buat openapi', 'api spec', 'dokumentasi api', 'swagger', 'openapi', 'api contract', 'api docs', 'generate spec'.
---

# OpenAPI Spec

Generate dan validasi OpenAPI 3.1 spec dari deskripsi atau codebase yang ada.

## Mode

- **`generate`** — buat spec baru dari deskripsi endpoint
- **`review`** — analisis dan perbaiki spec yang sudah ada
- **`expand`** — tambah endpoint baru ke spec yang ada
- **`from-code`** — baca route files dan generate spec dari kode

## Template Dasar (OpenAPI 3.1)

```yaml
openapi: 3.1.0
info:
  title: [Project Name] API
  version: 1.0.0
  description: |
    API untuk [deskripsi singkat].

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

## Panduan Generate Endpoint

Untuk setiap endpoint, pastikan ada:
- `operationId` — camelCase, unik (dipakai code-gen)
- `tags` — kelompokkan endpoint yang terkait
- `summary` — satu kalimat pendek
- `requestBody` dengan schema lengkap (kalau POST/PUT/PATCH)
- Semua response yang mungkin: 200/201, 400, 401, 403, 404, 500
- Parameter query/path dengan tipe dan default

## Aturan Schema yang Baik

```yaml
# Pakai $ref untuk schema yang reused
# Pakai required[] untuk field mandatory
# Pakai nullable: true (bukan type: null) untuk optional
# Pakai enum untuk nilai terbatas
# Pakai format: date-time, email, uuid untuk string khusus

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

## Validasi

```bash
# Lint dengan Redocly (tanpa install global)
npx @redocly/cli lint openapi.yaml

# Preview Redoc
npx @redocly/cli preview-docs openapi.yaml

# Validate dengan swagger-parser
npx swagger-parser validate openapi.yaml
```

## Integrasi Stack

### Hono (Cloudflare Workers)
```ts
// Generate types dari spec
npx openapi-typescript openapi.yaml -o src/types/api.d.ts
```

### Next.js / Astro API routes
Gunakan spec sebagai contract — implementasi endpoint mengacu spec, bukan sebaliknya.

### Redoc static docs
```bash
npx @redocly/cli build-docs openapi.yaml -o docs/api/index.html
```

## Output

- Simpan ke `docs/openapi.yaml` atau `openapi.yaml` di root
- Sertakan semua schema di `components/schemas`
- Grouping dengan `tags` yang konsisten
- Kalau besar, pisahkan per domain: `openapi/users.yaml`, `openapi/orders.yaml`, merge dengan `$ref`

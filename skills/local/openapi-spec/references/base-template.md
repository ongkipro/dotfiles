# OpenAPI 3.1 base template

Moved from SKILL.md 2026-10-30. Copy and fill; set the `openapi` field to the patch you validated against.

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
    # RFC 9457 Problem Details, served as application/problem+json
    Problem:
      type: object
      required: [type, title, status]
      properties:
        type:
          type: string
          format: uri-reference
        title:
          type: string
        status:
          type: integer
        detail:
          type: string
        instance:
          type: string
          format: uri-reference

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

    # Cursor pagination: cursors are opaque; no total count on large sets
    Pagination:
      type: object
      properties:
        next_cursor:
          type: [string, "null"]

  responses:
    Unauthorized:
      description: Missing or invalid token
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    BadRequest:
      description: Validation error
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    TooManyRequests:
      description: Rate limit exceeded
      headers:
        Retry-After:
          description: Seconds to wait before retrying
          schema:
            type: integer
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      tags: [Users]
      parameters:
        - name: cursor
          in: query
          description: Opaque cursor from a previous response; never built by clients
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
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
        '429':
          $ref: '#/components/responses/TooManyRequests'

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

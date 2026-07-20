---
name: mermaid-diagram
description: 'Generate a Mermaid diagram from a description, a codebase, or a given schema. Output is a Mermaid code block that renders directly in GitHub, GitLab, Notion, and Claude. No tool install needed. Use for flowcharts, ERDs, sequence diagrams, C4 context, class diagrams, and gantt. Triggers: ''buat diagram'', ''create diagram'', ''flowchart'', ''ERD'', ''sequence diagram'', ''mermaid'', ''diagram alur'', ''flow diagram'', ''visualisasi'', ''visualization'', ''database diagram'', ''class diagram'', ''C4''.'
---

# Mermaid Diagram

Generate technical diagrams as Mermaid blocks — they render directly in GitHub, Claude, Notion, GitLab, and VSCode.

## Diagram Types

### 1. Flowchart — process flow / decision tree
```mermaid
flowchart TD
    A[Start] --> B{Condition?}
    B -->|Yes| C[Action A]
    B -->|No| D[Action B]
    C --> E[End]
    D --> E
```

### 2. Sequence Diagram — interaction between systems/components
```mermaid
sequenceDiagram
    participant U as User
    participant API as Backend API
    participant DB as Database
    U->>API: POST /login
    API->>DB: SELECT user WHERE email=...
    DB-->>API: user record
    API-->>U: JWT token
```

### 3. ERD — database schema
```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        timestamp created_at
    }
    ORDERS {
        uuid id PK
        uuid user_id FK
        decimal total
    }
    USERS ||--o{ ORDERS : "has many"
```

### 4. Class Diagram — OOP structure / TypeScript interfaces
```mermaid
classDiagram
    class User {
        +string id
        +string email
        +login() bool
    }
    class Admin {
        +deleteUser(id) void
    }
    Admin --|> User
```

### 5. C4 Context — high-level system architecture
```mermaid
C4Context
    Person(user, "User", "End user")
    System(app, "App", "Main application")
    SystemExt(email, "Email Service", "Sends notifications")
    Rel(user, app, "Uses")
    Rel(app, email, "Sends via")
```

### 6. Gantt — timeline / milestones
```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Setup           :2025-01-01, 7d
    Core features   :2025-01-08, 14d
    section Phase 2
    Testing         :2025-01-22, 7d
    Deploy          :2025-01-29, 3d
```

## Workflow

1. Ask the user for the diagram type + context (or infer it from the description)
2. Generate a ```mermaid ... ``` block
3. Briefly explain what it depicts
4. Offer: "Want to add a node? Change the layout? Export to a .md file?"

## Pick the Right Diagram

| Context | Diagram |
|---|---|
| Login, checkout, process flow | Flowchart |
| API request/response, auth flow | Sequence |
| Database schema, table relations | ERD |
| Class structure, TypeScript types | Class |
| Overall system architecture | C4 Context |
| Sprint timeline / milestones | Gantt |

## Output Tips

- Always wrap in a ````mermaid` code block
- Use clear, short labels (max 5 words per node)
- For ERDs, always include PK and FK
- For sequences, use `-->>` for responses (dashed), `->>` for requests (solid)
- For C4, separate internal systems vs external
- Save to a `.md` file in docs/ or the project root if requested

## Validation

Mermaid is valid if:
- No spaces in node IDs (use underscore or camelCase)
- Arrow syntax is correct (`-->`, `->>`, `-->>`, `--|>`)
- Keywords don't clash with node names (avoid `end`, `class`, etc. as IDs)

## Install mmdc (optional, for PNG/SVG export)

```bash
npm i -g @mermaid-js/mermaid-cli
mmdc -i diagram.md -o diagram.png
```

Without mmdc, the Mermaid text output is enough to render on GitHub/Claude.

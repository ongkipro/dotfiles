---
name: mermaid-diagram
description: 'Generate a Mermaid diagram from a description, codebase, or schema. Output a Mermaid code block for supported Markdown renderers. Use for flowcharts, ERDs, sequence diagrams, C4 context, class diagrams, gantt, pie charts, mindmaps, git graphs, and quadrant charts. Triggers: ''buat diagram'', ''create diagram'', ''flowchart'', ''ERD'', ''sequence diagram'', ''mermaid'', ''diagram alur'', ''flow diagram'', ''visualisasi'', ''visualization'', ''database diagram'', ''class diagram'', ''pie chart'', ''mindmap'', ''git graph'', ''quadrant chart'', ''C4''.'
---

# Mermaid Diagram

Generate technical diagrams as Mermaid blocks — they render directly in GitHub, Claude, Notion, GitLab, and VSCode.

## Syntax Provenance

The examples target Mermaid v11.x and were reviewed against the canonical [mermaid-js/mermaid](https://github.com/mermaid-js/mermaid) syntax on 2026-08-16. This is a baseline, not an evergreen version claim: the target repository's installed Mermaid package or host renderer wins. Check that renderer before using recently added diagram types, and do not silently rewrite a project's established syntax for a different major version.

## Ownership Boundary

This skill owns diagram-type selection and valid Mermaid syntax. It does not invent architecture decisions, database relationships, API behavior, task dates, or business facts; derive those from the repository or the owning specification skill. Use `development-spec-suite` or `prd-taskbreaker` for artifact decisions, `openapi-spec` for API contracts, and `adr-record` for full architecture decisions.

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

### 7. Pie — category share
```mermaid
pie showData
    title Support Requests by Channel
    "Email" : 48
    "Chat" : 32
    "Phone" : 20
```

### 8. Mindmap — concept or scope breakdown
```mermaid
mindmap
  root((Release))
    Product
      Requirements
      UX
    Engineering
      API
      Data
```

### 9. Git Graph — branch and release history
```mermaid
gitGraph
    commit id: "baseline"
    branch feature
    checkout feature
    commit id: "feature"
    checkout main
    merge feature
```

### 10. Quadrant Chart — prioritization
```mermaid
quadrantChart
    title Initiative Priorities
    x-axis Low effort --> High effort
    y-axis Low impact --> High impact
    quadrant-1 Strategic
    quadrant-2 Quick wins
    quadrant-3 Defer
    quadrant-4 Reconsider
    Search fixes: [0.25, 0.80]
    Platform rewrite: [0.85, 0.70]
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
| Category share / composition | Pie |
| Brainstorming / scope hierarchy | Mindmap |
| Branching and merge history | Git Graph |
| Effort-impact prioritization | Quadrant Chart |

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

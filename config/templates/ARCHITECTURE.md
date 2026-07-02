# Architecture — {{PROJECT_NAME}}

> **Updated:** {{DATE}} | **Stack:** {{STACK}}

## High-Level Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   CDN/Edge  │────▶│   Backend   │
└─────────────┘     └─────────────┘     └─────────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                     ▼                     ▼
                   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                   │  Database   │      │    Cache    │      │  Storage    │
                   └─────────────┘      └─────────────┘      └─────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | {{FRONTEND}} | {{FRONTEND_PURPOSE}} |
| Backend | {{BACKEND}} | {{BACKEND_PURPOSE}} |
| Database | {{DATABASE}} | {{DB_PURPOSE}} |
| Cache | {{CACHE}} | {{CACHE_PURPOSE}} |
| Storage | {{STORAGE}} | {{STORAGE_PURPOSE}} |
| CDN/DNS | {{CDN}} | {{CDN_PURPOSE}} |
| Deployment | {{DEPLOY}} | {{DEPLOY_PURPOSE}} |

## Directory Structure

```
{{REPO_NAME}}/
├── src/
│   ├── pages/        # Routes
│   ├── components/   # Reusable UI
│   ├── lib/          # Utilities
│   └── styles/       # Global styles
├── public/           # Static assets
├── tests/            # Test suites
└── docs/             # Documentation
```

## API Design

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/{{RESOURCE}}` | GET | {{DESC}} |
| `/api/{{RESOURCE}}` | POST | {{DESC}} |
| `/api/{{RESOURCE}}/:id` | PUT | {{DESC}} |

## Database Schema

### {{TABLE_NAME}}

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| {{COL_1}} | {{TYPE_1}} | {{CONSTRAINT_1}} |
| {{COL_2}} | {{TYPE_2}} | {{CONSTRAINT_2}} |
| created_at | TIMESTAMP | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL DEFAULT NOW() |

## Deployment Pipeline

```
Git Push → GitHub Actions → Build → Deploy to {{PLATFORM}}
```

## Key Decisions

- {{DECISION_1}}
- {{DECISION_2}}
- See [DECISIONS.md](./DECISIONS.md) for full log.

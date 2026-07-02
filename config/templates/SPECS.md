# Technical Specifications — {{PROJECT_NAME}}

> **Updated:** {{DATE}} | **Version:** 0.1

## Component Tree

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Nav
│   │   └── UserMenu
│   ├── Main
│   │   └── [Page Content]
│   └── Footer
├── Pages
│   ├── Home
│   ├── {{PAGE_1}}
│   └── {{PAGE_2}}
└── Shared
    ├── Button
    ├── Card
    └── Modal
```

## Route Design

| Path | Page | Auth | Layout |
|------|------|------|--------|
| `/` | Home | Public | Default |
| `/{{ROUTE_1}}` | {{PAGE_1}} | {{AUTH_1}} | {{LAYOUT_1}} |
| `/{{ROUTE_2}}` | {{PAGE_2}} | {{AUTH_2}} | {{LAYOUT_2}} |

## Data Models

### {{MODEL_1}}

```typescript
interface {{MODEL_1}} {
  id: string;
  {{FIELD_1}}: {{TYPE_1}};
  {{FIELD_2}}: {{TYPE_2}};
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

| Method | Endpoint | Auth | Request | Response |
|--------|----------|------|---------|----------|
| GET | `/api/{{RESOURCE}}` | {{AUTH}} | — | `{{RESPONSE}}[]` |
| POST | `/api/{{RESOURCE}}` | {{AUTH}} | `{{BODY}}` | `{{RESPONSE}}` |

## SEO Specs

| Page | Title | Description | Canonical |
|------|-------|-------------|-----------|
| `/` | {{TITLE}} | {{DESC}} | {{URL}} |

## Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID/INP | < 100ms |
| CLS | < 0.1 |
| Lighthouse | > 90 |

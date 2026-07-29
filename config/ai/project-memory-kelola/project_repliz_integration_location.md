---
name: project-repliz-integration-location
description: Where Repliz social-account credential setup lives in the Kelola UI
metadata: 
  node_type: memory
  type: project
  originSessionId: 11780130-c3bb-44ae-93b9-3d590a48c147
---

Repliz (social auto-publish) credential setup lives in **Settings → Integrasi** (`/app/settings?tab=integrations`), in the `ReplizCard` component inside `IntegrationsSection` (`web/app/app/settings/page.tsx`). It sets/edits/deletes per-workspace Repliz credentials via `socialApi.setCredentials/deleteCredentials` and lists connected accounts.

The **Kalender Sosial** page (`web/app/app/social/page.tsx`) is now display-only for connections: it shows connected accounts read-only and links to app.repliz.com to add accounts; if not configured it shows an amber banner pointing to Settings → Integrasi. The old "Asisten Kelola" caption/hashtag panel and inline credential form were removed (2026-06, per user: UX too crowded, function unused).

**Why:** user wanted social-account integration consolidated in Settings, and the calendar page to only surface already-connected accounts.

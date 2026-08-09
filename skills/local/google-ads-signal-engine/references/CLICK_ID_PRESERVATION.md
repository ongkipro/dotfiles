# Click ID Preservation (`gclid`, `gbraid`, `wbraid`)

Google Ads uses click identifiers to attribute offline or delayed conversions back to specific ad clicks and campaigns.

---

## 3 Click Identifiers

1. `gclid` (Google Click Identifier): Standard search/display ad click query parameter on Desktop & Web.
2. `gbraid`: iOS 14.5+ App-to-Web click identifier (privacy-preserving aggregated attribution).
3. `wbraid`: Web-to-App click identifier (privacy-preserving aggregated attribution).

---

## Preservation Engine (TypeScript)

Store all 3 parameters in `sessionStorage` or a first-party cookie upon landing page load:

```typescript
export interface StoredClickContext {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  capturedAt: string;
}

export function captureGoogleClickContext(): StoredClickContext {
  if (typeof window === "undefined") return { capturedAt: new Date().toISOString() };

  const params = new URLSearchParams(window.location.search);
  const context: StoredClickContext = {
    capturedAt: new Date().toISOString()
  };

  if (params.has("gclid")) context.gclid = params.get("gclid")!;
  if (params.has("gbraid")) context.gbraid = params.get("gbraid")!;
  if (params.has("wbraid")) context.wbraid = params.get("wbraid")!;

  if (context.gclid || context.gbraid || context.wbraid) {
    sessionStorage.setItem("gads_click_context", JSON.stringify(context));
  }

  return context;
}

export function getStoredClickContext(): StoredClickContext | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("gads_click_context");
  return raw ? JSON.parse(raw) : null;
}
```

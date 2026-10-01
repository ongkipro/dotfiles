# Click ID Preservation (`gclid`, `gbraid`, `wbraid`)

Google Ads uses click identifiers to attribute offline or delayed conversions back to specific ad clicks and campaigns.

---

## 3 Click Identifiers

1. `gclid` (Google Click Identifier): the standard ad-click parameter.
2. `gbraid`: iOS 14+ **web-to-app** measurement — present when a user clicks an ad on the web and is directed to your iOS app (app conversions).
3. `wbraid`: iOS 14+ **app-to-web** measurement — present when a user clicks an ad in an iOS app and lands on your webpage (web conversions).

An earlier version of this file had `gbraid`/`wbraid` reversed. Source:
[Google Ads Help — iOS 14 campaign measurement](https://support.google.com/google-ads/answer/10417364), accessed 2026-10-02.
For a website, `wbraid` is the iOS parameter you will usually see; capture all
three anyway. When both a `gclid` and a `gbraid` are known for one conversion,
Google's upload guide recommends sending both.

---

## Preservation Engine (TypeScript)

Capture all 3 parameters on landing. `sessionStorage` is per-tab and dies with the
tab, so treat it only as a hop to the server: persist the IDs onto the
lead/order row at checkout (the offline upload reads them from there), and let the
Google tag's conversion linker manage its own first-party cookies.

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

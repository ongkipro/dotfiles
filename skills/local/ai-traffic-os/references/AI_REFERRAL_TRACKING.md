# AI Referral Tracking & PostgreSQL Event Ingestion

Use observed HTTP referrers and explicit campaign parameters as separate attribution signals. `sessionStorage` can preserve a source already observed during the same browser session; it cannot recover a source when neither a referrer nor a campaign parameter was present. Label such traffic `unknown` rather than assigning an AI source.

The examples below are a local analytics pattern, not a vendor-reported recovery guarantee. Apply consent, retention, minimization, and access-control requirements before collecting referrers or user-agent data.

## 1. Client-Side Tracker (`referral-tracker.ts`)

```ts
// src/scripts/referral-tracker.ts

export function trackAISession() {
  if (typeof window === "undefined") return;

  const ref = (document.referrer || "").toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = (urlParams.get("utm_source") || "").toLowerCase();
  const utmMedium = (urlParams.get("utm_medium") || "").toLowerCase();
  const refAi = urlParams.get("ref_ai");

  let source = "unknown";
  let confidence = "low";

  // Path A: Referrer Match
  if (ref.includes("chatgpt.com")) { source = "chatgpt"; confidence = "high"; }
  else if (ref.includes("perplexity.ai")) { source = "perplexity"; confidence = "high"; }
  else if (ref.includes("claude.ai")) { source = "claude"; confidence = "high"; }
  else if (ref.includes("google.") && (ref.includes("ai") || urlParams.get("source") === "aio")) { source = "google_aio"; confidence = "high"; }

  // Path B: UTM / Parameter Fallback
  if (source === "unknown") {
    if (utmSource.includes("chatgpt") || utmMedium.includes("chatgpt")) { source = "chatgpt"; confidence = "medium"; }
    else if (utmSource.includes("perplexity")) { source = "perplexity"; confidence = "medium"; }
    else if (utmSource.includes("claude")) { source = "claude"; confidence = "medium"; }
    else if (refAi) { source = refAi; confidence = "medium"; }
  }

  if (source !== "unknown") {
    sessionStorage.setItem("ai_traffic_source", source);
    sessionStorage.setItem("ai_traffic_confidence", confidence);

    const payload = JSON.stringify({
      source,
      confidence,
      page: window.location.pathname,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/referral", payload);
    } else {
      fetch("/api/referral", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  }
}

// Auto-initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", trackAISession);
} else {
  trackAISession();
}
```

---

## 2. Server-Side Ingestion API (`/api/referral.ts`)

```ts
// src/pages/api/referral.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    if (!data.source || !data.page) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    console.log("[AI-REFERRAL-EVENT]", {
      source: data.source,
      confidence: data.confidence || "unknown",
      landingPage: data.page,
      referrer: data.referrer || null,
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
```

---

## 3. PostgreSQL Database Schema

```sql
CREATE TABLE referral_events (
    id BIGSERIAL PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    confidence VARCHAR(20) DEFAULT 'low',
    referrer TEXT,
    landing_page TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Referral Traffic Query
SELECT
    source,
    confidence,
    COUNT(*) AS visits
FROM referral_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY source, confidence
ORDER BY visits DESC;
```

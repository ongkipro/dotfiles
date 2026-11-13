# TikTok Events API v2 — Server Sender & Payload Contract

> Executable implementation standard for TikTok Events API v2 (Server-Side Conversion Tracking).

---

## 1. Endpoint, Version, and Authentication

Audit baseline: TikTok Marketing API `v1.3` matched the official server-events documentation on 2026-08-16, and the Events API 2.0 doc URL still carried `v1.3` on 2026-10-02. This is point-in-time provenance, not an evergreen "latest" claim. Re-check [TikTok's official Marketing API documentation](https://ads.tiktok.com/marketing_api/docs) and changelog before implementation or any version change.

```typescript
export const TIKTOK_MARKETING_API_VERSION = "v1.3";
export const TIKTOK_EVENTS_TRACK_URL =
  `https://business-api.tiktok.com/open_api/${TIKTOK_MARKETING_API_VERSION}/event/track/`;
```

Use `TIKTOK_EVENTS_TRACK_URL` everywhere rather than repeating the versioned URL.

- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `Access-Token: <TIKTOK_PIXEL_ACCESS_TOKEN>`

---

## 2. Server Event Payload Contract

```json
{
  "event_source": "web",
  "event_source_id": "C1234567890TIKTOKPIXEL",
  "data": [
    {
      "event": "Purchase",
      "event_id": "order_ord_987654321",
      "event_time": 1770950000,
      "user": {
        "ttclid": "E.C.P.1234567890abcdef",
        "ttp": "12345678-abcd-ef01-2345-6789abcdef01",
        "email": "2492d2341d380733d980486c9900c43075c3f05d5395669b32938360662d0012",
        "phone": "542a22f2545d164177d4c204961502f696667954157a9058b8d4f40f09b55219",
        "ip": "202.152.0.1",
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15"
      },
      "properties": {
        "contents": [
          {
            "price": 250000,
            "quantity": 1,
            "content_id": "SKU-9912",
            "content_type": "product"
          }
        ],
        "value": 250000,
        "currency": "IDR",
        "order_id": "ord_987654321"
      },
      "page": {
        "url": "https://example.com/checkout/success?order_id=ord_987654321",
        "referrer": "https://www.tiktok.com/"
      }
    }
  ]
}
```

---

## 2a. Field contract (official `/event/track/` reference, read in a browser 2026-11-12)

| Field | Rule |
| --- | --- |
| `event_source` | `web` (pixel code), `offline` (Offline Event Set ID), `app` (allowlist only), `crm` (CRM event set, custom events only) |
| `data[]` | ≤ 1,000 events; more rejects the whole request. TikTok recommends real-time sends over batching |
| `event` | Case-sensitive standard name. Web list: `AddPaymentInfo`, `AddToCart`, `AddToWishlist`, `ApplicationApproval`, `CompleteRegistration`, `Contact`, `CustomizeProduct`, `Download`, `FindLocation`, `InitiateCheckout`, `Lead`, `Purchase`, `Schedule`, `Search`, `StartTrial`, `SubmitApplication`, `Subscribe`, `ViewContent`. **No page-view event on the server**: `ttq.page()` is browser-only |
| `event_time` | Integer Unix **seconds**, UTC |
| `event_id` | Required when the pixel sends the same event; hashed or plain |
| `user.email`, `user.phone`, `user.external_id` | SHA-256 hex, string or string[]; an unhashed value fails `40002` |
| `user.ttclid`, `user.ttp`, `user.ip`, `user.user_agent`, `user.locale` | Unhashed; `locale` is BCP 47 |
| `properties` | `content_ids[]`, `contents[]` (`content_id`, `content_name`, `content_category`, `brand`, `price` = unit, `quantity`), `content_type` (`product` for sku_id, `product_group` for item_group_id), `currency`, `value` (order total), `num_items`, `order_id`, `shop_id`, `search_string`, `description`, `customer_type` (`new`/`returning`) |
| `page.url` | **Required for web events**: the full URL where the event happened; `page.referrer` optional |
| `limited_data_use` | Boolean, web/app; for US state privacy regimes |

Responses: success = HTTP 200 **and** `code: 0`. Documented failures: `40001` no permission (HTTP 400), `40002` invalid payload / unhashed PII / > 1,000 events (400; for a per-event error the `message` names a `data.<index>` path, e.g. `Invalid value for data.2.event_id`, but request-level causes such as invalid JSON or an oversized batch carry no index), `40100` throttled at 1,000 QPS (401), `40104` empty token (401). Always check both the HTTP status and `code`.

`test_event_code` (from the pixel's Test Events tab) is used by integrators but was not on the 2.0 reference page when read; confirm in Events Manager before relying on it.

The official [`tiktok-business-api-sdk`](https://github.com/tiktok/tiktok-business-api-sdk) (commit `f809c39`, 2026-02-28, read 2026-11-12; see `python_sdk/docs/PixelContextUser.md`) still models the 1.0 `pixel/track` endpoint; use it only for the Pixel `identify` key names (`PixelContextUser`: `email`, `phone_number`, `external_id`, all SHA-256 client-side), not as a 2.0 payload template.

---

## 3. Browser Pixel (`ttq.track`) Client Integration

```html
<script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
    ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

    ttq.load('C1234567890TIKTOKPIXEL');
    ttq.page();
  }(window, document, 'ttq');
</script>

<script>
  // Fire Purchase (legacy name: CompletePayment) with matching event_id
  ttq.track('Purchase', {
    contents: [{
      content_id: 'SKU-9912',
      content_type: 'product',
      quantity: 1,
      price: 250000
    }],
    value: 250000,
    currency: 'IDR'
  }, {
    event_id: 'order_ord_987654321'
  });
</script>
```

---

## 4. Key Rules for Deduplication & High Match Rate

1. **`event_id`**: Browser `ttq.track('Purchase', data, { event_id: id })` and Server `data[0].event_id` MUST be identical strings, with the same `event` name. TikTok merges Pixel + Events API copies arriving within 5 minutes and deduplicates later copies up to 48 hours after the first event, keeping the first received ([TikTok event deduplication](https://ads.tiktok.com/help/article/event-deduplication), accessed 2026-10-02). The dedup key is `event_source_id` + `event` + `event_id` only; Automatic Advanced Matching is a match-rate setting, not a dedup prerequisite. Cookie (`_ttp`) dedup exists as a fallback but only when the server event carries **no** `event_id`, only drops the server copy, and only within 5 minutes — do not rely on it.
2. **`ttclid` preservation**: Capture `ttclid` from URL query parameter on landing, store in `httpOnly` cookie (`_ttclid`), and pass in `user.ttclid` on server events.
3. **SHA-256 Hashing**:
   - `email`: trim whitespace, convert to lowercase, compute SHA-256 hash.
   - `phone` (Events API 2.0 `user` field; string or string[]): format to `+E.164` — `+`, country code, number, no spaces or dashes (e.g. `+628123456789`) — then SHA-256. TikTok's docs note an exception for country code 86 (omit it). An earlier version of this file said "without `+`"; that matches Meta, not TikTok. Field name: the server payload key is **`phone`**; `phone_number` is the browser Pixel `ttq.identify({ email, phone_number })` key and the legacy 1.0 key (TikTok docs; Stape's TikTok sGTM tag maps any input to `user.phone`, verified in code 2026-11-02). No official library adds the country code: the TikTok WooCommerce plugin hashes `strtolower(trim(phone))` and the official GTM template does not normalise — convert `08…` to `+62…` yourself. Re-confirm on the JavaScript-rendered [Events API 2.0 page](https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3) before shipping.

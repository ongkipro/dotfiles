# TikTok Events API v2 — Server Sender & Payload Contract

> Executable implementation standard for TikTok Events API v2 (Server-Side Conversion Tracking).

---

## 1. Endpoint & Authentication

- **Endpoint**: `POST https://business-api.tiktok.com/open_api/v1.3/event/track/`
- **Headers**:
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
      "event": "CompletePayment",
      "event_id": "order_ord_987654321",
      "event_time": 1770950000,
      "user": {
        "ttclid": "E.C.P.1234567890abcdef",
        "ttp": "12345678-abcd-ef01-2345-6789abcdef01",
        "email": "2492d2341d380733d980486c9900c43075c3f05d5395669b32938360662d0012",
        "phone_number": "542a22f2545d164177d4c204961502f696667954157a9058b8d4f40f09b55219",
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
  // Fire CompletePayment with matching event_id
  ttq.track('CompletePayment', {
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

1. **`event_id`**: Browser `ttq.track('CompletePayment', data, { event_id: id })` and Server `data[0].event_id` MUST be identical strings.
2. **`ttclid` preservation**: Capture `ttclid` from URL query parameter on landing, store in `httpOnly` cookie (`_ttclid`), and pass in `user.ttclid` on server events.
3. **SHA-256 Hashing**:
   - `email`: trim whitespace, convert to lowercase, compute SHA-256 hash.
   - `phone_number`: format to E.164 without `+` or spaces (e.g. `628123456789`), compute SHA-256 hash.

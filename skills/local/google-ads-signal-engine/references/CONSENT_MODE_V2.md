# Consent Mode v2 Specification & Implementation

Consent Mode v2 is a Google tag mechanism for reflecting an advertiser's consent policy; it does not itself determine legal compliance or authorize a global default. Defaults and updates must match the jurisdictions served, the actual consent experience, and applicable legal advice.

---

## 4 Consent Signals in v2

1. `ad_storage`: Enables storage (such as cookies) related to advertising.
2. `analytics_storage`: Enables storage related to analytics (such as visit duration).
3. `ad_user_data`: **(New v2)** Controls whether user data can be sent to Google for online advertising purposes.
4. `ad_personalization`: **(New v2)** Controls whether personal data can be used for personalized advertising (remarketing).

---

## Scope the default to the regions that require it

**A blanket global `denied` default is the wrong call for an ID/MY-market advertiser.** Google's EU user consent policy covers end users in the EEA, the UK, and Switzerland ([policy](https://www.google.com/about/company/user-consent-policy/), accessed 2026-10-02); other jurisdictions have their own privacy laws, which the advertiser's legal review — not this skill — decides. If the site has no CMP — which is normal for an Indonesian COD funnel — a global `denied` default means nothing ever grants consent, so the advertiser silently destroys their own conversion signal and Smart Bidding starves, to satisfy a regulation that does not apply to their traffic.

`gtag('consent', 'default', …)` accepts a `region` array. Deny where the law requires it, grant elsewhere:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // EEA + UK + CH: denied until a CMP grants.
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'],
    'wait_for_update': 500
  });

  // Everywhere else (ID, MY, …): granted, no CMP in the path.
  gtag('consent', 'default', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
</script>
```

When two `default` commands match a visitor, the more specific region wins (e.g. `US-CA` over `US`), and the region-less command applies everywhere else ([consent guide](https://developers.google.com/tag-platform/security/guides/consent), accessed 2026-10-02). Use a regional default only when the region list, consent experience, and legal policy are reviewed together. A global `denied` default without a CMP can be an unmonitored measurement outage; a global `granted` default without a policy can be an unauthorized data-sharing path.

## Global-deny reference (EEA-serving properties with a CMP)

```html
<!-- 1. Consent Mode Default Initialization (MUST be placed BEFORE gtag.js loads) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });
</script>

<!-- 2. Google Tag Loader -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>

<!-- 3. Consent Update Handler (Called when user clicks "Accept All" in Cookie Banner) -->
<script>
  function onUserConsentGranted() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
  }
</script>
```

---

## Basic vs advanced consent mode

Google documents two implementations ([consent mode concepts](https://developers.google.com/tag-platform/security/concepts/consent-mode), accessed 2026-10-02):

| | Basic | Advanced |
| --- | --- | --- |
| Tag loading | Blocked until the user interacts with the banner | Loads immediately with `denied` defaults |
| Data before consent | None, not even consent state | Cookieless pings with consent state and activity |
| Modeling | General model | Advertiser-specific model |

Choosing advanced mode is a privacy/legal decision, not only a measurement one.

## GTM Consent Mode Architecture

In Google Tag Manager:
1. Enable **Consent Overview** in Container Settings.
2. Rely on built-in consent checks for Google Ads and GA4 tags; give non-Google tags explicit checks under **Advanced > Consent Settings**.
3. Set defaults and updates from the CMP (typically a CMP's Community Template) before other tags fire. Do not invent a custom dataLayer event as a consent signal; GTM reads consent state, not event names. (An earlier version of this file prescribed an `accuracy_consent_update` event; no Google source documents it.)

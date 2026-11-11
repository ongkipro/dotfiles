# Mengantar partner onboarding — what can be said publicly

Mengantar offers approved partner platforms a separate API to register their own
users as Mengantar sellers and to read or rotate those sellers' Public API keys. Its
documentation is shared **privately** with partners under an agreement and is marked
"do not share outside your team". This repository is public, so this file records only
how to work with it safely. Get the documentation from the Mengantar contact; a
device-local snapshot may exist in `~/.config/ai-local/mengantar/`. Never copy its
endpoints, headers, signing layout, limits or error codes into a public file.

## Rules for any integration

- **Secrets.** Partner ID is an identifier; the Partner Secret signs requests and is
  never sent, logged, or committed. Keep it in `secrets-env` / the platform secret
  store. Each seller's Public API key is a credential of that seller: store keys
  per seller, encrypted, never in shared logs.
- **Signing.** Each request is signed over its own method, path, exact body bytes
  and timestamp. Build the JSON string once, sign it, send that same string; a
  re-serialized body fails. Recompute the signature for every call and keep the
  server clock in sync.
- **Egress allowlist.** Production refuses calls from addresses not registered with
  Mengantar. Register production egress IPs before go-live and before changing hosts.
- **Idempotent registration.** Registration is keyed on your own stable user id, so a
  timed-out call is retried with the same values, never as a new user.
- **Consent and ownership.** Registering creates a real seller account, with real COD
  money, in the user's name. Tell the user, obtain their agreement to Mengantar's
  terms on your side, register an email they actually read, and explain the first
  sign-in through "Lupa Password". Offer a paste-your-own-key path for users who
  already have a Mengantar account.
- **Key lifecycle.** A seller can rotate their key in Mengantar at any time; on an
  invalid-key response fetch the current key instead of re-registering. Rotating a
  key also replaces that seller's Webhook Secret.
- **No partner webhook.** Order status comes from the Public API and each seller's
  own webhook, which only the seller can configure.

Before coding, read the private docs for exact endpoints, limits and error codes, and
confirm the account's environment (sandbox vs production) with the Mengantar contact.

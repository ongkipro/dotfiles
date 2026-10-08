# Auth Flows: behavior and UX contracts

Product-level contracts for the user-facing auth journeys, implemented with
Better Auth. `SKILL.md` owns hardening (secrets, cookies, CSRF, origins, rate
limits, IP); this file owns what each flow must do and show. Option and method
names are version-sensitive: verify against the installed `better-auth`
version and the official docs before writing code.

## Shared rules (every flow)

- **Enumeration safety:** sign-up, sign-in, reset request, magic-link request,
  verification resend, and invite acceptance return the same message and status
  whether or not the account exists ("If that address can receive email, we
  sent a link."). Never say "no account found" or "already registered" to an
  unauthenticated caller; offer the next action in the email instead.
- **Timing:** send email from a background task (Better Auth
  `advanced.backgroundTasks` / platform `waitUntil`, or a job queue) and do not
  await the send in the request path; the docs advise this to avoid timing
  leaks.
- **Rate limits:** keep the built-in sign-in/sign-up/reset limits and add
  explicit rules for reset completion, verification resend, magic-link request,
  and invite send (see `SKILL.md` Rate Limiting). Show a neutral "Too many
  attempts, try again in N minutes" with the retry time, not a raw 429.
- **Links:** single-use, short-lived, built only from the configured `baseURL`
  (never from the request `Host`), and redirect targets validated against
  trusted origins. Every link page handles: valid, expired, already used, and
  malformed, each with a recovery action (resend or start over).
- **Bot protection:** public sign-up, reset request, and magic-link request get
  Turnstile or an equivalent (`turnstile-spin`) when abuse is plausible.
- **Forms:** server schema is the authority; field errors map to inputs; the
  form works without JavaScript (see `full-stack-development` forms contract).

## Sign-up

1. Validate email shape and password policy server-side (Better Auth default
   length is 8–128; raise the minimum per policy, never cap below 64).
2. With `emailAndPassword.requireEmailVerification: true`, sign-in is blocked
   until verified; pair it with `emailVerification.sendOnSignUp: true`.
3. Response for a new and an existing address is identical. For an existing
   address, the email says "you already have an account" with a sign-in and
   reset link; send it from `emailAndPassword.onExistingUserSignUp`
   (`async ({ user }, request)`, active only with `requireEmailVerification`).
4. Land the user on a "check your inbox" screen with a resend action
   (rate-limited, cooldown shown) and a "wrong address?" path back to sign-up.

## Email verification

- `emailVerification.sendVerificationEmail` sends; `autoSignInAfterVerification`
  decides whether clicking the link signs the user in. Enable auto sign-in only
  when the link opens on the same device is the common case and the session
  policy accepts it.
- `afterEmailVerification` is the hook for post-verify side effects (welcome
  email, provisioning); make it idempotent.
- Unverified sign-in attempt: show "verify your email first" plus resend, or
  use `sendOnSignIn` to resend automatically, but keep the response identical
  to a wrong-password response if that would reveal the account.
- Email change: verify the **new** address before switching, notify the **old**
  address, and audit the change (see Database Hooks in `SKILL.md`).

## Password reset

1. Request (`requestPasswordReset` on the client; older versions named it
   differently — check the installed client): always the same neutral response.
2. `sendResetPassword` builds the link; keep `resetPasswordTokenExpiresIn`
   short (30–60 minutes).
3. Completion page: new password + confirm, password policy shown up front,
   token errors (expired/used) offer "send a new link".
4. Set `revokeSessionsOnPasswordReset: true` so a reset logs out other
   sessions; use `onPasswordReset` to notify the user and write an audit event.
5. After success, sign the user in or send them to sign-in with a success
   banner; never reveal the email address on the reset page.

## Invitations (organization plugin)

- `sendInvitationEmail` sends a link carrying the invitation ID;
  `invitationExpiresIn` defaults to 48 hours; `invitationLimit` caps volume.
- Acceptance requires a signed-in session whose email matches the invitation.
  The invite page therefore branches: signed out → sign in or sign up with the
  invited email prefilled and locked; signed in as another email → explain and
  offer "switch account", never silently accept.
- Show the inviter, organization, and role before accept/decline. Expired,
  revoked, or already-accepted invites each get their own message.
- Re-inviting: decide whether to cancel pending invites
  (`cancelPendingInvitationsOnReInvite`) and show pending/expired state in the
  admin member list (`admin-product-ux` owns that screen contract).

## Organization RBAC

Checked against the [organization plugin docs](https://www.better-auth.com/docs/plugins/organization) on 2026-10-08; re-check on the installed version.

- **Authorize mutations on the server.** `authClient.organization.checkRolePermission` runs synchronously on the client and does not see dynamic roles — use it only to show/hide UI. Every server mutation calls `auth.api.hasPermission({ headers, body: { permissions: { project: ["create"] } } })` (or an equivalent server-side check) and fails closed.
- **Protect the last owner.** Built-in member routes refuse to let the only owner leave or be removed (`YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER`, `routes/crud-members.ts`, checked 2026-10-08); keep that invariant on any custom path (direct DB writes, admin tools, role updates) — transfer ownership first.
- **Guard organization deletion.** Deletion removes all members, invitations, and org data. Set `disableOrganizationDeletion: true`, or gate/soft-delete in `organizationHooks.beforeDeleteOrganization`.
- **`activeOrganizationId` is a pointer, not proof.** Before using the session's active organization in a custom route or query, confirm current membership server-side (e.g. `auth.api.getActiveMember`), and scope every query by that verified org — a member may have been removed since the session was set, and cookie cache can lag (see Session Caching in SKILL.md).

## OAuth and magic link

- **OAuth:** keep state/PKCE handling as configured in `SKILL.md`. Callback
  errors (user cancelled, provider error, email not verified by provider) land
  on the sign-in page with a human message and a retry, never a stack trace or
  raw provider error.
- **Magic link:** `magicLink({ sendMagicLink, expiresIn })`; the default expiry
  is 300 seconds, tokens are consumed on first use, and `storeToken: "hashed"`
  is preferable to the plain default. Set `disableSignUp: true` when magic link
  must not create accounts. Warn users that email scanners can pre-open links;
  if that consumes tokens in practice, add an interstitial "Continue" button
  page that performs the verification on POST.
- Request screen: identical response for known and unknown emails, show which
  address the link went to, and a resend with cooldown.

## Account linking

- Linking is on by default and links on sign-in only when the provider
  verifies the email. Keep `trustedProviders` to providers you trust to verify
  email; a trusted provider links even without verification, which is an
  account-takeover vector if the provider allows unverified emails.
- Keep `allowDifferentEmails` off unless the product requires it; when on,
  require an authenticated session and recent re-authentication before
  `linkSocial`.
- Consider `disableImplicitLinking` for admin or high-value accounts so linking
  only happens from an authenticated settings screen.
- Settings screen lists linked methods, blocks unlinking the last sign-in
  method (default), and audits link/unlink events.

## Session expiry UX

- Server is the authority: every protected request and Server Action/Astro
  Action re-checks the session; the UI only reacts.
- On expiry during navigation: redirect to sign-in with a validated return URL
  and a "your session expired" notice.
- On expiry during a form submit or mutation: do not discard input. Return a
  typed `unauthenticated` result, preserve form state (or a local draft), and
  prompt re-authentication (modal or redirect with return URL), then let the
  user resubmit. Never silently retry a non-idempotent mutation.
- Sensitive actions (email/password change, linking, deleting, billing)
  require a fresh session (Better Auth `freshAge`) and prompt re-authentication
  when stale.
- Sign-out revokes the server session and clears client caches holding user
  data; "sign out everywhere" revokes all sessions.

## Verification checklist

- Enumeration: compare responses (body, status, rough timing) for an existing
  and a non-existing email on sign-up, reset, magic link, and resend.
- Links: valid, expired, reused, tampered each render their recovery path.
- Reset revokes other sessions; email change notifies the old address.
- Invite accepted only by the matching signed-in email.
- Session expiry mid-form preserves input and resubmits after sign-in.
- Rate-limit responses render as user-facing messages.

## Source notes

Verified 2026-10-02 against official docs:
- Email/password (`requireEmailVerification`, `sendResetPassword`,
  `revokeSessionsOnPasswordReset` default false, `onPasswordReset`, client
  `requestPasswordReset`/`resetPassword`, 8–128 default length, "avoid awaiting
  the email sending"): https://www.better-auth.com/docs/authentication/email-password
- Email verification (`sendOnSignUp`, `sendOnSignIn`,
  `autoSignInAfterVerification`, `afterEmailVerification`):
  https://www.better-auth.com/docs/concepts/email
- Account linking (enabled by default, `trustedProviders`,
  `allowDifferentEmails`, `disableImplicitLinking`, `allowUnlinkingAll`):
  https://www.better-auth.com/docs/concepts/users-accounts
- Magic link (`expiresIn` 300 s default, `disableSignUp`, `storeToken`,
  single-use consumption): https://www.better-auth.com/docs/plugins/magic-link
- Organization invitations (`invitationExpiresIn` 48 h, `invitationLimit` 100,
  matching-email acceptance): https://www.better-auth.com/docs/plugins/organization

- Session freshness (`session.freshAge`, default 1 day, `0` disables) and
  `onExistingUserSignUp` (configured on `emailAndPassword`, requires
  `requireEmailVerification`):
  https://www.better-auth.com/docs/concepts/session-management and the
  email/password page above. Current release on npm: `better-auth` 1.7.7
  (1.6.x still maintained as `release-1.6`).

Not stated in the docs today: the default verification-token `expiresIn`;
read it from the installed package before promising a link lifetime.

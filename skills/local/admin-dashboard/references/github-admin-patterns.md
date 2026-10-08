# GitHub Admin Patterns — Technical Architecture & Specifications

> Implementation-contract reference harvested from top production systems (Refine, Payload CMS, Medusa Admin, Strapi, next-shadcn-dashboard-starter, TanStack Table v9, kbar, Clerk).
> Complements `SKILL.md` (which owns decision rules) with verifiable contract patterns.

---

## 1. Navigation & Dynamic Menu Taxonomy

### 1.1 Multi-Tenant & Role-Filtered Navigation Registry
Admin navigation trees must be constructed from a declarative, server-evaluated menu registry rather than static UI components.

```ts
export type NavItem = {
  id: string;
  title: string;
  href?: string;
  icon?: string;
  badge?: string | number;
  roles?: string[];
  permissions?: string[];
  tenantScoped?: boolean;
  children?: NavItem[];
};
```

**Key Execution Contracts:**
- **Server Filtering:** Filter out menu items on the server based on the active user's role and permission matrix before returning the nav spec to the client. Never rely solely on client-side visual hiding.
- **Active Route Highlighting:** Match active routes using nested sub-path checking (`pathname.startsWith(item.href)`), maintaining parent node expansion state for deeply nested structures.
- **Command Palette Integration (`Cmd+K` / `Ctrl+K`):** Expose all dynamic routes and quick operator actions via a `kbar` or `cmdk` dialog for keyboard-first navigation.

---

## 2. Data-Dense Table Architecture (TanStack Table v9 Baseline)

### 2.1 Server-Side Integration & State Preservation
Data-dense operator views must decouple state management from presentation:

- **`getRowId` Contract:** Always supply explicit row identifiers: `getRowId: (row) => row.id`. Page-relative indexes lead to severe state degradation across paginated or sorted views.
- **Manual Feature Opt-In:** Under TanStack Table v9, set explicit manual flags (`manualPagination: true`, `manualSorting: true`, `manualFiltering: true`).
- **Filter-Page Reset Rule:** Disabling `autoResetPageIndex` under manual pagination requires manual page index resets (`pageIndex = 0`) whenever sorting or filtering parameters change.

### 2.2 Bulk Actions & Selection Strategy
- **Row Selection vs Selection Across Pages:** Selection models must explicitly track `selectedRowIds: Record<string, boolean>`. "Select all matching search" MUST be handled as a server-side bulk operation query filter rather than selecting hundreds of client-side IDs.
- **Partial Failure Handling:** Bulk actions must return structured feedback:
  ```json
  {
    "total": 40,
    "successful": 23,
    "failed": 17,
    "errors": [{ "id": "ord_102", "reason": "Inventory locked" }]
  }
  ```

---

## 3. Form Architectures & Draft Lifecycle

### 3.1 Dirty State & Unsaved Changes Guard
- **Dirty State Tracking:** Track form dirtiness via reactive state (`isDirty`). Intercept navigation attempts (both `beforeunload` browser events and router transitions) when `isDirty === true`.
- **Autosave Debouncing:** **[House rule, no upstream basis]** debounce local field persistence (~`800ms`) and show an explicit timestamp badge (`Draft saved at 14:32`). Keep a **draft distinct from the active record**: SAP Fiori draft handling (v1.148) saves the server draft about every 20 s, locks the object while edited (lock expires after 30 min idle), and publishes only on an explicit Save; autosave must never overwrite the active/published version (WordPress Revisions, 2026-09-28).

---

## 4. Operational Surfaces: RBAC, Multi-Tenancy & Security

### 4.1 Permission Matrix as Query Constraints
- Permissions are query constraints, not just boolean UI flags. Filter data at the database layer (e.g., Payload CMS `where: { tenant: { equals: activeTenantId } }`).

### 4.2 Impersonation & Operator Safety
- **Visual Callout:** Render a high-visibility persistent top banner during impersonation sessions (`Impersonating User: john@example.com`).
- **One-Click Exit:** Provide an **authenticated**, server-validated exit request bound to the current impersonation session (`POST /api/auth/impersonate/exit`, CSRF-protected) that immediately revokes the delegated session and restores the operator's own session. An unauthenticated exit endpoint would let anyone end or tamper with sessions (OWASP session-management principles).
- **Dual attribution:** every action during impersonation records both the real operator and the impersonated user; the session start/stop is its own audit event.
- **Expiry Bounds:** **[House rule]** Cap impersonation tokens at 30 minutes. Retain or tighten Clerk's documented default 10-minute inactivity timeout ([Clerk — User impersonation](https://clerk.com/docs/guides/users/impersonation)); the 30-minute absolute maximum is local policy, not a Clerk default.

---

## 5. Summary & System Invariants

1. Overview first, detail on demand.
2. Server-authoritative state across permissions, navigation, and bulk actions.
3. Accessible visual hierarchy with explicit non-color cues.

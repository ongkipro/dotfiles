---
name: baseui-store-crash
description: "base-ui Menu/Popover can crash with \"Store is not defined\" in a production bundle when a refetch re-renders it — use a custom dropdown for controls that trigger a fetch"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f2da746-5aac-4aba-81b9-623041dc8131
---

The `@base-ui/react` Menu (DropdownMenu) and Popover components use an internal `Store` (`menu/store/MenuHandle.js`). In a **Next.js production bundle**, if one of these components **re-renders while open because of an async state update** (for example, its onChange triggers a `useAsync` refetch), it can throw `ReferenceError: Store is not defined` → a render error → the page crashes (caught by global-error or an error boundary).

**Why:** found while building the multi-select account filter in the Social Inbox (`web/app/app/social-inbox/page.tsx`). A `DropdownMenuCheckboxItem` whose onChange triggered a chat refetch crashed the dropdown in production (local/dev sometimes passes). base-ui dropdowns that do NOT trigger a fetch — for instance the assignee picker in create-task-dialog — are fine.

**How to apply:**
- For dropdown controls that trigger data fetching (filters, sorting) → use a **plain custom HTML dropdown**: a `<button>` plus an `absolute` panel plus `<input type="checkbox">`, with click-outside (a `mousedown` listener) and Escape handling. See `AccountFilter` in `social-inbox/page.tsx` as the pattern.
- base-ui Menu/Popover remain fine for action menus that do not trigger a refetch while open.
- Always verify with `npm run build` (the production bundle), not just `tsc` or dev — this bug only surfaces in production.

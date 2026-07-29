---
name: baseui-store-crash
description: "base-ui Menu/Popover bisa crash \"Store is not defined\" di bundle produksi saat re-render karena refetch — pakai dropdown custom untuk kontrol yang memicu fetch"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f2da746-5aac-4aba-81b9-623041dc8131
---

Komponen `@base-ui/react` Menu (DropdownMenu) & Popover memakai `Store` internal (`menu/store/MenuHandle.js`). Di **bundle produksi Next.js**, jika komponen ini **re-render saat sedang terbuka karena update state async** (mis. onChange-nya memicu refetch `useAsync`), ia bisa melempar `ReferenceError: Store is not defined` → error render → halaman crash (ketangkep global-error / error boundary).

**Why:** Ketemu saat bikin filter akun multi-select di Inbox Sosial (`web/app/app/social-inbox/page.tsx`). DropdownMenuCheckboxItem yang onChange-nya men-trigger refetch chat bikin dropdown crash di produksi (lokal/dev kadang lolos). Dropdown base-ui yang TIDAK memicu fetch (mis. assignee picker di create-task-dialog) aman.

**How to apply:**
- Untuk kontrol dropdown yang memicu pengambilan data (filter, sort) → pakai **dropdown custom HTML murni**: `<button>` + panel `absolute` + `<input type="checkbox">`, dengan click-outside (`mousedown` listener) & Escape. Lihat `AccountFilter` di `social-inbox/page.tsx` sebagai pola.
- base-ui Menu/Popover tetap OK untuk menu aksi yang tidak memicu refetch saat terbuka.
- Selalu verifikasi via `npm run build` (bundle produksi), bukan cuma `tsc`/dev — bug ini muncul di produksi.

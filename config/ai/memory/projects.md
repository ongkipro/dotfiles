# Memori: Projects — fakta per-project
> Bagian dari memori bersama. Tambah/aktualkan saat kerja di sebuah project.
> Format: `## <nama project>` lalu bullet fakta penting (path, stack, catatan, jangan-lupa).

## dotfiles
- `~/dotfiles` → backup semua config, repo private `github.com/ongki5758/dotfiles`.
- `install.sh` untuk setup device baru (idempotent).

## pixsgo
- path: `/home/fantastico/Projects/pixsgo`
- stack: Astro, TailwindCSS, Shopify Storefront API, Cloudflare Workers / Wrangler
- catatan: Rebranded to "Play & Go" (Toys & Hobbies). Visual guidelines are Playful, Minimalist, Modern, and Fun. Avoid retro arcade, console hacking, or brutalist boxes. Ensure senior accessibility (font >= 16px, labels on icons).
- Rethemed all pages and layout components (Header, Footer, 404, FAQ, cart, filter sidebar) to sand borders (`border-border`) and soft rounded elements, eliminating all retro slate/gray borders and brutalist shadows.
- Updated `getStaticPaths` in `src/pages/products/[handle].astro` to combine live Shopify handles with mock fallback handles, resolving the isolated scope build constraint in Astro and preventing 404 errors on internal fallback links.

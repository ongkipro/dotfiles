# Memory: User preferences (ongkipro)
> Part of shared memory.

- **Conversation** language: casual Bahasa Indonesia; technical terms stay English.
- **Repo content** language (different from conversation), matching the final dotfiles policy:
  - **dotfiles** → skills (`SKILL.md`), memory (`config/ai/memory/*`, `config/ai/project-memory/*`), & system docs all in **English** — these are AI-read artifacts, and English keeps programming terminology unambiguous.
  - **Reasoning/conversation with the user** stays Indonesian; technical terms stay English everywhere.
  - **Kamus** (`kamus.ongki.pro`) → **Bahasa Indonesia** (not Malay/Melayu); technical & development terms stay English (*home* not "beranda", *campaign* not "kampanye", dashboard, deploy, commit, funnel).
- Priority: lightweight, fast, simple, terminal-first.
- Install: prefer no-sudo (mise). sudo only when the system truly needs it.
- Terminal appearance: PLAIN prompt without Nerd Font/icons.
- macOS: use Homebrew for system tools, mise for dev tools.
- Likes concise explanations + clear steps; asks for confirmation before hard-to-reverse actions.
- Preferred form of address: Paduka Ongki.
- **Session opener**: default native behavior of the active AI CLI — no custom opener, banners, ASCII templates, or ceremonial preambles; respond directly to the prompt.
- For bio/credential/public profile: prefers a professional style like a clean GitHub README — capability-first, modern, and not feeling like a generic services ad.
- For personal positioning: prefers to be presented as a builder / operator / strategist rather than merely a "freelancer" or "service provider".

- **UI & Design Invariant — Star Ratings**: Whenever rendering star ratings or review stars (in hero sections, PDPs, review cards, social proof), the star icon must always be **solid / filled** (e.g. `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/></svg>`), **never hollow, empty, or outline-only**. Warna kuning/amber padat (`#f59e0b` / `#fbbf24` / `#f5a623`).
- **UI & Design Invariant — Zero AI-Slop (Flat Minimalist Gen-Z & Millennial)**:
  - **Decorative badge icons are AI slop**: NEVER place decorative mini icons (such as `Sparkles`, magic stars, wands) inside rounded pill badges above section titles or kickers. Use pure, crisp typographic kickers (`text-[11px] uppercase tracking-[0.25em] font-mono text-neutral-400` or clean sans) with NO icons and NO background pills.
  - **No bubbly rounded-3xl / rounded-2xl or pastel gradient containers**: Avoid bloated bubbly border-radii (`rounded-3xl`), bubble pill badges (`rounded-full bg-...`), and pastel gradients (`bg-gradient-to-br`). Modern high-end Gen-Z & Millennial aesthetic (Rhode, Glossier, Byredo, Aesop, SSENSE) is flat, sharp or micro-radius (`rounded-none` to `rounded-sm`), architectural whitespace, and high-contrast typography.
  - **No skeuomorphic gimmicks (pushpins, sticky notes, tilted cards, fake meter bars)**: NEVER simulate physical objects (such as 3D pushpins, taped paper, rotated/tilted memo cards, corkboards) or invent arbitrary percentage progress bars (e.g. "35% Recovery Barrier", "70% Surface Refinement"). Timelines, milestone journeys, and steps must be displayed as clean, architectural linear progressions (minimal grid or vertical index `01 / 02 / 03`, crisp borders, solid contrast, genuine factual copy).


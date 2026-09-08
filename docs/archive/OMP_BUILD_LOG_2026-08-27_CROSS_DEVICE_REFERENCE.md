# Build Log — OMP, 2026-08-27 cross-device default reference

Moved out of `config/omp/BUILD-LOG.md` on 2026-09-08 to keep that hot log inside
its 12 KB context budget. The role graph recorded here has since been revised —
notably the visual lane, split into `designer` and `vision` on 2026-08-31. Read
`config/omp/config.yml` and `ROUTING.md` for the current graph; this entry is
retained only as the record of how the reference was first promoted.

## 2026-08-27 cross-device default reference

- Promoted the validated device role graph into the secret-free
  `config/omp/config.yml` reference without restoring installer links, command
  wrappers, `PI_CONFIG_FILES`, shared authentication, or shared session state.
- Kept Codex Terra/Sol as the normal and complex development lanes, Gemini 3.7
  Flash as the high-volume support lane, and direct Anthropic Claude 5 as the
  independent judgment lane.
- Set `vision` and `designer` to Claude Opus 5 High by explicit user choice.
- Kept `smol` on Gemini 3.7 Flash Medium, `discovery` on Flash High, and
  `research` on Flash Medium, with cross-provider fallbacks.
- Limited deterministic agent overrides to the seven agents bundled by OMP
  18.0.6; no retired custom agent definition was restored.

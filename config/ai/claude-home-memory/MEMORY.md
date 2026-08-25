# Home Workspace Bootstrap

This directory is intentionally small. It exists only because Claude Code may
load memory while its working directory is `$HOME`.

- Do not treat `$HOME` as a project workspace.
- Start project sessions from the repository root, or pass an explicit working
  directory.
- Use `ai-memory-access --repo <path>` to select the smallest relevant durable
  context. Never scan or preload all of `config/ai/project-memory/`.
- Repository contracts, `.delivery/` evidence, executable checks, and current
  code override personal memory.
- Personal project memory is reference material only; it never owns current
  status, requirements, architecture, or technical decisions.

# Development Environment Quick Reference

This legacy quick-reference file no longer carries copy-paste shell configuration. The tracked files are the source of truth:

- Linux: [`linux-dev-setup.md`](linux-dev-setup.md)
- Linux fresh install: [`linux-install-step-by-step.md`](linux-install-step-by-step.md)
- macOS fresh install: [`macos-install-step-by-step.md`](macos-install-step-by-step.md)
- Repository architecture and daily commands: [`../README.md`](../README.md)

Do not paste a generated tool block into `~/.bashrc` or `~/.zshrc`. The installers maintain source lines that load tracked shell files from `~/dotfiles/config/`.

Run the current diagnostics after setup or repair:

```bash
ai-doctor --self-test
```

When documentation and runtime behavior disagree, inspect the live path and executable script. Disk wins; update the stale documentation afterward.

# Project Accessibility Record Template

This is an optional project-record helper, not a design-rule source. Copy the section below into the target project's `design-tokens.md`; do not record project-specific values in this canonical skill directory.

```markdown
## Accessibility notes

| Token or pair | Context | Measured ratio | Requirement | Restriction or remediation |
|---|---|---:|---|---|
| `<foreground>` on `<background>` | `<text/control/theme>` | `<ratio>` | `<AA/AAA/project rule>` | `<allowed use or required change>` |

- Keyboard/focus exceptions: <none or evidence-backed exception>
- Light/dark differences: <pairs re-derived rather than inverted>
- Verification source and date: <tool/manual check, YYYY-MM-DD>
```

The canonical contrast and theme rules remain in [design-taste](../SKILL.md); browser evidence belongs to `ui-validation`.

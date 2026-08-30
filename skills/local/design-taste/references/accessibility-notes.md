# Project Accessibility Record Template

This is an optional project-record helper, not a design-rule source. Copy the
section below into the project's canonical design artifact; do not create a
parallel token file or record project facts in this skill directory.

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

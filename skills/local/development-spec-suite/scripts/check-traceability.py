#!/usr/bin/env python3
"""Dependency-free structural and traceability checks for a Markdown pack."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ID_RE = re.compile(r"\b(?:BR|PR|NFR|TD|ADR|ARCH|DATA|TEN|IAM|DOM|API|UX|BILL|SEC|PRIV|CTRL|SLI|SLO|DR|DEL|MIG|OBS|RATE|CTX|OVR|JUR|XFER|LOC|TEST|EVID)-\d+\b")
TASK_RE = re.compile(r"^###\s+(T\d+)\b", re.MULTILINE)
PRIMARY_RE = re.compile(r"^-\s*Primary requirement:\s*([A-Z]+-\d+)\s*$", re.MULTILINE)


def main() -> int:
    if len(sys.argv) != 2:
        print(f"usage: {Path(sys.argv[0]).name} <markdown-pack-root>", file=sys.stderr)
        return 2
    root = Path(sys.argv[1]).expanduser().resolve()
    if not root.is_dir():
        print(f"error: not a directory: {root}", file=sys.stderr)
        return 2

    files = sorted(root.rglob("*.md"))
    findings: list[str] = []
    all_ids: dict[str, Path] = {}
    for path in files:
        text = path.read_text(encoding="utf-8")
        if (len(re.findall(r"^```", text, re.MULTILINE)) % 2) != 0:
            findings.append(f"{path}: unbalanced code fence")
        for link in re.findall(r"\[[^\]]+\]\(([^)#]+)", text):
            if link.startswith(("http://", "https://", "mailto:")):
                continue
            if not (path.parent / link).exists():
                findings.append(f"{path}: broken local link {link}")
        for identifier in ID_RE.findall(text):
            # Placeholder forms such as PR-[N] do not match ID_RE.
            if identifier in all_ids and all_ids[identifier] != path:
                # References are expected across files; only duplicate declaration headings are errors.
                continue
            all_ids.setdefault(identifier, path)

    tasks = []
    for path in files:
        text = path.read_text(encoding="utf-8")
        tasks.extend((match.group(1), path, text[match.start():]) for match in TASK_RE.finditer(text))
    primary = PRIMARY_RE.findall("\n".join(path.read_text(encoding="utf-8") for path in files))
    if tasks and len(primary) != len(tasks):
        findings.append(f"task primary mapping: found {len(tasks)} tasks but {len(primary)} primary requirements")

    secret_pattern = re.compile(r"(?:api[_-]?key|access[_-]?token|password|private[_-]?key)\s*[:=]\s*[A-Za-z0-9_/+.-]{16,}", re.I)
    for path in files:
        if secret_pattern.search(path.read_text(encoding="utf-8")):
            findings.append(f"{path}: credential-like assignment")

    if findings:
        for finding in findings:
            print(f"FAIL {finding}")
        return 1
    print(f"PASS files={len(files)} tasks={len(tasks)} identifiers={len(all_ids)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

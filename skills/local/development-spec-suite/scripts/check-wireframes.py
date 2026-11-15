#!/usr/bin/env python3
"""Check box-drawing wireframes in Markdown code fences for misaligned borders.

For every box whose top border is `┌…┐` on one line, each following line down to its `└…┘` must carry a border
character at the same two display columns. Display width counts East Asian wide characters and any character followed
by U+FE0F (emoji presentation, e.g. ⚠️ ↩️ 🖨️) as two columns, which is how GitHub and most terminals render them.

Usage: check-wireframes.py FILE.md [FILE.md ...]   exit 0 = aligned, 1 = misaligned lines found, 2 = usage error.
"""

from __future__ import annotations

import sys
import unicodedata
from pathlib import Path

BORDERS = set("│├┤┼║╟╢┬┴┌┐└┘╞╡╪")


def cells(line: str) -> list[str]:
    """Return one entry per display column; a wide character is followed by an empty filler cell."""
    out: list[str] = []
    for index, char in enumerate(line):
        if unicodedata.combining(char) or char in "\ufe0f\u200d":
            continue
        out.append(char)
        emoji_presentation = index + 1 < len(line) and line[index + 1] == "\ufe0f"
        if unicodedata.east_asian_width(char) in "WF" or emoji_presentation:
            out.append("")
    return out


def check(path: Path) -> list[str]:
    lines = path.read_text(encoding="utf-8").split("\n")
    problems: list[str] = []
    in_fence = False
    for top, line in enumerate(lines):
        if line.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if not in_fence:
            continue
        row = cells(line)
        for left, char in enumerate(row):
            if char != "┌":
                continue
            try:
                right = row.index("┐", left + 1)
            except ValueError:
                continue
            if "┌" in row[left + 1 : right]:
                continue
            for below in range(top + 1, len(lines)):
                if lines[below].strip().startswith("```"):
                    problems.append(f"{path}:{top + 1}: box never closed inside the fence")
                    break
                other = cells(lines[below])
                lc = other[left] if left < len(other) else " "
                rc = other[right] if right < len(other) else " "
                if lc == "└" or rc == "┘":
                    if not (lc == "└" and rc == "┘"):
                        problems.append(f"{path}:{below + 1}: bottom border of box at line {top + 1} misaligned")
                    break
                if lc not in BORDERS or rc not in BORDERS:
                    problems.append(
                        f"{path}:{below + 1}: box at line {top + 1} expects borders at columns {left} and {right}, "
                        f"found {lc!r} and {rc!r}"
                    )
    return problems


def main(argv: list[str]) -> int:
    if not argv:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    problems = [problem for name in argv for problem in check(Path(name))]
    for problem in problems:
        print(problem)
    print(f"wireframes: {len(problems)} misaligned line(s) in {len(argv)} file(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

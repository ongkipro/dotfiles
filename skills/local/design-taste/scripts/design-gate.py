#!/usr/bin/env python3
"""Delivery gate for a new or redesigned public page (SKILL.md §8).

Usage: design-gate.py PROJECT [--design FILE] [--src DIR ...]

Fails (exit 1) when the evidence the workflow asks for is missing or when the
source matches a generated look the brief did not ask for. Prose in DESIGN.md
cannot satisfy it: references must be ui-ref captures on disk and the render
critique must point at screenshots newer than the source.

  refs      >= 2 directories cited in the design file that hold a ui-ref
            capture (ref.json), e.g. design/refs/<name>/
  critique  a "Render critique" heading citing >= 2 existing screenshots
            (narrow + wide), the newest at least as new as the newest source
  look      source-level counts for the tech-mono template look: monospace
            usage, `//` separators and numbered labels in displayed text,
            tracked uppercase labels, Tailwind default blue/indigo accent

A look the brief really wants is allowed by a design-file line
`gate-allow: <check> - <reason>`; allowed checks are reported, not hidden.
Exit 0 = pass, 1 = fail, 2 = not applicable (no design file or no source).
"""
import re, sys
from pathlib import Path

SRC_EXT = {".astro", ".html", ".jsx", ".tsx", ".vue", ".svelte", ".liquid", ".css", ".scss"}
SKIP = {"node_modules", "dist", ".astro", ".next", ".git", "build", ".vercel", ".output"}
IMG = re.compile(r"[\w./-]+\.(?:png|jpe?g|webp)\b", re.I)
PATH = re.compile(r"[`(\[]?((?:\./)?[\w.-]+(?:/[\w.-]+)+/?)[`)\]]?")
TEXT = re.compile(r">([^<>{}]+)<")
CODE = re.compile(r"\A---\n.*?\n---\n|<(script|style)\b.*?</\1>|<!--.*?-->|\{[^{}]*\}", re.S)
MONO = re.compile(r"\bfont-mono\b|font-family\s*:[^;}\n]*\bmono", re.I)
TRACKED = re.compile(r"class(?:Name)?=[\"'{`][^\"'`}]*(?:\buppercase\b[^\"'`}]*\btracking-|\btracking-[^\"'`}]*\buppercase\b)")
ACCENT = re.compile(r"\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:blue|indigo|violet)-(?:500|600|700)\b"
                    r"|#(?:2563eb|3b82f6|1d4ed8|4f46e5|6366f1|4338ca|7c3aed|8b5cf6)\b", re.I)
# "03 / Analytics" or "LAYANAN 01"; a bare "01" or "Step 01" on a real sequence is fine.
NUMBERED = re.compile(r"\b0\d\s*/\s*[^\d\s]|^\s*(?!(?:step|langkah|tahap|phase)\b)[A-Za-z]+\s+0\d\s*$", re.I)
LIMITS = {"mono": 8, "slash": 1, "numbered": 2, "accent": 5}


def sources(root, dirs):
    for d in dirs:
        for f in (root / d).rglob("*"):
            if f.is_file() and f.suffix in SRC_EXT and not SKIP & set(f.relative_to(root).parts):
                yield f


def main(argv):
    if not argv or argv[0].startswith("-"):
        print(__doc__); return 2
    root = Path(argv[0]).resolve()
    opts = dict(zip(argv[1::2], argv[2::2]))
    design = root / opts.get("--design", "DESIGN.md")
    src_dirs = [opts["--src"]] if "--src" in opts else ["src"] if (root / "src").is_dir() else ["."]
    if not design.is_file():
        print(f"not applicable: {design} missing (report as NOT CHECKED)"); return 2
    files = list(sources(root, src_dirs))
    if not files:
        print("not applicable: no source files (report as NOT CHECKED)"); return 2
    doc = design.read_text(errors="ignore")
    allowed = {m.group(1).lower() for m in re.finditer(r"gate-allow:\s*(\w+)\s*[-—:]\s*\S", doc)}
    fails = []

    def check(name, ok, detail):
        state = "PASS" if ok else ("ALLOWED" if name in allowed else "FAIL")
        print(f"{state:8}{name}: {detail}")
        if state == "FAIL":
            fails.append(name)

    refs = {p for p in (root / m.group(1).rstrip("/") for m in PATH.finditer(doc))
            if p.is_dir() and (p / "ref.json").is_file()}
    check("refs", len(refs) >= 2, f"{len(refs)} ui-ref capture dir(s) cited (need 2): "
          + (", ".join(str(p.relative_to(root)) for p in sorted(refs)) or
             "capture with `node scripts/ui-ref.mjs capture URL --out design/refs/<name>`"))

    head = re.search(r"^#+\s*Render critique.*$", doc, re.I | re.M)
    shots = []
    if head:
        nxt = re.search(r"^#{1,%d}\s" % head.group(0).count("#", 0, 6), doc[head.end():], re.M)
        body = doc[head.end(): head.end() + nxt.start() if nxt else None]
        shots = [p for p in {root / m.group(0) for m in IMG.finditer(body)} if p.is_file()]
    newest_src = max(f.stat().st_mtime for f in files)
    fresh = shots and max(p.stat().st_mtime for p in shots) >= newest_src
    check("critique", bool(head) and len(shots) >= 2 and bool(fresh),
          "no 'Render critique' heading" if not head else
          f"{len(shots)} existing screenshot(s) cited (need 2)" + ("" if fresh or not shots else
          "; newest screenshot is older than the source: re-render and re-critique"))

    n = {k: 0 for k in LIMITS}
    tracked = sections = 0
    where = {k: [] for k in LIMITS}
    def hit(k, f, i, v=1):
        n[k] += v
        if len(where[k]) < 3:
            where[k].append(f"{f.relative_to(root)}:{i}")

    for f in files:
        src = f.read_text(errors="ignore")
        for i, line in enumerate(src.splitlines(), 1):
            for k, rx in (("mono", MONO), ("accent", ACCENT)):
                if c := len(rx.findall(line)):
                    hit(k, f, i, c)
            tracked += len(TRACKED.findall(line))
            sections += len(re.findall(r"<section\b", line))
        # Displayed text spans lines; blank out code first, keeping line numbers.
        shown = CODE.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), src)
        for m in TEXT.finditer(shown):
            base = shown.count("\n", 0, m.start(1)) + 1
            for j, t in enumerate(m.group(1).split("\n")):
                i = base + j
                if c := len(re.findall(r"\s//\s", f" {t} ")):
                    hit("slash", f, i, c)
                if NUMBERED.search(t):
                    hit("numbered", f, i)
    notes = {"mono": "monospace beyond code/tabular data",
             "slash": "`//` separators in displayed text",
             "numbered": "numbered labels (01 /, LAYANAN 01) on non-sequences",
             "accent": "Tailwind default blue/indigo/violet accent"}
    for k, limit in LIMITS.items():
        check(k, n[k] <= limit,
              f"{n[k]} (limit {limit}) {notes[k]}" + (f" e.g. {', '.join(where[k])}" if n[k] > limit else ""))
    check("labels", tracked <= sections + 2,
          f"{tracked} tracked uppercase label(s) vs {sections} <section>(s) (limit sections + 2)")

    print(f"{'FAIL' if fails else 'PASS'}: {len(fails)} failing check(s)"
          + (f" ({', '.join(fails)})" if fails else ""))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

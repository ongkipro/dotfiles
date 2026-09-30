#!/usr/bin/env python3
"""Flag invented-information tells in displayed text (see references/invented-info-tells.md).

Usage: tells-scan.py PATH [PATH...]
Scans .html/.astro/.jsx/.tsx/.vue/.svelte/.liquid for text between tags plus
alt/aria-label/placeholder/title. Findings are QUESTIONS for the brief, not defects.
Exit 0 = ran (findings or clean), 2 = not applicable (no scannable files): report
that as "not checked", never as passed. Copy held in JS/TS/JSON/CMS data is not seen.
"""
import re, sys
from pathlib import Path

EXT = {".html", ".astro", ".jsx", ".tsx", ".vue", ".svelte", ".liquid"}
TELLS = {
    "locale-clock": r"\b[A-Z]{3}\s*\d{1,2}:\d{2}\b|\bGMT\s*[+-]\d",
    "fake-build": r"\bv\d+\.\d+\.\d+(?:-[\w.]+)?\b|last sync\b|\bBuild\s+\d{3,}\b",
    "heritage": r"\bEST(?:D)?\.?\s*(?:19|20)\d{2}\b",
    "section-code": r"\bSEC-\d+\b|\bMK\.[IVX]+\b|\bPlate\s+\d+\b",
    "step-label": r"\b(?:Step|Phase)\s+(?:0?\d|[IVX]+)\b",
    "tile-pager": r"\b0\d\s*/\s*0?\d\b",
    "placeholder-name": r"\bJohn Doe\b|\bJane Doe\b|\bAcme\b|\bLorem ipsum\b",
    "false-precision": r"\b99\.9+%|\b\d+x\b|\b\d+\.\d%",
    "filler-verb": r"\b(?:elevate|seamless(?:ly)?|unleash|supercharge|empower)\b",
    "em-dash": "—",
}
TEXT = re.compile(r">([^<>{}]+)<|(?:alt|aria-label|placeholder|title)=\"([^\"]+)\"", re.I)

def files(paths):
    for p in map(Path, paths):
        yield from (f for f in ([p] if p.is_file() else p.rglob("*"))
                    if f.suffix in EXT and "node_modules" not in f.parts)

def main(argv):
    scanned, hits = 0, 0
    for f in files(argv):
        scanned += 1
        for n, line in enumerate(f.read_text(errors="ignore").splitlines(), 1):
            for m in TEXT.finditer(line):
                text = m.group(1) or m.group(2)
                for name, rx in TELLS.items():
                    if re.search(rx, text, re.I if name == "filler-verb" else 0):
                        hits += 1
                        print(f"{f}:{n}: {name}: {text.strip()[:80]}")
    if not scanned:
        print("not applicable: no scannable files (report as NOT CHECKED)")
        return 2
    print(f"scanned {scanned} file(s), {hits} question(s) for the brief")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or ["."]))

#!/usr/bin/env python3
"""List the visual choices the owner's recent projects already made.

Usage: portfolio-scan.py [--limit N] [ROOT ...]   (default ROOT: ~/Projects)

For each project (a directory with package.json; git worktrees of one repo
count once; several brands built on one package name are reported as a
shared template) it reads the main stylesheet, layout, and config files and
reports: custom font families, radius, accent/primary token, and the first
line under "## Direction" in DESIGN.md. Then it prints how often each font,
radius, and accent value recurs. Use it before choosing a new direction so
the new site does not repeat the portfolio's habits (SKILL.md §2.1).
Line-based heuristics: a family loaded only from JS data or a CDN link tag is
missed. Exit 0 = ran; 2 = no projects found (report "not checked").
"""
import json, re, subprocess, sys
from collections import Counter
from pathlib import Path

GENERIC = {
    "system-ui", "sans-serif", "serif", "monospace", "cursive", "inherit",
    "-apple-system", "blinkmacsystemfont", "segoe ui", "roboto", "helvetica",
    "helvetica neue", "arial", "noto sans", "ui-sans-serif", "ui-serif",
    "ui-monospace", "sfmono-regular", "menlo", "monaco", "consolas",
    "liberation mono", "courier new", "georgia", "cambria", "times new roman",
    "times", "apple color emoji", "segoe ui emoji", "segoe ui symbol",
    "noto color emoji", "emoji", "ubuntu", "oxygen", "cantarell",
}
STYLE_GLOBS = ["src/styles/*.css", "src/styles/*.scss", "app/globals.css",
               "src/app/globals.css", "src/index.css", "styles/*.css",
               "src/*.css"]
CODE_GLOBS = ["astro.config.*", "tailwind.config.*", "src/layouts/*.astro",
              "app/layout.tsx", "src/app/layout.tsx", "src/main.tsx"]
FONT_DECL = re.compile(r"(?:font-family|--font-[\w-]+)\s*:\s*([^;}\n]+)", re.I)
NEXT_FONT = re.compile(r"import\s*\{([^}]+)\}\s*from\s*['\"]next/font/(?:google|local)['\"]")
FONTSOURCE = re.compile(r"@fontsource(?:-variable)?/([\w-]+)")
ASTRO_FONT = re.compile(r"\bname\s*:\s*['\"]([^'\"]+)['\"]")
RADIUS = re.compile(r"(?:--radius[\w-]*|border-radius)\s*:\s*([^;}\n]+)")
ACCENT = re.compile(r"--(?:color-)?(?:primary|accent|brand)\s*:\s*([^;}\n]+)")


def families(value):
    out = []
    for part in value.split(","):
        name = part.strip().strip("'\"").strip()
        if not name or name.lower() in GENERIC or "(" in name or ")" in name:
            continue
        out.append(name.replace(" Variable", ""))
    return out


def scan(project):
    fonts, radius, accent = [], None, None
    files = [f for g in STYLE_GLOBS + CODE_GLOBS for f in project.glob(g)]
    for f in files:
        try:
            src = f.read_text(errors="ignore")[:200_000]
        except OSError:
            continue
        for m in FONT_DECL.finditer(src):
            fonts += families(m.group(1))
        for m in NEXT_FONT.finditer(src):
            fonts += [n.strip().replace("_", " ") for n in m.group(1).split(",") if n.strip()]
        fonts += [n.replace("-", " ").title() for n in FONTSOURCE.findall(src)]
        if f.name.startswith("astro.config") and (m := re.search(r"\bfonts\s*:\s*\[", src)):
            fonts += ASTRO_FONT.findall(src[m.end():m.end() + 3000].split("]")[0])
        if radius is None and (m := RADIUS.search(src)) and "var(" not in m.group(1):
            radius = m.group(1).strip()
        if accent is None and (m := ACCENT.search(src)) and "var(" not in m.group(1):
            accent = m.group(1).strip()
    direction = None
    design = project / "DESIGN.md"
    if design.is_file():
        lines = design.read_text(errors="ignore").splitlines()
        for i, line in enumerate(lines):
            if re.match(r"#+\s*Direction", line):
                direction = next((l.strip("-* ").strip() for l in lines[i + 1:i + 8]
                                  if l.strip() and not l.startswith("#")), None)
                break
    seen, unique = set(), []
    for name in fonts:
        if name.lower() not in seen:
            seen.add(name.lower()); unique.append(name)
    return unique or ["system stack"], radius, accent, direction


def git(project, *args):
    try:
        return subprocess.run(["git", "-C", str(project), *args], capture_output=True,
                              text=True, timeout=10).stdout.strip()
    except (OSError, subprocess.TimeoutExpired):
        return ""


def main(argv):
    limit = 12
    if "--limit" in argv:
        i = argv.index("--limit"); limit = int(argv[i + 1]); del argv[i:i + 2]
    roots = [Path(p).expanduser() for p in argv] or [Path.home() / "Projects"]
    groups = {}
    for root in roots:
        for pkg in sorted(root.glob("*/package.json")):
            project = pkg.parent
            common = git(project, "rev-parse", "--path-format=absolute", "--git-common-dir")
            key = common or str(project)
            date = git(project, "log", "-1", "--format=%cs") or "-"
            if key not in groups or len(project.name) < len(groups[key][0].name):
                groups[key] = (project, date)
    if not groups:
        print("NOT CHECKED: no projects with package.json under", ", ".join(map(str, roots)))
        return 2
    rows = sorted(groups.values(), key=lambda r: r[1], reverse=True)[:limit]
    font_n, radius_n, accent_n, lines = Counter(), Counter(), Counter(), Counter()
    for project, _ in rows:
        try:
            lines[json.loads((project / "package.json").read_text()).get("name") or project.name] += 1
        except (OSError, ValueError):
            lines[project.name] += 1
    for project, date in rows:
        fonts, radius, accent, direction = scan(project)
        font_n.update(fonts); radius_n[radius or "-"] += 1; accent_n[accent or "-"] += 1
        print(f"{date}  {project.name}: fonts={', '.join(fonts)}; radius={radius or '-'}; "
              f"accent={accent or '-'}" + (f"; direction={direction[:70]}" if direction else ""))
    print(f"\nrecent {len(rows)} project(s); recurring choices to avoid repeating:")
    for label, counter in (("font", font_n), ("radius", radius_n), ("accent", accent_n)):
        common = [f"{k} ×{v}" for k, v in counter.most_common(5) if v > 1 and k != "-"]
        print(f"  {label}: {', '.join(common) if common else 'no repeats'}")
    for name, n in lines.items():
        if n > 1:
            print(f"  shared template: {n} projects are package '{name}': keep the engine, "
                  "differentiate each brand's theme layer (type, color, imagery, hero, signature)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

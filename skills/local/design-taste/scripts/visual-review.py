#!/usr/bin/env python3
"""Run the independent visual review (references/visual-review.md).

Usage: visual-review.py PROJECT --reviewer claude|codex [--design FILE]

Takes the screenshots cited under the design file's `## Render critique` and
the references cited in the design evidence, slices each into
viewport-height images so the reviewer sees them at legible size, sends the
canonical prompt through a fresh `ai-ask` invocation (read-only), and
writes design/review.md with hashes design-gate.py verifies. The builder never
writes the prompt or the verdict.
Stops after MAX_ROUNDS reviews (design/review-rounds.log): one run looped
19 rounds over three hours; past the cap the owner gets the findings instead.
Exit 0 = PASS, 1 = REVISE, 2 = usage, setup, or round cap, 3 = reviewer failed.
"""
import importlib.util, re, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("gate", HERE / "design-gate.py")
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)
IMAGE_RUNTIMES = {"claude", "codex"}
MAX_ROUNDS = 5


def slices(img, out):
    """Viewport-height slices: a 1440x11000 page shrinks to ~55px wide if sent whole."""
    try:
        from PIL import Image
        im = Image.open(img)
    except Exception:  # lazy: without Pillow (or on an unreadable file) the full image goes
        return [img]
    w, h = im.size
    step = max(844, int(w * 1.1))
    paths = []
    for i, top in enumerate(range(0, h, step)):
        p = out / f"{gate.sha(str(img.resolve()))}-{img.stem}-{i + 1:02d}.png"
        im.crop((0, top, w, min(top + step, h))).save(p)
        paths.append(p)
    return paths


def main(argv):
    if not argv or argv[0].startswith("-") or "--reviewer" not in argv:
        print(__doc__); return 2
    root = Path(argv[0]).resolve()
    opts = dict(zip(argv[1::2], argv[2::2]))
    runtime = opts["--reviewer"]
    if runtime not in IMAGE_RUNTIMES:
        print(f"reviewer {runtime} has no image-reading tools in ai-ask's current headless mode; "
              "use claude or codex with image-reading capability"); return 2
    design = root / opts.get("--design", "DESIGN.md")
    doc = design.read_text(errors="ignore") if design.is_file() else ""
    author = re.search(r"^\W*Author:\s*(.+)$", doc, re.M | re.I)
    if not author:
        print("design file needs 'Author: <runtime/model>' under ## Render critique"); return 2
    shots = gate.critique_shots(root, doc) or []
    if len(shots) < 2:
        print("cite the narrow and wide screenshots under ## Render critique first"); return 2
    refs, errors = gate.reference_shots(root, doc)
    try:
        widths = [gate.image_size(p)[0] for p in shots]
    except (OSError, ValueError, ImportError) as error:
        print(f"unreadable render: {error}"); return 2
    if not refs or errors or min(widths) >= 600 or max(widths) < 900:
        print("need valid reference images and narrow/wide renders: " + "; ".join(errors)); return 2
    log = root / "design" / "review-rounds.log"
    rounds = log.read_text().splitlines() if log.is_file() else []
    if len(rounds) >= MAX_ROUNDS:
        print(f"{len(rounds)} review rounds used (cap {MAX_ROUNDS}): stop and give the owner the open "
              "findings in design/review.md; the owner decides whether to clear the log for more rounds")
        return 2

    image_hash = gate.images_sha(shots + refs)
    out = root / "design" / "review-slices"
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.png"):
        old.unlink()
    images = [p for img in shots + refs for p in slices(img, out)]
    rel = lambda p: str(p.relative_to(root))
    direction = doc
    prompt = (gate.review_prompt()
              .replace("Images: <paths>", "Images:\n" + "\n".join(rel(p) for p in images))
              .replace("Direction: <direction and audience lines>", "Direction:\n" + direction.strip()))
    r = subprocess.run(["ai-ask", runtime, "--cwd", str(root), "--timeout", "900", "--", prompt],
                       capture_output=True, text=True)
    body = r.stdout.strip()
    verdicts = re.findall(r"^\W*Verdict:\W*(PASS|REVISE|UNVERIFIED)\b", body, re.M | re.I)
    if r.returncode or not verdicts:
        print(f"reviewer failed (exit {r.returncode}); no verdict.\n{r.stderr[-800:]}"); return 3
    if not all(p.is_file() for p in shots + refs) or gate.images_sha(shots + refs) != image_hash:
        print("images changed while review was running; re-render and re-review"); return 3
    header = (f"Reviewer: {runtime} via visual-review.py\n"
              "Review-Context: separate ai-ask invocation\n"
              "Model: unavailable: ai-ask does not report the resolved model/provider\n"
              f"Screenshots: {', '.join(rel(p) for p in shots)}\n"
              f"References: {', '.join(rel(p) for p in refs)}\n"
              f"Prompt-SHA: {gate.sha(gate.review_prompt())}\n"
              f"Context-SHA: {gate.sha(doc)}\n"
              f"Images-SHA: {image_hash}\n"
              f"Output-SHA: {gate.sha(body)}")
    (root / "design" / "review.md").write_text(f"{header}\n\n{body}")
    verdict = verdicts[-1].upper()
    with log.open("a") as f:
        f.write(f"{len(rounds) + 1} {runtime} {verdict} {gate.images_sha(shots)}\n")
    print(f"Verdict: {verdict} (design/review.md)")
    return 0 if verdict == "PASS" else 3 if verdict == "UNVERIFIED" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

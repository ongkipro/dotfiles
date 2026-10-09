#!/usr/bin/env python3
"""Artifact behavior checks; the reviewer is stubbed, not a visual-quality eval."""
import importlib.util, json, os, subprocess, sys, tempfile, time
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
S, V = str(HERE / 'design-gate.py'), str(HERE / 'visual-review.py')
def run(root):
    return subprocess.run([sys.executable, S, str(root)], capture_output=True, text=True)
def image(path, width, color='navy'):
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.new('RGB', (width, 24), color).save(path)

with tempfile.TemporaryDirectory() as d:
    root = Path(d)
    source = root / 'src/index.html'
    source.parent.mkdir()
    source.write_text('''<section><h1>Useful <span class="text-blue-500">highlight</span></h1>
<p class="font-mono">Code-oriented brand</p>
<a class="bg-blue-600 border-blue-600 ring-blue-500 text-indigo-600 from-violet-600 to-blue-700">Action</a>
<div class="text-3xl">[Placeholder: 450+]</div></section>''')
    design = root / 'DESIGN.md'
    design.write_text('# Design\ngate-allow: refs - unavailable\ngate-allow: review - unavailable\ngate-allow: stat - placeholder\n')
    r = run(root)
    assert r.returncode == 1, r.stdout
    for tag in ['refs', 'critique', 'review', 'stat']:
        assert f'FAIL    {tag}:' in r.stdout, r.stdout
    for tag in ['accent', 'headline']:
        assert f'WARN    {tag}:' in r.stdout, r.stdout

    # Legitimate familiar styling warns but does not reject accepted visual evidence.
    source.write_text(source.read_text().replace('[Placeholder: 450+]', 'Real product name'))
    ref = root / 'design/refs/a'
    ref.mkdir(parents=True)
    manifest = ref / 'ref.json'
    capture = {'capturedAt': '2026-10-09T00:00:00Z', 'viewports': {
        '1440': {'url': 'https://example.org/reference', 'width': 1440, 'height': 24}}}
    manifest.write_text(json.dumps(capture))
    image(ref / '1440.png', 1440)
    image(root / 'shots/390.png', 390)
    image(root / 'shots/1440.png', 1440)
    doc = '''# Design
## Reference evidence
| Source | Role | Observed / transfer | Capture |
| https://example.org/reference | directional | clear hierarchy for this reading task | `design/refs/a` |
## Direction
Audience: technical readers. Keep the observed hierarchy and code-oriented brand.
## Render critique
Author: claude/runtime-model-unavailable
- shots/390.png: clear reading hierarchy.
- shots/1440.png: same reading order with wider measure.
'''
    design.write_text(doc)
    stub = root / 'bin'
    stub.mkdir()
    (stub / 'ai-ask').write_text('''#!/usr/bin/env python3
import os, sys
from pathlib import Path
Path(os.environ['PROMPT_FILE']).write_text(sys.argv[-1])
if os.environ.get('MUTATE_IMAGE'):
    Path(os.environ['MUTATE_IMAGE']).write_bytes(b'changed during review')
print('Hero | authored | readable hierarchy | keep')
print(Path(os.environ['VERDICT_FILE']).read_text())
''')
    (stub / 'ai-ask').chmod(0o755)
    env = dict(os.environ, PATH=f"{stub}:{os.environ['PATH']}",
               VERDICT_FILE=str(root / 'v'), PROMPT_FILE=str(root / 'prompt'))
    log = root / 'design/review-rounds.log'
    def review(verdict='PASS', runtime='claude'):
        (root / 'v').write_text(verdict if '\n' in verdict else f'Verdict: {verdict}')
        return subprocess.run([sys.executable, V, d, '--reviewer', runtime],
                              capture_output=True, text=True, env=env)
    def reset_rounds():
        # Test fixtures only; never clears a real project's review budget.
        log.write_text('')

    assert review(runtime='agy').returncode == 2
    r = review('REVISE')
    assert r.returncode == 1 and 'verdict REVISE' in run(root).stdout, r.stdout
    r = review()
    assert r.returncode == 0, r.stdout + r.stderr
    r = run(root)
    assert r.returncode == 0 and 'WARN    accent:' in r.stdout, r.stdout
    assert '1 decoded reference image(s)' in r.stdout, r.stdout
    assert 'clear hierarchy for this reading task' in (root / 'prompt').read_text()
    rv = root / 'design/review.md'
    good = rv.read_text()
    assert 'Model: unavailable:' in good and 'anthropic' not in good

    # Corrupt/missing reference evidence cannot hide behind another valid reference.
    for invalid in ['{}', '[]', 'not json']:
        manifest.write_text(invalid)
        assert 'FAIL    refs:' in run(root).stdout
    manifest.write_text(json.dumps(capture))
    design.write_text(doc.replace('`design/refs/a`', '`design/refs/a` `design/refs/missing`'))
    assert 'FAIL    refs:' in run(root).stdout
    design.write_text(doc)
    ref_image = ref / '1440.png'
    ref_bytes = ref_image.read_bytes()
    ref_image.write_bytes(b'png')
    assert 'FAIL    refs:' in run(root).stdout
    assert review().returncode == 2
    ref_image.write_bytes(ref_bytes)
    broken = dict(capture, viewports={'390': {'url': 'https://example.org', 'width': 390}})
    manifest.write_text(json.dumps(broken))
    assert 'FAIL    refs:' in run(root).stdout
    manifest.write_text(json.dumps(capture))

    # Both responsive renders must decode and be fresh, even if one is current.
    shot = root / 'shots/390.png'
    original = shot.read_bytes()
    shot.write_bytes(b'png')
    assert 'FAIL    critique:' in run(root).stdout
    assert review().returncode == 2
    shot.write_bytes(original)
    past = source.stat().st_mtime - 60
    os.utime(shot, (past, past))
    assert 'a screenshot is older than the source' in run(root).stdout
    shot.write_bytes(original)
    design.write_text(doc + '- shots/missing.png: pending\n')
    assert 'FAIL    critique:' in run(root).stdout
    assert review().returncode == 2
    design.write_text(doc.replace('shots/390.png', 'shots/1440.png'))
    assert 'FAIL    critique:' in run(root).stdout
    design.write_text(doc)

    # A supplied image is sufficient when its provenance and transferred principle are recorded.
    supplied_doc = doc.replace('`design/refs/a`', '`design/refs/a/1440.png`').replace(
        'https://example.org/reference', 'Owner-supplied reference image')
    design.write_text(supplied_doc)
    reset_rounds()
    assert review().returncode == 0
    assert run(root).returncode == 0
    design.write_text(doc)
    reset_rounds()
    assert review().returncode == 0
    good = rv.read_text()

    # Review binds output, accepted context, references, and page renders.
    rv.write_text(good.replace('Verdict: PASS', 'Verdict: PASS\nExtra text'))
    assert 'not written by scripts/visual-review.py' in run(root).stdout
    rv.write_text(good)
    image(ref_image, 1440, 'red')
    assert 'images changed after the review' in run(root).stdout
    ref_image.write_bytes(ref_bytes)
    image(shot, 390, 'red')
    assert 'images changed after the review' in run(root).stdout
    shot.write_bytes(original)
    design.write_text(doc + '\nNew constraint: preserve different hierarchy.\n')
    assert 'design context changed' in run(root).stdout
    design.write_text(doc)
    assert run(root).returncode == 0
    rv.write_text('Reviewer: claude\nScreenshots: shots/390.png, shots/1440.png\n\nVerdict: PASS\n')
    assert 'not written by scripts/visual-review.py' in run(root).stdout

    # Final UNVERIFIED cannot be laundered by an earlier PASS in the output.
    r = review('Verdict: PASS\nInspection failed.\nVerdict: UNVERIFIED')
    assert r.returncode == 3 and 'verdict UNVERIFIED' in run(root).stdout, r.stdout
    for _ in range(3):
        review('REVISE')
    r = review()
    assert r.returncode == 2 and 'cap 5' in r.stdout, r.stdout
    assert len(log.read_text().splitlines()) == 5

    reset_rounds()
    env['MUTATE_IMAGE'] = str(shot)
    r = review()
    assert r.returncode == 3 and 'images changed while review was running' in r.stdout, r.stdout
    del env['MUTATE_IMAGE']
    shot.write_bytes(original)

    design.unlink()
    assert run(root).returncode == 2

# Distinct source paths with identical immediate folder/file names must not overwrite slices.
spec = importlib.util.spec_from_file_location('visual_review', V)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
with tempfile.TemporaryDirectory() as d:
    root = Path(d)
    first, second = root / 'shots/390.png', root / 'design/refs/shots/390.png'
    image(first, 390, 'navy')
    image(second, 390, 'red')
    out = root / 'slices'
    out.mkdir()
    a, b = module.slices(first, out), module.slices(second, out)
    assert set(a).isdisjoint(b), 'different input images overwrote the same slice'
    assert a[0].read_bytes() != b[0].read_bytes()
print('PASS: reference, independent-context, freshness, tamper, verdict, and slice-collision checks')

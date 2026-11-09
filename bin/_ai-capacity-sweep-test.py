#!/usr/bin/env python3
"""ai-capacity RAM sweep (2-129 GB, 8 threads): budget-consistent rows, thread cap, no terminal drop within a slot count."""
import json, os, subprocess
from pathlib import Path

tool = str(Path(__file__).with_name('ai-capacity'))
prev = None
for tenth in range(20, 1290, 3):
    ram = tenth / 10
    env = dict(os.environ, AI_CAPACITY_RAM_GB=str(ram), AI_CAPACITY_THREADS='8', AI_CAPACITY_NO_MEASURE='1', AI_CAPACITY_HOME='/nonexistent')
    d = json.loads(subprocess.run([tool, '--json'], env=env, capture_output=True, text=True, check=True).stdout)
    t, s, slots = d['terminals']['max'], d['subagents']['total_target'], d['heavy']['slots']
    assert s <= 8, (ram, s)
    for r in d['by_terminals']:
        assert r['terminals'] * d['costs']['terminal_gb'] + r['subagents_total'] * d['costs']['subagent_gb'] <= d['interactive_budget_gb'] + 1e-9, (ram, r)
    if d['degraded']:
        assert d['by_terminals'] == [] and s == 0, ram
    if prev and prev[1] == slots and not d['degraded'] and not prev[2]:
        assert t >= prev[0], (ram, prev, t)
    prev = (t, slots, d['degraded'])
print('ai-capacity sweep: ok')

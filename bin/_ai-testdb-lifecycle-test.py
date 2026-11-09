#!/usr/bin/env python3
"""ai-testdb run lifecycle without Docker: cancellation before start, during Popen, and during cleanup."""
import importlib.machinery, importlib.util, os, signal, subprocess, sys
from pathlib import Path

loader = importlib.machinery.SourceFileLoader('ai_testdb', str(Path(__file__).with_name('ai-testdb')))
spec = importlib.util.spec_from_loader('ai_testdb', loader); m = importlib.util.module_from_spec(spec); loader.exec_module(m)
events = []
m.create = lambda pg, name, template: (events.append('create'), 'postgresql://x/' + name)[1]
m.drop = lambda pg, name: events.append('drop')

# 1) Signal right after the clone exists, before the command starts: command never starts, clone dropped.
events.clear(); real_create = m.create
def create_then_term(pg, name, template):
    url = real_create(pg, name, template); os.kill(os.getpid(), signal.SIGTERM); return url
m.create = create_then_term
code = m.run_with_clone('17', 't_a_1', None, ['DATABASE_URL'], ['sh', '-c', 'touch /tmp/ai-testdb-should-not-run'], False)
assert code == 128 + signal.SIGTERM and events == ['create', 'drop'] and not os.path.exists('/tmp/ai-testdb-should-not-run'), (code, events)
m.create = real_create

# 2) Signal while Popen is starting (before the child object exists): delivered right after, command stops.
events.clear(); RealPopen = subprocess.Popen
class SignalDuringPopen(RealPopen):
    def __init__(self, *a, **k):
        os.kill(os.getpid(), signal.SIGHUP); super().__init__(*a, **k)
m.subprocess.Popen = SignalDuringPopen
code = m.run_with_clone('17', 't_b_1', None, ['DATABASE_URL'], ['sleep', '30'], False)
assert code == 128 + signal.SIGHUP and events == ['create', 'drop'], (code, events)
m.subprocess.Popen = RealPopen

# 3) Signal during cleanup: the drop still completes and handlers are restored afterwards.
events.clear(); state = {}
def drop_with_signal(pg, name):
    os.kill(os.getpid(), signal.SIGTERM); state['handler'] = signal.getsignal(signal.SIGTERM); events.append('drop')
m.drop = drop_with_signal
code = m.run_with_clone('17', 't_c_1', None, ['DATABASE_URL'], ['true'], False)
assert events == ['create', 'drop'] and state['handler'] not in (signal.SIG_DFL, None) and signal.getsignal(signal.SIGTERM) == signal.SIG_DFL, (events, state)
print('ai-testdb lifecycle: ok')

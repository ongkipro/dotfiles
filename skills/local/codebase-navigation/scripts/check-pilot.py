#!/usr/bin/env python3
"""Run a real, isolated Graphify pilot; no user repository or model calls."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


# No LLM backend, no rewrite of previously installed graphify skills, no cloud prompt.
ENV = {**os.environ, "GRAPHIFY_BACKEND": "none", "GRAPHIFY_NO_AUTO_REFRESH": "1", "GRAPHIFY_NO_CTA": "1"}


def run(*args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=300, env=ENV)
    if result.returncode:
        raise RuntimeError(f"{args[0]} exited {result.returncode}: {result.stderr}")
    return result.stdout


def snapshot(root):
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in root.rglob("*") if p.is_file()}


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def main():
    for command in ("pipx", "rg"):
        require(shutil.which(command), f"Missing {command}; no system install attempted")
    with tempfile.TemporaryDirectory(prefix="graphify-pilot-") as directory:
        root = Path(directory)
        source = root / "source"
        source.mkdir()
        fixtures = {
            "api.py": "from service import place_order\n\ndef submit():\n    return place_order()\n",
            "service.py": "from storage import persist as save\n\ndef place_order():\n    return save()\n",
            "storage.py": 'def persist():\n    return "saved"\n',
            "noise.py": '# persist appears in a comment, not a call.\ndef unrelated():\n    return "persist"\n',
            "notes.md": "Semantic extraction is not authorized for this fixture.\n",
            "compose.yml": "services:\n  web:\n    image: example\n",
            "dup_a.py": "def dup():\n    return 1\n",
            "dup_b.py": "def dup():\n    return 2\n",
            "vendor/lib.py": "def vendored():\n    return 0\n",
            ".env": "TOKEN=synthetic-not-a-secret\n",
        }
        for name, content in fixtures.items():
            (source / name).parent.mkdir(parents=True, exist_ok=True)
            (source / name).write_text(content)
        before = snapshot(source)
        cli = ("pipx", "run", "--spec", "graphifyy==0.9.111", "graphify")
        run(*cli, "extract", str(source), "--code-only", "--no-cluster",
            "--exclude", "vendor/", "--out", str(root / "output"))
        graph_path = root / "output" / "graphify-out" / "graph.json"
        graph = json.loads(graph_path.read_text())
        nodes = {node["id"]: node for node in graph["nodes"]}
        calls = {(nodes[e["source"]]["label"], nodes[e["target"]]["label"])
                 for e in graph["edges"] if e.get("relation") == "calls"}
        require(("submit()", "place_order()") in calls, "Missing first call")
        require(("place_order()", "persist()") in calls, "Alias call unresolved")
        require(all("unrelated()" not in pair for pair in calls), "Text noise became a call")
        require(all(n.get("source_file") != "notes.md" for n in nodes.values()),
                "Markdown unexpectedly extracted")
        require(any(n.get("source_file") == "compose.yml" for n in nodes.values()),
                "YAML no longer extracted under --code-only; update SKILL.md")
        files = {n.get("source_file") for n in nodes.values()}
        require(not any(f and f.startswith("vendor") for f in files), "--exclude did not skip vendor/")
        require(".env" not in files, ".env was extracted; sensitive-file filter changed")
        require(graph.get("input_tokens") == graph.get("output_tokens") == 0,
                "Unexpected LLM token use")
        path = run(*cli, "path", "submit()", "persist()", "--graph", str(graph_path))
        require(all(symbol in path for symbol in ("submit", "place_order", "persist")),
                "Directed CLI path did not report the call chain")
        affected = run(*cli, "affected", "persist()", "--depth", "2", "--graph", str(graph_path))
        require("place_order" in affected, "affected did not report the caller of persist()")
        for symbol, code in (("zzz_missing()", 4), ("dup()", 3)):
            result = subprocess.run([*cli, "explain", symbol, "--graph", str(graph_path)],
                                    capture_output=True, text=True, timeout=300, env=ENV)
            require(result.returncode == code,
                    f"explain {symbol} exited {result.returncode}, expected {code}; update SKILL.md")
        hits = run("rg", "-n", "persist", str(source))
        require("noise.py" in hits and "service.py" in hits and "storage.py" in hits,
                "Unexpected text-search comparison")
        require(snapshot(source) == before, "Extractor changed source files")
        print(f"PASS: {len(nodes)} nodes, {len(graph['edges'])} edges; alias chain and directed path")
        print("PASS: affected reports callers; --exclude and .env filter hold")
        print("PASS: Markdown skipped, YAML extracted as code, missing exits 4, ambiguous exits 3, 0 LLM tokens, sources unchanged")
        print("Comparison: rg includes comment/string hits; graph resolves this static alias chain.")
        print("Scope: synthetic Python only; no speed, token-saving, or application coverage claim.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Run a real, isolated Graphify pilot; no user repository or model calls."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile


def run(*args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=300)
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
        }
        for name, content in fixtures.items():
            (source / name).write_text(content)
        before = snapshot(source)
        cli = ("pipx", "run", "--spec", "graphifyy==0.9.82", "graphify")
        run(*cli, "extract", str(source), "--code-only", "--no-cluster",
            "--out", str(root / "output"))
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
        require(graph.get("input_tokens") == graph.get("output_tokens") == 0,
                "Unexpected LLM token use")
        path = run(*cli, "path", "submit()", "persist()", "--graph", str(graph_path))
        require(all(symbol in path for symbol in ("submit", "place_order", "persist")),
                "Directed CLI path did not report the call chain")
        hits = run("rg", "-n", "persist", str(source))
        require("noise.py" in hits and "service.py" in hits and "storage.py" in hits,
                "Unexpected text-search comparison")
        require(snapshot(source) == before, "Extractor changed source files")
        print(f"PASS: {len(nodes)} nodes, {len(graph['edges'])} edges; alias chain and directed path")
        print("PASS: Markdown skipped, 0 LLM tokens, source inventory and contents unchanged")
        print("Comparison: rg includes comment/string hits; graph resolves this static alias chain.")
        print("Scope: synthetic Python only; no speed, token-saving, or application coverage claim.")


if __name__ == "__main__":
    main()

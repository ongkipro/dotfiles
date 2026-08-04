#!/usr/bin/env python3
"""Audit the offline source/provenance ledger without network credentials."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path
from typing import Any, Dict, List

DEFAULT_LEDGER = Path(__file__).resolve().parents[1] / "assets" / "sources.json"
KINDS = {"normative-authority", "workflow-inspiration"}
SOURCE_STATES = {"proposed", "adopted", "enacted", "in-force", "superseded", "unknown"}
REQUIRED = {
    "id", "kind", "authority", "url", "exact_path", "revision", "license",
    "source_status", "effective_date", "retrieved_date", "owner", "next_review", "local_use",
}


def parse_date(value: str):
    match = re.match(r"^(\d{4}-\d{2}-\d{2})(?:\b|\s)", value)
    if not match:
        return None
    try:
        return dt.date.fromisoformat(match.group(1))
    except ValueError:
        return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ledger", nargs="?", type=Path, default=DEFAULT_LEDGER)
    parser.add_argument("--as-of", type=dt.date.fromisoformat, default=dt.date.today())
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args()
    path = args.ledger.expanduser().resolve()
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        parser.error(f"cannot read UTF-8 JSON ledger {path}: {exc}")
    records = payload.get("records", []) if isinstance(payload, dict) else []
    if not isinstance(records, list):
        parser.error("ledger records must be an array")

    findings: List[Dict[str, Any]] = []
    identifiers: set[str] = set()
    for index, raw in enumerate(records):
        if not isinstance(raw, dict):
            findings.append({"code": "SRC001", "record": index, "message": "record must be an object"})
            continue
        identifier = str(raw.get("id", f"record-{index}"))
        if identifier in identifiers:
            findings.append({"code": "SRC002", "record": identifier, "message": "duplicate source id"})
        identifiers.add(identifier)
        missing = sorted(key for key in REQUIRED if not str(raw.get(key, "")).strip())
        if missing:
            findings.append({"code": "SRC003", "record": identifier, "message": "missing fields: " + ", ".join(missing)})
        if raw.get("kind") not in KINDS:
            findings.append({"code": "SRC004", "record": identifier, "message": f"invalid kind: {raw.get('kind')}"})
        if raw.get("source_status") not in SOURCE_STATES:
            findings.append({"code": "SRC005", "record": identifier, "message": f"invalid source_status: {raw.get('source_status')}"})
        if raw.get("source_status") == "superseded":
            findings.append({"code": "SRC006", "record": identifier, "message": "source is superseded; review dependent local requirements"})
        review_date = parse_date(str(raw.get("next_review", "")))
        if review_date is None:
            findings.append({"code": "SRC007", "record": identifier, "message": "next_review must begin with YYYY-MM-DD"})
        elif review_date < args.as_of:
            findings.append({"code": "SRC008", "record": identifier, "message": f"source review is stale since {review_date.isoformat()}"})
        url = str(raw.get("url", ""))
        if url and not url.startswith(("https://", "local://")):
            findings.append({"code": "SRC009", "record": identifier, "message": "URL must use https:// or local://"})

    result = {"version": 1, "ok": not findings, "as_of": args.as_of.isoformat(), "records": len(records), "findings": findings}
    if args.format == "json":
        print(json.dumps(result, indent=2, sort_keys=True))
    elif findings:
        for finding in findings:
            print(f"FAIL {finding['code']} {finding['record']} {finding['message']}")
        print(f"FAIL records={len(records)} findings={len(findings)} as_of={args.as_of.isoformat()}")
    else:
        print(f"PASS records={len(records)} findings=0 as_of={args.as_of.isoformat()}")
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())

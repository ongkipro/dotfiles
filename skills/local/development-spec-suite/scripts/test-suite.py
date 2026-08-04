#!/usr/bin/env python3
"""Portable integration tests for the Development Specification Suite."""

from __future__ import annotations

import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
INIT = ROOT / "scripts" / "init-doc-suite.py"
CHECK = ROOT / "scripts" / "check-traceability.py"
AUDIT = ROOT / "scripts" / "audit-sources.py"
PYTHON = sys.executable


def run(*args: object, expected: int = 0) -> subprocess.CompletedProcess[str]:
    result = subprocess.run([str(arg) for arg in args], text=True, capture_output=True, check=False)
    if result.returncode != expected:
        raise AssertionError(
            f"expected exit {expected}, got {result.returncode}\ncommand: {' '.join(map(str, args))}\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}"
        )
    return result


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def files(path: Path) -> set[str]:
    return {item.name for item in path.iterdir() if item.is_file()}


class SuiteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_json(self, name: str, value: object) -> Path:
        path = self.root / name
        path.write_text(json.dumps(value), encoding="utf-8")
        return path

    def init(self, profile: str, destination: Path, *extra: object, expected: int = 0) -> subprocess.CompletedProcess[str]:
        return run(PYTHON, INIT, "--profile", profile, "--output", destination, *extra, expected=expected)

    def check(self, destination: Path, expected: int = 0, json_output: bool = False) -> subprocess.CompletedProcess[str]:
        args: list[object] = [PYTHON, CHECK, destination]
        if json_output:
            args += ["--format", "json"]
        return run(*args, expected=expected)

    def test_context_record_is_created_once_and_preserved(self) -> None:
        destination = self.root / "pack"
        self.init("product", destination)
        self.assertEqual(files(destination), {"02-PRD.md", "CONTEXT-RECORD.md"})
        before = digest(destination / "CONTEXT-RECORD.md")
        result = self.init("product", destination)
        self.assertIn("SKIP existing", result.stdout)
        self.assertEqual(before, digest(destination / "CONTEXT-RECORD.md"))
        self.check(destination)

    def test_minimal_profiles_and_fact_driven_selection(self) -> None:
        expected = {
            "static-library": {"02-PRD.md", "CONTEXT-RECORD.md"},
            "local-cli": {"02-PRD.md", "03-TECHNICAL-DESIGN.md", "CONTEXT-RECORD.md"},
            "simple-web": {"02-PRD.md", "10-DESIGN-SYSTEM-WHITELABEL.md", "CONTEXT-RECORD.md"},
            "crud": {"02-PRD.md", "05-DATA-MODEL.md", "07-IAM-RBAC-ABAC.md", "12-SECURITY-ARCHITECTURE.md", "CONTEXT-RECORD.md"},
            "platform": {"02-PRD.md", "03-TECHNICAL-DESIGN.md", "04-SYSTEM-ARCHITECTURE.md", "06-TENANT-ISOLATION.md", "07-IAM-RBAC-ABAC.md", "12-SECURITY-ARCHITECTURE.md", "16-OBSERVABILITY-RATE-LIMITING.md", "CONTEXT-RECORD.md"},
        }
        contexts = {
            "static-library": {},
            "local-cli": {"component-change": True},
            "simple-web": {"shared-ui": True},
            "crud": {"identity": True, "persistence": True},
            "platform": {"multi-tenant": True, "identity": True},
        }
        for name, capabilities in contexts.items():
            with self.subTest(name=name):
                context = self.write_json(f"{name}.json", {"owner": "Test owner", "capabilities": capabilities})
                destination = self.root / name
                profile = "platform" if name == "platform" else ("lean" if name in {"static-library", "local-cli"} else "product")
                self.init(profile, destination, "--context-file", context)
                self.assertEqual(files(destination), expected[name])

    def test_every_profile_and_capability_generates_a_valid_pack(self) -> None:
        for profile in ("lean", "product", "platform", "saas"):
            with self.subTest(profile=profile):
                destination = self.root / f"profile-{profile}"
                self.init(profile, destination)
                self.check(destination)
        capabilities = (
            "component-change", "persistence", "identity", "multi-tenant", "public-api",
            "custom-domain", "localized-ui", "commerce", "personal-data", "cross-border",
            "regulated-sector", "ai-system", "high-availability", "mobile-desktop",
            "extension-plugin", "data-analytics", "maintained-deployment",
            "production-service", "schema-migration",
        )
        for capability in capabilities:
            with self.subTest(capability=capability):
                context = self.write_json(f"capability-{capability}.json", {"owner": "Test owner", "capabilities": {capability: True}})
                destination = self.root / f"capability-{capability}"
                self.init("product", destination, "--context-file", context)
                self.check(destination)

    def test_generated_files_use_repository_safe_permissions(self) -> None:
        destination = self.root / "permissions"
        self.init("lean", destination)
        self.assertEqual((destination / "02-PRD.md").stat().st_mode & 0o777, 0o644)
        target = destination / "02-PRD.md"
        target.write_text("# Established\n", encoding="utf-8")
        target.chmod(0o640)
        self.init("lean", destination, "--update")
        self.init("lean", destination, "--update", "--force")
        self.assertEqual(target.stat().st_mode & 0o777, 0o640)

    def test_source_ledger_covers_every_starter_jurisdiction(self) -> None:
        spec = importlib.util.spec_from_file_location("init_doc_suite_sources", INIT)
        self.assertIsNotNone(spec)
        self.assertIsNotNone(spec.loader)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        ledger = json.loads((ROOT / "assets" / "sources.json").read_text(encoding="utf-8"))
        ids = {record["id"] for record in ledger["records"]}
        self.assertEqual(set(module.JURISDICTION_SOURCE_IDS.values()) - ids, set())
        self.assertEqual(set(module.JURISDICTIONS), set(module.JURISDICTION_TERRITORIES))

    def test_structured_records_without_explicit_triggers_generate_valid_facts(self) -> None:
        contexts = {
            "jurisdiction": {"jurisdictions": [{"code": "ID"}]},
            "sector": {"sectors": [{"code": "healthcare"}]},
            "transfer": {"transfers": [{"exporter": "ID", "importer": "EU"}]},
            "locale": {"locales": [{"locale": "id-ID", "test_evidence": "TEST-1"}]},
        }
        for name, payload in contexts.items():
            with self.subTest(name=name):
                context = self.write_json(f"implicit-trigger-{name}.json", payload)
                destination = self.root / f"implicit-trigger-{name}"
                self.init("product", destination, "--context-file", context)
                self.check(destination)

    def test_malformed_structured_ids_and_trigger_references_fail_early(self) -> None:
        cases = {
            "duplicate-context": ({"facts": [{"id": "CTX-1"}, {"id": "CTX-1"}]}, "duplicate structured record id: CTX-1"),
            "bad-jurisdiction-id": ({"jurisdictions": [{"id": "hello", "code": "ID"}]}, "invalid jurisdiction id: HELLO"),
            "bad-transfer-id": ({"transfers": [{"id": "oops", "exporter": "ID", "importer": "EU"}]}, "invalid transfer id: OOPS"),
            "bad-locale-id": ({"locales": [{"id": "oops", "locale": "id-ID", "test_evidence": "TEST-1"}]}, "invalid locale id: OOPS"),
            "missing-trigger": ({"facts": [{"id": "CTX-1"}], "capabilities": {"identity": {"status": "active", "trigger_facts": ["CTX-99"]}}}, "references unknown context fact: CTX-99"),
            "duplicate-jurisdiction": ({"jurisdictions": [{"id": "JUR-ID-1", "code": "ID"}, {"id": "JUR-ID-1", "code": "EU"}]}, "duplicate structured record id: JUR-ID-1"),
            "duplicate-locale": ({"locales": [{"id": "LOC-1", "locale": "id-ID"}, {"id": "LOC-1", "locale": "en-US"}]}, "duplicate structured record id: LOC-1"),
        }
        for name, (payload, message) in cases.items():
            with self.subTest(name=name):
                context = self.write_json(f"invalid-{name}.json", payload)
                result = self.init("product", self.root / f"invalid-{name}", "--context-file", context, expected=2)
                self.assertIn(message, result.stderr)

    def test_jurisdictions_sectors_transfers_and_source_states(self) -> None:
        context = self.write_json(
            "jurisdictions.json",
            {
                "owner": "Privacy owner",
                "facts": [
                    {"id": "CTX-1", "dimension": "Data subjects", "statement": "Users may be in selected markets", "status": "Observed", "confidence": "Medium", "evidence": "Approved market list", "owner": "Product owner", "recheck_trigger": "Market list changes"}
                ],
                "jurisdictions": [
                    {"code": "ID", "trigger_facts": ["CTX-1"], "source_status": "enacted", "decision": "Unknown"},
                    {"code": "EU", "trigger_facts": ["CTX-1"], "source_status": "in-force", "decision": "Unknown"},
                    {"code": "US", "trigger_facts": ["CTX-1"], "source_status": "unknown", "decision": "Unknown"},
                    {"code": "US-CA", "trigger_facts": ["CTX-1"], "source_status": "proposed", "decision": "Unknown"},
                    {"code": "UK", "trigger_facts": ["CTX-1"], "source_status": "adopted", "decision": "Unknown"},
                    {"code": "SG", "trigger_facts": ["CTX-1"], "source_status": "superseded", "decision": "Unknown"}
                ],
                "sectors": [{"code": "healthcare", "trigger_facts": ["CTX-1"], "decision": "Unknown"}],
                "transfers": [
                    {"id": "XFER-1", "trigger_facts": ["CTX-1"], "exporter": "ID", "exporter_role": "Exporter candidate", "importer": "EU", "importer_role": "Importer candidate", "data_subjects": "Users", "data_categories": "Account data", "purpose": "Service delivery", "storage_access": "EU storage; ID support access", "mechanism_status": "Unknown — qualified review required", "safeguards": "Encryption and access control candidates", "onward_transfers": "Unknown", "retention_deletion": "Unknown", "evidence": "DATA-1", "owner": "Privacy owner", "status": "Proposed"},
                    {"id": "XFER-2", "trigger_facts": ["CTX-1"], "exporter": "UK", "exporter_role": "Exporter candidate", "importer": "US", "importer_role": "Importer candidate", "data_subjects": "Users", "data_categories": "Support records", "purpose": "Support", "storage_access": "US processing", "mechanism_status": "Unknown — UK-specific review required", "safeguards": "Unknown", "onward_transfers": "Unknown", "retention_deletion": "Unknown", "evidence": "DATA-2", "owner": "Privacy owner", "status": "Proposed"}
                ]
            },
        )
        destination = self.root / "pack"
        self.init("lean", destination, "--context-file", context)
        generated = (destination / "CONTEXT-RECORD.md").read_text(encoding="utf-8")
        for token in ("JUR-ID-1", "JUR-EU-2", "JUR-US-3", "JUR-US-CA-4", "JUR-UK-5", "JUR-SG-6", "XFER-1", "XFER-2", "proposed", "enacted", "in-force", "superseded", "unknown"):
            self.assertIn(token, generated)
        self.assertNotIn("global compliance", generated.lower())
        # Templates are intentionally incomplete; the clean validator contract is tested separately.

    def test_unknown_jurisdiction_and_sector_are_actionable_errors(self) -> None:
        result = self.init("lean", self.root / "bad-jur", "--jurisdiction", "ZZ", expected=2)
        self.assertIn("unknown jurisdiction code 'ZZ'", result.stderr)
        result = self.init("lean", self.root / "bad-sector", "--sector", "space-mining", expected=2)
        self.assertIn("unknown sector code 'space-mining'", result.stderr)

    def test_full_artifact_pack_and_capability_combinations_validate(self) -> None:
        destination = self.root / "full-pack"
        all_artifacts = ",".join((
            "brd", "technical-design", "architecture", "data-model", "multi-tenant", "iam",
            "custom-domain", "public-api", "localized-ui", "commerce", "security", "privacy",
            "high-availability", "delivery", "observability",
        ))
        self.init("platform", destination, "--overlay", all_artifacts)
        self.assertEqual(len(files(destination)), 17)
        self.check(destination)

        combinations = (
            ("identity", "persistence"),
            ("public-api", "commerce"),
            ("localized-ui", "cross-border", "ai-system"),
            ("identity", "high-availability", "data-analytics"),
        )
        for index, combination in enumerate(combinations):
            with self.subTest(combination=combination):
                context = self.write_json(f"combination-{index}.json", {"owner": "Test owner", "capabilities": {name: True for name in combination}})
                pack = self.root / f"combination-{index}"
                self.init("product", pack, "--context-file", context)
                self.check(pack)

    def test_validator_clean_fixture_text_and_json(self) -> None:
        fixture = self.root / "clean"
        fixture.mkdir()
        (fixture / "SPEC.md").write_text(
            """# Clean fixture

### PR-1 — Export report
- Status: Accepted
- Owner: Product owner
- Statement: When requested, the system shall export a report.
- Evidence: EVID-1

### T-1 — Implement export
- Primary requirement: PR-1
- Constraints: none
- Done when: `python3 -m unittest` exits 0.
""",
            encoding="utf-8",
        )
        self.check(fixture)
        payload = json.loads(self.check(fixture, json_output=True).stdout)
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["version"], 2)
        self.assertEqual(payload["findings"], [])

    def test_validator_ignores_update_and_backup_sidecars(self) -> None:
        fixture = self.root / "sidecars"
        fixture.mkdir()
        (fixture / "SPEC.md").write_text("# Pack\n", encoding="utf-8")
        for directory in (fixture / ".spec-update", fixture / ".spec-backups" / "20260804"):
            directory.mkdir(parents=True)
            (directory / "BROKEN.md").write_text("### PR-404 — sidecar only\n", encoding="utf-8")
        payload = json.loads(self.check(fixture, json_output=True).stdout)
        self.assertEqual(payload["summary"]["files"], 1)

    def test_validator_failure_classes_are_stable(self) -> None:
        fixture = self.root / "negative"
        fixture.mkdir()
        (fixture / "SPEC.md").write_text(
            """# Negative fixture

### PR-1 — First
- Status: Verified
- Owner: Product owner
- Evidence: none

### PR-1 — Duplicate
- Status: Accepted
- Owner: Product owner

### PR-2 — Replacement
- Status: Accepted
- Owner: Product owner

### PR-3 — Old
- Status: Superseded
- Owner: Product owner
- Superseded by: PR-99

### T-1 — Ambiguous task
- Primary requirement: PR-1, PR-2
- Done when: finished

Reference PR-404 and PR-3.
[TBD]
[broken](missing.md)
""",
            encoding="utf-8",
        )
        payload = json.loads(self.check(fixture, expected=1, json_output=True).stdout)
        codes = {item["code"] for item in payload["findings"]}
        self.assertTrue({"ID001", "EVID001", "REF001", "SUP002", "SUP003", "TASK001", "OWN003", "LINK001"} <= codes)

    def test_active_overlay_requires_trigger_fact_and_artifact(self) -> None:
        fixture = self.root / "overlay"
        fixture.mkdir()
        (fixture / "CONTEXT-RECORD.md").write_text(
            """# Context

| ID | Dimension | Statement | Status | Confidence | Evidence | Owner | Recheck trigger |
|---|---|---|---|---|---|---|---|
| CTX-1 | Product | Unknown | Unknown | Low | None | Product owner | Before approval |

| ID | Capability/overlay | Status | Trigger facts | Selected artifacts | Owner | Reason | Review gate |
|---|---|---|---|---|---|---|---|
| OVR-1 | identity | Active | CTX-1 | iam | Security owner | Requested | Before approval |
""",
            encoding="utf-8",
        )
        payload = json.loads(self.check(fixture, expected=1, json_output=True).stdout)
        codes = {item["code"] for item in payload["findings"]}
        self.assertTrue({"OVR002", "OVR003", "OVR004"} <= codes)

    def test_source_audit_is_offline_and_flags_stale_records(self) -> None:
        clean = run(PYTHON, AUDIT, "--as-of", "2026-08-04", "--format", "json")
        self.assertTrue(json.loads(clean.stdout)["ok"])
        stale = run(PYTHON, AUDIT, "--as-of", "2027-01-01", "--format", "json", expected=1)
        codes = {item["code"] for item in json.loads(stale.stdout)["findings"]}
        self.assertIn("SRC008", codes)

    def test_update_manifest_rejects_path_escape(self) -> None:
        destination = self.root / "manifest-paths"
        self.init("lean", destination)
        target = destination / "02-PRD.md"
        target.write_text("# Established\n", encoding="utf-8")
        self.init("lean", destination, "--update")
        manifest = destination / ".spec-update" / "manifest.json"
        data = json.loads(manifest.read_text(encoding="utf-8"))
        record = data["files"].pop("02-PRD.md")
        data["files"]["../escaped.md"] = record
        manifest.write_text(json.dumps(data), encoding="utf-8")
        result = self.init("lean", destination, "--update", "--force", expected=2)
        self.assertIn("invalid update manifest path", result.stderr)
        self.assertFalse((self.root / "escaped.md").exists())

    def test_update_preview_hash_gate_backup_and_interruption(self) -> None:
        destination = self.root / "pack"
        self.init("lean", destination)
        target = destination / "02-PRD.md"
        target.write_text("# Local established PRD\n", encoding="utf-8")
        original_hash = digest(target)

        preview = self.init("lean", destination, "--update")
        self.assertIn("No established file was replaced", preview.stdout)
        self.assertEqual(original_hash, digest(target))
        manifest = destination / ".spec-update" / "manifest.json"
        self.assertTrue(manifest.is_file())
        self.assertTrue((destination / ".spec-update" / "diffs" / "02-PRD.md.diff").is_file())

        target.write_text("# Changed after review\n", encoding="utf-8")
        result = self.init("lean", destination, "--update", "--force", expected=1)
        self.assertIn("hash changed since review", result.stderr)
        target.write_text("# Local established PRD\n", encoding="utf-8")

        # Simulate replacement failure after the backup has been made durable.
        spec = importlib.util.spec_from_file_location("init_doc_suite", INIT)
        self.assertIsNotNone(spec)
        self.assertIsNotNone(spec.loader)
        init_doc_suite = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(init_doc_suite)
        real_atomic_write = init_doc_suite.atomic_write

        def interrupted(path: Path, contents: bytes) -> None:
            if path == target:
                raise RuntimeError("simulated interruption")
            real_atomic_write(path, contents)

        with mock.patch.object(init_doc_suite, "atomic_write", side_effect=interrupted):
            with self.assertRaises(RuntimeError):
                init_doc_suite.apply_reviewed_update(destination)
        backups = sorted((destination / ".spec-backups").glob("*/02-PRD.md"))
        self.assertTrue(backups)
        self.assertEqual(original_hash, digest(backups[-1]))
        self.assertRegex(backups[-1].parent.name, r"^\d{8}T\d{12}Z$")


if __name__ == "__main__":
    unittest.main(verbosity=2)

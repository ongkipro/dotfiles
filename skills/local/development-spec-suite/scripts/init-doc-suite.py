#!/usr/bin/env python3
"""Initialize or review-update a context-backed development specification pack.

The command is dependency-free, portable across Linux and macOS, and never
replaces an existing file unless a reviewed update manifest is supplied.
"""

from __future__ import annotations

import argparse
import datetime as dt
import difflib
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set, Tuple

SKILL_DIR = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = SKILL_DIR / "assets" / "templates"
UPDATE_DIRNAME = ".spec-update"

ARTIFACTS: Dict[str, Tuple[str, str]] = {
    "brd": ("01-BRD.md", "01-BRD.md"),
    "prd": ("02-PRD.md", "02-PRD.md"),
    "technical-design": ("03-TECHNICAL-DESIGN.md", "03-TECHNICAL-DESIGN.md"),
    "architecture": ("04-SYSTEM-ARCHITECTURE.md", "04-SYSTEM-ARCHITECTURE.md"),
    "data-model": ("05-DATA-MODEL.md", "05-DATA-MODEL.md"),
    "multi-tenant": ("06-TENANT-ISOLATION.md", "06-TENANT-ISOLATION.md"),
    "iam": ("07-IAM-RBAC-ABAC.md", "07-IAM-RBAC-ABAC.md"),
    "custom-domain": ("08-DOMAIN-ROUTING.md", "08-DOMAIN-ROUTING.md"),
    "public-api": ("09-API-SPECIFICATION.md", "09-API-SPECIFICATION.md"),
    "localized-ui": ("10-DESIGN-SYSTEM-WHITELABEL.md", "10-DESIGN-SYSTEM-WHITELABEL.md"),
    "commerce": ("11-BILLING-PAYMENTS.md", "11-BILLING-PAYMENTS.md"),
    "security": ("12-SECURITY-ARCHITECTURE.md", "12-SECURITY-ARCHITECTURE.md"),
    "privacy": ("13-COMPLIANCE-PRIVACY.md", "13-COMPLIANCE-PRIVACY.md"),
    "high-availability": ("14-SLA-DRP.md", "14-SLA-DRP.md"),
    "delivery": ("15-DEVOPS-CICD-MIGRATIONS.md", "15-DEVOPS-CICD-MIGRATIONS.md"),
    "observability": ("16-OBSERVABILITY-RATE-LIMITING.md", "16-OBSERVABILITY-RATE-LIMITING.md"),
}

OVERLAYS = {
    "multi-tenant",
    "identity",
    "public-api",
    "custom-domain",
    "localized-ui",
    "commerce",
    "personal-data",
    "cross-border",
    "regulated-sector",
    "ai-system",
    "high-availability",
    "mobile-desktop",
    "extension-plugin",
    "data-analytics",
}

# Context capabilities are deliberately smaller facts than product labels.
CAPABILITY_ARTIFACTS: Dict[str, Set[str]] = {
    "business-commitments": {"brd"},
    "component-change": {"technical-design"},
    "external-integration": {"technical-design", "architecture"},
    "multiple-components": {"technical-design", "architecture"},
    "persistence": {"data-model"},
    "multi-tenant": {"multi-tenant", "security", "observability"},
    "identity": {"iam", "security"},
    "public-api": {"public-api", "architecture", "security", "observability"},
    "custom-domain": {"custom-domain", "security"},
    "localized-ui": {"localized-ui"},
    "shared-ui": {"localized-ui"},
    "commerce": {"commerce", "security", "privacy"},
    "personal-data": {"privacy", "security"},
    "cross-border": {"privacy", "security"},
    "regulated-sector": {"brd", "privacy", "security"},
    "ai-system": {"technical-design", "security", "privacy"},
    "high-availability": {"architecture", "high-availability", "delivery", "observability"},
    "mobile-desktop": {"technical-design", "localized-ui"},
    "extension-plugin": {"technical-design", "security"},
    "data-analytics": {"data-model", "privacy", "observability"},
    "maintained-deployment": {"delivery"},
    "production-service": {"observability"},
    "schema-migration": {"data-model", "delivery"},
}

OVERLAY_CAPABILITY = {name: name for name in OVERLAYS}
DIRECT_ARTIFACT_OVERRIDES = set(ARTIFACTS)

JURISDICTION_TERRITORIES = {
    "ID": "Indonesia",
    "EU": "European Union / EEA candidate scope",
    "US": "United States federal candidate scope",
    "US-CA": "California, United States",
    "UK": "United Kingdom",
    "SG": "Singapore",
    "CA": "Canada federal candidate scope",
    "BR": "Brazil",
    "AU": "Australia",
    "JP": "Japan",
}
JURISDICTION_SOURCE_IDS = {
    "ID": "SRC-ID-PDP",
    "EU": "SRC-EU-GDPR",
    "US": "SRC-US-FTC",
    "US-CA": "SRC-US-CA-CPPA",
    "UK": "SRC-UK-ICO-XFER",
    "SG": "SRC-SG-PDPC",
    "CA": "SRC-CA-PIPEDA",
    "BR": "SRC-BR-ANPD",
    "AU": "SRC-AU-OAIC",
    "JP": "SRC-JP-PPC",
}

SECTOR_ALIASES = {
    "general": "general",
    "finance": "financial-services",
    "financial-services": "financial-services",
    "health": "healthcare",
    "healthcare": "healthcare",
    "education": "education",
    "children": "children",
    "government": "government",
    "telecom": "telecommunications",
    "telecommunications": "telecommunications",
    "ecommerce": "ecommerce",
    "employment": "employment",
}
REGULATED_SECTORS = set(SECTOR_ALIASES.values()) - {"general", "ecommerce"}
FACT_DIMENSIONS = (
    "Product surface",
    "Operating entities",
    "Target markets",
    "Users and data subjects",
    "Storage, processing, backup, and support locations",
    "Processors and subprocessors",
    "Sector and age groups",
    "Commerce, payment, and tax roles",
    "AI provider or deployer role",
    "Locales and regional behavior",
    "Accessibility commitments",
    "Customer and contractual commitments",
)
SOURCE_STATES = {"proposed", "adopted", "enacted", "in-force", "superseded", "unknown"}
DECISIONS = {"Applies", "Does not apply", "Unknown"}

def load_jurisdiction_sources() -> Dict[str, Dict[str, str]]:
    ledger = SKILL_DIR / "assets" / "sources.json"
    try:
        payload = json.loads(ledger.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load jurisdiction source ledger {ledger}: {exc}") from exc
    records = {record.get("id"): record for record in payload.get("records", []) if isinstance(record, dict)}
    jurisdictions: Dict[str, Dict[str, str]] = {}
    for code, source_id in JURISDICTION_SOURCE_IDS.items():
        record = records.get(source_id)
        if not record:
            raise ValueError(f"source ledger is missing {source_id} for jurisdiction {code}")
        authority = str(record.get("authority", ""))
        url = str(record.get("url", ""))
        if not authority or not url:
            raise ValueError(f"source ledger record {source_id} is missing authority or URL")
        jurisdictions[code] = {"territory": JURISDICTION_TERRITORIES[code], "authority": authority, "url": url}
    return jurisdictions

JURISDICTIONS = load_jurisdiction_sources()


def csv_values(values: Iterable[str]) -> List[str]:
    result: List[str] = []
    for value in values:
        result.extend(item.strip() for item in value.split(",") if item.strip())
    return result


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())

def safe_child(root: Path, relative: str, label: str) -> Path:
    candidate = Path(relative)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise ValueError(f"{label} must be a relative path inside {root}: {relative}")
    resolved_root = root.resolve()
    resolved = (root / candidate).resolve()
    try:
        resolved.relative_to(resolved_root)
    except ValueError as exc:
        raise ValueError(f"{label} escapes {root}: {relative}") from exc
    return root / candidate


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    existing_mode = path.stat().st_mode & 0o777 if path.exists() else 0o644
    fd, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=str(path.parent))
    try:
        os.fchmod(fd, existing_mode)
        with os.fdopen(fd, "wb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    except BaseException:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass
        raise


def normalize_jurisdiction(value: str) -> str:
    code = value.strip().upper().replace("_", "-")
    aliases = {"GB": "UK", "GBR": "UK", "USA": "US", "USA-CA": "US-CA", "IDN": "ID", "SGP": "SG"}
    return aliases.get(code, code)


def load_context(path: Path) -> Dict[str, Any]:
    if not path.is_file():
        raise ValueError(f"context file does not exist: {path}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError(f"context file must be UTF-8 JSON: {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("context file root must be a JSON object")
    for key in ("facts", "jurisdictions", "sectors", "transfers", "locales"):
        if key in value and not isinstance(value[key], list):
            raise ValueError(f"context field '{key}' must be an array")
    if "capabilities" in value and not isinstance(value["capabilities"], dict):
        raise ValueError("context field 'capabilities' must be an object")
    return value


def normalize_fact(raw: Dict[str, Any], index: int, owner: str) -> Dict[str, str]:
    if not isinstance(raw, dict):
        raise ValueError(f"facts[{index}] must be an object")
    identifier = str(raw.get("id", f"CTX-{index + 1}")).upper()
    if not re.fullmatch(r"CTX-\d+", identifier):
        raise ValueError(f"invalid context fact id: {identifier}")
    status = str(raw.get("status", "Unknown")).title()
    allowed = {"Observed", "Decision", "Assumption", "Proposal", "Unknown", "Evidence"}
    if status not in allowed:
        raise ValueError(f"{identifier} has invalid status '{status}'")
    return {
        "id": identifier,
        "dimension": str(raw.get("dimension", "Other")).strip() or "Other",
        "statement": str(raw.get("statement", "Unknown; repository evidence not recorded.")).strip(),
        "status": status,
        "confidence": str(raw.get("confidence", "Low")).strip() or "Low",
        "evidence": str(raw.get("evidence", "Not yet recorded")).strip() or "Not yet recorded",
        "owner": str(raw.get("owner", owner)).strip() or owner,
        "recheck_trigger": str(raw.get("recheck_trigger", "Before specification approval")).strip() or "Before specification approval",
    }


def add_cli_fact(facts: List[Dict[str, str]], dimension: str, statement: str, evidence: str, owner: str) -> str:
    used = {fact["id"] for fact in facts}
    number = 1
    while f"CTX-{number}" in used:
        number += 1
    identifier = f"CTX-{number}"
    facts.append(
        {
            "id": identifier,
            "dimension": dimension,
            "statement": statement,
            "status": "Decision",
            "confidence": "Medium",
            "evidence": evidence,
            "owner": owner,
            "recheck_trigger": "When repository evidence or operating scope changes",
        }
    )
    return identifier


def default_facts(owner: str) -> List[Dict[str, str]]:
    return [
        {
            "id": f"CTX-{index}",
            "dimension": dimension,
            "statement": "Unknown; repository evidence not recorded.",
            "status": "Unknown",
            "confidence": "Low",
            "evidence": "Not yet recorded",
            "owner": owner,
            "recheck_trigger": "Before specification approval",
        }
        for index, dimension in enumerate(FACT_DIMENSIONS, 1)
    ]


def normalize_capability(name: str) -> str:
    return name.strip().lower().replace("_", "-")

def normalized_id(value: Any, pattern: str, label: str) -> str:
    identifier = str(value).strip().upper()
    if not re.fullmatch(pattern, identifier):
        raise ValueError(f"invalid {label} id: {identifier}")
    return identifier

def ensure_unique_ids(records: Iterable[Dict[str, Any]]) -> None:
    seen: Set[str] = set()
    for record in records:
        identifier = str(record["id"])
        if identifier in seen:
            raise ValueError(f"duplicate structured record id: {identifier}")
        seen.add(identifier)

def validate_trigger_references(facts: List[Dict[str, str]], groups: Iterable[Tuple[str, Iterable[str]]]) -> None:
    known = {fact["id"] for fact in facts}
    for label, triggers in groups:
        for trigger in triggers:
            identifier = normalized_id(trigger, r"CTX-\d+", f"{label} trigger")
            if identifier not in known:
                raise ValueError(f"{label} references unknown context fact: {identifier}")


def active_capabilities(context: Dict[str, Any], cli_overlays: List[str], facts: List[Dict[str, str]], owner: str) -> Dict[str, Dict[str, Any]]:
    result: Dict[str, Dict[str, Any]] = {}
    raw_capabilities = context.get("capabilities", {})
    for raw_name, raw_value in raw_capabilities.items():
        name = normalize_capability(str(raw_name))
        if name not in CAPABILITY_ARTIFACTS and name not in DIRECT_ARTIFACT_OVERRIDES:
            raise ValueError(f"unknown context capability: {name}")
        if isinstance(raw_value, bool):
            record = {"status": "active" if raw_value else "inactive", "trigger_facts": []}
        elif isinstance(raw_value, dict):
            record = dict(raw_value)
        else:
            raise ValueError(f"capability '{name}' must be a boolean or object")
        status = str(record.get("status", "active")).lower()
        if status not in {"active", "inactive", "unknown"}:
            raise ValueError(f"capability '{name}' has invalid status '{status}'")
        triggers = record.get("trigger_facts", [])
        if not isinstance(triggers, list):
            raise ValueError(f"capability '{name}' trigger_facts must be an array")
        if status == "active" and not triggers:
            triggers = [add_cli_fact(
                facts,
                "Capability decision",
                f"The context input activated capability '{name}'; repository evidence must be confirmed before approval.",
                f"Context-file capabilities.{name}",
                str(record.get("owner", owner)),
            )]
        result[name] = {
            "status": status,
            "trigger_facts": [str(item).upper() for item in triggers],
            "owner": str(record.get("owner", owner)),
            "reason": str(record.get("reason", "Context-file decision")),
            "review_gate": str(record.get("review_gate", "When the triggering facts change")),
        }

    for overlay in cli_overlays:
        name = normalize_capability(overlay)
        if name not in OVERLAYS and name not in DIRECT_ARTIFACT_OVERRIDES:
            raise ValueError(f"unknown overlay: {name}")
        capability = OVERLAY_CAPABILITY.get(name, name)
        trigger = add_cli_fact(
            facts,
            "Explicit specification override",
            f"The operator explicitly activated '{name}'; underlying applicability still requires repository review.",
            f"CLI --overlay {name}",
            owner,
        )
        result[capability] = {
            "status": "active",
            "trigger_facts": [trigger],
            "owner": owner,
            "reason": "Explicit operator override",
            "review_gate": "Confirm against repository evidence before approval",
        }
    return result


def normalize_jurisdiction_records(context: Dict[str, Any], cli_codes: List[str], facts: List[Dict[str, str]], owner: str, today: str) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []
    raw_records = list(context.get("jurisdictions", []))
    raw_records.extend({"code": code} for code in cli_codes)
    for index, raw in enumerate(raw_records, 1):
        if isinstance(raw, str):
            raw = {"code": raw}
        if not isinstance(raw, dict) or not raw.get("code"):
            raise ValueError(f"jurisdictions[{index - 1}] must contain a code")
        code = normalize_jurisdiction(str(raw["code"]))
        if code not in JURISDICTIONS:
            supported = ", ".join(sorted(JURISDICTIONS))
            raise ValueError(f"unknown jurisdiction code '{code}'; supported starter codes: {supported}. Add an official source before using another territory")
        source_state = str(raw.get("source_status", "unknown")).lower().replace(" ", "-")
        if source_state not in SOURCE_STATES:
            raise ValueError(f"jurisdiction {code} has invalid source_status '{source_state}'")
        decision = str(raw.get("decision", "Unknown")).strip()
        if decision not in DECISIONS:
            raise ValueError(f"jurisdiction {code} has invalid decision '{decision}'")
        triggers = raw.get("trigger_facts", [])
        if not isinstance(triggers, list):
            raise ValueError(f"jurisdiction {code} trigger_facts must be an array")
        if not triggers:
            from_cli = any(normalize_jurisdiction(value) == code for value in cli_codes)
            triggers = [
                add_cli_fact(
                    facts,
                    "Candidate jurisdiction",
                    f"The operator requested engineering assessment for {JURISDICTIONS[code]['territory']}.",
                    f"CLI --jurisdiction {code}" if from_cli else f"Context-file jurisdictions[{index - 1}]",
                    str(raw.get("owner", owner)),
                )
            ]
        source = JURISDICTIONS[code]
        records.append(
            {
                "id": normalized_id(raw.get("id", f"JUR-{code}-{index}"), r"JUR-(?:[A-Z0-9]+-)+\d+", "jurisdiction"),
                "code": code,
                "territory": source["territory"],
                "trigger_facts": [str(item).upper() for item in triggers],
                "authority": str(raw.get("authority", source["authority"])),
                "source_url": str(raw.get("source_url", source["url"])),
                "source_status": source_state,
                "publication_date": str(raw.get("publication_date", "Unknown")),
                "effective_date": str(raw.get("effective_date", "Unknown")),
                "retrieved_date": str(raw.get("retrieved_date", today)),
                "decision": decision,
                "owner": str(raw.get("owner", owner)),
                "engineering_impact": str(raw.get("engineering_impact", "PRIV-*, SEC-*, LOC-* as applicable")),
                "next_review": str(raw.get("next_review", "Before applicability approval or source-status change")),
            }
        )
    return records


def normalize_sectors(context: Dict[str, Any], cli_sectors: List[str], facts: List[Dict[str, str]], owner: str) -> List[Dict[str, str]]:
    records: List[Dict[str, str]] = []
    raw_records: List[Any] = list(context.get("sectors", [])) + cli_sectors
    for index, raw in enumerate(raw_records, 1):
        if isinstance(raw, str):
            raw = {"code": raw}
        if not isinstance(raw, dict) or not raw.get("code"):
            raise ValueError(f"sectors[{index - 1}] must contain a code")
        value = str(raw["code"]).strip().lower().replace("_", "-")
        if value not in SECTOR_ALIASES:
            supported = ", ".join(sorted(SECTOR_ALIASES))
            raise ValueError(f"unknown sector code '{value}'; supported codes: {supported}")
        code = SECTOR_ALIASES[value]
        triggers = raw.get("trigger_facts", [])
        if not isinstance(triggers, list):
            raise ValueError(f"sector {code} trigger_facts must be an array")
        if not triggers:
            from_cli = any(str(item).strip().lower().replace("_", "-") == value for item in cli_sectors)
            triggers = [
                add_cli_fact(
                    facts,
                    "Candidate sector",
                    f"The operator selected '{code}' for engineering applicability review.",
                    f"CLI --sector {value}" if from_cli else f"Context-file sectors[{index - 1}]",
                    str(raw.get("owner", owner)),
                )
            ]
        records.append(
            {
                "id": normalized_id(raw.get("id", f"JUR-SECTOR-{index}"), r"JUR-SECTOR-\d+", "sector"),
                "code": code,
                "trigger_ids": [str(item).upper() for item in triggers],
                "trigger_facts": ", ".join(str(item).upper() for item in triggers),
                "decision": str(raw.get("decision", "Unknown")),
                "owner": str(raw.get("owner", owner)),
                "source": str(raw.get("source", "Qualified sector owner must add an official source")),
                "source_status": str(raw.get("source_status", "unknown")),
                "next_review": str(raw.get("next_review", "Before sector applicability approval")),
            }
        )
    return records


def normalize_transfers(context: Dict[str, Any], facts: List[Dict[str, str]], owner: str) -> List[Dict[str, str]]:
    records: List[Dict[str, str]] = []
    for index, raw in enumerate(context.get("transfers", []), 1):
        if not isinstance(raw, dict):
            raise ValueError(f"transfers[{index - 1}] must be an object")
        exporter = normalize_jurisdiction(str(raw.get("exporter", "")))
        importer = normalize_jurisdiction(str(raw.get("importer", "")))
        if exporter not in JURISDICTIONS or importer not in JURISDICTIONS:
            raise ValueError(f"transfer {index} exporter/importer must use supported jurisdiction codes")
        triggers = raw.get("trigger_facts", [])
        if not isinstance(triggers, list):
            raise ValueError(f"transfer {index} trigger_facts must be an array")
        if not triggers:
            triggers = [add_cli_fact(
                facts,
                "Cross-border transfer candidate",
                f"The context input records a candidate transfer from {exporter} to {importer}.",
                f"Context-file transfers[{index - 1}]",
                str(raw.get("owner", owner)),
            )]
        records.append(
            {
                "id": normalized_id(raw.get("id", f"XFER-{index}"), r"XFER-\d+", "transfer"),
                "trigger_ids": [str(item).upper() for item in triggers],
                "trigger_facts": ", ".join(str(item).upper() for item in triggers),
                "exporter": exporter,
                "exporter_role": str(raw.get("exporter_role", "Unknown")),
                "importer": importer,
                "importer_role": str(raw.get("importer_role", "Unknown")),
                "data_subjects": str(raw.get("data_subjects", "Unknown")),
                "data_categories": str(raw.get("data_categories", "Unknown")),
                "purpose": str(raw.get("purpose", "Unknown")),
                "storage_access": str(raw.get("storage_access", "Unknown")),
                "mechanism_status": str(raw.get("mechanism_status", "Unknown — qualified review required")),
                "safeguards": str(raw.get("safeguards", "Unknown")),
                "onward_transfers": str(raw.get("onward_transfers", "Unknown")),
                "retention_deletion": str(raw.get("retention_deletion", "Unknown")),
                "evidence": str(raw.get("evidence", "Not yet recorded")),
                "owner": str(raw.get("owner", owner)),
                "status": str(raw.get("status", "Unknown")),
            }
        )
    return records


def normalize_locales(context: Dict[str, Any], facts: List[Dict[str, str]], owner: str) -> List[Dict[str, str]]:
    records: List[Dict[str, str]] = []
    for index, raw in enumerate(context.get("locales", []), 1):
        if not isinstance(raw, dict) or not raw.get("locale"):
            raise ValueError(f"locales[{index - 1}] must contain a locale")
        triggers = raw.get("trigger_facts", [])
        if not isinstance(triggers, list):
            raise ValueError(f"locale {index} trigger_facts must be an array")
        if not triggers:
            triggers = [add_cli_fact(
                facts,
                "Locale contract candidate",
                f"The context input records locale '{raw['locale']}'.",
                f"Context-file locales[{index - 1}]",
                str(raw.get("owner", owner)),
            )]
        records.append(
            {
                "id": normalized_id(raw.get("id", f"LOC-{index}"), r"LOC-\d+", "locale"),
                "trigger_ids": [str(item).upper() for item in triggers],
                "locale": str(raw["locale"]),
                "fallback": str(raw.get("fallback", "Unknown")),
                "regional_rules": str(raw.get("regional_rules", "Unknown")),
                "accessibility": str(raw.get("accessibility", "Unknown")),
                "test_evidence": str(raw.get("test_evidence", "Unknown")),
                "owner": str(raw.get("owner", owner)),
                "status": str(raw.get("status", "Unknown")),
            }
        )
    return records


def select_artifacts(profile: str, capabilities: Dict[str, Dict[str, Any]], jurisdictions: List[Dict[str, Any]], sectors: List[Dict[str, str]], transfers: List[Dict[str, str]], locales: List[Dict[str, str]]) -> Tuple[List[str], Dict[str, List[str]]]:
    effective_profile = "platform" if profile == "saas" else profile
    reasons: Dict[str, List[str]] = {"prd": [f"required baseline for {effective_profile} profile"]}
    if effective_profile == "platform":
        reasons.setdefault("technical-design", []).append("platform profile implies material component boundaries")
        reasons.setdefault("architecture", []).append("platform profile implies multiple runtime or trust boundaries")
    for name, record in capabilities.items():
        if record["status"] != "active":
            continue
        artifacts = CAPABILITY_ARTIFACTS.get(name, {name} if name in DIRECT_ARTIFACT_OVERRIDES else set())
        for artifact in artifacts:
            reasons.setdefault(artifact, []).append(f"active capability/overlay: {name}")

    if jurisdictions:
        for artifact in ("privacy", "security"):
            reasons.setdefault(artifact, []).append("candidate jurisdiction requires applicability and control review")
    if transfers:
        for artifact in ("privacy", "security"):
            reasons.setdefault(artifact, []).append("cross-border transfer record exists")
    if any(record["code"] in REGULATED_SECTORS for record in sectors):
        for artifact in ("brd", "privacy", "security"):
            reasons.setdefault(artifact, []).append("regulated-sector candidate requires qualified review")
    if locales:
        reasons.setdefault("localized-ui", []).append("locale contract exists")

    return [name for name in ARTIFACTS if name in reasons], reasons


def md(value: Any) -> str:
    return str(value).replace("|", "\\|").replace("\n", " ").strip()


def render_context(
    profile: str,
    owner: str,
    facts: List[Dict[str, str]],
    capabilities: Dict[str, Dict[str, Any]],
    jurisdictions: List[Dict[str, Any]],
    sectors: List[Dict[str, str]],
    transfers: List[Dict[str, str]],
    locales: List[Dict[str, str]],
    selected: List[str],
    reasons: Dict[str, List[str]],
    today: str,
) -> str:
    lines = [
        "# Context Record",
        "",
        "> This record captures engineering context and candidate applicability. It is not a legal, tax, privacy, security, audit, or certification conclusion.",
        "",
        "## Document Control",
        "",
        "| Field | Value |",
        "|---|---|",
        f"| Owner | {md(owner)} |",
        "| Status | Draft |",
        f"| Reviewed | {today} |",
        f"| Depth profile | {profile} |",
        "| Decision approvers | [TBD owner=Product and architecture approvers; due=before approval] |",
        "",
        "## Context Facts",
        "",
        "| ID | Dimension | Statement | Status | Confidence | Evidence | Owner | Recheck trigger |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for fact in facts:
        lines.append("| " + " | ".join(md(fact[key]) for key in ("id", "dimension", "statement", "status", "confidence", "evidence", "owner", "recheck_trigger")) + " |")

    lines += [
        "",
        "## Overlay and Capability Decisions",
        "",
        "| ID | Capability/overlay | Status | Trigger facts | Selected artifacts | Owner | Reason | Review gate |",
        "|---|---|---|---|---|---|---|---|",
    ]
    if capabilities:
        for index, (name, record) in enumerate(sorted(capabilities.items()), 1):
            artifacts = sorted(CAPABILITY_ARTIFACTS.get(name, {name} if name in DIRECT_ARTIFACT_OVERRIDES else set()))
            lines.append(
                f"| OVR-{index} | {md(name)} | {md(record['status'].title())} | {md(', '.join(record['trigger_facts']) or 'None recorded')} | {md(', '.join(artifacts) or 'None')} | {md(record['owner'])} | {md(record['reason'])} | {md(record['review_gate'])} |"
            )
    else:
        lines.append("| OVR-1 | None selected | Inactive | None | PRD baseline only | " + md(owner) + " | No active capability supplied | Re-evaluate when context changes |")

    lines += [
        "",
        "## Artifact Selection",
        "",
        "| Artifact | Decision | Reason | Owner | Review gate |",
        "|---|---|---|---|---|",
    ]
    selected_set = set(selected)
    for artifact in ARTIFACTS:
        if artifact in selected_set:
            lines.append(f"| {artifact} | Selected | {md('; '.join(reasons[artifact]))} | {md(owner)} | Re-run selection when context changes |")
        else:
            lines.append(f"| {artifact} | Not applicable for current evidence | No active trigger | {md(owner)} | Activate when the document-map trigger is observed |")

    lines += [
        "",
        "## Jurisdiction Decisions",
        "",
        "| ID | Territory | Trigger facts | Authority/source | Source status | Publication date | Effective date | Retrieved date | Decision | Qualified owner | Engineering impact | Next review |",
        "|---|---|---|---|---|---|---|---|---|---|---|---|",
    ]
    if jurisdictions:
        for record in jurisdictions:
            source = f"{record['authority']}: {record['source_url']}"
            values = ("id", "territory", "trigger_facts")
            lines.append(
                f"| {md(record['id'])} | {md(record['territory'])} | {md(', '.join(record['trigger_facts']) or 'None recorded')} | {md(source)} | {md(record['source_status'])} | {md(record['publication_date'])} | {md(record['effective_date'])} | {md(record['retrieved_date'])} | {md(record['decision'])} | {md(record['owner'])} | {md(record['engineering_impact'])} | {md(record['next_review'])} |"
            )
    else:
        lines.append("| JUR-0 | None selected | None | None | unknown | Unknown | Unknown | " + today + " | Unknown | " + md(owner) + " | None until triggered | When entity, market, subject, or processing location changes |")

    lines += [
        "",
        "## Sector Decisions",
        "",
        "| ID | Sector | Trigger facts | Decision | Qualified owner | Official source/status | Next review |",
        "|---|---|---|---|---|---|---|",
    ]
    if sectors:
        for record in sectors:
            lines.append(f"| {md(record['id'])} | {md(record['code'])} | {md(record['trigger_facts'])} | {md(record['decision'])} | {md(record['owner'])} | {md(record['source'])}; status={md(record['source_status'])} | {md(record['next_review'])} |")
    else:
        lines.append("| JUR-SECTOR-0 | None selected | None | Unknown | " + md(owner) + " | None; status=unknown | When sector or age group changes |")

    lines += [
        "",
        "## Cross-Border Transfer Records",
        "",
        "| ID | Trigger facts | Exporter role/location | Importer role/location | Data subjects/categories | Purpose | Storage/remote access | Mechanism review | Safeguards | Onward transfers | Retention/deletion | Evidence | Owner | Status |",
        "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
    ]
    if transfers:
        for record in transfers:
            values = [
                record["id"], record["trigger_facts"], f"{record['exporter_role']} / {record['exporter']}",
                f"{record['importer_role']} / {record['importer']}", f"{record['data_subjects']} / {record['data_categories']}",
                record["purpose"], record["storage_access"], record["mechanism_status"], record["safeguards"],
                record["onward_transfers"], record["retention_deletion"], record["evidence"], record["owner"], record["status"],
            ]
            lines.append("| " + " | ".join(md(value) for value in values) + " |")
    else:
        lines.append("| XFER-0 | None | Unknown | Unknown | Unknown | Unknown | Unknown | Not assessed | Unknown | Unknown | Unknown | Not recorded | " + md(owner) + " | Unknown |")

    lines += [
        "",
        "## Locale Contracts",
        "",
        "| ID | Locale | Fallback | Regional rules | Accessibility | Test evidence | Owner | Status |",
        "|---|---|---|---|---|---|---|---|",
    ]
    if locales:
        for record in locales:
            lines.append("| " + " | ".join(md(record[key]) for key in ("id", "locale", "fallback", "regional_rules", "accessibility", "test_evidence", "owner", "status")) + " |")
    else:
        lines.append("| LOC-0 | Unknown | Unknown | Unknown | Unknown | Not recorded | " + md(owner) + " | Unknown |")

    lines += [
        "",
        "## Approval Gate",
        "",
        "- [ ] Repository and runtime facts are verified.",
        "- [ ] Unknowns have an owner and a concrete recheck trigger.",
        "- [ ] Active overlays have non-unknown triggering `CTX-*` facts.",
        "- [ ] Jurisdiction and sector candidates have qualified review.",
        "- [ ] Transfer and locale records have downstream requirements and tests.",
        "- [ ] Selected and omitted artifacts have been reviewed.",
        "",
    ]
    return "\n".join(lines)


def desired_files(args: argparse.Namespace) -> Tuple[Dict[str, bytes], Dict[str, Any]]:
    context: Dict[str, Any] = load_context(args.context_file) if args.context_file else {}
    owner = str(context.get("owner", args.owner)).strip() or args.owner
    today = dt.date.today().isoformat()
    facts = [normalize_fact(raw, index, owner) for index, raw in enumerate(context.get("facts", []))]
    ensure_unique_ids(facts)
    if not facts:
        facts = default_facts(owner)

    cli_overlays = csv_values(args.overlay)
    capabilities = active_capabilities(context, cli_overlays, facts, owner)
    if args.profile == "saas":
        trigger = add_cli_fact(
            facts,
            "Compatibility profile alias",
            "The operator selected the saas compatibility alias, which activates platform, multi-tenant, and identity review.",
            "CLI --profile saas",
            owner,
        )
        for capability in ("multi-tenant", "identity"):
            capabilities.setdefault(
                capability,
                {"status": "active", "trigger_facts": [trigger], "owner": owner, "reason": "Compatibility alias: saas", "review_gate": "Confirm the alias against repository evidence"},
            )
    cli_jurisdictions = [normalize_jurisdiction(value) for value in csv_values(args.jurisdiction)]
    jurisdictions = normalize_jurisdiction_records(context, cli_jurisdictions, facts, owner, today)
    cli_sectors = csv_values(args.sector)
    sectors = normalize_sectors(context, cli_sectors, facts, owner)
    transfers = normalize_transfers(context, facts, owner)
    locales = normalize_locales(context, facts, owner)
    ensure_unique_ids([*jurisdictions, *sectors, *transfers, *locales])

    if jurisdictions:
        trigger_facts = sorted({fact for record in jurisdictions for fact in record["trigger_facts"]})
        capabilities.setdefault(
            "personal-data",
            {"status": "active", "trigger_facts": trigger_facts, "owner": owner, "reason": "Candidate jurisdiction record", "review_gate": "Qualified applicability review"},
        )
    if sectors and any(record["code"] in REGULATED_SECTORS for record in sectors):
        capabilities.setdefault(
            "regulated-sector",
            {"status": "active", "trigger_facts": sorted({fact for record in sectors for fact in record["trigger_ids"]}), "owner": owner, "reason": "Structured sector candidate", "review_gate": "Qualified sector applicability review"},
        )
    if transfers:
        capabilities.setdefault(
            "cross-border",
            {"status": "active", "trigger_facts": sorted({fact for record in transfers for fact in record["trigger_ids"]}), "owner": owner, "reason": "Structured transfer record", "review_gate": "Qualified transfer review"},
        )
    if locales:
        capabilities.setdefault(
            "localized-ui",
            {"status": "active", "trigger_facts": sorted({fact for record in locales for fact in record["trigger_ids"]}), "owner": owner, "reason": "Structured locale contract", "review_gate": "Localization and accessibility acceptance"},
        )

    validate_trigger_references(
        facts,
        [(f"capability {name}", record["trigger_facts"]) for name, record in capabilities.items()]
        + [(f"jurisdiction {record['id']}", record["trigger_facts"]) for record in jurisdictions]
        + [(f"sector {record['id']}", record["trigger_ids"]) for record in sectors]
        + [(f"transfer {record['id']}", record["trigger_ids"]) for record in transfers]
        + [(f"locale {record['id']}", record["trigger_ids"]) for record in locales],
    )

    profile = "platform" if args.profile == "saas" else args.profile
    chosen, reasons = select_artifacts(args.profile, capabilities, jurisdictions, sectors, transfers, locales)
    context_text = render_context(profile, owner, facts, capabilities, jurisdictions, sectors, transfers, locales, chosen, reasons, today)
    files: Dict[str, bytes] = {"CONTEXT-RECORD.md": context_text.encode("utf-8")}
    missing: List[Path] = []
    for name in chosen:
        source_name, target_name = ARTIFACTS[name]
        source = TEMPLATE_DIR / source_name
        if not source.is_file():
            missing.append(source)
        else:
            files[target_name] = source.read_bytes()
    if missing:
        raise ValueError("missing template(s): " + ", ".join(str(path) for path in missing))
    report = {
        "profile": profile,
        "overlays": sorted(name for name, record in capabilities.items() if record["status"] == "active"),
        "selected": chosen,
        "omitted": [name for name in ARTIFACTS if name not in chosen],
    }
    return files, report


def preview_updates(output: Path, files: Dict[str, bytes], report: Dict[str, Any]) -> int:
    review_dir = output / UPDATE_DIRNAME
    proposed_dir = review_dir / "proposed"
    diff_dir = review_dir / "diffs"
    manifest_files: Dict[str, Any] = {}
    changed = 0
    for relative, desired in sorted(files.items()):
        target = output / relative
        current = target.read_bytes() if target.exists() else b""
        if target.exists() and current == desired:
            print(f"SKIP unchanged: {target}")
            continue
        changed += 1
        proposed = proposed_dir / relative
        atomic_write(proposed, desired)
        before_text = current.decode("utf-8", errors="replace").splitlines(keepends=True)
        after_text = desired.decode("utf-8", errors="replace").splitlines(keepends=True)
        diff = "".join(difflib.unified_diff(before_text, after_text, fromfile=f"a/{relative}", tofile=f"b/{relative}"))
        diff_path = diff_dir / f"{relative}.diff"
        atomic_write(diff_path, diff.encode("utf-8"))
        manifest_files[relative] = {
            "original_exists": target.exists(),
            "original_sha256": sha256_bytes(current) if target.exists() else None,
            "proposed_sha256": sha256_bytes(desired),
            "proposed_path": str(proposed.relative_to(output)),
            "diff_path": str(diff_path.relative_to(output)),
        }
        print(f"REVIEW changed: {target} diff={diff_path}")

    manifest = {
        "format": 1,
        "created_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "output": str(output.resolve()),
        "selection": report,
        "files": manifest_files,
    }
    atomic_write(review_dir / "manifest.json", (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode("utf-8"))
    print(f"UPDATE PREVIEW changed={changed} manifest={review_dir / 'manifest.json'}")
    if changed:
        print("No established file was replaced. Review diffs, then rerun with --update --force.")
    return 0


def apply_reviewed_update(output: Path) -> int:
    review_dir = output / UPDATE_DIRNAME
    manifest_path = review_dir / "manifest.json"
    if not manifest_path.is_file():
        print(f"ERROR no reviewed update manifest: {manifest_path}; run --update without --force first", file=sys.stderr)
        return 2
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        print(f"ERROR invalid update manifest: {exc}", file=sys.stderr)
        return 2
    if Path(str(manifest.get("output", ""))).resolve() != output.resolve():
        print("ERROR update manifest belongs to a different output directory", file=sys.stderr)
        return 2
    entries = manifest.get("files", {})
    if not isinstance(entries, dict):
        print("ERROR update manifest has invalid files map", file=sys.stderr)
        return 2

    staged: List[Tuple[str, Path, Path, Dict[str, Any]]] = []
    for relative, record in sorted(entries.items()):
        if not isinstance(record, dict):
            print(f"ERROR invalid update manifest entry: {relative}", file=sys.stderr)
            return 2
        try:
            target = safe_child(output, relative, "manifest target")
            proposed = safe_child(output, str(record["proposed_path"]), "proposed path")
            proposed.resolve().relative_to((output / UPDATE_DIRNAME / "proposed").resolve())
        except (KeyError, ValueError) as exc:
            print(f"ERROR invalid update manifest path: {exc}", file=sys.stderr)
            return 2
        expected_original = record.get("original_sha256")
        current_hash = sha256_file(target) if target.exists() else None
        if current_hash != expected_original:
            print(f"ERROR hash changed since review: {target}; regenerate the preview", file=sys.stderr)
            return 1
        if not proposed.is_file() or sha256_file(proposed) != record.get("proposed_sha256"):
            print(f"ERROR proposed file hash mismatch: {proposed}", file=sys.stderr)
            return 1
        staged.append((relative, target, proposed, record))

    if not staged:
        print("SKIP no reviewed changes")
        return 0
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup_root = output / ".spec-backups" / stamp
    for relative, target, proposed, record in staged:
        if target.exists():
            backup = backup_root / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target, backup)
            if sha256_file(backup) != record["original_sha256"]:
                print(f"ERROR backup verification failed: {backup}", file=sys.stderr)
                return 1
    for relative, target, proposed, _record in staged:
        atomic_write(target, proposed.read_bytes())
        print(f"WRITE reviewed: {target}")
    print(f"BACKUP {backup_root}")
    print("Applied reviewed update. The backup remains recoverable if a later step is interrupted.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--profile", choices=("lean", "product", "platform", "saas"), required=True)
    parser.add_argument("--overlay", action="append", default=[], help="comma-separated explicit overlay/artifact overrides; repeatable")
    parser.add_argument("--jurisdiction", action="append", default=[], help="comma-separated starter jurisdiction codes; repeatable")
    parser.add_argument("--sector", action="append", default=[], help="comma-separated sector codes; repeatable")
    parser.add_argument("--context-file", type=Path, help="UTF-8 JSON context input; see references/context-resolution.md")
    parser.add_argument("--owner", default="Specification owner", help="role accountable for unresolved generated records")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--update", action="store_true", help="create a sidecar preview and deterministic diff; does not replace established files")
    parser.add_argument("--force", action="store_true", help="apply the previously reviewed --update manifest after hash verification")
    args = parser.parse_args()

    if args.force and not args.update:
        parser.error("--force requires --update")
    output = args.output.expanduser()

    if args.update and args.force:
        return apply_reviewed_update(output)

    try:
        files, report = desired_files(args)
    except ValueError as exc:
        parser.error(str(exc))

    print("profile=" + report["profile"] + " overlays=" + (",".join(report["overlays"]) or "none"))
    print("selected=" + ",".join(report["selected"]))
    print("omitted=" + ",".join(report["omitted"]))

    if args.update:
        if args.dry_run:
            parser.error("--dry-run and --update are mutually exclusive")
        return preview_updates(output, files, report)

    for relative, data in sorted(files.items()):
        target = output / relative
        if target.exists():
            print(f"SKIP existing: {target}")
            continue
        print(("DRY-RUN " if args.dry_run else "WRITE ") + str(target))
        if not args.dry_run:
            atomic_write(target, data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

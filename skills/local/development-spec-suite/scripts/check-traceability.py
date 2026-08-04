#!/usr/bin/env python3
"""Validate ownership, traceability, context coverage, and safe evidence links."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Sequence, Set, Tuple

NAMESPACES = (
    "BR|PR|NFR|DS|TD|ADR|ARCH|DATA|TEN|IAM|DOM|API|UX|BILL|SEC|PRIV|CTRL|"
    "SLI|SLO|DR|DEL|MIG|OBS|RATE|CTX|OVR|JUR|XFER|LOC|TEST|EVID"
)
ID_RE = re.compile(rf"\b(?:(?:{NAMESPACES})(?:-[A-Z0-9]+)*-\d+|T-?\d+)\b")
DECLARATION_HEADING_RE = re.compile(rf"^\s*#{{2,6}}\s+(?:\[[ xX]\]\s+)?((?:(?:{NAMESPACES})(?:-[A-Z0-9]+)*-\d+|T-?\d+))\b")
TASK_ID_RE = re.compile(r"^T-?(\d+)$")
PLACEHOLDER_ZERO_RE = re.compile(r"^(?:JUR(?:-[A-Z]+)?|XFER|LOC)-0$")
TBD_RE = re.compile(r"\[TBD[^\]]*\]", re.IGNORECASE)
VALID_TBD_RE = re.compile(r"\[TBD\s+owner=[^;\]]+;\s*due=(?:\d{4}-\d{2}-\d{2}|before [^\]]+)\]", re.IGNORECASE)
SECRET_RE = re.compile(r"(?:api[_-]?key|access[_-]?token|password|private[_-]?key)\s*[:=]\s*[A-Za-z0-9_/+.-]{16,}", re.I)
SOURCE_STATES = {"proposed", "adopted", "enacted", "in-force", "superseded", "unknown"}
ARTIFACT_FILENAMES = {
    ("01-BRD.md", "01-BRD.md"), ("02-PRD.md", "02-PRD.md"),
    ("03-TECHNICAL-DESIGN.md", "03-TECHNICAL-DESIGN.md"),
    ("04-SYSTEM-ARCHITECTURE.md", "04-SYSTEM-ARCHITECTURE.md"),
    ("05-DATA-MODEL.md", "05-DATA-MODEL.md"),
    ("06-TENANT-ISOLATION.md", "06-TENANT-ISOLATION.md"),
    ("07-IAM-RBAC-ABAC.md", "07-IAM-RBAC-ABAC.md"),
    ("08-DOMAIN-ROUTING.md", "08-DOMAIN-ROUTING.md"),
    ("09-API-SPECIFICATION.md", "09-API-SPECIFICATION.md"),
    ("10-DESIGN-SYSTEM-WHITELABEL.md", "10-DESIGN-SYSTEM-WHITELABEL.md"),
    ("11-BILLING-PAYMENTS.md", "11-BILLING-PAYMENTS.md"),
    ("12-SECURITY-ARCHITECTURE.md", "12-SECURITY-ARCHITECTURE.md"),
    ("13-COMPLIANCE-PRIVACY.md", "13-COMPLIANCE-PRIVACY.md"),
    ("14-SLA-DRP.md", "14-SLA-DRP.md"),
    ("15-DEVOPS-CICD-MIGRATIONS.md", "15-DEVOPS-CICD-MIGRATIONS.md"),
    ("16-OBSERVABILITY-RATE-LIMITING.md", "16-OBSERVABILITY-RATE-LIMITING.md"),
}
OWNER_NAMESPACES = {"CTX", "OVR", "JUR", "XFER", "LOC", "DS", "PR", "NFR", "TD", "ARCH", "DATA", "TEN", "IAM", "DOM", "API", "UX", "BILL", "SEC", "PRIV", "CTRL", "SLI", "SLO", "DR", "DEL", "MIG", "OBS", "RATE"}
OVERLAY_COVERAGE: Dict[str, Tuple[Set[str], Set[str]]] = {
    "multi-tenant": ({"TEN"}, {"06-TENANT-ISOLATION.md"}),
    "identity": ({"IAM"}, {"07-IAM-RBAC-ABAC.md"}),
    "public-api": ({"API"}, {"09-API-SPECIFICATION.md"}),
    "custom-domain": ({"DOM"}, {"08-DOMAIN-ROUTING.md"}),
    "localized-ui": ({"LOC", "UX"}, {"10-DESIGN-SYSTEM-WHITELABEL.md"}),
    "commerce": ({"BILL"}, {"11-BILLING-PAYMENTS.md"}),
    "personal-data": ({"PRIV"}, {"13-COMPLIANCE-PRIVACY.md"}),
    "cross-border": ({"XFER", "PRIV"}, {"13-COMPLIANCE-PRIVACY.md"}),
    "regulated-sector": ({"JUR", "PRIV", "SEC"}, {"12-SECURITY-ARCHITECTURE.md", "13-COMPLIANCE-PRIVACY.md"}),
    "ai-system": ({"SEC", "PRIV"}, {"12-SECURITY-ARCHITECTURE.md", "13-COMPLIANCE-PRIVACY.md"}),
    "high-availability": ({"SLO", "DR"}, {"14-SLA-DRP.md"}),
    "mobile-desktop": ({"TD", "UX"}, {"03-TECHNICAL-DESIGN.md", "10-DESIGN-SYSTEM-WHITELABEL.md"}),
    "extension-plugin": ({"TD", "SEC"}, {"03-TECHNICAL-DESIGN.md", "12-SECURITY-ARCHITECTURE.md"}),
    "data-analytics": ({"DATA", "OBS"}, {"05-DATA-MODEL.md", "16-OBSERVABILITY-RATE-LIMITING.md"}),
    "persistence": ({"DATA"}, {"05-DATA-MODEL.md"}),
    "production-service": ({"OBS"}, {"16-OBSERVABILITY-RATE-LIMITING.md"}),
    "maintained-deployment": ({"DEL"}, {"15-DEVOPS-CICD-MIGRATIONS.md"}),
}


def canonical_id(identifier: str) -> str:
    match = TASK_ID_RE.fullmatch(identifier.upper())
    return f"T-{match.group(1)}" if match else identifier.upper()


def namespace(identifier: str) -> str:
    return "T" if identifier.startswith("T-") else identifier.split("-", 1)[0]


def normalize_header(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def is_separator_row(cells: Sequence[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def split_table_row(line: str) -> List[str]:
    value = line.strip()
    if value.startswith("|"):
        value = value[1:]
    if value.endswith("|"):
        value = value[:-1]
    # Escaped pipes are restored after a sentinel split; Markdown code spans with
    # pipes remain a documented limitation rather than a dependency-worthy parser.
    sentinel = "\u0000"
    value = value.replace("\\|", sentinel)
    return [cell.strip().replace(sentinel, "|") for cell in value.split("|")]


def strip_code_fences(lines: Sequence[str]) -> List[str]:
    result: List[str] = []
    in_fence = False
    fence = ""
    for line in lines:
        marker = re.match(r"^\s*(```+|~~~+)", line)
        if marker:
            token = marker.group(1)
            if not in_fence:
                in_fence = True
                fence = token[:3]
            elif token.startswith(fence):
                in_fence = False
            result.append("")
        else:
            result.append("" if in_fence else line)
    return result


@dataclass(order=True)
class Finding:
    code: str
    path: str
    line: int
    message: str
    identifier: str = ""

    def as_dict(self) -> Dict[str, object]:
        value: Dict[str, object] = {"code": self.code, "path": self.path, "line": self.line, "message": self.message}
        if self.identifier:
            value["identifier"] = self.identifier
        return value


@dataclass
class Declaration:
    identifier: str
    path: Path
    line: int
    metadata: Dict[str, str] = field(default_factory=dict)
    text: str = ""


@dataclass
class Reference:
    identifier: str
    path: Path
    line: int
    context: str


class Validator:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.findings: List[Finding] = []
        self.declarations: Dict[str, List[Declaration]] = {}
        self.references: List[Reference] = []
        self.placeholder_ids: Set[str] = set()
        ignored_dirs = {".spec-update", ".spec-backups"}
        self.files: List[Path] = sorted(path for path in root.rglob("*.md") if not ignored_dirs.intersection(path.relative_to(root).parts))
        self.file_names = {path.name for path in self.files}

    def relative(self, path: Path) -> str:
        return path.relative_to(self.root).as_posix()

    def add(self, code: str, path: Path, line: int, message: str, identifier: str = "") -> None:
        self.findings.append(Finding(code, self.relative(path), line, message, identifier))

    def declare(self, declaration: Declaration) -> None:
        declaration.identifier = canonical_id(declaration.identifier)
        if PLACEHOLDER_ZERO_RE.match(declaration.identifier):
            return
        self.declarations.setdefault(declaration.identifier, []).append(declaration)

    def scan_file(self, path: Path) -> None:
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            self.add("MD005", path, 1, f"file is not valid UTF-8: {exc}")
            return
        lines = text.splitlines()
        visible = strip_code_fences(lines)
        fence_count = sum(1 for line in lines if re.match(r"^\s*(```+|~~~+)", line))
        if fence_count % 2:
            self.add("MD001", path, len(lines), "unbalanced fenced code block")

        for line_number, line in enumerate(visible, 1):
            for match in TBD_RE.finditer(line):
                value = match.group(0)
                template_instruction = re.search(r"\[[A-Za-z][^\]]*\]", line[: match.start()] + line[match.end() :])
                if not VALID_TBD_RE.fullmatch(value) and not template_instruction:
                    self.add("OWN003", path, line_number, "TBD must use '[TBD owner=<role>; due=<YYYY-MM-DD|before gate>]' format")
            if SECRET_RE.search(line):
                self.add("SEC001", path, line_number, "credential-like assignment must not be stored in a specification")
            for link in re.findall(r"\[[^\]]+\]\(([^)]+)\)", line):
                destination = link.strip().split("#", 1)[0]
                if not destination or destination.startswith(("http://", "https://", "mailto:")):
                    continue
                resolved = path.parent / destination
                if not resolved.exists():
                    # A flat suite intentionally omits untriggered canonical artifacts.
                    if destination in {target for _source, target in ARTIFACT_FILENAMES}:
                        continue
                    self.add("LINK001", path, line_number, f"broken local link: {destination}")

        self.scan_tables(path, visible)
        self.scan_headings(path, visible)
        for line_number, line in enumerate(visible, 1):
            if re.search(r"<[^>]+>|\[[A-Z][A-Z0-9 *-]*\]", line):
                continue
            for match in ID_RE.finditer(line):
                identifier = canonical_id(match.group(0))
                if PLACEHOLDER_ZERO_RE.match(identifier):
                    continue
                self.references.append(Reference(identifier, path, line_number, line.strip()))

    def scan_tables(self, path: Path, lines: Sequence[str]) -> None:
        index = 0
        while index + 1 < len(lines):
            if "|" not in lines[index] or "|" not in lines[index + 1]:
                index += 1
                continue
            headers = split_table_row(lines[index])
            separator = split_table_row(lines[index + 1])
            if len(headers) < 2 or len(separator) != len(headers) or not is_separator_row(separator):
                index += 1
                continue
            normalized = [normalize_header(header) for header in headers]
            row_index = index + 2
            while row_index < len(lines) and "|" in lines[row_index] and lines[row_index].strip():
                cells = split_table_row(lines[row_index])
                if len(cells) != len(headers):
                    self.add("MD004", path, row_index + 1, f"table row has {len(cells)} cells; expected {len(headers)}")
                    row_index += 1
                    continue
                metadata = {normalized[position]: cells[position].strip("` ") for position in range(len(cells))}
                first = cells[0].strip("` ")
                if ID_RE.fullmatch(first):
                    identifier = canonical_id(first)
                    placeholder = re.search(r"<[^>]+>|\[[A-Z][A-Z0-9 *-]*\]", lines[row_index])
                    if placeholder:
                        self.placeholder_ids.add(identifier)
                    self.declare(Declaration(identifier, path, row_index + 1, metadata, lines[row_index]))
                row_index += 1
            index = row_index

    def scan_headings(self, path: Path, lines: Sequence[str]) -> None:
        headings: List[Tuple[int, str]] = []
        for index, line in enumerate(lines):
            match = DECLARATION_HEADING_RE.match(line)
            if match:
                headings.append((index, match.group(1)))
        for position, (start, identifier) in enumerate(headings):
            end = headings[position + 1][0] if position + 1 < len(headings) else len(lines)
            block = lines[start + 1 : end]
            metadata: Dict[str, str] = {}
            for line in block:
                match = re.match(r"^\s*-\s*([^:]+):\s*(.+?)\s*$", line)
                if match:
                    key = normalize_header(match.group(1))
                    metadata.setdefault(key, match.group(2).strip())
            self.declare(Declaration(identifier, path, start + 1, metadata, "\n".join(block)))

    @staticmethod
    def metadata_value(declaration: Declaration, names: Iterable[str]) -> str:
        normalized_names = {normalize_header(name) for name in names}
        for key, value in declaration.metadata.items():
            if key in normalized_names or any(name in key for name in normalized_names):
                return value.strip()
        return ""

    def validate_declarations(self) -> None:
        for identifier, declarations in sorted(self.declarations.items()):
            substantive = [item for item in declarations if not re.search(r"<[^>]+>|\[[A-Za-z][^\]]*\]", item.text)]
            if len(substantive) > 1:
                locations = ", ".join(f"{self.relative(item.path)}:{item.line}" for item in substantive)
                for item in substantive:
                    self.add("ID001", item.path, item.line, f"duplicate declaration for {identifier}; declarations: {locations}", identifier)
            declaration = substantive[0] if substantive else declarations[0]
            prefix = namespace(identifier)
            placeholder_declaration = identifier in self.placeholder_ids or bool(re.search(r"\[[A-Za-z][^\]]*\]", declaration.text))
            if prefix in OWNER_NAMESPACES and not placeholder_declaration:
                owner = self.metadata_value(declaration, ("owner", "accountable owner", "system owner", "qualified owner", "engineering owner", "implementation owner", "component owner"))
                if not owner or owner.lower() in {"unknown", "none", "not recorded", "[role]", "<role>"}:
                    self.add("OWN001", declaration.path, declaration.line, f"{identifier} has no accountable owner", identifier)

    def validate_references(self) -> None:
        declared = set(self.declarations)
        for reference in self.references:
            if reference.identifier in self.placeholder_ids:
                continue
            if namespace(reference.identifier) in {"TEST", "EVID"}:
                continue
            if reference.identifier not in declared:
                self.add("REF001", reference.path, reference.line, f"unresolved numeric reference {reference.identifier}", reference.identifier)

    def validate_tasks(self) -> None:
        task_declarations = [items[0] for identifier, items in self.declarations.items() if identifier.startswith("T-") and items]
        primary_to_tasks: Dict[str, List[str]] = {}
        for task in task_declarations:
            primary_values = [
                value
                for key, value in task.metadata.items()
                if key in {"primary requirement", "primary req", "req"}
            ]
            identifiers: List[str] = []
            for value in primary_values:
                identifiers.extend(canonical_id(match.group(0)) for match in ID_RE.finditer(value) if not canonical_id(match.group(0)).startswith("T-"))
            if len(identifiers) != 1:
                self.add("TASK001", task.path, task.line, f"{task.identifier} must have exactly one primary requirement; found {len(identifiers)}", task.identifier)
                continue
            primary = identifiers[0]
            primary_to_tasks.setdefault(primary, []).append(task.identifier)
            done_when = self.metadata_value(task, ("done when", "acceptance"))
            if not done_when:
                self.add("TASK002", task.path, task.line, f"{task.identifier} has no runnable Done when check", task.identifier)

        if task_declarations:
            for identifier, declarations in self.declarations.items():
                if namespace(identifier) not in {"DS", "PR", "TD"}:
                    continue
                status = self.metadata_value(declarations[0], ("status",)).lower()
                if status in {"accepted", "implemented", "verified"} and identifier not in primary_to_tasks:
                    self.add("TRACE001", declarations[0].path, declarations[0].line, f"accepted requirement {identifier} has no primary implementation task", identifier)

    def validate_status_and_evidence(self) -> None:
        reference_contexts: Dict[str, List[Reference]] = {}
        for reference in self.references:
            reference_contexts.setdefault(reference.identifier, []).append(reference)
        for identifier, declarations in self.declarations.items():
            declaration = declarations[0]
            status = self.metadata_value(declaration, ("status",)).lower()
            if status == "verified":
                evidence = self.metadata_value(declaration, ("evidence", "acceptance evidence", "verification evidence"))
                if not re.search(r"\b(?:TEST|EVID)-[A-Z0-9-]+\b", evidence):
                    self.add("EVID001", declaration.path, declaration.line, f"verified requirement {identifier} has no TEST-* or EVID-* reference", identifier)
            if status == "superseded":
                replacement = self.metadata_value(declaration, ("superseded by", "replacement"))
                replacement_ids = [canonical_id(match.group(0)) for match in ID_RE.finditer(replacement)]
                if len(replacement_ids) != 1:
                    self.add("SUP001", declaration.path, declaration.line, f"superseded declaration {identifier} must name exactly one replacement", identifier)
                elif replacement_ids[0] not in self.declarations:
                    self.add("SUP002", declaration.path, declaration.line, f"replacement {replacement_ids[0]} is not declared", identifier)
                for reference in reference_contexts.get(identifier, []):
                    context_lower = reference.context.lower()
                    if reference.path == declaration.path and reference.line == declaration.line:
                        continue
                    if "change history" in context_lower or "superseded" in context_lower:
                        continue
                    self.add("SUP003", reference.path, reference.line, f"active reference points to superseded {identifier}", identifier)

    def validate_context(self) -> None:
        fact_status: Dict[str, str] = {}
        active_overlays: List[Declaration] = []
        for identifier, declarations in self.declarations.items():
            declaration = declarations[0]
            if namespace(identifier) == "CTX":
                fact_status[identifier] = self.metadata_value(declaration, ("status",))
            elif namespace(identifier) == "OVR":
                status = self.metadata_value(declaration, ("status",)).lower()
                if status == "active":
                    active_overlays.append(declaration)

        for overlay in active_overlays:
            trigger_value = self.metadata_value(overlay, ("trigger facts", "triggering facts"))
            triggers = [canonical_id(match.group(0)) for match in ID_RE.finditer(trigger_value) if canonical_id(match.group(0)).startswith("CTX-")]
            if not triggers:
                self.add("OVR001", overlay.path, overlay.line, f"active {overlay.identifier} has no triggering CTX-* fact", overlay.identifier)
            for trigger in triggers:
                if trigger not in self.declarations:
                    continue
                if fact_status.get(trigger, "").lower() == "unknown":
                    self.add("OVR002", overlay.path, overlay.line, f"active {overlay.identifier} is triggered only by unknown fact {trigger}", overlay.identifier)

            overlay_name = self.metadata_value(overlay, ("capability overlay", "overlay", "capability")).lower().strip("` ")
            coverage = OVERLAY_COVERAGE.get(overlay_name)
            if not coverage:
                continue
            prefixes, expected_files = coverage
            actual_prefixes = {namespace(identifier) for identifier in self.declarations}
            if not (prefixes & actual_prefixes):
                self.add("OVR003", overlay.path, overlay.line, f"active overlay '{overlay_name}' has no downstream declaration in {', '.join(sorted(prefixes))}", overlay.identifier)
            if expected_files and not (expected_files & self.file_names):
                self.add("OVR004", overlay.path, overlay.line, f"active overlay '{overlay_name}' is missing selected artifact: one of {', '.join(sorted(expected_files))}", overlay.identifier)

    def validate_jurisdiction_transfer_locale(self) -> None:
        for identifier, declarations in self.declarations.items():
            declaration = declarations[0]
            prefix = namespace(identifier)
            if prefix == "JUR":
                if identifier.startswith("JUR-SECTOR-"):
                    continue
                required_groups = {
                    "trigger facts": ("trigger facts", "triggering facts"),
                    "authority/source": ("authority source", "official source", "source"),
                    "source status": ("source status", "official source status"),
                    "retrieved date": ("retrieved date", "retrieval date"),
                    "decision": ("decision",),
                    "qualified owner": ("qualified owner", "owner"),
                    "next review": ("next review", "recheck trigger"),
                }
                for label, names in required_groups.items():
                    if not self.metadata_value(declaration, names):
                        self.add("JUR001", declaration.path, declaration.line, f"{identifier} is missing required field '{label}'", identifier)
                source_status = self.metadata_value(declaration, ("source status", "official source status")).lower().replace(" ", "-")
                if source_status and source_status not in SOURCE_STATES:
                    self.add("JUR002", declaration.path, declaration.line, f"{identifier} has invalid source status '{source_status}'", identifier)
            elif prefix == "XFER":
                required_groups = {
                    "trigger facts": ("trigger facts",),
                    "exporter role/location": ("exporter role location", "exporter"),
                    "importer role/location": ("importer role location", "importer"),
                    "data subjects/categories": ("data subjects categories", "data subjects"),
                    "purpose": ("purpose",),
                    "storage/remote access": ("storage remote access",),
                    "mechanism review": ("mechanism review", "mechanism status"),
                    "safeguards": ("safeguards",),
                    "onward transfers": ("onward transfers",),
                    "retention/deletion": ("retention deletion",),
                    "evidence": ("evidence",),
                    "owner": ("owner",),
                    "status": ("status",),
                }
                for label, names in required_groups.items():
                    if not self.metadata_value(declaration, names):
                        self.add("XFER001", declaration.path, declaration.line, f"{identifier} is missing required field '{label}'", identifier)
            elif prefix == "LOC":
                test_evidence = self.metadata_value(declaration, ("test evidence", "regional test coverage", "evidence"))
                if not re.search(r"\b(?:TEST|EVID)-[A-Z0-9-]+\b", test_evidence):
                    self.add("LOC001", declaration.path, declaration.line, f"{identifier} has no TEST-* or EVID-* regional test coverage", identifier)

    def run(self) -> List[Finding]:
        for path in self.files:
            self.scan_file(path)
        self.validate_declarations()
        self.validate_references()
        self.validate_tasks()
        self.validate_status_and_evidence()
        self.validate_context()
        self.validate_jurisdiction_transfer_locale()
        return sorted(set((item.code, item.path, item.line, item.message, item.identifier) for item in self.findings))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="Markdown specification pack root")
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args()
    root = args.root.expanduser().resolve()
    if not root.is_dir():
        parser.error(f"not a directory: {root}")

    validator = Validator(root)
    raw_findings = validator.run()
    findings = [Finding(code, path, line, message, identifier) for code, path, line, message, identifier in raw_findings]
    summary = {
        "files": len(validator.files),
        "declarations": len(validator.declarations),
        "tasks": sum(1 for identifier in validator.declarations if identifier.startswith("T-")),
        "findings": len(findings),
    }
    if args.format == "json":
        print(json.dumps({"version": 2, "ok": not findings, "summary": summary, "findings": [item.as_dict() for item in findings]}, indent=2, sort_keys=True))
    elif findings:
        for item in findings:
            identifier = f" [{item.identifier}]" if item.identifier else ""
            print(f"FAIL {item.code} {item.path}:{item.line}{identifier} {item.message}")
        print(f"FAIL files={summary['files']} declarations={summary['declarations']} tasks={summary['tasks']} findings={summary['findings']}")
    else:
        print(f"PASS files={summary['files']} declarations={summary['declarations']} tasks={summary['tasks']} findings=0")
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())

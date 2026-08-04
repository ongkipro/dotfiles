#!/usr/bin/env python3
"""Safely initialize a flat, linked development specification pack.

The command is deliberately dependency-free and portable across Linux and macOS.
It copies only selected reference templates and never overwrites by default.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


TEMPLATE_DIR = Path(__file__).resolve().parents[1] / "assets" / "templates"

ARTIFACTS = {
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

OVERLAY_ALIASES = {"personal-data": "privacy", "cross-border": "privacy"}


def selected(profile: str, overlays: set[str]) -> list[str]:
    if profile == "saas":
        profile = "platform"
        overlays |= {"multi-tenant", "iam"}

    names = {"prd"}
    if profile in {"product", "platform"}:
        names |= {"technical-design", "architecture", "data-model", "iam", "security", "delivery", "observability"}
    if profile == "platform":
        names |= {"brd", "multi-tenant", "custom-domain", "public-api", "localized-ui", "commerce", "privacy", "high-availability"}

    for overlay in overlays:
        names.add(OVERLAY_ALIASES.get(overlay, overlay))
        if overlay in {"identity", "ai-system", "extension-plugin", "mobile-desktop", "data-analytics"}:
            names.add({"identity": "iam", "ai-system": "security", "extension-plugin": "technical-design", "mobile-desktop": "technical-design", "data-analytics": "data-model"}[overlay])
        if overlay in {"cross-border", "regulated-sector", "ai-system", "commerce"}:
            names |= {"security", "privacy"}
        if overlay == "regulated-sector":
            names |= {"brd", "high-availability", "delivery"}
        if overlay == "high-availability":
            names |= {"architecture", "delivery", "observability"}
        if overlay == "localized-ui":
            names |= {"localized-ui"}

    return [name for name in ARTIFACTS if name in names]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--profile", choices=("lean", "product", "platform", "saas"), required=True)
    parser.add_argument("--overlay", default="", help="comma-separated capability/jurisdiction overlays")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--update", action="store_true", help="replace existing files; review the diff before use")
    args = parser.parse_args()

    overlays = {x.strip() for x in args.overlay.split(",") if x.strip()}
    unknown = overlays - set(ARTIFACTS) - set(OVERLAY_ALIASES) - {"identity", "ai-system", "regulated-sector", "mobile-desktop", "extension-plugin", "data-analytics"}
    if unknown:
        parser.error("unknown overlay(s): " + ", ".join(sorted(unknown)))

    chosen = selected(args.profile, overlays)
    print(f"profile={args.profile} overlays={','.join(sorted(overlays)) or 'none'}")
    print("selected=" + ",".join(chosen))
    failures = 0
    for name in chosen:
        source_name, target_name = ARTIFACTS[name]
        source = TEMPLATE_DIR / source_name
        target = args.output / target_name
        if not source.is_file():
            print(f"ERROR missing template: {source}", file=sys.stderr)
            failures += 1
            continue
        if target.exists() and not args.update:
            print(f"SKIP existing: {target}")
            continue
        print(("DRY-RUN " if args.dry_run else "WRITE ") + str(target))
        if not args.dry_run:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())

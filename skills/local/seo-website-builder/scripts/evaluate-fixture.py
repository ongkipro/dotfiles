#!/usr/bin/env python3
"""Offline SEO skill trial: export raw artifacts, then grade the repaired files.

This is a fixture oracle, not a crawler, browser, Google inspection, or model
benchmark. The agent repairs only the exported copy; no network is used here.
"""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
import tempfile
import xml.etree.ElementTree as ET

URL = "https://northpine.example/services/appliance-repair/"
OLD_URL = "https://northpine.example/old-service/"
TITLE = "Home Appliance Repair in Springfield - North Pine Repairs"
DESCRIPTION = "Explore North Pine Repairs home appliance services in Springfield, with clear service information and contact details for local households."
WORKAROUND = '<script>document.querySelector(\'meta[name="robots"]\').remove();</script>'
HTML = f'''<!doctype html>
<html lang="en"><head><title>{TITLE}</title>
<meta name="description" content="{DESCRIPTION}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{OLD_URL}">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Service","name":"Home appliance repair","provider":{{"@type":"Organization","name":"North Pine Repairs"}}}}</script>
</head><body><h1>Home appliance repair in Springfield</h1>
<p>North Pine Repairs provides home appliance repair in Springfield.</p>
<a href="/contact/">Contact details</a></body></html>
'''


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.canonicals, self.robots, self.tokens = [], [], []
        self.title, self.description, self.scripts = "", "", []
        self.in_title = False
        self.in_schema = False
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "link" and "canonical" in values.get("rel", "").lower().split():
            self.canonicals.append(values.get("href"))
            return
        self.tokens.append((tag, sorted(attrs)))
        if tag == "meta" and values.get("name", "").lower() == "robots":
            self.robots.extend(values.get("content", "").lower().replace(",", " ").split())
        if tag == "meta" and values.get("name", "").lower() == "description":
            self.description = values.get("content", "")
        self.in_title = tag == "title" or self.in_title
        self.in_schema = tag == "script" and values.get("type") == "application/ld+json"

    def handle_endtag(self, tag):
        self.tokens.append(("/" + tag, []))
        if tag == "title":
            self.in_title = False
        if tag == "script":
            self.in_schema = False

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in {"link", "meta", "br", "hr", "img", "input"}:
            self.handle_endtag(tag)

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.scripts.append(json.loads(data))
        if data.strip():
            self.tokens.append(("text", " ".join(data.split())))


def export(directory: Path, case: str):
    baseline = directory.with_name(directory.name + ".baseline.json")
    if baseline.exists() or baseline.is_symlink():
        raise FileExistsError("baseline already exists; choose a fresh workspace")
    directory.mkdir(parents=True, exist_ok=False)
    files = {"index.html": HTML}
    if case == "indexability":
        files["index.html"] = HTML.replace('content="index, follow"', 'content="noindex, follow"').replace(
            "</head>", WORKAROUND + '</head>')
        files["account.html"] = '<meta name="robots" content="noindex"><h1>Account</h1><p>Private route; server authentication is outside this static fixture.</p>'
        files["robots.txt"] = "User-agent: *\nDisallow: /services/\nDisallow: /account/\n"
        files["sitemap.xml"] = f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{URL}</loc></url><url><loc>https://northpine.example/account/</loc></url></urlset>'
    for name, content in files.items():
        (directory / name).write_text(content)
    with baseline.open("x") as stream:
        json.dump({"case": case, "before": files}, stream, indent=2)
    print(f"Exported {case} fixture to {directory}; fictional .example data only")


def check(directory: Path):
    manifest = json.loads(directory.with_name(directory.name + ".baseline.json").read_text())
    before = manifest["before"]
    page = Page((directory / "index.html").read_text())
    errors = []
    if page.canonicals != [URL]:
        errors.append("public route needs exactly its intended canonical")
    if not 55 <= len(page.title) <= 70 or "|" in page.title or "—" in page.title:
        errors.append("fixture owner title convention violated")
    if not 120 <= len(page.description) <= 155:
        errors.append("fixture owner description convention violated")
    allowed = set(before)
    actual = {str(p.relative_to(directory)) for p in directory.rglob("*") if p.is_file()}
    if actual != allowed:
        errors.append("files were added/deleted outside the requested repair")
    if manifest["case"] == "canonical":
        if page.tokens != Page(before["index.html"]).tokens:
            errors.append("canonical-only repair changed other page semantics")
    else:
        if "noindex" in page.robots or "none" in page.robots:
            errors.append("initial HTML still excludes the public route")
        # Bounded fixture grammar, not a general robots parser. Preserve the
        # original wildcard group/restrictions and permit only its exact public
        # exception. Google uses specificity, so line order is irrelevant here.
        def directives(text):
            pairs = []
            for line in text.splitlines():
                line = line.split("#", 1)[0]
                if ":" in line:
                    key, value = line.split(":", 1)
                    pairs.append((key.strip().lower(), value.strip()))
            return pairs
        original = directives(before["robots.txt"])
        observed = directives((directory / "robots.txt").read_text())
        if not observed or observed[0] != ("user-agent", "*"):
            errors.append("fixture robots rules must follow the wildcard user-agent group")
        if sorted(pair for pair in observed if pair[0] != "allow") != sorted(original):
            errors.append("unrelated robots group/restrictions changed")
        if [pair[1] for pair in observed if pair[0] == "allow"] != ["/services/appliance-repair/"]:
            errors.append("robots needs only the specific public-route exception")
        private = Page((directory / "account.html").read_text())
        if "noindex" not in private.robots or (directory / "account.html").read_text() != before["account.html"]:
            errors.append("intentional private-page exclusion/content changed")
        sitemap = ET.fromstring((directory / "sitemap.xml").read_text())
        urls = [node.text for node in sitemap.iter() if node.tag.rsplit("}", 1)[-1] == "loc"]
        if urls != [URL]:
            errors.append("sitemap must retain the public canonical and exclude the private route")
        if page.title != TITLE or page.description != DESCRIPTION:
            errors.append("technical repair changed the accepted metadata copy")
        def public_content(text):
            parsed = Page(text.replace(WORKAROUND, ""))
            return [token for token in parsed.tokens
                    if not (token[0] == "meta" and dict(token[1]).get("name", "").lower() == "robots")]
        if public_content((directory / "index.html").read_text()) != public_content(before["index.html"]):
            errors.append("technical repair changed unrelated public content/schema/links")
    for error in errors:
        print("FAIL:", error)
    if not errors:
        print(f"PASS: {manifest['case']} raw-artifact acceptance; live indexing/browser/business outcomes unverified")
    return not errors


def self_test():
    with tempfile.TemporaryDirectory(prefix="seo-oracle-") as tmp:
        for case in ("canonical", "indexability"):
            directory = Path(tmp) / case
            export(directory, case)
            assert not check(directory), "oracle accepted defective raw artifacts"
            (directory / "index.html").write_text(HTML.replace(OLD_URL, URL))
            if case == "indexability":
                (directory / "robots.txt").write_text("User-agent: *\nDisallow: /services/\nDisallow: /account/\nAllow: /services/appliance-repair/\n")
                (directory / "sitemap.xml").write_text(f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{URL}</loc></url></urlset>')
            assert check(directory), "oracle rejected reference repair"
            if case == "canonical":
                (directory / "index.html").write_text(HTML.replace(OLD_URL, URL).replace(f'href="{URL}">', f'href="{URL}" />'))
                assert check(directory), "oracle rejected equivalent void-element syntax"
            else:
                robots = (directory / "robots.txt").read_text()
                rules = robots.replace("User-agent: *\n", "").replace("Allow: /services/appliance-repair/\n", "")
                (directory / "robots.txt").write_text("User-agent: *\nAllow: /services/appliance-repair/\n" + rules)
                assert check(directory), "oracle made Google's specific Allow depend on line order"
                (directory / "robots.txt").write_text("Allow: /services/appliance-repair/\n" + robots.replace("Allow: /services/appliance-repair/\n", ""))
                assert not check(directory), "oracle accepted a rule outside any user-agent group"
                (directory / "robots.txt").write_text(robots)
                (directory / "index.html").write_text(HTML.replace(OLD_URL, URL).replace("Home appliance repair in Springfield</h1>", "Unrelated content</h1>"))
                assert not check(directory), "oracle accepted unrelated public-content edits"
                (directory / "index.html").write_text(HTML.replace(OLD_URL, URL).replace('<script type="application/ld+json">', '<script type="text/plain">'))
                assert not check(directory), "oracle accepted removal of accepted structured data"
                (directory / "index.html").write_text(HTML.replace(OLD_URL, URL))
                (directory / "robots.txt").write_text("User-agent: *\nAllow: /\n")
                assert not check(directory), "oracle accepted unrelated crawl-policy expansion"
    print("Oracle self-test PASS; reference repairs are not agent trials")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["init", "check", "self-test"])
    parser.add_argument("directory", nargs="?", type=Path)
    parser.add_argument("--case", choices=["canonical", "indexability"], default="canonical")
    args = parser.parse_args()
    if args.action == "self-test":
        self_test()
        return 0
    if args.directory is None:
        parser.error("directory is required")
    if args.action == "init":
        export(args.directory, args.case)
        return 0
    return 0 if check(args.directory) else 1


if __name__ == "__main__":
    raise SystemExit(main())

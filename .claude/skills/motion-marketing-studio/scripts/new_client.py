#!/usr/bin/env python3
"""Scaffold an isolated client workspace: clients/<slug>/ with records, templates, client.json (delivery
settings) and its own copy of the brand-token Remotion engine (studio/). One client per workspace.
In a studio repo (hq/ exists, see init_studio.py) it also registers the client in hq/CLIENTS.csv and links
the shared engine install automatically.

Usage (from the working root, e.g. a git repo):
  python3 -I new_client.py <slug> --name "Client Name" [--sector restaurant] [--country CI] [--timezone Africa/Abidjan]
                           [--language fr] [--root .] [--link-node-modules /path/to/node_modules] [--install-agents] [--force]
  --link-node-modules  symlink an existing install (same pinned versions) instead of running npm install
  --install-agents     copy the mms-* agent definitions into <root>/.claude/agents/ (Claude Code; next session)
"""
import argparse, csv, json, os, re, shutil, sys
from datetime import date
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug"); ap.add_argument("--name", required=True)
    ap.add_argument("--root", default=".")
    ap.add_argument("--link-node-modules")
    ap.add_argument("--install-agents", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--sector", default="")
    ap.add_argument("--country", default="")
    ap.add_argument("--timezone", default="UTC")
    ap.add_argument("--language", default="en")
    a = ap.parse_args()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,40}", a.slug):
        sys.exit("slug: lowercase letters, digits and hyphens (e.g. sunrise-bakery or acme-clinic)")
    root = Path(a.root).resolve()
    ws = root / "clients" / a.slug
    if ws.exists() and not a.force:
        sys.exit(f"{ws} already exists (use --force to add missing files only)")
    ws.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    subs = {"{{CLIENT_NAME}}": a.name, "{{SLUG}}": a.slug, "{{DATE}}": today, "{{MODE}}": "TBD"}
    for src in (SKILL / "templates" / "workspace").rglob("*"):
        if src.is_dir():
            continue
        rel = src.relative_to(SKILL / "templates" / "workspace")
        dst = ws / (".gitignore" if rel.name == "gitignore.txt" else rel)
        if dst.exists():
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        text = src.read_text(encoding="utf-8")
        for k, v in subs.items():
            text = text.replace(k, v)
        dst.write_text(text, encoding="utf-8")
    for d in ("02_RESEARCH", "04_DIRECTIONS", "episodes", "deliverables", "analytics/raw", "renders"):
        (ws / d).mkdir(parents=True, exist_ok=True)
    studio = ws / "studio"
    if not studio.exists():
        shutil.copytree(SKILL / "engine", studio, ignore=shutil.ignore_patterns("node_modules", "out"))
        bj = studio / "src" / "brand" / "brand.json"
        bj.write_text(bj.read_text().replace('"name": "Your Brand"', f'"name": "{a.name}"'))
    cj = ws / "client.json"
    if not cj.exists():
        cj.write_text(json.dumps({
            "slug": a.slug, "name": a.name, "status": "onboarding", "sector": a.sector, "country": a.country,
            "timezone": a.timezone, "language": a.language, "platforms": [], "publish_slot": "", "cadence_per_week": 0,
            "approver": "", "publisher": "client", "drive_parent": None,
            "voice": {"mode": "TBD", "provider": "", "voice_id": "", "auto_generate_after_batch_approval": False},
            "regulated": None, "reviewer": "", "created": today}, indent=1, ensure_ascii=False) + "\n")
    shared = root / "hq" / "shared-engine" / "node_modules"
    link = a.link_node_modules or (str(shared) if (root / "hq" / "shared-engine").exists() else None)
    if link:
        nm = studio / "node_modules"
        if not nm.exists() and not nm.is_symlink():
            # relative link so the workspace survives a clone to another path
            nm.symlink_to(os.path.relpath(Path(link).absolute(), nm.parent), target_is_directory=True)
    roster = root / "hq" / "CLIENTS.csv"
    if roster.exists():
        rows = list(csv.reader(roster.open(newline="", encoding="utf-8")))
        if not any(r and r[0] == a.slug for r in rows[1:]):
            hdr = rows[0]
            vals = {"slug": a.slug, "name": a.name, "status": "onboarding", "sector": a.sector, "country": a.country,
                    "timezone": a.timezone, "language": a.language, "created": today}
            with roster.open("a", newline="", encoding="utf-8") as fh:
                csv.writer(fh, lineterminator="\n").writerow([vals.get(h, "") for h in hdr])
    if a.install_agents:
        dest = root / ".claude" / "agents"; dest.mkdir(parents=True, exist_ok=True)
        for f in (SKILL / "agents").glob("mms-*.md"):
            if not (dest / f.name).exists():
                shutil.copy2(f, dest / f.name)
    print(f"Workspace ready: {ws}")
    if link:
        print(f"Engine linked to {link} (run init_studio.py --setup if it is not installed yet).")
    else:
        print(f"Next (FULL mode): cd clients/{a.slug}/studio && npm install")
    print(f"Then: python3 -I env_check.py > clients/{a.slug}/00_ENV_CHECK.md and fill clients/{a.slug}/client.json")


if __name__ == "__main__":
    main()

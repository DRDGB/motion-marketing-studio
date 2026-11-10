#!/usr/bin/env python3
"""Turn the current repo into a multi-client studio (run once), or set up a fresh session (--setup).

Usage (from the repo root):
  python3 -I <skill>/scripts/init_studio.py --name "My Motion Studio"   # creates hq/, CLAUDE.md, README, .gitignore,
                                                                         # installs the skill + agents into .claude/
  python3 -I <skill>/scripts/init_studio.py --setup                      # fresh session: npm install in hq/shared-engine
                                                                         # and relink every client's studio/node_modules
Never overwrites existing files.
"""
import argparse, os, shutil, subprocess, sys
from datetime import date
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
CLIENT_COLS = "slug,name,status,sector,country,timezone,publish_slot,cadence_per_week,platforms,language,approver,drive_parent,created,notes"


def write_once(p: Path, text: str):
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")


def setup(root: Path):
    eng = root / "hq" / "shared-engine"
    if not (eng / "package.json").exists():
        sys.exit("hq/shared-engine/package.json missing: run init_studio.py --name ... first")
    if not (eng / "node_modules").exists():
        print("Installing shared engine dependencies (one time per session, ~1 GB)...", flush=True)
        r = subprocess.run(["npm", "install", "--no-audit", "--no-fund"], cwd=eng)
        if r.returncode:
            sys.exit("npm install failed (check network access to registry.npmjs.org)")
    n = 0
    for st in sorted((root / "clients").glob("*/studio")):
        nm = st / "node_modules"
        if nm.is_symlink() and not nm.exists():
            nm.unlink()
        if not nm.exists():
            nm.symlink_to(os.path.relpath((eng / "node_modules").absolute(), nm.parent), target_is_directory=True)
            n += 1
    print(f"Shared engine ready; linked {n} client workspace(s).")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", help="studio name (first run)")
    ap.add_argument("--root", default=".")
    ap.add_argument("--setup", action="store_true")
    a = ap.parse_args()
    root = Path(a.root).resolve()
    if a.setup:
        setup(root); return
    if not a.name:
        sys.exit("first run needs --name \"Studio Name\" (or use --setup in a fresh session)")
    dest_skill = root / ".claude" / "skills" / "motion-marketing-studio"
    if SKILL != dest_skill and not dest_skill.exists():
        shutil.copytree(SKILL, dest_skill, ignore=shutil.ignore_patterns("node_modules", "__pycache__"))
        print(f"Installed skill into {dest_skill}")
    agents = root / ".claude" / "agents"; agents.mkdir(parents=True, exist_ok=True)
    for f in (SKILL / "agents").glob("mms-*.md"):
        if not (agents / f.name).exists():
            shutil.copy2(f, agents / f.name)
    subs = {"{{STUDIO_NAME}}": a.name}
    for name, out in (("CLAUDE.md", "CLAUDE.md"), ("README.md", "README.md"), ("gitignore.txt", ".gitignore")):
        t = (SKILL / "templates" / "studio" / name).read_text()
        for k, v in subs.items():
            t = t.replace(k, v)
        write_once(root / out, t)
    write_once(root / "hq" / "CLIENTS.csv", CLIENT_COLS + "\n")
    write_once(root / "hq" / "DISPATCH_LOG.md", f"# Dispatch log: {a.name}\n\n| UTC | Client | Item | Result |\n|---|---|---|---|\n| {date.today().isoformat()} | hq | - | studio created |\n")
    eng = root / "hq" / "shared-engine"; eng.mkdir(parents=True, exist_ok=True)
    write_once(eng / "package.json", (SKILL / "engine" / "package.json").read_text())
    write_once(eng / "README.md", "Shared dependencies for every client's studio/ (linked as node_modules). Install: init_studio.py --setup\n")
    (root / "clients").mkdir(exist_ok=True)
    print(f"Studio '{a.name}' ready at {root}. Next: init_studio.py --setup, then new_client.py <slug> --name ...")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Studio-wide isolation check: no client folder references another client; each client has its own brand
tokens and its own Drive folder; roster and client.json agree; every workspace validates.
Usage (from the studio repo root): python3 -I check_isolation.py     (exit 1 on any problem; run before push)
"""
import csv, json, re, subprocess, sys
from pathlib import Path

ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent
TEXT = {".md", ".csv", ".json", ".ts", ".tsx", ".txt", ".srt"}


def main():
    ws = sorted(p.parent for p in (ROOT / "clients").glob("*/client.json"))
    errs, warns = [], []
    info = {}
    for w in ws:
        c = json.loads((w / "client.json").read_text())
        info[w.name] = c
        if c.get("slug") != w.name:
            errs.append(f"{w.name}: client.json slug is '{c.get('slug')}'")
        bj = w / "studio" / "src" / "brand" / "brand.json"
        if bj.exists():
            b = json.loads(bj.read_text())
            if b.get("name") != c.get("name"):
                warns.append(f"{w.name}: brand.json name '{b.get('name')}' differs from client name '{c.get('name')}'")
    drives = {}
    for slug, c in info.items():
        d = c.get("drive_parent")
        if d:
            if d in drives:
                errs.append(f"{slug} and {drives[d]} share the same Drive folder {d}")
            drives[d] = slug
    roster = ROOT / "hq" / "CLIENTS.csv"
    if roster.exists():
        listed = {r["slug"] for r in csv.DictReader(roster.open(newline="", encoding="utf-8")) if r.get("slug")}
        for s in set(info) - listed:
            errs.append(f"{s}: folder exists but is not in hq/CLIENTS.csv")
        for s in listed - set(info):
            warns.append(f"{s}: in hq/CLIENTS.csv but clients/{s}/client.json is missing")
    for slug in info:
        others = [(o, info[o].get("name", "")) for o in info if o != slug]
        pats = [(o, re.compile(rf"clients/{re.escape(o)}\b")) for o, _ in others]
        pats += [(o, re.compile(re.escape(n), re.I)) for o, n in others if n and len(n) >= 5]
        for f in (ROOT / "clients" / slug).rglob("*"):
            if f.is_file() and f.suffix in TEXT and "node_modules" not in f.parts and f.stat().st_size < 2_000_000:
                t = f.read_text(errors="ignore")
                for o, p in pats:
                    if p.search(t):
                        errs.append(f"{f.relative_to(ROOT)} mentions client '{o}'")
                        break
    for w in ws:
        r = subprocess.run([sys.executable, "-I", str(HERE / "validate_workspace.py"), str(w)], capture_output=True, text=True)
        if r.returncode:
            errs.append(f"{w.name}: " + " | ".join(l.strip(" -") for l in r.stdout.splitlines()[1:]))
    print(f"ISOLATION CHECK: {'PASSED' if not errs else 'FAILED'} ({len(ws)} clients)")
    for e in errs:
        print(" ERROR", e)
    for x in warns:
        print(" warn ", x)
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()

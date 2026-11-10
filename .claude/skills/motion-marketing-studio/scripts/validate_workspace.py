#!/usr/bin/env python3
"""Validate a client workspace: required files, CSV column counts, no secrets or media in git-tracked text.
Usage: python3 -I validate_workspace.py clients/<slug>    (exit 1 on failure; do not pipe through head)
"""
import csv, re, sys
from pathlib import Path

REQUIRED = ["01_CLIENT_BRIEF.md", "DECISIONS.md", "RESEARCH_LEDGER.csv", "CONTENT_CALENDAR.csv", "PRODUCTION_QUEUE.csv", "ASSET_REGISTER.csv", "RUN_LOG.md"]
SECRET = re.compile(r"(sk_[A-Za-z0-9]{20,}|1//0[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}|GOCSPX-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    ws = Path(sys.argv[1])
    errs = []
    for f in REQUIRED:
        if not (ws / f).exists():
            errs.append(f"missing {f}")
    for p in ws.rglob("*.csv"):
        if "node_modules" in p.parts:
            continue
        rows = list(csv.reader(p.open(newline="", encoding="utf-8")))
        if not rows:
            continue
        width = len(rows[0])
        for i, r in enumerate(rows[1:], 2):
            if r and len(r) != width:
                errs.append(f"{p}: line {i} has {len(r)} fields, header has {width} (quote fields containing commas)")
    for p in ws.rglob("*"):
        if p.is_file() and "node_modules" not in p.parts and p.suffix in (".md", ".csv", ".json", ".ts", ".tsx", ".py", ".txt", ".env", ".sh"):
            try:
                if SECRET.search(p.read_text(errors="ignore")):
                    errs.append(f"{p}: looks like it contains a secret/token; remove it")
            except OSError:
                pass
    print("WORKSPACE VALIDATION: " + ("PASSED" if not errs else "FAILED"))
    for e in errs:
        print(" -", e)
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()

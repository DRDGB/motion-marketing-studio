#!/usr/bin/env python3
"""Studio dispatcher: look across every active client and decide the ONE next job, or report the state.

Usage (from the studio repo root):
  python3 -I dispatch.py            # prints one JSON job: {"action": "build"|"voice"|"idle", ...}
  python3 -I dispatch.py --report   # table: per client, items by state, next publish date, blockers
Rules (references/12_studio.md):
  - only clients with status "active" in hq/CLIENTS.csv (or client.json)
  - "build": a queue item in state VOICE_READY (most urgent publish date first, then roster order)
  - "voice": a COMPLIANCE_OK item whose client.json allows auto voice generation after batch approval
  - items with a non-empty blocker are skipped and listed in --report
"""
import csv, json, sys
from datetime import date, datetime
from pathlib import Path

ROOT = Path.cwd()


def parse_date(s):
    s = (s or "").strip()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            pass
    return date.max


def clients():
    roster = ROOT / "hq" / "CLIENTS.csv"
    out = []
    if roster.exists():
        for i, r in enumerate(csv.DictReader(roster.open(newline="", encoding="utf-8"))):
            out.append((i, r.get("slug", ""), r.get("status", "")))
    else:
        for i, d in enumerate(sorted((ROOT / "clients").glob("*/client.json"))):
            c = json.loads(d.read_text())
            out.append((i, c["slug"], c.get("status", "")))
    return out


def queue(slug):
    q = ROOT / "clients" / slug / "PRODUCTION_QUEUE.csv"
    return list(csv.DictReader(q.open(newline="", encoding="utf-8"))) if q.exists() else []


def cfg(slug):
    p = ROOT / "clients" / slug / "client.json"
    return json.loads(p.read_text()) if p.exists() else {}


def main():
    report = "--report" in sys.argv
    jobs, rows = [], []
    for order, slug, status in clients():
        items = queue(slug)
        c = cfg(slug)
        counts = {}
        for it in items:
            counts[it.get("state", "?")] = counts.get(it.get("state", "?"), 0) + 1
        blocked = [f"{it.get('content_id')}: {it.get('blocker')}" for it in items if it.get("blocker")]
        upcoming = sorted((parse_date(it.get("publish_date")), it.get("content_id")) for it in items if it.get("state") not in ("PUBLISHED_BY_CLIENT",))
        rows.append((slug, status, counts, upcoming[0] if upcoming else None, blocked))
        if status != "active":
            continue
        auto_voice = bool(c.get("voice", {}).get("auto_generate_after_batch_approval"))
        for it in items:
            if it.get("blocker"):
                continue
            st = it.get("state")
            if st == "VOICE_READY":
                jobs.append((parse_date(it.get("publish_date")), 0, order, "build", slug, it))
            elif st == "COMPLIANCE_OK" and auto_voice:
                jobs.append((parse_date(it.get("publish_date")), 1, order, "voice", slug, it))
    if report:
        print("| Client | Status | Queue by state | Next publish | Blocked |\n|---|---|---|---|---|")
        for slug, status, counts, nxt, blocked in rows:
            q = ", ".join(f"{k} {v}" for k, v in sorted(counts.items())) or "empty"
            n = f"{nxt[0]} {nxt[1]}" if nxt and nxt[0] != date.max else "-"
            print(f"| {slug} | {status} | {q} | {n} | {'; '.join(blocked) or '-'} |")
        return
    if not jobs:
        print(json.dumps({"action": "idle", "reason": "no active client has a VOICE_READY item (or approved auto-voice item)"}))
        return
    jobs.sort(key=lambda j: (j[0], j[1], j[2]))
    d, _, _, action, slug, it = jobs[0]
    print(json.dumps({"action": action, "client": slug, "workspace": f"clients/{slug}", "content_id": it.get("content_id"),
                      "title": it.get("title"), "publish_date": it.get("publish_date"), "state": it.get("state"),
                      "drive_parent": cfg(slug).get("drive_parent")}, ensure_ascii=False))


if __name__ == "__main__":
    main()

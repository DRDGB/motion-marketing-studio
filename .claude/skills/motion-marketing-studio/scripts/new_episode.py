#!/usr/bin/env python3
"""Create a new video in the current client workspace and register its composition.
Run from the workspace root (clients/<slug>/):
  python3 -I new_episode.py <ID> [--title "Working title"]
ID: uppercase letters/digits/underscores, e.g. E001_STORAGE_HEAT. The Remotion composition id is the same
with '-' instead of '_' (E001-STORAGE-HEAT), because composition ids cannot contain underscores.
Creates episodes/<ID>/ (SCRIPT_AND_VOICE.md, source/), studio/src/episodes/<ID>/ (<ID>.tsx rough cut,
timeline.json if missing, words.json if missing), studio/public/episodes/<ID>/, and registers <ID> in
studio/src/episodes/index.ts. Safe to re-run (never overwrites existing files).
"""
import argparse, json, re, sys
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id"); ap.add_argument("--title", default="Working title")
    a = ap.parse_args()
    if not re.fullmatch(r"[A-Z][A-Z0-9_]{1,40}", a.id):
        sys.exit("ID must be UPPERCASE letters/digits/underscores, starting with a letter (e.g. E001_STORAGE_HEAT)")
    ws = Path.cwd()
    if not (ws / "studio" / "src" / "episodes" / "index.ts").exists():
        sys.exit("run from the client workspace root (studio/src/episodes/index.ts not found)")
    ep = ws / "episodes" / a.id; (ep / "source").mkdir(parents=True, exist_ok=True)
    sv = ep / "SCRIPT_AND_VOICE.md"
    if not sv.exists():
        sv.write_text((SKILL / "templates" / "episode" / "SCRIPT_AND_VOICE.md").read_text().replace("{{ID}}", a.id).replace("{{TITLE}}", a.title))
    src = ws / "studio" / "src" / "episodes" / a.id; src.mkdir(parents=True, exist_ok=True)
    (ws / "studio" / "public" / "episodes" / a.id).mkdir(parents=True, exist_ok=True)
    tl = src / "timeline.json"
    if not tl.exists():
        tl.write_text(json.dumps({"id": a.id, "fps": 30, "total": 12, "voSource": f"episodes/{a.id}/source/VO_{a.id}_FULL.mp3",
                                  "clips": [{"id": "L01", "src": [0.0, 2.0], "at": 0.3, "text": "Replace with the first spoken line."}],
                                  "music": {"bpm": 96, "transpose": 0, "mech": [3, 6], "drop": [6, 6.5], "resolve": [6.5, 8], "loop": [8, 9], "end": 9},
                                  "sfx": []}, indent=1) + "\n")
    wj = src / "words.json"
    if not wj.exists():
        wj.write_text(json.dumps([{"clip": "L01", "w": "Replace", "t": 0.3}]))
    comp = src / f"{a.id}.tsx"
    if not comp.exists():
        comp.write_text((SKILL / "engine" / "templates" / "Episode.tsx.tmpl").read_text().replace("__ID__", a.id))
    comp_id = a.id.replace("_", "-")  # Remotion composition ids allow a-z, A-Z, 0-9 and "-" only
    reg = ws / "studio" / "src" / "episodes" / "index.ts"
    r = reg.read_text()
    imp = f'import {{ {a.id}, {a.id}_FRAMES }} from "./{a.id}/{a.id}";'
    if imp not in r:
        r = r.replace("// @mms-imports", imp + "\n// @mms-imports")
        r = r.replace("  // @mms-entries", f'  {{ id: "{comp_id}", component: {a.id}, frames: {a.id}_FRAMES }},\n  // @mms-entries')
        reg.write_text(r)
    print(f"Episode {a.id} ready: episodes/{a.id}/ and studio/src/episodes/{a.id}/{a.id}.tsx (registered as composition '{comp_id}')")
    print(f"Render: cd studio && npx remotion render src/index.ts {comp_id} ../renders/{a.id}/{a.id}_v1.mp4 --codec=h264 --crf=17 --audio-codec=aac --audio-bitrate=256k")


if __name__ == "__main__":
    main()

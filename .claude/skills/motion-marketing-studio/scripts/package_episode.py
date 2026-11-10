#!/usr/bin/env python3
"""Build the ready-to-post package for one video: POST.md (from the script's '## Package' section),
SRT (from the timeline), cover PNG (Remotion still), MP4 copy + md5. Optional Drive upload.

Usage (from the client workspace root):
  python3 -I package_episode.py --ws . --id E001_SLUG --script episodes/E001_SLUG/SCRIPT_AND_VOICE.md \
     --timeline studio/src/episodes/E001_SLUG/timeline.json --mp4 renders/E001_SLUG/E001_SLUG_v1.mp4 \
     --thumb 1.6 --date 14-11-2026 --slot "18:30 Africa/Abidjan" --slug short-slug [--lang en] \
     [--upload [--drive-parent <folderId>]]   (default: drive_parent from client.json)
"""
import argparse, hashlib, json, re, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ws", default=".")
    for k in ("id", "script", "timeline", "mp4", "date", "slug"):
        ap.add_argument(f"--{k}", required=True)
    ap.add_argument("--thumb", type=float, default=1.5)
    ap.add_argument("--slot", default="")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--upload", action="store_true")
    ap.add_argument("--drive-parent")
    a = ap.parse_args()
    ws = Path(a.ws).resolve()
    out = ws / "deliverables" / a.id; out.mkdir(parents=True, exist_ok=True)
    tl = json.loads((ws / a.timeline).read_text())
    fps = tl.get("fps", 30)
    srt = []
    for i, c in enumerate(tl["clips"], 1):
        st = c["at"]; en = st + (c["src"][1] - c["src"][0]) + 0.15
        srt.append(f"{i}\n{ts(st)} --> {ts(en)}\n{re.sub(r'\[[^]]*\]', '', c['text']).strip()}\n")
    srt_p = out / f"{a.id}.{a.lang}.srt"; srt_p.write_text("\n".join(srt))
    s = (ws / a.script).read_text()
    m = re.search(r"^## Package[^\n]*\n(.*)", s, re.S | re.M)
    pkg = m.group(1).strip() if m else "(package section missing in script)"
    title = s.splitlines()[0].lstrip("# ").strip()
    mp4 = ws / a.mp4
    post = f"# POST: {title}\n\n**Publish:** {a.date}{' at ' + a.slot if a.slot else ''}\n**Video:** {mp4.name}\n**Cover frame:** {a.thumb} s\n\n{pkg}\n"
    post_p = out / "POST.md"; post_p.write_text(post)
    cover_p = out / f"{a.id}_cover.png"
    r = subprocess.run(["npx", "remotion", "still", "src/index.ts", a.id.replace("_", "-"), str(cover_p), f"--frame={round(a.thumb * fps)}", "--log=error"],
                       cwd=ws / "studio", capture_output=True, text=True)
    if r.returncode:
        sys.exit("cover render failed: " + r.stderr[-600:])
    final_mp4 = out / mp4.name
    shutil.copy2(mp4, final_mp4)
    md5 = hashlib.md5(final_mp4.read_bytes()).hexdigest()
    result = {"mp4": str(final_mp4.relative_to(ws)), "md5": md5, "post": str(post_p.relative_to(ws)),
              "srt": str(srt_p.relative_to(ws)), "cover": str(cover_p.relative_to(ws)), "drive": []}
    if a.upload:
        if not a.drive_parent:
            cj = ws / "client.json"
            a.drive_parent = json.loads(cj.read_text()).get("drive_parent") if cj.exists() else None
        if not a.drive_parent:
            sys.exit("--upload needs --drive-parent <folderId> (or drive_parent in client.json)")
        folder = f"{a.date}_{a.id.split('_')[0]}_{a.slug}"
        u = subprocess.run([sys.executable, "-I", str(HERE / "drive_upload.py"), "--parent", a.drive_parent, "--subfolder", folder,
                            str(final_mp4), str(post_p), str(srt_p), str(cover_p)], capture_output=True, text=True)
        if u.returncode:
            sys.exit("drive upload failed: " + u.stderr[-400:] + u.stdout[-400:])
        for line in u.stdout.splitlines():
            if line.startswith("{"):
                d = json.loads(line); result["drive"].append({"name": Path(d["file"]).name, "md5": d["md5"], "link": d["link"]})
        result["md5_match"] = {x["name"]: x["md5"] for x in result["drive"]}.get(final_mp4.name) == md5
        result["folder"] = folder
    print(json.dumps(result, indent=1))


if __name__ == "__main__":
    main()

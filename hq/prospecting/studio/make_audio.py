#!/usr/bin/env python3
"""Original music bed per prospect film (own work, composed in code by the skill's music_bed.py), then mux.
Usage (from this folder, after ./render_all.sh): python3 -I make_audio.py [ID ...]
Writes ../renders/audio/<ID>.wav and the final ../renders/<ID>.mp4 (picture + music, ~-16 LUFS). Nothing is committed.
"""
import json, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BED = HERE.parents[2] / ".claude/skills/motion-marketing-studio/scripts/music_bed.py"
R = HERE.parent / "renders"
# id: (total s, switch s = the reveal beat, end-card start s, bpm, transpose)
FILMS = {
    "SPEC-LBF": (24.0, 9.9, 21.0, 92, 0),
    "SPEC-ANTIKA": (27.0, 10.8, 24.0, 104, 3),
    "SPEC-MAKENA": (25.0, 5.1, 22.0, 72, -2),
    "SPEC-MARIACILE": (26.5, 7.8, 23.4, 88, 2),
    "SPEC-AYES": (26.0, 11.4, 22.6, 90, 0),
    "SPEC-AKABASELE": (23.5, 10.8, 20.4, 94, -3),
    "SPEC-MIA": (23.0, 10.0, 19.4, 100, 1),
    "SPEC-CLOCHETTE": (24.0, 12.2, 20.8, 100, 4),
    "SPEC-AHLAM": (25.0, 16.2, 22.0, 108, 5),
    "SPEC-FIVE": (24.5, 4.8, 21.0, 84, -1),
}

for fid in sys.argv[1:] or FILMS:
    total, sw, end, bpm, tr = FILMS[fid]
    tl = {"total": total, "music": {"bpm": bpm, "transpose": tr, "mech": [min(2.5, sw - 1.6), sw - 1.0], "drop": [sw - 1.0, sw],
                                     "resolve": [sw, end - 0.6], "loop": [end - 0.6, end], "end": end}}
    (R / "audio").mkdir(parents=True, exist_ok=True)
    tlp, wav = R / "audio" / f"{fid}.timeline.json", R / "audio" / f"{fid}.wav"
    tlp.write_text(json.dumps(tl))
    subprocess.run([sys.executable, "-I", str(BED), str(tlp), str(wav)], check=True)
    pic, out = R / "picture" / f"{fid}.mp4", R / f"{fid}.mp4"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(pic), "-i", str(wav), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", str(out)], check=True)
    print("final", out)

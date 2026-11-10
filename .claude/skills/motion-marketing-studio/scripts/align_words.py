#!/usr/bin/env python3
"""Approximate word onsets without a speech model.
For each timeline clip: detect speech frames (RMS > threshold) in the source read, then spread the
clip's words over the *speech* time in proportion to estimated syllables, skipping pauses.
Accuracy target: ~±0.15 s, good enough for word-by-word kinetic reveals.
Usage (from the client workspace root): python3 -I align_words.py <timeline.json> <words.json>
voSource in the timeline is resolved relative to the current directory (the workspace root).
"""
import json, re, subprocess
from pathlib import Path
import numpy as np

import sys
if len(sys.argv) < 3:
    sys.exit(__doc__)
ROOT = Path.cwd()
TLP = Path(sys.argv[1]); OUTP = Path(sys.argv[2])
TL = json.loads(TLP.read_text())
SR = 16000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / TL["voSource"]), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
HOP = 160  # 10 ms
rms = np.sqrt(np.convolve(x ** 2, np.ones(HOP * 2) / (HOP * 2), mode="same")[::HOP] + 1e-12)
db = 20 * np.log10(rms)

def syllables(w: str) -> float:
    w = re.sub(r"[^a-z]", "", w.lower())
    if not w:
        return 0.5
    n = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and n > 1 and not w.endswith("le"):
        n -= 1
    return max(1, n) + 0.15 * len(w) / 6  # small length bias

out = []
for c in TL["clips"]:
    s, e = c["src"]
    i0, i1 = int(s * 100), int(e * 100)
    seg = db[i0:i1]
    speech = seg > -38
    # cumulative speech time (seconds) at each 10ms frame
    cum = np.cumsum(speech) * 0.01
    total = cum[-1] if len(cum) else 0
    words = re.sub(r"[\[\]]", "", c["text"]).split()
    weights = np.array([syllables(w) for w in words])
    starts = np.concatenate([[0], np.cumsum(weights)[:-1]]) / weights.sum() * total
    # pauses inside the clip: runs of >=12 frames (120 ms) below -40 dB -> pause END times (src seconds)
    quiet = seg < -40
    pause_ends, run = [], 0
    for k, q in enumerate(quiet):
        if q:
            run += 1
        else:
            if run >= 12 and k - run > 5:
                pause_ends.append(s + k * 0.01)
            run = 0
    prev_t = None
    for idx, (w, st) in enumerate(zip(words, starts)):
        k = int(np.searchsorted(cum, st + 1e-6))  # first frame where speech-time reaches st
        t_src = s + k * 0.01
        # snap: a word following punctuation starts at the nearest pause end (within 0.5 s)
        if idx > 0 and re.search(r"[,.:;…?!]$", words[idx - 1]) and pause_ends:
            cand = min(pause_ends, key=lambda pe: abs(pe - t_src))
            if abs(cand - t_src) <= 0.5 and (prev_t is None or cand > prev_t + 0.05):
                t_src = cand
        if prev_t is not None and t_src <= prev_t + 0.06:
            t_src = prev_t + 0.06
        prev_t = t_src
        out.append({"clip": c["id"], "w": w, "t": round(c["at"] + (t_src - s), 3)})
OUTP.write_text(json.dumps(out, indent=1))
for c in TL["clips"]:
    ws = [f"{o['w']}@{o['t']:.2f}" for o in out if o["clip"] == c["id"]]
    print(c["id"], " ".join(ws))

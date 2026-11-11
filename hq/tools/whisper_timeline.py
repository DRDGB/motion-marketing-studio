#!/usr/bin/env python3
"""Voice → timeline.json + words.json using speech-to-text word timestamps (faster-whisper).

The script's paste block (## Voice) defines the lines and the exact words shown on screen; whisper only
supplies WHEN each word is said. Script words are aligned to recognised words (difflib on normalised
tokens); unmatched script words are interpolated between their matched neighbours.

Usage (from the client workspace root, clients/<slug>/):
  python3 -I ../../hq/tools/whisper_timeline.py <EPISODE_DIR_NAME> [--lead 0.3] [--max-gap 0.75] [--end-card 4.0]
      [--dark L08,L09] [--lang en]
Writes studio/src/episodes/<ID>/timeline.json (clips with src/at/text, total, voSource, music skeleton)
and studio/src/episodes/<ID>/words.json ({clip, w, t} in VIDEO time). Long pauses between lines are
tightened to --max-gap by shifting `at` (src ranges stay true to the voice file).
"""
import argparse, difflib, json, re, subprocess, sys
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("ep"); ap.add_argument("--lead", type=float, default=0.3); ap.add_argument("--max-gap", type=float, default=0.75)
ap.add_argument("--end-card", type=float, default=4.0); ap.add_argument("--dark", default=""); ap.add_argument("--lang", default="en")
ap.add_argument("--vo", default=None)
a = ap.parse_args()
ws = Path.cwd(); ep = ws / "episodes" / a.ep
md = (ep / "SCRIPT_AND_VOICE.md").read_text(encoding="utf-8")
m = re.search(r"^##\s+Voice\s*$", md, re.M)
block = re.search(r"```[^\n]*\n(.*?)```", md[m.end():], re.S).group(1).strip()
lines = []
for raw in block.splitlines():
    t = re.sub(r"\[[^\]]*\]", "", raw).replace("|", "").strip()
    if t:
        lines.append(re.sub(r"\s+", " ", t))
vo = (ws / a.vo).resolve() if a.vo else next((ep / "source").glob("VO_*_FULL.*"))

import numpy as np
from faster_whisper import WhisperModel
rawpcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(vo), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(rawpcm, dtype=np.int16).astype(np.float32) / 32768.0
model = WhisperModel("base", device="cpu", compute_type="int8")
segs, _ = model.transcribe(audio, language=a.lang, word_timestamps=True, beam_size=5)
rec = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]

norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower().replace("’", "'"))
# expand script words; spelled acronyms like W-H-O are one script word but several spoken tokens
script = []  # (line_idx, display_word, [norm tokens])
for li, ln in enumerate(lines):
    for w in ln.split():
        toks = [norm(x) for x in re.split(r"-", w) if norm(x)] if re.fullmatch(r"(?:[A-Za-z]-)+[A-Za-z][^A-Za-z]*", w) else [norm(w)]
        script.append((li, w, toks or [""]))
flat_s = [(i, t) for i, (_, _, toks) in enumerate(script) for t in toks]
flat_r = [norm(w) for w, _, _ in rec]
sm = difflib.SequenceMatcher(None, [t for _, t in flat_s], flat_r, autojunk=False)
start = [None] * len(script); end = [None] * len(script); ridx = [None] * len(script)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        si = flat_s[blk.a + k][0]; r = rec[blk.b + k]
        start[si] = r[1] if start[si] is None else min(start[si], r[1])
        end[si] = r[2] if end[si] is None else max(end[si], r[2])
        ridx[si] = blk.b + k if ridx[si] is None else ridx[si]
# fuzzy pass: an unmatched script word takes the most similar recognised word (ratio >= 0.6) lying between its
# matched neighbours, preferring the one closest to the next matched word (handles "Emeca"/"Emeka", stage text read aloud)
for i in range(len(script)):
    if start[i] is not None: continue
    p_ = max((k for k in range(i) if ridx[k] is not None), default=None); n_ = min((k for k in range(i + 1, len(script)) if ridx[k] is not None), default=None)
    lo = ridx[p_] + 1 if p_ is not None else 0; hi = ridx[n_] if n_ is not None else len(rec)
    target = "".join(script[i][2]); best = None
    for j in range(lo, hi):
        r_ = difflib.SequenceMatcher(None, target, norm(rec[j][0])).ratio()
        if r_ >= 0.6 and (best is None or r_ > best[0] + 0.05 or (abs(r_ - best[0]) <= 0.05 and j > best[1])): best = (r_, j)
    if best:
        j = best[1]; start[i], end[i], ridx[i] = rec[j][1], rec[j][2], j
# acronyms are often recognised as one token ("WHO", "GMP", "CDSCO"): match the joined letters
for i, (_, w, toks) in enumerate(script):
    if start[i] is None and len(toks) > 1:
        joined = "".join(toks)
        for wr, s0, e0 in rec:
            if norm(wr) == joined and not any(start[j] == s0 for j in range(len(script)) if j != i):
                start[i], end[i] = s0, e0; break
# interpolate gaps
known = [i for i in range(len(script)) if start[i] is not None]
if not known:
    sys.exit("no words aligned")
for i in range(len(script)):
    if start[i] is None:
        prv = max((k for k in known if k < i), default=None); nxt = min((k for k in known if k > i), default=None)
        if prv is None: start[i] = end[i] = start[nxt] - 0.25 * (nxt - i)
        elif nxt is None: start[i] = end[i] = end[prv] + 0.25 * (i - prv)
        else:
            frac = (i - prv) / (nxt - prv); start[i] = end[prv] + (start[nxt] - end[prv]) * frac; end[i] = start[i] + 0.15
matched = len(known) / len(script)

dark = {x.strip() for x in a.dark.split(",") if x.strip()}
clips, words_out = [], []
_first = [i for i, s_ in enumerate(script) if s_[0] == 0]
shift = a.lead - max(0.0, start[_first[0]] - 0.08)  # first line starts at --lead seconds
prev_end_src = None
for li, ln in enumerate(lines):
    idx = [i for i, s in enumerate(script) if s[0] == li]
    s0 = round(max(0.0, start[idx[0]] - 0.08), 3); e0 = round(end[idx[-1]] + 0.12, 3)
    if prev_end_src is not None:
        gap = s0 - prev_end_src
        if gap > a.max_gap:
            shift -= gap - a.max_gap
    at = round(s0 + shift, 3)
    cid = f"L{li + 1:02d}"
    c = {"id": cid, "src": [s0, e0], "at": at, "text": ln}
    if cid in dark: c["world"] = "dark"
    clips.append(c)
    for i in idx:
        words_out.append({"clip": cid, "w": script[i][1], "t": round(start[i] + shift, 3)})
    prev_end_src = e0
last = clips[-1]
speech_end = last["at"] + (last["src"][1] - last["src"][0])
total = round(speech_end + a.end_card, 2)
tl_path = ws / "studio" / "src" / "episodes" / a.ep / "timeline.json"
tl = json.loads(tl_path.read_text()) if tl_path.exists() else {}
tl.update({"id": a.ep, "fps": 30, "total": total, "voSource": str(vo.relative_to(ws)), "clips": clips,
           "note": f"Line map from faster-whisper word timestamps (hq/tools/whisper_timeline.py); {matched:.0%} of script words matched; "
                   f"gaps > {a.max_gap}s tightened; lead {a.lead}s; end card {a.end_card}s."})
tl.setdefault("sfx", [])
tl_path.write_text(json.dumps(tl, indent=1, ensure_ascii=False))
(tl_path.parent / "words.json").write_text(json.dumps(words_out, indent=1, ensure_ascii=False))
print(f"matched {matched:.0%} · speech ends {speech_end:.2f}s · total {total}s")
for c in clips:
    print(f"{c['id']} src {c['src'][0]:6.2f}-{c['src'][1]:6.2f} at {c['at']:6.2f} {'[dark] ' if c.get('world') else ''}{c['text']}")

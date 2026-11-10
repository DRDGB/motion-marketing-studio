#!/usr/bin/env python3
"""Turn an ElevenLabs character alignment (from tts_elevenlabs.py) into per-line source ranges and words.
Usage: python3 -I words_from_alignment.py <VO.mp3.alignment.json> [--json]
Prints, per line: L01 start-end and the words with onsets (seconds in the voice file). Use start/end as
timeline `src` ranges; words become words.json entries after adding (at - src_start).
With --json prints {"lines": [{"id","src":[s,e],"text","words":[{"w","t"}]}]}.
"""
import json, sys


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    d = json.load(open(sys.argv[1], encoding="utf-8"))
    al = d.get("alignment") or d.get("normalized_alignment") or d
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    lines, cur, words, w, wst = [], [], [], "", None
    def flush_word():
        nonlocal w, wst
        if w.strip():
            words.append({"w": w.strip(), "t": round(wst, 3), "end": round(last_end, 3)})
        w, wst = "", None
    last_end = 0.0
    in_tag = False
    for c, s, e in zip(chars, st, en):
        if c == "[":
            in_tag = True; continue
        if in_tag:
            in_tag = c != "]"; continue
        if c == "\n":
            flush_word()
            if words:
                lines.append(words); words = []
            continue
        if c.isspace():
            flush_word(); continue
        if wst is None:
            wst = s
        w += c; last_end = e
    flush_word()
    if words:
        lines.append(words)
    out = []
    for i, ws in enumerate(lines, 1):
        clean = ws  # [tags] were skipped while reading characters
        out.append({"id": f"L{i:02}", "src": [round(clean[0]["t"], 3), round(clean[-1]["end"], 3)],
                    "text": " ".join(x["w"] for x in clean), "words": [{"w": x["w"], "t": x["t"]} for x in clean]})
    if "--json" in sys.argv:
        print(json.dumps({"lines": out}, ensure_ascii=False, indent=1)); return
    for l in out:
        print(f"{l['id']} {l['src'][0]:.2f}-{l['src'][1]:.2f}  " + " ".join(f"{x['w']}@{x['t']:.2f}" for x in l["words"]))


if __name__ == "__main__":
    main()

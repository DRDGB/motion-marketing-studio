#!/usr/bin/env python3
"""Captions-only / no-voice timing: give every clip a duration from its syllables (reading pace) and lay
the clips out in sequence, then write words.json. Also useful for storyboards before the voice exists.
Usage: python3 -I text_timing.py <timeline.json> <words.json> [--rate 3.4] [--gap 0.45] [--start 0.3] [--end-card 3.8]
Rewrites the timeline's clip `at`/`src` and `total`, sets "audio": false. Timing is replaced by real
voice timing later (align_words.py or words_from_alignment.py).
"""
import argparse, json, re
from pathlib import Path


def syl(w):
    w = re.sub(r"[^a-zà-ÿ]", "", w.lower())
    if not w:
        return 0.5
    n = len(re.findall(r"[aeiouyàâäéèêëîïôöùûü]+", w))
    if w.endswith("e") and n > 1 and not w.endswith("le"):
        n -= 1
    return max(1, n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("timeline"); ap.add_argument("words")
    ap.add_argument("--rate", type=float, default=3.4, help="syllables per second")
    ap.add_argument("--gap", type=float, default=0.45)
    ap.add_argument("--start", type=float, default=0.3)
    ap.add_argument("--end-card", type=float, default=3.8)
    a = ap.parse_args()
    tl = json.loads(Path(a.timeline).read_text())
    t, words = a.start, []
    for c in tl["clips"]:
        ws = re.sub(r"\[[^\]]*\]", "", c["text"]).split()
        weights = [syl(w) + (0.6 if re.search(r"[,.…:;?!]$", w) else 0) for w in ws]
        dur = max(1.2, sum(weights) / a.rate)
        c["at"] = round(t, 3); c["src"] = [round(t, 3), round(t + dur, 3)]
        acc = 0.0
        for w, wt in zip(ws, weights):
            words.append({"clip": c["id"], "w": w, "t": round(t + acc / sum(weights) * dur, 3)})
            acc += wt
        t += dur + a.gap
    tl["total"] = round(t + a.end_card, 2)
    tl["audio"] = False
    Path(a.timeline).write_text(json.dumps(tl, indent=1, ensure_ascii=False) + "\n")
    Path(a.words).write_text(json.dumps(words, indent=1, ensure_ascii=False))
    print(f"{len(tl['clips'])} clips, total {tl['total']} s, {len(words)} words")


if __name__ == "__main__":
    main()

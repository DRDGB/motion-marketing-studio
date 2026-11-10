#!/usr/bin/env python3
"""Tile review stills into one contact sheet so you can look at a whole video at once.
Usage: python3 -I contact_sheet.py <dir with s_<time>.png files> <out.png> [--cols 5] [--width 288]
Files are ordered by the number in their name (s_1.5.png, s_12.png ...).
"""
import argparse, re, subprocess, sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir"); ap.add_argument("out")
    ap.add_argument("--cols", type=int, default=5); ap.add_argument("--width", type=int, default=288)
    ap.add_argument("--pattern", default="s_*.png")
    a = ap.parse_args()
    files = sorted(Path(a.dir).glob(a.pattern), key=lambda p: float((re.findall(r"[\d.]+", p.stem.split("_")[-1]) or ["0"])[0].rstrip(".")))
    if not files:
        sys.exit("no stills found")
    w, hgt = a.width, int(a.width * 16 / 9)
    inputs = sum((["-i", str(f)] for f in files), [])
    n = len(files)
    chain = "".join(f"[{i}]scale={w}:{hgt}[v{i}];" for i in range(n))
    layout = "|".join(f"{(i % a.cols) * w}_{(i // a.cols) * hgt}" for i in range(n))
    chain += "".join(f"[v{i}]" for i in range(n)) + (f"xstack=inputs={n}:layout={layout}:fill=black" if n > 1 else "null")
    r = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", chain, a.out], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr)
    print(f"{a.out}: {n} stills: " + " ".join(f.stem for f in files))


if __name__ == "__main__":
    main()

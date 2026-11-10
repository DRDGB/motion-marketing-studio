#!/usr/bin/env python3
"""Segment a voice file on pauses and estimate syllables per segment (band-passed energy peaks).

Used to map voice segments to script lines when no speech-to-text is available. Peaks track nominal syllables
roughly 0.9-1.0 : 1 (fit the ratio over the whole take; compare ratios, not absolutes). The est.syll
column assumes 0.68 and overestimates; use the raw peaks.

Usage: python3 -I syllable_peaks.py <voice.mp3> [--noise -40] [--min-pause 0.3]
"""
import argparse, re, subprocess
import numpy as np

SR = 16000


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("voice")
    ap.add_argument("--noise", type=float, default=-40)
    ap.add_argument("--min-pause", type=float, default=0.3)
    a = ap.parse_args()
    log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.voice, "-af",
                          f"silencedetect=noise={a.noise}dB:d={a.min_pause}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.voice, "-af", "highpass=f=300,lowpass=f=2500",
                          "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    dur = len(x) / SR
    # speech segments = complement of silences
    edges, t = [], 0.0
    for s, e in zip(st, en + [dur] * (len(st) - len(en))):
        if s > t + 0.05:
            edges.append((t, s))
        t = e
    if t < dur - 0.05:
        edges.append((t, dur))
    hop = int(0.01 * SR)
    env = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, mode="same")[::hop])
    k = np.hanning(7); k /= k.sum()
    env = np.convolve(env, k, mode="same")
    for i, (s, e) in enumerate(edges, 1):
        seg = env[int(s * 100):int(e * 100)]
        if len(seg) < 3:
            continue
        thr = 0.25 * seg.max()
        peaks, last = 0, -99
        for j in range(1, len(seg) - 1):
            if seg[j] > thr and seg[j] >= seg[j - 1] and seg[j] > seg[j + 1] and j - last >= 12:
                # require a dip of 20% between consecutive peaks
                if last < 0 or seg[last:j].min() < 0.8 * min(seg[last], seg[j]):
                    peaks += 1; last = j
        print(f"s{i:<2} {s:6.2f}-{e:6.2f}  dur {e - s:5.2f}  peaks {peaks:3d}  est.syll {peaks / 0.68:5.1f}")


if __name__ == "__main__":
    main()
